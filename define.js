import { define as def } from 'xtal-element/lib/define.js';
import { propUp } from 'xtal-element/lib/propUp.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { lispToCamel } from 'trans-render/lib/lispToCamel.js';
export { camelToLisp } from 'trans-render/lib/camelToLisp.js';
export function define(args) {
    const c = args.config;
    const props = accProps(args);
    let ext = HTMLElement;
    const mixins = args.mixins;
    if (mixins !== undefined) {
        for (const mix of mixins) {
            if (typeof mix === 'function') {
                ext = mix(ext);
            }
        }
    }
    class newClass extends ext {
        attributeChangedCallback(n, ov, nv) {
            const propName = lispToCamel(n);
            const prop = props[propName];
            if (prop !== undefined) {
                if (prop.dry && ov === nv)
                    return;
                const aThis = this;
                switch (prop.type) {
                    case 'String':
                        aThis[propName] = nv;
                        break;
                    case 'Object':
                        if (prop.parse) {
                            aThis[propName] = JSON.parse(nv);
                        }
                        break;
                    case 'Number':
                        aThis[propName] = Number(nv);
                        break;
                    case 'Boolean':
                        aThis[propName] = nv !== null;
                        break;
                }
            }
        }
        connectedCallback() {
            //TODO merge attributes?
            this.attachQR();
            const defaults = { ...args.config.initPropMerge, ...args.initComplexPropMerge };
            for (const key in defaults) {
                if (props[key] === undefined) {
                    this[key] = defaults[key];
                }
            }
            propUp(this, Object.keys(props), defaults);
            this.detachQR();
            if (c.initMethod !== undefined) {
                this[c.initMethod](this);
            }
        }
        attachQR() {
            this.QR = QR;
        }
        detachQR() {
            delete this.QR;
            const propChangeQueue = this.propChangeQueue;
            const actions = c.actions;
            const actionsToDo = new Set();
            if (propChangeQueue !== undefined && actions !== undefined) {
                for (const action of actions) {
                    const { upon } = action;
                    const doAct = action.do;
                    if (upon === undefined)
                        continue;
                    if (!checkRifs(action, this))
                        continue;
                    switch (typeof upon) {
                        case 'string':
                            if (propChangeQueue.has(upon)) {
                                actionsToDo.add(doAct);
                            }
                            break;
                        case 'object':
                            for (const dependency of upon) {
                                if (typeof dependency === 'string') {
                                    if (propChangeQueue.has(dependency)) {
                                        actionsToDo.add(doAct);
                                        break;
                                    }
                                }
                            }
                            break;
                    }
                }
            }
            const values = Array.from(actionsToDo);
            for (const action of values) {
                this[action](this);
            }
            delete this.propChangeQueue;
        }
    }
    newClass.is = c.tagName;
    newClass.observedAttributes = getAttributeNames(props);
    if (mixins !== undefined) {
        const proto = newClass.prototype;
        for (const mix of mixins) {
            if (typeof mix === 'object') {
                Object.assign(proto, mix);
            }
        }
    }
    addPropsToClass(newClass, props, args);
    def(newClass);
}
function accProps(args) {
    const props = {};
    insertProps(args.config.actions, props, args);
    return props;
}
function getAttributeNames(props) {
    const returnArr = [];
    for (const key in props) {
        const prop = props[key];
        let isAttr = false;
        switch (prop.type) {
            case 'Boolean':
            case 'Number':
            case 'String':
                isAttr = true;
                break;
            case 'Object':
                isAttr = prop.parse === true;
                break;
        }
        if (isAttr) {
            returnArr.push(camelToLisp(key));
        }
    }
    return returnArr;
}
const defaultProp = {
    type: 'Object',
    dry: true,
};
function insertProps(hasUpons, props, args) {
    if (hasUpons === undefined)
        return;
    const defaults = { ...args.initComplexPropMerge, ...args.config.initPropMerge };
    for (const hasUpon of hasUpons) {
        const { upon } = hasUpon;
        switch (typeof upon) {
            case 'string':
                if (props[upon] === undefined) {
                    const prop = { ...defaultProp };
                    props[upon] = prop;
                }
                break;
            case 'object':
                if (Array.isArray(upon)) {
                    let lastProp;
                    for (const dependency of upon) {
                        switch (typeof dependency) {
                            case 'string':
                                if (props[dependency] === undefined) {
                                    const prop = { ...defaultProp };
                                    props[dependency] = prop;
                                    const defaultVal = defaults[dependency];
                                    switch (typeof defaultVal) {
                                        case 'string':
                                            prop.type = 'String';
                                            break;
                                        case 'number':
                                            prop.type = 'Number';
                                            break;
                                        case 'boolean':
                                            prop.type = 'Number';
                                            break;
                                    }
                                }
                                lastProp = props[dependency];
                                break;
                            case 'object':
                                if (lastProp !== undefined) {
                                    Object.assign(lastProp, dependency);
                                }
                                else {
                                    throw 'Syntax Error';
                                }
                                break;
                        }
                    }
                }
                else {
                    throw 'NI'; //Not Implemented
                }
        }
    }
}
function addPropsToClass(newClass, props, args) {
    const proto = newClass.prototype;
    const actions = args.config.actions;
    for (const key in props) {
        const prop = props[key];
        const privateKey = '_' + key;
        Object.defineProperty(proto, key, {
            get() {
                return this[privateKey];
            },
            set(nv) {
                const ov = this[privateKey];
                if (prop.dry && this[privateKey] === nv)
                    return;
                this[privateKey] = nv;
                if (this.QR) {
                    this.QR(key, this);
                    return;
                }
                if (actions !== undefined) {
                    const filteredActions = actions.filter(x => {
                        if (!checkRifs(x, this))
                            return false;
                        const upon = x.upon;
                        switch (typeof upon) {
                            case 'string':
                                return upon === key;
                            case 'object':
                                return upon.includes(key);
                        }
                    });
                    for (const action of filteredActions) {
                        const fn = this[action.do];
                        if (fn === undefined)
                            throw (action.do.toString() + " undefined");
                        this[action.do](this, key, ov, nv);
                    }
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}
function checkRifs(action, self) {
    const { riff, rift } = action;
    if (riff !== undefined) {
        for (const key of riff) {
            if (!self[key])
                return false;
        }
    }
    if (rift !== undefined) {
        for (const key of rift) {
            if (self[key])
                return false;
        }
    }
    return true;
}
const QR = (propName, self) => {
    if (self.propChangeQueue === undefined)
        self.propChangeQueue = new Set();
    self.propChangeQueue.add(propName);
};

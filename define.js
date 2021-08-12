import { define as def } from 'xtal-element/lib/define.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
import { propUp } from 'xtal-element/lib/propUp.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { lispToCamel } from 'trans-render/lib/lispToCamel.js';
export { html } from 'xtal-element/lib/html.js';
export { camelToLisp } from 'trans-render/lib/camelToLisp.js';
export function define(args) {
    const c = args.config;
    const props = accProps(args);
    class newClass extends HTMLElement {
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
            const defaultVals = {};
            for (const key in props) {
                const prop = props[key];
                const defaultVal = prop.default;
                if (defaultVal !== undefined) {
                    defaultVals[key] = defaultVal;
                }
            }
            propUp(this, Object.keys(props), defaultVals);
            if (c.initMethod !== undefined) {
                this[c.initMethod](this);
            }
        }
        blockReactions() {
            //[TODO]
        }
        unblockReactions() {
            //[TODO]
        }
    }
    newClass.is = c.tagName;
    newClass.observedAttributes = getAttributeNames(props);
    const mixins = args.mixins;
    if (mixins !== undefined) {
        applyMixins(newClass, mixins);
    }
    addPropsToClass(newClass, props, args);
    def(newClass);
    return newClass;
}
export function accProps(args) {
    const props = {};
    insertProps(args.config.actions, props, args);
    //insertProps(args.config.transforms, props);
    return props;
}
export function getAttributeNames(props) {
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
export function insertProps(hasUpons, props, args) {
    if (hasUpons === undefined)
        return;
    const nonSerializableDefaults = args.defaultPropVals;
    for (const hasUpon of hasUpons) {
        const upon = hasUpon.upon;
        switch (typeof upon) {
            case 'string':
                if (props[upon] === undefined) {
                    const prop = { ...defaultProp };
                    props[upon] = prop;
                    setDefVal(nonSerializableDefaults, upon, prop);
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
                                    setDefVal(nonSerializableDefaults, dependency, prop);
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
function setDefVal(defaults, key, prop) {
    const nonSerializableDefault = defaults !== undefined ? defaults[key] : undefined;
    if (nonSerializableDefault !== undefined) {
        prop.default = nonSerializableDefault;
    }
}
export function addPropsToClass(newClass, props, args) {
    const proto = newClass.prototype;
    const actions = args.config.actions;
    //const transforms = args.config.transforms;
    for (const key in props) {
        const prop = props[key];
        const privateKey = '_' + key;
        Object.defineProperty(proto, key, {
            get() {
                return this[privateKey];
            },
            set(nv) {
                if (prop.dry && this[privateKey] === nv)
                    return;
                this[privateKey] = nv;
                if (actions !== undefined) {
                    const filteredActions = actions.filter(x => {
                        // const blocking = x.blocking;
                        // if(blocking !== undefined){
                        //     for(const blocker of blocking){
                        //         if(this[blocker]) return;
                        //     }
                        // }
                        const req = x.required;
                        const upon = x.upon;
                        if (req !== undefined) {
                            let propKeys;
                            if (req === 'all') {
                                switch (typeof upon) {
                                    case 'string':
                                        propKeys = [upon];
                                        break;
                                    case 'object':
                                        propKeys = upon.filter(x => typeof x === 'string');
                                        break;
                                    default:
                                        throw 'NI';
                                }
                            }
                            else {
                                propKeys = req;
                            }
                            for (const reqProp of propKeys) {
                                if (!this[reqProp])
                                    return false;
                            }
                        }
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
                        this[action.do](this);
                    }
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}

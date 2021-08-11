import { define as def } from 'xtal-element/lib/define.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
export { html } from 'xtal-element/lib/html.js';
export function define(args) {
    const c = args.config;
    const props = accProps(args);
    class newClass extends HTMLElement {
        connectedCallback() {
            // if(args.defaultPropVals !== undefined){
            //     Object.assign(this, args.defaultPropVals);
            // }
            for (const key in props) {
                const prop = props[key];
                const defaultVal = prop.default;
                if (defaultVal !== undefined) {
                    this[key] = prop.default;
                }
            }
            if (c.initMethod !== undefined) {
                this[c.initMethod](this);
            }
        }
    }
    newClass.is = c.tagName;
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
const defaultProp = {
    type: 'Object'
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
                this[privateKey] = nv;
                if (actions !== undefined) {
                    const filteredActions = actions.filter(x => {
                        const req = x.required;
                        if (req !== undefined) {
                            for (const reqProp of req) {
                                if (!this[reqProp])
                                    return false;
                            }
                        }
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
                        this[action.do](this);
                    }
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}

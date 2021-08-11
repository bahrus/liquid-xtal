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
                const defaultVal = prop.defaultVal;
                if (defaultVal !== undefined) {
                    this[key] = prop.defaultVal;
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
                    props[upon] = { ...defaultProp };
                    const nonSerializableDefault = nonSerializableDefaults !== undefined ? nonSerializableDefaults[upon] : undefined;
                    if (nonSerializableDefault !== undefined) {
                        props[upon].defaultVal = nonSerializableDefault;
                    }
                }
                break;
            case 'object':
                if (Array.isArray(upon)) {
                    let lastProp;
                    for (const dependency of upon) {
                        switch (typeof dependency) {
                            case 'string':
                                if (props[dependency] === undefined) {
                                    props[dependency] = { ...defaultProp };
                                    const nonSerializableDefault = nonSerializableDefaults !== undefined ? nonSerializableDefaults[dependency] : undefined;
                                    if (nonSerializableDefault !== undefined) {
                                        props[dependency].defaultVal = nonSerializableDefault;
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
export function addPropsToClass(newClass, props, args) {
    const proto = newClass.prototype;
    const actions = args.config.actions;
    const transforms = args.config.transforms;
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

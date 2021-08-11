import { define as def } from 'xtal-element/lib/define.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
export { html } from 'xtal-element/lib/html.js';
export function define(args) {
    const c = args.config;
    class newClass extends HTMLElement {
        connectedCallback() {
            if (args.defaultPropVals !== undefined) {
                Object.assign(this, args.defaultPropVals);
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
    defProps(newClass, args);
    def(newClass);
    return newClass;
}
export function defProps(elementClass, args) {
    const proto = elementClass.prototype;
    const props = {};
    insertProps(args.config.actions, props);
}
export function insertProps(hasUpons, props) {
    if (hasUpons === undefined)
        return;
    for (const hasUpon of hasUpons) {
        const upon = hasUpon.upon;
        switch (typeof upon) {
            case 'string':
                if (props[upon] === undefined) {
                    props[upon] = {
                        type: 'Object'
                    };
                }
                break;
            case 'object':
                if (Array.isArray(upon)) {
                    let lastProp;
                }
                else {
                    throw 'NI'; //Not Implemented
                }
        }
    }
}

import { xc } from 'xtal-element/lib/XtalCore.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
export { html } from 'xtal-element/lib/html.js';
export function define(args) {
    const c = args.config;
    class newClass extends HTMLElement {
        connectedCallback() {
            if (args.defaultPropVals !== undefined) {
                Object.assign(this, args.defaultPropVals);
            }
            this.init(this);
        }
    }
    newClass.is = c.tagName;
    const mixins = args.mixins;
    if (mixins !== undefined) {
        applyMixins(newClass, mixins);
    }
    xc.define(newClass);
}

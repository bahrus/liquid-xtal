import { define as def } from 'xtal-element/lib/define.js';
export function define(args) {
    const c = args.configs;
    class newClass extends HTMLElement {
    }
    newClass.is = c.find(x => x.tagName !== undefined)?.tagName;
    def(newClass);
}

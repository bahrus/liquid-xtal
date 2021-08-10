import { xc } from 'xtal-element/lib/XtalCore.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
import { DefineArgs} from './types.d.js';
export {html} from 'xtal-element/lib/html.js';

export function define<T = any>(args: DefineArgs<T>){
    const c = args.config;
    class newClass extends  HTMLElement{
        static is = c.tagName;
    }
    const mixins = args.mixins;
    if(mixins !== undefined){
        applyMixins(newClass, mixins);
    }
    xc.define(newClass);
}
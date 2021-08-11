import {define as def} from 'xtal-element/lib/define.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
import { DefineArgs} from './types.d.js';
export {html} from 'xtal-element/lib/html.js';


export function define<T = any>(args: DefineArgs<T>){
    const c = args.config;
    class newClass extends  HTMLElement{
        static is = c.tagName;
        connectedCallback(){
            if(args.defaultPropVals !== undefined){
                Object.assign(this, args.defaultPropVals);
            }
            if(c.initMethod !== undefined){
                (<any>this)[c.initMethod](this);
            }
            
        }
    }
    const mixins = args.mixins;
    if(mixins !== undefined){
        applyMixins(newClass, mixins);
    }
    defProps(newClass, args);
    def(newClass);
    return newClass;
}

export function defProps<T extends HTMLElement = HTMLElement>(elementClass: {new(): T}, args: DefineArgs){
    const proto = elementClass.prototype;
    
}


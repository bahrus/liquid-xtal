import { define as def } from 'xtal-element/lib/define.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
import { DefineArgs } from './types.d.js';

export function define(args: DefineArgs){
    const c = args.configs;
    class newClass extends  HTMLElement{
        static is = c.find(x => x.tagName !== undefined)?.tagName;
    }
    def(newClass);
}
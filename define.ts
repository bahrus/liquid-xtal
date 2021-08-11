import {define as def} from 'xtal-element/lib/define.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
import { DefineArgs, HasUpon, PropInfo } from './types.d.js';
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

export function defProps<T extends HTMLElement = HTMLElement>(elementClass: {new(): T}, args: DefineArgs<T>){
    const proto = elementClass.prototype;
    const props: {[key: string]: PropInfo} = {};
    insertProps(args.config.actions, props);
}

const defaultProp: PropInfo = {
    type: 'Object'
};

export function insertProps(hasUpons: HasUpon[] | undefined, props: {[key: string]: PropInfo}){
    if(hasUpons === undefined) return;
    
    for(const hasUpon of hasUpons){
        
        const upon = hasUpon.upon;
        switch(typeof upon){
            case 'string':
                if(props[upon] === undefined){
                    props[upon] = {...defaultProp};
                }
                break;
            case 'object':
                if(Array.isArray(upon)){
                    let lastProp: PropInfo | undefined;
                    for(const dependency of upon){
                        switch(typeof dependency){
                            case 'string':
                                if(props[dependency] === undefined){
                                    props[dependency] = {...defaultProp};
                                }
                                lastProp = props[dependency];
                                break;
                            case 'object':
                                if(lastProp !== undefined){
                                    Object.assign(lastProp, dependency);
                                }else{
                                    throw 'Syntax Error';
                                }
                        }
                    }
                }else{
                    throw 'NI';//Not Implemented
                }
        }
    }
}




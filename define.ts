import {define as def} from 'xtal-element/lib/define.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
import { DefineArgs, HasUpon, PropInfo } from './types.d.js';
export {html} from 'xtal-element/lib/html.js';


export function define<T = any>(args: DefineArgs<T>){
    const c = args.config;
    const props  = accProps(args);
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
    addPropsToClass(newClass, props, args);
    def(newClass);
    return newClass;
}

export function accProps<T = any>(args: DefineArgs<T>){
    const props: {[key: string]: PropInfo} = {};
    insertProps(args.config.actions, props);
    insertProps(args.config.transforms, props);
    return props;
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

export function addPropsToClass<T extends HTMLElement = HTMLElement>(newClass: {new(): T}, props: {[key: string]: PropInfo}, args: DefineArgs){
    const proto = newClass.prototype;
    const actions = args.config.actions;
    const transforms = args.config.transforms;
    for(const key in props){
        const prop = props[key];
        const privateKey = '_' + key;
        Object.defineProperty(proto, key, {
            get(){
                return this[privateKey];
            },
            set(nv){
                this[privateKey] = nv;
                if(actions !== undefined){
                    const filteredActions = actions.filter(x => {
                        const upon = x.upon;
                        switch(typeof upon){
                            case 'string':
                                return upon === key;
                            case 'object':
                                return upon.includes(key);
                        }
                    });
                    for(const action of filteredActions){
                        this[action.do](this);
                    }
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}




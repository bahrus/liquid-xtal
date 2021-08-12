import { define as def } from 'xtal-element/lib/define.js';
import { applyMixins } from 'xtal-element/lib/applyMixins.js';
import { DefineArgs, HasUpon, PropInfo } from './types.d.js';
import { propUp } from 'xtal-element/lib/propUp.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { lispToCamel } from 'trans-render/lib/lispToCamel.js';
export { html } from 'xtal-element/lib/html.js';
export { camelToLisp } from 'trans-render/lib/camelToLisp.js';

export function define<T = any>(args: DefineArgs<T>){
    const c = args.config;
    const props  = accProps(args);
    class newClass extends  HTMLElement{
        static is = c.tagName;
        static observedAttributes = getAttributeNames(props);
        attributeChangedCallback(n: string, ov: string, nv: string){
            const propName = lispToCamel(n);
            const prop = props[propName];
            if(prop !== undefined){
                if(prop.dry && ov === nv) return;
                const aThis = this as any;
                switch(prop.type){
                    case 'String':
                        aThis[propName] = nv;
                        break;
                    case 'Object':
                        if(prop.parse){
                            aThis[propName] = JSON.parse(nv);
                        }
                        break;
                    case 'Number':
                        aThis[propName] = Number(nv);
                        break;
                    case 'Boolean':
                        aThis[propName] = nv !== null;
                        break;
                }
            }
        }
        connectedCallback(){

            const defaultVals: any = {};
            for(const key in props){
                const prop = props[key];
                const defaultVal = prop.default;
                if(defaultVal !== undefined){
                    defaultVals[key] = defaultVal;
                }
                
            }
            propUp(this, Object.keys(props), defaultVals);
            if(c.initMethod !== undefined){
                (<any>this)[c.initMethod](this);
            }
            
        }
        blockReactions(){
            //[TODO]
        }
        unblockReactions(){
            //[TODO]
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
    
    insertProps(args.config.actions, props, args);
    //insertProps(args.config.transforms, props);
    return props;
}

export function getAttributeNames(props: {[key: string]: PropInfo}){
    const returnArr: string[] = [];
    for(const key in props){
        const prop = props[key];
        let isAttr = false;
        switch(prop.type){
            case 'Boolean':
            case 'Number':
            case 'String':
                isAttr = true;
                break;
            case 'Object':
                isAttr = prop.parse === true;
                break;
        }
        if(isAttr){
            returnArr.push(camelToLisp(key));
        }
    }
    return returnArr;
}

const defaultProp: PropInfo = {
    type: 'Object'
};

export function insertProps(hasUpons: HasUpon[] | undefined, props: {[key: string]: PropInfo}, args: DefineArgs){
    if(hasUpons === undefined) return;
    const nonSerializableDefaults = args.defaultPropVals;
    for(const hasUpon of hasUpons){
        const upon = hasUpon.upon;
        switch(typeof upon){
            case 'string':
                if(props[upon] === undefined){
                    const prop: PropInfo = {...defaultProp};
                    props[upon] = prop;
                    setDefVal(nonSerializableDefaults, upon, prop);
                }
                break;
            case 'object':
                if(Array.isArray(upon)){
                    let lastProp: PropInfo | undefined;
                    for(const dependency of upon){
                        switch(typeof dependency){
                            case 'string':
                                if(props[dependency] === undefined){
                                    const prop: PropInfo = {...defaultProp};
                                    props[dependency] = prop;
                                    setDefVal(nonSerializableDefaults, dependency, prop);
                                }
                                lastProp = props[dependency];
                                break;
                            case 'object':
                                if(lastProp !== undefined){
                                    Object.assign(lastProp, dependency);
                                }else{
                                    throw 'Syntax Error';
                                }
                                break;
                            
                        }
                    }
                }else{
                    throw 'NI';//Not Implemented
                }
        }
    }
}

function setDefVal(defaults: any, key: string, prop: PropInfo){
    const nonSerializableDefault = defaults !== undefined ? defaults[key] : undefined;
    if(nonSerializableDefault !== undefined){
        prop.default = nonSerializableDefault;
    }
}

export function addPropsToClass<T extends HTMLElement = HTMLElement>(newClass: {new(): T}, props: {[key: string]: PropInfo}, args: DefineArgs){
    const proto = newClass.prototype;
    const actions = args.config.actions;
    //const transforms = args.config.transforms;
    for(const key in props){
        const prop = props[key];
        const privateKey = '_' + key;
        Object.defineProperty(proto, key, {
            get(){
                return this[privateKey];
            },
            set(nv){
                if(prop.dry && this[privateKey] === nv) return;
                this[privateKey] = nv;
                if(actions !== undefined){
                    const filteredActions = actions.filter(x => {
                        // const blocking = x.blocking;
                        // if(blocking !== undefined){
                        //     for(const blocker of blocking){
                        //         if(this[blocker]) return;
                        //     }
                        // }
                        const req = x.required;
                        const upon = x.upon;
                        if(req !== undefined){
                            let propKeys: string[] | undefined;
                            if(req === 'all'){
                                switch(typeof upon){
                                    case 'string':
                                        propKeys = [upon];
                                        break;
                                    case 'object':
                                        propKeys = upon.filter(x => typeof x === 'string') as string[];
                                        break;
                                    default:
                                        throw 'NI';
                                }
                            }else{
                                propKeys = req;
                            }
                            for(const reqProp of propKeys){
                                if(!this[reqProp]) return false;
                            }
                        }
                        
                        switch(typeof upon){
                            case 'string':
                                return upon === key;
                            case 'object':
                                return upon.includes(key);
                        }

                    });
                    for(const action of filteredActions){
                        const fn = this[action.do];
                        if(fn === undefined) throw (action.do.toString() + " undefined");
                        this[action.do](this);
                    }
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}





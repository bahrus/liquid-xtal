export interface DefineArgs<TMixin = any>{
    mixins?: {new(): Object}[];
    mainTemplate?: HTMLTemplateElement;
    /** use this only for defaults that can't be JSON serialized in config */
    defaultPropVals?: {
        [P in keyof TMixin]?: any;
    }
    config: WCConfig;
}

export interface WCConfig{
    tagName: string;
}
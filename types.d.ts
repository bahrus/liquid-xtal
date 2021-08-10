export interface DefineArgs<TMixinComposite = any>{
    mixins?: {new(): Object}[];
    mainTemplate?: HTMLTemplateElement;
    /** use this only for defaults that can't be JSON serialized in config */
    defaultPropVals?: {
        [P in keyof TMixinComposite]?: any;
    }
    config: WCConfig;
    initMethod?: keyof TMixinComposite;
}

export interface WCConfig{
    tagName: string;
}
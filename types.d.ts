export interface DefineArgs<TMixinComposite = any>{
    mixins?: {new(): Object}[];
    mainTemplate?: HTMLTemplateElement;
    /** use this only for defaults that can't be JSON serialized in config */
    defaultPropVals?: {
        [P in keyof TMixinComposite]?: any;
    }
    config: WCConfig<TMixinComposite>;
    
}

export interface WCConfig<TMixinComposite = any>{
    tagName: string;
    initMethod?: keyof TMixinComposite;
    transforms?: Transform[];
}

export interface Transform<TMixinComposite = any>{
    upon: string;
    match: {[key: string]: MatchRHS<TMixinComposite>}
}

type MatchRHS<TMixinComposite = any> = string;


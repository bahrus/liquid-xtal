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
    transforms?: Transform<TMixinComposite>[];
    actions?: Action<TMixinComposite>[];
}

export interface Transform<TMixinComposite = any>{
    upon: string | StringOrPropInfo[];
    match: {[key: string]: MatchRHS<TMixinComposite>}
}

export interface Action<TMixinComposite = any>{
    upon: keyof TMixinComposite | StringOrPropInfo[];
    do: keyof TMixinComposite;
}

export type MatchRHS<TMixinComposite = any> = string;

export interface PropInfo{
    type?: "String" | "Number" | "Boolean" | "Object";

}

export type StringOrPropInfo = string | PropInfo;


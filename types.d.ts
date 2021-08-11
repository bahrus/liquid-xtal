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
    //transforms?: Transform<TMixinComposite>[];
    actions?: Action<TMixinComposite>[];
}

export interface HasUpon<TMixinComposite = any>{
    upon: keyof TMixinComposite | StringOrPropInfo[];
    required?: (keyof TMixinComposite & string)[];
    dry?: boolean,
}

export interface Transform<TMixinComposite = any> extends HasUpon<TMixinComposite>{
    match: {[key: string]: MatchRHS<TMixinComposite>}
}

export interface Action<TMixinComposite = any> extends HasUpon<TMixinComposite>{
    do: keyof TMixinComposite;
}

export type MatchRHS<TMixinComposite = any> = string;

export interface PropInfo{
    type?: "String" | "Number" | "Boolean" | "Object";
    default?: any;
    dry?: boolean;
}

export type StringOrPropInfo<TMixinComposite = any> = keyof TMixinComposite | PropInfo;


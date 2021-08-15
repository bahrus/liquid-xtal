export interface DefineArgs<TMixinComposite = any>{
    //mixins?: {new(): Object}[];
    mixins: any[],
    mainTemplate?: HTMLTemplateElement;
    /** use this only for defaults that can't be JSON serialized in config */
    initComplexPropMerge?: Partial<TMixinComposite>;
    config: WCConfig<TMixinComposite>;
    
}

export interface WCConfig<TMixinComposite = any>{
    tagName: string;
    initMethod?: keyof TMixinComposite;
    propDef?: Partial<TMixinComposite>;
    actions?: Action<TMixinComposite>[];

}

export interface HasUpon<TMixinComposite = any>{
    upon?: keyof TMixinComposite | StringOrPropInfo[];
    /**
     * refrain if falsy
     */
    riff?: (keyof TMixinComposite & string)[];
    /**
     * refrain if truthy
     */
    rift?: (keyof TMixinComposite & string)[];
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
    //default?: any;
    dry?: boolean;
    parse?: boolean;
}

export type StringOrPropInfo<TMixinComposite = any> = keyof TMixinComposite | PropInfo | any[];

export interface HasPropChangeQueue{
    propChangeQueue: Set<string> | undefined;
    QR: undefined | ((name: string, self: HasPropChangeQueue) => void);
}
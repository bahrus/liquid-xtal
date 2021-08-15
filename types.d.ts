export interface DefineArgs<TMixinComposite = any>{
    //mixins?: {new(): Object}[];
    mixins: any[],
    mainTemplate?: HTMLTemplateElement;
    /** use this only for defaults that can't be JSON serialized in config */
    complexPropDefaults?: Partial<TMixinComposite>;
    config: WCConfig<TMixinComposite>;
    
}

export interface WCConfig<TMixinComposite = any>{
    tagName: string;
    initMethod?: keyof TMixinComposite;
    propDefaults?: Partial<TMixinComposite>;
    propInfo?: {[key in Extract<keyof TMixinComposite, string>]: PropInfo} 
    actions?: Action<TMixinComposite>[];
    notifyProps?: (keyof TMixinComposite)[];
}

export interface HasUpon<TMixinComposite = any>{
    upon?: (Extract<keyof TMixinComposite, string>)[];
    /**
     * refrain if falsy
     */
    riff?: (Extract<keyof TMixinComposite, string>)[];
    /**
     * refrain if truthy
     */
    rift?: (Extract<keyof TMixinComposite, string>)[];
    //dry?: boolean,
}

export interface Transform<TMixinComposite = any> extends HasUpon<TMixinComposite>{
    match: {[key: string]: MatchRHS<TMixinComposite>}
}

export interface Action<TMixinComposite = any> extends HasUpon<TMixinComposite>{
    do: Extract<keyof TMixinComposite, string>;
}

export type MatchRHS<TMixinComposite = any> = string;

type PropInfoTypes = "String" | "Number" | "Boolean" | "Object";
export interface PropInfo{
    type?: PropInfoTypes;
    //default?: any;
    dry?: boolean;
    parse?: boolean;
}

//export type StringOrPropInfo<TMixinComposite = any> = keyof TMixinComposite | PropInfo | any[];

export interface HasPropChangeQueue{
    propChangeQueue: Set<string> | undefined;
    QR: undefined | ((name: string, self: HasPropChangeQueue) => void);
}
export interface DefineArgs{
    mixins?: {new(): Object}[];
    mainTemplate?: HTMLTemplateElement;
    configs: WCConfig[];
}

export interface WCConfig{
    tagName?: string;

}
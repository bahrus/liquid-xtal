import { transform } from 'trans-render/lib/transform.js';

import { Action } from './types.js';

import { RenderContext } from 'trans-render/lib/types.d.js';

export { transform } from 'trans-render/lib/transform.js';



export abstract class TemplMgmtBase extends HTMLElement{
    __ctx: RenderContext | undefined;
    templInit(self: TemplMgmtBase){
        if(self.shadowRoot === null){
            self.attachShadow({mode: 'open'});
        }
        
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
        
    }

    abstract loadPlugins(self: TemplMgmtBase): void;

    doInitTransform(self: TemplMgmtBase): void{
        this.loadPlugins(self);
        transform(self.clonedTemplate as DocumentFragment, self.__ctx!);
        self.shadowRoot!.appendChild(self.clonedTemplate);
    }

    doUpdateTransform(self: TemplMgmtBase){
        this.__ctx!.match = self.updateTransform;
        transform(self.shadowRoot!, this.__ctx!);
    }

    static initConfig : Action<TemplMgmtBase>[] = [
        {
            upon: 'mainTemplate',
            do: 'templInit'
        },
        {
            upon: ['clonedTemplate', 'initTransform'],
            biff: ['clonedTemplate', 'initTransform'],
            do: 'doInitTransform'
        }
    ];

    static updateConfig: Action<TemplMgmtBase> = {
        
        biff: ['updateTransform'],
        do: 'doUpdateTransform',
    };
}

export interface TemplMgmtBase{
    mainTemplate: HTMLTemplateElement;
    clonedTemplate: Node;
    initTransform: any;
    updateTransform: any;
    
}
import { transform } from 'trans-render/lib/transform.js';

import { Action,  } from './types.js';

import { RenderContext, RenderOptions } from 'trans-render/lib/types.d.js';

export { transform } from 'trans-render/lib/transform.js';



export const TemplMgmtBaseMixin: any = (superclass: {new(): TemplMgmtBase2} )  => class TemplMgmtBase extends superclass{
    __ctx: RenderContext | undefined;
    cloneTemplate(self: TemplMgmtBase){
        if(self.shadowRoot === null && !self.noshadow){
            self.attachShadow({mode: 'open'});
        }
        
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
        
    }

    loadPlugins(self: TemplMgmtBase): void {}

    doInitTransform(self: TemplMgmtBase): void{
        this.loadPlugins(self);
        transform(self.clonedTemplate as DocumentFragment, self.__ctx!);
        const root = self.noshadow ? self : self.shadowRoot!;
        root.appendChild(self.clonedTemplate!);
        delete self.clonedTemplate;
    }

    doUpdateTransform(self: TemplMgmtBase){
        this.__ctx!.match = self.updateTransform;
        const root = self.noshadow ? self : self.shadowRoot!;
        transform(root, this.__ctx!);
    }


}

interface TemplMgmtBase extends TemplMgmtBase2{}

export const  doInitTransform : Action<TemplMgmtBase>[] = [
    {
        upon: ['mainTemplate', 'noshadow'],
        do: 'cloneTemplate'
    },
    {
        upon: ['clonedTemplate', 'initTransform'],
        riff: ['clonedTemplate', 'initTransform'],
        do: 'doInitTransform'
    }
];

export const doUpdateTransform: Action<TemplMgmtBase> = {
    
    riff: ['updateTransform'],
    do: 'doUpdateTransform',
};

export interface TemplMgmtBase2 extends HTMLElement{
    mainTemplate: HTMLTemplateElement;
    clonedTemplate: Node | undefined;
    initTransform: any;
    updateTransform: any;
    noshadow: boolean;
    renderOptions: RenderOptions;
}
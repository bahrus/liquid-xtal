import {transform} from 'trans-render/lib/transform.js';
import {PE} from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import { RenderContext } from 'trans-render/lib/types.d.js';

export class TemplateManager extends HTMLElement{
    __ctx: RenderContext | undefined;
    templInit(self: TemplateManager){
        if(self.shadowRoot === null){
            self.attachShadow({mode: 'open'});
        }
        
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
        
    }

    doInitTransform(self: TemplateManager){
        if(self.initTransform !== undefined){
            self.__ctx = {
                match: self.initTransform,
                host: self,
                postMatch: [
                    {
                        rhsType: Array,
                        rhsHeadType: Object,
                        ctor: PE
                    },
                    {
                        rhsType: Array,
                        rhsHeadType: String,
                        ctor: SplitText
                    }
                ],
            };
            transform(self.clonedTemplate as DocumentFragment, self.__ctx);
        }
        self.shadowRoot!.appendChild(self.clonedTemplate);
        console.log(self.initTransform);
    }

    doUpdateTransform(self: TemplateManager){
        this.__ctx!.match = self.updateTransform;
        transform(self.shadowRoot!, this.__ctx!);
    }
}

export interface TemplateManager{
    mainTemplate: HTMLTemplateElement;
    clonedTemplate: Node;
    initTransform: any;
    updateTransform: any;
}
import {transform} from 'trans-render/lib/transform.js';
import {PE} from 'trans-render/lib/PE.js';
import { RenderContext } from 'trans-render/lib/types.d.js';

export class TemplateManager extends HTMLElement{
    __ctx: RenderContext | undefined;
    init(self: TemplateManager){
        self.attachShadow({mode: 'open'});
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
        
    }

    initClonedTempl(self: TemplateManager){
        if(self.initTransform !== undefined){
            self.__ctx = {
                match: self.initTransform,
                host: self,
                postMatch: [{
                    rhsType: Array,
                    rhsHeadType: Object,
                    ctor: PE
                }],
            };
            transform(self.clonedTemplate as DocumentFragment, self.__ctx);
        }
        self.shadowRoot!.appendChild(self.clonedTemplate);
        console.log(self.initTransform);
    }
}

export interface TemplateManager{
    mainTemplate: HTMLTemplateElement;
    clonedTemplate: Node;
    initTransform: any;
}
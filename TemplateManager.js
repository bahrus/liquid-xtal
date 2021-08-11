import { transform } from 'trans-render/lib/transform.js';
import { PE } from 'trans-render/lib/PE.js';
export class TemplateManager extends HTMLElement {
    init(self) {
        self.attachShadow({ mode: 'open' });
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
    }
    initClonedTempl(self) {
        if (self.initTransform !== undefined) {
            self.__ctx = {
                match: self.initTransform,
                host: self,
                postMatch: [{
                        rhsType: Array,
                        rhsHeadType: Object,
                        ctor: PE
                    }],
            };
            transform(self.clonedTemplate, self.__ctx);
        }
        self.shadowRoot.appendChild(self.clonedTemplate);
        console.log(self.initTransform);
    }
}

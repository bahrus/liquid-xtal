import { transform } from 'trans-render/lib/transform.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
export class TemplateManager extends HTMLElement {
    templInit(self) {
        if (self.shadowRoot === null) {
            self.attachShadow({ mode: 'open' });
        }
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
    }
    doInitTransform(self) {
        if (self.initTransform !== undefined) {
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
            transform(self.clonedTemplate, self.__ctx);
        }
        self.shadowRoot.appendChild(self.clonedTemplate);
        console.log(self.initTransform);
    }
    doUpdateTransform(self) {
        this.__ctx.match = self.updateTransform;
        transform(self.shadowRoot, this.__ctx);
    }
}

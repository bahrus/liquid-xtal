import { TemplMgmtBase } from './TemplMgmtBase.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
export { define, html } from './define.js';
export class TemplMgmt extends TemplMgmtBase {
    loadPlugins(self) {
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
            options: self.renderOptions,
        };
    }
    doInitTransform(self) {
        super.doInitTransform(self);
    }
    doUpdateTransform(self) {
        super.doUpdateTransform(self);
    }
    cloneTemplate(self) {
        super.cloneTemplate(self);
    }
}

import { TemplMgmtBaseMixin } from './TemplMgmtBase.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
export { define } from './define.js';
export { html } from 'xtal-element/lib/html.js';
export { doInitTransform, doUpdateTransform } from './TemplMgmtBase.js';
export const TemplMgmtMixin = (superclass) => class TemplMgmt extends TemplMgmtBaseMixin(superclass) {
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
};

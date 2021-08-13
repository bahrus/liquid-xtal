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
    BF7Uef8Chxn9FRxQ(self) {
        super.BF7Uef8Chxn9FRxQ(self);
    }
    EkRpFHI6U0iNctt0kOM(self) {
        super.EkRpFHI6U0iNctt0kOM(self);
    }
    qHHrvPmMyE2mcufi1fpfZQ(self) {
        super.qHHrvPmMyE2mcufi1fpfZQ(self);
    }
}

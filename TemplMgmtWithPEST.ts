import {TemplMgmtBase, transform} from './TemplMgmtBase.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
export { define, html } from './define.js';

export class TemplMgmt extends TemplMgmtBase{

    loadPlugins(self: TemplMgmtBase){
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
    BF7Uef8Chxn9FRxQ(self: TemplMgmtBase){
        super.BF7Uef8Chxn9FRxQ(self);
    }

    EkRpFHI6U0iNctt0kOM(self: TemplMgmtBase){
        super.EkRpFHI6U0iNctt0kOM(self);
    }

    qHHrvPmMyE2mcufi1fpfZQ(self: TemplMgmtBase){
        super.qHHrvPmMyE2mcufi1fpfZQ(self);
    }
}
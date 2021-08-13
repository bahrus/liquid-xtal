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
        };
    }
    doInitTransform(self: TemplMgmtBase){
        super.doInitTransform(self);
    }

    doUpdateTransform(self: TemplMgmtBase){
        super.doUpdateTransform(self);
    }

    templInit(self: TemplMgmtBase){
        super.templInit(self);
    }
}
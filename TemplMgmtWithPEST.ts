import { TemplMgmtBaseMixin } from './TemplMgmtBase.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import { define} from './define.js';
import { html } from 'xtal-element/lib/html.js';
import {doInitTransform, doUpdateTransform, } from './TemplMgmtBase.js'; 

export { TemplMgmtBase }  from './TemplMgmtBase.js'; 

const TemplMgmtMixin = (superclass: any) => class TemplMgmt extends TemplMgmtBaseMixin(superclass){
    loadPlugins(self: TemplMgmt){
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
}

export const tm = {
    doInitTransform,
    doUpdateTransform,
    define,
    html,
    TemplMgmtMixin
};
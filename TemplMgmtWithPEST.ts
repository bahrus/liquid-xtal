import {TemplMgmtBase, TemplMgmtBaseMixin, transform} from './TemplMgmtBase.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
export { define} from './define.js';
export { html } from 'xtal-element/lib/html.js';
export {TemplMgmtBase, doInitTransform, doUpdateTransform} from './TemplMgmtBase.js'; 

export const TemplMgmtMixin: any = (superclass: any) => class TemplMgmt extends TemplMgmtBaseMixin(superclass){

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
    //static Mixins: any = [TemplMgmtBase, TemplMgmt];
}
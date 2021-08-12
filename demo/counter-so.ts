import {TemplMgmt, define, html} from '../TemplMgmt.js';

export interface CounterSo extends TemplMgmt {
    count: number;
}



const mainTemplate = html`
<button part=down data-d=-1>-</button><span part=count></span><button part=up data-d=1>+</button>
<style>
    * {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }
</style>
`;

define<CounterSo>({
    config:  {
        tagName:'test-one',
        actions: [
            TemplMgmt.initConfig,
            {
                upon: ['clonedTemplate', 
                    'initTransform', {
                        default: {
                            buttonElements: [{}, {click:['changeCount', 'dataset.d', 'parseInt']}]
                        }
                    }
                ],
                biff: ['clonedTemplate', 'initTransform'],
                do: 'doInitTransform'
            },
            {
                upon: [
                    'count', {
                        type: 'Number',
                        default: 30
                    }, 
                    'updateTransform', {
                        default: {
                            "countParts": ["count"]
                        }
                    }
                ],
                biff: ['updateTransform'],
                do: 'doUpdateTransform',
            }
        ],
    },
    defaultPropVals:{
        mainTemplate: mainTemplate
    },
    mixins: [TemplMgmt, {
        changeCount: (self: CounterSo, d: number, e: Event) => self.count += d,
    }],

});
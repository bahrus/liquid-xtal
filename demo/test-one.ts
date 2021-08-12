import {TemplMgmt, define, html} from '../TemplMgmt.js';

export class CounterSo{

    changeCount(delta: number){
        this.count += delta;
    }
}

export interface CounterSo {
    count: number;
}



export interface CounterSo extends TemplMgmt{}


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
            {
                upon: 'mainTemplate',
                do: 'templInit'
            },
            {
                upon: ['clonedTemplate', 
                    'initTransform', {
                        type: 'Object',
                        default: {
                            buttonElements: [{}, {click:['changeCount', 'dataset.d', 'parseInt']}]
                        }
                    }
                ],
                required: 'all',
                do: 'doInitTransform'
            },
            {
                upon: [
                    'count', {
                        type: 'Number',
                        default: 30
                    }, 
                    'updateTransform', {
                        type: 'Object',
                        default: {
                            "countParts": ["count"]
                        }
                    }
                ],
                required: ['updateTransform'],
                do: 'doUpdateTransform',
            }
        ],
    },
    defaultPropVals:{
        mainTemplate: mainTemplate
    },
    mixins: [TemplMgmt, CounterSo],

});
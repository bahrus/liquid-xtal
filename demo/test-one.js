import { define, html } from '../define.js';
import { TemplateManager } from '../TemplateManager.js';
export class CounterSo {
    changeCount(delta) {
        this.count += delta;
    }
}
const mainTemplate = html `
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
define({
    config: {
        tagName: 'test-one',
        actions: [
            {
                upon: 'mainTemplate',
                do: 'init'
            },
            {
                upon: ['clonedTemplate', 'initTransform', {
                        type: 'Object',
                        default: {
                            buttonElements: [{}, { click: ['changeCount', 'dataset.d', 'parseInt'] }]
                        }
                    }],
                required: ['clonedTemplate', 'initTransform'],
                do: 'initClonedTempl'
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
    defaultPropVals: {
        mainTemplate: mainTemplate
    },
    mixins: [TemplateManager, CounterSo],
});

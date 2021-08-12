import { TemplMgmt, define, html } from '../TemplMgmt.js';
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
            TemplMgmt.initConfig,
            {
                upon: ['clonedTemplate', 'initTransform', [
                        { buttonElements: [{}, { click: ['changeCount', 'dataset.d', 'parseInt'] }]
                        }
                    ]],
                biff: ['clonedTemplate', 'initTransform'],
                do: 'doInitTransform'
            },
            {
                upon: [
                    'count', [30],
                    'updateTransform', [{
                            "countParts": ["count"]
                        }]
                ],
                biff: ['updateTransform'],
                do: 'doUpdateTransform',
            }
        ],
    },
    defaultPropVals: {
        mainTemplate: mainTemplate
    },
    mixins: [TemplMgmt, {
            changeCount: (self, d, e) => self.count += d,
        }],
});

# liquid-xtal

```TypeScript
import {TemplMgmt, define, html} from 'liquid-xtal/TemplMgmt.js';

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
    //config should be JSON serialiable, importable via JSON import
    config:  {
        tagName:'test-one',
        initPropMerge:{
            initTransform: {
                buttonElements: [{}, {click:['changeCount', 'dataset.d', 'parseInt']}]
            },
            updateTransform: {
                "countParts": ["count"]
            },
            count: 30
        },
        actions: [
            ...TemplMgmt.initConfig,
            {
                upon: ['count', 'updateTransform'],
                ...TemplMgmt.updateConfig
            }
        ],
    },
    //This is where non serializable stuff goes
    initComplexPropMerge:{
        mainTemplate: mainTemplate
    },
    mixins: [TemplMgmt, {
        changeCount: (self: CounterSo, d: number, e: Event) => self.count += d,
    }],
});
```

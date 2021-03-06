import { tm } from '../TemplMgmtWithPEST.js';
const mainTemplate = tm.html `
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
tm.define({
    //config should be JSON serializable, importable via JSON import
    config: {
        tagName: 'counter-so',
        propDefaults: {
            initTransform: {
                buttonElements: [{}, { click: ['changeCount', 'dataset.d', 'parseInt'] }]
            },
            updateTransform: {
                "countParts": ["count"]
            },
            count: 30,
            renderOptions: {
                cacheQueries: true,
            },
        },
        actions: [
            ...tm.doInitTransform,
            {
                upon: ['count', 'updateTransform'],
                ...tm.doUpdateTransform
            }
        ],
    },
    //This is where non serializable stuff goes
    complexPropDefaults: {
        mainTemplate: mainTemplate
    },
    mixins: [tm.TemplMgmtMixin, {
            changeCount: (self, d, e) => self.count += d,
        }],
});

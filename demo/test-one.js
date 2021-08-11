import { define, html } from '../define.js';
export class CounterSo {
    changeCount(delta) {
        this.count += delta;
    }
}
export class TemplateManager extends HTMLElement {
    init(self) {
        self.attachShadow({ mode: 'open' });
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
    }
    initTransform(self) {
        self.shadowRoot.appendChild(self.clonedTemplate);
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
                upon: 'clonedTemplate',
                do: 'initTransform'
            }
        ],
    },
    defaultPropVals: {
        mainTemplate: mainTemplate
    },
    mixins: [TemplateManager, CounterSo],
});

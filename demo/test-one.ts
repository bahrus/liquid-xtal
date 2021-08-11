import {define, html} from '../define.js';

export class CounterSo{

    changeCount(delta: number){
        this.count += delta;
    }
}

export interface CounterSo {
    count: number;
}

export class TemplateManager extends HTMLElement{
    init(self: TemplateManager){
        self.attachShadow({mode: 'open'});
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
        
    }

    initClonedTempl(self: TemplateManager){
        self.shadowRoot!.appendChild(self.clonedTemplate);
        console.log(self.initTransform);
    }
}

export interface TemplateManager{
    mainTemplate: HTMLTemplateElement;
    clonedTemplate: Node;
    initTransform: any;
}

export interface CounterSo extends TemplateManager{}


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
                do: 'init'
            },
            {
                upon: ['clonedTemplate', 'initTransform', {
                    type: 'Object',
                    defaultVal: {
                        buttonElements: [{}, {click:['changeCount', 'dataset.d', 'parseInt']}]
                    }
                }],
                do: 'initClonedTempl'
            }
        ],
    },
    defaultPropVals:{
        mainTemplate: mainTemplate
    },
    mixins: [TemplateManager, CounterSo],

});
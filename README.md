# liquid-xtal

```TypeScript
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
const counterSoWCConfig = {
    "tagName": "counter-so",
    "transforms": [
        {
            "upon": ["domCache", "count"],
            "match":{
                "countPart": "${host.count}"
            }
        },
        {
            "upon": ["domCache"],
            "match: {
                "buttonElements":  [{}, {"click": ["${host.changeCount}", "dataset.d", "${parseInt}"]}]
            }
        }
    ],
    "props":{
        "domCache":{
            "type": "Object"
        },
        "count":{
            "type": "Number"
        }
    }
};



export class CounterSo{

    changeCount(delta: number){
        this.count += delta;
    }


}

define(CounterSo, mainTemplate, counterSoWCConfig);
```

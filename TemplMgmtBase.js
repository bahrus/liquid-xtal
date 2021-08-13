import { transform } from 'trans-render/lib/transform.js';
export { transform } from 'trans-render/lib/transform.js';
export class TemplMgmtBase extends HTMLElement {
    templInit(self) {
        if (self.shadowRoot === null) {
            self.attachShadow({ mode: 'open' });
        }
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
    }
    doUpdateTransform(self) {
        this.__ctx.match = self.updateTransform;
        transform(self.shadowRoot, this.__ctx);
    }
}
TemplMgmtBase.initConfig = [
    {
        upon: 'mainTemplate',
        do: 'templInit'
    },
    {
        upon: ['clonedTemplate', 'initTransform'],
        biff: ['clonedTemplate', 'initTransform'],
        do: 'doInitTransform'
    }
];
TemplMgmtBase.updateConfig = {
    biff: ['updateTransform'],
    do: 'doUpdateTransform',
};

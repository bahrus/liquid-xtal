import { transform } from 'trans-render/lib/transform.js';
export { transform } from 'trans-render/lib/transform.js';
export class TemplMgmtBase extends HTMLElement {
    cloneTemplate(self) {
        if (self.shadowRoot === null && !self.noshadow) {
            self.attachShadow({ mode: 'open' });
        }
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
    }
    doInitTransform(self) {
        this.loadPlugins(self);
        transform(self.clonedTemplate, self.__ctx);
        const root = self.noshadow ? self : self.shadowRoot;
        root.appendChild(self.clonedTemplate);
        delete self.clonedTemplate;
    }
    doUpdateTransform(self) {
        this.__ctx.match = self.updateTransform;
        const root = self.noshadow ? self : self.shadowRoot;
        transform(root, this.__ctx);
    }
}
TemplMgmtBase.doInitTransform = [
    {
        upon: ['mainTemplate', 'noshadow'],
        do: 'cloneTemplate'
    },
    {
        upon: ['clonedTemplate', 'initTransform'],
        riff: ['clonedTemplate', 'initTransform'],
        do: 'doInitTransform'
    }
];
TemplMgmtBase.doUpdateTransform = {
    riff: ['updateTransform'],
    do: 'doUpdateTransform',
};

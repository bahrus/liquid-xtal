import { transform } from 'trans-render/lib/transform.js';
export { transform } from 'trans-render/lib/transform.js';
export class TemplMgmtBase extends HTMLElement {
    qHHrvPmMyE2mcufi1fpfZQ(self) {
        if (self.shadowRoot === null && !self.noshadow) {
            self.attachShadow({ mode: 'open' });
        }
        self.clonedTemplate = self.mainTemplate.content.cloneNode(true);
    }
    //do init transform
    BF7Uef8Chxn9FRxQ(self) {
        this.loadPlugins(self);
        transform(self.clonedTemplate, self.__ctx);
        const root = self.noshadow ? self : self.shadowRoot;
        root.appendChild(self.clonedTemplate);
    }
    //do update transform
    EkRpFHI6U0iNctt0kOM(self) {
        this.__ctx.match = self.updateTransform;
        const root = self.noshadow ? self : self.shadowRoot;
        transform(root, this.__ctx);
    }
}
TemplMgmtBase.doInitTransform = [
    {
        upon: ['mainTemplate', 'noshadow'],
        do: 'qHHrvPmMyE2mcufi1fpfZQ'
    },
    {
        upon: ['clonedTemplate', 'initTransform'],
        biff: ['clonedTemplate', 'initTransform'],
        do: 'BF7Uef8Chxn9FRxQ'
    }
];
TemplMgmtBase.doUpdateTransform = {
    biff: ['updateTransform'],
    do: 'EkRpFHI6U0iNctt0kOM',
};

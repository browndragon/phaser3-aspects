import Base from './base';
import {node} from './children';

export default class Multi extends Base {
    constructor(context, aspectClass, innerMap) {
        super(context, aspectClass);
        this.innerMap = innerMap;
    }

    innerBind(sprite, name, value) {
        const inner = this.innerMap.get(name);
        console.assert(inner);
        return inner.bind(sprite, value);
    }
    innerRemove(name) {
        const previous = this.innerMap.get(name);
        if (previous) {
            previous.visit((node) => {
                for (let aspect of node.aspects) {
                    node.unbind(aspect);
                }
            });
        }
    }
    innerReplace(name, aspectClass) {
        this.innerRemove(name);
        this.innerMap.set(name, node(this /* as context */, name, aspectClass));
    }

    visit(cb) {
        super.visit(cb);
        for (let inner of this.innerMap.values()) {
            inner.visit(cb);
        }
    }
}

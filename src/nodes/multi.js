import Base from './base';

export default class Multi extends Base {
    constructor(scene, aspectClass, key, innerMap) {
        super(scene, aspectClass, key);
        this.innerMap = innerMap;
    }
    get innerNames() {
        return this.innerMap.keys();
    }
    innerNamed(name) {
        return this.innerMap.get(name);
    }
    bindInner(sprite, name, value) {
        const inner = this.innerMap.get(name);
        console.assert(inner);
        return inner.bind(sprite, value);
    }
    dereference(_aspect, _name) {
        throw 'unimplemented';
    }
    unbind(aspect) {
        for (let [name, inner] of this.innerMap) {
            inner.unbind(this.dereference(aspect, name));
            aspect[name] = undefined;
        }
        return super.unbind(aspect);
    }
    visit(cb) {
        for (let inner of this.innerMap.values()) {
            inner.visit(cb);
        }
        return super.visit(cb);
    }
}

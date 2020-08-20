import children from './children';
import Multi from './multi';

// Like a struct, but treats the sprite itself as the aspect.
// As a result, it doesn't have an aspect of its own.
export default class Root extends Multi {
    static of(scene, module) {
        let context = {scene};
        return new Root(context, children(context, module));
    }
    constructor(context, innerMap) {
        super(context, null, innerMap);
    }
    dereference(sprite, name) {
        return sprite[name];
    }
    bind(sprite, config) {
        for (let [name, value] of Object.entries(config)) {
            sprite[name] = this.innerBind(sprite, name, value);
        }
    }
    unbind(sprite) {
        for (let [name, inner] of this.innerMap) {
            inner.unbind(this.dereference(sprite, name));
            sprite[name] = undefined;
        }
    }
    visit(cb) {
        for (let inner of this.innerMap.values()) {
            inner.visit(cb);
        }
    }
}
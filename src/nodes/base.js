import Context from '../context';

export default class Base {
    constructor({key=undefined, path=undefined, scene}, aspectClass=undefined) {
        console.assert(scene);
        this.scene = scene;
        this.key = key;
        this.path = path;
        this.aspect = aspectClass;

        // Private user payload. Only available to this aspect.
        this.data = {};
    }

    bind(_sprite, _config) {
        throw 'unimplemented';
    }
    unbind(aspect) {
        aspect.destructor();
    }
    visit(cb) {
        return cb(this);
    }

    get context() {
        return this[C] || (this[C] = Context(this));
    }
    get innerNames() {
        return [];
    }
}

const C = Symbol('Context');
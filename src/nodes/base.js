import Context from '../context';

export default class Base {
    constructor(
        {
            config=undefined,
            key=undefined,
            path=undefined,
            scene
        },
        aspectClass=undefined
    ) {
        this.config = config;
        this.key = key;
        this.path = path;
        console.assert(scene);
        this.scene = scene;

        // The aspect represented by this node. Special nodes include root (has no aspect) and
        // data (implemented without an aspect, since it just returns).
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
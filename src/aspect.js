// Note this is extended in index with additional methods Struct, Union, Resource, Group, and Scene.
export default class Aspect {
    constructor(
        context,
        object,
        config,
    ) {
        this[X] = context;
        this[O] = object;
        this[C] = config;
        for (let [key, value] of Object.entries(config)) {
            this[key] = value;
        }
    }

    // Called on scene stage (assuming registered before).
    static init(_context, _data) {}

    // Called on scene stage (assuming registered before).
    static preload(_context) {}

    // Called on scene stage (assuming registered before).
    static create(_context, _data) {}

    // Called on scene stage (assuming registered before).
    // If this returns truthy, every member of the group will be invoked with that value.
    // Falsey, they will not be invoked.
    static update(_context, _time, _delta) {
        return undefined;
    }
    // See static update; called on each aspect instance with the update return.
    update(_fromStatic) {
        throw 'unimplemented';
    }

    get context() {
        return this[X];
    }
    // Convenience: More than anything else on the context, this is likely to be used.
    get scene() {
        return this[X].scene;
    }
    get object() {
        return this[O];
    }
    // This is the *object's* config (that is, the parameter to bind). The Aspect.Resource config, if any, is available in `this.context.config`.
    get config() {
        return this[C];
    }

    // Called on aspect destruction via `unbind`.
    destructor() {
        this[X] = undefined;
        this[O] = undefined;
        this[C] = undefined;
    }
}

const X = Symbol('Context');
const O = Symbol('Object');
const C = Symbol('Config');

import Group from './group';

// Implicitly, a GameObject Aspect.
export default class Aspect {
    static get key() {
        throw 'unimplemented';
    }
    static get Group() {
        return Group;
    }
    static construct(group, object, ...params) {
        return object && new this(group, object, ...params);
    }
    // Called on join group (every time). Treat as opaque.
    constructor(group, object) {
        this[G] = group;
        this[O] = object;
    }

    // Called on scene stage (assuming registered before).
    static init(group, data) {
        const key = this.key;
        if (key) {
            group.scene[this.key] = group;            
        }
    }
    // Called on scene stage (assuming registered before).
    static preload(group) {}
    // Called on scene stage (assuming registered before).
    static create(group, data) {}
    // Called on scene stage (assuming registered before).
    // If this returns truthy, every member of the group will be invoked with that value.
    // Falsy, they will not be invoked.
    static update(group, time, delta) {
        return undefined;
    }
    // See static update.
    update(fromStatic) {
        throw 'unimplemented';
    }

    get group() {
        return this[G];
    }
    get sprite() {
        return this[O];
    }

    // Called on exit group (every time).
    destructor() {
        this[O] = undefined;
    }
}

const G = Symbol('Group');
const O = Symbol('Object');

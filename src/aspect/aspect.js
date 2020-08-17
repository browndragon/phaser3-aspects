import Group from './group';

class BaseAspect {
    static get key() {
        throw 'unimplemented';
    }
    static get(object) {
        return object[this.key];
    }
    constructor(object) {
        this[O] = object;
    }
    destructor() {
        delete this[O][this.key];
        this[O] = undefined;
    }
    // Add all the other methods you need here...
}

// Implicitly, a GameObject Aspect.
export default class Aspect extends BaseAspect {
    static newGroup(...groupParams) {
        return new this.Group(this, ...groupParams);
    }

    get sprite() {
        return this[O];
    }

    static init(group, data) {}
    static preload(group) {}
    static create(group, data) {}
    static update(group, time, delta) {
        return undefined;
    }
    update(fromStatic) {
        throw 'unimplemented';
    }
}
Aspect.Group = Group;

const O = Symbol('Object');

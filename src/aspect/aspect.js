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
Aspect.Group = class extends Group {
    constructor(aspectClass, ...params) {
        super(...params);
        this.aspect = aspectClass;
    }
    addAspect(child) {
        console.assert(!child[this.aspect.key]);
        let aspect = new this.aspect(child);
        if (aspect) {
            child[this.aspect.key] = aspect;
        }
        return aspect;
    }
    removeAspect(child) {
        let aspect = child && child[this.aspect.key];
        if (!aspect) {
            return;
        }
        aspect.destructor();
    }
    init(data) {
        this.aspect.init(this, data);
    }
    preload() {
        this.aspect.preload(this);
    }
    create(data) {
        this.aspect.create(this, data);
    }
    update(time, delta) {
        let result = this.aspect.update(this, time, delta);
        if (!result) {
            return;
        }
        for (let child of this.getChildren()) {
            child[this.aspect.key].update(result);
        }
    }
}

const O = Symbol('Object');

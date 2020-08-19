import Aspect from './aspect';
import Group from './group';

/** This is really a metaclass. Use `of` to feed it a module and make it instantiable. */
const calledFromBundleOf = Symbol('CalledFromOf');
export default class Bundle extends Group {
    static of(module) {
        return class extends this {
            constructor(bundleKey, bundleClass, ...params) {
                super(calledFromBundleOf, bundleKey, bundleClass, module, ...params);
            }
        };
    }

    static get Sub() {
        return Sub;
    }

    constructor(callGuard, bundleKey, bundleClass, module, ...params) {
        console.assert(callGuard == calledFromBundleOf);
        super(bundleKey, bundleClass, ...params);
        this.subs = {};
        const Sub = this.constructor.Sub;
        for (let [name, clazz] of Object.entries(module)) {
            this.subs[name] = new Sub(this, name, clazz, ...params);
        }
    }

    config(object) {
        return this.key && object && object.config && object.config[this.key];
    }

    constructSubAspect(object, subname, subconfig, ...params) {
        if (!subconfig) {
            return undefined;
        }
        const sub = this.subs[subname] || this.subs.default;
        if (!sub) {
            return undefined;
        }
        return sub.constructAspect(object, subconfig, ...params);
    }

    subsEntries() {
        return Object.entries(this.subs);
    }

    removeAspect(child) {
        for (let [name, sub] of this.subsEntries()) {
            sub.remove(child);
        }
        return super.removeAspect(child);
    }

    initScene(data) {
        for (let [name, sub] of this.subsEntries()) {
            sub.initScene(data);
        }
        super.initScene(data);
    }
    preloadScene() {
        for (let [name, sub] of this.subsEntries()) {
            sub.preloadScene();
        }
        super.preloadScene();
    }
    createScene(data) {
        for (let [name, sub] of this.subsEntries()) {
            sub.createScene(data);
        }
        super.createScene(data);
    }
    updateScene(time, delta) {
        for (let [name, sub] of this.subsEntries()) {
            sub.updateScene(time, delta);
        }
        super.updateScene(time, delta);
    }
};

class Sub extends Group {
    constructor(outer, name, aspect, ...params) {
        super(name, aspect, ...params);
        this.outer = outer;
    }
    // config(object) {
    //     const config = this.outer.config(object);
    //     return config && config[this.key];
    // }
    // constructAspect(child, ...params) {
    //     let config = this.config(child);
    //     if (!config) {
    //         return undefined;
    //     }
    //     return super.constructAspect(child, config, ...params);
    // }
    backlinkAspect() {
        throw 'Invalid';
    }
    // I'm not super meaningful to call directly on algebraic types.
    add(child, addToScene) {
        this.outer.add(child);
        return this;
    }
    removeAspect() {
        throw 'Must be overridden';
    }
};
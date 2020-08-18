import Aspect from './aspect';
import Group from './group';

/** This is really a metaclass. Use `of` to feed it a module and make it instantiable. */
const calledFromOf = Symbol('CalledFromOf');
export default class Bundle extends Group {
    static of(module) {
        return class extends this {
            constructor(bundleClass, ...params) {
                super(calledFromOf, bundleClass, module, ...params);
            }
        };
    }
    static get Sub() {
        return class extends Group {
            constructor(outer, name, aspect, ...params) {
                super(aspect, ...params);
                this.aspect = aspect;
                this.innerName = name;
                this.outer = outer;
            }
            constructAspect(child, ...params) {
                return this.aspect.construct(this, child, ...params);
            }
            backlinkAspect(aspect) {
                throw 'not meaningful';
            }
        };
    }

    constructor(calledFrom, bundleClass, module, ...params) {
        console.assert(calledFrom == calledFromOf);
        super(bundleClass, ...params);
        this.subs = {};
        const Sub = this.constructor.Sub;
        for (let [name, clazz] of Object.entries(module)) {
            this.subs[name] = new Sub(this, name, clazz, ...params);
        }
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

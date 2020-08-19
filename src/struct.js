import Aspect from './aspect';
import Bundle from './bundle';

export const AllStructEntries = Symbol('AllStructEntries');

export default class Struct extends Aspect {
    constructor(group, object, struct) {
        super(group, object);
        this[AllStructEntries] = struct;
        for (let [key, value] of struct) {
            this[key] = value;
        }
    }
    static of(module) {
        class Group extends StructG.of(module) {};
        return class extends this {
            static get Group() {
                return Group;
            }
        };
    }
}
class Sub extends Bundle.Sub {
    getAspect(child) {
        let outer = this.outer.getAspect(child);
        if (!outer) {
            return undefined;
        }
        return outer[this.innerName];
    }
    unlinkAspect(aspect) {
        if (!aspect) {
            return;
        }
        let outer = this.outer.getAspect(aspect.sprite);
        if (!outer) {
            return;
        }
        outer[this.innerName] = undefined;
        aspect.destructor();
    }
};
class StructG extends Bundle {
    static get Sub() {
        return Sub;
    }
    static constructAspect(object, ...params) {
        if (!object) {
            return undefined;
        }
        const config = this.config(object);
        if (!config) {
            return undefined;
        }
        let struct = {};
        for (let [name, entry] of Object.entries(config)) {
            let aspect = this.constructSubAspect(object, name, entry);
            console.assert(aspect);
            struct[name] = aspect;
            sub.rawAdd(object, false);
        }
        return new this(group, child, struct);
    }
};

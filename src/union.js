import Aspect from './aspect';
import Bundle from './bundle';

export default class Union extends Aspect {
    static of(module) {
        class Group extends UnionG.of(module) {};
        return class extends this {
            static get Group() {
                return Group;
            }
        };
    }
    static construct() {
        throw 'Overridden in `of`';
    }
}
class Sub extends Bundle.Sub {
    unlinkAspect(aspect) {
        this.outer.unlinkAspect(aspect);
    }
}
class UnionG extends Bundle {
    static get Sub() {
        return Sub;
    }
    constructAspect(child, ...params) {
        console.assert(child);
        let config = this.config(child);
        console.assert(config);
        let entries = Object.entries(config);
        console.assert(entries.length == 1);
        for (let [name, subconfig] of entries) {
            let subAspect = this.constructSubAspect(child, name, subconfig, ...params);
            console.assert(subAspect);
            return subAspect;
        }
    }
    getAspect(child) {
        return child && child[this[A].key];
    }
    unlinkAspect(aspect) {
        if (!aspect || !aspect.sprite) {
            return;
        }
        aspect.sprite[this.outer.key] = undefined;
        aspect.destructor();
    }
}

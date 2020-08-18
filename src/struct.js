import Aspect from './aspect';
import Bundle from './bundle';

export default class Struct extends Aspect {
    constructor(group, object, bundle) {
        super(group, object);
        this.struct = bundle;
    }
    static of(module) {
        let b = Bundle.of(module);
        class Sub extends b.Sub {
            getAspect(child) {
                let aspect = this.outer.getAspect(child);
                if (!aspect) {
                    return undefined;
                }
                return aspect.bundle[this.innerName];
            }
            removeAspect(aspect) {
                aspect = this.outer.getAspect(child);
                if (!aspect) {
                    return;
                }
                aspect.bundle[this.innerName] = undefined;
                aspect.destructor();
            }
        };
        class Group extends b {
            static get Sub() {
                return Sub;
            }
        };
        return class extends this {
            static construct(group, object) {
                if (!object) {
                    return undefined;
                }
                let bundle = {};
                for (let [name, sub] of group.subsEntries()) {
                    let aspect = sub.constructAspect(object);
                    if (!aspect) {
                        continue;
                    }
                    bundle[name] = aspect;
                    sub.rawAdd(object, false);
                }
                return new this(group, child, bundle);
            }
            static get Group() {
                return Group;
            }
        };
    }
}

import Aspect from './aspect';
import Bundle from './bundle';

export default class Union extends Aspect {
    static of(module) {
        let b = Bundle.of(module);
        class Sub extends b.Sub {
            getAspect(child) {
                return this.outer.getAspect(child);
            }
        };
        class Group extends b {
            static get Sub() {
                return Sub;
            }
        };        
        return class extends this {
            static construct(group, child) {
                if (!child) {
                    return undefined;
                }
                for (let [name, sub] of group.subsEntries()) {
                    let aspect = group.backlinkAspect(sub.constructAspect(child));
                    if (aspect) {
                        sub.rawAdd(child, false);
                        return aspect;
                    }
                }
                return undefined;
            }
            static get Group() {
                return Group;
            }
        };
    }
    constructor() {
        throw 'Uninstantiable';
    }
}
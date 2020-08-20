import mappify from '../mappify';
import Relation from '../relation';

export {default as Grouping} from './grouping'

export function Struct(clazz, module) {    
    module = mappify(module);
    return class extends clazz {
        static get [Relation.T]() {
            return Relation.struct;
        }
        static get [Relation.C]() {
            return module;
        }
    };
}

export function Union(clazz, module) {
    module = mappify(module);
    for (let [key, Aspect] of module) {
        if (Aspect[Relation.T] == Relation.union) {
            throw 'Nested unions not supported; insert a 1-element struct in between?';
        }
    }
    return class extends clazz {
        constructor() {
            throw 'Uninstantiable';
        }
        static get [Relation.T]() {
            return Relation.union;
        }
        static get [Relation.C]() {
            return module;
        }
    };
}
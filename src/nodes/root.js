import Leaf from './leaf';
import Multi from './multi';
import Struct from './struct';
import Union from './union';

import Relation from '../relation';
import mappify from '../mappify';

export default class Root extends Multi {
    static of(scene, module) {
        return new Root(scene, children(scene, module));
    }
    constructor(scene, innerMap) {
        super(scene, null, null, innerMap);
    }
    dereference(sprite, name) {
        return sprite[name];
    }
    bind(sprite, config) {
        for (let [name, value] of Object.entries(config)) {
            sprite[name] = this.bindInner(sprite, name, value);
        }
    }
    unbind(aspect) {
        for (let [name, inner] of this.innerMap) {
            inner.unbind(sprite[name]);
            aspect[name] = undefined;
        }
    }
    visit(cb) {
        for (let [name, inner] of this.innerMap) {
            inner.visit(cb);
        }
    }
};

const NodeType = {
    [Relation.leaf]: Leaf,
    [Relation.struct]: Struct,
    [Relation.union]: Union,
};
function children(scene, module) {
    let retval = new Map();
    for (let [name, Aspect] of mappify(module)) {
        switch(Aspect[Relation.T]) {
            case Relation.leaf:
                retval.set(name, new Leaf(scene, Aspect, name));
                break;
            case Relation.struct:
                retval.set(name, 
                    new Struct(scene, Aspect, name, children(scene, Aspect[Relation.C]))
                );
                break;
            case Relation.union:
                retval.set(name,
                    new Union(scene, Aspect, name, children(scene, Aspect[Relation.C]))
                );
                break;
            default:
                throw 'Unrecognized aspect type';
        }
    }
    return retval;
}
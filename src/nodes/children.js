import Data from './data';
import Leaf from './leaf';
import Struct from './struct';
import Union from './union';

import Relation from '../relation';
import mappify from '../mappify';

export function child(context, Aspect) {
    if (!Aspect) {
        return Data;
    }
    switch(Aspect[Relation.T]) {
    case Relation.leaf:
        return new Leaf(context, Aspect);
    case Relation.struct:
        return new Struct(context, Aspect, children(context, Aspect[Relation.C]));
    case Relation.union:
        return new Union(context, Aspect, children(context, Aspect[Relation.C]));
    default:
        throw 'Unrecognized aspect type';
    }
}

export default function children(context, module) {
    let retval = new Map();
    let path = undefined;
    if (context.key) {
        path = context.key;
    }
    if (context.path) {
        path = `${context.path}.${path}`;
    }
    for (let [key, Aspect] of mappify(module)) {
        let innerContext = Object.assign({}, context, { key, path });
        retval.set(key, child(innerContext, Aspect));
    }
    return retval;
}
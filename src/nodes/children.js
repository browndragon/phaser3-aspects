import Data from './data';
import Leaf from './leaf';
import Struct from './struct';
import Union from './union';

import Meta from '../meta';
import mappify from '../mappify';

import jsonmergepatch from 'json-merge-patch';

// See `Root.of` to construct a full working hierarchy.
export function node(parentContext, keyInParent, Aspect) {
    if (!Aspect) {
        return Data;
    }
    let context = contextualize(parentContext, keyInParent, Aspect);
    switch(Meta.type(Aspect)) {
    case undefined: return new Leaf(
        context,
        Aspect,
    );
    case Meta.struct: return new Struct(
        context,
        Aspect, 
        children(context, Meta.children(Aspect)),
    );
    case Meta.union: return new Union(
        context,
        Aspect,
        children(context, Meta.children(Aspect)),
    );
    }
    throw 'Unrecognized aspect type';
}

export default function children(parentContext, module) {
    let retval = new Map();
    for (let [key, Aspect] of mappify(module)) {
        retval.set(key, node(parentContext, key, Aspect));
    }
    return retval;
}

function contextualize(parentContext, key, innerAspect) {
    // Note we have our own key as an argument which we'll put in the context below.

    // The path needs the previous key pushed onto it:
    let path = [...parentContext.path || []];
    if (parentContext.key) {
        path.push(parentContext.key);
    }

    // The config needs merging with the received parent config; in both cases,
    // "if any".
    let config = jsonmergepatch.apply({}, Meta.config(innerAspect));
    let source = parentContext.config;
    if (source) {
        source = source[key];
    }
    if (source) {
        config = jsonmergepatch.apply(config, source);
    }

    return {
        ...parentContext,
        config,
        key,
        path,
    };
}

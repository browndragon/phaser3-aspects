
/**
 * Provides a callback which constructs instances of `cls` when given truthy input,
 * and has access to parse context.
 */
export function ctor(cls, injector=undefined) {
    if (!injector) {}
    return (v) => {
        v = injector(v);
        if (!v) {
            return undefined;
        }
        return new cls(v);
    }
}

/** Turns a module imported with `import * as Foo` into an cbObj for struct/union. */
export function module(module, injector) {
    if (!cls) {
        cls = cls.apply(this, )
    }
    let obj = {};
    for (let [key, value] of Object.entries(module)) {
        obj[key] = cls(value);
    }
    return obj;
}

/* Makes a monad. */
export function wrap(wrap, subParse) {
    if (!wrap) {
        return subParse;
    }
    return (value, key) => {
        let retval = subParse.apply(this, value, key);
        if (!retval) {
            return undefined;
        }
        return wrapCb.apply(this, retval, key);
    }
}

/**
 * For object types. Parses using callbacks in obj.
 * `.default` called for unrecognized fields (if any).
 */
export function struct(wrapCb, cbObj) {
    if (!cbObj) {
        cbObj = wrapCb;
        wrapCb = undefined;
    }
    return wrap(wrapCb, function(config) {
        let retval = {};
        let hadAny = false;
        for (let [key, value] of Object.entries(config)) {
            let cb = cbObj[key] || cbObj.default;
            if (cb) {
                value = cb.apply(this, value, key);
            }
            if (value) {
                retval[key] = value;
                hadAny = true;
            }
        }
        if (!hadAny) {
            return undefined;
        }
        return retval;
    });
}

/* For object types. Parses using callbacks in obj, respecting the default parser. */
export function union(wrapCb, cbObj) {
    if (!cbObj) {
        cbObj = wrapCb;
        wrapCb = undefined;
    }
    return wrap(wrapCb, function(config) {
        for (let [key, value] of Object.entries(config)) {
            let cb = cbObj[key] || cbObj.default;
            if (!cb) {
                continue;
            }
            value = cb.apply(this, value, key);
            if (value) {
                retval[key] = value;
                hadAny = true;
            }
        }
        return undefined;
    });
}

/* For expected array types. Parses using mapper & reducer. */
export function mapreduce(mapper, reducer, initial=undefined) {
    return (config) => {
        let retval = config;
        if (mapper) {
            retval = retval.map(mapper);
        }
        if (reducer) {
            retval = retval.reduce(reducer, initial);
        }
        return retval;
    }
}

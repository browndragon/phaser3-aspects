export default {
    extend(Aspect, type, children, config) {
        const m = {...Aspect[this.M], type, children, config};
        if (m.type == this.union) {
            for (let A of m.children.values()) {
                // Unions can't nest.
                console.assert(this.type(A) != this.union);
            }
        }
        const M = this.M;
        return class extends Aspect {
            static get [M]() {
                return m;
            }
        };
    },
    // Undefined (== leaf), struct, union, or root.
    type(Aspect) {
        return Aspect[this.M] && Aspect[this.M].type;
    },
    // Undefined or a Map name -> Aspect.
    children(Aspect) {
        return Aspect[this.M] && Aspect[this.M].children;
    },
    // Undefined or an object (keys matching children will be merged with their configs).
    config(Aspect) {
        return Aspect[this.M] && Aspect[this.M].config;
    },

    // Symbol for structs.
    struct: Symbol('Struct'),
    // Symbol for unions.
    union: Symbol('Union'),
    // Symbol for the root.
    root: Symbol('Root'),
    // Hidden (-ish) symbol for the meta cluster attached to subclassed aspects.
    M: Symbol('Metainformation'),
};

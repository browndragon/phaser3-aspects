// Aspects are only created at structs and leaves; but structs are multi and leaves are not!
// So this mixin captures that distinction.
export default function Constructing(clazz) {
    return class extends clazz {
        constructor(...params) {
            super(...params);
            this.aspects = new Set();
        }
        bind(sprite, config) {
            let instance = sprite && config && new this.aspect(this.context, sprite, config);
            if (instance) {
                this.aspects.add(instance);
            }
            return instance;
        }
        unbind(aspect) {
            if (!aspect) {
                return;
            }
            this.aspects.remove(aspect);
            super.unbind(aspect);
        }
    }
}
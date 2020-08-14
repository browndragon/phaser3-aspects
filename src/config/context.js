class Context {
    constructor(initial=undefined) {
        this.value = initial;
    }
    set(value) {
        this.value = value;
    }
    get() {
        return this.value;
    }
    injector(key='context', pos=0) {
        return (obj) => {
            if (!obj) {
                return undefined;
            }
            if (Array.isArray(obj) && pos != undefined) {
                obj.splice(pos, null, [this.get()]);
                return obj;
            }
            obj[key] = this.get();
            return obj;
        };
    }
}
export const ctor = new Context();
export const ctorinjector = ctor.injector();
export default function mappify(module) {
    if (!module) {
        return new Map();
    }
    if ((module instanceof Map)) {
        return module;
    }
    if (module[Symbol.iterator]) {
        return new Map(module);
    }
    return new Map(Object.entries(module));
}

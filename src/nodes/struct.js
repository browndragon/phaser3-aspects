import Multi from './multi';

export default class Struct extends Multi {
    dereference(aspect, name) {
        return aspect[name];
    }

    bind(sprite, config) {
        let subAspects = {};
        for (let [name, value] of Object.entries(config)) {
            subAspects[name] = this.bindInner(sprite, name, value);
        }
        return this.store(new this.aspect(sprite, subAspects));
    }
};
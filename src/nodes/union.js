import Multi from './multi';

export default class Union extends Multi {
    dereference(aspect, name) {
        return aspect;
    }

    bind(sprite, config) {
        let subAspects = {};
        for (let [name, value] of Object.entries(config)) {
            return this.store(this.bindInner(sprite, name, value));
        }
        throw 'No union entry';
    }
};
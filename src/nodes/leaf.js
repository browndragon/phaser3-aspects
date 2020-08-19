import Base from './base';

export default class Leaf extends Base {
    constructor(scene, aspectClass, key) {
        super(scene, aspectClass, key);
    }

    bind(sprite, config) {
        return config && this.store(new this.aspect(sprite, config, this));
    }
}

export default class Input {
    constructor(config, root=undefined) {
        this.config = config;
        this.root = root || this;
    }
    static of(config, root=undefined) {
        return new this(config, root);
    }
    keys() {
        return Object.keys(this.config);
    }
    value() {
        return this.config;
    }
    child(key) {
        return this.constructor.of(config[key], this.root);
    }

}
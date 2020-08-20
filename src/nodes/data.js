import Base from './base';

// Most useful in the context of Struct, where this lets you pass unmodified parameters around.
class Data extends Base {
    constructor() {
        // Lie about everything.
        super({scene:'unused but not falsey!'}, null);
    }
    bind(_sprite, config) {
        return config;
    }
    unbind(aspect) {}
    visit(cb) {}
}

export default new Data();
import Group from '../aspect/group';

export default class Bundle {
    constructor(...params) {
        this.aspects = new Set();
        for (let param of params) {
            this.register(param);
        }
    }
    register(aspect) {
        this.aspects.add(aspect);
        return this;
    }
    get key() {
        throw 'unimplemented';
    }
    get(object) {
        return object[this.key];
    }
    newGroup(...groupParams) {
        return new this.Group(this, ...groupParams);
    }
}

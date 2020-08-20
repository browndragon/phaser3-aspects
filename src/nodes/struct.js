import Constructing from './constructing';
import Multi from './multi';

export default class Struct extends Constructing(Multi) {
    bind(sprite, config) {
        let subAspects = {};
        for (let [name, value] of Object.entries(config)) {
            subAspects[name] = this.innerBind(sprite, name, value);
        }
        return super.bind(sprite, subAspects);
    }
    unbind(aspect) {
        for (let [name, inner] of this.innerMap) {
            let innerAspect = aspect[name];
            if (!innerAspect) {
                continue;
            }
            inner.unbind(innerAspect);
        }
        return super.unbind(aspect);
    }
}
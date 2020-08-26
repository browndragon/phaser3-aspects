import Constructing from './constructing';
import Multi from './multi';

export default class Struct extends Constructing(Multi) {
    bind(sprite, config) {
        let subAspects = {};
        for (let name of this.innerMap.keys()) {
            const value = config[name];
            // If it's *explicitly* nulled out, skip it; otherwise, construct with defaults.
            if (value === null) {
                continue;
            }
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
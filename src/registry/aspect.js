import {Bundle, UnionG, StructG} from './groups';
import Base from '../aspect';

// Represents a participant in a bundle.
export default class Aspect extends Base {
    static newGroup(bundleAspect, ...groupParams) {
        return new this.Group(this, bundleAspect, ...groupParams);
    }
    constructor(object, config) {
        this.object = object;
        this.config = config;
    }
}
Aspect.Group = Sub;
import Aspect from '../aspect';

export class Bundle extends Aspect.Group {
    constructor(bundleAspect, subGroups, ...params) {
        super(bundleAspect, ...params);
        this.subGroups = subGroups;
    }

    init(data) {
        super.init(data);
        for (let group of Object.values(this.subGroups)) {
            group.init(data);
        }
    }
    preload() {
        super.preload();
        for (let group of Object.values(this.subGroups)) {
            group.preload();
        }
    }
    create(data) {
        super.create(data);
        for (let group of Object.values(this.subGroups)) {
            group.create(data);
        }
    }
    update(time, delta) {
        for (let group of Object.values(this.subGroups)) {
            group.update(time, delta);
        }
        super.update(time, delta);
    }

    subGroupNames() {
        return Object.keys(this.subGroups);
    }
    subGroup(key) {
        return this.subGroups[key];
    }
}

class BundleG extends Aspect.Group {
    constructor(aspectClass, containerClass, ...params) {
        super(...params);
        this.container = containerClass;
    }
    config(child) {
        return this.container.config(child, this.key);
    }
    makeSubAspect(child) {
        let config = this.config(child);
        if (!config) {
            return undefined;
        }
        return new this(child, config);
    }
}
export class UnionG extends BundleG {

}
export class StructG extends BundleG {

}
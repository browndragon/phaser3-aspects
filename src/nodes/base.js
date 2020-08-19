import Aspect from '../aspect';

export default class Base {
    constructor(scene, aspectClass, key) {
        console.assert(scene);
        this.scene = scene;
        this.aspect = aspectClass;
        this.key = key;
        this.aspects = new Set();
        this.group = aspectClass && aspectClass.group(this);
        // TODO(ensure we have the callbacks overridden);
    }

    get innerNames() {
        return [];
    }

    store(aspect) {
        this.aspects.add(aspect);
        if (this.group) {
            this.group.add(aspect.sprite);
        }
        return aspect;
    }
    unstore(aspect) {
        this.aspects.delete(aspect);
        if (this.group) {
            this.group.remove(aspect.sprite, false, false);
        }        
    }

    bind(sprite, config) {
        throw 'unimplemented';
    }
    unbind(aspect) {
        if (!aspect || !aspect.sprite) {
            return;
        }
        this.unstore(aspect);
        aspect.destructor();
    }
    visit(cb) {
        return cb(this);
    }
}

import Phaser from 'phaser';

export default class Group extends Phaser.GameObjects.Group {
    constructor(aspectClass, ...params) {
        super(...params);
        this.aspect = aspectClass;
    }

    get key() {
        return this.aspect.key;
    }

    add(child, addToScene) {
        if (!this.addAspect(child)) {
            return this;
        }
        return this.rawAdd(child, addToScene);
    }
    rawAdd(child, addToScene) {
        return super.add(child, addToScene);
    }

    remove(child, removeFromScene, destroyChild) {
        this.removeAspect(child);
        return super.remove(child, removeFromScene, destroyChild);
    }

    addAspect(child) {
        console.assert(!child[this.aspect.key]);
        let aspect = new this.aspect(child);
        if (aspect) {
            child[this.aspect.key] = aspect;
        }
        return aspect;
    }
    removeAspect(child) {
        let aspect = child && child[this.aspect.key];
        if (!aspect) {
            return;
        }
        aspect.destructor();
    }
    init(data) {
        this.aspect.init(this, data);
    }
    preload() {
        this.aspect.preload(this);
    }
    create(data) {
        this.aspect.create(this, data);
    }
    update(time, delta) {
        let result = this.aspect.update(this, time, delta);
        if (!result) {
            return;
        }
        for (let child of this.getChildren()) {
            child[this.aspect.key].update(result);
        }
    }
}
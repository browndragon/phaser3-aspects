import Phaser from 'phaser';

export default class Group extends Phaser.GameObjects.Group {
    constructor(key=undefined, aspectClass, ...params) {
        super(...params);
        this[K] = key;
        this[A] = aspectClass;
        console.assert(this[A]);   
    }

    get key() {
        return this[K];
    }

    // Is override.
    add(child, addToScene) {
        if (!this.backlinkAspect(this.constructAspect(child))) {
            return this;
        }
        return this.rawAdd(child, addToScene);
    }
    rawAdd(child, addToScene) {
        return super.add(child, addToScene);
    }
    // Is override.
    remove(child, removeFromScene, destroyChild) {
        this.unlinkAspect(this.getAspect(child));
        return super.remove(child, removeFromScene, destroyChild);
    }

    backlinkAspect(aspect) {
        if (!aspect) {
            return undefined;
        }
        if (!aspect.sprite) {
            aspect.destructor();
            return undefined;
        }
        if (this.key) {
            aspect.sprite[this.key] = aspect;
        }
        return aspect;
    }
    constructAspect(child, ...params) {
        return child && new this[A](this, child, ...params);
    }
    getAspect(child) {
        if (!this.key) {
            return undefined;
        }
        return child && child[this.key];
    }
    unlinkAspect(aspect) {
        if (!aspect) {
            return;
        }
        if (this.key) {
            child[this.key] = undefined;
        }
        aspect.destructor();
    }

    initScene(data) {
        if (this.key) {
            this.scene[this.key] = this;
        }
        this[A].init(this, data);
    }
    preloadScene() {
        this[A].preload(this);
    }
    createScene(data) {
        this[A].create(this, data);
    }
    updateScene(time, delta) {
        let result = this[A].update(this, time, delta);
        if (!result) {
            return;
        }
        for (let child of this.getChildren()) {
            this.getAspect(child).update(result);
        }
    }
}
const A = Symbol('Aspect');
const K = Symbol('Key');
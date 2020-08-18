import Phaser from 'phaser';

export default class Group extends Phaser.GameObjects.Group {
    constructor(aspectClass, ...params) {
        super(...params);
        console.log('Constructing: ', this.constructor, aspectClass, ...params);
        this[A] = aspectClass;
        console.assert(this[A]);
    }

    // Is override.
    add(child, addToScene) {
        if (!this.backlinkAspect(this[A].construct(this, child))) {
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

    getAspect(child) {
        return child && child[this[A].key];
    }
    backlinkAspect(aspect) {
        if (!aspect) {
            return undefined;
        }
        if (!aspect.sprite) {
            return undefined;
        }
        return aspect.sprite[this[A].key] = aspect;
    }
    unlinkAspect(aspect) {
        if (!aspect) {
            return;
        }
        child[this[A].key] = undefined;
        aspect.destructor();
    }

    initScene(data) {
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
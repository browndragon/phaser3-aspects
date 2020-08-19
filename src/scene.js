import Phaser from 'phaser';

export default class Scene extends Phaser.Scene {
    constructor(...params) {
        super(...params);
        this[R] = new Map();
    }

    register(key, Aspect, ...params) {
        this[R].set(key, new Aspect.Group(key, Aspect, this, ...params));
        return this;
    }

    addSprite(child) {
        for (let aspectGroup of this[R].values()) {
            aspectGroup.add(child);
        }
        return this;
    }

    init(data) {
        for (let aspectGroup of this[R].values()) {
            aspectGroup.initScene(data);
        }
    }
    preload() {
        for (let aspectGroup of this[R].values()) {
            aspectGroup.preloadScene();
        }
    }
    create(data) {
        for (let aspectGroup of this[R].values()) {
            aspectGroup.createScene(data);
        }
    }
    update(time, delta) {
        for (let aspectGroup of this[R].values()) {
            aspectGroup.updateScene(time, delta);
        }
    }
}
const R = Symbol('SceneRegistry');
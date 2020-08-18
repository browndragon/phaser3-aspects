import Phaser from 'phaser';

export default class Scene extends Phaser.Scene {
    constructor(...params) {
        super(...params);
        this[R] = new Set();
    }

    register(Aspect, ...params) {
        this[R].add(new Aspect.Group(Aspect, this, ...params));
        return this;
    }
    addSprite(child) {
        for (let aspectGroup of this[R]) {
            aspectGroup.add(child);
        }
        return this;
    }

    init(data) {
        for (let aspectGroup of this[R]) {
            aspectGroup.initScene(data);
        }
    }
    preload() {
        for (let aspectGroup of this[R]) {
            aspectGroup.preloadScene();
        }
    }
    create(data) {
        for (let aspectGroup of this[R]) {
            aspectGroup.createScene(data);
        }
    }
    update(time, delta) {
        for (let aspectGroup of this[R]) {
            aspectGroup.updateScene(time, delta);
        }
    }
}
const R = Symbol('SceneRegistry');
import Phaser from 'phaser';

export default class Scene extends Phaser.Scene {
    constructor(...params) {
        super(...params);
        this[R] = new Set();
    }
    register(aspect, ...params) {
        this[R].add(aspect.newGroup(this, ...params));
        return this;
    }

    init(data) {
        for (let aspect of this[R]) {
            aspect.init(data);
        }
    }
    preload() {
        for (let aspect of this[R]) {
            aspect.preload(data);
        }
    }
    create(data) {
        for (let aspect of this[R]) {
            aspect.create(data);
        }
    }
    update(time, delta) {
        for (let aspect of this[R]) {
            aspect.update(time, delta);
        }
    }
}
const R = Symbol('SceneRegistry');
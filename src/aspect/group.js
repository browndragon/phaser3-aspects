import Phaser from 'phaser';

export default class Group extends Phaser.GameObjects.Group {
    add(child, addToScene) {
        if (this.addAspect(child)) {
            super.add(child, addToScene);
        }
    }
    remove(child, removeFromScene, destroyChild) {
        this.removeAspect(child);
        return super.remove(child, removeFromScene, destroyChild);
    }
    addAspect(child) {
        return undefined;
    }
    removeAspect(child) {}

    init(data) {}
    preload() {}
    create(data) {}
    update(time, delta) {}
}
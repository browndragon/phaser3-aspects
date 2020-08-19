import Aspect from 'phaser3-aspects';

export default class Move extends Aspect {
    static create(data, {scene, group}) {
        scene.physics.world.enable(group);
        scene.physics.add.collider(group);
        scene.physics.world.setBounds(0, 0, 800, 600);
        scene.physics.world.setBoundsCollision();
    }

    constructor(...params) {
        super(...params);
        this.group.scene.physics.world.enable(this.sprite);
        this.sprite.body.setCollideWorldBounds();
        this.rotation = 0;
    }

    walk(x, y) {
        this.sprite.body.setVelocity(x, y);
        // "play animation". Happens to just be rotation for this example.
        this.rotation = .0002 * (x - y || x || y);
    }

    static update(time, delta) {
        return delta;
    }
    update(delta) {
        this.sprite.rotation += delta * this.rotation;
    }
}
Move.Physics = {
    arcade: {
        debug: true,
        gravity: { y: 10},
    }
};
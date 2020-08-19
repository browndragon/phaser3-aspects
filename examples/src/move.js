import Aspects from 'phaser3-aspects';

export default class Move extends Aspects.Aspect {
    static create(group, data) {
        group.scene.physics.world.enable(group);
        group.scene.physics.add.collider(group);
        group.scene.physics.world.setBounds(0, 0, 800, 600);
        group.scene.physics.world.setBoundsCollision();
    }

    constructor(...params) {
        super(...params);
        this.group.scene.physics.world.enable(this.sprite);
        this.sprite.body.setCollideWorldBounds();
    }

    walk(x, y) {
        this.sprite.body.setVelocity(x, y);
        // Faking an animation. This could also just play an animation or something.
        this.sprite.sprite2.animateRolling(x + y);
    }
}
Move.Physics = {
    arcade: {
        debug: true,
        gravity: { y: 10},
    }
};
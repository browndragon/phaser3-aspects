import Aspect from 'phaser3-aspects';

export default class Move extends Aspect.Grouping(physicsScene) {
    static create(context, data) {
        super.create(context, data);
        const {scene} = context;
        scene.physics.add.collider(this.group(scene));
        scene.physics.world.setBoundsCollision();
    }

    walk(x, y) {
        this.sprite.body.setVelocity(x, y);
        this.sprite.assets.animateRoll(.0002 * (x - y || x || y));
    }
}
Move.Physics = {
    arcade: {
        debug: true,
        gravity: { y: 10},
    }
};

function physicsScene(scene) {
    return scene.physics.add.group({
        collideWorldBounds: true,
    });
}

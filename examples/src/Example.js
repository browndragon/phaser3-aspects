import Phaser from 'phaser';

import Aspects from 'phaser3-aspects';

function deref(object, ...path) {
    let ptr = object;
    for (let p of path) {
        if (ptr == undefined) {
            return ptr;
        }
        ptr = ptr[p];
    }
    return ptr;
}

class BaseAI extends Aspects.Aspect {
    static construct(group, object) {
        let config = this.config(object);
        if (!config) {
            return undefined;
        }
        return new this(group, object);
    }
    static config(object) {
        return deref(object, 'config', 'ai', this.key);
    }
    get speed() {
        return this.constructor.config(this.sprite).speed;
    }
}

const AIs = {
    random: class extends BaseAI {
        static get key() { return 'random'; }
        static update(group, time, delta) {
            return {delta};
        }
        update({delta}) {
            let random = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), this.speed * delta);
            random.add(this.sprite.body.velocity);
            this.sprite.move.walk(random.x, random.y);
        }
    },
    keyboard: class extends BaseAI {
        static get key() { return 'keyboard'; }
        static create(group, data) {
            group.cursors = group.scene.input.keyboard.createCursorKeys();
        }
        static update(group, time, delta) {
            return [group.cursors, time, delta];
        }
        update([cursors, time, delta]) {
            let [x, y] = [0, 0];
            if (cursors.up.isDown) {
                y = -this.speed;
            }
            if (cursors.down.isDown) {
                y = +this.speed;
            }
            if (cursors.left.isDown) {
                x = -this.speed;
            }
            if (cursors.right.isDown) {
                x = +this.speed;
            }
            console.log('Updating walk', x, y);
            this.sprite.move.walk(x, y);
        }
    }
};
class AI extends Aspects.Union.of(AIs) {
    static get key() { return 'ai'; }
}

class Move extends Aspects.Aspect {
    static get key() { return 'move'; }
    static create(group, data) {
        group.scene.physics.add.collider(this, this);
        group.scene.physics.world.setBounds(0, 0, 800, 600);
        group.scene.physics.world.setBoundsCollision();
    }

    constructor(...params) {
        super(...params);
        this.group.scene.physics.world.enable(this.sprite);
        this.sprite.body.setCollideWorldBounds();
        this.sprite.rotation = 0;
        this.rot = 0;
    }

    walk(x, y) {
        this.sprite.body.setVelocity(x, y);
        // Faking an animation. This could also just play an animation or something.
        this.rot = x + y;
    }
    static update(group, time, delta) {
        return {delta};
    }
    update({delta}) {
        this.sprite.rotation += (this.rot * delta / 10);
    }
}
Move.Physics = {
    arcade: {
        debug: true,
        gravity: { y: 10},
    }
};

class Sprite extends Aspects.Aspect {
    static get key() { return undefined; }
    static preload(group) {
        let data = [
            '.....828.....',
            '....72227....',
            '....82228....',
            '...7222227...',
            '2222222222222',
            '8222222222228',
            '.72222222227.',
            '..787777787..',
            '..877777778..',
            '.78778887787.',
            '.27887.78872.',
            '.787.....787.'
        ];
        group.scene.textures.generate('star', { data, pixelWidth: 4 })
    }
    static create(group) {
        let i = 0;
        for (let sprite of group.createMultiple({
            key: 'star',
            quantity: 12,
            setXY: { x:0, y:0, stepX: 32, stepY: 32, },
            setRotation: { step: 10, },
            setScale: { x: .75, y: .75, stepX: .05, stepY: .05, },
        })) {
            if (i++ % 3 == 0) {
                sprite.config = { ai: { keyboard: {speed:100} } };
                console.log('Added keyboard');
            } else {
                sprite.config = { ai: { random: {speed:5} } };
            }
            group.scene.addSprite(sprite);
        }
    }
}

class Scene extends Aspects.Scene {
    constructor() {
        super({
            key: 'Scene',
            physics: Move.Physics,
        });
        this.register(AI)
            .register(Move)
            .register(Sprite);
    }
}
var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    debug: true,
    scene: [Scene],
};

var game = new Phaser.Game(config);  // eslint-disable-line no-unused-vars

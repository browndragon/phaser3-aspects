import Aspects from 'phaser3-aspects';

export default class Base extends Aspects.Aspect {
    static create(group, data) {
        for (let sprite of group.createMultiple({
            key: this.key,
            quantity: 12,
            setXY: this.setXY,
            setRotation: { step: 10, },
            setScale: { x: .75, y: .75, stepX: .05, stepY: .05, },
        })) {
            this.configureSprite(sprite);
            group.scene.addSprite(sprite);
        }
    }
    static configureSprite(sprite) {
        sprite.config = {
            ai: { random: {speed: 25 } },
        };
    }
    static get setXY() { throw 'unimplemented'; }

    constructor(...params) {
        super(...params);
        this.rotSpeed = 0;
    }
    animateRolling(speed) {
        this.rotSpeed = speed;
    }
    static update(group, time, delta) {
        return {delta};
    }
    update({delta}) {
        this.sprite.rotation += (this.rotSpeed * delta / 10);
    }
}

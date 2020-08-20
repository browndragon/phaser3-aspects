import Aspect from 'phaser3-aspects';

export default class Base extends Aspect {
    static create(context, ...params) {
        super.create(context, ...params);
        this.makeInstances(context);
    }
    static makeInstances({scene, key}) {
        console.assert(key);
        for (let sprite of scene.add.group().createMultiple({
            key: key,
            quantity: 8,
            setXY: this.setXY,
            setRotation: { step: 10, },
            setScale: { x: .75, y: .75, stepX: .05, stepY: .05, },
        })) {
            scene.bind(sprite, {
                ai: { random: {speed: 10}},
                assets: {[key]: {}},
                move: {},
            });
            sprite.assets.animateRoll(0);
        }
    }

    static update(context, time, delta) {
        return delta;
    }
    update(delta) {
        this.sprite.rotation += delta * this._roll;
    }

    static get setXY() { throw 'unimplemented'; }
    animateRoll(speed) {
        this._roll = speed;
    }
}

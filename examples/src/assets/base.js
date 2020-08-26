import Aspect from 'phaser3-aspects';

export default class Base extends Aspect {
    static preload({ scene, key, config:{data, pixelWidth=4} }) {
        console.assert(data);
        scene.textures.generate(key, {data, pixelWidth});
    }
    static create({key, scene, config:{setXY}}) {
        console.assert(key);
        for (let sprite of scene.add.group().createMultiple({
            key: key,
            quantity: 8,
            setXY: setXY,
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

    animateRoll(speed) {
        this._roll = speed;
    }
    get sprite() {
        return this.object;
    }
}

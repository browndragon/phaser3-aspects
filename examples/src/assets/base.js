import Aspect from 'phaser3-aspects';

export default class Base extends Aspect {
    static create(data, {scene, group, key}) {
        for (let sprite of group.createMultiple({
            key: key,
            quantity: 8,
            setXY: this.setXY,
            setRotation: { step: 10, },
            setScale: { x: .75, y: .75, stepX: .05, stepY: .05, },
        })) {
            scene.root.bind(sprite, {
                ai: { random: {speed: 10}},
                move: {},
            });
        }
    }
    static get setXY() { throw 'unimplemented'; }
}

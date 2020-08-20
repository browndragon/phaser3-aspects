import Base from './base';

export default class Wheel extends Base {
    static get setXY() { return { x:256, y:128, stepX: 64, stepY: 64, }; }
    static preload({scene, key}) {
        let data = [
            '..EEEE..',
            '.EDEDDE.',
            'EDDEDDDE',
            'EDDEEEEE',
            'EEEEEDDE',
            'EDDDEDDE',
            '.EDDEDE.',
            '..EEEE..',
        ];
        scene.textures.generate(key, {data, pixelWidth: 8 });
    }
    static makeInstances({scene, key}) {
        let sprite = scene.add.sprite(64, 500, key);
        scene.bind(sprite, {
            ai: { keyboard: { speed: 75 } },
            assets: { wheel: {} },
            move: {},
        });
        sprite.assets.animateRoll(0);
    }
}

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
    static create(data, {scene, key}) {
        let sprite = scene.add.sprite(64, 500, key);
        scene.root.bind(sprite, {
            ai: { keyboard: { speed: 40 } },
            move: {},
        });
    }
}

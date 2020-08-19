import Base from './base';

export default class Arrow extends Base {
    static get setXY() { return { x:256, y:128, stepX: 64, stepY: 64, }; }
    static preload({scene, key}) {
        let data = [
            '..BBBBBB',
            '...BAAAB',
            '....BAAB',
            '...BABAB',
            '..BAB.BB',
            '.BAB...B',
            '.BB.....',
            '........',
        ];
        scene.textures.generate(key, {data, pixelWidth: 8 });
    }
}
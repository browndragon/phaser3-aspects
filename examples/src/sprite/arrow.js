import Base from './base';

export default class Arrow extends Base {
    static get key() { return 'arrow'; }
    static get setXY() { return { x:256, y:128, stepX: 64, stepY: 64, }; }
    static preload(group) {
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
        group.scene.textures.generate(this.key, {data, pixelWidth: 8 });
    }
}
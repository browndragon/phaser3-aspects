import Base from './base';

export default class extends Base {
    static get setXY() { return { x:0, y:0, stepX: 32, stepY: 32, }; }
    static preload({scene, key}) {
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
        scene.textures.generate(key, { data, pixelWidth: 4 });
    }
}
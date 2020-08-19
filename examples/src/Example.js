import AI from './ai';
import Move from './move';
import Sprite from './sprite';

import Phaser from 'phaser';
import Aspects from 'phaser3-aspects';

class Scene extends Aspects.Scene {
    constructor() {
        super({
            key: 'Scene',
            physics: Move.Physics,
        });
        this.register('sprite2', Sprite)
            .register('ai', AI)
            .register('move', Move);
    }
    create(data) {
        super.create(data);
        this.add
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

import Phaser from 'phaser';

import AI from './ai';
import Move from './move';
import Assets from './assets';

import Aspect from 'phaser3-aspects';

class Scene extends Aspect.Scene {
    constructor() {
        super(
            new Map()
                .set('assets', Assets)
                .set('ai', AI)
                .set('move', Move),
            {
                key: 'Scene',
                physics: Move.Physics,
            }
        );
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

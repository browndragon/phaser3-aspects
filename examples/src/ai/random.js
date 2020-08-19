import Base from './base';

import Phaser from 'phaser';

export default class Random extends Base {
    static update(time, delta) {
        return delta;
    }
    update(delta) {
        let random = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), this.speed * delta);
        random.add(this.sprite.body.velocity);
        this.sprite.move.walk(random.x, random.y);
    }
}
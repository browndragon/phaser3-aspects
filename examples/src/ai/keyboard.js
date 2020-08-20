import Base from './base';

export default class Keyboard extends Base {
    static create({scene, data}) {
        data.cursors = scene.input.keyboard.createCursorKeys();
    }
    static update({data}, _time, _delta) {
        let [x, y] = [0, 0];
        if (data.cursors.up.isDown) {
            y = -1;
        }
        if (data.cursors.down.isDown) {
            y = +1;
        }
        if (data.cursors.left.isDown) {
            x = -1;
        }
        if (data.cursors.right.isDown) {
            x = +1;
        }
        return [x, y];
    }
    update([x, y]) {
        x *= this.speed;
        y *= this.speed;
        this.sprite.move.walk(x, y);
    }
}
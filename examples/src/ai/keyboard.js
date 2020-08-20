import Base from './base';

export default class Keyboard extends Base {
    static create(_data, {scene, group}) {
        group.cursors = scene.input.keyboard.createCursorKeys();
    }
    static update(_time, _delta, {group}) {
        let [x, y] = [0, 0];
        if (group.cursors.up.isDown) {
            y = -1;
        }
        if (group.cursors.down.isDown) {
            y = +1;
        }
        if (group.cursors.left.isDown) {
            x = -1;
        }
        if (group.cursors.right.isDown) {
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
import Base from './base';

export default class Keyboard extends Base {
    static create(data, {scene, group}) {
        group.cursors = group.scene.input.keyboard.createCursorKeys();
    }
    static update(time, delta, {group}) {
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
        console.log('Walking to', x, y);
        this.sprite.move.walk(x, y);
    }
}
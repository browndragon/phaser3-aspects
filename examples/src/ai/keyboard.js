import Base from './base';

export default class Keyboard extends Base {
    static create(group, data) {
        group.cursors = group.scene.input.keyboard.createCursorKeys();
    }
    static update(group, time, delta) {
        return [group.cursors, time, delta];
    }
    update([cursors, time, delta]) {
        let [x, y] = [0, 0];
        if (cursors.up.isDown) {
            y = -this.speed;
        }
        if (cursors.down.isDown) {
            y = +this.speed;
        }
        if (cursors.left.isDown) {
            x = -this.speed;
        }
        if (cursors.right.isDown) {
            x = +this.speed;
        }
        this.sprite.move.walk(x, y);
    }
}
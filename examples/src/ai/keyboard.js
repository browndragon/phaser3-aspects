import Base from './base';

export default class Keyboard extends Base {
    static create({scene}) {
        scene[k] = scene.input.keyboard.createCursorKeys();
    }
    static update({scene}, _time, _delta) {
        let [x, y] = [0, 0];
        if (scene[k].up.isDown) {
            y = -1;
        }
        if (scene[k].down.isDown) {
            y = +1;
        }
        if (scene[k].left.isDown) {
            x = -1;
        }
        if (scene[k].right.isDown) {
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
const k = Symbol('keyboard');

import Aspect from 'phaser3-aspects';

export default class Base extends Aspect {
    get sprite() {
        return this.object;
    }
}

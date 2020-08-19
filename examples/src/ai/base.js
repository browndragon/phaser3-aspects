import Aspect from 'phaser3-aspects';

export default class Base extends Aspect {
    get speed() {
        console.assert(this.config.speed);
        return this.config.speed;
    }
}

import Aspects from 'phaser3-aspects';

export default class Base extends Aspects.Aspect {
    constructor(group, object, {speed}) {
        super(group, object);
        this.speed = speed;
    }
}

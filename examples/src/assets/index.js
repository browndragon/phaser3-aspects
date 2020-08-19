import arrow from './arrow';
import star from './star';
import wheel from './wheel';

import Aspect from 'phaser3-aspects';

export default class Sprite extends Aspect.Union({arrow, star, wheel}) {}

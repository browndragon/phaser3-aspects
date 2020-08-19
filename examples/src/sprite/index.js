import arrow from './arrow';
import star from './star';

import Aspects from 'phaser3-aspects';

export default class Sprite extends Aspects.Union.of({arrow, star}) {}

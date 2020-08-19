import keyboard from './keyboard';
import random from './random';
import Aspects from 'phaser3-aspects';

export default class AI extends Aspects.Union.of({keyboard, random}) {}
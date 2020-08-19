import keyboard from './keyboard';
import random from './random';
import Aspect from 'phaser3-aspects';

export default class AI extends Aspect.Union({keyboard, random}) {}
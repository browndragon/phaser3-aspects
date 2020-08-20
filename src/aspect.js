import Relation from './relation';

import Phaser from 'phaser';

export default class Aspect {
    constructor(
        context,
        sprite,
        config,
    ) {
        this[X] = context;
        this[S] = sprite;
        for (let [key, value] of Object.entries(config)) {
            this[key] = value;
        }
    }

    // Called on scene stage (assuming registered before).
    static init(_context, _data) {}

    // Called on scene stage (assuming registered before).
    static preload(_context) {}

    // Called on scene stage (assuming registered before).
    static create(_context, _data) {}

    // Called on scene stage (assuming registered before).
    // If this returns truthy, every member of the group will be invoked with that value.
    // Falsey, they will not be invoked.
    static update(_context, _time, _delta) {
        return undefined;
    }
    // See static update; called on each aspect instance with the update return.
    update(_fromStatic) {
        throw 'unimplemented';
    }

    get context() {
        return this[X];
    }
    get scene() {
        return this[X].scene;
    }
    get sprite() {
        return this[S];
    }

    // Algebraic type support.
    // See index.js' extentions Struct and Union.
    static get [Relation.T]() {
        return Relation.leaf;
    }
    // See `[Relation.T]` above.
    static get [Relation.C]() {
        return EMPTY_MAP;
    }

    // Called on aspect destruction via `unbind`.
    destructor() {
        this[S] = undefined;
        this[C] = undefined;
    }
}

const X = Symbol('Context');
const S = Symbol('Sprite');

const EMPTY_MAP = new Map();
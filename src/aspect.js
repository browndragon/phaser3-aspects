import Relation from './relation';
import Scene from './scene';
import mappify from './mappify';

import Phaser from 'phaser';

export default class Aspect {
    constructor(
        sprite,
        config,
        node
    ) {
        this[S] = sprite;
        this[C] = config;
        this[N] = node;
    }

    static get Scene() {
        return Scene;
    }

    // Creates a new aspect whose config is a constructed set of its inner aspects.
    static Struct(module) {
        module = mappify(module);
        return class extends this {
            static get [Relation.T]() {
                return Relation.struct;
            }
            static get [Relation.C]() {
                return module;
            }
        }
    }
    // Creates a new aspect which returns the unique named sub-aspect from its config.
    static Union(module) {
        module = mappify(module);
        return class extends this {
            constructor() {
                throw 'Uninstantiable';
            }
            static get [Relation.T]() {
                return Relation.union;
            }
            static get [Relation.C]() {
                return module;
            }
        }
    }

    // Called on install to create a phaser group.
    // This isn't REALLY a group; you shouldn't add/remove from it since it won't forward to
    // the actual aspects. But it's usable as a collision entity etc if you can find it.
    static group({scene}) {
        console.assert(scene);
        return new Phaser.GameObjects.Group(scene);
    }

    // Called on scene stage (assuming registered before).
    static init(data, node) {}

    // Called on scene stage (assuming registered before).
    static preload(node) {}

    // Called on scene stage (assuming registered before).
    // If this returns a group, all created instances will be added to that group.
    static create(data, node) {}

    // Called on scene stage (assuming registered before).
    // If this returns truthy, every member of the group will be invoked with that value.
    // Falsy, they will not be invoked.
    static update(time, delta, node) {
        return undefined;
    }
    // See static update; called on each aspect instance with the update return.
    update(fromStatic) {
        throw 'unimplemented';
    }

    get sprite() {
        return this[S];
    }
    get config() {
        return this[C];
    }
    get scene() {
        return this[N].scene;
    }
    get siblings() {
        return this[N].aspects;
    }
    get group() {
        return this[N].group;
    }

    static get [Relation.T]() {
        return Relation.leaf;
    }        
    static get [Relation.C]() {
        return EMPTY_MAP;
    }

    // Called on exit group (every time).
    destructor() {
        this[S] = undefined;
        this[C] = undefined;
    }
}

const S = Symbol('Sprite');
const C = Symbol('Config');
const N = Symbol('Node');

const EMPTY_MAP = new Map();
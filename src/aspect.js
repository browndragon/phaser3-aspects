import Relation from './relation';
import Phaser from 'phaser';

export default class Aspect {
    constructor(
        // The aspect context for accessing shared objects like scene and group.
        context,
        // The aspect's binding -- the specific sprite, target-within-sprite for this aspect,
        // and config for this target/sprite pair.
        {
            sprite,
            config={},
        },
    ) {
        this[X] = context;
        this[S] = sprite;
        this[C] = config;
    }

    // As struct; explicitly responsible for starting the aspect subsystem.
    static Root(module) {
        return class extends this.Struct(submodules) {
            static get [Relation.T]() {
                return Relation.struct;
            }
            static getConfigRoot(object) {
                return object.config;
            }
            static getTargetRoot(object) {
                return object;
            }
        }
    }
    // Creates a new aspect whose config is a constructed set of its inner aspects.
    static Struct(module) {
        return class extends Aspect {
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
        return class extends Aspect {
            static get [Relation.T]() {
                return Relation.union;
            }
            static get [Relation.C]() {
                return module;
            }
        }
    }

    // Called during context construction (usually before even init).
    // Provided so that groups can be physics groups, have additional params, etc.
    // Callbacks are managed by the context!
    // Can also return undefined for aspects without groups.
    static group(context) {
        return new Phaser.GameObjects.Group(context.scene);
    }

    // Called on scene stage (assuming registered before).
    static init(context, data) {}
    // Called on scene stage (assuming registered before).
    static preload(context) {}
    // Called on scene stage (assuming registered before).
    static create(context, data) {}
    // Called on scene stage (assuming registered before).
    // If this returns truthy, every member of the group will be invoked with that value.
    // Falsy, they will not be invoked.
    static update(context, time, delta) {
        return undefined;
    }
    // See static update; called on each aspect instance.
    update(fromStatic) {
        throw 'unimplemented';
    }

    get context() {
        return this[X];
    }
    get sprite() {
        return this[S];
    }
    get config() {
        return this[C];
    }

    static get [Relation.T]() {
        return Relation.leaf;
    }
    // Called on exit group (every time).
    destructor() {
        this[X] = undefined;
        this[S] = undefined;
        this[C] = undefined;
    }
}

const X = Symbol('Context');
const S = Symbol('Sprite');
const P = Symbol('Config');

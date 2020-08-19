import Aspect from './aspect';
import Relation from './relation';

class Context {
    constructor(scene, aspect) {
        this[S] = scene;
        this[A] = aspect;
        this[G] = null;
        this[C] = new Map();
        switch (aspect[Relation.T]) {
            case Relation.leaf:
                break;
            case Relation.struct:
            case Relation.root:
            case Relation.union:
                for (let [name, innerAspect] of Object.entries(aspect[Relation.C])) {
                    this[C].set(name, new this.constructor(scene, innerAspect));
                }
                break;
            default:
                throw 'unhandled relation';
        }
    }
    _init() {
        this.visit((c) => {
            let newGroup = c[A].group(this);
            if (newGroup) {
                this[G] = newGroup;
            }
        });
    }
    visit(onContext) {
        let results = [];
        for (let [name, child] of this[C]) {
            results[name] = child.visit(onContext);
        }
        return onContext(this, results);
    }
    add(sprite, target) {
        if (!target) {
            target = sprite;
        }
        switch (this[A][Relation.T]) {
            case Relation.leaf:

                break;
            case Relation.struct:
            case Relation.root:
            case Relation.union:
                for (let [name, innerAspect] of Object.entries(aspect[Relation.C])) {
                    this[C].set(name, new this.constructor(scene, innerAspect));
                }
                break;
            default:
                throw 'unhandled relation';
        }
    }
}

const P = Symbol('Parent');
const S = Symbol('Scene');
const A = Symbol('Aspect');
const G = Symbol('Group');
const C = Symbol('Children');

import Base from './aspect';
import Grouping from './grouping';
import Meta from './meta';
import Scene from './scene';
import mappify from './mappify';

export default class Aspect extends Base {
    static get Scene() {
        return Scene;
    }

    // Creates a new aspect whose membership is mirrored in one (or more!) Phaser groups.
    // There's some subtlety here around subclassing.
    // When you call something like `class Foo extends Aspect.Grouping(({scene}) => scene.add.group)`, you're defining a single group. All subclasses of Foo will use the *same* group instance for all of their operations -- so if you have `class Bar extends Foo{}` and `class Baz extends Foo{}`, the group you get for Bar and Baz will reuse the same root Foo group.
    // This is *extremely* useful when combined with Unions & a base class, where all participants in the union extend a base class which extends a single grouping; any members of the union which require *additional* groups can extend another goruping themselves.
    // For instance in the above Foo/Bar/Baz example, `class Baz extends Foo.Grouping(...) {}` since `Foo extends Aspect.Grouping`, there's one group there, and the additional call @ Baz creates a second group.
    static Grouping(...params) {
        return Grouping(this, ...params);
    }

    // Creates a new aspect whose config is a constructed set of its inner aspects.
    // Note you can include elements in the module which are empty to pass elements from
    // the config straight through into the struct aspect.
    static Struct(module) {
        return Meta.extend(this, Meta.struct, mappify(module));
    }

    // Creates a new aspect which returns the unique named sub-aspect from its config.
    // Note that you can include elements in the module which are empty to pass elements from the config straight through as the result. However, since you lose type information by doing so, this is NOT recommended!
    static Union(module) {
        return Meta.extend(this, Meta.union, mappify(module));
    }
}

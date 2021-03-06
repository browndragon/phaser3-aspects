# Phaser3 Aspects

This library provides hooks for [Aspect oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) + [Phaser3](phaser.io).

This is a natural paradigm in some ways: many phaser operations provide GameObject instances (arcade sprites, normal images, tilemap layers, etc) which are not amenable to subclassing but which nonetheless need special handling around their instantiation and (especially) updating.

Examples of aspects you might implement for your game include:
* Sprite loading and configuration (loading assets, providing colliders)
* An AI subsystem (which itself might be composed of sub-components like human-directed, homing missiles, randomwalk, etc).
* A movement subsystem (giving sprites maximum speeds, associating animations with sprite actions)
* Managing child scenes like a Loading splashscreen or a HUD
* many more!
Consider: your sprite configuration depends on your AI depends on your movement depends on your HUD. To some degree, you will want these dependencies (after all, your AI subsystem will be telling your game components to move), but to many more you will not (after all, your AI should not contain the generic logic to play walking animations!). This library provides that abstraction.

# Installation
A standard
```
npm i phaser3-aspects --save
```
will fetch the library; then use within your code with
```
import Phaser from 'phaser';
import Aspect from 'phaser3-aspects';
class FooAspect extends Aspect {...};
class FooScene extends Aspect.Scene({FooAspect}) {
    create(data) {
        super.create(data);
        this.bind(this.add.sprite(0, 0), {FooAspect:{...}});
    }
}
```
(Read on for much more explanation!)

## A note on `import Phaser from 'phaser'`
This line must proceed any transitive `import Aspect from 'phaser3-aspects'`, because due to npm architecture & peerDependencies, this library depends on Phaser being defined as a global symbol.

It's safest to import Phaser as the first line in your main binary, any testing files, any example files, etc.

# Library Components
## Aspect
Aspects hook into the scene and object lifecycle to implement your cross-cutting logic.

Aspects can refer to other aspects using `Aspect.Union(module)` or `Aspect.Struct(module)` (see below for a discussion on `module`). Linking aspects with `Union`, `Struct`, and `Scene` forms a tree, where union aspects construct a single matching instance, and struct aspects construct all child instances and then wrap in a single node (see discussion on bind & config for these). Scene doesn't return an aspect, but otherwise behaves similarly to struct.

For example, AI forms a natural union, with a given sprite having exactly one strategy. On the other hand, sprite behaviors (like `Move`, `Attack`, etc) might form a struct of `Actions` (each one associated with different animations, attack damages, etc). The set of all installed components forms a Scene.

## `module`
In this library, `module` refers to an es6 `import * as Foo`, or else a `{foo: Foo, bar: Bar}` object, or else a `new Map(Object.entries(...))` of either of the previous two forms.

This assumes that the values are classes extending `Aspect` (including `Aspect.Struct(...)` and `.Union(...)`). This is very convenient if you follow the patterns given in the `examples/` directory, where the `ai` and `assets` form natural `Union` types in the `index.js` files.

If your aspects contain cross-dependencies, use of the `Map` form allows you to control the order in which their lifecycle methods will be called; unfortunately, construction will *always* use `Object.entries` traversal order on the input config (out of your control).

## `Aspect.bind(sprite, config)`
This instantiates Aspect instances. The same set of modules (and structs & unions) which constructed the scene must be present in the config; only config entries that are present will have Aspect instances constructed (and they will be given only their relevant portion of the full config).

So for instance:
`Aspect.bind(sprite1, {ai:{random:{speed:10}}})`
on a scene with
`Aspect.Scene({
    ai: Aspect.Union({
        random: class Random extends Aspect { get speed() { return this.config.speed } },
    }),
})`
will function correctly and give sprite1 a random AI; afterwards, `sprite1.ai.speed` will indeed be 10.
If you called the same scene with
`Aspect.bind(sprite2, {ai:{followPlayer:{}}})`
you would expect a failure, because you haven't registered a `followPlayer` member of the AI union. If you created one in the union, it would work in a logical way.

The preferred mechanism for calling this is `scene.bind(sprite, config)` referring to the `Aspect.Scene(...)` instance. This is easily accomplished during the `create` lifecycle method below from any sub-aspect, or might instead be done from your `Aspect.Scene` subclass.

## `Aspect.Scene` & lifecycle
Aspects are rooted at a `Root` aspect owned & constructed by `Aspect.Scene` (which otherwise functions similarly to a struct).

During each scene callback (`init`, `preload`, and `create`), your Aspect's static methods will be invoked. This happens in a postorder `module` traversal starting at the root.

If you override these methods, you *must* call the same method via `super`, or the aspect subsystem will not execute.

### `Aspect.update` & `aspect.update`

Your static `update` method determines whether your instance update method will be called by returning truthy values. This same value will be passed on to each aspect instance's update method.

In particular, the pseudocode within the update logic is:
```
let staticValue = this.update(time, delta, {this.aspect /*class*/, this.aspects, this.group, this.key, ...})
if (!staticValue) {
    return;
}
for (let aspectInstance of this.aspects) {
    aspectInstance.update(staticValue);
}
```
This follows the same module-tree-traversal order as other lifecycle calls.

### `Aspect.Grouping(...)`
Phaser groups are of special concern. Using `FooAspect.Grouping(...)` (or the base class, or whatever), you can produce an aspect instances of which are automatically registered in a scene-based group; on `destructor`, they're removed. This is a little subtle to use, since it's conceptually overloaded with the `Aspect.Union` concept.

Each unique call to `.Grouping` defines a new group; any subclass of a Grouping class can fetch the group with `FooClass.group(scene)`.

One common use case is:
```
class Base extends Aspect.Grouping() {}
class A extends Base {}
class B extends Base {}
class C extends Base {}
export default class U extends Aspect.Union({A, B, C}) {
    static group(scene) {
        return Base.group(scene);
    }
}
```
That is, a union of multiple classes which each extend the same grouping base class, and a courtesy method to get the (shared!) group into which each member would be placed.

It's very possible to add additional detail to only *some* members of the union:
```
class Base extends Aspect.Grouping() {}
class A extends Base {}
class B extends Base {}
export C extends Base.Grouping() {}
export default class U extends Aspect.Union({A, B, C}) {
    static group(scene) {
        return Base.group(scene);
    }
}
```
All members will automatically be placed in the Base group, and C members specifically will go in the C group; `C.group(scene)` will fetch the more specific group, and `A.group(scene)`, `B.group(scene)`, `Base.group(scene)` and as implemented `U.group(scene)` will return the group of all members.

If you *didn't* want C in the shared group, you would implement something like:
```
class Base extends Aspect() {}
export CommonGroup extends Base.Grouping() {}
class A extends CommonGroup {}
class B extends CommonGroup {}
export C extends Base.Grouping() {}
export default class U extends Aspect.Union({A, B, C}) {}
```
(perhaps it's no longer meaningful for U to expose a courtesy group? Perhaps you still would? Dealer's choice.)

---
Happy hacking!
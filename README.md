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

# Library Components
## Aspect
Aspects hook into the scene and object lifecycle to implement your cross-cutting logic.

Aspects can refer to other aspects using `Aspect.Union(module)` or `Aspect.Struct(module)` (see below for a discussion on `module`). Linking aspects with `Union`, `Struct`, and `Scene` forms a tree, where union aspects construct a single matching instance, and struct aspects construct all child instances and then wrap in a single node (see discussion on bind & config for these). Scene doesn't return an aspect, but otherwise behaves similarly to struct.

For example, AI forms a natural union, with a given sprite having exactly one strategy. On the other hand, sprite behaviors (like `Move`, `Attack`, etc) might form a struct of `Actions` (each one associated with different animations, attack damages, etc). The set of all installed components forms a Scene.

## `module`
In this library, `module` refers to an es6 `import * as Foo`, or else a `{foo: Foo, bar: Bar}` object, or else a `new Map(Object.entries(...))` of either of the previous two forms.

This assumes that the values are classes extending `Aspect` (including `Aspect.Struct(...)` and `.Union(...)`). This is very convenient if you follow the patterns given in the `examples/` directory, where the `ai` and `assets` form natural `Union` types in the `index.js` files.

If your aspects contain cross-dependencies, use of the `Map` form allows you to control the order in which their lifecycle methods will be called; unfortunately, construction will *always* use `Object.entries` traversal order on the input config.

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
will function correctly; afterwards, `sprite1.ai.speed` will indeed be 10.
If you called the same scene with
`Aspect.bind(sprite2, {ai:{followPlayer:{}}})`
you would expect a failure, because you haven't registered a `followPlayer` member of the AI union.

The preferred mechanism for calling this is `scene.bind(sprite, config)` referring to the `Aspect.Scene(...)` instance. This is easily accomplished during the `create` lifecycle method below from any sub-aspect, or might instead be done from your `Aspect.Scene` subclass.

## `Aspect.Scene` & lifecycle
Aspects are rooted at a `Root` aspect owned & constructed by `Aspect.Scene` (which otherwise functions similarly to a struct).

During the `Scene` constructor, each reachable Aspect will construct a `.group` in the scene (this is your chance to customize the created groups or to omit them entirely).

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

---
Happy hacking!
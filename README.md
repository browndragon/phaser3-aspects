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

# Library Components
## `Aspect` (and `Aspect.Repository`)
TL;DR: Aspects tie `object`s to `registries` with a `key`, so that `object.key` can access the methods on the aspect, and `registry.values()` can iterate over the extant aspects.

The implementation of aspect contained here is completely independent from phaser. You will likely not use `Aspect` directly, but instead prefer `Fragment`; you will however use the methods and classes introduced here.

`Aspect` is intended for subclassing. Subclass Aspect to add methods & fields to it which are relevant to the system the aspect implements. For instance:
```
import Phaser form 'phaser';
import Aspect from 'phaser3-aspects';

export default class Walk extends Aspect {
    static get key() {
        return 'walk';
    }
    onAdd() {
        super.onAdd();
        // All walkers are physics enabled.
        this.object.scene.physics.world.enable(this.object);
    }
    along(vector) {
        this.object.play(this.getAnimationName(vector));
        this.object.body.setVelocity(vector.x, vector.y);
    }
    getAnimationName(vector) {
        // Need to preload animation files and create animations, and provide some mapping based on `this.object` and the direction it's walking.
        throw 'Implementation of animation loading omitted; strongly consider using Fragment!';
    }
}
export default class Random extends Aspect {
    static get key() {
        return 'random';
    }
    constructor(params) {
        super(params);
        this.until = 0;
    }
    randomize(time) {
        if (time < this.until) {
            return;
        }
        this.object.walk.along(Phaser.Math.RandomXY());
    }
}
```
That seems super manual, but as an end result, your game code looks like:
```
import Phaser from 'phaser';
import {Random, Walk} from './myAspects';

export default class Game extends Phaser.Scene {
    preload() {
        this.move = Walk.newRegistry();
        this.ai = Random.newRegistry();
    }
    create() {
        for (let i = 0; i < 10; ++i) {
            this.configureSprite(this.add.sprite(
                Phaser.Math.RND.between(0, 800),
                Phaser.Math.RND.between(0, 600)
            ));
        }
    }
    configure(sprite) {
        this.move.offer(sprite);
        this.ai.offer(sprite);
    }
    update(time, delta) {
        for (let sprite of this.move) {
            sprite.random.randomize(time);
        }
    }
}
```

Again, strongly consider Fragment, which can substantially reduce this boilerplate.

## Shard & Subshards
A direct subclass of `Aspect` which provides a bundle of related aspect behaviors -- the "shard" refers to the idea that each implementation of Shard provides a part of an aspect, like a shard of a database.

A great example of Shards are the individual strategies for AI. In the previous example, all of the sprites had the same `Walk` and `Random` implementations. However, if some were AI controlled to `Random`walk but one was `Human` controlled (or human seeking, or any other distinct unit intelligence!), and moreover some were `Walk` but some were `Run` or `Bumble` or `Teleport`, we'd clearly need to modify the code. This could get very cumbersome, so Shard provides both a `Shard.Bundle` operation:
```
import Phaser from 'phaser';
import * as AIs from './ai';
import * as Moves from './move';
import Shard from './shard';
import previousGame from './lastExample';

// Gives each object a single `ai` which is the instance whose config matched the name.
class AI extends Shard.Matching('ai', AIs) {}
class Move extends Shard.Each('move', Moves) {}

export default class Game extends previousGame {
    preload() {
        this.move = Move.newRegistry();
        this.ai = AI.newRegistry();
    }
    update(time, delta) {
        for (let sprite of this.move) {
            sprite.ai.decide(time);
        }
    }

}

```
In this version, `Move` encapsulates all possible movement strategies and `AI` all possible move decisions. So all `AI` shards should be written to depend on `this.gameObject.move`, which might provide `this.gameObject.move.walk`, `this.gameObject.move.teleport` or might not, and only provide the methods the user is intended to call
import {Root} from './nodes';

import Phaser from 'phaser';

export default class Scene extends Phaser.Scene {
    constructor(module, ...params) {
        super(...params);
        this.root = Root.of(this, module);
    }

    bind(child, config) {
        return this.root.bind(child, config);
    }
    unbind(child) {
        return this.root.unbind(child);
    }

    init(data) {
        this.root.visit((node) => {
            node.aspect.init(data, node);
        });
    }
    preload() {
        this.root.visit((node) => {
            node.aspect.preload(node);
        });
    }
    create(data) {
        this.root.visit((node) => {
            node.aspect.create(data, node);
        });
    }
    update(time, delta) {
        this.root.visit((node) => {
            let parent = node.aspect.update(time, delta, node);
            if (!parent) {
                return;
            }
            for (let aspect of node.aspects) {
                aspect.update(parent);
            }
        });
    }
}

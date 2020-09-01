import {Root} from './nodes';

// Peer dependency, don't import or you'll get a second copy! Use the global instead.
// import Phaser from 'phaser';

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
        this[D] = data;
        this.root.visit((node) => {
            node.aspect.init(node.context, data);
        });
    }
    preload() {
        this.root.visit((node) => {
            node.aspect.preload(node.context, this[D]);
        });
    }
    create(data) {
        this.root.visit((node) => {
            node.aspect.create(node.context, data);
        });
    }
    update(time, delta) {
        this.root.visit((node) => {
            let parent = node.aspect.update(node.context, time, delta);
            if (!parent) {
                return;
            }
            for (let aspect of node.aspects || []) {
                aspect.update(parent);
            }
        });
    }
}
const D = Symbol('PassDataToPreload');
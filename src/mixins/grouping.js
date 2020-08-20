export default function Grouping(clazz, groupCb=undefined) {
    if (!groupCb) {
        groupCb = (scene) => scene.add.group();
    }
    let symbol = Symbol(`Grouping(${clazz.name})`);

    return class extends clazz {
        // Returns the shared group for this grouping cluster.
        static group(scene) {
            return ensureGroup(scene, symbol, groupCb);
        }
        constructor(...params) {
            super(...params);
            ensureGroup(this.scene, symbol, groupCb).add(this.sprite);
        }
        destructor() {
            ensureGroup(this.scene, symbol, groupCb).remove(this.sprite);
            super.destructor();
        }
    }    
}

function ensureGroup(scene, symbol, groupCb) {
    return scene[symbol] || (scene[symbol] = groupCb(scene));
}
import Multi from './multi';

export default class Union extends Multi {
    bind(sprite, config) {
        for (let [name, value] of Object.entries(config)) {
            return this.innerBind(sprite, name, value);
        }
        throw 'No union entry';
    }
    unbind(aspect) {
        if (!aspect) {
            return;
        }
        let innerNode = this.innerMap.get(aspect.context.key);
        console.assert(innerNode);
        innerNode.unbind(aspect);
    }
}
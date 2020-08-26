export default function Context({
    // Data specific to this Aspect class, passed into its static methods (inc. constructor).
    // For instance, if you have a Union(Foo, Bar), each of the Union class, Foo, and Bar would have separate `data` instances (even though no instances of the Union class would ever be created).
    // This is a useful hidden scratchspace to store aspect-specific data.
    data,
    // The last component of `path` -- like 'basename'.
    key,
    // The array prefix path to this object (not including key) -- like 'dirname'.
    path,
    // The merge-patch config of this node. This is the config at this node with the matching config clauses of all parent nodes merged on top.
    // For instance, if you have aspect B child of union A child of root, and root's config has {a:{b:{k1:'v'}}}, A's config has {b:{k2:'v'}} and B's config has {k3:'v'}, the context & node at B would get config {k1:v', k2:'v', k3:'v'}.
    config,
    // The scene this Aspect is registered & operating under.
    scene,
}) {
    return {data, key, path, config, scene};
}

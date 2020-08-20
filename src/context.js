export default function Context({
    // Data specific to this Aspect class, passed into its static methods (inc. constructor).
    // For instance, if you have a Union(Foo, Bar), each of the Union class, Foo, and Bar would have separate `data` instances (even though no instances of the Union class would ever be created).
    // This is a useful hidden scratchspace to store aspect-specific data.
    data,
    // The last component of `path` -- like 'basename'.
    key,
    // The string dotted prefix path to this object (not including key) -- like 'dirname'.
    path,
    // The scene this Aspect is registered & operating under.
    scene,
}) {
    return {data, key, path, scene};
}

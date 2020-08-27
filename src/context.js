export default function Context({
    // The last component of `path` -- like 'basename'.
    key,
    // The array prefix path to this object (not including key) -- like 'dirname'.
    path,
    // The scene this Aspect is registered & operating under.
    scene,
}) {
    return {key, path, scene};
}

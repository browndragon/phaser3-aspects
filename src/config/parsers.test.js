import * as p from './parsers';

describe('Parsers', () => {
    test('cls', () => {
        const C = class {
            constructor(params) {
                this.params = params
            }
        };
        let c = p.cls(C);
        expect(c(0)).toEqual(undefined);
        expect(c(undefined)).toEqual(undefined);
        expect(c(1)).toEqual(new C(1));
        expect(c({})).toEqual(new C({}));
        expect(c({a:1})).toEqual(new C({a:1}));
    });
    test('module', () => {
        let M = {
            A: class {
                constructor(a) {
                    this.a = a;
                }
            },
            B: class {
                constructor(b) {
                    this.b = b;
                }
            },
        };
        let m = p.module(M);
        expect(m.A(undefined)).toEqual(undefined);
        expect(m.A(12)).toEqual(new M.A(12));
        expect(m.B('b')).toEqual(new M.B('b'));
    });
    test('struct', () => {
        expect(p.struct({
            foo(v) {
                return v * 2;
            },
        })({foo:2, bar:4})).toEqual({foo:4});
        expect(
            (v) => Object.values(v).reduce((v1, v2)=>v1+v2, 0),
            p.struct({
                default(v) {
                    return v * 2;
                }
            })({foo:2, bar:4})).toEqual(12);
    });
    test('struct & module', () => {
        let m = {
            foo: class {
                constructor(f) {
                    this.f = f;
                }
            },
            bar: class {
                constructor(b) {
                    this.b = b;
                }
            }
        };
        let s = p.struct(p.module(m));
        expect(s({foo:0})).toEqual(undefined);
        expect(s({foo:10})).toEqual({foo:new m.foo(10)});
        expect(s({baz:10})).toEqual({baz:10});
        expect(s({foo:1, bar:2})).toEqual({foo:new m.foo(1), bar:new m.bar(2)});
    });

    test('union', () => {
        expect(p.union({
            foo(v) {
                return v * 2;
            },
            bar(v) {
                return v / 2;
            }
        })({foo:2, bar:4})).toEqual(4);
        expect(p.union({
            foo(v) {
                return v * 2;
            },
            bar(v) {
                return v / 2;
            },
        })({bar:4})).toEqual(2);
        expect(p.union({
            foo(v) {
                return v * 2;
            },
            bar(v) {
                return v / 2;
            }
        })({baz:10})).toEqual(undefined);
    });
    test('union & module', () => {
        let m = {
            foo: class {
                constructor(f) {
                    this.f = f;
                }
            },
            bar: class {
                constructor(b) {
                    this.b = b;
                }
            }
        };
        let s = p.struct(p.module(m));
        expect(s({foo:0})).toEqual(undefined);
        expect(s({foo:10})).toEqual(new m.foo(10));
        expect(s({baz:10})).toEqual(undefined);
        expect(s({bar:2})).toEqual(new m.bar(2));
    });
    test('nested', () => {
        let fm = {
            foo: class {
                constructor(o, cfg) {
                    this.o = o;
                    this.cfg = cfg;
                }
            },
        };
        let bm = {
            bar: class {
                constructor(o, cfg) {
                    this.o = o;
                    this.cfg = cfg;
                }
            },
            baz: class {
                constructor(o, cfg) {
                    this.o = o;
                    this.cfg = cfg;
                }                
            }
        };
        let parse = p.struct({
            f: p.thiscls(fm.foo),
            b: p.union(p.thismodule(bm)),
            //     bar(cfg) { return cfg && new m.bar(this, cfg); }
            //     baz(cfg) { return cfg && new m.baz(this, cfg); }
            // }),
        });
        let base = {
            base: true,
        };
        expect(parse.apply(base, {
            f:1, b:{bar:2},
        })).toEqual({
            f:new m.foo(base, 1),
            b:new m.bar(base, 2)
        });
        expect(parse.apply(base, {
            f:1, b:{bar:2},
        })).toEqual({
            f:new m.foo(base, 1),
            b:new m.bar(base, 2)
        });
    });
});
import { ObjectTypeDeclaration } from "typescript";

type BaseType = (typeof BaseType.types)[number];

namespace BaseType {
    export const types = ["string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function", "any"] as const;
    export function isBaseType(data: any): data is BaseType {
        return [...types].includes(data);
    }
}

interface Prototype<T, Args extends any[] = any[]> extends Function { new(...args: [...Args]): T, prototype: T }

type Type<T> = (
    | null
    | undefined
    | BaseType
    | Prototype<T>
    | PostType<Type<T>>
    | (Type<T>)[]
    | { [key: string]: Type<T> }
    | Set<T>
);

export type Infer<T> = (
    T extends null
    ? null
    : T extends undefined
    ? undefined
    : T extends BaseType
    ? Infer.InferBaseType<T>
    : T extends Prototype<infer P, infer Args>
    ? Infer.InferPrototype<T>
    : T extends Array<infer P>
    ? Infer<P>[]
    : T extends { [key: string]: infer P }
    ? { [K in keyof T]: Infer<T[K]> }
    : T extends PostType.Union<infer P, infer R>
    ? Infer<Infer<P[number]>>
    : T extends PostType<infer P, infer R>
    ? Infer<Infer<P>>
    : T
)

export namespace Infer {
    export type InferBaseType<T extends BaseType> = (
        T extends "string"
        ? string
        : T extends "number"
        ? number
        : T extends "bigint"
        ? bigint
        : T extends "boolean"
        ? boolean
        : T extends "symbol"
        ? symbol
        : T extends "undefined"
        ? undefined
        : T extends "object"
        ? object
        : T extends "function"
        ? Function
        : T extends "any"
        ? any
        : never
    )

    export type InferPrototype<T> = (
        T extends Prototype<infer P, infer Args>
        ? P
        : T
    )
    export type InferPostType<T> = (
        // Union
        T extends PostType.Union<infer P, infer R>
        ? Infer<Infer<P[number]>>
        // Rest PostType
        : T extends PostType<infer P, infer R>
        ? Infer<Infer<P>>
        : T
    )
}

export class PostType<T extends Type<P>, P = any> {
    readonly __expected__: T;
    constructor(expected: T) {
        this.__expected__ = expected;
    }
    static check() {

    }
    static enforce<T extends Type<P>, P>(expected: T, actual: Infer<Infer<T>>) {

    }
}

export namespace PostType {
    export class SpecialType {

    }
    export class Union<T extends Array<Type<P>>, P = any> extends PostType<T,P> {
        private readonly __UNION__ = "Union";
        constructor(...expected:[...T]){
            super(expected);
        }
    }
    export class Str<T extends readonly string[]> extends PostType<Set<T>> {
        private readonly __STR__ = "Str";
        private readonly __config__?:{
            len: {min?:number, max?:number},
        }
        constructor(strings:readonly string[]){
            super(new Set(strings) as any); 
        }
    }
}



/* BASIC */
const num = new PostType("number");
const strNumArray = new PostType(["string", "number"]);
const interf = new PostType({
    a : "number",
    b : "string",
    c : ["string", "number"],
    d : {
        a : "object"
    },
    e : undefined,
    f : null,
    g : Map
});

type Num = Infer<typeof num>
type StrNumArray = Infer<typeof strNumArray>
type Interf = Infer<typeof interf>
/* ADVANCED */
const pt_union = new PostType.Union("string","boolean")
type PT_Union = Infer<typeof pt_union>

const pt_set = new PostType.Str(<const>["asd"]); 
type PT_Set = Infer<typeof pt_set>; 

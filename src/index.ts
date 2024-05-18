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
    // ? 
    ? { [K in keyof T]: Infer<T[K]> }
    // PostTypes
        // Union
    : T extends PostType.Union<infer P, infer R>
    ? P extends Array<infer I> ? Infer<Infer<I>> : Infer<Infer<P>>
        // Optional
    : T extends PostType<infer P, infer R>
    ? Infer<Infer<P>>
    : T extends Set<infer P>
    ? Infer<P>
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
    
    // export type KeysIncludeOptional<T> = { [K in keyof T]: T[K] extends PostType.Optional<any> ? K : never }[keyof T]
    // export type InferOptional<T> = Omit<T, KeysIncludeOptional<T>> & Partial<Pick<T,KeysIncludeOptional<T>>>
}

export class PostType<T extends Type<P>, P = any> {
    readonly __expected__: T;
    constructor(expected: T) {
        this.__expected__ = expected;
    }
    enforce(actual:any){
        return PostType.enforce(this.__expected__, actual);
    }

    check(actual:any){
        try {
            this.enforce(actual);
            return true;
        } catch {
            return false;
        }
    }

    static check<T extends Type<P>, P>(expected: T, actual: any){
        try {
            PostType.enforce(expected, actual);
            return true;
        } catch {
            return false;
        }
    }
    
    static enforce<T extends Type<P>, P>(expected: T, actual: any){
        const PTE = PostType.PostTypeError;
        if (expected instanceof PostType){
            expected.enforce(actual);
        }
        else if (typeof expected === "string" && BaseType.types.includes(expected)){
            if (typeof actual !== expected) throw new PTE(expected, actual);
        }
        else if (Array.isArray(expected)){
            if (!Array.isArray(actual)) throw new PTE(expected, actual)
            for (const expItem of expected){
                for (const actItem of actual){
                    if (!PostType.check(expItem, actItem)) throw new PTE(expected, actual)
                }
            }
        }
        else if (expected instanceof Function){
            if (!(actual instanceof expected)) throw new PTE(expected, actual);
        }
        else if (expected instanceof Object){
            if (!(actual instanceof Object)) throw new PTE(expected, actual);
            if (Object.keys(actual).length > Object.keys(expected).length) throw new PTE(expected, actual, `Provided object contains unrecognized keys: [${Object.keys(actual).filter(k => !(k in expected))}]`)
            for (const key in expected){
                if (!PostType.check((expected as any)[key], (actual as any)[key])) throw new PTE(expected, actual)
            }
        }
        return true;
    }
}

export namespace PostType {
    export class Union<T extends (readonly [...Type<P>[]])[number], P = any> extends PostType<[...T[]],P> {
        private readonly __UNION__ = "Union";
        constructor(...expected:[...T[]]){
            super(expected);
        }
        enforce(actual: any): actual is T {
            for (const exp of this.__expected__){
                if (PostType.check(exp, actual)) return true;
            }
            throw new PostTypeError(this.__expected__, actual);
        }
    }
    export class Str<T extends "string" = "string"> extends PostType<T> {
        private readonly __STR__ = "Str";
        private readonly __constraints__?: RegExp | {
            len?: {min?:number, max?:number},
            upper?: boolean,
            lower?: boolean
        } 
        constructor(constraints?:Str['__constraints__']){
            super('string' as T);
            this.__constraints__ = constraints;
        }
        enforce(actual: any): actual is Infer<T> {
            if (typeof actual !== "string") throw new PostTypeError("string", actual);
            return true;
        }
    }
    export class Literal<T extends (readonly [...string[]])[number]> extends PostType<Set<T>> {
        private readonly __LITERAL__ = "Literal";
        constructor(...strings:T[]){
            super(new Set(strings) as any); 
        }
        [Symbol.toPrimitive](hint:any){
            return [...this.__expected__].map(x => `"${x}"`).join(" | ")
        }
        enforce(actual: any): actual is T {
            if (!this.__expected__.has(actual)) throw new PostTypeError(this, actual);
            return true;
        }
    }
    export class Int<T extends "number" = "number"> extends PostType<"number"> {
        private readonly __INT__ = "Int";
        private readonly __constraints__?: {
            min?:number,
            max?:number
        } & ({even?:boolean}|{odd?:boolean})
        constructor(constraints?:Int['__constraints__']){
            super('number');
            this.__constraints__ = constraints;
        }
        enforce(actual: any): actual is number {
            if (typeof actual !== "number") throw new PostTypeError("number", actual);
            return true;
        }
    }
    export class Float<T extends "number" = "number"> extends PostType<"number"> {
        private readonly __FLOAT__ = "Float";
        private readonly __constraints__?: {
            min?:number,
            max?:number,
        }
        constructor(constraints?:Int['__constraints__']){
            super('number');
            this.__constraints__ = constraints;
        }
        enforce(actual: any): actual is number {
            if (typeof actual !== "number") throw new PostTypeError("number", actual);
            return true;
        }
    }
    export class PostTypeError extends TypeError {
        constructor(expected:any, actual:any, message?:string){
            message = message ?? `\n  Expected: ${expected}\n  Actual: ${actual}`
            super(message);
        }
    }
}

export const literal = <T extends (readonly [...string[]])[number]>(...strings:T[]) => new PostType.Literal(...strings);
export const str = <T extends "string" = "string">(constraints?:PostType.Str['__constraints__']) => new PostType.Str(constraints)
export const union = <T extends (readonly [...Type<P>[]])[number], P = any>(...expected:[...T[]]) => new PostType.Union(...expected)
export const int = <T extends "number" = "number">(constraints?:PostType.Int['__constraints__']) => new PostType.Int(constraints)
export const float = <T extends "number" = "number">(constraints?:PostType.Float['__constraints__']) => new PostType.Float(constraints)






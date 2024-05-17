export type BaseType = (typeof BaseType.types)[number];
export namespace BaseType {
    export const types = ["string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function"] as const;
    export type Infer<T extends BaseType>
        = T extends "string"
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
        : T

    export function isBaseType(data: any): data is BaseType {
        return [...types].includes(data);
    }
}
export interface Prototype<T, Args=any> extends Function { new(...args: Args[]): T, prototype: T }

type Type<T> = (
    BaseType
    | Prototype<T>
    | (Type<T>)[]
    | {[key:string] : Type<T>}
);

type PType<T,P> = (
    Type<T>
    | PType<T,P>[]
    | {[key:string] : PType<T,P>}
)

export class PostType<T extends PType<P, P>, P> {
    readonly __expected__:T;
    constructor(expected:T){ 
        this.__expected__ = expected; 
    }
    validate(){

    }
    enforce(){

    }
}

export namespace PostType {
    export class Optional {
        
    }
}

export type Infer<T> = (
    T extends BaseType
    ? BaseType.Infer<T>
    : T extends Prototype<infer P, infer Args>
    ? P
    : T extends Array<infer P>
    ? Array<Infer<T[number]>>
    : T extends {[key:string] : Type<infer P>}
    ? {[K in keyof T] : Infer<T[K]>}
    : T extends PostType<infer P, infer R>
    ? Infer<P>
    : T
)


const num = new PostType("number");
type Num = Infer<typeof num>

const numArr = new PostType(["number", "string"])
type NumArr = Infer<typeof numArr>

const inst = new PostType(Set);
type Inst = Infer<typeof inst>

const interf = new PostType({
    str : "string",
    num : "number",
    strNumArr : ["string","number"],
    subInterf : {
        str : "string",
        setArr : [Set]
    }
});

type Interface = Infer<typeof interf>
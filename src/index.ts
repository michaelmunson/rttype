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
    | PostType<Type<T>>
    | (Type<T>)[]
    | {[key:string] : Type<T>}
);

// type PType<T> = (
//     Type<T> |
//     PostType<PType<T>> |
//     PType<T>[] | 
//     {[key:string] : PType<T>}
// )



export class PostType<T extends Type<P>, P = any> {
    readonly __expected__:T;
    constructor(expected:T){ 
        this.__expected__ = expected; 
    }
    validate(){

    }
    static enforce<T extends Type<P>, P>(expected:T, actual:Infer<Infer<T>>){

    }
}

export namespace PostType {

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
    ? Infer<Infer<P>>
    : T
) 
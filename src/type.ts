import { RTType } from "./rttype";

export class Type<T extends RTType> {
    readonly type:RTType
    constructor(type: T) {
        this.type = type;
    }
}

export namespace Type {
    export type From<T> = (
        T extends Type<infer V>
        ? RTType.From<V>
        : unknown
    )
}


const strNumArr = new Type(["string","number"]);

type StrNumArr = Type.From<typeof strNumArr> // (string|number)[]

const myInterface = new Type({
    name : "string",
    age : "number",
    friends : [{name: "string", age: "number"}],
})

type MyInterface = Type.From<typeof myInterface>
import { RTType } from "./rttype";

export class Type<T extends RTType> {
    readonly type:RTType
    constructor(type: T) {
        this.type = type;
    }
}

export namespace Type {
    export class Union<T extends RTType[]> extends Type<T> {
        private readonly __union__ = true;
        constructor(type: T) {
            super(type)
        }
    }

    export type From<T> = (
        T extends Union<infer V>
        ? RTType.From<V>[number]
        : T extends Type<infer R>
        ? RTType.From<R>
        : unknown
    )
}



const union = new Type.Union(['string','number'])
const strNumArr = new Type(['string','number']);

type Un = Type.From<typeof union>
type StrNumArr = Type.From<typeof strNumArr>

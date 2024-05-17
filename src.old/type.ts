import { RtType } from "./rttype";

type TypeArgs<T extends RtType> = (
    RtType |
    {[key:string]:RtType | Type<T>}
)

export class Type<T extends TypeArgs<V>, V extends RtType = any> {
    readonly expected:T
    constructor(expected: T) {
        this.expected = expected;
    }
    enforce(actual:any) : actual is any {
        return Type.enforce(this.expected, actual);
    }
    validate(actual:any) : actual is any {
        return Type.validate(this.expected, actual);
    }
    toString(){

    }
    static throw(expected:any, actual:any, message = 'Data provided did not match expected type'){
        throw new TypeError(`${message}:\n  Expected: ${Type.toString(expected)}\n  Acutal: ${actual}`)
    }
    static validate<T extends TypeArgs<R>|Type<R>, R extends RtType>(expected:T, actual:any) : actual is Type.Extract<T>{
        try {
            return this.enforce(expected, actual);
        } catch(e){
            return false;
        }
    }
    static enforce<T extends TypeArgs<R>|Type<R>, R extends RtType>(expected:T, actual:any) : actual is Type.Extract<T> {
        if (expected instanceof Type){
            this.enforce(expected.expected, actual);
        }
        else if (Array.isArray(expected)){
            if (!Array.isArray(actual)) {this.throw(expected, actual)}
            else {
                outer: 
                for (const i in actual){
                    const item = actual[i];
                    for (const t of expected){
                        if (this.validate(t, actual)) break outer;
                    }
                    this.throw(expected, item, `Error @ index[${i}]`)
                }
            }
        }
        else if (RtType.Core.Basic.isBasicType(expected)){
            if (typeof actual !== expected) {this.throw(expected, actual)};
        }
        else if (typeof expected === "function"){
            if (!(actual instanceof expected)) {this.throw(expected, actual)};
        }
        else if (typeof expected === "object"){
            if (typeof actual !== "object") {this.throw(expected, actual)}
            else {
                if (Object.keys(actual) > Object.keys(expected)){
                    let excessKeys = [] as string[];
                    for (const key in excessKeys){
                        if (!(key in expected)) excessKeys.push(key);
                    }
                    this.throw(actual, expected, `Object contains keys not defined by type: ${excessKeys.join(",")}`)
                } else {
                    for (const key in expected){
                        const type:any = expected[key];
                        const actualValue = actual[key];
                        if (type instanceof Type.Optional){
                            type.enforce(actualValue); 
                        }
                        else if (type instanceof Type){
                            type.enforce(actualValue)
                        }
                        else {
                            if (!actualValue && !(key in actual)){this.throw(type, actualValue, `Required field "${key}" missing from type`)}
                            this.enforce(type, actualValue);
                        }
                    }
                }
            }
        }
        return true
    }
    static toString<T extends RtType|Type<R>, R extends RtType>(type:T) : string {
        return type.toString() ?? `${type}`;
    }
}

export namespace Type {
    export type Extract<T> = (
        // union
        T extends Union<infer V>
        ? Type.Extract<V>[number]
        // integer
        : T extends Integer
        ? number
        // float
        : T extends Float
        ? number
        // pattern
        : T extends Pattern
        ? string
        // gen type
        : T extends Type<infer V>
        ? V extends {[key:string]:Type<infer U>|RtType}
        ? {[K in keyof V] : Type.Extract<V[K]>}
        : RtType.From<V>
        : RtType.From<T>
    )

    export const union = <T extends RtType[]>(type:T) => new Union<T>(type);
    export class Union<T extends RtType> extends Type<T> {
        private readonly __UNION__ = true;
        constructor(type: T) {
            super(type)
        }
        enforce(actual: any): actual is any {
            return true;
        }
    }
    export const opt = <T extends RtType[]>(type:T) => new Optional<T>(type);
    export class Optional<T extends RtType[]> extends Type<T> {
        private readonly __OPTIONAL__ = true;
        constructor(type: T) {
            super(type)
        }
        enforce(actual: any): actual is any {
            return true;
        }
    }
    export const int = (config?:Integer['__config__']) => new Integer(config);
    export class Integer extends Type<"number"> {
        private readonly __INTEGER__ = true;
        private readonly __config__;
        constructor(config?:{min?:number, max?:number, coerce?:boolean}) {
            super("number");
            this.__config__ = config
        }
        enforce(actual: any): actual is any {
            return true;
        }
    }
    export const float = (config?:Float['__config__']) => new Float(config);
    export class Float extends Type<"number"> {
        private readonly __FLOAT__ = true;
        private readonly __config__;
        constructor(config?:{min?:number, max?:number, coerce?:boolean}) {
            super("number")
            this.__config__ = config
        }
        enforce(actual: any): actual is any {
            return true;
        }
    }
    export const pattern = (pattern:Pattern['__pattern__']) => new Pattern(pattern)
    export class Pattern extends Type<"string"> {
        private readonly __PATTERN__ = true;
        private readonly __pattern__:RegExp;
        constructor(pattern:RegExp) {
            super("string")
            this.__pattern__ = pattern;
        }
        enforce(actual: any): actual is any {
            return true;
        }
    }
    /**@wishlist
    export class Proto<T extends RtType.Core.Prototype<any>, V> extends Type<T> {
        private readonly __proto__ = true;
        constructor(type: T, subType:V) {
            super(type)
        }
    }
    */
}

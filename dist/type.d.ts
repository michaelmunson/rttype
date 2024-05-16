import { RtType } from "./rttype";
export declare class Type<T extends RtType> {
    readonly type: RtType;
    constructor(type: T);
}
export declare namespace Type {
    type Extract<T> = (T extends Union<infer V> ? RtType.From<V>[number] : T extends Integer ? number : T extends Float ? number : T extends Pattern ? string : T extends Type<infer V> ? RtType.From<V> : RtType.From<T>);
    class Union<T extends RtType[]> extends Type<T> {
        private readonly __UNION__;
        constructor(type: T);
    }
    class Optional<T extends RtType[]> extends Type<T> {
        private readonly __OPTIONAL__;
        constructor(type: T);
    }
    class Integer extends Type<"number"> {
        private readonly __INTEGER__;
        private readonly __config__;
        constructor(config?: {
            min?: number;
            max?: number;
            coerce?: boolean;
        });
    }
    class Float extends Type<"number"> {
        private readonly __FLOAT__;
        private readonly __config__;
        constructor(config?: {
            min?: number;
            max?: number;
            coerce?: boolean;
        });
    }
    class Pattern extends Type<"string"> {
        private readonly __PATTERN__;
        private readonly __pattern__;
        constructor(pattern: RegExp);
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

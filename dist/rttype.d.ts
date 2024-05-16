export type RtType = (RtType.Core | {
    [K: string]: RtType;
} | RtType[]);
export declare namespace RtType {
    type Core<T = any> = (Core.Basic | Core.Prototype<T>);
    namespace Core {
        type Basic = (typeof Basic.types)[number];
        namespace Basic {
            const types: readonly ["string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function"];
            type Extract<T extends Basic> = T extends "string" ? string : T extends "number" ? number : T extends "bigint" ? bigint : T extends "boolean" ? boolean : T extends "symbol" ? symbol : T extends "undefined" ? undefined : T extends "object" ? object : T extends "function" ? Function : T;
            function isBaseType(data: any): data is Basic;
        }
        interface Prototype<T, Args extends any[] = any[]> extends Function {
            new (...args: Args[]): T;
            prototype: T;
        }
        type From<T> = (T extends Basic ? Basic.Extract<T> : T extends Prototype<infer Class, infer Args> ? Class : T);
    }
    type From<T> = (T extends Core ? Core.From<T> : T extends RtType[] ? RtType.From<T[number]>[] : T extends {
        [K: string]: RtType;
    } ? {
        [K in keyof T]: RtType.From<T[K]>;
    } : T);
}

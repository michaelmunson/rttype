export type RtType = (
	RtType.Core | 
	{[K:string] : RtType} | 
	RtType[]
)

export namespace RtType {
	/* Core Types */
	export type Core<T = any> = (Core.Basic | Core.Prototype<T>)
	export namespace Core {
		export type Basic = (typeof Basic.types)[number];
		export namespace Basic {
			export const types = ["string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function"] as const;
			export type Extract<T extends Basic>
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

			export function isBasicType(data: any): data is Basic {
				return [...types].includes(data);
			}
		}
		export interface Prototype<T, Args extends any[] = any[]> extends Function { new(...args: Args[]): T, prototype: T }
		export type From<T> = (
			T extends Basic
			? Basic.Extract<T>
			: T extends Prototype<infer Class, infer Args>
			? Class
			: T
		)
	}

	export type From<T> = (
		T extends Core
		? Core.From<T>
		: T extends RtType[]
		? RtType.From<T[number]>[]
		: T extends {[K:string] : RtType}
		? {[K in keyof T] : RtType.From<T[K]>}
		: T
	)
}


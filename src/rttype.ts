export type RTType = (
	RTType.Core | 
	{[K:string] : RTType} | 
	RTType[]
)

export namespace RTType {
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
				: unknown

			export function isBaseType(data: any): data is Basic {
				return types.includes(data);
			}
		}
		export interface Prototype<T> extends Function { new(...args: any[]): T, prototype: T }
		export type From<T> = (
			T extends Basic
			? Basic.Extract<T>
			: T extends Prototype<infer Class>
			? Class
			: unknown
		)
	}

	export type From<T> = (
		T extends Core
		? Core.From<T>
		: T extends RTType[]
		? RTType.From<T[number]>[]
		: T extends {[K:string] : RTType}
		? {[K in keyof T] : RTType.From<T[K]>}
		: unknown
	)
}


import { describe, test } from "bun:test";

type Callable = (...args: any[]) => any;

function withPrefixedName<T>(fn: T, prefix: string): T {
	if (typeof fn !== "function") {
		return fn;
	}

	return new Proxy(fn as Callable, {
		apply(target, thisArg, args) {
			const nextArgs = [...args];

			if (typeof nextArgs[0] === "string") {
				nextArgs[0] = `${prefix} ${nextArgs[0]}`;
			}

			const result = Reflect.apply(target, thisArg, nextArgs);
			return typeof result === "function"
				? withPrefixedName(result, prefix)
				: result;
		},
		get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);
			if (typeof value !== "function") {
				return value;
			}

			const boundValue = value.bind(target);
			return withPrefixedName(boundValue, prefix);
		},
	}) as T;
}

export const given = withPrefixedName(describe, "GIVEN");
export const when = withPrefixedName(describe, "WHEN");

const thenTest = withPrefixedName(test, "THEN");

export function then(...args: Parameters<typeof test>) {
	return thenTest(...args);
}

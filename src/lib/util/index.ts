import cn from "./cn";
import { getRemoteJson, DataFilename } from "./getRemoteJson";
import { getSectionTimes } from "./getSectionTimes";
import { Clone } from "./interfaces";

export type RecordValues<T extends Record<string | number | symbol, unknown>> =
  T[keyof T];

export type Self<T> = { new (): T };

class Ref<T> implements Clone {
  #val: T;

  constructor(val: T) {
    this.#val = val;
  }

  public set(newVal: T) {
    this.#val = newVal;
  }

  public get(): T {
    return this.#val;
  }

  public getCloned(): T {
    return this.clone().get();
  }

  clone(): this {
    return structuredClone(this);
  }
}

export { cn, getRemoteJson, DataFilename, getSectionTimes, Ref };

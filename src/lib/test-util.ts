import { describe, test } from "bun:test";

export function given(what: string, f: () => void) {
  describe(`GIVEN ${what}`, f);
}

export function when(action: string, f: () => void) {
  describe(`WHEN ${action}`, f);
}

export function then(behavior: string, f: () => void) {
  test(`THEN ${behavior}`, f);
}

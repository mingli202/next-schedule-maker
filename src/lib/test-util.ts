import { describe, type SuiteFactory, type TestFunction, test } from "vitest";

export function given(what: string, f: SuiteFactory) {
  describe(`GIVEN ${what}`, f);
}

export function when(action: string, f: SuiteFactory) {
  describe(`WHEN ${action}`, f);
}

export function then(behavior: string, f: TestFunction) {
  test(`THEN ${behavior}`, f);
}

export function given(what: string, f: jest.EmptyFunction) {
  describe(`GIVEN ${what}`, f);
}

export function when(action: string, f: jest.EmptyFunction) {
  describe(`WHEN ${action}`, f);
}

export function then(behavior: string, f: jest.EmptyFunction) {
  test(`THEN ${behavior}`, f);
}

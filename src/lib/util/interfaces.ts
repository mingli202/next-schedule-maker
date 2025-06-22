export interface Default<T> {
  default: () => T;
}

export interface Clone {
  clone(): this;
}

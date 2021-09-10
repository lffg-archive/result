export type ResultType = 'ok' | 'err';

interface ResultPrototype<T, E> {
  $$data: T | E;
  $$type: ResultType;

  isOk(): this is Ok<T>;
  isErr(): this is Err<E>;
}

export interface Ok<T> extends ResultPrototype<T, unknown> {
  $$type: 'ok';
  $$data: T;

  data(): T;
  error(): never;
}

export interface Err<E> extends ResultPrototype<unknown, E> {
  $$type: 'err';
  $$data: E;

  data(): never;
  error(): E;
}

export type Result<T, E> = Ok<T> | Err<E>;

class BaseResult<T, E> implements ResultPrototype<T, E> {
  constructor(type: ResultType) {
    this.$$type =
  }

  isOk() {
    return this.$$type === 'ok';
  }
  isErr() {
    return this.$$type === 'err';
  }
}

class OkClass<T> extends BaseResult<T, never> implements Ok<T> {
  constructor(data: T) {
    this.$$data = data;
  }

  data(): T {
    return this.$$data;
  }
  error(): never {
    throw new Error();
  }
}

export function ok<T>(data: T): Ok<T> {
  const base: BaseResult<T, never> = Object.create(BaseResult.prototype);
  return Object.assign(base, {
    data() {}
  });
}

const a: Result<number, Error> = {} as Ok<number>;
const b: Result<string, TypeError> = {} as any;

if (a.isErr()) {
  console.log(a.error());
}

a.data();

if (b.isErr()) {
  throw b.error();
}

b.data();

// Util
function throwUnreachable(message?: string): never {
  throw new Error(message ? `Unreachable; ${message}` : 'Unreachable.');
}

type ResultType = 'ok' | 'err';

type ResultMatchMap<T, Tr, E, Er> = {
  ok: (data: T) => Tr;
  err: (error: E) => Er;
};

class BaseResult<T, E> {
  public $$type: ResultType;
  public $$data;

  constructor(type: ResultType, value: unknown) {
    if (new.target !== Ok || new.target !== Err) {
      throw new Error('Cannot instantiate Result directly. Use `Ok` or `Err`.');
    }
    this.$$type = type;
    this.$$data = value as any;
  }

  static ok<T>(data: T): Ok<T> {
    return new Ok(data);
  }

  static err<E>(error: E): Err<E> {
    return new Err(error);
  }

  // Checks if the Result is the ok variant.
  isOk(): this is Ok<T> {
    return this.$$type === 'ok';
  }

  // Checks if the Result is the err variant.
  isErr(): this is Err<E> {
    return this.$$type === 'err';
  }

  // Creates a new Result type by mapping the ok variant wrapped value.
  // Error variant is ignored (although a new Result is also created).
  map<U>(fn: (data: T) => U): BaseResult<U, E> {
    return this.match({
      ok: (data) => ok(fn(data)),
      err: (error) => err(error)
    });
  }

  // Throws an `Error` with `message` if the Result is the err variant.
  // Returns the wrapped value if the Result is the ok variant.
  expect(message: string): T {
    return this.match({
      ok: (data) => data,
      err: () => {
        throw new Error(message);
      }
    });
  }

  // Throws if the Result is err. Otherwise, returns the wrapped value.
  unwrap(): T {
    return this.expect('Cannot unwrap err Result variant');
  }

  // Match the result variant, executing a callback function and returning the value.
  match<Tr, Er>(matchMap: ResultMatchMap<T, Tr, E, Er>): Tr | Er {
    if (this.isOk()) {
      return matchMap.ok(this.$$data);
    }
    if (this.isErr()) {
      return matchMap.err(this.$$data);
    }
    throwUnreachable();
  }
}

class FooResult<T, E> {
  $$type: any;
  $$data: any;

  isErr(): this is Err<E> {
    return this.$$type === 'err';
  }
}

class Ok<T> extends FooResult<any, any> {
  $$type = 'ok' as const;
  $$data: T;

  constructor(data: T) {
    super();
    this.$$data = data;
  }

  data(): T {
    if (this.$$type !== 'ok') {
      throwUnreachable('`Ok.data` can be called only in Ok instance.');
    }
    return this.$$data;
  }
}

class Err<E> extends FooResult<any, any> {
  $$type = 'err' as const;
  $$data: E;

  constructor(error: E) {
    super();
    this.$$data = error;
  }

  error(): E {
    if (this.$$type !== 'err') {
      throwUnreachable('`Err.error` can be called only in Err instance.');
    }
    return this.$$data;
  }
}

// Creates a new ok variant Result.
function ok<T>(data: T): Ok<T> {
  return BaseResult.ok(data);
}

// Creates a new err variant Result.
function err<E>(error: E): Err<E> {
  return BaseResult.err(error);
}

type Result<T, E> = Ok<T> | Err<E>;

const a: Result<number, Error> = ok(123);
const b: Result<number, Error> = err(new Error('Olá!'));

if (a.isErr()) {
  throw a.error();
}

a.data();

const c: BaseResult<string, TypeError> = ok('Hello!');
const d: BaseResult<string, TypeError> = err(new TypeError('Invalid type.'));

void [a, b, c, d];

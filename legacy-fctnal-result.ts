/**
 * The `Ok` (type) variation.
 */
export type Ok<T> = { status: 'ok'; data: T };
/**
 * The `Err` (type) variation.
 */
export type Err<E> = { status: 'err'; data: E };

/**
 * **Super** simple adaptation of Rust's `Result<T, E>` type.
 */
export type Result<T, E> = Ok<T> | Err<E>;
/**
 * Alias of `Result<unknown, unknown>`.
 */
export type AnyResult = Result<unknown, unknown>;
/**
 * Alias of `Promise<Result<T, E>>`.
 */
export type PResult<T, E> = Promise<Result<T, E>>;

/**
 * Given a `Result<T, E>`, extracts type `T` (`Ok` variant).
 */
export type ExtractOk<R extends AnyResult, Default = never> = R extends Ok<
  infer OkT
>
  ? OkT
  : Default;
/**
 * Given a `Result<T, E>`, extracts type `E` (`Err` variant).
 */
export type ExtractErr<R extends AnyResult, Default = never> = R extends Err<
  infer ErrT
>
  ? ErrT
  : Default;

/**
 * Creates a `Result` in the `ok` variant.
 */
export function ok<T>(data: T): Ok<T> {
  return {
    status: 'ok',
    data
  };
}

/**
 * Creates a `Result` in the `err` variant.
 */
export function err<E>(data: E): Err<E> {
  return {
    status: 'err',
    data
  };
}

/**
 * Checks if the given `Result` is in the `ok` variant.
 */
export function isOk(result: AnyResult): result is Ok<any> {
  return result.status === 'ok';
}

/**
 * Checks if the given `Result` is in the `err` variant.
 */
export function isErr(result: AnyResult): result is Err<any> {
  return result.status === 'err';
}

/**
 * Given a `Result`, returns the data if state is `ok`. Otherwise will throw
 * the data (as it is in a `err` state).
 */
export function unwrap<R extends AnyResult>(result: R): ExtractOk<R> {
  if (isOk(result)) {
    return result.data;
  }

  if (isErr(result)) {
    throw result.data;
  }

  throw new Error('Unreachable.');
}

/**
 * Given a `Result`, returns the data if state is `ok`. Otherwise, will call a
 * callback (with the `err` data) to compute a default value, which must be
 * assignable to the `ok` state data type.
 */
export function unwrapOrElse<
  R extends AnyResult,
  Cb extends (errData: ExtractErr<R>) => ExtractOk<R, any>
>(result: R, cb: Cb): ExtractOk<R, ReturnType<Cb>> {
  if (isOk(result)) {
    return result.data;
  }

  if (isErr(result)) {
    return cb(result.data);
  }

  throw new Error('Unreachable.');
}

/**
 * Given a promise, returns a `Result<T, E>` where `T` is the promise's
 * resolution type and `E` is unknown (which may be an error thrown by the
 * promise).
 */
export function wrapPromise<T>(promise: Promise<T>): PResult<T, unknown> {
  return promise.then(ok).catch((error: unknown) => err(error));
}

/**
 * Given an array of results of type `Array<Result<T, E>>`, returns a result of
 * type `Result<T[], E>`.
 */
export function packResults<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const final: T[] = [];
  for (const result of results) {
    if (isErr(result)) {
      return result;
    }
    final.push(result.data);
  }
  return ok(final);
}

//

//

//

//

//

//

//

const a: Result<number, Error> = ok(123);
const b: Result<string, TypeError> = {} as any;

if (isErr(a)) {
  console.log(a.data);
}

a.data();

if (b.isErr()) {
  throw b.error();
}

b.data();

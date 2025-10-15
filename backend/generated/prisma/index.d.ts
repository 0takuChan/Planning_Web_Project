
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model Employee
 * 
 */
export type Employee = $Result.DefaultSelection<Prisma.$EmployeePayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Job
 * 
 */
export type Job = $Result.DefaultSelection<Prisma.$JobPayload>
/**
 * Model Step
 * 
 */
export type Step = $Result.DefaultSelection<Prisma.$StepPayload>
/**
 * Model JobStep
 * 
 */
export type JobStep = $Result.DefaultSelection<Prisma.$JobStepPayload>
/**
 * Model Planning
 * 
 */
export type Planning = $Result.DefaultSelection<Prisma.$PlanningPayload>
/**
 * Model ProductionLog
 * 
 */
export type ProductionLog = $Result.DefaultSelection<Prisma.$ProductionLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Roles
 * const roles = await prisma.role.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Roles
   * const roles = await prisma.role.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.employee`: Exposes CRUD operations for the **Employee** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Employees
    * const employees = await prisma.employee.findMany()
    * ```
    */
  get employee(): Prisma.EmployeeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.job`: Exposes CRUD operations for the **Job** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jobs
    * const jobs = await prisma.job.findMany()
    * ```
    */
  get job(): Prisma.JobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.step`: Exposes CRUD operations for the **Step** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Steps
    * const steps = await prisma.step.findMany()
    * ```
    */
  get step(): Prisma.StepDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jobStep`: Exposes CRUD operations for the **JobStep** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JobSteps
    * const jobSteps = await prisma.jobStep.findMany()
    * ```
    */
  get jobStep(): Prisma.JobStepDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.planning`: Exposes CRUD operations for the **Planning** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plannings
    * const plannings = await prisma.planning.findMany()
    * ```
    */
  get planning(): Prisma.PlanningDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productionLog`: Exposes CRUD operations for the **ProductionLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductionLogs
    * const productionLogs = await prisma.productionLog.findMany()
    * ```
    */
  get productionLog(): Prisma.ProductionLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.0
   * Query Engine version: c0aafc03b8ef6cdced8654b9a817999e02457d6a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Role: 'Role',
    Employee: 'Employee',
    Customer: 'Customer',
    Job: 'Job',
    Step: 'Step',
    JobStep: 'JobStep',
    Planning: 'Planning',
    ProductionLog: 'ProductionLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "role" | "employee" | "customer" | "job" | "step" | "jobStep" | "planning" | "productionLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      Employee: {
        payload: Prisma.$EmployeePayload<ExtArgs>
        fields: Prisma.EmployeeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmployeeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmployeeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          findFirst: {
            args: Prisma.EmployeeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmployeeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          findMany: {
            args: Prisma.EmployeeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>[]
          }
          create: {
            args: Prisma.EmployeeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          createMany: {
            args: Prisma.EmployeeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmployeeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>[]
          }
          delete: {
            args: Prisma.EmployeeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          update: {
            args: Prisma.EmployeeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          deleteMany: {
            args: Prisma.EmployeeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmployeeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EmployeeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>[]
          }
          upsert: {
            args: Prisma.EmployeeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          aggregate: {
            args: Prisma.EmployeeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmployee>
          }
          groupBy: {
            args: Prisma.EmployeeGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmployeeGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmployeeCountArgs<ExtArgs>
            result: $Utils.Optional<EmployeeCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Job: {
        payload: Prisma.$JobPayload<ExtArgs>
        fields: Prisma.JobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findFirst: {
            args: Prisma.JobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findMany: {
            args: Prisma.JobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          create: {
            args: Prisma.JobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          createMany: {
            args: Prisma.JobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          delete: {
            args: Prisma.JobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          update: {
            args: Prisma.JobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          deleteMany: {
            args: Prisma.JobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          upsert: {
            args: Prisma.JobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          aggregate: {
            args: Prisma.JobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob>
          }
          groupBy: {
            args: Prisma.JobGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobCountArgs<ExtArgs>
            result: $Utils.Optional<JobCountAggregateOutputType> | number
          }
        }
      }
      Step: {
        payload: Prisma.$StepPayload<ExtArgs>
        fields: Prisma.StepFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StepFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StepFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          findFirst: {
            args: Prisma.StepFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StepFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          findMany: {
            args: Prisma.StepFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>[]
          }
          create: {
            args: Prisma.StepCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          createMany: {
            args: Prisma.StepCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StepCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>[]
          }
          delete: {
            args: Prisma.StepDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          update: {
            args: Prisma.StepUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          deleteMany: {
            args: Prisma.StepDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StepUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StepUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>[]
          }
          upsert: {
            args: Prisma.StepUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          aggregate: {
            args: Prisma.StepAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStep>
          }
          groupBy: {
            args: Prisma.StepGroupByArgs<ExtArgs>
            result: $Utils.Optional<StepGroupByOutputType>[]
          }
          count: {
            args: Prisma.StepCountArgs<ExtArgs>
            result: $Utils.Optional<StepCountAggregateOutputType> | number
          }
        }
      }
      JobStep: {
        payload: Prisma.$JobStepPayload<ExtArgs>
        fields: Prisma.JobStepFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobStepFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobStepFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload>
          }
          findFirst: {
            args: Prisma.JobStepFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobStepFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload>
          }
          findMany: {
            args: Prisma.JobStepFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload>[]
          }
          create: {
            args: Prisma.JobStepCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload>
          }
          createMany: {
            args: Prisma.JobStepCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobStepCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload>[]
          }
          delete: {
            args: Prisma.JobStepDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload>
          }
          update: {
            args: Prisma.JobStepUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload>
          }
          deleteMany: {
            args: Prisma.JobStepDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobStepUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JobStepUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload>[]
          }
          upsert: {
            args: Prisma.JobStepUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobStepPayload>
          }
          aggregate: {
            args: Prisma.JobStepAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJobStep>
          }
          groupBy: {
            args: Prisma.JobStepGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobStepGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobStepCountArgs<ExtArgs>
            result: $Utils.Optional<JobStepCountAggregateOutputType> | number
          }
        }
      }
      Planning: {
        payload: Prisma.$PlanningPayload<ExtArgs>
        fields: Prisma.PlanningFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanningFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanningFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload>
          }
          findFirst: {
            args: Prisma.PlanningFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanningFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload>
          }
          findMany: {
            args: Prisma.PlanningFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload>[]
          }
          create: {
            args: Prisma.PlanningCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload>
          }
          createMany: {
            args: Prisma.PlanningCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlanningCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload>[]
          }
          delete: {
            args: Prisma.PlanningDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload>
          }
          update: {
            args: Prisma.PlanningUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload>
          }
          deleteMany: {
            args: Prisma.PlanningDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanningUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlanningUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload>[]
          }
          upsert: {
            args: Prisma.PlanningUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanningPayload>
          }
          aggregate: {
            args: Prisma.PlanningAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlanning>
          }
          groupBy: {
            args: Prisma.PlanningGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanningGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanningCountArgs<ExtArgs>
            result: $Utils.Optional<PlanningCountAggregateOutputType> | number
          }
        }
      }
      ProductionLog: {
        payload: Prisma.$ProductionLogPayload<ExtArgs>
        fields: Prisma.ProductionLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductionLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductionLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload>
          }
          findFirst: {
            args: Prisma.ProductionLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductionLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload>
          }
          findMany: {
            args: Prisma.ProductionLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload>[]
          }
          create: {
            args: Prisma.ProductionLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload>
          }
          createMany: {
            args: Prisma.ProductionLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductionLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload>[]
          }
          delete: {
            args: Prisma.ProductionLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload>
          }
          update: {
            args: Prisma.ProductionLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload>
          }
          deleteMany: {
            args: Prisma.ProductionLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductionLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductionLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload>[]
          }
          upsert: {
            args: Prisma.ProductionLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLogPayload>
          }
          aggregate: {
            args: Prisma.ProductionLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductionLog>
          }
          groupBy: {
            args: Prisma.ProductionLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductionLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductionLogCountArgs<ExtArgs>
            result: $Utils.Optional<ProductionLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    role?: RoleOmit
    employee?: EmployeeOmit
    customer?: CustomerOmit
    job?: JobOmit
    step?: StepOmit
    jobStep?: JobStepOmit
    planning?: PlanningOmit
    productionLog?: ProductionLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    employees: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employees?: boolean | RoleCountOutputTypeCountEmployeesArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountEmployeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeWhereInput
  }


  /**
   * Count Type EmployeeCountOutputType
   */

  export type EmployeeCountOutputType = {
    jobs: number
    productionLogs: number
  }

  export type EmployeeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | EmployeeCountOutputTypeCountJobsArgs
    productionLogs?: boolean | EmployeeCountOutputTypeCountProductionLogsArgs
  }

  // Custom InputTypes
  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeCountOutputType
     */
    select?: EmployeeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeCountJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
  }

  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeCountProductionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionLogWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    jobs: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | CustomerCountOutputTypeCountJobsArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
  }


  /**
   * Count Type JobCountOutputType
   */

  export type JobCountOutputType = {
    jobSteps: number
    plannings: number
    productionLogs: number
  }

  export type JobCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobSteps?: boolean | JobCountOutputTypeCountJobStepsArgs
    plannings?: boolean | JobCountOutputTypeCountPlanningsArgs
    productionLogs?: boolean | JobCountOutputTypeCountProductionLogsArgs
  }

  // Custom InputTypes
  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobCountOutputType
     */
    select?: JobCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountJobStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobStepWhereInput
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountPlanningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanningWhereInput
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountProductionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionLogWhereInput
  }


  /**
   * Count Type StepCountOutputType
   */

  export type StepCountOutputType = {
    jobSteps: number
  }

  export type StepCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobSteps?: boolean | StepCountOutputTypeCountJobStepsArgs
  }

  // Custom InputTypes
  /**
   * StepCountOutputType without action
   */
  export type StepCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepCountOutputType
     */
    select?: StepCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StepCountOutputType without action
   */
  export type StepCountOutputTypeCountJobStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobStepWhereInput
  }


  /**
   * Count Type JobStepCountOutputType
   */

  export type JobStepCountOutputType = {
    plannings: number
    productionLogs: number
  }

  export type JobStepCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plannings?: boolean | JobStepCountOutputTypeCountPlanningsArgs
    productionLogs?: boolean | JobStepCountOutputTypeCountProductionLogsArgs
  }

  // Custom InputTypes
  /**
   * JobStepCountOutputType without action
   */
  export type JobStepCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStepCountOutputType
     */
    select?: JobStepCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JobStepCountOutputType without action
   */
  export type JobStepCountOutputTypeCountPlanningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanningWhereInput
  }

  /**
   * JobStepCountOutputType without action
   */
  export type JobStepCountOutputTypeCountProductionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleAvgAggregateOutputType = {
    role_id: number | null
  }

  export type RoleSumAggregateOutputType = {
    role_id: number | null
  }

  export type RoleMinAggregateOutputType = {
    role_id: number | null
    role_name: string | null
  }

  export type RoleMaxAggregateOutputType = {
    role_id: number | null
    role_name: string | null
  }

  export type RoleCountAggregateOutputType = {
    role_id: number
    role_name: number
    _all: number
  }


  export type RoleAvgAggregateInputType = {
    role_id?: true
  }

  export type RoleSumAggregateInputType = {
    role_id?: true
  }

  export type RoleMinAggregateInputType = {
    role_id?: true
    role_name?: true
  }

  export type RoleMaxAggregateInputType = {
    role_id?: true
    role_name?: true
  }

  export type RoleCountAggregateInputType = {
    role_id?: true
    role_name?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _avg?: RoleAvgAggregateInputType
    _sum?: RoleSumAggregateInputType
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    role_id: number
    role_name: string
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    role_id?: boolean
    role_name?: boolean
    employees?: boolean | Role$employeesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    role_id?: boolean
    role_name?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    role_id?: boolean
    role_name?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    role_id?: boolean
    role_name?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"role_id" | "role_name", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employees?: boolean | Role$employeesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      employees: Prisma.$EmployeePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      role_id: number
      role_name: string
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `role_id`
     * const roleWithRole_idOnly = await prisma.role.findMany({ select: { role_id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `role_id`
     * const roleWithRole_idOnly = await prisma.role.createManyAndReturn({
     *   select: { role_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `role_id`
     * const roleWithRole_idOnly = await prisma.role.updateManyAndReturn({
     *   select: { role_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employees<T extends Role$employeesArgs<ExtArgs> = {}>(args?: Subset<T, Role$employeesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly role_id: FieldRef<"Role", 'Int'>
    readonly role_name: FieldRef<"Role", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.employees
   */
  export type Role$employeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    where?: EmployeeWhereInput
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    cursor?: EmployeeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model Employee
   */

  export type AggregateEmployee = {
    _count: EmployeeCountAggregateOutputType | null
    _avg: EmployeeAvgAggregateOutputType | null
    _sum: EmployeeSumAggregateOutputType | null
    _min: EmployeeMinAggregateOutputType | null
    _max: EmployeeMaxAggregateOutputType | null
  }

  export type EmployeeAvgAggregateOutputType = {
    employee_id: number | null
    role_id: number | null
  }

  export type EmployeeSumAggregateOutputType = {
    employee_id: number | null
    role_id: number | null
  }

  export type EmployeeMinAggregateOutputType = {
    employee_id: number | null
    fullname: string | null
    username: string | null
    password: string | null
    email: string | null
    phone: string | null
    role_id: number | null
  }

  export type EmployeeMaxAggregateOutputType = {
    employee_id: number | null
    fullname: string | null
    username: string | null
    password: string | null
    email: string | null
    phone: string | null
    role_id: number | null
  }

  export type EmployeeCountAggregateOutputType = {
    employee_id: number
    fullname: number
    username: number
    password: number
    email: number
    phone: number
    role_id: number
    _all: number
  }


  export type EmployeeAvgAggregateInputType = {
    employee_id?: true
    role_id?: true
  }

  export type EmployeeSumAggregateInputType = {
    employee_id?: true
    role_id?: true
  }

  export type EmployeeMinAggregateInputType = {
    employee_id?: true
    fullname?: true
    username?: true
    password?: true
    email?: true
    phone?: true
    role_id?: true
  }

  export type EmployeeMaxAggregateInputType = {
    employee_id?: true
    fullname?: true
    username?: true
    password?: true
    email?: true
    phone?: true
    role_id?: true
  }

  export type EmployeeCountAggregateInputType = {
    employee_id?: true
    fullname?: true
    username?: true
    password?: true
    email?: true
    phone?: true
    role_id?: true
    _all?: true
  }

  export type EmployeeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Employee to aggregate.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Employees
    **/
    _count?: true | EmployeeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmployeeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmployeeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmployeeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmployeeMaxAggregateInputType
  }

  export type GetEmployeeAggregateType<T extends EmployeeAggregateArgs> = {
        [P in keyof T & keyof AggregateEmployee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmployee[P]>
      : GetScalarType<T[P], AggregateEmployee[P]>
  }




  export type EmployeeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeWhereInput
    orderBy?: EmployeeOrderByWithAggregationInput | EmployeeOrderByWithAggregationInput[]
    by: EmployeeScalarFieldEnum[] | EmployeeScalarFieldEnum
    having?: EmployeeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmployeeCountAggregateInputType | true
    _avg?: EmployeeAvgAggregateInputType
    _sum?: EmployeeSumAggregateInputType
    _min?: EmployeeMinAggregateInputType
    _max?: EmployeeMaxAggregateInputType
  }

  export type EmployeeGroupByOutputType = {
    employee_id: number
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    role_id: number
    _count: EmployeeCountAggregateOutputType | null
    _avg: EmployeeAvgAggregateOutputType | null
    _sum: EmployeeSumAggregateOutputType | null
    _min: EmployeeMinAggregateOutputType | null
    _max: EmployeeMaxAggregateOutputType | null
  }

  type GetEmployeeGroupByPayload<T extends EmployeeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmployeeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmployeeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmployeeGroupByOutputType[P]>
            : GetScalarType<T[P], EmployeeGroupByOutputType[P]>
        }
      >
    >


  export type EmployeeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    employee_id?: boolean
    fullname?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    phone?: boolean
    role_id?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    jobs?: boolean | Employee$jobsArgs<ExtArgs>
    productionLogs?: boolean | Employee$productionLogsArgs<ExtArgs>
    _count?: boolean | EmployeeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["employee"]>

  export type EmployeeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    employee_id?: boolean
    fullname?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    phone?: boolean
    role_id?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["employee"]>

  export type EmployeeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    employee_id?: boolean
    fullname?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    phone?: boolean
    role_id?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["employee"]>

  export type EmployeeSelectScalar = {
    employee_id?: boolean
    fullname?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    phone?: boolean
    role_id?: boolean
  }

  export type EmployeeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"employee_id" | "fullname" | "username" | "password" | "email" | "phone" | "role_id", ExtArgs["result"]["employee"]>
  export type EmployeeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    jobs?: boolean | Employee$jobsArgs<ExtArgs>
    productionLogs?: boolean | Employee$productionLogsArgs<ExtArgs>
    _count?: boolean | EmployeeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EmployeeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type EmployeeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $EmployeePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Employee"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      jobs: Prisma.$JobPayload<ExtArgs>[]
      productionLogs: Prisma.$ProductionLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      employee_id: number
      fullname: string
      username: string
      password: string
      email: string
      phone: string
      role_id: number
    }, ExtArgs["result"]["employee"]>
    composites: {}
  }

  type EmployeeGetPayload<S extends boolean | null | undefined | EmployeeDefaultArgs> = $Result.GetResult<Prisma.$EmployeePayload, S>

  type EmployeeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmployeeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmployeeCountAggregateInputType | true
    }

  export interface EmployeeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Employee'], meta: { name: 'Employee' } }
    /**
     * Find zero or one Employee that matches the filter.
     * @param {EmployeeFindUniqueArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmployeeFindUniqueArgs>(args: SelectSubset<T, EmployeeFindUniqueArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Employee that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmployeeFindUniqueOrThrowArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmployeeFindUniqueOrThrowArgs>(args: SelectSubset<T, EmployeeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Employee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeFindFirstArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmployeeFindFirstArgs>(args?: SelectSubset<T, EmployeeFindFirstArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Employee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeFindFirstOrThrowArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmployeeFindFirstOrThrowArgs>(args?: SelectSubset<T, EmployeeFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Employees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Employees
     * const employees = await prisma.employee.findMany()
     * 
     * // Get first 10 Employees
     * const employees = await prisma.employee.findMany({ take: 10 })
     * 
     * // Only select the `employee_id`
     * const employeeWithEmployee_idOnly = await prisma.employee.findMany({ select: { employee_id: true } })
     * 
     */
    findMany<T extends EmployeeFindManyArgs>(args?: SelectSubset<T, EmployeeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Employee.
     * @param {EmployeeCreateArgs} args - Arguments to create a Employee.
     * @example
     * // Create one Employee
     * const Employee = await prisma.employee.create({
     *   data: {
     *     // ... data to create a Employee
     *   }
     * })
     * 
     */
    create<T extends EmployeeCreateArgs>(args: SelectSubset<T, EmployeeCreateArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Employees.
     * @param {EmployeeCreateManyArgs} args - Arguments to create many Employees.
     * @example
     * // Create many Employees
     * const employee = await prisma.employee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmployeeCreateManyArgs>(args?: SelectSubset<T, EmployeeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Employees and returns the data saved in the database.
     * @param {EmployeeCreateManyAndReturnArgs} args - Arguments to create many Employees.
     * @example
     * // Create many Employees
     * const employee = await prisma.employee.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Employees and only return the `employee_id`
     * const employeeWithEmployee_idOnly = await prisma.employee.createManyAndReturn({
     *   select: { employee_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmployeeCreateManyAndReturnArgs>(args?: SelectSubset<T, EmployeeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Employee.
     * @param {EmployeeDeleteArgs} args - Arguments to delete one Employee.
     * @example
     * // Delete one Employee
     * const Employee = await prisma.employee.delete({
     *   where: {
     *     // ... filter to delete one Employee
     *   }
     * })
     * 
     */
    delete<T extends EmployeeDeleteArgs>(args: SelectSubset<T, EmployeeDeleteArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Employee.
     * @param {EmployeeUpdateArgs} args - Arguments to update one Employee.
     * @example
     * // Update one Employee
     * const employee = await prisma.employee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmployeeUpdateArgs>(args: SelectSubset<T, EmployeeUpdateArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Employees.
     * @param {EmployeeDeleteManyArgs} args - Arguments to filter Employees to delete.
     * @example
     * // Delete a few Employees
     * const { count } = await prisma.employee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmployeeDeleteManyArgs>(args?: SelectSubset<T, EmployeeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Employees
     * const employee = await prisma.employee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmployeeUpdateManyArgs>(args: SelectSubset<T, EmployeeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Employees and returns the data updated in the database.
     * @param {EmployeeUpdateManyAndReturnArgs} args - Arguments to update many Employees.
     * @example
     * // Update many Employees
     * const employee = await prisma.employee.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Employees and only return the `employee_id`
     * const employeeWithEmployee_idOnly = await prisma.employee.updateManyAndReturn({
     *   select: { employee_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EmployeeUpdateManyAndReturnArgs>(args: SelectSubset<T, EmployeeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Employee.
     * @param {EmployeeUpsertArgs} args - Arguments to update or create a Employee.
     * @example
     * // Update or create a Employee
     * const employee = await prisma.employee.upsert({
     *   create: {
     *     // ... data to create a Employee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Employee we want to update
     *   }
     * })
     */
    upsert<T extends EmployeeUpsertArgs>(args: SelectSubset<T, EmployeeUpsertArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeCountArgs} args - Arguments to filter Employees to count.
     * @example
     * // Count the number of Employees
     * const count = await prisma.employee.count({
     *   where: {
     *     // ... the filter for the Employees we want to count
     *   }
     * })
    **/
    count<T extends EmployeeCountArgs>(
      args?: Subset<T, EmployeeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmployeeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Employee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmployeeAggregateArgs>(args: Subset<T, EmployeeAggregateArgs>): Prisma.PrismaPromise<GetEmployeeAggregateType<T>>

    /**
     * Group by Employee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmployeeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmployeeGroupByArgs['orderBy'] }
        : { orderBy?: EmployeeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmployeeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmployeeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Employee model
   */
  readonly fields: EmployeeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Employee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmployeeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    jobs<T extends Employee$jobsArgs<ExtArgs> = {}>(args?: Subset<T, Employee$jobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    productionLogs<T extends Employee$productionLogsArgs<ExtArgs> = {}>(args?: Subset<T, Employee$productionLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Employee model
   */
  interface EmployeeFieldRefs {
    readonly employee_id: FieldRef<"Employee", 'Int'>
    readonly fullname: FieldRef<"Employee", 'String'>
    readonly username: FieldRef<"Employee", 'String'>
    readonly password: FieldRef<"Employee", 'String'>
    readonly email: FieldRef<"Employee", 'String'>
    readonly phone: FieldRef<"Employee", 'String'>
    readonly role_id: FieldRef<"Employee", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Employee findUnique
   */
  export type EmployeeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee findUniqueOrThrow
   */
  export type EmployeeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee findFirst
   */
  export type EmployeeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Employees.
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Employees.
     */
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee findFirstOrThrow
   */
  export type EmployeeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Employees.
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Employees.
     */
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee findMany
   */
  export type EmployeeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employees to fetch.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Employees.
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee create
   */
  export type EmployeeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * The data needed to create a Employee.
     */
    data: XOR<EmployeeCreateInput, EmployeeUncheckedCreateInput>
  }

  /**
   * Employee createMany
   */
  export type EmployeeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Employees.
     */
    data: EmployeeCreateManyInput | EmployeeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Employee createManyAndReturn
   */
  export type EmployeeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * The data used to create many Employees.
     */
    data: EmployeeCreateManyInput | EmployeeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Employee update
   */
  export type EmployeeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * The data needed to update a Employee.
     */
    data: XOR<EmployeeUpdateInput, EmployeeUncheckedUpdateInput>
    /**
     * Choose, which Employee to update.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee updateMany
   */
  export type EmployeeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Employees.
     */
    data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyInput>
    /**
     * Filter which Employees to update
     */
    where?: EmployeeWhereInput
    /**
     * Limit how many Employees to update.
     */
    limit?: number
  }

  /**
   * Employee updateManyAndReturn
   */
  export type EmployeeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * The data used to update Employees.
     */
    data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyInput>
    /**
     * Filter which Employees to update
     */
    where?: EmployeeWhereInput
    /**
     * Limit how many Employees to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Employee upsert
   */
  export type EmployeeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * The filter to search for the Employee to update in case it exists.
     */
    where: EmployeeWhereUniqueInput
    /**
     * In case the Employee found by the `where` argument doesn't exist, create a new Employee with this data.
     */
    create: XOR<EmployeeCreateInput, EmployeeUncheckedCreateInput>
    /**
     * In case the Employee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmployeeUpdateInput, EmployeeUncheckedUpdateInput>
  }

  /**
   * Employee delete
   */
  export type EmployeeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter which Employee to delete.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee deleteMany
   */
  export type EmployeeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Employees to delete
     */
    where?: EmployeeWhereInput
    /**
     * Limit how many Employees to delete.
     */
    limit?: number
  }

  /**
   * Employee.jobs
   */
  export type Employee$jobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    where?: JobWhereInput
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    cursor?: JobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Employee.productionLogs
   */
  export type Employee$productionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    where?: ProductionLogWhereInput
    orderBy?: ProductionLogOrderByWithRelationInput | ProductionLogOrderByWithRelationInput[]
    cursor?: ProductionLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductionLogScalarFieldEnum | ProductionLogScalarFieldEnum[]
  }

  /**
   * Employee without action
   */
  export type EmployeeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerAvgAggregateOutputType = {
    customer_id: number | null
  }

  export type CustomerSumAggregateOutputType = {
    customer_id: number | null
  }

  export type CustomerMinAggregateOutputType = {
    customer_id: number | null
    customer_code: string | null
    fullname: string | null
    email: string | null
    phone: string | null
    address_detail: string | null
  }

  export type CustomerMaxAggregateOutputType = {
    customer_id: number | null
    customer_code: string | null
    fullname: string | null
    email: string | null
    phone: string | null
    address_detail: string | null
  }

  export type CustomerCountAggregateOutputType = {
    customer_id: number
    customer_code: number
    fullname: number
    email: number
    phone: number
    address_detail: number
    _all: number
  }


  export type CustomerAvgAggregateInputType = {
    customer_id?: true
  }

  export type CustomerSumAggregateInputType = {
    customer_id?: true
  }

  export type CustomerMinAggregateInputType = {
    customer_id?: true
    customer_code?: true
    fullname?: true
    email?: true
    phone?: true
    address_detail?: true
  }

  export type CustomerMaxAggregateInputType = {
    customer_id?: true
    customer_code?: true
    fullname?: true
    email?: true
    phone?: true
    address_detail?: true
  }

  export type CustomerCountAggregateInputType = {
    customer_id?: true
    customer_code?: true
    fullname?: true
    email?: true
    phone?: true
    address_detail?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _avg?: CustomerAvgAggregateInputType
    _sum?: CustomerSumAggregateInputType
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    customer_id: number
    customer_code: string
    fullname: string
    email: string
    phone: string
    address_detail: string
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    customer_id?: boolean
    customer_code?: boolean
    fullname?: boolean
    email?: boolean
    phone?: boolean
    address_detail?: boolean
    jobs?: boolean | Customer$jobsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    customer_id?: boolean
    customer_code?: boolean
    fullname?: boolean
    email?: boolean
    phone?: boolean
    address_detail?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    customer_id?: boolean
    customer_code?: boolean
    fullname?: boolean
    email?: boolean
    phone?: boolean
    address_detail?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    customer_id?: boolean
    customer_code?: boolean
    fullname?: boolean
    email?: boolean
    phone?: boolean
    address_detail?: boolean
  }

  export type CustomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"customer_id" | "customer_code" | "fullname" | "email" | "phone" | "address_detail", ExtArgs["result"]["customer"]>
  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | Customer$jobsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CustomerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      jobs: Prisma.$JobPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      customer_id: number
      customer_code: string
      fullname: string
      email: string
      phone: string
      address_detail: string
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `customer_id`
     * const customerWithCustomer_idOnly = await prisma.customer.findMany({ select: { customer_id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `customer_id`
     * const customerWithCustomer_idOnly = await prisma.customer.createManyAndReturn({
     *   select: { customer_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers and returns the data updated in the database.
     * @param {CustomerUpdateManyAndReturnArgs} args - Arguments to update many Customers.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Customers and only return the `customer_id`
     * const customerWithCustomer_idOnly = await prisma.customer.updateManyAndReturn({
     *   select: { customer_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CustomerUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    jobs<T extends Customer$jobsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$jobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */
  interface CustomerFieldRefs {
    readonly customer_id: FieldRef<"Customer", 'Int'>
    readonly customer_code: FieldRef<"Customer", 'String'>
    readonly fullname: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly address_detail: FieldRef<"Customer", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer updateManyAndReturn
   */
  export type CustomerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to delete.
     */
    limit?: number
  }

  /**
   * Customer.jobs
   */
  export type Customer$jobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    where?: JobWhereInput
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    cursor?: JobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Job
   */

  export type AggregateJob = {
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  export type JobAvgAggregateOutputType = {
    job_id: number | null
    customer_id: number | null
    total_quantity: number | null
    employee_id: number | null
  }

  export type JobSumAggregateOutputType = {
    job_id: number | null
    customer_id: number | null
    total_quantity: number | null
    employee_id: number | null
  }

  export type JobMinAggregateOutputType = {
    job_id: number | null
    job_number: string | null
    created_date: Date | null
    end_date: Date | null
    customer_id: number | null
    total_quantity: number | null
    clothing_type: string | null
    type_of_fabric: string | null
    employee_id: number | null
    delivery_location: string | null
  }

  export type JobMaxAggregateOutputType = {
    job_id: number | null
    job_number: string | null
    created_date: Date | null
    end_date: Date | null
    customer_id: number | null
    total_quantity: number | null
    clothing_type: string | null
    type_of_fabric: string | null
    employee_id: number | null
    delivery_location: string | null
  }

  export type JobCountAggregateOutputType = {
    job_id: number
    job_number: number
    created_date: number
    end_date: number
    customer_id: number
    total_quantity: number
    clothing_type: number
    type_of_fabric: number
    employee_id: number
    delivery_location: number
    _all: number
  }


  export type JobAvgAggregateInputType = {
    job_id?: true
    customer_id?: true
    total_quantity?: true
    employee_id?: true
  }

  export type JobSumAggregateInputType = {
    job_id?: true
    customer_id?: true
    total_quantity?: true
    employee_id?: true
  }

  export type JobMinAggregateInputType = {
    job_id?: true
    job_number?: true
    created_date?: true
    end_date?: true
    customer_id?: true
    total_quantity?: true
    clothing_type?: true
    type_of_fabric?: true
    employee_id?: true
    delivery_location?: true
  }

  export type JobMaxAggregateInputType = {
    job_id?: true
    job_number?: true
    created_date?: true
    end_date?: true
    customer_id?: true
    total_quantity?: true
    clothing_type?: true
    type_of_fabric?: true
    employee_id?: true
    delivery_location?: true
  }

  export type JobCountAggregateInputType = {
    job_id?: true
    job_number?: true
    created_date?: true
    end_date?: true
    customer_id?: true
    total_quantity?: true
    clothing_type?: true
    type_of_fabric?: true
    employee_id?: true
    delivery_location?: true
    _all?: true
  }

  export type JobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Job to aggregate.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jobs
    **/
    _count?: true | JobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobMaxAggregateInputType
  }

  export type GetJobAggregateType<T extends JobAggregateArgs> = {
        [P in keyof T & keyof AggregateJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob[P]>
      : GetScalarType<T[P], AggregateJob[P]>
  }




  export type JobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
    orderBy?: JobOrderByWithAggregationInput | JobOrderByWithAggregationInput[]
    by: JobScalarFieldEnum[] | JobScalarFieldEnum
    having?: JobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobCountAggregateInputType | true
    _avg?: JobAvgAggregateInputType
    _sum?: JobSumAggregateInputType
    _min?: JobMinAggregateInputType
    _max?: JobMaxAggregateInputType
  }

  export type JobGroupByOutputType = {
    job_id: number
    job_number: string
    created_date: Date
    end_date: Date
    customer_id: number
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    employee_id: number
    delivery_location: string
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  type GetJobGroupByPayload<T extends JobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobGroupByOutputType[P]>
            : GetScalarType<T[P], JobGroupByOutputType[P]>
        }
      >
    >


  export type JobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    job_id?: boolean
    job_number?: boolean
    created_date?: boolean
    end_date?: boolean
    customer_id?: boolean
    total_quantity?: boolean
    clothing_type?: boolean
    type_of_fabric?: boolean
    employee_id?: boolean
    delivery_location?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    jobSteps?: boolean | Job$jobStepsArgs<ExtArgs>
    plannings?: boolean | Job$planningsArgs<ExtArgs>
    productionLogs?: boolean | Job$productionLogsArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    job_id?: boolean
    job_number?: boolean
    created_date?: boolean
    end_date?: boolean
    customer_id?: boolean
    total_quantity?: boolean
    clothing_type?: boolean
    type_of_fabric?: boolean
    employee_id?: boolean
    delivery_location?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    job_id?: boolean
    job_number?: boolean
    created_date?: boolean
    end_date?: boolean
    customer_id?: boolean
    total_quantity?: boolean
    clothing_type?: boolean
    type_of_fabric?: boolean
    employee_id?: boolean
    delivery_location?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectScalar = {
    job_id?: boolean
    job_number?: boolean
    created_date?: boolean
    end_date?: boolean
    customer_id?: boolean
    total_quantity?: boolean
    clothing_type?: boolean
    type_of_fabric?: boolean
    employee_id?: boolean
    delivery_location?: boolean
  }

  export type JobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"job_id" | "job_number" | "created_date" | "end_date" | "customer_id" | "total_quantity" | "clothing_type" | "type_of_fabric" | "employee_id" | "delivery_location", ExtArgs["result"]["job"]>
  export type JobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    jobSteps?: boolean | Job$jobStepsArgs<ExtArgs>
    plannings?: boolean | Job$planningsArgs<ExtArgs>
    productionLogs?: boolean | Job$productionLogsArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }
  export type JobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }

  export type $JobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Job"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      employee: Prisma.$EmployeePayload<ExtArgs>
      jobSteps: Prisma.$JobStepPayload<ExtArgs>[]
      plannings: Prisma.$PlanningPayload<ExtArgs>[]
      productionLogs: Prisma.$ProductionLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      job_id: number
      job_number: string
      created_date: Date
      end_date: Date
      customer_id: number
      total_quantity: number
      clothing_type: string
      type_of_fabric: string
      employee_id: number
      delivery_location: string
    }, ExtArgs["result"]["job"]>
    composites: {}
  }

  type JobGetPayload<S extends boolean | null | undefined | JobDefaultArgs> = $Result.GetResult<Prisma.$JobPayload, S>

  type JobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JobCountAggregateInputType | true
    }

  export interface JobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Job'], meta: { name: 'Job' } }
    /**
     * Find zero or one Job that matches the filter.
     * @param {JobFindUniqueArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobFindUniqueArgs>(args: SelectSubset<T, JobFindUniqueArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Job that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JobFindUniqueOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobFindUniqueOrThrowArgs>(args: SelectSubset<T, JobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobFindFirstArgs>(args?: SelectSubset<T, JobFindFirstArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobFindFirstOrThrowArgs>(args?: SelectSubset<T, JobFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jobs
     * const jobs = await prisma.job.findMany()
     * 
     * // Get first 10 Jobs
     * const jobs = await prisma.job.findMany({ take: 10 })
     * 
     * // Only select the `job_id`
     * const jobWithJob_idOnly = await prisma.job.findMany({ select: { job_id: true } })
     * 
     */
    findMany<T extends JobFindManyArgs>(args?: SelectSubset<T, JobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Job.
     * @param {JobCreateArgs} args - Arguments to create a Job.
     * @example
     * // Create one Job
     * const Job = await prisma.job.create({
     *   data: {
     *     // ... data to create a Job
     *   }
     * })
     * 
     */
    create<T extends JobCreateArgs>(args: SelectSubset<T, JobCreateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jobs.
     * @param {JobCreateManyArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobCreateManyArgs>(args?: SelectSubset<T, JobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jobs and returns the data saved in the database.
     * @param {JobCreateManyAndReturnArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jobs and only return the `job_id`
     * const jobWithJob_idOnly = await prisma.job.createManyAndReturn({
     *   select: { job_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobCreateManyAndReturnArgs>(args?: SelectSubset<T, JobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Job.
     * @param {JobDeleteArgs} args - Arguments to delete one Job.
     * @example
     * // Delete one Job
     * const Job = await prisma.job.delete({
     *   where: {
     *     // ... filter to delete one Job
     *   }
     * })
     * 
     */
    delete<T extends JobDeleteArgs>(args: SelectSubset<T, JobDeleteArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Job.
     * @param {JobUpdateArgs} args - Arguments to update one Job.
     * @example
     * // Update one Job
     * const job = await prisma.job.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobUpdateArgs>(args: SelectSubset<T, JobUpdateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jobs.
     * @param {JobDeleteManyArgs} args - Arguments to filter Jobs to delete.
     * @example
     * // Delete a few Jobs
     * const { count } = await prisma.job.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobDeleteManyArgs>(args?: SelectSubset<T, JobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobUpdateManyArgs>(args: SelectSubset<T, JobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs and returns the data updated in the database.
     * @param {JobUpdateManyAndReturnArgs} args - Arguments to update many Jobs.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Jobs and only return the `job_id`
     * const jobWithJob_idOnly = await prisma.job.updateManyAndReturn({
     *   select: { job_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JobUpdateManyAndReturnArgs>(args: SelectSubset<T, JobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Job.
     * @param {JobUpsertArgs} args - Arguments to update or create a Job.
     * @example
     * // Update or create a Job
     * const job = await prisma.job.upsert({
     *   create: {
     *     // ... data to create a Job
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job we want to update
     *   }
     * })
     */
    upsert<T extends JobUpsertArgs>(args: SelectSubset<T, JobUpsertArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobCountArgs} args - Arguments to filter Jobs to count.
     * @example
     * // Count the number of Jobs
     * const count = await prisma.job.count({
     *   where: {
     *     // ... the filter for the Jobs we want to count
     *   }
     * })
    **/
    count<T extends JobCountArgs>(
      args?: Subset<T, JobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobAggregateArgs>(args: Subset<T, JobAggregateArgs>): Prisma.PrismaPromise<GetJobAggregateType<T>>

    /**
     * Group by Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobGroupByArgs['orderBy'] }
        : { orderBy?: JobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Job model
   */
  readonly fields: JobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Job.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    jobSteps<T extends Job$jobStepsArgs<ExtArgs> = {}>(args?: Subset<T, Job$jobStepsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    plannings<T extends Job$planningsArgs<ExtArgs> = {}>(args?: Subset<T, Job$planningsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    productionLogs<T extends Job$productionLogsArgs<ExtArgs> = {}>(args?: Subset<T, Job$productionLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Job model
   */
  interface JobFieldRefs {
    readonly job_id: FieldRef<"Job", 'Int'>
    readonly job_number: FieldRef<"Job", 'String'>
    readonly created_date: FieldRef<"Job", 'DateTime'>
    readonly end_date: FieldRef<"Job", 'DateTime'>
    readonly customer_id: FieldRef<"Job", 'Int'>
    readonly total_quantity: FieldRef<"Job", 'Int'>
    readonly clothing_type: FieldRef<"Job", 'String'>
    readonly type_of_fabric: FieldRef<"Job", 'String'>
    readonly employee_id: FieldRef<"Job", 'Int'>
    readonly delivery_location: FieldRef<"Job", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Job findUnique
   */
  export type JobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findUniqueOrThrow
   */
  export type JobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findFirst
   */
  export type JobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findFirstOrThrow
   */
  export type JobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findMany
   */
  export type JobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Jobs to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job create
   */
  export type JobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to create a Job.
     */
    data: XOR<JobCreateInput, JobUncheckedCreateInput>
  }

  /**
   * Job createMany
   */
  export type JobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Job createManyAndReturn
   */
  export type JobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Job update
   */
  export type JobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to update a Job.
     */
    data: XOR<JobUpdateInput, JobUncheckedUpdateInput>
    /**
     * Choose, which Job to update.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job updateMany
   */
  export type JobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to update.
     */
    limit?: number
  }

  /**
   * Job updateManyAndReturn
   */
  export type JobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Job upsert
   */
  export type JobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The filter to search for the Job to update in case it exists.
     */
    where: JobWhereUniqueInput
    /**
     * In case the Job found by the `where` argument doesn't exist, create a new Job with this data.
     */
    create: XOR<JobCreateInput, JobUncheckedCreateInput>
    /**
     * In case the Job was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobUpdateInput, JobUncheckedUpdateInput>
  }

  /**
   * Job delete
   */
  export type JobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter which Job to delete.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job deleteMany
   */
  export type JobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jobs to delete
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to delete.
     */
    limit?: number
  }

  /**
   * Job.jobSteps
   */
  export type Job$jobStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    where?: JobStepWhereInput
    orderBy?: JobStepOrderByWithRelationInput | JobStepOrderByWithRelationInput[]
    cursor?: JobStepWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobStepScalarFieldEnum | JobStepScalarFieldEnum[]
  }

  /**
   * Job.plannings
   */
  export type Job$planningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    where?: PlanningWhereInput
    orderBy?: PlanningOrderByWithRelationInput | PlanningOrderByWithRelationInput[]
    cursor?: PlanningWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlanningScalarFieldEnum | PlanningScalarFieldEnum[]
  }

  /**
   * Job.productionLogs
   */
  export type Job$productionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    where?: ProductionLogWhereInput
    orderBy?: ProductionLogOrderByWithRelationInput | ProductionLogOrderByWithRelationInput[]
    cursor?: ProductionLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductionLogScalarFieldEnum | ProductionLogScalarFieldEnum[]
  }

  /**
   * Job without action
   */
  export type JobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
  }


  /**
   * Model Step
   */

  export type AggregateStep = {
    _count: StepCountAggregateOutputType | null
    _avg: StepAvgAggregateOutputType | null
    _sum: StepSumAggregateOutputType | null
    _min: StepMinAggregateOutputType | null
    _max: StepMaxAggregateOutputType | null
  }

  export type StepAvgAggregateOutputType = {
    step_id: number | null
  }

  export type StepSumAggregateOutputType = {
    step_id: number | null
  }

  export type StepMinAggregateOutputType = {
    step_id: number | null
    step_name: string | null
  }

  export type StepMaxAggregateOutputType = {
    step_id: number | null
    step_name: string | null
  }

  export type StepCountAggregateOutputType = {
    step_id: number
    step_name: number
    _all: number
  }


  export type StepAvgAggregateInputType = {
    step_id?: true
  }

  export type StepSumAggregateInputType = {
    step_id?: true
  }

  export type StepMinAggregateInputType = {
    step_id?: true
    step_name?: true
  }

  export type StepMaxAggregateInputType = {
    step_id?: true
    step_name?: true
  }

  export type StepCountAggregateInputType = {
    step_id?: true
    step_name?: true
    _all?: true
  }

  export type StepAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Step to aggregate.
     */
    where?: StepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Steps to fetch.
     */
    orderBy?: StepOrderByWithRelationInput | StepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Steps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Steps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Steps
    **/
    _count?: true | StepCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StepAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StepSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StepMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StepMaxAggregateInputType
  }

  export type GetStepAggregateType<T extends StepAggregateArgs> = {
        [P in keyof T & keyof AggregateStep]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStep[P]>
      : GetScalarType<T[P], AggregateStep[P]>
  }




  export type StepGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StepWhereInput
    orderBy?: StepOrderByWithAggregationInput | StepOrderByWithAggregationInput[]
    by: StepScalarFieldEnum[] | StepScalarFieldEnum
    having?: StepScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StepCountAggregateInputType | true
    _avg?: StepAvgAggregateInputType
    _sum?: StepSumAggregateInputType
    _min?: StepMinAggregateInputType
    _max?: StepMaxAggregateInputType
  }

  export type StepGroupByOutputType = {
    step_id: number
    step_name: string
    _count: StepCountAggregateOutputType | null
    _avg: StepAvgAggregateOutputType | null
    _sum: StepSumAggregateOutputType | null
    _min: StepMinAggregateOutputType | null
    _max: StepMaxAggregateOutputType | null
  }

  type GetStepGroupByPayload<T extends StepGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StepGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StepGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StepGroupByOutputType[P]>
            : GetScalarType<T[P], StepGroupByOutputType[P]>
        }
      >
    >


  export type StepSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    step_id?: boolean
    step_name?: boolean
    jobSteps?: boolean | Step$jobStepsArgs<ExtArgs>
    _count?: boolean | StepCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["step"]>

  export type StepSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    step_id?: boolean
    step_name?: boolean
  }, ExtArgs["result"]["step"]>

  export type StepSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    step_id?: boolean
    step_name?: boolean
  }, ExtArgs["result"]["step"]>

  export type StepSelectScalar = {
    step_id?: boolean
    step_name?: boolean
  }

  export type StepOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"step_id" | "step_name", ExtArgs["result"]["step"]>
  export type StepInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobSteps?: boolean | Step$jobStepsArgs<ExtArgs>
    _count?: boolean | StepCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StepIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StepIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StepPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Step"
    objects: {
      jobSteps: Prisma.$JobStepPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      step_id: number
      step_name: string
    }, ExtArgs["result"]["step"]>
    composites: {}
  }

  type StepGetPayload<S extends boolean | null | undefined | StepDefaultArgs> = $Result.GetResult<Prisma.$StepPayload, S>

  type StepCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StepFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StepCountAggregateInputType | true
    }

  export interface StepDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Step'], meta: { name: 'Step' } }
    /**
     * Find zero or one Step that matches the filter.
     * @param {StepFindUniqueArgs} args - Arguments to find a Step
     * @example
     * // Get one Step
     * const step = await prisma.step.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StepFindUniqueArgs>(args: SelectSubset<T, StepFindUniqueArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Step that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StepFindUniqueOrThrowArgs} args - Arguments to find a Step
     * @example
     * // Get one Step
     * const step = await prisma.step.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StepFindUniqueOrThrowArgs>(args: SelectSubset<T, StepFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Step that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepFindFirstArgs} args - Arguments to find a Step
     * @example
     * // Get one Step
     * const step = await prisma.step.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StepFindFirstArgs>(args?: SelectSubset<T, StepFindFirstArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Step that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepFindFirstOrThrowArgs} args - Arguments to find a Step
     * @example
     * // Get one Step
     * const step = await prisma.step.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StepFindFirstOrThrowArgs>(args?: SelectSubset<T, StepFindFirstOrThrowArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Steps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Steps
     * const steps = await prisma.step.findMany()
     * 
     * // Get first 10 Steps
     * const steps = await prisma.step.findMany({ take: 10 })
     * 
     * // Only select the `step_id`
     * const stepWithStep_idOnly = await prisma.step.findMany({ select: { step_id: true } })
     * 
     */
    findMany<T extends StepFindManyArgs>(args?: SelectSubset<T, StepFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Step.
     * @param {StepCreateArgs} args - Arguments to create a Step.
     * @example
     * // Create one Step
     * const Step = await prisma.step.create({
     *   data: {
     *     // ... data to create a Step
     *   }
     * })
     * 
     */
    create<T extends StepCreateArgs>(args: SelectSubset<T, StepCreateArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Steps.
     * @param {StepCreateManyArgs} args - Arguments to create many Steps.
     * @example
     * // Create many Steps
     * const step = await prisma.step.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StepCreateManyArgs>(args?: SelectSubset<T, StepCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Steps and returns the data saved in the database.
     * @param {StepCreateManyAndReturnArgs} args - Arguments to create many Steps.
     * @example
     * // Create many Steps
     * const step = await prisma.step.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Steps and only return the `step_id`
     * const stepWithStep_idOnly = await prisma.step.createManyAndReturn({
     *   select: { step_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StepCreateManyAndReturnArgs>(args?: SelectSubset<T, StepCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Step.
     * @param {StepDeleteArgs} args - Arguments to delete one Step.
     * @example
     * // Delete one Step
     * const Step = await prisma.step.delete({
     *   where: {
     *     // ... filter to delete one Step
     *   }
     * })
     * 
     */
    delete<T extends StepDeleteArgs>(args: SelectSubset<T, StepDeleteArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Step.
     * @param {StepUpdateArgs} args - Arguments to update one Step.
     * @example
     * // Update one Step
     * const step = await prisma.step.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StepUpdateArgs>(args: SelectSubset<T, StepUpdateArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Steps.
     * @param {StepDeleteManyArgs} args - Arguments to filter Steps to delete.
     * @example
     * // Delete a few Steps
     * const { count } = await prisma.step.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StepDeleteManyArgs>(args?: SelectSubset<T, StepDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Steps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Steps
     * const step = await prisma.step.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StepUpdateManyArgs>(args: SelectSubset<T, StepUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Steps and returns the data updated in the database.
     * @param {StepUpdateManyAndReturnArgs} args - Arguments to update many Steps.
     * @example
     * // Update many Steps
     * const step = await prisma.step.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Steps and only return the `step_id`
     * const stepWithStep_idOnly = await prisma.step.updateManyAndReturn({
     *   select: { step_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StepUpdateManyAndReturnArgs>(args: SelectSubset<T, StepUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Step.
     * @param {StepUpsertArgs} args - Arguments to update or create a Step.
     * @example
     * // Update or create a Step
     * const step = await prisma.step.upsert({
     *   create: {
     *     // ... data to create a Step
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Step we want to update
     *   }
     * })
     */
    upsert<T extends StepUpsertArgs>(args: SelectSubset<T, StepUpsertArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Steps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepCountArgs} args - Arguments to filter Steps to count.
     * @example
     * // Count the number of Steps
     * const count = await prisma.step.count({
     *   where: {
     *     // ... the filter for the Steps we want to count
     *   }
     * })
    **/
    count<T extends StepCountArgs>(
      args?: Subset<T, StepCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StepCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Step.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StepAggregateArgs>(args: Subset<T, StepAggregateArgs>): Prisma.PrismaPromise<GetStepAggregateType<T>>

    /**
     * Group by Step.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StepGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StepGroupByArgs['orderBy'] }
        : { orderBy?: StepGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StepGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStepGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Step model
   */
  readonly fields: StepFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Step.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StepClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    jobSteps<T extends Step$jobStepsArgs<ExtArgs> = {}>(args?: Subset<T, Step$jobStepsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Step model
   */
  interface StepFieldRefs {
    readonly step_id: FieldRef<"Step", 'Int'>
    readonly step_name: FieldRef<"Step", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Step findUnique
   */
  export type StepFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Step to fetch.
     */
    where: StepWhereUniqueInput
  }

  /**
   * Step findUniqueOrThrow
   */
  export type StepFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Step to fetch.
     */
    where: StepWhereUniqueInput
  }

  /**
   * Step findFirst
   */
  export type StepFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Step to fetch.
     */
    where?: StepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Steps to fetch.
     */
    orderBy?: StepOrderByWithRelationInput | StepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Steps.
     */
    cursor?: StepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Steps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Steps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Steps.
     */
    distinct?: StepScalarFieldEnum | StepScalarFieldEnum[]
  }

  /**
   * Step findFirstOrThrow
   */
  export type StepFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Step to fetch.
     */
    where?: StepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Steps to fetch.
     */
    orderBy?: StepOrderByWithRelationInput | StepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Steps.
     */
    cursor?: StepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Steps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Steps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Steps.
     */
    distinct?: StepScalarFieldEnum | StepScalarFieldEnum[]
  }

  /**
   * Step findMany
   */
  export type StepFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Steps to fetch.
     */
    where?: StepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Steps to fetch.
     */
    orderBy?: StepOrderByWithRelationInput | StepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Steps.
     */
    cursor?: StepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Steps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Steps.
     */
    skip?: number
    distinct?: StepScalarFieldEnum | StepScalarFieldEnum[]
  }

  /**
   * Step create
   */
  export type StepCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * The data needed to create a Step.
     */
    data: XOR<StepCreateInput, StepUncheckedCreateInput>
  }

  /**
   * Step createMany
   */
  export type StepCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Steps.
     */
    data: StepCreateManyInput | StepCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Step createManyAndReturn
   */
  export type StepCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * The data used to create many Steps.
     */
    data: StepCreateManyInput | StepCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Step update
   */
  export type StepUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * The data needed to update a Step.
     */
    data: XOR<StepUpdateInput, StepUncheckedUpdateInput>
    /**
     * Choose, which Step to update.
     */
    where: StepWhereUniqueInput
  }

  /**
   * Step updateMany
   */
  export type StepUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Steps.
     */
    data: XOR<StepUpdateManyMutationInput, StepUncheckedUpdateManyInput>
    /**
     * Filter which Steps to update
     */
    where?: StepWhereInput
    /**
     * Limit how many Steps to update.
     */
    limit?: number
  }

  /**
   * Step updateManyAndReturn
   */
  export type StepUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * The data used to update Steps.
     */
    data: XOR<StepUpdateManyMutationInput, StepUncheckedUpdateManyInput>
    /**
     * Filter which Steps to update
     */
    where?: StepWhereInput
    /**
     * Limit how many Steps to update.
     */
    limit?: number
  }

  /**
   * Step upsert
   */
  export type StepUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * The filter to search for the Step to update in case it exists.
     */
    where: StepWhereUniqueInput
    /**
     * In case the Step found by the `where` argument doesn't exist, create a new Step with this data.
     */
    create: XOR<StepCreateInput, StepUncheckedCreateInput>
    /**
     * In case the Step was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StepUpdateInput, StepUncheckedUpdateInput>
  }

  /**
   * Step delete
   */
  export type StepDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter which Step to delete.
     */
    where: StepWhereUniqueInput
  }

  /**
   * Step deleteMany
   */
  export type StepDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Steps to delete
     */
    where?: StepWhereInput
    /**
     * Limit how many Steps to delete.
     */
    limit?: number
  }

  /**
   * Step.jobSteps
   */
  export type Step$jobStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    where?: JobStepWhereInput
    orderBy?: JobStepOrderByWithRelationInput | JobStepOrderByWithRelationInput[]
    cursor?: JobStepWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobStepScalarFieldEnum | JobStepScalarFieldEnum[]
  }

  /**
   * Step without action
   */
  export type StepDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
  }


  /**
   * Model JobStep
   */

  export type AggregateJobStep = {
    _count: JobStepCountAggregateOutputType | null
    _avg: JobStepAvgAggregateOutputType | null
    _sum: JobStepSumAggregateOutputType | null
    _min: JobStepMinAggregateOutputType | null
    _max: JobStepMaxAggregateOutputType | null
  }

  export type JobStepAvgAggregateOutputType = {
    job_step_id: number | null
    job_id: number | null
    step_id: number | null
  }

  export type JobStepSumAggregateOutputType = {
    job_step_id: number | null
    job_id: number | null
    step_id: number | null
  }

  export type JobStepMinAggregateOutputType = {
    job_step_id: number | null
    job_id: number | null
    step_id: number | null
  }

  export type JobStepMaxAggregateOutputType = {
    job_step_id: number | null
    job_id: number | null
    step_id: number | null
  }

  export type JobStepCountAggregateOutputType = {
    job_step_id: number
    job_id: number
    step_id: number
    _all: number
  }


  export type JobStepAvgAggregateInputType = {
    job_step_id?: true
    job_id?: true
    step_id?: true
  }

  export type JobStepSumAggregateInputType = {
    job_step_id?: true
    job_id?: true
    step_id?: true
  }

  export type JobStepMinAggregateInputType = {
    job_step_id?: true
    job_id?: true
    step_id?: true
  }

  export type JobStepMaxAggregateInputType = {
    job_step_id?: true
    job_id?: true
    step_id?: true
  }

  export type JobStepCountAggregateInputType = {
    job_step_id?: true
    job_id?: true
    step_id?: true
    _all?: true
  }

  export type JobStepAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobStep to aggregate.
     */
    where?: JobStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSteps to fetch.
     */
    orderBy?: JobStepOrderByWithRelationInput | JobStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JobSteps
    **/
    _count?: true | JobStepCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobStepAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobStepSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobStepMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobStepMaxAggregateInputType
  }

  export type GetJobStepAggregateType<T extends JobStepAggregateArgs> = {
        [P in keyof T & keyof AggregateJobStep]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJobStep[P]>
      : GetScalarType<T[P], AggregateJobStep[P]>
  }




  export type JobStepGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobStepWhereInput
    orderBy?: JobStepOrderByWithAggregationInput | JobStepOrderByWithAggregationInput[]
    by: JobStepScalarFieldEnum[] | JobStepScalarFieldEnum
    having?: JobStepScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobStepCountAggregateInputType | true
    _avg?: JobStepAvgAggregateInputType
    _sum?: JobStepSumAggregateInputType
    _min?: JobStepMinAggregateInputType
    _max?: JobStepMaxAggregateInputType
  }

  export type JobStepGroupByOutputType = {
    job_step_id: number
    job_id: number
    step_id: number
    _count: JobStepCountAggregateOutputType | null
    _avg: JobStepAvgAggregateOutputType | null
    _sum: JobStepSumAggregateOutputType | null
    _min: JobStepMinAggregateOutputType | null
    _max: JobStepMaxAggregateOutputType | null
  }

  type GetJobStepGroupByPayload<T extends JobStepGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobStepGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobStepGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobStepGroupByOutputType[P]>
            : GetScalarType<T[P], JobStepGroupByOutputType[P]>
        }
      >
    >


  export type JobStepSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    job_step_id?: boolean
    job_id?: boolean
    step_id?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
    plannings?: boolean | JobStep$planningsArgs<ExtArgs>
    productionLogs?: boolean | JobStep$productionLogsArgs<ExtArgs>
    _count?: boolean | JobStepCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobStep"]>

  export type JobStepSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    job_step_id?: boolean
    job_id?: boolean
    step_id?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobStep"]>

  export type JobStepSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    job_step_id?: boolean
    job_id?: boolean
    step_id?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobStep"]>

  export type JobStepSelectScalar = {
    job_step_id?: boolean
    job_id?: boolean
    step_id?: boolean
  }

  export type JobStepOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"job_step_id" | "job_id" | "step_id", ExtArgs["result"]["jobStep"]>
  export type JobStepInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
    plannings?: boolean | JobStep$planningsArgs<ExtArgs>
    productionLogs?: boolean | JobStep$productionLogsArgs<ExtArgs>
    _count?: boolean | JobStepCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JobStepIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }
  export type JobStepIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }

  export type $JobStepPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JobStep"
    objects: {
      job: Prisma.$JobPayload<ExtArgs>
      step: Prisma.$StepPayload<ExtArgs>
      plannings: Prisma.$PlanningPayload<ExtArgs>[]
      productionLogs: Prisma.$ProductionLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      job_step_id: number
      job_id: number
      step_id: number
    }, ExtArgs["result"]["jobStep"]>
    composites: {}
  }

  type JobStepGetPayload<S extends boolean | null | undefined | JobStepDefaultArgs> = $Result.GetResult<Prisma.$JobStepPayload, S>

  type JobStepCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JobStepFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JobStepCountAggregateInputType | true
    }

  export interface JobStepDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JobStep'], meta: { name: 'JobStep' } }
    /**
     * Find zero or one JobStep that matches the filter.
     * @param {JobStepFindUniqueArgs} args - Arguments to find a JobStep
     * @example
     * // Get one JobStep
     * const jobStep = await prisma.jobStep.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobStepFindUniqueArgs>(args: SelectSubset<T, JobStepFindUniqueArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JobStep that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JobStepFindUniqueOrThrowArgs} args - Arguments to find a JobStep
     * @example
     * // Get one JobStep
     * const jobStep = await prisma.jobStep.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobStepFindUniqueOrThrowArgs>(args: SelectSubset<T, JobStepFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JobStep that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobStepFindFirstArgs} args - Arguments to find a JobStep
     * @example
     * // Get one JobStep
     * const jobStep = await prisma.jobStep.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobStepFindFirstArgs>(args?: SelectSubset<T, JobStepFindFirstArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JobStep that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobStepFindFirstOrThrowArgs} args - Arguments to find a JobStep
     * @example
     * // Get one JobStep
     * const jobStep = await prisma.jobStep.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobStepFindFirstOrThrowArgs>(args?: SelectSubset<T, JobStepFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JobSteps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobStepFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JobSteps
     * const jobSteps = await prisma.jobStep.findMany()
     * 
     * // Get first 10 JobSteps
     * const jobSteps = await prisma.jobStep.findMany({ take: 10 })
     * 
     * // Only select the `job_step_id`
     * const jobStepWithJob_step_idOnly = await prisma.jobStep.findMany({ select: { job_step_id: true } })
     * 
     */
    findMany<T extends JobStepFindManyArgs>(args?: SelectSubset<T, JobStepFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JobStep.
     * @param {JobStepCreateArgs} args - Arguments to create a JobStep.
     * @example
     * // Create one JobStep
     * const JobStep = await prisma.jobStep.create({
     *   data: {
     *     // ... data to create a JobStep
     *   }
     * })
     * 
     */
    create<T extends JobStepCreateArgs>(args: SelectSubset<T, JobStepCreateArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JobSteps.
     * @param {JobStepCreateManyArgs} args - Arguments to create many JobSteps.
     * @example
     * // Create many JobSteps
     * const jobStep = await prisma.jobStep.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobStepCreateManyArgs>(args?: SelectSubset<T, JobStepCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JobSteps and returns the data saved in the database.
     * @param {JobStepCreateManyAndReturnArgs} args - Arguments to create many JobSteps.
     * @example
     * // Create many JobSteps
     * const jobStep = await prisma.jobStep.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JobSteps and only return the `job_step_id`
     * const jobStepWithJob_step_idOnly = await prisma.jobStep.createManyAndReturn({
     *   select: { job_step_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobStepCreateManyAndReturnArgs>(args?: SelectSubset<T, JobStepCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JobStep.
     * @param {JobStepDeleteArgs} args - Arguments to delete one JobStep.
     * @example
     * // Delete one JobStep
     * const JobStep = await prisma.jobStep.delete({
     *   where: {
     *     // ... filter to delete one JobStep
     *   }
     * })
     * 
     */
    delete<T extends JobStepDeleteArgs>(args: SelectSubset<T, JobStepDeleteArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JobStep.
     * @param {JobStepUpdateArgs} args - Arguments to update one JobStep.
     * @example
     * // Update one JobStep
     * const jobStep = await prisma.jobStep.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobStepUpdateArgs>(args: SelectSubset<T, JobStepUpdateArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JobSteps.
     * @param {JobStepDeleteManyArgs} args - Arguments to filter JobSteps to delete.
     * @example
     * // Delete a few JobSteps
     * const { count } = await prisma.jobStep.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobStepDeleteManyArgs>(args?: SelectSubset<T, JobStepDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JobSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobStepUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JobSteps
     * const jobStep = await prisma.jobStep.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobStepUpdateManyArgs>(args: SelectSubset<T, JobStepUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JobSteps and returns the data updated in the database.
     * @param {JobStepUpdateManyAndReturnArgs} args - Arguments to update many JobSteps.
     * @example
     * // Update many JobSteps
     * const jobStep = await prisma.jobStep.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JobSteps and only return the `job_step_id`
     * const jobStepWithJob_step_idOnly = await prisma.jobStep.updateManyAndReturn({
     *   select: { job_step_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JobStepUpdateManyAndReturnArgs>(args: SelectSubset<T, JobStepUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JobStep.
     * @param {JobStepUpsertArgs} args - Arguments to update or create a JobStep.
     * @example
     * // Update or create a JobStep
     * const jobStep = await prisma.jobStep.upsert({
     *   create: {
     *     // ... data to create a JobStep
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JobStep we want to update
     *   }
     * })
     */
    upsert<T extends JobStepUpsertArgs>(args: SelectSubset<T, JobStepUpsertArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JobSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobStepCountArgs} args - Arguments to filter JobSteps to count.
     * @example
     * // Count the number of JobSteps
     * const count = await prisma.jobStep.count({
     *   where: {
     *     // ... the filter for the JobSteps we want to count
     *   }
     * })
    **/
    count<T extends JobStepCountArgs>(
      args?: Subset<T, JobStepCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobStepCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JobStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobStepAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobStepAggregateArgs>(args: Subset<T, JobStepAggregateArgs>): Prisma.PrismaPromise<GetJobStepAggregateType<T>>

    /**
     * Group by JobStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobStepGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobStepGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobStepGroupByArgs['orderBy'] }
        : { orderBy?: JobStepGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobStepGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobStepGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JobStep model
   */
  readonly fields: JobStepFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JobStep.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobStepClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    step<T extends StepDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StepDefaultArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plannings<T extends JobStep$planningsArgs<ExtArgs> = {}>(args?: Subset<T, JobStep$planningsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    productionLogs<T extends JobStep$productionLogsArgs<ExtArgs> = {}>(args?: Subset<T, JobStep$productionLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JobStep model
   */
  interface JobStepFieldRefs {
    readonly job_step_id: FieldRef<"JobStep", 'Int'>
    readonly job_id: FieldRef<"JobStep", 'Int'>
    readonly step_id: FieldRef<"JobStep", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * JobStep findUnique
   */
  export type JobStepFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    /**
     * Filter, which JobStep to fetch.
     */
    where: JobStepWhereUniqueInput
  }

  /**
   * JobStep findUniqueOrThrow
   */
  export type JobStepFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    /**
     * Filter, which JobStep to fetch.
     */
    where: JobStepWhereUniqueInput
  }

  /**
   * JobStep findFirst
   */
  export type JobStepFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    /**
     * Filter, which JobStep to fetch.
     */
    where?: JobStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSteps to fetch.
     */
    orderBy?: JobStepOrderByWithRelationInput | JobStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobSteps.
     */
    cursor?: JobStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobSteps.
     */
    distinct?: JobStepScalarFieldEnum | JobStepScalarFieldEnum[]
  }

  /**
   * JobStep findFirstOrThrow
   */
  export type JobStepFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    /**
     * Filter, which JobStep to fetch.
     */
    where?: JobStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSteps to fetch.
     */
    orderBy?: JobStepOrderByWithRelationInput | JobStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobSteps.
     */
    cursor?: JobStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobSteps.
     */
    distinct?: JobStepScalarFieldEnum | JobStepScalarFieldEnum[]
  }

  /**
   * JobStep findMany
   */
  export type JobStepFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    /**
     * Filter, which JobSteps to fetch.
     */
    where?: JobStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSteps to fetch.
     */
    orderBy?: JobStepOrderByWithRelationInput | JobStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JobSteps.
     */
    cursor?: JobStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSteps.
     */
    skip?: number
    distinct?: JobStepScalarFieldEnum | JobStepScalarFieldEnum[]
  }

  /**
   * JobStep create
   */
  export type JobStepCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    /**
     * The data needed to create a JobStep.
     */
    data: XOR<JobStepCreateInput, JobStepUncheckedCreateInput>
  }

  /**
   * JobStep createMany
   */
  export type JobStepCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JobSteps.
     */
    data: JobStepCreateManyInput | JobStepCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JobStep createManyAndReturn
   */
  export type JobStepCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * The data used to create many JobSteps.
     */
    data: JobStepCreateManyInput | JobStepCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JobStep update
   */
  export type JobStepUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    /**
     * The data needed to update a JobStep.
     */
    data: XOR<JobStepUpdateInput, JobStepUncheckedUpdateInput>
    /**
     * Choose, which JobStep to update.
     */
    where: JobStepWhereUniqueInput
  }

  /**
   * JobStep updateMany
   */
  export type JobStepUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JobSteps.
     */
    data: XOR<JobStepUpdateManyMutationInput, JobStepUncheckedUpdateManyInput>
    /**
     * Filter which JobSteps to update
     */
    where?: JobStepWhereInput
    /**
     * Limit how many JobSteps to update.
     */
    limit?: number
  }

  /**
   * JobStep updateManyAndReturn
   */
  export type JobStepUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * The data used to update JobSteps.
     */
    data: XOR<JobStepUpdateManyMutationInput, JobStepUncheckedUpdateManyInput>
    /**
     * Filter which JobSteps to update
     */
    where?: JobStepWhereInput
    /**
     * Limit how many JobSteps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * JobStep upsert
   */
  export type JobStepUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    /**
     * The filter to search for the JobStep to update in case it exists.
     */
    where: JobStepWhereUniqueInput
    /**
     * In case the JobStep found by the `where` argument doesn't exist, create a new JobStep with this data.
     */
    create: XOR<JobStepCreateInput, JobStepUncheckedCreateInput>
    /**
     * In case the JobStep was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobStepUpdateInput, JobStepUncheckedUpdateInput>
  }

  /**
   * JobStep delete
   */
  export type JobStepDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
    /**
     * Filter which JobStep to delete.
     */
    where: JobStepWhereUniqueInput
  }

  /**
   * JobStep deleteMany
   */
  export type JobStepDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobSteps to delete
     */
    where?: JobStepWhereInput
    /**
     * Limit how many JobSteps to delete.
     */
    limit?: number
  }

  /**
   * JobStep.plannings
   */
  export type JobStep$planningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    where?: PlanningWhereInput
    orderBy?: PlanningOrderByWithRelationInput | PlanningOrderByWithRelationInput[]
    cursor?: PlanningWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlanningScalarFieldEnum | PlanningScalarFieldEnum[]
  }

  /**
   * JobStep.productionLogs
   */
  export type JobStep$productionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    where?: ProductionLogWhereInput
    orderBy?: ProductionLogOrderByWithRelationInput | ProductionLogOrderByWithRelationInput[]
    cursor?: ProductionLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductionLogScalarFieldEnum | ProductionLogScalarFieldEnum[]
  }

  /**
   * JobStep without action
   */
  export type JobStepDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobStep
     */
    select?: JobStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobStep
     */
    omit?: JobStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobStepInclude<ExtArgs> | null
  }


  /**
   * Model Planning
   */

  export type AggregatePlanning = {
    _count: PlanningCountAggregateOutputType | null
    _avg: PlanningAvgAggregateOutputType | null
    _sum: PlanningSumAggregateOutputType | null
    _min: PlanningMinAggregateOutputType | null
    _max: PlanningMaxAggregateOutputType | null
  }

  export type PlanningAvgAggregateOutputType = {
    planning_id: number | null
    job_id: number | null
    job_step_id: number | null
    planned_quantity: number | null
  }

  export type PlanningSumAggregateOutputType = {
    planning_id: number | null
    job_id: number | null
    job_step_id: number | null
    planned_quantity: number | null
  }

  export type PlanningMinAggregateOutputType = {
    planning_id: number | null
    job_id: number | null
    job_step_id: number | null
    planned_date: Date | null
    planned_quantity: number | null
  }

  export type PlanningMaxAggregateOutputType = {
    planning_id: number | null
    job_id: number | null
    job_step_id: number | null
    planned_date: Date | null
    planned_quantity: number | null
  }

  export type PlanningCountAggregateOutputType = {
    planning_id: number
    job_id: number
    job_step_id: number
    planned_date: number
    planned_quantity: number
    _all: number
  }


  export type PlanningAvgAggregateInputType = {
    planning_id?: true
    job_id?: true
    job_step_id?: true
    planned_quantity?: true
  }

  export type PlanningSumAggregateInputType = {
    planning_id?: true
    job_id?: true
    job_step_id?: true
    planned_quantity?: true
  }

  export type PlanningMinAggregateInputType = {
    planning_id?: true
    job_id?: true
    job_step_id?: true
    planned_date?: true
    planned_quantity?: true
  }

  export type PlanningMaxAggregateInputType = {
    planning_id?: true
    job_id?: true
    job_step_id?: true
    planned_date?: true
    planned_quantity?: true
  }

  export type PlanningCountAggregateInputType = {
    planning_id?: true
    job_id?: true
    job_step_id?: true
    planned_date?: true
    planned_quantity?: true
    _all?: true
  }

  export type PlanningAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Planning to aggregate.
     */
    where?: PlanningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plannings to fetch.
     */
    orderBy?: PlanningOrderByWithRelationInput | PlanningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plannings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plannings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plannings
    **/
    _count?: true | PlanningCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlanningAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlanningSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanningMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanningMaxAggregateInputType
  }

  export type GetPlanningAggregateType<T extends PlanningAggregateArgs> = {
        [P in keyof T & keyof AggregatePlanning]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlanning[P]>
      : GetScalarType<T[P], AggregatePlanning[P]>
  }




  export type PlanningGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanningWhereInput
    orderBy?: PlanningOrderByWithAggregationInput | PlanningOrderByWithAggregationInput[]
    by: PlanningScalarFieldEnum[] | PlanningScalarFieldEnum
    having?: PlanningScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanningCountAggregateInputType | true
    _avg?: PlanningAvgAggregateInputType
    _sum?: PlanningSumAggregateInputType
    _min?: PlanningMinAggregateInputType
    _max?: PlanningMaxAggregateInputType
  }

  export type PlanningGroupByOutputType = {
    planning_id: number
    job_id: number
    job_step_id: number
    planned_date: Date
    planned_quantity: number
    _count: PlanningCountAggregateOutputType | null
    _avg: PlanningAvgAggregateOutputType | null
    _sum: PlanningSumAggregateOutputType | null
    _min: PlanningMinAggregateOutputType | null
    _max: PlanningMaxAggregateOutputType | null
  }

  type GetPlanningGroupByPayload<T extends PlanningGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanningGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanningGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanningGroupByOutputType[P]>
            : GetScalarType<T[P], PlanningGroupByOutputType[P]>
        }
      >
    >


  export type PlanningSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    planning_id?: boolean
    job_id?: boolean
    job_step_id?: boolean
    planned_date?: boolean
    planned_quantity?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["planning"]>

  export type PlanningSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    planning_id?: boolean
    job_id?: boolean
    job_step_id?: boolean
    planned_date?: boolean
    planned_quantity?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["planning"]>

  export type PlanningSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    planning_id?: boolean
    job_id?: boolean
    job_step_id?: boolean
    planned_date?: boolean
    planned_quantity?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["planning"]>

  export type PlanningSelectScalar = {
    planning_id?: boolean
    job_id?: boolean
    job_step_id?: boolean
    planned_date?: boolean
    planned_quantity?: boolean
  }

  export type PlanningOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"planning_id" | "job_id" | "job_step_id" | "planned_date" | "planned_quantity", ExtArgs["result"]["planning"]>
  export type PlanningInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
  }
  export type PlanningIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
  }
  export type PlanningIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
  }

  export type $PlanningPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Planning"
    objects: {
      job: Prisma.$JobPayload<ExtArgs>
      jobStep: Prisma.$JobStepPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      planning_id: number
      job_id: number
      job_step_id: number
      planned_date: Date
      planned_quantity: number
    }, ExtArgs["result"]["planning"]>
    composites: {}
  }

  type PlanningGetPayload<S extends boolean | null | undefined | PlanningDefaultArgs> = $Result.GetResult<Prisma.$PlanningPayload, S>

  type PlanningCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlanningFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlanningCountAggregateInputType | true
    }

  export interface PlanningDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Planning'], meta: { name: 'Planning' } }
    /**
     * Find zero or one Planning that matches the filter.
     * @param {PlanningFindUniqueArgs} args - Arguments to find a Planning
     * @example
     * // Get one Planning
     * const planning = await prisma.planning.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanningFindUniqueArgs>(args: SelectSubset<T, PlanningFindUniqueArgs<ExtArgs>>): Prisma__PlanningClient<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Planning that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlanningFindUniqueOrThrowArgs} args - Arguments to find a Planning
     * @example
     * // Get one Planning
     * const planning = await prisma.planning.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanningFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanningFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanningClient<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Planning that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanningFindFirstArgs} args - Arguments to find a Planning
     * @example
     * // Get one Planning
     * const planning = await prisma.planning.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanningFindFirstArgs>(args?: SelectSubset<T, PlanningFindFirstArgs<ExtArgs>>): Prisma__PlanningClient<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Planning that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanningFindFirstOrThrowArgs} args - Arguments to find a Planning
     * @example
     * // Get one Planning
     * const planning = await prisma.planning.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanningFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanningFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanningClient<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Plannings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanningFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plannings
     * const plannings = await prisma.planning.findMany()
     * 
     * // Get first 10 Plannings
     * const plannings = await prisma.planning.findMany({ take: 10 })
     * 
     * // Only select the `planning_id`
     * const planningWithPlanning_idOnly = await prisma.planning.findMany({ select: { planning_id: true } })
     * 
     */
    findMany<T extends PlanningFindManyArgs>(args?: SelectSubset<T, PlanningFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Planning.
     * @param {PlanningCreateArgs} args - Arguments to create a Planning.
     * @example
     * // Create one Planning
     * const Planning = await prisma.planning.create({
     *   data: {
     *     // ... data to create a Planning
     *   }
     * })
     * 
     */
    create<T extends PlanningCreateArgs>(args: SelectSubset<T, PlanningCreateArgs<ExtArgs>>): Prisma__PlanningClient<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Plannings.
     * @param {PlanningCreateManyArgs} args - Arguments to create many Plannings.
     * @example
     * // Create many Plannings
     * const planning = await prisma.planning.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanningCreateManyArgs>(args?: SelectSubset<T, PlanningCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Plannings and returns the data saved in the database.
     * @param {PlanningCreateManyAndReturnArgs} args - Arguments to create many Plannings.
     * @example
     * // Create many Plannings
     * const planning = await prisma.planning.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Plannings and only return the `planning_id`
     * const planningWithPlanning_idOnly = await prisma.planning.createManyAndReturn({
     *   select: { planning_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlanningCreateManyAndReturnArgs>(args?: SelectSubset<T, PlanningCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Planning.
     * @param {PlanningDeleteArgs} args - Arguments to delete one Planning.
     * @example
     * // Delete one Planning
     * const Planning = await prisma.planning.delete({
     *   where: {
     *     // ... filter to delete one Planning
     *   }
     * })
     * 
     */
    delete<T extends PlanningDeleteArgs>(args: SelectSubset<T, PlanningDeleteArgs<ExtArgs>>): Prisma__PlanningClient<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Planning.
     * @param {PlanningUpdateArgs} args - Arguments to update one Planning.
     * @example
     * // Update one Planning
     * const planning = await prisma.planning.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanningUpdateArgs>(args: SelectSubset<T, PlanningUpdateArgs<ExtArgs>>): Prisma__PlanningClient<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Plannings.
     * @param {PlanningDeleteManyArgs} args - Arguments to filter Plannings to delete.
     * @example
     * // Delete a few Plannings
     * const { count } = await prisma.planning.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanningDeleteManyArgs>(args?: SelectSubset<T, PlanningDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plannings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanningUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plannings
     * const planning = await prisma.planning.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanningUpdateManyArgs>(args: SelectSubset<T, PlanningUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plannings and returns the data updated in the database.
     * @param {PlanningUpdateManyAndReturnArgs} args - Arguments to update many Plannings.
     * @example
     * // Update many Plannings
     * const planning = await prisma.planning.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Plannings and only return the `planning_id`
     * const planningWithPlanning_idOnly = await prisma.planning.updateManyAndReturn({
     *   select: { planning_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlanningUpdateManyAndReturnArgs>(args: SelectSubset<T, PlanningUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Planning.
     * @param {PlanningUpsertArgs} args - Arguments to update or create a Planning.
     * @example
     * // Update or create a Planning
     * const planning = await prisma.planning.upsert({
     *   create: {
     *     // ... data to create a Planning
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Planning we want to update
     *   }
     * })
     */
    upsert<T extends PlanningUpsertArgs>(args: SelectSubset<T, PlanningUpsertArgs<ExtArgs>>): Prisma__PlanningClient<$Result.GetResult<Prisma.$PlanningPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Plannings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanningCountArgs} args - Arguments to filter Plannings to count.
     * @example
     * // Count the number of Plannings
     * const count = await prisma.planning.count({
     *   where: {
     *     // ... the filter for the Plannings we want to count
     *   }
     * })
    **/
    count<T extends PlanningCountArgs>(
      args?: Subset<T, PlanningCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanningCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Planning.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanningAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanningAggregateArgs>(args: Subset<T, PlanningAggregateArgs>): Prisma.PrismaPromise<GetPlanningAggregateType<T>>

    /**
     * Group by Planning.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanningGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanningGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanningGroupByArgs['orderBy'] }
        : { orderBy?: PlanningGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanningGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanningGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Planning model
   */
  readonly fields: PlanningFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Planning.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanningClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    jobStep<T extends JobStepDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobStepDefaultArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Planning model
   */
  interface PlanningFieldRefs {
    readonly planning_id: FieldRef<"Planning", 'Int'>
    readonly job_id: FieldRef<"Planning", 'Int'>
    readonly job_step_id: FieldRef<"Planning", 'Int'>
    readonly planned_date: FieldRef<"Planning", 'DateTime'>
    readonly planned_quantity: FieldRef<"Planning", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Planning findUnique
   */
  export type PlanningFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    /**
     * Filter, which Planning to fetch.
     */
    where: PlanningWhereUniqueInput
  }

  /**
   * Planning findUniqueOrThrow
   */
  export type PlanningFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    /**
     * Filter, which Planning to fetch.
     */
    where: PlanningWhereUniqueInput
  }

  /**
   * Planning findFirst
   */
  export type PlanningFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    /**
     * Filter, which Planning to fetch.
     */
    where?: PlanningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plannings to fetch.
     */
    orderBy?: PlanningOrderByWithRelationInput | PlanningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plannings.
     */
    cursor?: PlanningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plannings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plannings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plannings.
     */
    distinct?: PlanningScalarFieldEnum | PlanningScalarFieldEnum[]
  }

  /**
   * Planning findFirstOrThrow
   */
  export type PlanningFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    /**
     * Filter, which Planning to fetch.
     */
    where?: PlanningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plannings to fetch.
     */
    orderBy?: PlanningOrderByWithRelationInput | PlanningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plannings.
     */
    cursor?: PlanningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plannings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plannings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plannings.
     */
    distinct?: PlanningScalarFieldEnum | PlanningScalarFieldEnum[]
  }

  /**
   * Planning findMany
   */
  export type PlanningFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    /**
     * Filter, which Plannings to fetch.
     */
    where?: PlanningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plannings to fetch.
     */
    orderBy?: PlanningOrderByWithRelationInput | PlanningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plannings.
     */
    cursor?: PlanningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plannings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plannings.
     */
    skip?: number
    distinct?: PlanningScalarFieldEnum | PlanningScalarFieldEnum[]
  }

  /**
   * Planning create
   */
  export type PlanningCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    /**
     * The data needed to create a Planning.
     */
    data: XOR<PlanningCreateInput, PlanningUncheckedCreateInput>
  }

  /**
   * Planning createMany
   */
  export type PlanningCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Plannings.
     */
    data: PlanningCreateManyInput | PlanningCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Planning createManyAndReturn
   */
  export type PlanningCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * The data used to create many Plannings.
     */
    data: PlanningCreateManyInput | PlanningCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Planning update
   */
  export type PlanningUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    /**
     * The data needed to update a Planning.
     */
    data: XOR<PlanningUpdateInput, PlanningUncheckedUpdateInput>
    /**
     * Choose, which Planning to update.
     */
    where: PlanningWhereUniqueInput
  }

  /**
   * Planning updateMany
   */
  export type PlanningUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Plannings.
     */
    data: XOR<PlanningUpdateManyMutationInput, PlanningUncheckedUpdateManyInput>
    /**
     * Filter which Plannings to update
     */
    where?: PlanningWhereInput
    /**
     * Limit how many Plannings to update.
     */
    limit?: number
  }

  /**
   * Planning updateManyAndReturn
   */
  export type PlanningUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * The data used to update Plannings.
     */
    data: XOR<PlanningUpdateManyMutationInput, PlanningUncheckedUpdateManyInput>
    /**
     * Filter which Plannings to update
     */
    where?: PlanningWhereInput
    /**
     * Limit how many Plannings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Planning upsert
   */
  export type PlanningUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    /**
     * The filter to search for the Planning to update in case it exists.
     */
    where: PlanningWhereUniqueInput
    /**
     * In case the Planning found by the `where` argument doesn't exist, create a new Planning with this data.
     */
    create: XOR<PlanningCreateInput, PlanningUncheckedCreateInput>
    /**
     * In case the Planning was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanningUpdateInput, PlanningUncheckedUpdateInput>
  }

  /**
   * Planning delete
   */
  export type PlanningDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
    /**
     * Filter which Planning to delete.
     */
    where: PlanningWhereUniqueInput
  }

  /**
   * Planning deleteMany
   */
  export type PlanningDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plannings to delete
     */
    where?: PlanningWhereInput
    /**
     * Limit how many Plannings to delete.
     */
    limit?: number
  }

  /**
   * Planning without action
   */
  export type PlanningDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Planning
     */
    select?: PlanningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Planning
     */
    omit?: PlanningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanningInclude<ExtArgs> | null
  }


  /**
   * Model ProductionLog
   */

  export type AggregateProductionLog = {
    _count: ProductionLogCountAggregateOutputType | null
    _avg: ProductionLogAvgAggregateOutputType | null
    _sum: ProductionLogSumAggregateOutputType | null
    _min: ProductionLogMinAggregateOutputType | null
    _max: ProductionLogMaxAggregateOutputType | null
  }

  export type ProductionLogAvgAggregateOutputType = {
    log_id: number | null
    job_id: number | null
    job_step_id: number | null
    quantity: number | null
    employee_id: number | null
  }

  export type ProductionLogSumAggregateOutputType = {
    log_id: number | null
    job_id: number | null
    job_step_id: number | null
    quantity: number | null
    employee_id: number | null
  }

  export type ProductionLogMinAggregateOutputType = {
    log_id: number | null
    job_id: number | null
    job_step_id: number | null
    log_date: Date | null
    actual_date: Date | null
    quantity: number | null
    employee_id: number | null
  }

  export type ProductionLogMaxAggregateOutputType = {
    log_id: number | null
    job_id: number | null
    job_step_id: number | null
    log_date: Date | null
    actual_date: Date | null
    quantity: number | null
    employee_id: number | null
  }

  export type ProductionLogCountAggregateOutputType = {
    log_id: number
    job_id: number
    job_step_id: number
    log_date: number
    actual_date: number
    quantity: number
    employee_id: number
    _all: number
  }


  export type ProductionLogAvgAggregateInputType = {
    log_id?: true
    job_id?: true
    job_step_id?: true
    quantity?: true
    employee_id?: true
  }

  export type ProductionLogSumAggregateInputType = {
    log_id?: true
    job_id?: true
    job_step_id?: true
    quantity?: true
    employee_id?: true
  }

  export type ProductionLogMinAggregateInputType = {
    log_id?: true
    job_id?: true
    job_step_id?: true
    log_date?: true
    actual_date?: true
    quantity?: true
    employee_id?: true
  }

  export type ProductionLogMaxAggregateInputType = {
    log_id?: true
    job_id?: true
    job_step_id?: true
    log_date?: true
    actual_date?: true
    quantity?: true
    employee_id?: true
  }

  export type ProductionLogCountAggregateInputType = {
    log_id?: true
    job_id?: true
    job_step_id?: true
    log_date?: true
    actual_date?: true
    quantity?: true
    employee_id?: true
    _all?: true
  }

  export type ProductionLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductionLog to aggregate.
     */
    where?: ProductionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionLogs to fetch.
     */
    orderBy?: ProductionLogOrderByWithRelationInput | ProductionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductionLogs
    **/
    _count?: true | ProductionLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductionLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductionLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductionLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductionLogMaxAggregateInputType
  }

  export type GetProductionLogAggregateType<T extends ProductionLogAggregateArgs> = {
        [P in keyof T & keyof AggregateProductionLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductionLog[P]>
      : GetScalarType<T[P], AggregateProductionLog[P]>
  }




  export type ProductionLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionLogWhereInput
    orderBy?: ProductionLogOrderByWithAggregationInput | ProductionLogOrderByWithAggregationInput[]
    by: ProductionLogScalarFieldEnum[] | ProductionLogScalarFieldEnum
    having?: ProductionLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductionLogCountAggregateInputType | true
    _avg?: ProductionLogAvgAggregateInputType
    _sum?: ProductionLogSumAggregateInputType
    _min?: ProductionLogMinAggregateInputType
    _max?: ProductionLogMaxAggregateInputType
  }

  export type ProductionLogGroupByOutputType = {
    log_id: number
    job_id: number
    job_step_id: number
    log_date: Date
    actual_date: Date
    quantity: number
    employee_id: number
    _count: ProductionLogCountAggregateOutputType | null
    _avg: ProductionLogAvgAggregateOutputType | null
    _sum: ProductionLogSumAggregateOutputType | null
    _min: ProductionLogMinAggregateOutputType | null
    _max: ProductionLogMaxAggregateOutputType | null
  }

  type GetProductionLogGroupByPayload<T extends ProductionLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductionLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductionLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductionLogGroupByOutputType[P]>
            : GetScalarType<T[P], ProductionLogGroupByOutputType[P]>
        }
      >
    >


  export type ProductionLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    log_id?: boolean
    job_id?: boolean
    job_step_id?: boolean
    log_date?: boolean
    actual_date?: boolean
    quantity?: boolean
    employee_id?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productionLog"]>

  export type ProductionLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    log_id?: boolean
    job_id?: boolean
    job_step_id?: boolean
    log_date?: boolean
    actual_date?: boolean
    quantity?: boolean
    employee_id?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productionLog"]>

  export type ProductionLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    log_id?: boolean
    job_id?: boolean
    job_step_id?: boolean
    log_date?: boolean
    actual_date?: boolean
    quantity?: boolean
    employee_id?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productionLog"]>

  export type ProductionLogSelectScalar = {
    log_id?: boolean
    job_id?: boolean
    job_step_id?: boolean
    log_date?: boolean
    actual_date?: boolean
    quantity?: boolean
    employee_id?: boolean
  }

  export type ProductionLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"log_id" | "job_id" | "job_step_id" | "log_date" | "actual_date" | "quantity" | "employee_id", ExtArgs["result"]["productionLog"]>
  export type ProductionLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }
  export type ProductionLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }
  export type ProductionLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    jobStep?: boolean | JobStepDefaultArgs<ExtArgs>
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }

  export type $ProductionLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductionLog"
    objects: {
      job: Prisma.$JobPayload<ExtArgs>
      jobStep: Prisma.$JobStepPayload<ExtArgs>
      employee: Prisma.$EmployeePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      log_id: number
      job_id: number
      job_step_id: number
      log_date: Date
      actual_date: Date
      quantity: number
      employee_id: number
    }, ExtArgs["result"]["productionLog"]>
    composites: {}
  }

  type ProductionLogGetPayload<S extends boolean | null | undefined | ProductionLogDefaultArgs> = $Result.GetResult<Prisma.$ProductionLogPayload, S>

  type ProductionLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductionLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductionLogCountAggregateInputType | true
    }

  export interface ProductionLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductionLog'], meta: { name: 'ProductionLog' } }
    /**
     * Find zero or one ProductionLog that matches the filter.
     * @param {ProductionLogFindUniqueArgs} args - Arguments to find a ProductionLog
     * @example
     * // Get one ProductionLog
     * const productionLog = await prisma.productionLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductionLogFindUniqueArgs>(args: SelectSubset<T, ProductionLogFindUniqueArgs<ExtArgs>>): Prisma__ProductionLogClient<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductionLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductionLogFindUniqueOrThrowArgs} args - Arguments to find a ProductionLog
     * @example
     * // Get one ProductionLog
     * const productionLog = await prisma.productionLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductionLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductionLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductionLogClient<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductionLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLogFindFirstArgs} args - Arguments to find a ProductionLog
     * @example
     * // Get one ProductionLog
     * const productionLog = await prisma.productionLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductionLogFindFirstArgs>(args?: SelectSubset<T, ProductionLogFindFirstArgs<ExtArgs>>): Prisma__ProductionLogClient<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductionLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLogFindFirstOrThrowArgs} args - Arguments to find a ProductionLog
     * @example
     * // Get one ProductionLog
     * const productionLog = await prisma.productionLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductionLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductionLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductionLogClient<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductionLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductionLogs
     * const productionLogs = await prisma.productionLog.findMany()
     * 
     * // Get first 10 ProductionLogs
     * const productionLogs = await prisma.productionLog.findMany({ take: 10 })
     * 
     * // Only select the `log_id`
     * const productionLogWithLog_idOnly = await prisma.productionLog.findMany({ select: { log_id: true } })
     * 
     */
    findMany<T extends ProductionLogFindManyArgs>(args?: SelectSubset<T, ProductionLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductionLog.
     * @param {ProductionLogCreateArgs} args - Arguments to create a ProductionLog.
     * @example
     * // Create one ProductionLog
     * const ProductionLog = await prisma.productionLog.create({
     *   data: {
     *     // ... data to create a ProductionLog
     *   }
     * })
     * 
     */
    create<T extends ProductionLogCreateArgs>(args: SelectSubset<T, ProductionLogCreateArgs<ExtArgs>>): Prisma__ProductionLogClient<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductionLogs.
     * @param {ProductionLogCreateManyArgs} args - Arguments to create many ProductionLogs.
     * @example
     * // Create many ProductionLogs
     * const productionLog = await prisma.productionLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductionLogCreateManyArgs>(args?: SelectSubset<T, ProductionLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductionLogs and returns the data saved in the database.
     * @param {ProductionLogCreateManyAndReturnArgs} args - Arguments to create many ProductionLogs.
     * @example
     * // Create many ProductionLogs
     * const productionLog = await prisma.productionLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductionLogs and only return the `log_id`
     * const productionLogWithLog_idOnly = await prisma.productionLog.createManyAndReturn({
     *   select: { log_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductionLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductionLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductionLog.
     * @param {ProductionLogDeleteArgs} args - Arguments to delete one ProductionLog.
     * @example
     * // Delete one ProductionLog
     * const ProductionLog = await prisma.productionLog.delete({
     *   where: {
     *     // ... filter to delete one ProductionLog
     *   }
     * })
     * 
     */
    delete<T extends ProductionLogDeleteArgs>(args: SelectSubset<T, ProductionLogDeleteArgs<ExtArgs>>): Prisma__ProductionLogClient<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductionLog.
     * @param {ProductionLogUpdateArgs} args - Arguments to update one ProductionLog.
     * @example
     * // Update one ProductionLog
     * const productionLog = await prisma.productionLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductionLogUpdateArgs>(args: SelectSubset<T, ProductionLogUpdateArgs<ExtArgs>>): Prisma__ProductionLogClient<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductionLogs.
     * @param {ProductionLogDeleteManyArgs} args - Arguments to filter ProductionLogs to delete.
     * @example
     * // Delete a few ProductionLogs
     * const { count } = await prisma.productionLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductionLogDeleteManyArgs>(args?: SelectSubset<T, ProductionLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductionLogs
     * const productionLog = await prisma.productionLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductionLogUpdateManyArgs>(args: SelectSubset<T, ProductionLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductionLogs and returns the data updated in the database.
     * @param {ProductionLogUpdateManyAndReturnArgs} args - Arguments to update many ProductionLogs.
     * @example
     * // Update many ProductionLogs
     * const productionLog = await prisma.productionLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductionLogs and only return the `log_id`
     * const productionLogWithLog_idOnly = await prisma.productionLog.updateManyAndReturn({
     *   select: { log_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductionLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductionLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductionLog.
     * @param {ProductionLogUpsertArgs} args - Arguments to update or create a ProductionLog.
     * @example
     * // Update or create a ProductionLog
     * const productionLog = await prisma.productionLog.upsert({
     *   create: {
     *     // ... data to create a ProductionLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductionLog we want to update
     *   }
     * })
     */
    upsert<T extends ProductionLogUpsertArgs>(args: SelectSubset<T, ProductionLogUpsertArgs<ExtArgs>>): Prisma__ProductionLogClient<$Result.GetResult<Prisma.$ProductionLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLogCountArgs} args - Arguments to filter ProductionLogs to count.
     * @example
     * // Count the number of ProductionLogs
     * const count = await prisma.productionLog.count({
     *   where: {
     *     // ... the filter for the ProductionLogs we want to count
     *   }
     * })
    **/
    count<T extends ProductionLogCountArgs>(
      args?: Subset<T, ProductionLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductionLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductionLogAggregateArgs>(args: Subset<T, ProductionLogAggregateArgs>): Prisma.PrismaPromise<GetProductionLogAggregateType<T>>

    /**
     * Group by ProductionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductionLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductionLogGroupByArgs['orderBy'] }
        : { orderBy?: ProductionLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductionLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductionLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductionLog model
   */
  readonly fields: ProductionLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductionLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductionLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    jobStep<T extends JobStepDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobStepDefaultArgs<ExtArgs>>): Prisma__JobStepClient<$Result.GetResult<Prisma.$JobStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductionLog model
   */
  interface ProductionLogFieldRefs {
    readonly log_id: FieldRef<"ProductionLog", 'Int'>
    readonly job_id: FieldRef<"ProductionLog", 'Int'>
    readonly job_step_id: FieldRef<"ProductionLog", 'Int'>
    readonly log_date: FieldRef<"ProductionLog", 'DateTime'>
    readonly actual_date: FieldRef<"ProductionLog", 'DateTime'>
    readonly quantity: FieldRef<"ProductionLog", 'Int'>
    readonly employee_id: FieldRef<"ProductionLog", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ProductionLog findUnique
   */
  export type ProductionLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    /**
     * Filter, which ProductionLog to fetch.
     */
    where: ProductionLogWhereUniqueInput
  }

  /**
   * ProductionLog findUniqueOrThrow
   */
  export type ProductionLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    /**
     * Filter, which ProductionLog to fetch.
     */
    where: ProductionLogWhereUniqueInput
  }

  /**
   * ProductionLog findFirst
   */
  export type ProductionLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    /**
     * Filter, which ProductionLog to fetch.
     */
    where?: ProductionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionLogs to fetch.
     */
    orderBy?: ProductionLogOrderByWithRelationInput | ProductionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductionLogs.
     */
    cursor?: ProductionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductionLogs.
     */
    distinct?: ProductionLogScalarFieldEnum | ProductionLogScalarFieldEnum[]
  }

  /**
   * ProductionLog findFirstOrThrow
   */
  export type ProductionLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    /**
     * Filter, which ProductionLog to fetch.
     */
    where?: ProductionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionLogs to fetch.
     */
    orderBy?: ProductionLogOrderByWithRelationInput | ProductionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductionLogs.
     */
    cursor?: ProductionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductionLogs.
     */
    distinct?: ProductionLogScalarFieldEnum | ProductionLogScalarFieldEnum[]
  }

  /**
   * ProductionLog findMany
   */
  export type ProductionLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    /**
     * Filter, which ProductionLogs to fetch.
     */
    where?: ProductionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionLogs to fetch.
     */
    orderBy?: ProductionLogOrderByWithRelationInput | ProductionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductionLogs.
     */
    cursor?: ProductionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionLogs.
     */
    skip?: number
    distinct?: ProductionLogScalarFieldEnum | ProductionLogScalarFieldEnum[]
  }

  /**
   * ProductionLog create
   */
  export type ProductionLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductionLog.
     */
    data: XOR<ProductionLogCreateInput, ProductionLogUncheckedCreateInput>
  }

  /**
   * ProductionLog createMany
   */
  export type ProductionLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductionLogs.
     */
    data: ProductionLogCreateManyInput | ProductionLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductionLog createManyAndReturn
   */
  export type ProductionLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * The data used to create many ProductionLogs.
     */
    data: ProductionLogCreateManyInput | ProductionLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductionLog update
   */
  export type ProductionLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductionLog.
     */
    data: XOR<ProductionLogUpdateInput, ProductionLogUncheckedUpdateInput>
    /**
     * Choose, which ProductionLog to update.
     */
    where: ProductionLogWhereUniqueInput
  }

  /**
   * ProductionLog updateMany
   */
  export type ProductionLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductionLogs.
     */
    data: XOR<ProductionLogUpdateManyMutationInput, ProductionLogUncheckedUpdateManyInput>
    /**
     * Filter which ProductionLogs to update
     */
    where?: ProductionLogWhereInput
    /**
     * Limit how many ProductionLogs to update.
     */
    limit?: number
  }

  /**
   * ProductionLog updateManyAndReturn
   */
  export type ProductionLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * The data used to update ProductionLogs.
     */
    data: XOR<ProductionLogUpdateManyMutationInput, ProductionLogUncheckedUpdateManyInput>
    /**
     * Filter which ProductionLogs to update
     */
    where?: ProductionLogWhereInput
    /**
     * Limit how many ProductionLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductionLog upsert
   */
  export type ProductionLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductionLog to update in case it exists.
     */
    where: ProductionLogWhereUniqueInput
    /**
     * In case the ProductionLog found by the `where` argument doesn't exist, create a new ProductionLog with this data.
     */
    create: XOR<ProductionLogCreateInput, ProductionLogUncheckedCreateInput>
    /**
     * In case the ProductionLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductionLogUpdateInput, ProductionLogUncheckedUpdateInput>
  }

  /**
   * ProductionLog delete
   */
  export type ProductionLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
    /**
     * Filter which ProductionLog to delete.
     */
    where: ProductionLogWhereUniqueInput
  }

  /**
   * ProductionLog deleteMany
   */
  export type ProductionLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductionLogs to delete
     */
    where?: ProductionLogWhereInput
    /**
     * Limit how many ProductionLogs to delete.
     */
    limit?: number
  }

  /**
   * ProductionLog without action
   */
  export type ProductionLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLog
     */
    select?: ProductionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionLog
     */
    omit?: ProductionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RoleScalarFieldEnum: {
    role_id: 'role_id',
    role_name: 'role_name'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const EmployeeScalarFieldEnum: {
    employee_id: 'employee_id',
    fullname: 'fullname',
    username: 'username',
    password: 'password',
    email: 'email',
    phone: 'phone',
    role_id: 'role_id'
  };

  export type EmployeeScalarFieldEnum = (typeof EmployeeScalarFieldEnum)[keyof typeof EmployeeScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    customer_id: 'customer_id',
    customer_code: 'customer_code',
    fullname: 'fullname',
    email: 'email',
    phone: 'phone',
    address_detail: 'address_detail'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const JobScalarFieldEnum: {
    job_id: 'job_id',
    job_number: 'job_number',
    created_date: 'created_date',
    end_date: 'end_date',
    customer_id: 'customer_id',
    total_quantity: 'total_quantity',
    clothing_type: 'clothing_type',
    type_of_fabric: 'type_of_fabric',
    employee_id: 'employee_id',
    delivery_location: 'delivery_location'
  };

  export type JobScalarFieldEnum = (typeof JobScalarFieldEnum)[keyof typeof JobScalarFieldEnum]


  export const StepScalarFieldEnum: {
    step_id: 'step_id',
    step_name: 'step_name'
  };

  export type StepScalarFieldEnum = (typeof StepScalarFieldEnum)[keyof typeof StepScalarFieldEnum]


  export const JobStepScalarFieldEnum: {
    job_step_id: 'job_step_id',
    job_id: 'job_id',
    step_id: 'step_id'
  };

  export type JobStepScalarFieldEnum = (typeof JobStepScalarFieldEnum)[keyof typeof JobStepScalarFieldEnum]


  export const PlanningScalarFieldEnum: {
    planning_id: 'planning_id',
    job_id: 'job_id',
    job_step_id: 'job_step_id',
    planned_date: 'planned_date',
    planned_quantity: 'planned_quantity'
  };

  export type PlanningScalarFieldEnum = (typeof PlanningScalarFieldEnum)[keyof typeof PlanningScalarFieldEnum]


  export const ProductionLogScalarFieldEnum: {
    log_id: 'log_id',
    job_id: 'job_id',
    job_step_id: 'job_step_id',
    log_date: 'log_date',
    actual_date: 'actual_date',
    quantity: 'quantity',
    employee_id: 'employee_id'
  };

  export type ProductionLogScalarFieldEnum = (typeof ProductionLogScalarFieldEnum)[keyof typeof ProductionLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    role_id?: IntFilter<"Role"> | number
    role_name?: StringFilter<"Role"> | string
    employees?: EmployeeListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    role_id?: SortOrder
    role_name?: SortOrder
    employees?: EmployeeOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    role_id?: number
    role_name?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    employees?: EmployeeListRelationFilter
  }, "role_id" | "role_name">

  export type RoleOrderByWithAggregationInput = {
    role_id?: SortOrder
    role_name?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _avg?: RoleAvgOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
    _sum?: RoleSumOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    role_id?: IntWithAggregatesFilter<"Role"> | number
    role_name?: StringWithAggregatesFilter<"Role"> | string
  }

  export type EmployeeWhereInput = {
    AND?: EmployeeWhereInput | EmployeeWhereInput[]
    OR?: EmployeeWhereInput[]
    NOT?: EmployeeWhereInput | EmployeeWhereInput[]
    employee_id?: IntFilter<"Employee"> | number
    fullname?: StringFilter<"Employee"> | string
    username?: StringFilter<"Employee"> | string
    password?: StringFilter<"Employee"> | string
    email?: StringFilter<"Employee"> | string
    phone?: StringFilter<"Employee"> | string
    role_id?: IntFilter<"Employee"> | number
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    jobs?: JobListRelationFilter
    productionLogs?: ProductionLogListRelationFilter
  }

  export type EmployeeOrderByWithRelationInput = {
    employee_id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    role_id?: SortOrder
    role?: RoleOrderByWithRelationInput
    jobs?: JobOrderByRelationAggregateInput
    productionLogs?: ProductionLogOrderByRelationAggregateInput
  }

  export type EmployeeWhereUniqueInput = Prisma.AtLeast<{
    employee_id?: number
    username?: string
    AND?: EmployeeWhereInput | EmployeeWhereInput[]
    OR?: EmployeeWhereInput[]
    NOT?: EmployeeWhereInput | EmployeeWhereInput[]
    fullname?: StringFilter<"Employee"> | string
    password?: StringFilter<"Employee"> | string
    email?: StringFilter<"Employee"> | string
    phone?: StringFilter<"Employee"> | string
    role_id?: IntFilter<"Employee"> | number
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    jobs?: JobListRelationFilter
    productionLogs?: ProductionLogListRelationFilter
  }, "employee_id" | "username">

  export type EmployeeOrderByWithAggregationInput = {
    employee_id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    role_id?: SortOrder
    _count?: EmployeeCountOrderByAggregateInput
    _avg?: EmployeeAvgOrderByAggregateInput
    _max?: EmployeeMaxOrderByAggregateInput
    _min?: EmployeeMinOrderByAggregateInput
    _sum?: EmployeeSumOrderByAggregateInput
  }

  export type EmployeeScalarWhereWithAggregatesInput = {
    AND?: EmployeeScalarWhereWithAggregatesInput | EmployeeScalarWhereWithAggregatesInput[]
    OR?: EmployeeScalarWhereWithAggregatesInput[]
    NOT?: EmployeeScalarWhereWithAggregatesInput | EmployeeScalarWhereWithAggregatesInput[]
    employee_id?: IntWithAggregatesFilter<"Employee"> | number
    fullname?: StringWithAggregatesFilter<"Employee"> | string
    username?: StringWithAggregatesFilter<"Employee"> | string
    password?: StringWithAggregatesFilter<"Employee"> | string
    email?: StringWithAggregatesFilter<"Employee"> | string
    phone?: StringWithAggregatesFilter<"Employee"> | string
    role_id?: IntWithAggregatesFilter<"Employee"> | number
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    customer_id?: IntFilter<"Customer"> | number
    customer_code?: StringFilter<"Customer"> | string
    fullname?: StringFilter<"Customer"> | string
    email?: StringFilter<"Customer"> | string
    phone?: StringFilter<"Customer"> | string
    address_detail?: StringFilter<"Customer"> | string
    jobs?: JobListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    customer_id?: SortOrder
    customer_code?: SortOrder
    fullname?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address_detail?: SortOrder
    jobs?: JobOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    customer_id?: number
    customer_code?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    fullname?: StringFilter<"Customer"> | string
    email?: StringFilter<"Customer"> | string
    phone?: StringFilter<"Customer"> | string
    address_detail?: StringFilter<"Customer"> | string
    jobs?: JobListRelationFilter
  }, "customer_id" | "customer_code">

  export type CustomerOrderByWithAggregationInput = {
    customer_id?: SortOrder
    customer_code?: SortOrder
    fullname?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address_detail?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _avg?: CustomerAvgOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
    _sum?: CustomerSumOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    customer_id?: IntWithAggregatesFilter<"Customer"> | number
    customer_code?: StringWithAggregatesFilter<"Customer"> | string
    fullname?: StringWithAggregatesFilter<"Customer"> | string
    email?: StringWithAggregatesFilter<"Customer"> | string
    phone?: StringWithAggregatesFilter<"Customer"> | string
    address_detail?: StringWithAggregatesFilter<"Customer"> | string
  }

  export type JobWhereInput = {
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    job_id?: IntFilter<"Job"> | number
    job_number?: StringFilter<"Job"> | string
    created_date?: DateTimeFilter<"Job"> | Date | string
    end_date?: DateTimeFilter<"Job"> | Date | string
    customer_id?: IntFilter<"Job"> | number
    total_quantity?: IntFilter<"Job"> | number
    clothing_type?: StringFilter<"Job"> | string
    type_of_fabric?: StringFilter<"Job"> | string
    employee_id?: IntFilter<"Job"> | number
    delivery_location?: StringFilter<"Job"> | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>
    jobSteps?: JobStepListRelationFilter
    plannings?: PlanningListRelationFilter
    productionLogs?: ProductionLogListRelationFilter
  }

  export type JobOrderByWithRelationInput = {
    job_id?: SortOrder
    job_number?: SortOrder
    created_date?: SortOrder
    end_date?: SortOrder
    customer_id?: SortOrder
    total_quantity?: SortOrder
    clothing_type?: SortOrder
    type_of_fabric?: SortOrder
    employee_id?: SortOrder
    delivery_location?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    employee?: EmployeeOrderByWithRelationInput
    jobSteps?: JobStepOrderByRelationAggregateInput
    plannings?: PlanningOrderByRelationAggregateInput
    productionLogs?: ProductionLogOrderByRelationAggregateInput
  }

  export type JobWhereUniqueInput = Prisma.AtLeast<{
    job_id?: number
    job_number?: string
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    created_date?: DateTimeFilter<"Job"> | Date | string
    end_date?: DateTimeFilter<"Job"> | Date | string
    customer_id?: IntFilter<"Job"> | number
    total_quantity?: IntFilter<"Job"> | number
    clothing_type?: StringFilter<"Job"> | string
    type_of_fabric?: StringFilter<"Job"> | string
    employee_id?: IntFilter<"Job"> | number
    delivery_location?: StringFilter<"Job"> | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>
    jobSteps?: JobStepListRelationFilter
    plannings?: PlanningListRelationFilter
    productionLogs?: ProductionLogListRelationFilter
  }, "job_id" | "job_number">

  export type JobOrderByWithAggregationInput = {
    job_id?: SortOrder
    job_number?: SortOrder
    created_date?: SortOrder
    end_date?: SortOrder
    customer_id?: SortOrder
    total_quantity?: SortOrder
    clothing_type?: SortOrder
    type_of_fabric?: SortOrder
    employee_id?: SortOrder
    delivery_location?: SortOrder
    _count?: JobCountOrderByAggregateInput
    _avg?: JobAvgOrderByAggregateInput
    _max?: JobMaxOrderByAggregateInput
    _min?: JobMinOrderByAggregateInput
    _sum?: JobSumOrderByAggregateInput
  }

  export type JobScalarWhereWithAggregatesInput = {
    AND?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    OR?: JobScalarWhereWithAggregatesInput[]
    NOT?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    job_id?: IntWithAggregatesFilter<"Job"> | number
    job_number?: StringWithAggregatesFilter<"Job"> | string
    created_date?: DateTimeWithAggregatesFilter<"Job"> | Date | string
    end_date?: DateTimeWithAggregatesFilter<"Job"> | Date | string
    customer_id?: IntWithAggregatesFilter<"Job"> | number
    total_quantity?: IntWithAggregatesFilter<"Job"> | number
    clothing_type?: StringWithAggregatesFilter<"Job"> | string
    type_of_fabric?: StringWithAggregatesFilter<"Job"> | string
    employee_id?: IntWithAggregatesFilter<"Job"> | number
    delivery_location?: StringWithAggregatesFilter<"Job"> | string
  }

  export type StepWhereInput = {
    AND?: StepWhereInput | StepWhereInput[]
    OR?: StepWhereInput[]
    NOT?: StepWhereInput | StepWhereInput[]
    step_id?: IntFilter<"Step"> | number
    step_name?: StringFilter<"Step"> | string
    jobSteps?: JobStepListRelationFilter
  }

  export type StepOrderByWithRelationInput = {
    step_id?: SortOrder
    step_name?: SortOrder
    jobSteps?: JobStepOrderByRelationAggregateInput
  }

  export type StepWhereUniqueInput = Prisma.AtLeast<{
    step_id?: number
    step_name?: string
    AND?: StepWhereInput | StepWhereInput[]
    OR?: StepWhereInput[]
    NOT?: StepWhereInput | StepWhereInput[]
    jobSteps?: JobStepListRelationFilter
  }, "step_id" | "step_name">

  export type StepOrderByWithAggregationInput = {
    step_id?: SortOrder
    step_name?: SortOrder
    _count?: StepCountOrderByAggregateInput
    _avg?: StepAvgOrderByAggregateInput
    _max?: StepMaxOrderByAggregateInput
    _min?: StepMinOrderByAggregateInput
    _sum?: StepSumOrderByAggregateInput
  }

  export type StepScalarWhereWithAggregatesInput = {
    AND?: StepScalarWhereWithAggregatesInput | StepScalarWhereWithAggregatesInput[]
    OR?: StepScalarWhereWithAggregatesInput[]
    NOT?: StepScalarWhereWithAggregatesInput | StepScalarWhereWithAggregatesInput[]
    step_id?: IntWithAggregatesFilter<"Step"> | number
    step_name?: StringWithAggregatesFilter<"Step"> | string
  }

  export type JobStepWhereInput = {
    AND?: JobStepWhereInput | JobStepWhereInput[]
    OR?: JobStepWhereInput[]
    NOT?: JobStepWhereInput | JobStepWhereInput[]
    job_step_id?: IntFilter<"JobStep"> | number
    job_id?: IntFilter<"JobStep"> | number
    step_id?: IntFilter<"JobStep"> | number
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
    step?: XOR<StepScalarRelationFilter, StepWhereInput>
    plannings?: PlanningListRelationFilter
    productionLogs?: ProductionLogListRelationFilter
  }

  export type JobStepOrderByWithRelationInput = {
    job_step_id?: SortOrder
    job_id?: SortOrder
    step_id?: SortOrder
    job?: JobOrderByWithRelationInput
    step?: StepOrderByWithRelationInput
    plannings?: PlanningOrderByRelationAggregateInput
    productionLogs?: ProductionLogOrderByRelationAggregateInput
  }

  export type JobStepWhereUniqueInput = Prisma.AtLeast<{
    job_step_id?: number
    job_id_step_id?: JobStepJob_idStep_idCompoundUniqueInput
    AND?: JobStepWhereInput | JobStepWhereInput[]
    OR?: JobStepWhereInput[]
    NOT?: JobStepWhereInput | JobStepWhereInput[]
    job_id?: IntFilter<"JobStep"> | number
    step_id?: IntFilter<"JobStep"> | number
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
    step?: XOR<StepScalarRelationFilter, StepWhereInput>
    plannings?: PlanningListRelationFilter
    productionLogs?: ProductionLogListRelationFilter
  }, "job_step_id" | "job_id_step_id">

  export type JobStepOrderByWithAggregationInput = {
    job_step_id?: SortOrder
    job_id?: SortOrder
    step_id?: SortOrder
    _count?: JobStepCountOrderByAggregateInput
    _avg?: JobStepAvgOrderByAggregateInput
    _max?: JobStepMaxOrderByAggregateInput
    _min?: JobStepMinOrderByAggregateInput
    _sum?: JobStepSumOrderByAggregateInput
  }

  export type JobStepScalarWhereWithAggregatesInput = {
    AND?: JobStepScalarWhereWithAggregatesInput | JobStepScalarWhereWithAggregatesInput[]
    OR?: JobStepScalarWhereWithAggregatesInput[]
    NOT?: JobStepScalarWhereWithAggregatesInput | JobStepScalarWhereWithAggregatesInput[]
    job_step_id?: IntWithAggregatesFilter<"JobStep"> | number
    job_id?: IntWithAggregatesFilter<"JobStep"> | number
    step_id?: IntWithAggregatesFilter<"JobStep"> | number
  }

  export type PlanningWhereInput = {
    AND?: PlanningWhereInput | PlanningWhereInput[]
    OR?: PlanningWhereInput[]
    NOT?: PlanningWhereInput | PlanningWhereInput[]
    planning_id?: IntFilter<"Planning"> | number
    job_id?: IntFilter<"Planning"> | number
    job_step_id?: IntFilter<"Planning"> | number
    planned_date?: DateTimeFilter<"Planning"> | Date | string
    planned_quantity?: IntFilter<"Planning"> | number
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
    jobStep?: XOR<JobStepScalarRelationFilter, JobStepWhereInput>
  }

  export type PlanningOrderByWithRelationInput = {
    planning_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    planned_date?: SortOrder
    planned_quantity?: SortOrder
    job?: JobOrderByWithRelationInput
    jobStep?: JobStepOrderByWithRelationInput
  }

  export type PlanningWhereUniqueInput = Prisma.AtLeast<{
    planning_id?: number
    planned_date?: Date | string
    job_id_job_step_id?: PlanningJob_idJob_step_idCompoundUniqueInput
    AND?: PlanningWhereInput | PlanningWhereInput[]
    OR?: PlanningWhereInput[]
    NOT?: PlanningWhereInput | PlanningWhereInput[]
    job_id?: IntFilter<"Planning"> | number
    job_step_id?: IntFilter<"Planning"> | number
    planned_quantity?: IntFilter<"Planning"> | number
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
    jobStep?: XOR<JobStepScalarRelationFilter, JobStepWhereInput>
  }, "planning_id" | "planned_date" | "job_id_job_step_id">

  export type PlanningOrderByWithAggregationInput = {
    planning_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    planned_date?: SortOrder
    planned_quantity?: SortOrder
    _count?: PlanningCountOrderByAggregateInput
    _avg?: PlanningAvgOrderByAggregateInput
    _max?: PlanningMaxOrderByAggregateInput
    _min?: PlanningMinOrderByAggregateInput
    _sum?: PlanningSumOrderByAggregateInput
  }

  export type PlanningScalarWhereWithAggregatesInput = {
    AND?: PlanningScalarWhereWithAggregatesInput | PlanningScalarWhereWithAggregatesInput[]
    OR?: PlanningScalarWhereWithAggregatesInput[]
    NOT?: PlanningScalarWhereWithAggregatesInput | PlanningScalarWhereWithAggregatesInput[]
    planning_id?: IntWithAggregatesFilter<"Planning"> | number
    job_id?: IntWithAggregatesFilter<"Planning"> | number
    job_step_id?: IntWithAggregatesFilter<"Planning"> | number
    planned_date?: DateTimeWithAggregatesFilter<"Planning"> | Date | string
    planned_quantity?: IntWithAggregatesFilter<"Planning"> | number
  }

  export type ProductionLogWhereInput = {
    AND?: ProductionLogWhereInput | ProductionLogWhereInput[]
    OR?: ProductionLogWhereInput[]
    NOT?: ProductionLogWhereInput | ProductionLogWhereInput[]
    log_id?: IntFilter<"ProductionLog"> | number
    job_id?: IntFilter<"ProductionLog"> | number
    job_step_id?: IntFilter<"ProductionLog"> | number
    log_date?: DateTimeFilter<"ProductionLog"> | Date | string
    actual_date?: DateTimeFilter<"ProductionLog"> | Date | string
    quantity?: IntFilter<"ProductionLog"> | number
    employee_id?: IntFilter<"ProductionLog"> | number
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
    jobStep?: XOR<JobStepScalarRelationFilter, JobStepWhereInput>
    employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>
  }

  export type ProductionLogOrderByWithRelationInput = {
    log_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    log_date?: SortOrder
    actual_date?: SortOrder
    quantity?: SortOrder
    employee_id?: SortOrder
    job?: JobOrderByWithRelationInput
    jobStep?: JobStepOrderByWithRelationInput
    employee?: EmployeeOrderByWithRelationInput
  }

  export type ProductionLogWhereUniqueInput = Prisma.AtLeast<{
    log_id?: number
    actual_date?: Date | string
    job_id_job_step_id?: ProductionLogJob_idJob_step_idCompoundUniqueInput
    AND?: ProductionLogWhereInput | ProductionLogWhereInput[]
    OR?: ProductionLogWhereInput[]
    NOT?: ProductionLogWhereInput | ProductionLogWhereInput[]
    job_id?: IntFilter<"ProductionLog"> | number
    job_step_id?: IntFilter<"ProductionLog"> | number
    log_date?: DateTimeFilter<"ProductionLog"> | Date | string
    quantity?: IntFilter<"ProductionLog"> | number
    employee_id?: IntFilter<"ProductionLog"> | number
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
    jobStep?: XOR<JobStepScalarRelationFilter, JobStepWhereInput>
    employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>
  }, "log_id" | "actual_date" | "job_id_job_step_id">

  export type ProductionLogOrderByWithAggregationInput = {
    log_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    log_date?: SortOrder
    actual_date?: SortOrder
    quantity?: SortOrder
    employee_id?: SortOrder
    _count?: ProductionLogCountOrderByAggregateInput
    _avg?: ProductionLogAvgOrderByAggregateInput
    _max?: ProductionLogMaxOrderByAggregateInput
    _min?: ProductionLogMinOrderByAggregateInput
    _sum?: ProductionLogSumOrderByAggregateInput
  }

  export type ProductionLogScalarWhereWithAggregatesInput = {
    AND?: ProductionLogScalarWhereWithAggregatesInput | ProductionLogScalarWhereWithAggregatesInput[]
    OR?: ProductionLogScalarWhereWithAggregatesInput[]
    NOT?: ProductionLogScalarWhereWithAggregatesInput | ProductionLogScalarWhereWithAggregatesInput[]
    log_id?: IntWithAggregatesFilter<"ProductionLog"> | number
    job_id?: IntWithAggregatesFilter<"ProductionLog"> | number
    job_step_id?: IntWithAggregatesFilter<"ProductionLog"> | number
    log_date?: DateTimeWithAggregatesFilter<"ProductionLog"> | Date | string
    actual_date?: DateTimeWithAggregatesFilter<"ProductionLog"> | Date | string
    quantity?: IntWithAggregatesFilter<"ProductionLog"> | number
    employee_id?: IntWithAggregatesFilter<"ProductionLog"> | number
  }

  export type RoleCreateInput = {
    role_name: string
    employees?: EmployeeCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    role_id?: number
    role_name: string
    employees?: EmployeeUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    role_name?: StringFieldUpdateOperationsInput | string
    employees?: EmployeeUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    role_id?: IntFieldUpdateOperationsInput | number
    role_name?: StringFieldUpdateOperationsInput | string
    employees?: EmployeeUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    role_id?: number
    role_name: string
  }

  export type RoleUpdateManyMutationInput = {
    role_name?: StringFieldUpdateOperationsInput | string
  }

  export type RoleUncheckedUpdateManyInput = {
    role_id?: IntFieldUpdateOperationsInput | number
    role_name?: StringFieldUpdateOperationsInput | string
  }

  export type EmployeeCreateInput = {
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    role: RoleCreateNestedOneWithoutEmployeesInput
    jobs?: JobCreateNestedManyWithoutEmployeeInput
    productionLogs?: ProductionLogCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateInput = {
    employee_id?: number
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    role_id: number
    jobs?: JobUncheckedCreateNestedManyWithoutEmployeeInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUpdateInput = {
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    role?: RoleUpdateOneRequiredWithoutEmployeesNestedInput
    jobs?: JobUpdateManyWithoutEmployeeNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateInput = {
    employee_id?: IntFieldUpdateOperationsInput | number
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    role_id?: IntFieldUpdateOperationsInput | number
    jobs?: JobUncheckedUpdateManyWithoutEmployeeNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeCreateManyInput = {
    employee_id?: number
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    role_id: number
  }

  export type EmployeeUpdateManyMutationInput = {
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type EmployeeUncheckedUpdateManyInput = {
    employee_id?: IntFieldUpdateOperationsInput | number
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    role_id?: IntFieldUpdateOperationsInput | number
  }

  export type CustomerCreateInput = {
    customer_code: string
    fullname: string
    email: string
    phone: string
    address_detail: string
    jobs?: JobCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    customer_id?: number
    customer_code: string
    fullname: string
    email: string
    phone: string
    address_detail: string
    jobs?: JobUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    customer_code?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address_detail?: StringFieldUpdateOperationsInput | string
    jobs?: JobUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    customer_id?: IntFieldUpdateOperationsInput | number
    customer_code?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address_detail?: StringFieldUpdateOperationsInput | string
    jobs?: JobUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    customer_id?: number
    customer_code: string
    fullname: string
    email: string
    phone: string
    address_detail: string
  }

  export type CustomerUpdateManyMutationInput = {
    customer_code?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address_detail?: StringFieldUpdateOperationsInput | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    customer_id?: IntFieldUpdateOperationsInput | number
    customer_code?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address_detail?: StringFieldUpdateOperationsInput | string
  }

  export type JobCreateInput = {
    job_number: string
    created_date: Date | string
    end_date: Date | string
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    delivery_location: string
    customer: CustomerCreateNestedOneWithoutJobsInput
    employee: EmployeeCreateNestedOneWithoutJobsInput
    jobSteps?: JobStepCreateNestedManyWithoutJobInput
    plannings?: PlanningCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateInput = {
    job_id?: number
    job_number: string
    created_date: Date | string
    end_date: Date | string
    customer_id: number
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    employee_id: number
    delivery_location: string
    jobSteps?: JobStepUncheckedCreateNestedManyWithoutJobInput
    plannings?: PlanningUncheckedCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobUpdateInput = {
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    delivery_location?: StringFieldUpdateOperationsInput | string
    customer?: CustomerUpdateOneRequiredWithoutJobsNestedInput
    employee?: EmployeeUpdateOneRequiredWithoutJobsNestedInput
    jobSteps?: JobStepUpdateManyWithoutJobNestedInput
    plannings?: PlanningUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    customer_id?: IntFieldUpdateOperationsInput | number
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    employee_id?: IntFieldUpdateOperationsInput | number
    delivery_location?: StringFieldUpdateOperationsInput | string
    jobSteps?: JobStepUncheckedUpdateManyWithoutJobNestedInput
    plannings?: PlanningUncheckedUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobCreateManyInput = {
    job_id?: number
    job_number: string
    created_date: Date | string
    end_date: Date | string
    customer_id: number
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    employee_id: number
    delivery_location: string
  }

  export type JobUpdateManyMutationInput = {
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    delivery_location?: StringFieldUpdateOperationsInput | string
  }

  export type JobUncheckedUpdateManyInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    customer_id?: IntFieldUpdateOperationsInput | number
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    employee_id?: IntFieldUpdateOperationsInput | number
    delivery_location?: StringFieldUpdateOperationsInput | string
  }

  export type StepCreateInput = {
    step_name: string
    jobSteps?: JobStepCreateNestedManyWithoutStepInput
  }

  export type StepUncheckedCreateInput = {
    step_id?: number
    step_name: string
    jobSteps?: JobStepUncheckedCreateNestedManyWithoutStepInput
  }

  export type StepUpdateInput = {
    step_name?: StringFieldUpdateOperationsInput | string
    jobSteps?: JobStepUpdateManyWithoutStepNestedInput
  }

  export type StepUncheckedUpdateInput = {
    step_id?: IntFieldUpdateOperationsInput | number
    step_name?: StringFieldUpdateOperationsInput | string
    jobSteps?: JobStepUncheckedUpdateManyWithoutStepNestedInput
  }

  export type StepCreateManyInput = {
    step_id?: number
    step_name: string
  }

  export type StepUpdateManyMutationInput = {
    step_name?: StringFieldUpdateOperationsInput | string
  }

  export type StepUncheckedUpdateManyInput = {
    step_id?: IntFieldUpdateOperationsInput | number
    step_name?: StringFieldUpdateOperationsInput | string
  }

  export type JobStepCreateInput = {
    job: JobCreateNestedOneWithoutJobStepsInput
    step: StepCreateNestedOneWithoutJobStepsInput
    plannings?: PlanningCreateNestedManyWithoutJobStepInput
    productionLogs?: ProductionLogCreateNestedManyWithoutJobStepInput
  }

  export type JobStepUncheckedCreateInput = {
    job_step_id?: number
    job_id: number
    step_id: number
    plannings?: PlanningUncheckedCreateNestedManyWithoutJobStepInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutJobStepInput
  }

  export type JobStepUpdateInput = {
    job?: JobUpdateOneRequiredWithoutJobStepsNestedInput
    step?: StepUpdateOneRequiredWithoutJobStepsNestedInput
    plannings?: PlanningUpdateManyWithoutJobStepNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutJobStepNestedInput
  }

  export type JobStepUncheckedUpdateInput = {
    job_step_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    step_id?: IntFieldUpdateOperationsInput | number
    plannings?: PlanningUncheckedUpdateManyWithoutJobStepNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutJobStepNestedInput
  }

  export type JobStepCreateManyInput = {
    job_step_id?: number
    job_id: number
    step_id: number
  }

  export type JobStepUpdateManyMutationInput = {

  }

  export type JobStepUncheckedUpdateManyInput = {
    job_step_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    step_id?: IntFieldUpdateOperationsInput | number
  }

  export type PlanningCreateInput = {
    planned_date: Date | string
    planned_quantity: number
    job: JobCreateNestedOneWithoutPlanningsInput
    jobStep: JobStepCreateNestedOneWithoutPlanningsInput
  }

  export type PlanningUncheckedCreateInput = {
    planning_id?: number
    job_id: number
    job_step_id: number
    planned_date: Date | string
    planned_quantity: number
  }

  export type PlanningUpdateInput = {
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
    job?: JobUpdateOneRequiredWithoutPlanningsNestedInput
    jobStep?: JobStepUpdateOneRequiredWithoutPlanningsNestedInput
  }

  export type PlanningUncheckedUpdateInput = {
    planning_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
  }

  export type PlanningCreateManyInput = {
    planning_id?: number
    job_id: number
    job_step_id: number
    planned_date: Date | string
    planned_quantity: number
  }

  export type PlanningUpdateManyMutationInput = {
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
  }

  export type PlanningUncheckedUpdateManyInput = {
    planning_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ProductionLogCreateInput = {
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    job: JobCreateNestedOneWithoutProductionLogsInput
    jobStep: JobStepCreateNestedOneWithoutProductionLogsInput
    employee: EmployeeCreateNestedOneWithoutProductionLogsInput
  }

  export type ProductionLogUncheckedCreateInput = {
    log_id?: number
    job_id: number
    job_step_id: number
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    employee_id: number
  }

  export type ProductionLogUpdateInput = {
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    job?: JobUpdateOneRequiredWithoutProductionLogsNestedInput
    jobStep?: JobStepUpdateOneRequiredWithoutProductionLogsNestedInput
    employee?: EmployeeUpdateOneRequiredWithoutProductionLogsNestedInput
  }

  export type ProductionLogUncheckedUpdateInput = {
    log_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    employee_id?: IntFieldUpdateOperationsInput | number
  }

  export type ProductionLogCreateManyInput = {
    log_id?: number
    job_id: number
    job_step_id: number
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    employee_id: number
  }

  export type ProductionLogUpdateManyMutationInput = {
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ProductionLogUncheckedUpdateManyInput = {
    log_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    employee_id?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EmployeeListRelationFilter = {
    every?: EmployeeWhereInput
    some?: EmployeeWhereInput
    none?: EmployeeWhereInput
  }

  export type EmployeeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    role_id?: SortOrder
    role_name?: SortOrder
  }

  export type RoleAvgOrderByAggregateInput = {
    role_id?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    role_id?: SortOrder
    role_name?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    role_id?: SortOrder
    role_name?: SortOrder
  }

  export type RoleSumOrderByAggregateInput = {
    role_id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type JobListRelationFilter = {
    every?: JobWhereInput
    some?: JobWhereInput
    none?: JobWhereInput
  }

  export type ProductionLogListRelationFilter = {
    every?: ProductionLogWhereInput
    some?: ProductionLogWhereInput
    none?: ProductionLogWhereInput
  }

  export type JobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductionLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmployeeCountOrderByAggregateInput = {
    employee_id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    role_id?: SortOrder
  }

  export type EmployeeAvgOrderByAggregateInput = {
    employee_id?: SortOrder
    role_id?: SortOrder
  }

  export type EmployeeMaxOrderByAggregateInput = {
    employee_id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    role_id?: SortOrder
  }

  export type EmployeeMinOrderByAggregateInput = {
    employee_id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    role_id?: SortOrder
  }

  export type EmployeeSumOrderByAggregateInput = {
    employee_id?: SortOrder
    role_id?: SortOrder
  }

  export type CustomerCountOrderByAggregateInput = {
    customer_id?: SortOrder
    customer_code?: SortOrder
    fullname?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address_detail?: SortOrder
  }

  export type CustomerAvgOrderByAggregateInput = {
    customer_id?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    customer_id?: SortOrder
    customer_code?: SortOrder
    fullname?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address_detail?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    customer_id?: SortOrder
    customer_code?: SortOrder
    fullname?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address_detail?: SortOrder
  }

  export type CustomerSumOrderByAggregateInput = {
    customer_id?: SortOrder
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CustomerScalarRelationFilter = {
    is?: CustomerWhereInput
    isNot?: CustomerWhereInput
  }

  export type EmployeeScalarRelationFilter = {
    is?: EmployeeWhereInput
    isNot?: EmployeeWhereInput
  }

  export type JobStepListRelationFilter = {
    every?: JobStepWhereInput
    some?: JobStepWhereInput
    none?: JobStepWhereInput
  }

  export type PlanningListRelationFilter = {
    every?: PlanningWhereInput
    some?: PlanningWhereInput
    none?: PlanningWhereInput
  }

  export type JobStepOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlanningOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JobCountOrderByAggregateInput = {
    job_id?: SortOrder
    job_number?: SortOrder
    created_date?: SortOrder
    end_date?: SortOrder
    customer_id?: SortOrder
    total_quantity?: SortOrder
    clothing_type?: SortOrder
    type_of_fabric?: SortOrder
    employee_id?: SortOrder
    delivery_location?: SortOrder
  }

  export type JobAvgOrderByAggregateInput = {
    job_id?: SortOrder
    customer_id?: SortOrder
    total_quantity?: SortOrder
    employee_id?: SortOrder
  }

  export type JobMaxOrderByAggregateInput = {
    job_id?: SortOrder
    job_number?: SortOrder
    created_date?: SortOrder
    end_date?: SortOrder
    customer_id?: SortOrder
    total_quantity?: SortOrder
    clothing_type?: SortOrder
    type_of_fabric?: SortOrder
    employee_id?: SortOrder
    delivery_location?: SortOrder
  }

  export type JobMinOrderByAggregateInput = {
    job_id?: SortOrder
    job_number?: SortOrder
    created_date?: SortOrder
    end_date?: SortOrder
    customer_id?: SortOrder
    total_quantity?: SortOrder
    clothing_type?: SortOrder
    type_of_fabric?: SortOrder
    employee_id?: SortOrder
    delivery_location?: SortOrder
  }

  export type JobSumOrderByAggregateInput = {
    job_id?: SortOrder
    customer_id?: SortOrder
    total_quantity?: SortOrder
    employee_id?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StepCountOrderByAggregateInput = {
    step_id?: SortOrder
    step_name?: SortOrder
  }

  export type StepAvgOrderByAggregateInput = {
    step_id?: SortOrder
  }

  export type StepMaxOrderByAggregateInput = {
    step_id?: SortOrder
    step_name?: SortOrder
  }

  export type StepMinOrderByAggregateInput = {
    step_id?: SortOrder
    step_name?: SortOrder
  }

  export type StepSumOrderByAggregateInput = {
    step_id?: SortOrder
  }

  export type JobScalarRelationFilter = {
    is?: JobWhereInput
    isNot?: JobWhereInput
  }

  export type StepScalarRelationFilter = {
    is?: StepWhereInput
    isNot?: StepWhereInput
  }

  export type JobStepJob_idStep_idCompoundUniqueInput = {
    job_id: number
    step_id: number
  }

  export type JobStepCountOrderByAggregateInput = {
    job_step_id?: SortOrder
    job_id?: SortOrder
    step_id?: SortOrder
  }

  export type JobStepAvgOrderByAggregateInput = {
    job_step_id?: SortOrder
    job_id?: SortOrder
    step_id?: SortOrder
  }

  export type JobStepMaxOrderByAggregateInput = {
    job_step_id?: SortOrder
    job_id?: SortOrder
    step_id?: SortOrder
  }

  export type JobStepMinOrderByAggregateInput = {
    job_step_id?: SortOrder
    job_id?: SortOrder
    step_id?: SortOrder
  }

  export type JobStepSumOrderByAggregateInput = {
    job_step_id?: SortOrder
    job_id?: SortOrder
    step_id?: SortOrder
  }

  export type JobStepScalarRelationFilter = {
    is?: JobStepWhereInput
    isNot?: JobStepWhereInput
  }

  export type PlanningJob_idJob_step_idCompoundUniqueInput = {
    job_id: number
    job_step_id: number
  }

  export type PlanningCountOrderByAggregateInput = {
    planning_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    planned_date?: SortOrder
    planned_quantity?: SortOrder
  }

  export type PlanningAvgOrderByAggregateInput = {
    planning_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    planned_quantity?: SortOrder
  }

  export type PlanningMaxOrderByAggregateInput = {
    planning_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    planned_date?: SortOrder
    planned_quantity?: SortOrder
  }

  export type PlanningMinOrderByAggregateInput = {
    planning_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    planned_date?: SortOrder
    planned_quantity?: SortOrder
  }

  export type PlanningSumOrderByAggregateInput = {
    planning_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    planned_quantity?: SortOrder
  }

  export type ProductionLogJob_idJob_step_idCompoundUniqueInput = {
    job_id: number
    job_step_id: number
  }

  export type ProductionLogCountOrderByAggregateInput = {
    log_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    log_date?: SortOrder
    actual_date?: SortOrder
    quantity?: SortOrder
    employee_id?: SortOrder
  }

  export type ProductionLogAvgOrderByAggregateInput = {
    log_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    quantity?: SortOrder
    employee_id?: SortOrder
  }

  export type ProductionLogMaxOrderByAggregateInput = {
    log_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    log_date?: SortOrder
    actual_date?: SortOrder
    quantity?: SortOrder
    employee_id?: SortOrder
  }

  export type ProductionLogMinOrderByAggregateInput = {
    log_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    log_date?: SortOrder
    actual_date?: SortOrder
    quantity?: SortOrder
    employee_id?: SortOrder
  }

  export type ProductionLogSumOrderByAggregateInput = {
    log_id?: SortOrder
    job_id?: SortOrder
    job_step_id?: SortOrder
    quantity?: SortOrder
    employee_id?: SortOrder
  }

  export type EmployeeCreateNestedManyWithoutRoleInput = {
    create?: XOR<EmployeeCreateWithoutRoleInput, EmployeeUncheckedCreateWithoutRoleInput> | EmployeeCreateWithoutRoleInput[] | EmployeeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutRoleInput | EmployeeCreateOrConnectWithoutRoleInput[]
    createMany?: EmployeeCreateManyRoleInputEnvelope
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
  }

  export type EmployeeUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<EmployeeCreateWithoutRoleInput, EmployeeUncheckedCreateWithoutRoleInput> | EmployeeCreateWithoutRoleInput[] | EmployeeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutRoleInput | EmployeeCreateOrConnectWithoutRoleInput[]
    createMany?: EmployeeCreateManyRoleInputEnvelope
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EmployeeUpdateManyWithoutRoleNestedInput = {
    create?: XOR<EmployeeCreateWithoutRoleInput, EmployeeUncheckedCreateWithoutRoleInput> | EmployeeCreateWithoutRoleInput[] | EmployeeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutRoleInput | EmployeeCreateOrConnectWithoutRoleInput[]
    upsert?: EmployeeUpsertWithWhereUniqueWithoutRoleInput | EmployeeUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: EmployeeCreateManyRoleInputEnvelope
    set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    update?: EmployeeUpdateWithWhereUniqueWithoutRoleInput | EmployeeUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: EmployeeUpdateManyWithWhereWithoutRoleInput | EmployeeUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EmployeeUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<EmployeeCreateWithoutRoleInput, EmployeeUncheckedCreateWithoutRoleInput> | EmployeeCreateWithoutRoleInput[] | EmployeeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutRoleInput | EmployeeCreateOrConnectWithoutRoleInput[]
    upsert?: EmployeeUpsertWithWhereUniqueWithoutRoleInput | EmployeeUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: EmployeeCreateManyRoleInputEnvelope
    set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    update?: EmployeeUpdateWithWhereUniqueWithoutRoleInput | EmployeeUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: EmployeeUpdateManyWithWhereWithoutRoleInput | EmployeeUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
  }

  export type RoleCreateNestedOneWithoutEmployeesInput = {
    create?: XOR<RoleCreateWithoutEmployeesInput, RoleUncheckedCreateWithoutEmployeesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutEmployeesInput
    connect?: RoleWhereUniqueInput
  }

  export type JobCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<JobCreateWithoutEmployeeInput, JobUncheckedCreateWithoutEmployeeInput> | JobCreateWithoutEmployeeInput[] | JobUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: JobCreateOrConnectWithoutEmployeeInput | JobCreateOrConnectWithoutEmployeeInput[]
    createMany?: JobCreateManyEmployeeInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type ProductionLogCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<ProductionLogCreateWithoutEmployeeInput, ProductionLogUncheckedCreateWithoutEmployeeInput> | ProductionLogCreateWithoutEmployeeInput[] | ProductionLogUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutEmployeeInput | ProductionLogCreateOrConnectWithoutEmployeeInput[]
    createMany?: ProductionLogCreateManyEmployeeInputEnvelope
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
  }

  export type JobUncheckedCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<JobCreateWithoutEmployeeInput, JobUncheckedCreateWithoutEmployeeInput> | JobCreateWithoutEmployeeInput[] | JobUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: JobCreateOrConnectWithoutEmployeeInput | JobCreateOrConnectWithoutEmployeeInput[]
    createMany?: JobCreateManyEmployeeInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type ProductionLogUncheckedCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<ProductionLogCreateWithoutEmployeeInput, ProductionLogUncheckedCreateWithoutEmployeeInput> | ProductionLogCreateWithoutEmployeeInput[] | ProductionLogUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutEmployeeInput | ProductionLogCreateOrConnectWithoutEmployeeInput[]
    createMany?: ProductionLogCreateManyEmployeeInputEnvelope
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
  }

  export type RoleUpdateOneRequiredWithoutEmployeesNestedInput = {
    create?: XOR<RoleCreateWithoutEmployeesInput, RoleUncheckedCreateWithoutEmployeesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutEmployeesInput
    upsert?: RoleUpsertWithoutEmployeesInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutEmployeesInput, RoleUpdateWithoutEmployeesInput>, RoleUncheckedUpdateWithoutEmployeesInput>
  }

  export type JobUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<JobCreateWithoutEmployeeInput, JobUncheckedCreateWithoutEmployeeInput> | JobCreateWithoutEmployeeInput[] | JobUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: JobCreateOrConnectWithoutEmployeeInput | JobCreateOrConnectWithoutEmployeeInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutEmployeeInput | JobUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: JobCreateManyEmployeeInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutEmployeeInput | JobUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: JobUpdateManyWithWhereWithoutEmployeeInput | JobUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type ProductionLogUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<ProductionLogCreateWithoutEmployeeInput, ProductionLogUncheckedCreateWithoutEmployeeInput> | ProductionLogCreateWithoutEmployeeInput[] | ProductionLogUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutEmployeeInput | ProductionLogCreateOrConnectWithoutEmployeeInput[]
    upsert?: ProductionLogUpsertWithWhereUniqueWithoutEmployeeInput | ProductionLogUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: ProductionLogCreateManyEmployeeInputEnvelope
    set?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    disconnect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    delete?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    update?: ProductionLogUpdateWithWhereUniqueWithoutEmployeeInput | ProductionLogUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: ProductionLogUpdateManyWithWhereWithoutEmployeeInput | ProductionLogUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: ProductionLogScalarWhereInput | ProductionLogScalarWhereInput[]
  }

  export type JobUncheckedUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<JobCreateWithoutEmployeeInput, JobUncheckedCreateWithoutEmployeeInput> | JobCreateWithoutEmployeeInput[] | JobUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: JobCreateOrConnectWithoutEmployeeInput | JobCreateOrConnectWithoutEmployeeInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutEmployeeInput | JobUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: JobCreateManyEmployeeInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutEmployeeInput | JobUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: JobUpdateManyWithWhereWithoutEmployeeInput | JobUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type ProductionLogUncheckedUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<ProductionLogCreateWithoutEmployeeInput, ProductionLogUncheckedCreateWithoutEmployeeInput> | ProductionLogCreateWithoutEmployeeInput[] | ProductionLogUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutEmployeeInput | ProductionLogCreateOrConnectWithoutEmployeeInput[]
    upsert?: ProductionLogUpsertWithWhereUniqueWithoutEmployeeInput | ProductionLogUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: ProductionLogCreateManyEmployeeInputEnvelope
    set?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    disconnect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    delete?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    update?: ProductionLogUpdateWithWhereUniqueWithoutEmployeeInput | ProductionLogUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: ProductionLogUpdateManyWithWhereWithoutEmployeeInput | ProductionLogUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: ProductionLogScalarWhereInput | ProductionLogScalarWhereInput[]
  }

  export type JobCreateNestedManyWithoutCustomerInput = {
    create?: XOR<JobCreateWithoutCustomerInput, JobUncheckedCreateWithoutCustomerInput> | JobCreateWithoutCustomerInput[] | JobUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: JobCreateOrConnectWithoutCustomerInput | JobCreateOrConnectWithoutCustomerInput[]
    createMany?: JobCreateManyCustomerInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type JobUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<JobCreateWithoutCustomerInput, JobUncheckedCreateWithoutCustomerInput> | JobCreateWithoutCustomerInput[] | JobUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: JobCreateOrConnectWithoutCustomerInput | JobCreateOrConnectWithoutCustomerInput[]
    createMany?: JobCreateManyCustomerInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type JobUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<JobCreateWithoutCustomerInput, JobUncheckedCreateWithoutCustomerInput> | JobCreateWithoutCustomerInput[] | JobUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: JobCreateOrConnectWithoutCustomerInput | JobCreateOrConnectWithoutCustomerInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutCustomerInput | JobUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: JobCreateManyCustomerInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutCustomerInput | JobUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: JobUpdateManyWithWhereWithoutCustomerInput | JobUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type JobUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<JobCreateWithoutCustomerInput, JobUncheckedCreateWithoutCustomerInput> | JobCreateWithoutCustomerInput[] | JobUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: JobCreateOrConnectWithoutCustomerInput | JobCreateOrConnectWithoutCustomerInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutCustomerInput | JobUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: JobCreateManyCustomerInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutCustomerInput | JobUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: JobUpdateManyWithWhereWithoutCustomerInput | JobUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type CustomerCreateNestedOneWithoutJobsInput = {
    create?: XOR<CustomerCreateWithoutJobsInput, CustomerUncheckedCreateWithoutJobsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutJobsInput
    connect?: CustomerWhereUniqueInput
  }

  export type EmployeeCreateNestedOneWithoutJobsInput = {
    create?: XOR<EmployeeCreateWithoutJobsInput, EmployeeUncheckedCreateWithoutJobsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutJobsInput
    connect?: EmployeeWhereUniqueInput
  }

  export type JobStepCreateNestedManyWithoutJobInput = {
    create?: XOR<JobStepCreateWithoutJobInput, JobStepUncheckedCreateWithoutJobInput> | JobStepCreateWithoutJobInput[] | JobStepUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobStepCreateOrConnectWithoutJobInput | JobStepCreateOrConnectWithoutJobInput[]
    createMany?: JobStepCreateManyJobInputEnvelope
    connect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
  }

  export type PlanningCreateNestedManyWithoutJobInput = {
    create?: XOR<PlanningCreateWithoutJobInput, PlanningUncheckedCreateWithoutJobInput> | PlanningCreateWithoutJobInput[] | PlanningUncheckedCreateWithoutJobInput[]
    connectOrCreate?: PlanningCreateOrConnectWithoutJobInput | PlanningCreateOrConnectWithoutJobInput[]
    createMany?: PlanningCreateManyJobInputEnvelope
    connect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
  }

  export type ProductionLogCreateNestedManyWithoutJobInput = {
    create?: XOR<ProductionLogCreateWithoutJobInput, ProductionLogUncheckedCreateWithoutJobInput> | ProductionLogCreateWithoutJobInput[] | ProductionLogUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutJobInput | ProductionLogCreateOrConnectWithoutJobInput[]
    createMany?: ProductionLogCreateManyJobInputEnvelope
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
  }

  export type JobStepUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<JobStepCreateWithoutJobInput, JobStepUncheckedCreateWithoutJobInput> | JobStepCreateWithoutJobInput[] | JobStepUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobStepCreateOrConnectWithoutJobInput | JobStepCreateOrConnectWithoutJobInput[]
    createMany?: JobStepCreateManyJobInputEnvelope
    connect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
  }

  export type PlanningUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<PlanningCreateWithoutJobInput, PlanningUncheckedCreateWithoutJobInput> | PlanningCreateWithoutJobInput[] | PlanningUncheckedCreateWithoutJobInput[]
    connectOrCreate?: PlanningCreateOrConnectWithoutJobInput | PlanningCreateOrConnectWithoutJobInput[]
    createMany?: PlanningCreateManyJobInputEnvelope
    connect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
  }

  export type ProductionLogUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<ProductionLogCreateWithoutJobInput, ProductionLogUncheckedCreateWithoutJobInput> | ProductionLogCreateWithoutJobInput[] | ProductionLogUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutJobInput | ProductionLogCreateOrConnectWithoutJobInput[]
    createMany?: ProductionLogCreateManyJobInputEnvelope
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CustomerUpdateOneRequiredWithoutJobsNestedInput = {
    create?: XOR<CustomerCreateWithoutJobsInput, CustomerUncheckedCreateWithoutJobsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutJobsInput
    upsert?: CustomerUpsertWithoutJobsInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutJobsInput, CustomerUpdateWithoutJobsInput>, CustomerUncheckedUpdateWithoutJobsInput>
  }

  export type EmployeeUpdateOneRequiredWithoutJobsNestedInput = {
    create?: XOR<EmployeeCreateWithoutJobsInput, EmployeeUncheckedCreateWithoutJobsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutJobsInput
    upsert?: EmployeeUpsertWithoutJobsInput
    connect?: EmployeeWhereUniqueInput
    update?: XOR<XOR<EmployeeUpdateToOneWithWhereWithoutJobsInput, EmployeeUpdateWithoutJobsInput>, EmployeeUncheckedUpdateWithoutJobsInput>
  }

  export type JobStepUpdateManyWithoutJobNestedInput = {
    create?: XOR<JobStepCreateWithoutJobInput, JobStepUncheckedCreateWithoutJobInput> | JobStepCreateWithoutJobInput[] | JobStepUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobStepCreateOrConnectWithoutJobInput | JobStepCreateOrConnectWithoutJobInput[]
    upsert?: JobStepUpsertWithWhereUniqueWithoutJobInput | JobStepUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: JobStepCreateManyJobInputEnvelope
    set?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    disconnect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    delete?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    connect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    update?: JobStepUpdateWithWhereUniqueWithoutJobInput | JobStepUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: JobStepUpdateManyWithWhereWithoutJobInput | JobStepUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: JobStepScalarWhereInput | JobStepScalarWhereInput[]
  }

  export type PlanningUpdateManyWithoutJobNestedInput = {
    create?: XOR<PlanningCreateWithoutJobInput, PlanningUncheckedCreateWithoutJobInput> | PlanningCreateWithoutJobInput[] | PlanningUncheckedCreateWithoutJobInput[]
    connectOrCreate?: PlanningCreateOrConnectWithoutJobInput | PlanningCreateOrConnectWithoutJobInput[]
    upsert?: PlanningUpsertWithWhereUniqueWithoutJobInput | PlanningUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: PlanningCreateManyJobInputEnvelope
    set?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    disconnect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    delete?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    connect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    update?: PlanningUpdateWithWhereUniqueWithoutJobInput | PlanningUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: PlanningUpdateManyWithWhereWithoutJobInput | PlanningUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: PlanningScalarWhereInput | PlanningScalarWhereInput[]
  }

  export type ProductionLogUpdateManyWithoutJobNestedInput = {
    create?: XOR<ProductionLogCreateWithoutJobInput, ProductionLogUncheckedCreateWithoutJobInput> | ProductionLogCreateWithoutJobInput[] | ProductionLogUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutJobInput | ProductionLogCreateOrConnectWithoutJobInput[]
    upsert?: ProductionLogUpsertWithWhereUniqueWithoutJobInput | ProductionLogUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ProductionLogCreateManyJobInputEnvelope
    set?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    disconnect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    delete?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    update?: ProductionLogUpdateWithWhereUniqueWithoutJobInput | ProductionLogUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ProductionLogUpdateManyWithWhereWithoutJobInput | ProductionLogUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ProductionLogScalarWhereInput | ProductionLogScalarWhereInput[]
  }

  export type JobStepUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<JobStepCreateWithoutJobInput, JobStepUncheckedCreateWithoutJobInput> | JobStepCreateWithoutJobInput[] | JobStepUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobStepCreateOrConnectWithoutJobInput | JobStepCreateOrConnectWithoutJobInput[]
    upsert?: JobStepUpsertWithWhereUniqueWithoutJobInput | JobStepUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: JobStepCreateManyJobInputEnvelope
    set?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    disconnect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    delete?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    connect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    update?: JobStepUpdateWithWhereUniqueWithoutJobInput | JobStepUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: JobStepUpdateManyWithWhereWithoutJobInput | JobStepUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: JobStepScalarWhereInput | JobStepScalarWhereInput[]
  }

  export type PlanningUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<PlanningCreateWithoutJobInput, PlanningUncheckedCreateWithoutJobInput> | PlanningCreateWithoutJobInput[] | PlanningUncheckedCreateWithoutJobInput[]
    connectOrCreate?: PlanningCreateOrConnectWithoutJobInput | PlanningCreateOrConnectWithoutJobInput[]
    upsert?: PlanningUpsertWithWhereUniqueWithoutJobInput | PlanningUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: PlanningCreateManyJobInputEnvelope
    set?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    disconnect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    delete?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    connect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    update?: PlanningUpdateWithWhereUniqueWithoutJobInput | PlanningUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: PlanningUpdateManyWithWhereWithoutJobInput | PlanningUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: PlanningScalarWhereInput | PlanningScalarWhereInput[]
  }

  export type ProductionLogUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<ProductionLogCreateWithoutJobInput, ProductionLogUncheckedCreateWithoutJobInput> | ProductionLogCreateWithoutJobInput[] | ProductionLogUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutJobInput | ProductionLogCreateOrConnectWithoutJobInput[]
    upsert?: ProductionLogUpsertWithWhereUniqueWithoutJobInput | ProductionLogUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ProductionLogCreateManyJobInputEnvelope
    set?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    disconnect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    delete?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    update?: ProductionLogUpdateWithWhereUniqueWithoutJobInput | ProductionLogUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ProductionLogUpdateManyWithWhereWithoutJobInput | ProductionLogUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ProductionLogScalarWhereInput | ProductionLogScalarWhereInput[]
  }

  export type JobStepCreateNestedManyWithoutStepInput = {
    create?: XOR<JobStepCreateWithoutStepInput, JobStepUncheckedCreateWithoutStepInput> | JobStepCreateWithoutStepInput[] | JobStepUncheckedCreateWithoutStepInput[]
    connectOrCreate?: JobStepCreateOrConnectWithoutStepInput | JobStepCreateOrConnectWithoutStepInput[]
    createMany?: JobStepCreateManyStepInputEnvelope
    connect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
  }

  export type JobStepUncheckedCreateNestedManyWithoutStepInput = {
    create?: XOR<JobStepCreateWithoutStepInput, JobStepUncheckedCreateWithoutStepInput> | JobStepCreateWithoutStepInput[] | JobStepUncheckedCreateWithoutStepInput[]
    connectOrCreate?: JobStepCreateOrConnectWithoutStepInput | JobStepCreateOrConnectWithoutStepInput[]
    createMany?: JobStepCreateManyStepInputEnvelope
    connect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
  }

  export type JobStepUpdateManyWithoutStepNestedInput = {
    create?: XOR<JobStepCreateWithoutStepInput, JobStepUncheckedCreateWithoutStepInput> | JobStepCreateWithoutStepInput[] | JobStepUncheckedCreateWithoutStepInput[]
    connectOrCreate?: JobStepCreateOrConnectWithoutStepInput | JobStepCreateOrConnectWithoutStepInput[]
    upsert?: JobStepUpsertWithWhereUniqueWithoutStepInput | JobStepUpsertWithWhereUniqueWithoutStepInput[]
    createMany?: JobStepCreateManyStepInputEnvelope
    set?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    disconnect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    delete?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    connect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    update?: JobStepUpdateWithWhereUniqueWithoutStepInput | JobStepUpdateWithWhereUniqueWithoutStepInput[]
    updateMany?: JobStepUpdateManyWithWhereWithoutStepInput | JobStepUpdateManyWithWhereWithoutStepInput[]
    deleteMany?: JobStepScalarWhereInput | JobStepScalarWhereInput[]
  }

  export type JobStepUncheckedUpdateManyWithoutStepNestedInput = {
    create?: XOR<JobStepCreateWithoutStepInput, JobStepUncheckedCreateWithoutStepInput> | JobStepCreateWithoutStepInput[] | JobStepUncheckedCreateWithoutStepInput[]
    connectOrCreate?: JobStepCreateOrConnectWithoutStepInput | JobStepCreateOrConnectWithoutStepInput[]
    upsert?: JobStepUpsertWithWhereUniqueWithoutStepInput | JobStepUpsertWithWhereUniqueWithoutStepInput[]
    createMany?: JobStepCreateManyStepInputEnvelope
    set?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    disconnect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    delete?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    connect?: JobStepWhereUniqueInput | JobStepWhereUniqueInput[]
    update?: JobStepUpdateWithWhereUniqueWithoutStepInput | JobStepUpdateWithWhereUniqueWithoutStepInput[]
    updateMany?: JobStepUpdateManyWithWhereWithoutStepInput | JobStepUpdateManyWithWhereWithoutStepInput[]
    deleteMany?: JobStepScalarWhereInput | JobStepScalarWhereInput[]
  }

  export type JobCreateNestedOneWithoutJobStepsInput = {
    create?: XOR<JobCreateWithoutJobStepsInput, JobUncheckedCreateWithoutJobStepsInput>
    connectOrCreate?: JobCreateOrConnectWithoutJobStepsInput
    connect?: JobWhereUniqueInput
  }

  export type StepCreateNestedOneWithoutJobStepsInput = {
    create?: XOR<StepCreateWithoutJobStepsInput, StepUncheckedCreateWithoutJobStepsInput>
    connectOrCreate?: StepCreateOrConnectWithoutJobStepsInput
    connect?: StepWhereUniqueInput
  }

  export type PlanningCreateNestedManyWithoutJobStepInput = {
    create?: XOR<PlanningCreateWithoutJobStepInput, PlanningUncheckedCreateWithoutJobStepInput> | PlanningCreateWithoutJobStepInput[] | PlanningUncheckedCreateWithoutJobStepInput[]
    connectOrCreate?: PlanningCreateOrConnectWithoutJobStepInput | PlanningCreateOrConnectWithoutJobStepInput[]
    createMany?: PlanningCreateManyJobStepInputEnvelope
    connect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
  }

  export type ProductionLogCreateNestedManyWithoutJobStepInput = {
    create?: XOR<ProductionLogCreateWithoutJobStepInput, ProductionLogUncheckedCreateWithoutJobStepInput> | ProductionLogCreateWithoutJobStepInput[] | ProductionLogUncheckedCreateWithoutJobStepInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutJobStepInput | ProductionLogCreateOrConnectWithoutJobStepInput[]
    createMany?: ProductionLogCreateManyJobStepInputEnvelope
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
  }

  export type PlanningUncheckedCreateNestedManyWithoutJobStepInput = {
    create?: XOR<PlanningCreateWithoutJobStepInput, PlanningUncheckedCreateWithoutJobStepInput> | PlanningCreateWithoutJobStepInput[] | PlanningUncheckedCreateWithoutJobStepInput[]
    connectOrCreate?: PlanningCreateOrConnectWithoutJobStepInput | PlanningCreateOrConnectWithoutJobStepInput[]
    createMany?: PlanningCreateManyJobStepInputEnvelope
    connect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
  }

  export type ProductionLogUncheckedCreateNestedManyWithoutJobStepInput = {
    create?: XOR<ProductionLogCreateWithoutJobStepInput, ProductionLogUncheckedCreateWithoutJobStepInput> | ProductionLogCreateWithoutJobStepInput[] | ProductionLogUncheckedCreateWithoutJobStepInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutJobStepInput | ProductionLogCreateOrConnectWithoutJobStepInput[]
    createMany?: ProductionLogCreateManyJobStepInputEnvelope
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
  }

  export type JobUpdateOneRequiredWithoutJobStepsNestedInput = {
    create?: XOR<JobCreateWithoutJobStepsInput, JobUncheckedCreateWithoutJobStepsInput>
    connectOrCreate?: JobCreateOrConnectWithoutJobStepsInput
    upsert?: JobUpsertWithoutJobStepsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutJobStepsInput, JobUpdateWithoutJobStepsInput>, JobUncheckedUpdateWithoutJobStepsInput>
  }

  export type StepUpdateOneRequiredWithoutJobStepsNestedInput = {
    create?: XOR<StepCreateWithoutJobStepsInput, StepUncheckedCreateWithoutJobStepsInput>
    connectOrCreate?: StepCreateOrConnectWithoutJobStepsInput
    upsert?: StepUpsertWithoutJobStepsInput
    connect?: StepWhereUniqueInput
    update?: XOR<XOR<StepUpdateToOneWithWhereWithoutJobStepsInput, StepUpdateWithoutJobStepsInput>, StepUncheckedUpdateWithoutJobStepsInput>
  }

  export type PlanningUpdateManyWithoutJobStepNestedInput = {
    create?: XOR<PlanningCreateWithoutJobStepInput, PlanningUncheckedCreateWithoutJobStepInput> | PlanningCreateWithoutJobStepInput[] | PlanningUncheckedCreateWithoutJobStepInput[]
    connectOrCreate?: PlanningCreateOrConnectWithoutJobStepInput | PlanningCreateOrConnectWithoutJobStepInput[]
    upsert?: PlanningUpsertWithWhereUniqueWithoutJobStepInput | PlanningUpsertWithWhereUniqueWithoutJobStepInput[]
    createMany?: PlanningCreateManyJobStepInputEnvelope
    set?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    disconnect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    delete?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    connect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    update?: PlanningUpdateWithWhereUniqueWithoutJobStepInput | PlanningUpdateWithWhereUniqueWithoutJobStepInput[]
    updateMany?: PlanningUpdateManyWithWhereWithoutJobStepInput | PlanningUpdateManyWithWhereWithoutJobStepInput[]
    deleteMany?: PlanningScalarWhereInput | PlanningScalarWhereInput[]
  }

  export type ProductionLogUpdateManyWithoutJobStepNestedInput = {
    create?: XOR<ProductionLogCreateWithoutJobStepInput, ProductionLogUncheckedCreateWithoutJobStepInput> | ProductionLogCreateWithoutJobStepInput[] | ProductionLogUncheckedCreateWithoutJobStepInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutJobStepInput | ProductionLogCreateOrConnectWithoutJobStepInput[]
    upsert?: ProductionLogUpsertWithWhereUniqueWithoutJobStepInput | ProductionLogUpsertWithWhereUniqueWithoutJobStepInput[]
    createMany?: ProductionLogCreateManyJobStepInputEnvelope
    set?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    disconnect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    delete?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    update?: ProductionLogUpdateWithWhereUniqueWithoutJobStepInput | ProductionLogUpdateWithWhereUniqueWithoutJobStepInput[]
    updateMany?: ProductionLogUpdateManyWithWhereWithoutJobStepInput | ProductionLogUpdateManyWithWhereWithoutJobStepInput[]
    deleteMany?: ProductionLogScalarWhereInput | ProductionLogScalarWhereInput[]
  }

  export type PlanningUncheckedUpdateManyWithoutJobStepNestedInput = {
    create?: XOR<PlanningCreateWithoutJobStepInput, PlanningUncheckedCreateWithoutJobStepInput> | PlanningCreateWithoutJobStepInput[] | PlanningUncheckedCreateWithoutJobStepInput[]
    connectOrCreate?: PlanningCreateOrConnectWithoutJobStepInput | PlanningCreateOrConnectWithoutJobStepInput[]
    upsert?: PlanningUpsertWithWhereUniqueWithoutJobStepInput | PlanningUpsertWithWhereUniqueWithoutJobStepInput[]
    createMany?: PlanningCreateManyJobStepInputEnvelope
    set?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    disconnect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    delete?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    connect?: PlanningWhereUniqueInput | PlanningWhereUniqueInput[]
    update?: PlanningUpdateWithWhereUniqueWithoutJobStepInput | PlanningUpdateWithWhereUniqueWithoutJobStepInput[]
    updateMany?: PlanningUpdateManyWithWhereWithoutJobStepInput | PlanningUpdateManyWithWhereWithoutJobStepInput[]
    deleteMany?: PlanningScalarWhereInput | PlanningScalarWhereInput[]
  }

  export type ProductionLogUncheckedUpdateManyWithoutJobStepNestedInput = {
    create?: XOR<ProductionLogCreateWithoutJobStepInput, ProductionLogUncheckedCreateWithoutJobStepInput> | ProductionLogCreateWithoutJobStepInput[] | ProductionLogUncheckedCreateWithoutJobStepInput[]
    connectOrCreate?: ProductionLogCreateOrConnectWithoutJobStepInput | ProductionLogCreateOrConnectWithoutJobStepInput[]
    upsert?: ProductionLogUpsertWithWhereUniqueWithoutJobStepInput | ProductionLogUpsertWithWhereUniqueWithoutJobStepInput[]
    createMany?: ProductionLogCreateManyJobStepInputEnvelope
    set?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    disconnect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    delete?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    connect?: ProductionLogWhereUniqueInput | ProductionLogWhereUniqueInput[]
    update?: ProductionLogUpdateWithWhereUniqueWithoutJobStepInput | ProductionLogUpdateWithWhereUniqueWithoutJobStepInput[]
    updateMany?: ProductionLogUpdateManyWithWhereWithoutJobStepInput | ProductionLogUpdateManyWithWhereWithoutJobStepInput[]
    deleteMany?: ProductionLogScalarWhereInput | ProductionLogScalarWhereInput[]
  }

  export type JobCreateNestedOneWithoutPlanningsInput = {
    create?: XOR<JobCreateWithoutPlanningsInput, JobUncheckedCreateWithoutPlanningsInput>
    connectOrCreate?: JobCreateOrConnectWithoutPlanningsInput
    connect?: JobWhereUniqueInput
  }

  export type JobStepCreateNestedOneWithoutPlanningsInput = {
    create?: XOR<JobStepCreateWithoutPlanningsInput, JobStepUncheckedCreateWithoutPlanningsInput>
    connectOrCreate?: JobStepCreateOrConnectWithoutPlanningsInput
    connect?: JobStepWhereUniqueInput
  }

  export type JobUpdateOneRequiredWithoutPlanningsNestedInput = {
    create?: XOR<JobCreateWithoutPlanningsInput, JobUncheckedCreateWithoutPlanningsInput>
    connectOrCreate?: JobCreateOrConnectWithoutPlanningsInput
    upsert?: JobUpsertWithoutPlanningsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutPlanningsInput, JobUpdateWithoutPlanningsInput>, JobUncheckedUpdateWithoutPlanningsInput>
  }

  export type JobStepUpdateOneRequiredWithoutPlanningsNestedInput = {
    create?: XOR<JobStepCreateWithoutPlanningsInput, JobStepUncheckedCreateWithoutPlanningsInput>
    connectOrCreate?: JobStepCreateOrConnectWithoutPlanningsInput
    upsert?: JobStepUpsertWithoutPlanningsInput
    connect?: JobStepWhereUniqueInput
    update?: XOR<XOR<JobStepUpdateToOneWithWhereWithoutPlanningsInput, JobStepUpdateWithoutPlanningsInput>, JobStepUncheckedUpdateWithoutPlanningsInput>
  }

  export type JobCreateNestedOneWithoutProductionLogsInput = {
    create?: XOR<JobCreateWithoutProductionLogsInput, JobUncheckedCreateWithoutProductionLogsInput>
    connectOrCreate?: JobCreateOrConnectWithoutProductionLogsInput
    connect?: JobWhereUniqueInput
  }

  export type JobStepCreateNestedOneWithoutProductionLogsInput = {
    create?: XOR<JobStepCreateWithoutProductionLogsInput, JobStepUncheckedCreateWithoutProductionLogsInput>
    connectOrCreate?: JobStepCreateOrConnectWithoutProductionLogsInput
    connect?: JobStepWhereUniqueInput
  }

  export type EmployeeCreateNestedOneWithoutProductionLogsInput = {
    create?: XOR<EmployeeCreateWithoutProductionLogsInput, EmployeeUncheckedCreateWithoutProductionLogsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutProductionLogsInput
    connect?: EmployeeWhereUniqueInput
  }

  export type JobUpdateOneRequiredWithoutProductionLogsNestedInput = {
    create?: XOR<JobCreateWithoutProductionLogsInput, JobUncheckedCreateWithoutProductionLogsInput>
    connectOrCreate?: JobCreateOrConnectWithoutProductionLogsInput
    upsert?: JobUpsertWithoutProductionLogsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutProductionLogsInput, JobUpdateWithoutProductionLogsInput>, JobUncheckedUpdateWithoutProductionLogsInput>
  }

  export type JobStepUpdateOneRequiredWithoutProductionLogsNestedInput = {
    create?: XOR<JobStepCreateWithoutProductionLogsInput, JobStepUncheckedCreateWithoutProductionLogsInput>
    connectOrCreate?: JobStepCreateOrConnectWithoutProductionLogsInput
    upsert?: JobStepUpsertWithoutProductionLogsInput
    connect?: JobStepWhereUniqueInput
    update?: XOR<XOR<JobStepUpdateToOneWithWhereWithoutProductionLogsInput, JobStepUpdateWithoutProductionLogsInput>, JobStepUncheckedUpdateWithoutProductionLogsInput>
  }

  export type EmployeeUpdateOneRequiredWithoutProductionLogsNestedInput = {
    create?: XOR<EmployeeCreateWithoutProductionLogsInput, EmployeeUncheckedCreateWithoutProductionLogsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutProductionLogsInput
    upsert?: EmployeeUpsertWithoutProductionLogsInput
    connect?: EmployeeWhereUniqueInput
    update?: XOR<XOR<EmployeeUpdateToOneWithWhereWithoutProductionLogsInput, EmployeeUpdateWithoutProductionLogsInput>, EmployeeUncheckedUpdateWithoutProductionLogsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EmployeeCreateWithoutRoleInput = {
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    jobs?: JobCreateNestedManyWithoutEmployeeInput
    productionLogs?: ProductionLogCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutRoleInput = {
    employee_id?: number
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    jobs?: JobUncheckedCreateNestedManyWithoutEmployeeInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutRoleInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutRoleInput, EmployeeUncheckedCreateWithoutRoleInput>
  }

  export type EmployeeCreateManyRoleInputEnvelope = {
    data: EmployeeCreateManyRoleInput | EmployeeCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type EmployeeUpsertWithWhereUniqueWithoutRoleInput = {
    where: EmployeeWhereUniqueInput
    update: XOR<EmployeeUpdateWithoutRoleInput, EmployeeUncheckedUpdateWithoutRoleInput>
    create: XOR<EmployeeCreateWithoutRoleInput, EmployeeUncheckedCreateWithoutRoleInput>
  }

  export type EmployeeUpdateWithWhereUniqueWithoutRoleInput = {
    where: EmployeeWhereUniqueInput
    data: XOR<EmployeeUpdateWithoutRoleInput, EmployeeUncheckedUpdateWithoutRoleInput>
  }

  export type EmployeeUpdateManyWithWhereWithoutRoleInput = {
    where: EmployeeScalarWhereInput
    data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyWithoutRoleInput>
  }

  export type EmployeeScalarWhereInput = {
    AND?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
    OR?: EmployeeScalarWhereInput[]
    NOT?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
    employee_id?: IntFilter<"Employee"> | number
    fullname?: StringFilter<"Employee"> | string
    username?: StringFilter<"Employee"> | string
    password?: StringFilter<"Employee"> | string
    email?: StringFilter<"Employee"> | string
    phone?: StringFilter<"Employee"> | string
    role_id?: IntFilter<"Employee"> | number
  }

  export type RoleCreateWithoutEmployeesInput = {
    role_name: string
  }

  export type RoleUncheckedCreateWithoutEmployeesInput = {
    role_id?: number
    role_name: string
  }

  export type RoleCreateOrConnectWithoutEmployeesInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutEmployeesInput, RoleUncheckedCreateWithoutEmployeesInput>
  }

  export type JobCreateWithoutEmployeeInput = {
    job_number: string
    created_date: Date | string
    end_date: Date | string
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    delivery_location: string
    customer: CustomerCreateNestedOneWithoutJobsInput
    jobSteps?: JobStepCreateNestedManyWithoutJobInput
    plannings?: PlanningCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutEmployeeInput = {
    job_id?: number
    job_number: string
    created_date: Date | string
    end_date: Date | string
    customer_id: number
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    delivery_location: string
    jobSteps?: JobStepUncheckedCreateNestedManyWithoutJobInput
    plannings?: PlanningUncheckedCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutEmployeeInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutEmployeeInput, JobUncheckedCreateWithoutEmployeeInput>
  }

  export type JobCreateManyEmployeeInputEnvelope = {
    data: JobCreateManyEmployeeInput | JobCreateManyEmployeeInput[]
    skipDuplicates?: boolean
  }

  export type ProductionLogCreateWithoutEmployeeInput = {
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    job: JobCreateNestedOneWithoutProductionLogsInput
    jobStep: JobStepCreateNestedOneWithoutProductionLogsInput
  }

  export type ProductionLogUncheckedCreateWithoutEmployeeInput = {
    log_id?: number
    job_id: number
    job_step_id: number
    log_date: Date | string
    actual_date: Date | string
    quantity: number
  }

  export type ProductionLogCreateOrConnectWithoutEmployeeInput = {
    where: ProductionLogWhereUniqueInput
    create: XOR<ProductionLogCreateWithoutEmployeeInput, ProductionLogUncheckedCreateWithoutEmployeeInput>
  }

  export type ProductionLogCreateManyEmployeeInputEnvelope = {
    data: ProductionLogCreateManyEmployeeInput | ProductionLogCreateManyEmployeeInput[]
    skipDuplicates?: boolean
  }

  export type RoleUpsertWithoutEmployeesInput = {
    update: XOR<RoleUpdateWithoutEmployeesInput, RoleUncheckedUpdateWithoutEmployeesInput>
    create: XOR<RoleCreateWithoutEmployeesInput, RoleUncheckedCreateWithoutEmployeesInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutEmployeesInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutEmployeesInput, RoleUncheckedUpdateWithoutEmployeesInput>
  }

  export type RoleUpdateWithoutEmployeesInput = {
    role_name?: StringFieldUpdateOperationsInput | string
  }

  export type RoleUncheckedUpdateWithoutEmployeesInput = {
    role_id?: IntFieldUpdateOperationsInput | number
    role_name?: StringFieldUpdateOperationsInput | string
  }

  export type JobUpsertWithWhereUniqueWithoutEmployeeInput = {
    where: JobWhereUniqueInput
    update: XOR<JobUpdateWithoutEmployeeInput, JobUncheckedUpdateWithoutEmployeeInput>
    create: XOR<JobCreateWithoutEmployeeInput, JobUncheckedCreateWithoutEmployeeInput>
  }

  export type JobUpdateWithWhereUniqueWithoutEmployeeInput = {
    where: JobWhereUniqueInput
    data: XOR<JobUpdateWithoutEmployeeInput, JobUncheckedUpdateWithoutEmployeeInput>
  }

  export type JobUpdateManyWithWhereWithoutEmployeeInput = {
    where: JobScalarWhereInput
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyWithoutEmployeeInput>
  }

  export type JobScalarWhereInput = {
    AND?: JobScalarWhereInput | JobScalarWhereInput[]
    OR?: JobScalarWhereInput[]
    NOT?: JobScalarWhereInput | JobScalarWhereInput[]
    job_id?: IntFilter<"Job"> | number
    job_number?: StringFilter<"Job"> | string
    created_date?: DateTimeFilter<"Job"> | Date | string
    end_date?: DateTimeFilter<"Job"> | Date | string
    customer_id?: IntFilter<"Job"> | number
    total_quantity?: IntFilter<"Job"> | number
    clothing_type?: StringFilter<"Job"> | string
    type_of_fabric?: StringFilter<"Job"> | string
    employee_id?: IntFilter<"Job"> | number
    delivery_location?: StringFilter<"Job"> | string
  }

  export type ProductionLogUpsertWithWhereUniqueWithoutEmployeeInput = {
    where: ProductionLogWhereUniqueInput
    update: XOR<ProductionLogUpdateWithoutEmployeeInput, ProductionLogUncheckedUpdateWithoutEmployeeInput>
    create: XOR<ProductionLogCreateWithoutEmployeeInput, ProductionLogUncheckedCreateWithoutEmployeeInput>
  }

  export type ProductionLogUpdateWithWhereUniqueWithoutEmployeeInput = {
    where: ProductionLogWhereUniqueInput
    data: XOR<ProductionLogUpdateWithoutEmployeeInput, ProductionLogUncheckedUpdateWithoutEmployeeInput>
  }

  export type ProductionLogUpdateManyWithWhereWithoutEmployeeInput = {
    where: ProductionLogScalarWhereInput
    data: XOR<ProductionLogUpdateManyMutationInput, ProductionLogUncheckedUpdateManyWithoutEmployeeInput>
  }

  export type ProductionLogScalarWhereInput = {
    AND?: ProductionLogScalarWhereInput | ProductionLogScalarWhereInput[]
    OR?: ProductionLogScalarWhereInput[]
    NOT?: ProductionLogScalarWhereInput | ProductionLogScalarWhereInput[]
    log_id?: IntFilter<"ProductionLog"> | number
    job_id?: IntFilter<"ProductionLog"> | number
    job_step_id?: IntFilter<"ProductionLog"> | number
    log_date?: DateTimeFilter<"ProductionLog"> | Date | string
    actual_date?: DateTimeFilter<"ProductionLog"> | Date | string
    quantity?: IntFilter<"ProductionLog"> | number
    employee_id?: IntFilter<"ProductionLog"> | number
  }

  export type JobCreateWithoutCustomerInput = {
    job_number: string
    created_date: Date | string
    end_date: Date | string
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    delivery_location: string
    employee: EmployeeCreateNestedOneWithoutJobsInput
    jobSteps?: JobStepCreateNestedManyWithoutJobInput
    plannings?: PlanningCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutCustomerInput = {
    job_id?: number
    job_number: string
    created_date: Date | string
    end_date: Date | string
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    employee_id: number
    delivery_location: string
    jobSteps?: JobStepUncheckedCreateNestedManyWithoutJobInput
    plannings?: PlanningUncheckedCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutCustomerInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutCustomerInput, JobUncheckedCreateWithoutCustomerInput>
  }

  export type JobCreateManyCustomerInputEnvelope = {
    data: JobCreateManyCustomerInput | JobCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type JobUpsertWithWhereUniqueWithoutCustomerInput = {
    where: JobWhereUniqueInput
    update: XOR<JobUpdateWithoutCustomerInput, JobUncheckedUpdateWithoutCustomerInput>
    create: XOR<JobCreateWithoutCustomerInput, JobUncheckedCreateWithoutCustomerInput>
  }

  export type JobUpdateWithWhereUniqueWithoutCustomerInput = {
    where: JobWhereUniqueInput
    data: XOR<JobUpdateWithoutCustomerInput, JobUncheckedUpdateWithoutCustomerInput>
  }

  export type JobUpdateManyWithWhereWithoutCustomerInput = {
    where: JobScalarWhereInput
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyWithoutCustomerInput>
  }

  export type CustomerCreateWithoutJobsInput = {
    customer_code: string
    fullname: string
    email: string
    phone: string
    address_detail: string
  }

  export type CustomerUncheckedCreateWithoutJobsInput = {
    customer_id?: number
    customer_code: string
    fullname: string
    email: string
    phone: string
    address_detail: string
  }

  export type CustomerCreateOrConnectWithoutJobsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutJobsInput, CustomerUncheckedCreateWithoutJobsInput>
  }

  export type EmployeeCreateWithoutJobsInput = {
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    role: RoleCreateNestedOneWithoutEmployeesInput
    productionLogs?: ProductionLogCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutJobsInput = {
    employee_id?: number
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    role_id: number
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutJobsInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutJobsInput, EmployeeUncheckedCreateWithoutJobsInput>
  }

  export type JobStepCreateWithoutJobInput = {
    step: StepCreateNestedOneWithoutJobStepsInput
    plannings?: PlanningCreateNestedManyWithoutJobStepInput
    productionLogs?: ProductionLogCreateNestedManyWithoutJobStepInput
  }

  export type JobStepUncheckedCreateWithoutJobInput = {
    job_step_id?: number
    step_id: number
    plannings?: PlanningUncheckedCreateNestedManyWithoutJobStepInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutJobStepInput
  }

  export type JobStepCreateOrConnectWithoutJobInput = {
    where: JobStepWhereUniqueInput
    create: XOR<JobStepCreateWithoutJobInput, JobStepUncheckedCreateWithoutJobInput>
  }

  export type JobStepCreateManyJobInputEnvelope = {
    data: JobStepCreateManyJobInput | JobStepCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type PlanningCreateWithoutJobInput = {
    planned_date: Date | string
    planned_quantity: number
    jobStep: JobStepCreateNestedOneWithoutPlanningsInput
  }

  export type PlanningUncheckedCreateWithoutJobInput = {
    planning_id?: number
    job_step_id: number
    planned_date: Date | string
    planned_quantity: number
  }

  export type PlanningCreateOrConnectWithoutJobInput = {
    where: PlanningWhereUniqueInput
    create: XOR<PlanningCreateWithoutJobInput, PlanningUncheckedCreateWithoutJobInput>
  }

  export type PlanningCreateManyJobInputEnvelope = {
    data: PlanningCreateManyJobInput | PlanningCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type ProductionLogCreateWithoutJobInput = {
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    jobStep: JobStepCreateNestedOneWithoutProductionLogsInput
    employee: EmployeeCreateNestedOneWithoutProductionLogsInput
  }

  export type ProductionLogUncheckedCreateWithoutJobInput = {
    log_id?: number
    job_step_id: number
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    employee_id: number
  }

  export type ProductionLogCreateOrConnectWithoutJobInput = {
    where: ProductionLogWhereUniqueInput
    create: XOR<ProductionLogCreateWithoutJobInput, ProductionLogUncheckedCreateWithoutJobInput>
  }

  export type ProductionLogCreateManyJobInputEnvelope = {
    data: ProductionLogCreateManyJobInput | ProductionLogCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type CustomerUpsertWithoutJobsInput = {
    update: XOR<CustomerUpdateWithoutJobsInput, CustomerUncheckedUpdateWithoutJobsInput>
    create: XOR<CustomerCreateWithoutJobsInput, CustomerUncheckedCreateWithoutJobsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutJobsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutJobsInput, CustomerUncheckedUpdateWithoutJobsInput>
  }

  export type CustomerUpdateWithoutJobsInput = {
    customer_code?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address_detail?: StringFieldUpdateOperationsInput | string
  }

  export type CustomerUncheckedUpdateWithoutJobsInput = {
    customer_id?: IntFieldUpdateOperationsInput | number
    customer_code?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address_detail?: StringFieldUpdateOperationsInput | string
  }

  export type EmployeeUpsertWithoutJobsInput = {
    update: XOR<EmployeeUpdateWithoutJobsInput, EmployeeUncheckedUpdateWithoutJobsInput>
    create: XOR<EmployeeCreateWithoutJobsInput, EmployeeUncheckedCreateWithoutJobsInput>
    where?: EmployeeWhereInput
  }

  export type EmployeeUpdateToOneWithWhereWithoutJobsInput = {
    where?: EmployeeWhereInput
    data: XOR<EmployeeUpdateWithoutJobsInput, EmployeeUncheckedUpdateWithoutJobsInput>
  }

  export type EmployeeUpdateWithoutJobsInput = {
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    role?: RoleUpdateOneRequiredWithoutEmployeesNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutJobsInput = {
    employee_id?: IntFieldUpdateOperationsInput | number
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    role_id?: IntFieldUpdateOperationsInput | number
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type JobStepUpsertWithWhereUniqueWithoutJobInput = {
    where: JobStepWhereUniqueInput
    update: XOR<JobStepUpdateWithoutJobInput, JobStepUncheckedUpdateWithoutJobInput>
    create: XOR<JobStepCreateWithoutJobInput, JobStepUncheckedCreateWithoutJobInput>
  }

  export type JobStepUpdateWithWhereUniqueWithoutJobInput = {
    where: JobStepWhereUniqueInput
    data: XOR<JobStepUpdateWithoutJobInput, JobStepUncheckedUpdateWithoutJobInput>
  }

  export type JobStepUpdateManyWithWhereWithoutJobInput = {
    where: JobStepScalarWhereInput
    data: XOR<JobStepUpdateManyMutationInput, JobStepUncheckedUpdateManyWithoutJobInput>
  }

  export type JobStepScalarWhereInput = {
    AND?: JobStepScalarWhereInput | JobStepScalarWhereInput[]
    OR?: JobStepScalarWhereInput[]
    NOT?: JobStepScalarWhereInput | JobStepScalarWhereInput[]
    job_step_id?: IntFilter<"JobStep"> | number
    job_id?: IntFilter<"JobStep"> | number
    step_id?: IntFilter<"JobStep"> | number
  }

  export type PlanningUpsertWithWhereUniqueWithoutJobInput = {
    where: PlanningWhereUniqueInput
    update: XOR<PlanningUpdateWithoutJobInput, PlanningUncheckedUpdateWithoutJobInput>
    create: XOR<PlanningCreateWithoutJobInput, PlanningUncheckedCreateWithoutJobInput>
  }

  export type PlanningUpdateWithWhereUniqueWithoutJobInput = {
    where: PlanningWhereUniqueInput
    data: XOR<PlanningUpdateWithoutJobInput, PlanningUncheckedUpdateWithoutJobInput>
  }

  export type PlanningUpdateManyWithWhereWithoutJobInput = {
    where: PlanningScalarWhereInput
    data: XOR<PlanningUpdateManyMutationInput, PlanningUncheckedUpdateManyWithoutJobInput>
  }

  export type PlanningScalarWhereInput = {
    AND?: PlanningScalarWhereInput | PlanningScalarWhereInput[]
    OR?: PlanningScalarWhereInput[]
    NOT?: PlanningScalarWhereInput | PlanningScalarWhereInput[]
    planning_id?: IntFilter<"Planning"> | number
    job_id?: IntFilter<"Planning"> | number
    job_step_id?: IntFilter<"Planning"> | number
    planned_date?: DateTimeFilter<"Planning"> | Date | string
    planned_quantity?: IntFilter<"Planning"> | number
  }

  export type ProductionLogUpsertWithWhereUniqueWithoutJobInput = {
    where: ProductionLogWhereUniqueInput
    update: XOR<ProductionLogUpdateWithoutJobInput, ProductionLogUncheckedUpdateWithoutJobInput>
    create: XOR<ProductionLogCreateWithoutJobInput, ProductionLogUncheckedCreateWithoutJobInput>
  }

  export type ProductionLogUpdateWithWhereUniqueWithoutJobInput = {
    where: ProductionLogWhereUniqueInput
    data: XOR<ProductionLogUpdateWithoutJobInput, ProductionLogUncheckedUpdateWithoutJobInput>
  }

  export type ProductionLogUpdateManyWithWhereWithoutJobInput = {
    where: ProductionLogScalarWhereInput
    data: XOR<ProductionLogUpdateManyMutationInput, ProductionLogUncheckedUpdateManyWithoutJobInput>
  }

  export type JobStepCreateWithoutStepInput = {
    job: JobCreateNestedOneWithoutJobStepsInput
    plannings?: PlanningCreateNestedManyWithoutJobStepInput
    productionLogs?: ProductionLogCreateNestedManyWithoutJobStepInput
  }

  export type JobStepUncheckedCreateWithoutStepInput = {
    job_step_id?: number
    job_id: number
    plannings?: PlanningUncheckedCreateNestedManyWithoutJobStepInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutJobStepInput
  }

  export type JobStepCreateOrConnectWithoutStepInput = {
    where: JobStepWhereUniqueInput
    create: XOR<JobStepCreateWithoutStepInput, JobStepUncheckedCreateWithoutStepInput>
  }

  export type JobStepCreateManyStepInputEnvelope = {
    data: JobStepCreateManyStepInput | JobStepCreateManyStepInput[]
    skipDuplicates?: boolean
  }

  export type JobStepUpsertWithWhereUniqueWithoutStepInput = {
    where: JobStepWhereUniqueInput
    update: XOR<JobStepUpdateWithoutStepInput, JobStepUncheckedUpdateWithoutStepInput>
    create: XOR<JobStepCreateWithoutStepInput, JobStepUncheckedCreateWithoutStepInput>
  }

  export type JobStepUpdateWithWhereUniqueWithoutStepInput = {
    where: JobStepWhereUniqueInput
    data: XOR<JobStepUpdateWithoutStepInput, JobStepUncheckedUpdateWithoutStepInput>
  }

  export type JobStepUpdateManyWithWhereWithoutStepInput = {
    where: JobStepScalarWhereInput
    data: XOR<JobStepUpdateManyMutationInput, JobStepUncheckedUpdateManyWithoutStepInput>
  }

  export type JobCreateWithoutJobStepsInput = {
    job_number: string
    created_date: Date | string
    end_date: Date | string
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    delivery_location: string
    customer: CustomerCreateNestedOneWithoutJobsInput
    employee: EmployeeCreateNestedOneWithoutJobsInput
    plannings?: PlanningCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutJobStepsInput = {
    job_id?: number
    job_number: string
    created_date: Date | string
    end_date: Date | string
    customer_id: number
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    employee_id: number
    delivery_location: string
    plannings?: PlanningUncheckedCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutJobStepsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutJobStepsInput, JobUncheckedCreateWithoutJobStepsInput>
  }

  export type StepCreateWithoutJobStepsInput = {
    step_name: string
  }

  export type StepUncheckedCreateWithoutJobStepsInput = {
    step_id?: number
    step_name: string
  }

  export type StepCreateOrConnectWithoutJobStepsInput = {
    where: StepWhereUniqueInput
    create: XOR<StepCreateWithoutJobStepsInput, StepUncheckedCreateWithoutJobStepsInput>
  }

  export type PlanningCreateWithoutJobStepInput = {
    planned_date: Date | string
    planned_quantity: number
    job: JobCreateNestedOneWithoutPlanningsInput
  }

  export type PlanningUncheckedCreateWithoutJobStepInput = {
    planning_id?: number
    job_id: number
    planned_date: Date | string
    planned_quantity: number
  }

  export type PlanningCreateOrConnectWithoutJobStepInput = {
    where: PlanningWhereUniqueInput
    create: XOR<PlanningCreateWithoutJobStepInput, PlanningUncheckedCreateWithoutJobStepInput>
  }

  export type PlanningCreateManyJobStepInputEnvelope = {
    data: PlanningCreateManyJobStepInput | PlanningCreateManyJobStepInput[]
    skipDuplicates?: boolean
  }

  export type ProductionLogCreateWithoutJobStepInput = {
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    job: JobCreateNestedOneWithoutProductionLogsInput
    employee: EmployeeCreateNestedOneWithoutProductionLogsInput
  }

  export type ProductionLogUncheckedCreateWithoutJobStepInput = {
    log_id?: number
    job_id: number
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    employee_id: number
  }

  export type ProductionLogCreateOrConnectWithoutJobStepInput = {
    where: ProductionLogWhereUniqueInput
    create: XOR<ProductionLogCreateWithoutJobStepInput, ProductionLogUncheckedCreateWithoutJobStepInput>
  }

  export type ProductionLogCreateManyJobStepInputEnvelope = {
    data: ProductionLogCreateManyJobStepInput | ProductionLogCreateManyJobStepInput[]
    skipDuplicates?: boolean
  }

  export type JobUpsertWithoutJobStepsInput = {
    update: XOR<JobUpdateWithoutJobStepsInput, JobUncheckedUpdateWithoutJobStepsInput>
    create: XOR<JobCreateWithoutJobStepsInput, JobUncheckedCreateWithoutJobStepsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutJobStepsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutJobStepsInput, JobUncheckedUpdateWithoutJobStepsInput>
  }

  export type JobUpdateWithoutJobStepsInput = {
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    delivery_location?: StringFieldUpdateOperationsInput | string
    customer?: CustomerUpdateOneRequiredWithoutJobsNestedInput
    employee?: EmployeeUpdateOneRequiredWithoutJobsNestedInput
    plannings?: PlanningUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutJobStepsInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    customer_id?: IntFieldUpdateOperationsInput | number
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    employee_id?: IntFieldUpdateOperationsInput | number
    delivery_location?: StringFieldUpdateOperationsInput | string
    plannings?: PlanningUncheckedUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutJobNestedInput
  }

  export type StepUpsertWithoutJobStepsInput = {
    update: XOR<StepUpdateWithoutJobStepsInput, StepUncheckedUpdateWithoutJobStepsInput>
    create: XOR<StepCreateWithoutJobStepsInput, StepUncheckedCreateWithoutJobStepsInput>
    where?: StepWhereInput
  }

  export type StepUpdateToOneWithWhereWithoutJobStepsInput = {
    where?: StepWhereInput
    data: XOR<StepUpdateWithoutJobStepsInput, StepUncheckedUpdateWithoutJobStepsInput>
  }

  export type StepUpdateWithoutJobStepsInput = {
    step_name?: StringFieldUpdateOperationsInput | string
  }

  export type StepUncheckedUpdateWithoutJobStepsInput = {
    step_id?: IntFieldUpdateOperationsInput | number
    step_name?: StringFieldUpdateOperationsInput | string
  }

  export type PlanningUpsertWithWhereUniqueWithoutJobStepInput = {
    where: PlanningWhereUniqueInput
    update: XOR<PlanningUpdateWithoutJobStepInput, PlanningUncheckedUpdateWithoutJobStepInput>
    create: XOR<PlanningCreateWithoutJobStepInput, PlanningUncheckedCreateWithoutJobStepInput>
  }

  export type PlanningUpdateWithWhereUniqueWithoutJobStepInput = {
    where: PlanningWhereUniqueInput
    data: XOR<PlanningUpdateWithoutJobStepInput, PlanningUncheckedUpdateWithoutJobStepInput>
  }

  export type PlanningUpdateManyWithWhereWithoutJobStepInput = {
    where: PlanningScalarWhereInput
    data: XOR<PlanningUpdateManyMutationInput, PlanningUncheckedUpdateManyWithoutJobStepInput>
  }

  export type ProductionLogUpsertWithWhereUniqueWithoutJobStepInput = {
    where: ProductionLogWhereUniqueInput
    update: XOR<ProductionLogUpdateWithoutJobStepInput, ProductionLogUncheckedUpdateWithoutJobStepInput>
    create: XOR<ProductionLogCreateWithoutJobStepInput, ProductionLogUncheckedCreateWithoutJobStepInput>
  }

  export type ProductionLogUpdateWithWhereUniqueWithoutJobStepInput = {
    where: ProductionLogWhereUniqueInput
    data: XOR<ProductionLogUpdateWithoutJobStepInput, ProductionLogUncheckedUpdateWithoutJobStepInput>
  }

  export type ProductionLogUpdateManyWithWhereWithoutJobStepInput = {
    where: ProductionLogScalarWhereInput
    data: XOR<ProductionLogUpdateManyMutationInput, ProductionLogUncheckedUpdateManyWithoutJobStepInput>
  }

  export type JobCreateWithoutPlanningsInput = {
    job_number: string
    created_date: Date | string
    end_date: Date | string
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    delivery_location: string
    customer: CustomerCreateNestedOneWithoutJobsInput
    employee: EmployeeCreateNestedOneWithoutJobsInput
    jobSteps?: JobStepCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutPlanningsInput = {
    job_id?: number
    job_number: string
    created_date: Date | string
    end_date: Date | string
    customer_id: number
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    employee_id: number
    delivery_location: string
    jobSteps?: JobStepUncheckedCreateNestedManyWithoutJobInput
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutPlanningsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutPlanningsInput, JobUncheckedCreateWithoutPlanningsInput>
  }

  export type JobStepCreateWithoutPlanningsInput = {
    job: JobCreateNestedOneWithoutJobStepsInput
    step: StepCreateNestedOneWithoutJobStepsInput
    productionLogs?: ProductionLogCreateNestedManyWithoutJobStepInput
  }

  export type JobStepUncheckedCreateWithoutPlanningsInput = {
    job_step_id?: number
    job_id: number
    step_id: number
    productionLogs?: ProductionLogUncheckedCreateNestedManyWithoutJobStepInput
  }

  export type JobStepCreateOrConnectWithoutPlanningsInput = {
    where: JobStepWhereUniqueInput
    create: XOR<JobStepCreateWithoutPlanningsInput, JobStepUncheckedCreateWithoutPlanningsInput>
  }

  export type JobUpsertWithoutPlanningsInput = {
    update: XOR<JobUpdateWithoutPlanningsInput, JobUncheckedUpdateWithoutPlanningsInput>
    create: XOR<JobCreateWithoutPlanningsInput, JobUncheckedCreateWithoutPlanningsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutPlanningsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutPlanningsInput, JobUncheckedUpdateWithoutPlanningsInput>
  }

  export type JobUpdateWithoutPlanningsInput = {
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    delivery_location?: StringFieldUpdateOperationsInput | string
    customer?: CustomerUpdateOneRequiredWithoutJobsNestedInput
    employee?: EmployeeUpdateOneRequiredWithoutJobsNestedInput
    jobSteps?: JobStepUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutPlanningsInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    customer_id?: IntFieldUpdateOperationsInput | number
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    employee_id?: IntFieldUpdateOperationsInput | number
    delivery_location?: StringFieldUpdateOperationsInput | string
    jobSteps?: JobStepUncheckedUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobStepUpsertWithoutPlanningsInput = {
    update: XOR<JobStepUpdateWithoutPlanningsInput, JobStepUncheckedUpdateWithoutPlanningsInput>
    create: XOR<JobStepCreateWithoutPlanningsInput, JobStepUncheckedCreateWithoutPlanningsInput>
    where?: JobStepWhereInput
  }

  export type JobStepUpdateToOneWithWhereWithoutPlanningsInput = {
    where?: JobStepWhereInput
    data: XOR<JobStepUpdateWithoutPlanningsInput, JobStepUncheckedUpdateWithoutPlanningsInput>
  }

  export type JobStepUpdateWithoutPlanningsInput = {
    job?: JobUpdateOneRequiredWithoutJobStepsNestedInput
    step?: StepUpdateOneRequiredWithoutJobStepsNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutJobStepNestedInput
  }

  export type JobStepUncheckedUpdateWithoutPlanningsInput = {
    job_step_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    step_id?: IntFieldUpdateOperationsInput | number
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutJobStepNestedInput
  }

  export type JobCreateWithoutProductionLogsInput = {
    job_number: string
    created_date: Date | string
    end_date: Date | string
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    delivery_location: string
    customer: CustomerCreateNestedOneWithoutJobsInput
    employee: EmployeeCreateNestedOneWithoutJobsInput
    jobSteps?: JobStepCreateNestedManyWithoutJobInput
    plannings?: PlanningCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutProductionLogsInput = {
    job_id?: number
    job_number: string
    created_date: Date | string
    end_date: Date | string
    customer_id: number
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    employee_id: number
    delivery_location: string
    jobSteps?: JobStepUncheckedCreateNestedManyWithoutJobInput
    plannings?: PlanningUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutProductionLogsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutProductionLogsInput, JobUncheckedCreateWithoutProductionLogsInput>
  }

  export type JobStepCreateWithoutProductionLogsInput = {
    job: JobCreateNestedOneWithoutJobStepsInput
    step: StepCreateNestedOneWithoutJobStepsInput
    plannings?: PlanningCreateNestedManyWithoutJobStepInput
  }

  export type JobStepUncheckedCreateWithoutProductionLogsInput = {
    job_step_id?: number
    job_id: number
    step_id: number
    plannings?: PlanningUncheckedCreateNestedManyWithoutJobStepInput
  }

  export type JobStepCreateOrConnectWithoutProductionLogsInput = {
    where: JobStepWhereUniqueInput
    create: XOR<JobStepCreateWithoutProductionLogsInput, JobStepUncheckedCreateWithoutProductionLogsInput>
  }

  export type EmployeeCreateWithoutProductionLogsInput = {
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    role: RoleCreateNestedOneWithoutEmployeesInput
    jobs?: JobCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutProductionLogsInput = {
    employee_id?: number
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    role_id: number
    jobs?: JobUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutProductionLogsInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutProductionLogsInput, EmployeeUncheckedCreateWithoutProductionLogsInput>
  }

  export type JobUpsertWithoutProductionLogsInput = {
    update: XOR<JobUpdateWithoutProductionLogsInput, JobUncheckedUpdateWithoutProductionLogsInput>
    create: XOR<JobCreateWithoutProductionLogsInput, JobUncheckedCreateWithoutProductionLogsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutProductionLogsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutProductionLogsInput, JobUncheckedUpdateWithoutProductionLogsInput>
  }

  export type JobUpdateWithoutProductionLogsInput = {
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    delivery_location?: StringFieldUpdateOperationsInput | string
    customer?: CustomerUpdateOneRequiredWithoutJobsNestedInput
    employee?: EmployeeUpdateOneRequiredWithoutJobsNestedInput
    jobSteps?: JobStepUpdateManyWithoutJobNestedInput
    plannings?: PlanningUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutProductionLogsInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    customer_id?: IntFieldUpdateOperationsInput | number
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    employee_id?: IntFieldUpdateOperationsInput | number
    delivery_location?: StringFieldUpdateOperationsInput | string
    jobSteps?: JobStepUncheckedUpdateManyWithoutJobNestedInput
    plannings?: PlanningUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobStepUpsertWithoutProductionLogsInput = {
    update: XOR<JobStepUpdateWithoutProductionLogsInput, JobStepUncheckedUpdateWithoutProductionLogsInput>
    create: XOR<JobStepCreateWithoutProductionLogsInput, JobStepUncheckedCreateWithoutProductionLogsInput>
    where?: JobStepWhereInput
  }

  export type JobStepUpdateToOneWithWhereWithoutProductionLogsInput = {
    where?: JobStepWhereInput
    data: XOR<JobStepUpdateWithoutProductionLogsInput, JobStepUncheckedUpdateWithoutProductionLogsInput>
  }

  export type JobStepUpdateWithoutProductionLogsInput = {
    job?: JobUpdateOneRequiredWithoutJobStepsNestedInput
    step?: StepUpdateOneRequiredWithoutJobStepsNestedInput
    plannings?: PlanningUpdateManyWithoutJobStepNestedInput
  }

  export type JobStepUncheckedUpdateWithoutProductionLogsInput = {
    job_step_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    step_id?: IntFieldUpdateOperationsInput | number
    plannings?: PlanningUncheckedUpdateManyWithoutJobStepNestedInput
  }

  export type EmployeeUpsertWithoutProductionLogsInput = {
    update: XOR<EmployeeUpdateWithoutProductionLogsInput, EmployeeUncheckedUpdateWithoutProductionLogsInput>
    create: XOR<EmployeeCreateWithoutProductionLogsInput, EmployeeUncheckedCreateWithoutProductionLogsInput>
    where?: EmployeeWhereInput
  }

  export type EmployeeUpdateToOneWithWhereWithoutProductionLogsInput = {
    where?: EmployeeWhereInput
    data: XOR<EmployeeUpdateWithoutProductionLogsInput, EmployeeUncheckedUpdateWithoutProductionLogsInput>
  }

  export type EmployeeUpdateWithoutProductionLogsInput = {
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    role?: RoleUpdateOneRequiredWithoutEmployeesNestedInput
    jobs?: JobUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutProductionLogsInput = {
    employee_id?: IntFieldUpdateOperationsInput | number
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    role_id?: IntFieldUpdateOperationsInput | number
    jobs?: JobUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeCreateManyRoleInput = {
    employee_id?: number
    fullname: string
    username: string
    password: string
    email: string
    phone: string
  }

  export type EmployeeUpdateWithoutRoleInput = {
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    jobs?: JobUpdateManyWithoutEmployeeNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutRoleInput = {
    employee_id?: IntFieldUpdateOperationsInput | number
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    jobs?: JobUncheckedUpdateManyWithoutEmployeeNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateManyWithoutRoleInput = {
    employee_id?: IntFieldUpdateOperationsInput | number
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type JobCreateManyEmployeeInput = {
    job_id?: number
    job_number: string
    created_date: Date | string
    end_date: Date | string
    customer_id: number
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    delivery_location: string
  }

  export type ProductionLogCreateManyEmployeeInput = {
    log_id?: number
    job_id: number
    job_step_id: number
    log_date: Date | string
    actual_date: Date | string
    quantity: number
  }

  export type JobUpdateWithoutEmployeeInput = {
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    delivery_location?: StringFieldUpdateOperationsInput | string
    customer?: CustomerUpdateOneRequiredWithoutJobsNestedInput
    jobSteps?: JobStepUpdateManyWithoutJobNestedInput
    plannings?: PlanningUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutEmployeeInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    customer_id?: IntFieldUpdateOperationsInput | number
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    delivery_location?: StringFieldUpdateOperationsInput | string
    jobSteps?: JobStepUncheckedUpdateManyWithoutJobNestedInput
    plannings?: PlanningUncheckedUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateManyWithoutEmployeeInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    customer_id?: IntFieldUpdateOperationsInput | number
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    delivery_location?: StringFieldUpdateOperationsInput | string
  }

  export type ProductionLogUpdateWithoutEmployeeInput = {
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    job?: JobUpdateOneRequiredWithoutProductionLogsNestedInput
    jobStep?: JobStepUpdateOneRequiredWithoutProductionLogsNestedInput
  }

  export type ProductionLogUncheckedUpdateWithoutEmployeeInput = {
    log_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ProductionLogUncheckedUpdateManyWithoutEmployeeInput = {
    log_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type JobCreateManyCustomerInput = {
    job_id?: number
    job_number: string
    created_date: Date | string
    end_date: Date | string
    total_quantity: number
    clothing_type: string
    type_of_fabric: string
    employee_id: number
    delivery_location: string
  }

  export type JobUpdateWithoutCustomerInput = {
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    delivery_location?: StringFieldUpdateOperationsInput | string
    employee?: EmployeeUpdateOneRequiredWithoutJobsNestedInput
    jobSteps?: JobStepUpdateManyWithoutJobNestedInput
    plannings?: PlanningUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutCustomerInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    employee_id?: IntFieldUpdateOperationsInput | number
    delivery_location?: StringFieldUpdateOperationsInput | string
    jobSteps?: JobStepUncheckedUpdateManyWithoutJobNestedInput
    plannings?: PlanningUncheckedUpdateManyWithoutJobNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateManyWithoutCustomerInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_number?: StringFieldUpdateOperationsInput | string
    created_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    total_quantity?: IntFieldUpdateOperationsInput | number
    clothing_type?: StringFieldUpdateOperationsInput | string
    type_of_fabric?: StringFieldUpdateOperationsInput | string
    employee_id?: IntFieldUpdateOperationsInput | number
    delivery_location?: StringFieldUpdateOperationsInput | string
  }

  export type JobStepCreateManyJobInput = {
    job_step_id?: number
    step_id: number
  }

  export type PlanningCreateManyJobInput = {
    planning_id?: number
    job_step_id: number
    planned_date: Date | string
    planned_quantity: number
  }

  export type ProductionLogCreateManyJobInput = {
    log_id?: number
    job_step_id: number
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    employee_id: number
  }

  export type JobStepUpdateWithoutJobInput = {
    step?: StepUpdateOneRequiredWithoutJobStepsNestedInput
    plannings?: PlanningUpdateManyWithoutJobStepNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutJobStepNestedInput
  }

  export type JobStepUncheckedUpdateWithoutJobInput = {
    job_step_id?: IntFieldUpdateOperationsInput | number
    step_id?: IntFieldUpdateOperationsInput | number
    plannings?: PlanningUncheckedUpdateManyWithoutJobStepNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutJobStepNestedInput
  }

  export type JobStepUncheckedUpdateManyWithoutJobInput = {
    job_step_id?: IntFieldUpdateOperationsInput | number
    step_id?: IntFieldUpdateOperationsInput | number
  }

  export type PlanningUpdateWithoutJobInput = {
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
    jobStep?: JobStepUpdateOneRequiredWithoutPlanningsNestedInput
  }

  export type PlanningUncheckedUpdateWithoutJobInput = {
    planning_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
  }

  export type PlanningUncheckedUpdateManyWithoutJobInput = {
    planning_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ProductionLogUpdateWithoutJobInput = {
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    jobStep?: JobStepUpdateOneRequiredWithoutProductionLogsNestedInput
    employee?: EmployeeUpdateOneRequiredWithoutProductionLogsNestedInput
  }

  export type ProductionLogUncheckedUpdateWithoutJobInput = {
    log_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    employee_id?: IntFieldUpdateOperationsInput | number
  }

  export type ProductionLogUncheckedUpdateManyWithoutJobInput = {
    log_id?: IntFieldUpdateOperationsInput | number
    job_step_id?: IntFieldUpdateOperationsInput | number
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    employee_id?: IntFieldUpdateOperationsInput | number
  }

  export type JobStepCreateManyStepInput = {
    job_step_id?: number
    job_id: number
  }

  export type JobStepUpdateWithoutStepInput = {
    job?: JobUpdateOneRequiredWithoutJobStepsNestedInput
    plannings?: PlanningUpdateManyWithoutJobStepNestedInput
    productionLogs?: ProductionLogUpdateManyWithoutJobStepNestedInput
  }

  export type JobStepUncheckedUpdateWithoutStepInput = {
    job_step_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    plannings?: PlanningUncheckedUpdateManyWithoutJobStepNestedInput
    productionLogs?: ProductionLogUncheckedUpdateManyWithoutJobStepNestedInput
  }

  export type JobStepUncheckedUpdateManyWithoutStepInput = {
    job_step_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
  }

  export type PlanningCreateManyJobStepInput = {
    planning_id?: number
    job_id: number
    planned_date: Date | string
    planned_quantity: number
  }

  export type ProductionLogCreateManyJobStepInput = {
    log_id?: number
    job_id: number
    log_date: Date | string
    actual_date: Date | string
    quantity: number
    employee_id: number
  }

  export type PlanningUpdateWithoutJobStepInput = {
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
    job?: JobUpdateOneRequiredWithoutPlanningsNestedInput
  }

  export type PlanningUncheckedUpdateWithoutJobStepInput = {
    planning_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
  }

  export type PlanningUncheckedUpdateManyWithoutJobStepInput = {
    planning_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    planned_date?: DateTimeFieldUpdateOperationsInput | Date | string
    planned_quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ProductionLogUpdateWithoutJobStepInput = {
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    job?: JobUpdateOneRequiredWithoutProductionLogsNestedInput
    employee?: EmployeeUpdateOneRequiredWithoutProductionLogsNestedInput
  }

  export type ProductionLogUncheckedUpdateWithoutJobStepInput = {
    log_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    employee_id?: IntFieldUpdateOperationsInput | number
  }

  export type ProductionLogUncheckedUpdateManyWithoutJobStepInput = {
    log_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    log_date?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_date?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    employee_id?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
import { expect, it } from "vitest";
import { fetchUser } from "fake-external-lib";

type Middleware<TInput, TOutput> = (
  input: TInput
) => TOutput | Promise<TOutput>;

/**
 * In this problem, we need to type the return type of the use()
 * method to make it update the TOutput generic with a new one.
 *
 * Currently, the use method just uses the same TOutput as the
 * first middleware you pass in. But it should infer the _new_
 * output from the middleware you pass in.
 */
class DynamicMiddleware<TInput, TOutput> {
  private middleware: Middleware<any, any>[] = [];

  constructor(firstMiddleware: Middleware<TInput, TOutput>) {
    this.middleware.push(firstMiddleware);
  }

  // Clue: you'll need to make changes here!
  use<TA>(middleware: Middleware<TOutput, TA>): DynamicMiddleware<TInput, TA> {
    this.middleware.push(middleware);

    return this as any;
    //          ^ You'll need the 'as any'!
  }

  async run(input: TInput): Promise<TOutput> {
    let result: TOutput = input as any;

    for (const middleware of this.middleware) {
      result = await middleware(result);
    }

    return result;
  }
}

const middleware = new DynamicMiddleware((req: Request) => {
  return {
    ...req,
    // Transforms /user/123 to 123
    userId: req.url.split("/")[2],
  };
})
  .use((req) => {
    if (req.userId === "123") {
      throw new Error();
    }
    return req;
  })
  .use(async (req) => {
    return {
      ...req,
      user: await fetchUser(req.userId),
    };
  });

it("Should fail if the user id is 123", () => {
  expect(middleware.run({ url: "/user/123" } as Request)).rejects.toThrow();
});

it("Should return a request with a user", async () => {
  const result = await middleware.run({ url: "/user/matt" } as Request);

  expect(result.user.id).toBe("matt");
  expect(result.user.firstName).toBe("John");
  expect(result.user.lastName).toBe("Doe");
});

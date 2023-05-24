import { createNextApiHandler } from "@trpc/server/adapters/next"

import { env } from "n/env.mjs"
import { createContext } from "n/server/trpc/context"
import { appRouter } from "n/server/trpc/routers/_app"

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          )
        }
      : undefined,
})

import { router } from "../trpc"
import { adminRouter } from "./admin"
import { menuRouter } from "./menu"

export const appRouter = router({
  admin: adminRouter,
  menu: menuRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

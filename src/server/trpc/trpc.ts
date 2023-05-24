import { TRPCError, initTRPC } from "@trpc/server"
import superjson from "superjson"

import { type Context } from "./context"
import { verifyAuth } from "n/lib/auth"

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

const isAdmin = t.middleware(async ({ ctx, next }) => {
  const { req } = ctx
  const token = req.cookies["user-token"]

  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing User Token" })
  }

  const verifiedToken = await verifyAuth(token)

  if (!verifiedToken) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid user token" })
  }

  // user is authenticated as admin
  return next()
})

export const router = t.router

export const publicProcedure = t.procedure
export const adminProcedure = t.procedure.use(isAdmin)

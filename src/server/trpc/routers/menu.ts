import { s3 } from "n/lib/s3"
import { publicProcedure, router } from "../trpc"

// sleep
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const menuRouter = router({
  getMenuItems: publicProcedure.query(async ({ ctx }) => {
    const menuItems = await ctx.prisma.menuItem.findMany()

    // Each menu Item only contains its AWS key. Now Extend all items with their actual img url
    const withUrls = await Promise.all(
      menuItems.map(async (menuItem) => ({
        ...menuItem,
        url: await s3.getSignedUrlPromise("getObject", {
          Bucket: "junaid-booking-app",
          Key: menuItem.imageKey,
        }),
      }))
    )
    return withUrls
  }),

  checkMenuStatus: publicProcedure.mutation(async () => {
    // Handle menu checking logic
    await sleep(1000)

    return { success: true }
  }),
})

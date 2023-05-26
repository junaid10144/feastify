import { type AppType } from "next/app"

import { trpc } from "n/utils/trpc"

import "n/styles/globals.css"
import "n/styles/Calendar.css"
import "n/styles/Spinner.css"

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default trpc.withTRPC(MyApp)

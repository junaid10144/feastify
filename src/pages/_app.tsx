import { type AppType } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"

import { trpc } from "n/utils/trpc"

import "n/styles/globals.css"
import "n/styles/Calendar.css"
import "n/styles/Spinner.css"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default trpc.withTRPC(MyApp)

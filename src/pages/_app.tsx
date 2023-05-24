import { type AppType } from "next/app";

import { api } from "n/utils/api";

import "n/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);

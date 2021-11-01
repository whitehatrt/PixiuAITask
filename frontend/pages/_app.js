import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";

function MyApp({ Component, pageProps }) {
  axios.defaults.baseURL = "http://127.0.0.1:8000/";
  axios.defaults.headers['Content-Type'] = 'application/json'
  axios.defaults.xsrfCookieName = 'csrftoken'
  axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
  axios.defaults.withCredentials = true
  
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;

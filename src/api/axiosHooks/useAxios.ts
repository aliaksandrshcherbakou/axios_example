import axios from "axios";

import { useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(axios.defaults.headers as any)["Content-Type"] = "application/json";

const useAxios = () => {
  const instance = useRef(
    axios.create({
      baseURL: 'https://api.restful-api.dev/',
    }),
  );
  return instance.current;
};

export default useAxios;

import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { EndpointQuery, HookReturnTypeQuery, RequestObject } from "./axios";
import { axiosReject, axiosResponse, initialState, requestStart } from "./axiosHelpers";
import useAxios from "./useAxios";

const useRequestQuery = <Response, Request>(params: EndpointQuery<Request>): HookReturnTypeQuery<Request, Response> => {
  const instance = useAxios();

  const [state, setData] = useState<RequestObject<Response>>(initialState);

  const simpleRequest = useCallback((data?: Request) => {
    setData(requestStart);
    instance[params.method]<Request, AxiosResponse<Response>>(params.url, {
      ...params.config,
      params: {
        ...data,
      },
    })
      .then((response) => {
        setData({
          ...axiosResponse,
          data: response.data,
        });
      })
      .catch((e) => {
        setData({
          ...axiosReject,
          error: e.response,
        });
      });
  }, []);

  useEffect(() => {
    if (!params.skip) {
      simpleRequest();
    }
  }, [params.skip]);

  const requestWithData = useCallback((data?: Request) => {
    setData(requestStart);
    instance[params.method]<Request, AxiosResponse<Response>>(params.url, { ...params.data, ...data }, params.config)
      .then((response) => {
        setData({
          ...axiosResponse,
          data: response.data,
        });
      })
      .catch((e) => {
        setData({
          ...axiosReject,
          error: e.response,
        });
      });
  }, []);

  const refetch = useCallback((data?: Request) => {
    if (params.method === "get" || params.method === "delete") {
      simpleRequest(data);
    } else {
      requestWithData(data);
    }
  }, []);

  return { refetch, ...state };
};

export default useRequestQuery;

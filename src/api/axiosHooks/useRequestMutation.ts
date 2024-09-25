import { AxiosResponse } from "axios";
import { useCallback, useState } from "react";
import { EndpointMutation, HookReturnTypeMutation, RequestObject } from "./axios";
import { axiosReject, axiosResponse, initialState, requestStart } from "./axiosHelpers";
import useAxios from "./useAxios";

const useRequestMutation = <Response, Request>(
  params: EndpointMutation<Request>
): HookReturnTypeMutation<Request, Response> => {
  const instance = useAxios();

  const [state, setData] = useState<RequestObject<Response>>(initialState);

  const simpleRequest = useCallback(() => {
    setData(requestStart);
    const data = params.query();
    instance[data.method]<Request, AxiosResponse<Response>>(data.url, data.config)
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

  const requestWithData = useCallback((requestData?: Request) => {
    setData(requestStart);
    const data = params.query(requestData);
    if (data.method === "delete" || data.method === "get") {
      instance[data.method]<Request, AxiosResponse<Response>>(data.url, data.config || { data: data.body })
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
    } else {
      instance[data.method]<Request, AxiosResponse<Response>>(data.url, data.body || requestData, data.config)
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
    }
  }, []);

  const fetch = useCallback((requestData?: Request) => {
    if (!requestData) {
      simpleRequest();
    } else {
      requestWithData(requestData);
    }
  }, []);

  return [fetch, state];
};

export default useRequestMutation;

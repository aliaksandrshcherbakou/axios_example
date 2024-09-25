export const initialState = {
  data: undefined,
  isError: false,
  isLoading: false,
  isSuccess: false,
  isUninitialized: false,
  error: undefined,
};

export const requestStart = {
  data: undefined,
  isLoading: true,
  isSuccess: false,
  isError: false,
  isUninitialized: true,
  error: undefined,
};

export const axiosResponse = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  isUninitialized: true,
  error: undefined,
};

export const axiosReject = {
  data: undefined,
  isLoading: false,
  isSuccess: false,
  isError: true,
  isUninitialized: true,
};

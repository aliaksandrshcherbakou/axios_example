import axios, {AxiosError, AxiosRequestConfig} from 'axios';

export interface EndpointQuery<T> {
	url: string;
	method: keyof Methods;
	config?: AxiosRequestConfig;
	data?: T;
	skip?: boolean;
}

export type EndpointMutation<Request> = {
	query: (data?: Request) => {url: string; method: keyof Methods; config?: AxiosRequestConfig; body?: unknown};
};

export type HookReturnTypeMutation<Request, Response> = [(requestData?: Request) => void, RequestObject<Response>];
export type HookReturnTypeQuery<Request, Response> = {
	refetch: (requestData?: Request) => void;
	data: Response | undefined;
	isError: boolean;
	isLoading: boolean;
	isSuccess: boolean;
	isUninitialized: boolean;
	error?: AxiosError;
};

export interface RequestObject<Response> {
	data: Response | undefined;
	isError: boolean;
	isLoading: boolean;
	isSuccess: boolean;
	isUninitialized: boolean;
	error?: AxiosError;
}

export interface Methods {
	get: typeof axios.get;
	put: typeof axios.put;
	delete: typeof axios.delete;
	patch: typeof axios.patch;
	post: typeof axios.post;
}

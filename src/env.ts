import {API_BASE, API_HOST, API_KEY} from '@env';

export type ENV = {
  API_HOST: string;
  API_BASE: string;
  API_KEY: string;
};

export const envs: ENV = {
  API_HOST,
  API_BASE,
  API_KEY,
};

export const setEnv = (value: string, rout: keyof ENV) => {
  envs[rout] = value;
};

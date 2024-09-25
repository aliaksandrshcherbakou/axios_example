import {SerializedError} from '@reduxjs/toolkit';
import {FetchBaseQueryError} from '@reduxjs/toolkit/dist/query';
import {ErrorCustom} from '../types';

export const getErrorPhone = (
  err: FetchBaseQueryError | SerializedError | undefined,
  current?: string,
): boolean | undefined | string => {
  if (current) {
    if (err) {
      if ('data' in err) {
        if (
          (
            err?.data as {
              errorMessage: string;
            }
          )?.errorMessage === current
        ) {
          return true;
        }
      }
    }
    return false;
  } else {
    if (err) {
      if ('data' in err) {
        if ((err?.data as ErrorCustom)?.errorMessage) {
          return (err?.data as ErrorCustom).errorMessage;
        }
      }
      if ('message' in err) {
        return err.message;
      }
    }
    return undefined;
  }
};

export const getError = (err: FetchBaseQueryError | SerializedError | undefined): undefined | string => {
  if (err) {
    if ('data' in err) {
      if ((err?.data as ErrorCustom)?.errorMessage) {
        return (err?.data as ErrorCustom).errorMessage;
      }
    }
    if ('message' in err) {
      return err.message;
    }
  }
  return 'An error has occurred, please try again later';
};

import {Product, ProductAddResponse, ProductDataRequest} from '@Types/index';
import {useRequestMutation, useRequestQuery} from './axiosHooks';


const useAddMutation = () => {
  return useRequestMutation<ProductAddResponse, ProductDataRequest>({
    query: data => ({url: 'objects', method: 'post', body: data}),
  });
};

const useAllQuery = () =>
  useRequestQuery<Product[], string>({
    url: 'objects',
    method: 'get',
    skip: true,
  });

// eslint-disable-next-line import/prefer-default-export
export {useAddMutation, useAllQuery};

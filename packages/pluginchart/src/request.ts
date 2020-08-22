import { extend } from 'umi-request';

const request = extend({
  prefix: '/apisix/admin',
  timeout: 1000,
  headers: {
    Authorization: localStorage.getItem('GLOBAL_AUTHORIZATION') || '',
  },
});

export default request;

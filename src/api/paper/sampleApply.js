import axios from '@/libs/api.request';
import { getToken } from '@/libs/util';

export const sampleApplyListPage = data => {
  return axios.request({
    url: '/paper/sampleApply/page',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  });
};

export const traceList = id => {
  return axios.request({
    url: '/paper/sampleApply/traceList/' + id,
    headers: {
      token: getToken()
    },
    method: 'get'
  });
};

export const addTrace = (id, data) => {
  return axios.request({
    url: '/paper/sampleApply/addTrace/' + id,
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  });
};

export const delTrace = data => {
  return axios.request({
    url: '/paper/sampleApply/deleteTrace',
    headers: {
      token: getToken()
    },
    data,
    method: 'delete'
  });
};

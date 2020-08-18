import axios from '@/libs/api.request';
import { getToken } from '@/libs/util';

// 分页查询专家列表
export const paperListPage = data => {
  return axios.request({
    url: '/paper/page',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  });
};

// 新增专家
export const addPaper = data => {
  return axios.request({
    url: '/paper/add',
    headers: {
      token: getToken()
    },
    data,
    method: 'post'
  });
};

// 删除专家
export const deletePaper = data => {
  return axios.request({
    url: '/paper/delete',
    headers: {
      token: getToken()
    },
    data,
    method: 'delete'
  });
};

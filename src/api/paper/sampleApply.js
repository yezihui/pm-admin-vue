import axios from '@/libs/api.request';
import { getToken } from '@/libs/util';

// 分页查询专家列表
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

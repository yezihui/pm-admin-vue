import {Message, Modal} from 'view-design'
import { getToken } from '@/libs/util';
import { downloadStatus } from '@/Bus/bus.js';
import axiosA from 'axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const downLoadFile = (url, data) => {
  axiosA({
    url: baseUrl + url,
    headers: {
      token: getToken()
    },
    data,
    method: 'post',
    responseType: 'blob'
  }).then(response => {
    console.log(downloadStatus);
    let data = response.data
    let headers = response.headers
    let filename = headers['content-disposition'].split(';')[1].split('=')[1];
    filename = decodeURIComponent(filename);
    if (!data) {
      return
    }
    let url = window.URL.createObjectURL(new Blob([data], { type: headers['content-type'] }))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    downloadStatus.status = false
  }).catch((error) => {
    console.log(error);
    downloadStatus.status = false
    Message.error('服务器异常')
  });
};

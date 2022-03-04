import axios from 'axios';
import { getCookies } from '@/libs/util.js'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.transformRequest = [function(data) {
//   let ret = ''
//   if (typeof data === typeof '') {
//     return data
//   }
//   for (let it in data) {
//     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//   }
//   return ret
// }]
const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  baseURL: 'http://127.0.0.1:7001',
  timeout: 5000,
  headers: { 'Cache-Control': 'no-cache', 'Authorization': getCookies('token') },
  withCredentials: false, // 发送请求是否携带cookies  默认false不携带
});

service.interceptors.request.use(
  config => { return config },
  error => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  response => {
    return response
    // if (response.status === 200) {
    //   return response.data;
    // } else {
    //   Promise.reject();
    // }
  },
  error => {
    return error
    // console.log(error);
    // return Promise.reject();
  }
);

export default service;

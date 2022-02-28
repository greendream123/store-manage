import axios from 'axios';

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  baseURL: 'http://127.0.0.1:7001',
  timeout: 5000
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

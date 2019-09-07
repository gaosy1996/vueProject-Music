import axios from 'axios';

let request = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '' : '/api',
    timeout: 5000
})

//请求拦截
request.interceptors.request.use((config) => {
    config.headers.token = window.localStorage.getItem('token');
    console.log(config)
    return config
})

//响应
request.interceptors.response.use((response) => {
    return response.data
}, (err) => {
    console.log(err)
})

let get = (url) => request.get(url);

let post = (url, params) => request.post(url, params || {});

export {
    get, post
}
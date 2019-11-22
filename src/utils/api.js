import axios from "axios";

axios.defaults.timeout = 5000; // 请求超时
axios.defaults.baseURL = "/api/"; // api 即上面 vue.config.js 中配置的地址

function getAllGoods() {
    return axios.get("/goods/");
}

function checkLogin() {
    return axios.get("/user/session/");
}

function getUserInfo(id) {
    return axios.get(`/user/${id}/`);
}

function getGoodsType(id) {
    return axios.get(`/goodsTypes/${id}`);
}

function logout() {
    return axios.get("/user/session/clean/");
}

function login(data) {
    return axios.get("/user/", {
        params: {
            username: data.name,
            password: data.password
        }
    });
}

export default {
    getAllGoods,
    logout,
    login,
    getUserInfo,
    getGoodsType
};
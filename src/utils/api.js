import axios from "axios";

axios.defaults.timeout = 5000; // 请求超时
axios.defaults.baseURL = "/api/"; // api 即上面 vue.config.js 中配置的地址

function getAllGoods() {
    return axios.get("/goods/");
}

function getGoodsInfo(id) {
    return axios.get(`/goods/${id}`);
}

function getCurUserId() {
    return axios.get("/user/session/");
}

function getUserInfo(id) {
    return axios.get(`/user/${id}/`);
}

function getCurrentGoodsInfo() {
    return axios.get("/user/information/me");
}

function getGoodsType(id) {
    return axios.get(`/goodsTypes/${id}`);
}

function changeUserInfo(data) {
    return axios.put("/user", data);
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

function bid(id, price) {
    return axios.get(`/trade/bid/${id}`, {
        params: {
            price: price
        }
    });
}

export default {
    getAllGoods,
    logout,
    login,
    getUserInfo,
    getGoodsType,
    getGoodsInfo,
    getCurUserId,
    changeUserInfo,
    bid
};
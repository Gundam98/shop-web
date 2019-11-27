import axios from "axios";
import _ from "lodash";

axios.defaults.timeout = 5000; // 请求超时
axios.defaults.baseURL = "/api/"; // api 即上面 vue.config.js 中配置的地址

function getGoods(data) {
    return axios.get("/goods", {
        params: data
    });
}

function getGoodsInfo(id) {
    return axios.get(`/goods/${id}`);
}

function getCurUserId() {
    return axios.get("/user/session");
}

function getUserInfo(id) {
    return axios.get(`/user/${id}`);
}

function getUserBalance() {
    return axios.get("/account/balance");
}

function getCurrentUserInfo() {
    return axios.get("/user/information/me");
}

function getGoodsType() {
    if (arguments.length === 1) {
        let id = arguments[0];
        return axios.get(`/goodsTypes/${id}`);
    } else {
        return axios.get("/goodsTypes");
    }
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

function sellGoods(data) {
    return axios.post("/goods", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

function getMySold() {
    return axios.get("/goods/my");
}

function register(data) {
    return axios.post("/user", data);
}

function bid(id, price) {
    return axios.get(`/trade/bid/${id}`, {
        params: {
            price: price
        }
    });
}

function onlineGoods(id) {
    return axios.get(`/goods/continue/${id}`);
}

function offlineGoods(id) {
    return axios.get(`/goods/discontinue/${id}`);
}

function removeGoods(id) {
    return axios.delete(`/goods/${id}`);
}

function acceptPrice(id) {
    return axios.get(`/trade/accept/${id}`);
}

function refusePrice(id) {
    return axios.get(`/trade/refused/${id}`);
}

function chargeMoney(money) {
    return axios.post(`/account/deposit/${money}`);
}

export default {
    getGoods,
    logout,
    login,
    getUserInfo,
    getGoodsType,
    getGoodsInfo,
    getCurUserId,
    register,
    changeUserInfo,
    bid,
    sellGoods,
    getMySold,
    onlineGoods,
    offlineGoods,
    removeGoods,
    acceptPrice,
    refusePrice,
    getUserBalance,
    chargeMoney
};
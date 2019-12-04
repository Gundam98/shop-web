import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import ECharts from "vue-echarts";
import "echarts/lib/chart/map";
import Video from "video.js";
import "video.js/dist/video-js.css";

Vue.config.productionTip = false;

Vue.component("chart", ECharts);
Vue.prototype.$video = Video;

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import ECharts from "vue-echarts";
import "echarts/lib/chart/map";

Vue.config.productionTip = false;

Vue.component("chart", ECharts);

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
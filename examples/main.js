/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-04-08 08:48:09
 * @LastEditors: lax
 * @LastEditTime: 2020-09-15 15:50:39
 */
import "video.js/dist/video-js.css";
import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import tao from "./../packages/index";
Vue.use(tao);

Vue.config.productionTip = false;

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");

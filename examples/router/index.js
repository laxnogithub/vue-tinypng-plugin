/*
 * @Description: router rules
 * @Version: 2.0.0
 * @Autor: lax
 * @Date: 2020-04-07 14:34:37
 * @LastEditors: lax
 * @LastEditTime: 2020-09-15 16:11:54
 */
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

/**
 * routes collection
 */
const routes = [];

/**
 * load components from view folder
 *
 */
const views = require.context("./../views/", true, /\.vue$/);

loadComponents();

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;

/**
 * @name getName
 * @description get name from views.key
 * @param {*} str
 * @param {*} is
 */
function getName(str, is = true) {
	let name = str.slice(str.indexOf("/") + 1, str.indexOf(".vue"));
	if (is) name = name.toLowerCase();
	return name;
}

/**
 * @function loadComponents
 * @description load components and add route
 */
function loadComponents() {
	views.keys().forEach(view => {
		const comName = getName(view);
		const viewobj = views(view).default;
		routes.push({
			path: "/" + comName,
			name: viewobj.name,
			component: viewobj
		});
	});
}

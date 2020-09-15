<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-04-07 20:45:54
 * @LastEditors: lax
 * @LastEditTime: 2020-09-15 16:12:05
 -->
<template>
	<div id="app">
		<router-link id="sys" to="/page">Go</router-link>
		<router-view />
	</div>
</template>

<style lang="scss">
@import "@ex/css/pmdInit";
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	width: 100%;
	height: 100%;
}

#sys {
	position: absolute;
}
</style>

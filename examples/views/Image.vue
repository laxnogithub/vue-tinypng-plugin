<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-04-07 14:34:37
 * @LastEditors: lax
 * @LastEditTime: 2020-09-15 16:31:45
 -->
<template>
	<img src="@ex/assets/img/bg.png" />
</template>

<script>
export default {
	name: "vPage",
	data: function() {
		return {
			show: true,
			css: {
				"background-repeat": "repeat"
			}
		};
	},
	methods: {
		click: function() {
			this.show = false;
		}
	},
	mounted: function() {}
};
</script>

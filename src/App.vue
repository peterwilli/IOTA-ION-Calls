<template>
<div id="app">
  <router-view :key="$route.fullPath"></router-view>
</div>
</template>

<script>
export default {
  name: 'app',
  components: {}
}
</script>

<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.btn {
  cursor pointer
	font-family: Arial, Helvetica, sans-serif;
	font-size: 13px;
	color: #999999;
	padding: 10px 20px;
	background: -moz-linear-gradient(
		top,
		#ffffff 0%,
		#efefef);
	background: -webkit-gradient(
		linear, left top, left bottom,
		from(#ffffff),
		to(#efefef));
	-moz-border-radius: 0px;
	-webkit-border-radius: 0px;
	border-radius: 0px;
	border: 1px solid #cccccc;
	-moz-box-shadow:
		0px 0px 0px rgba(000,000,000,0),
		inset 0px 0px 0px rgba(255,255,255,0);
	-webkit-box-shadow:
		0px 0px 0px rgba(000,000,000,0),
		inset 0px 0px 0px rgba(255,255,255,0);
	box-shadow:
		0px 0px 0px rgba(000,000,000,0),
		inset 0px 0px 0px rgba(255,255,255,0);
	text-shadow:
		0px 0px 1px rgba(255,255,255,0.1),
		0px 0px 0px rgba(255,255,255,0);
}
</style>

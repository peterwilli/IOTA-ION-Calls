<template lang="html">
	<div class="button">
		<slot></slot>
	</div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
.button {
	border-radius 25px
	border 1px solid rgba(104, 220, 255, 0.56)
	background rgba(0, 0, 0, 0.1)
	float left
	padding 5px
	cursor pointer
}
</style>

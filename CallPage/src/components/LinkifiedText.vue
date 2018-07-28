<template lang="html">
  <span ref="linkifiedDiv" class="linkified">
    {{ text }}
  </span>
</template>

<script>
import linkifyElement from 'linkifyjs/element';

export default {
  props: ['text'],
  mounted() {
    this.updateText()
  },
  methods: {
    updateText() {
      linkifyElement(this.$refs.linkifiedDiv, {

      }, document);
    }
  },
  watch: {
    text() {
      this.updateText()
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>

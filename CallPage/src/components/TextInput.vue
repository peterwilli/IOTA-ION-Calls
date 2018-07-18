<template lang="html">
  <div class="ion-input">
    <div class="wrapper">
      <input ref="inputField" v-on:keyup.enter="onEnter" @input="updateInput" :placeholder="placeholder" :value="value" type="text" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['placeholder', 'value', 'onEnter'],
  methods: {
    updateInput(e) {
      this.$emit('input', e.currentTarget.value)
    }
  }
}
</script>

<style lang="stylus" scoped>
.ion-input {
  border-radius 25px
  border 1px solid rgba(104, 220, 255, 0.56)
  background rgba(0, 0, 0, 0.1)
  padding-top 25px
  padding-bottom 25px
  position relative
  transition box-shadow 0.5s, border 0.5s

  .wrapper {
    left 15px
    right 15px
    top 0
    bottom 0
    position absolute
  }

  &:focus-within {
    border 2px solid rgba(104, 220, 255, 0.8)
    box-shadow 0px 0px 100px 0px rgba(0, 0, 0, 0.3)
  }

  input {
    &::placeholder {
      color: #fff
      opacity 0.5
    }
    background rgba(0, 0, 0, 0)
    border none
    color #fff
    position absolute
    width 100%
    height 100%
    left 0
    top 0
    font-size 15px
  }
}
</style>

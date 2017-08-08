<template>
  <div id="app">
    <m-header></m-header>
    Hello World
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
export default {
  name: 'app',
  components: {
    MHeader
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "~common/stylus/variable.stylus"

#app
  color: $color-theme
</style>




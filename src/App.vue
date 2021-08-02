<template>
  <div id="app">
    <transition name="fade-transform" mode="out-in"> <router-view /> </transition>
  </div>
</template>
<script>
export default {
  mounted() {},
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}
</style>

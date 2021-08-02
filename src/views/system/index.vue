<template>
  <div>
    <div class="contents">
      <div class="tabulation" >0</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    
     
    };
  },
  methods: {
  
  },
  mounted() {
    // 显示第一页
    console.log(this.$route.query);
  },
  watch: {
    // 监听
    $route(to, from) {
      console.log(to.query.num);
      this.index = to.query.num;
    },
  },
};
</script>

<style lang="scss" scoped>
.contents {
   overflow: hidden;
  max-height: 100vh;
  // 内容
  .tabulation {
    background-color: pink;
  }
}
</style>
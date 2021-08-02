<template>
  <ul>
    <router-link
      tag="li"
      :class="index == indexstyle ? 'active' : ''"
      :to="{ path: item.path }"
      class="contentitem"
      v-for="(item, index) in content"
      :key="index"
      @click.native="indexstyle = index"
    >
      <i class="nav_icon"></i>
      <div class="nav_item">{{ item.label }}</div>
      <contentitem v-if="false"></contentitem>
    </router-link>
  </ul>
</template>

<script>
export default {
  // 递归
  name: "contentitem",
  props: ["content"],
  data() {
    return {
      indexstyle: "-1",
    };
  },
  mounted() {
    this.indexstyle = 0
  },
  methods: {
    // handleclick(item, index) {
    //   this.indexstyle = index;
    //   //this.$emit('childByValue',item)
    //   // console.log(item);
    // },
  },
};
</script>

<style lang="scss" scoped>
.contentitem {
  height: 39px;
  line-height: 39px;
}
li {
  padding-left: 45px;
}
li:hover,
.active {
  // border-left: 5px solid#20a4f7;
  background-color: #26526c;
}

.nav_text {
  height: 31px;
  line-height: 31px;
  // background: #1b2226;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #3d8dbc;
  padding-left: 19px;
}
.nav_icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  border: 1px solid #f8f5f9;
  vertical-align: middle;
}
.nav_item {
  color: #f8f5f9;
  vertical-align: middle;
  display: inline-block;
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  margin-left: 9px;
}
</style>

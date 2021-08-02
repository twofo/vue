<template>
  <div class="tabs clearfix">
    <div class="tags-scroll-content">
      <!-- <i class="el-icon-arrow-left fl" @click="tagsleft"></i> -->
      <!--closable这里说明home是不能关闭的-->
      <div class="tag">
        <el-tag
          :key="tag.name"
          size="small"
          v-for="(tag, index) in tags"
          :closable="tag.name !== 'index'"
          :disable-transitions="false"
          @close="handleClose(tag, index)"
          @click="changeMenu(tag)"
          :effect="$route.name === tag.name ? 'dark' : 'plain'"
        >
          <em></em>
          <span class="text">{{ tag.label }}</span>
        </el-tag>
      </div>
      <el-tooltip class="item" effect="dark" content="关闭所有标签" placement="bottom">
        <i class="el-icon-close close" @click="AllClosemethods"></i>
      </el-tooltip>
      <!-- <i class="el-icon-arrow-right fr" @click="tagsright"></i> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
  data() {
    return {
      tag: null,
      index: null,
    };
  },
  methods: {
    ...mapMutations({
      close: "closeTab",
      AllClose: "AllClose",
    }),
    //关闭标签
    handleClose(tag, index) {
      let length = this.tags.length - 1;
      this.tag = tag;
      this.index = index;
      //vuex调方法的另一种写法
      this.close(tag);
      // 如果关闭的标签不是当前路由的话，就不跳转
      if (tag.name !== this.$route.name) {
        return;
      }
      // 关闭的标签是最右边的话，往左边跳转一个
      if (index === length) {
        this.$router.push({ name: this.tags[index - 1].name });
      } else {
        // 否则往右边跳转
        this.$router.push({ name: this.tags[index].name });
      }
    },
    AllClosemethods() {
      this.AllClose();
      this.$router.push("/");
    },
    //选择标签跳转路由
    changeMenu(item) {
      this.$router.push({ name: item.name });
      this.$store.commit("selectMenu", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.tags-scroll-content {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 43px;
  z-index: 0;
  overflow: hidden;
  // padding: 0 66px 0 21px;
}
.tabs {
  padding-left: 250px;
  user-select: none;
  z-index: 20;
  width: 100%;
  position: fixed;
  height: 43px;
  top: 40px;
  height: 42px;
  background: white;
  box-shadow: 0px 1px 8px 0px rgba(70, 70, 70, 0.32);
  .tag {
    display: inline-block;
    height: 43px;
    position: absolute;
    padding-right: 40px;
    // padding-left: 21px;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }
  .tags-scroll-content > i {
    height: 40px;
    line-height: 40px;
    background: white;
    cursor: pointer;
    z-index: 1;
    font-size: 16px;
  }
  .el-icon-arrow-left {
    position: absolute;
    left: 0;
    width: 21px;
    box-shadow: 0px 1px 8px 0px rgba(70, 70, 70, 0.32);
  }
  .el-icon-arrow-right {
    position: absolute;
    right: 40px;
    width: 21px;
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
    color: black;
    background: white;
    height: 40px;
    padding-left: 15px;
    line-height: 40px;
    width: 40px;
    border-left: 1px solid #f1f1f1 !important;
    font-size: 16px;
    cursor: pointer;
  }
  /deep/ .el-tag--dark {
    background: white;
    em {
      display: inline-block;
      vertical-align: middle;
      height: 5px;
      margin-right: 7px;
      width: 5px;
      border-radius: 50%;
      background-color: #85ef47 !important;
      box-shadow: 0 0 7px #b7eb8f;
    }
  }
  /deep/ .el-tag--dark {
    color: black !important;
    .el-icon-close {
      color: black !important;
    }
  }
  /deep/ .el-tag {
    &:hover {
      .text {
        color: black;
      }
      .el-icon-close {
        font-size: 16px;
        &:hover {
          color: red !important;
          background: white !important;
        }
        display: inline-block;
      }
    }
    width: 140px;
    em {
      display: inline-block;
      vertical-align: middle;
      height: 5px;
      margin-right: 7px;
      width: 5px;
      border-radius: 50%;
      background-color: white;
    }
    cursor: pointer;
    border-right: 1px solid #f1f1f1 !important;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    padding: 0;
    color: #777777;
    font-size: 13px;
    border-radius: 0;
    border: 0;
    > span {
      display: inline-block;
      vertical-align: middle;
    }
    i {
      display: inline-block;
      vertical-align: middle;
      top: 0px;
    }
    .el-tag__close {
      right: 0px;
      color: #777777;
      &:hover {
        color: white;
      }
    }
  }
}
</style>

<template>
  <div>
    <div class="header">
      <header class="clearfix">
        <el-dropdown trigger="click" class="header-username fr">
          <span class="el-dropdown-link">
            <span>{{ username }}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a" @click.native="returnlogin"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <img
          @click="bigimgshoworhide = true"
          class="fr"
          :src="image || require('../assets/images/header/username.png')"
          alt
        />
      </header>
      <common-tab></common-tab>
    </div>
    <div class="bigimg" v-if="bigimgshoworhide" @click="bigimgshoworhide = false">
      <img :src="image || require('../assets/images/header/username.png')" alt />
    </div>
    <div class="left_nav" :style="{ width: left_navwidth + 'rem' }">
      <div class="title">
        <img src="../assets/images/logo.png" alt />
        <span>水电管理平台</span>
      </div>
      <navitem></navitem>
    </div>
    <div class="content_main" :style="{ marginLeft: left_navwidth + 'rem' }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view
            v-if="$route.meta.alive"
            :exclude="['navitem', 'CommonTab']"
          ></router-view>
        </keep-alive>
      </transition>
      <transition name="fade-transform" mode="out-in">
        <router-view v-if="!$route.meta.alive"></router-view>
      </transition>
    </div>
    <footer>©️ Copyright Reservered 广州科韵智慧有限公司版权所有</footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import CommonTab from "../components/CommonTab";
import navitem from "../components/Aside";
export default {
  components: {
    navitem,
    CommonTab,
  },
  data() {
    return {
      image: null,
      bigimgshoworhide: false,
      username: "", //用户名
      showorhide_data: true,
      left_navwidth: 1.3,
    };
  },
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
  methods: {
    ...mapMutations({
      AllClose: "AllClose",
    }),
    returnlogin() {
      this.$axios.get("/logout").then((res) => {
        if (res.data.code == 200) {
          this.AllClose();
          localStorage.removeItem("token");
          localStorage.removeItem("Authorization");
          this.$router.push("/login");
        } else {
          this.$message.error("登出失败，请稍后重试！");
          this.loginreturn = false;
        }
      });
    },
  },
  created() {
    this.username = localStorage.getItem("username");
    this.$axios
      .get("/bus/person/getTeacherDetails?id=" + localStorage.getItem("userid"))
      .then((res) => {
        this.image = res.data.rows.image;
      });
  },
  mounted() {},
  watch: {},
};
</script>

<style lang="scss" scoped>
footer {
  overflow: hidden;
  background-color: #eff2f5;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  font-size: 12px;
  font-family: AppleColorEmoji;
  text-align: center;
  color: #383838;
  letter-spacing: 2px;
}
.bigimg {
  img {
    position: relative;
    left: 45%;
    top: 35%;
    width: 200px;
    height: 200px;
  }
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2100;
}
.left_nav {
  background-color: #051527;
  height: 100vh;
  user-select: none;
  position: fixed;
  top: 0;
  z-index: 999;
  left: 0;
  .title {
    img {
      width: 30px;
      margin-right: 10px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
    color: #fff;
    font-size: 20px;
    text-align: center;
    padding: 20px 0;
  }
}
.content_main {
  background-color: #eff2f5;
  overflow-y: auto !important;
  min-height: 830px;
  padding: 0;
  > div:last-child,
  > main {
    margin-top: 20px;
  }
}
.header_box {
  height: 40px;
}
.header {
  height: 80px;
}
header {
  position: fixed;
  user-select: none;
  img {
    width: 30px;
    height: 30px;
    margin-top: 5px;
    border-radius: 50%;
  }
  top: 0;
  left: 0;
  right: 0;
  min-width: calc(100vw - 60px);
  background: white;
  border-bottom: 1px solid #f1f1f1 !important;
  color: white;
  height: 40px;
  line-height: 40px;
  padding: 0 15px 0 19px;
  z-index: 998;
  .header-title {
    line-height: 40px;
    img {
      width: 14px;
      margin-left: 33px;
      cursor: pointer;
      display: none;
    }
    span {
      font-size: 20px;
      display: inline-block;
      vertical-align: middle;
      font-family: SourceHanSansCN, SourceHanSansCN-Bold;
      font-weight: 700;
      text-align: center;
      color: black;
      letter-spacing: 2px;
    }
  }
  .header-username {
    line-height: 40px;
    span {
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      margin-left: 5px;
      font-size: 16px;
      font-family: SourceHanSansCN, SourceHanSansCN-Normal;
      font-weight: Normal;
      color: black;
      letter-spacing: 1px;
    }
  }
}
.contents-headerbox {
  height: 70px;
}
.contents-header {
  height: 60px;
  position: fixed;
  z-index: 999;
  background: $bg-color;
  box-shadow: 0px 1px 8px 0px rgba(70, 70, 70, 0.32);
  width: 100%;
  padding-top: 3px;
  padding-left: 20px;
  line-height: 60px;
  .contents-header-item {
    padding: 0 10px;
    height: 37px;
    background: #ffffff;
    border-radius: 5px;
    margin: 0 20px 0 0;
    text-align: center;
    line-height: 37px;
    display: inline-block;
    cursor: pointer;
    .contents-header-item-icon-text {
      display: inline-block;
      font-size: 13px;
      font-family: $font-scre;
      vertical-align: middle;
      font-weight: 400;
      color: #777777;
    }
    ::v-deep .el-icon-close {
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
      padding-left: 5px;
    }
  }
}
</style>

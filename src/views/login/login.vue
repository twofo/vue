<template>
  <div class="content">
    <main class="clearfix">
      <div class="fl">
        <div class="logo">
          <img src="../../assets/logo.png" alt />
          <span>水电管理平台</span>
        </div>
        <div class="img">
          <img src="../../assets/images/login/loginbg.svg" alt="" />
        </div>
      </div>
      <div class="fr">
        <h3>登录</h3>
        <ul class="enter">
          <li>
            <img src="../../assets/images/login/username.png" alt />
            <input type="text" v-model="username" placeholder="请输入登录账号" />
          </li>
          <li>
            <img src="../../assets/images/login/password.png" alt />
            <input type="password" v-model="password" placeholder="请输入登录密码" />
          </li>
        </ul>
        <div class="submit clearfix">
          <input
            v-preventReClick="2000"
            type="button"
            class="fl"
            value="登录"
            @click="
              login();
              AllClosemethods();
            "
            @keyup.enter="login()"
          />
        </div>
      </div>
    </main>
    <footer>©️ Copyright Reservered 广州科韵智慧有限公司版权所有</footer>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import domMessage from "../../utils/messageOnce";
const messageOnce = new domMessage();
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    ...mapMutations({
      AllClose: "AllClose",
    }),
    AllClosemethods() {
      this.AllClose();
      this.$router.push("/");
    },
    login() {
      if (this.username == "" || this.password == "") {
        this.$message({
          message: "请输入账号或密码",
          type: "warning",
        });
      } else {
        this.$axios
          .post("/login", "", {
            params: {
              username: this.username,
              password: this.password,
            },
          })
          .then((res) => {
            if (res.data.code === 200) {
              document.onkeydown = undefined;
              this.username = null;
              this.password = null;
              localStorage.setItem("token", res.data.rows.token);
              localStorage.setItem("Authorization", res.data.rows.Authorization);
              localStorage.setItem("username", res.data.rows.username);
              localStorage.setItem("userid", res.data.rows.userId);
              this.$router.push("/");
            } else if (res.data.code === 1003) {
              //用户名为空
              messageOnce.warning({
                message: res.data.msg,
                type: "warning",
              });
            } else if (res.data.code === 1004) {
              //密码为空
              messageOnce.warning({
                message: res.data.msg,
                type: "warning",
              });
            } else if (res.data.code === 1005) {
              //用户名不存在
              messageOnce.warning({
                message: res.data.msg,
                type: "warning",
              });
            } else if (res.data.code === 1006) {
              //密码错误
              messageOnce.warning({
                message: res.data.msg,
                type: "warning",
              });
            } else if (res.data.code === 1007) {
              //验证失败，用户被禁
              messageOnce.warning({
                message: res.data.msg,
                type: "warning",
              });
            } else if (res.data.code === 1008) {
              //验证失败，登录服务暂不可用
              messageOnce.warning({
                message: res.data.msg,
                type: "warning",
              });
            } else if (res.data.code == 500) {
              messageOnce.warning({
                message: res.data.msg,
                type: "warning",
              });
            }
          });
      }
    },
    close() {
      this.username = "";
      this.password = "";
    },
  },
  created() {
    let that = this;
    document.onkeydown = function (e) {
      if (window.event == undefined) {
        var key = e.keyCode;
      } else {
        var key = window.event.keyCode;
      }
      if (key == 13) {
        that.login();
      }
    };
  },
};
</script>

<style lang="scss" scoped>
main {
  > .fr {
    width: 50%;
    padding: 7px 0 0 79px;
    h3 {
      font-size: 26px;
      font-family: $font-scre;
      font-weight: 400;
      color: #4a4a4a;
      letter-spacing: 3px;
      padding-top: 7px;
    }
    .enter {
      padding-top: 110px;
      li {
        border-bottom: 1px solid #dbdbdd;
        padding-bottom: 10px;
        &:last-child {
          margin-top: 52px;
        }
        input {
          vertical-align: middle;
          display: inline-block;
          font-size: 16px;
          font-family: SourceHanSansCN, SourceHanSansCN-Normal;
          font-weight: Normal;
          letter-spacing: 2px;
        }
        img {
          width: 20px;
          margin-right: 23px;
        }
      }
    }
    .submit {
      margin-top: 52px;
      input {
        font-size: 16px;
        font-family: SourceHanSansCN, SourceHanSansCN-Bold;
        color: #ffffff;
        line-height: 33px;
        letter-spacing: 6px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        background: #3699ea;
        text-align: center;
        border-radius: 4px;
        box-shadow: 0px 0px 12px 0px rgba(208, 220, 227, 0.5);
      }
    }
  }
  .fl {
    width: 50%;
    .img {
      position: relative;
      img {
        position: absolute;
        width: 440px;
        top: 60px;
      }
    }
    height: 100%;
    .logo {
      img {
        width: 40px;
        height: 40px;
      }
      span {
        padding-left: 18px;
        vertical-align: middle;
        display: inline-block;
        font-size: 26px;
        font-family: $font-scre;
        font-weight: 400;
        color: #4a4a4a;
        letter-spacing: 3px;
      }
    }
    border-right: 1px solid #c3d1ed;
  }
  padding: 48px 73px;
  width: 1090px;
  height: 580px;
  background: #ffffff;
  box-shadow: 0px 2px 16px 15px rgba(229, 229, 229, 0.3);
  margin: 0 auto;
}
.content {
  background-image: url("../../assets/images/login/backgroundimage.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  min-height: 100vh;
  padding-top: 180px;
}
footer {
  cursor: pointer;
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  font-size: 14px;
  font-family: AppleColorEmoji;
  text-align: center;
  color: #b7b7b7;
  letter-spacing: 2px;
}
</style>

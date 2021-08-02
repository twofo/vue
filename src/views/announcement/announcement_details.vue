<template>
  <div class="middle_content">
    <header>
      <router-link to="/announcement" tag="div"
        ><i class="el-icon-arrow-left"></i><span>返回</span></router-link
      >
    </header>
    <div class="text_content">
      <h3>{{ MessageInfo.title }}</h3>
      <div class="issuer">
        <div class="issuer-left">
          <span>发布人 :</span>
          <span> {{ MessageInfo.creator || "-" }}</span>
        </div>
        <div class="issuer-right">
          <span>发布时间 :</span>
          <span>{{ MessageInfo.createTime }}</span>
        </div>
      </div>
      <fieldset class="content">
        <legend>公告内容</legend>
        <vue-editor v-model="MessageInfo.contentStr" />
        <div class="content-accessory">
          <div class="accessory-text"><i class="el-icon-folder"></i>附件:</div>
          <ul class="img">
            <li @click="download(index)" v-for="(item, index) in Urldata" :key="index">
              {{ item[0] }}
            </li>
          </ul>
        </div>
        <div class="jsr">
          <i class="el-icon-user"></i>接收区域<span @click="jsrdialog = true"
            >查看详情</span
          >
        </div>
      </fieldset>
    </div>
    <el-dialog title="系统提示" :visible.sync="jsrdialog" center>
      <div class="clearfix">
        <label class="fl">接收区域:</label>
        <el-tree
          v-if="tree !== undefined && tree.length > 0"
          :props="defaultProps"
          :default-expand-all="false"
          accordion
          :data="tree"
        >
        </el-tree>
        <div class="fl" v-else>
          <span v-for="(data, index) in MessageInfo.dimensionNames" :key="index">{{
            data.name
          }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="jsrdialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "announcement_details",
  data() {
    return {
      defaultProps: {
        //树状图匹配数据
        children: "childern",
        label: "name",
      },
      jsrdialog: false,
      ReceiverInput: null, //接收人input
      ID: null, //查看详情传来的ID
      MessageInfo: {}, //公告详情
      Urldata: null,
      tree: [],
    };
  },
  methods: {
    download(index) {
      window.open(this.Urldata[index][1], "_blank");
    },
    // 查询公告详情
    MessageSearch() {
      this.$axios.get("/msg/message/info?id=" + this.ID).then((res) => {
        this.MessageInfo = res.data.rows;
        let array = [];
        let tree = res.data.rows.dimensionNames;
        if (tree) {
          let onelevel = tree.filter((item) => {
            return item.layer == 1;
          });
          let twolevel = tree.filter((item) => {
            return item.layer == 2;
          });
          let threelevel = tree.filter((item) => {
            return item.layer == 3;
          });
          twolevel.forEach((item) => {
            item.childern = threelevel.filter((three) => {
              return three.parentId == item.id;
            });
          });
          onelevel.forEach((item) => {
            item.childern = twolevel.filter((two) => {
              return two.parentId == item.id;
            });
          });
          this.tree = onelevel;
        }
        if (this.MessageInfo.appendixUrls) {
          this.MessageInfo.appendixUrls.forEach((item) => {
            array.push(item.split(" "));
          });
        }
        this.Urldata = array;
      });
    },
  },
  created() {
    this.ID = this.$route.query.id; //接收ID
  },
  mounted() {
    this.MessageSearch();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .quillWrapper {
  .ql-toolbar {
    display: none;
  }
  .ql-snow {
    border: 0;
  }
}
::v-deep .el-dialog {
  background: #ffffff;
  border-radius: 10px;
  width: 516px;
  .el-dialog__header {
    height: 54px;
    background: #2d92ff;
    border-radius: 10px 10px 0 0;
    i {
      color: white;
    }
    .el-dialog__title {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 1px;
    }
  }
  .el-dialog__body {
    .fl {
      span {
        margin-top: 1px;
        font-size: 16px;
        display: inline-block;
      }
    }
    label {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      vertical-align: middle;
      color: #6f6f6f;
      letter-spacing: 1px;
    }
    .el-tree {
      float: left;
      height: 230px;
    }
  }
}
img {
  width: 90%;
}
.str {
  p {
    img {
      width: 90%;
    }
  }
}
.text_content {
  margin-top: 10px;
  border-radius: 8px;
  background-color: white;
  padding: 24px 25px;

  h3 {
    font-size: 24px;
    font-family: $font-scme;
    font-weight: 400;
    color: #212d33;
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 16px;
  }
  .issuer {
    height: 60px;
    border: 1px solid #dbdbdb;
    border-left: #2c9dff 8px solid;
    border-radius: 1px;
    margin-top: 20px;
    .issuer-left,
    .issuer-right {
      height: 100%;
      line-height: 60px;
      float: left;
      margin-left: 20px;
      font-size: 18px;
    }
    .issuer-right {
      margin-left: 70px;
    }
  }
  .content {
    border: 1px solid #dbdbdb;
    margin-top: 40px;
    padding: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    legend {
      margin-left: 0px;
      padding: 0 5px;
      font-size: 18px;
      font-weight: 600;
    }
    p {
      margin-top: 30px;
      font-size: 18px;
      text-indent: 2em;
      line-height: 25px;
      letter-spacing: 2px;
      font-family: $font-scre;
      font-weight: 400;
    }
    .jsr {
      span {
        color: #2c9dff;
        display: inline-block;
        margin-left: 12px;
        cursor: pointer;
        &:hover {
          color: #59b3fd;
        }
      }
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #212d33;
      line-height: 22px;
      letter-spacing: 1px;
      i {
        font-size: 18px;
      }
    }
    .content-accessory {
      margin: 20px 0;
      font-size: 16px;
      font-family: $font-scre;
      font-weight: 400;
      .accessory-text {
        display: inline-block;
        width: 80px;
        i {
          display: inline-block;
          margin-right: 5px;
        }
        font-size: 16px;
      }
      .img {
        vertical-align: top;
        display: inline-block;
        li {
          &:hover {
            color: #2c9dff;
          }
          margin-bottom: 8px;
          cursor: pointer;
          font-size: 16px;
        }
      }
    }
    .recipient {
      height: 40px;
      margin-top: 100px;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
    }
  }
}
.pop-up {
  width: 516px;
  height: 480px;
  background-color: white;
  position: fixed;
  top: 250px;
  left: 800px;
  border-radius: 5px;
  .pop-up-header {
    height: 54px;
    line-height: 54px;
    color: white;
    text-align: center;
    position: relative;
    background-color: #2d92ff;
    border-radius: 5px 5px 0 0;
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    .pop-up-ico {
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
    }
  }
  .pop-up-content {
    padding: 20px;
    .accept {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
    }
    .content-input {
      .el-input {
        width: 354px;
        height: 43px;
        margin-left: 116px;
      }
    }
    .accept-name {
      ul {
        width: 354px;
        height: 234px;
        margin-left: 116px;
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        overflow-y: auto;
        li {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .affirm {
      width: 92px;
      height: 42px;
      color: white;
      text-align: center;
      line-height: 42px;
      margin: 30px auto;
      background-color: #2d92ff;
      border-radius: 5px;
    }
  }
}
header {
  background-color: white;
  border-radius: 8px;
  padding: 0 0 0 28px;
  div {
    cursor: pointer;
    line-height: 50px;
    height: 50px;
    font-size: 16px;
    i {
      display: inline-block;
      vertical-align: middle;
      margin-top: 1px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.middle_content {
  padding: 10px 19px 20px 19px;
}
</style>

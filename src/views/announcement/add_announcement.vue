<template>
  <div class="middle_content">
    <div class="fromsubmit">
      <ul class="header_return">
        <router-link tag="li" to="/announcement" class="pointer">
          <i class="el-icon-arrow-left"></i>返回
        </router-link>
        <li>发公告</li>
      </ul>
      <div class="inputenter">
        <div class="title input">
          <label>
            标题
            <span>*</span>:
          </label>
          <input type="text" placeholder="请输入标题" v-model="title" />
        </div>
        <div class="input richtext">
          <label>
            正文
            <span>*</span>:
          </label>
          <vue-editor v-model="richtext" />
        </div>
        <div class="input annex">
          <label>附件:</label>
          <el-upload
            class="upload"
            ref="upload"
            action="#"
            :file-list="fileList"
            :auto-upload="false"
            :multiple="true"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <el-button slot="trigger" v-preventReClick="2000" size="small" type="primary"
              >选取文件</el-button
            >
            <el-button
              style="margin-left: 10px"
              size="small"
              type="success"
              @click="submitUpload"
              v-preventReClick="2000"
              >上传到服务器</el-button
            >
          </el-upload>
        </div>
        <div class="input receiver">
          <label>接收人:</label>
          <div class="treecheck">
            <div class="search">
              <el-select
                v-model="jsrvalue"
                @change="jsrselectchange"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in jsroption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <el-tree
              v-if="jsrvalue != 4"
              :props="defaultProps"
              show-checkbox
              :default-expand-all="false"
              @check-change="handleCheckChange"
              accordion
              :data="info"
            >
            </el-tree>
          </div>
        </div>
        <div class="submitorcancel butonnhover">
          <button @click="submit" v-preventReClick="5000">提交</button>
          <router-link to="/announcement" tag="button">取消</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "../../utils/utils";
export default {
  name: "add_announcement",
  data() {
    return {
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      ids: [],
      jsroption: [
        {
          value: "1",
          label: "部门",
        },
        {
          value: "2",
          label: "区域",
        },
        {
          value: "3",
          label: "院系",
        },
        {
          value: "4",
          label: "全部",
        },
      ],
      parentId: "test",
      treetitle: ["可选择数据", "选中数据"],
      jsrvalue: null,
      info: null,
      fileList: [],
      title: "", //输入框  标题
      author: "", //输入框 作者
      richtext: "", //富文本
      mode: "transfer", // transfer addressList
      urldata: [],
    };
  },
  created() {},
  methods: {
    handleCheckChange(node, check, number) {
      if (check == true) {
        if (number == false) {
          this.ids.push(node.id);
          if (node.children) {
            node.children.forEach((item) => {
              if (item.children) {
                item.children.forEach((two) => {
                  this.ids.push(two.id);
                });
              }
              this.ids.push(item.id);
            });
          }
        }
      } else if (check == false) {
        if (number == false) {
          if (node.children) {
            node.children.forEach((item) => {
              if (item.children) {
                item.children.forEach((three) => {
                  this.ids = this.ids.filter((threefl) => threefl != three.id);
                });
              }
              this.ids = this.ids.filter((fl) => fl != item.id);
            });
          }
          this.ids = this.ids.filter((item) => {
            return item != node.id;
          });
        }
      }
      this.ids = utils.ArrayRepeat(this.ids);
    },
    jsrselectchange() {
      this.info = [];
      this.ids = [];
      if (this.jsrvalue == 1) {
        this.Axiosbm();
      } else if (this.jsrvalue == 2) {
        this.Axiosqy();
      } else if (this.jsrvalue == 3) {
        this.Axiosbj();
      } else {
        this.info = null;
      }
    },
    submit() {
      let receiver = {};
      let Arrayids = [];
      if (this.richtext.indexOf("img") != -1 && this.richtext.indexOf("src=") != -1) {
        if (
          this.richtext.indexOf("https://") != -1 ||
          this.richtext.indexOf("http://") != -1
        ) {
          this.$message.warning("图片请从本地上传!");
          return;
        }
      }
      if (this.title == null || this.title == "") {
        return this.$message.warning("标题不能为空");
      }
      if (this.richtext == null || this.richtext == "") {
        return this.$message.warning("正文不能为空");
      }
      if (this.jsrvalue != "4") {
        if (this.jsrvalue != "1") {
          this.ids.forEach((item) => {
            Arrayids.push(parseInt(item.replace(/[^0-9]/gi, "")));
          });
        } else {
          this.ids.forEach((item) => {
            Arrayids.push(parseInt(item));
          });
        }
      }
      if (this.jsrvalue != null && this.jsrvalue != "") {
        this.$set(receiver, "idList", Arrayids);
        this.$set(receiver, "dimensionType", parseInt(this.jsrvalue));
      } else {
        this.$message({
          message: "还未选择接收人",
          type: "warning",
        });
      }
      this.$axios
        .post("/msg/message/push", {
          title: this.title,
          content: this.richtext,
          receiver: receiver,
          appendixUrls: this.urldata,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.$router.push("/announcement");
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning",
            });
            this.urldata = [];
          }
        });
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    //上传服务器
    submitUpload() {
      if (this.fileList.length === 0) {
        return this.$message.warning("请选取文件后再上传");
      }
      let trueorfalse = true;
      let formData = new FormData();
      this.fileList.forEach((item) => {
        if (item.size / 1024 / 1024 > 1) {
          this.$message({
            message: item.name + "超过大小限制!大小不能超过1M",
            type: "warning",
          });
          trueorfalse = false;
        } else {
          formData.append("excelFile", item.raw);
        }
      });
      if (trueorfalse == true) {
        this.$axios
          .post("/msg/message/uploadFile", formData)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "上传成功!",
                type: "success",
              });
              this.urldata = res.data.rows;
              this.fileList = [];
            } else {
              this.$message({
                message: "上传失败,请稍后再试!",
                type: "warning",
              });
            }
          })
          .catch((error) => {
            this.$message.warning(error.response.data.message);
          });
      }
    },
    // 移除数据
    del() {
      let that = this;
      let info = JSON.parse(that.new_info);
      info.forEach((item, index) => {
        if (item.select) {
          that.info = that.info.concat(item).sort((a, b) => {
            return a.id - b.id;
          });
          delete info[index];
          item.select = false;
        }
      });
      info = info.filter(function (val) {
        return val;
      });
      that.new_info = info;
    },
    Axiosbm() {
      this.$axios.get("/bus/common/org/select").then((res) => {
        let data = res.data;
        res.data.forEach((item) => {
          if (item.children) {
            item.children.forEach((two) => {
              two.test = two.parentId;
            });
          }
          item.test = item.parentId;
        });
        let Axiossj = data.filter((item) => {
          return item.parentId != -1;
        });
        this.info = Axiossj;
      });
    },
    Axiosqy() {
      this.$axios.get("/bus/common/building/select").then((res) => {
        let data = res.data;
        let onelevel = data.filter((item) => {
          return item.layer == 1;
        });
        let twolevel = data.filter((item) => {
          return item.layer == 2;
        });
        let threelevel = data.filter((item) => {
          return item.layer == 3;
        });
        twolevel.forEach((item) => {
          item.children = threelevel.filter((three) => {
            return three.parentId == item.id;
          });
        });
        onelevel.forEach((item) => {
          item.children = twolevel.filter((two) => {
            return two.parentId == item.id;
          });
        });
        this.info = onelevel;
      });
    },
    Axiosbj() {
      this.$axios.get("/bus/common/department/select").then((res) => {
        let data = res.data;
        let onelevel = data.filter((item) => {
          return item.layer == 1;
        });
        let twolevel = data.filter((item) => {
          return item.layer == 2;
        });
        let threelevel = data.filter((item) => {
          return item.layer == 3;
        });
        twolevel.forEach((item) => {
          item.children = threelevel.filter((three) => {
            return three.parentId == item.id;
          });
        });
        onelevel.forEach((item) => {
          item.children = twolevel.filter((two) => {
            return two.parentId == item.id;
          });
        });
        this.info = onelevel;
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.upload {
  display: inline-block;
  button {
    font-size: 14px;
  }
}
.submitorcancel {
  margin: 30px auto 0 -100px;
  text-align: center;
  button {
    width: 78px;
    height: 36px;
    border: 0;
    font-size: 14px;
    border-radius: 3px;
    border: 0px;
    &:first-child {
      margin-right: 25px;
      background: #2190ff;
      color: white;
    }
    &:last-child {
      background: white;
      border: 1px solid gray;
      &:hover {
        border: 1px solid #2d92ff;
        color: #2d92ff;
        background: white !important;
      }
    }
  }
}
.treecheck {
  display: inline-block;
  .search {
    margin-bottom: 10px;
    button {
      display: inline-block;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 1px;
      border: 0;
      width: 65px;
      height: 40px;
      margin-left: 10px;
      background: #2d92ff;
      border-radius: 5px;
    }
  }
  .el-tree {
    padding: 5px;
    width: 300px;
    border: 1px solid #dbdbdb;
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.fromsubmit {
  padding: 27px;
  .inputenter {
    .richtext {
      label {
        vertical-align: top;
      }
    }
    .annex {
      .file {
        display: inline-block;
        vertical-align: top;
        input {
          border: 0;
          height: 32px;
          background: #ffffff;
        }
      }
    }
    .input {
      margin-top: 33px;

      .quillWrapper {
        width: 748px;
        display: inline-block;
      }
      > label {
        display: inline-block;
        margin-right: 23px;
        width: 400px;
        text-align: right;
        vertical-align: top;
        font-size: 16px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        letter-spacing: 1px;
        span {
          color: #ff2020;
        }
      }
      > input {
        text-indent: 8px;
        letter-spacing: 2px;
        width: 416px;
        height: 44px;
        border: 1px solid #d9d9d9;
        border-radius: 5px;
      }
    }
    padding: 11px 0 30px 0;
  }
  .header_return {
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 19px;
    li {
      display: inline-block;
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      color: #212d33;
      cursor: pointer;
      i {
        display: inline-block;
        vertical-align: middle;
      }
      &:last-child {
        margin-left: 711px;
        font-size: 18px;
        color: #313c42;
        letter-spacing: 1px;
      }
    }
  }
  background: white;
  border-radius: 8px;
}
.middle_content {
  padding: 10px 19px 20px 19px;
}
</style>

<template>
  <div class="box">
    <div class="filtrate-heared">
      <div
        class="filtrate-title"
        :style="filtrateClick == false ? 'border-bottom: none;' : ''"
      >
        <div class="left">
          条件筛选
          <div class="right1 pointer" @click="filtratehandle">
            <div v-if="filtrateClick == true"><i class="el-icon-arrow-up"></i> 收起</div>
            <div v-if="filtrateClick == false">
              <i class="el-icon-arrow-down"></i> 展开
            </div>
          </div>
        </div>
      </div>
      <transition name="fade-transform" mode="out-in" v-if="filtrateClick == true">
        <div class="filtrate-content">
          <div class="clearfix">
            <div class="filtrate-content-left">
              <div class="text">处理状态</div>
              <div class="input">
                <el-select v-model="clztvalue" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="filtrate-content-right">
              <div class="text">问题描述</div>
              <div class="input">
                <el-input
                  clearable
                  v-model="input"
                  placeholder="请输入问题描述"
                ></el-input>
              </div>
            </div>
          </div>

          <div class="info butonnhover">
            <el-button
              type="primary"
              @click="
                currentpage = 1;
                tablepage_search();
              "
              >搜索</el-button
            >
            <el-button type="primary" @click="reset()">重置</el-button>
          </div>
        </div>
      </transition>
    </div>
    <div class="filtrate-table">
      <div class="filtrate-title">
        <div class="filtrate-title-text">意见反馈</div>
      </div>
      <div class="button">
        <button
          v-for="(item, index) in filtrate_table_button_value"
          :key="index"
          @click="filtrate_pop(index)"
        >
          {{ item }}
        </button>
      </div>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="TableData.records"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column label="问题描述" show-overflow-tooltip>
          <template slot-scope="item">
            <span
              class="fontblue"
              @click="
                DialogShoworHide(item.row);
                dealwith = 0;
              "
              >{{ item.row.question || "-" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="scope">{{ scope.row.telephone || "-" }}</template>
        </el-table-column>
        <el-table-column label="是否已处理">
          <template slot-scope="scope"
            ><span :class="scope.row.isResolved == 1 ? 'blue' : 'yellow'">{{
              scope.row.isResolved == 1 ? "已处理" : "未处理"
            }}</span></template
          ></el-table-column
        >
        <el-table-column label="角色">
          <template slot-scope="scope">
            {{
              scope.row.personType == 0
                ? "学生"
                : scope.row.personType == 1
                ? "老师"
                : scope.row.personType == 2
                ? "商户"
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">{{ scope.row.name || "-" }}</template>
        </el-table-column>
        <el-table-column label="学工号">
          <template slot-scope="scope">
            {{ scope.row.username || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime">
          <template slot="header">
            <span>创建时间</span>
            <span
              @click="sorttable('cjsj')"
              :class="cjsjnumber == 1 ? 'ascending' : cjsjnumber == 2 ? 'descending' : ''"
            >
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime">
          <template slot="header">
            <span>修改时间</span>
            <span
              @click="sorttable('gxsj')"
              :class="gxsjnumber == 1 ? 'ascending' : gxsjnumber == 2 ? 'descending' : ''"
            >
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              @click="
                DialogShoworHide(scope.row);
                dealwith = 0;
              "
              v-if="scope.row.isResolved != 1"
              >处理</span
            >
            <span
              @click="
                DialogShoworHide(scope.row);
                dealwith = 1;
              "
              v-else
              >详情</span
            >
            <span @click="DelData(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        class="Dialog"
        :title="dealwith == 1 ? '详情' : '处理'"
        :visible.sync="DialogShow"
        @close="ChuLiDialogClose"
      >
        <ul :class="dealwith == 1 ? 'ul' : ''">
          <li>
            <label>角色:</label>
            <p>
              {{
                DialogData.personType == 0
                  ? "学生"
                  : DialogData.personType == 1
                  ? "老师"
                  : DialogData.personType == 2
                  ? "商户"
                  : "-"
              }}
            </p>
          </li>
          <li>
            <label>姓名:</label>
            <p>{{ DialogData.name }}</p>
          </li>
          <li>
            <label>学号:</label>
            <p>{{ DialogData.username }}</p>
          </li>
          <li>
            <label>联系电话:</label>
            <p>
              {{ DialogData.telephone == "" ? "-" : DialogData.telephone }}
            </p>
          </li>
          <li>
            <label>问题描述:</label>
            <p>
              {{ DialogData.question }}
            </p>
          </li>
          <li v-if="ChuLiDialogImg !== undefined && ChuLiDialogImg.length > 0">
            <label>图片:</label>
            <p>
              <img
                @click="bigimg(index)"
                v-for="(item, index) in ChuLiDialogImg"
                :key="index"
                :src="item"
                alt
              />
            </p>
          </li>
        </ul>
        <div class="dealwith" v-if="dealwith == 0">
          <label><span>*</span>是否已处理:</label>
          <p>
            <el-select v-model="DialogSelectValue" clearable placeholder="请选择">
              <el-option
                v-for="item in Dialogselect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="dealwith == 1" @click="DialogShow = false">关闭</el-button>
          <el-button
            type="primary"
            v-if="dealwith == 0"
            @click="DialogCheckConfirm"
            v-preventReClick="2000"
            >确 定</el-button
          >
          <el-button v-if="dealwith == 0" @click="DialogShow = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog class="DeleteDialog" title="删除" :visible.sync="DelDialog">
        <p>确认删除吗？</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="DelDialogConfirm" v-preventReClick="2000"
            >确 定</el-button
          >
          <el-button @click="DelDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentpage"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TableData.total"
      >
      </el-pagination>
    </div>
    <div @click="closebigimg" class="bigimg" v-if="bigimgshoworhide">
      <div>
        <img :src="bigimgurl" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
export default {
  mixins: [sortmixin],
  data() {
    return {
      gxsjnumber: 0,
      cjsjnumber: 0,
      dealwith: null,
      bigimgurl: null,
      bigimgshoworhide: false,
      ChuLiDialogImg: [], //处理弹框img
      DelDialog: false, //删除dialog
      multipleSelection: [], //table 选中行数据
      DialogData: [],
      Dialogselect: [
        {
          value: "0",
          label: "未处理",
        },
        {
          value: "1",
          label: "已处理",
        },
      ],
      DialogSelectValue: "0", //dialog selectvalue
      DialogShow: false, //弹窗showorhide
      TableData: [],
      clztvalue: null,
      filtrateClick: true,
      options: [
        {
          value: "0",
          label: "未处理",
        },
        {
          value: "1",
          label: "已处理",
        },
      ],
      input: null,
      filtrate_table_button_value: ["删除", "刷新"],
      currentpage: 1,
      pagesizes: [10, 20, 30, 50],
      pagesize: 10,
      Del_id: [],
      DeleteSingle: 0,
      loading: false,
    };
  },
  created() {
    this.tablepage_search(); //table分页查询
  },
  activated() {
    this.tablepage_search();
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
      this.tablepage_search();
    },
    reset() {
      this.clztvalue = null;
      this.input = null;
      this.currentpage = 1;
      [this.gxsjnumber, this.cjsjnumber, this.sortnumber] = [0, 0, 0];
      this.tablepage_search();
    },
    closebigimg() {
      this.bigimgshoworhide = false;
    },
    bigimg(index) {
      this.bigimgurl = this.ChuLiDialogImg[index];
      this.bigimgshoworhide = true;
    },
    ChuLiDialogClose() {
      this.ChuLiDialogImg = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    DelDialogConfirm() {
      let ids = [];
      ids = this.Del_id;
      if (this.DeleteSingle == 1) {
        this.$axios.post("/bus/feedback/remove?ids", ids).then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.DeleteSingle = 0;
          this.clztvalue = "";
          this.input = null;
          this.DelDialog = false;
          this.tablepage_search();
        });
      } else if (this.DeleteSingle == 2) {
        this.$axios.post("/bus/feedback/remove?ids", ids).then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.DelDialog = false;
          this.DeleteSingle = 0;
          this.clztvalue = "";
          this.input = null;
          this.tablepage_search();
        });
      }
    },
    // 单个删除
    DelData(row) {
      this.Del_id.push(row.id);
      this.DeleteSingle = 1;
      this.DelDialog = true;
    },
    // dialog 单击确认修改
    DialogCheckConfirm() {
      if (this.DialogSelectValue == "") {
        this.$message({
          message: "选择不能为空",
          type: "warning",
        });
      } else {
        this.$axios
          .post("/bus/feedback/update", {
            id: this.DialogData.id,
            isResolved: this.DialogSelectValue,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("处理成功!");
            } else {
              this.$message.warning(res.data.msg);
            }
            this.clztvalue = null;
            this.input = null;
            this.DialogShow = false;
            this.tablepage_search();
          });
      }
    },
    DialogShoworHide(row) {
      let id = row.id;
      this.$axios.get("/bus/feedback/info/" + id).then((res) => {
        this.ChuLiDialogImg = res.data.rows.imgUrls;
        this.DialogData = res.data.rows;
        this.DialogSelectValue = res.data.rows.isResolved.toString();
      });
      // 单击详情 显示dialog
      this.DialogShow = true;
    },

    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name).then((res) => {
        this.TableData = res.data.rows;
        if (name == "cjsj") {
          this.cjsjnumber = this.sortnumber;
          this.gxsjnumber = 0;
        } else if (name == "gxsj") {
          this.gxsjnumber = this.sortnumber;
          this.cjsjnumber = 0;
        }
        this.loading = false;
      });
    },
    tablepage_search() {
      this.loading = true;
      this.AxiosParams = {
        current: this.currentpage,
        size: this.pagesize,
        isHandle: this.clztvalue,
        question: this.input,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/bus/feedback/list";
      this.$axios.post("/bus/feedback/list", this.AxiosParams).then((res) => {
        this.TableData = res.data.rows;
        this.loading = false;
      });
    },
    // 分页
    handleCurrentChange(val) {
      this.currentpage = val;
      this.tablepage_search();
    },
    filtratehandle() {
      this.filtrateClick = !this.filtrateClick;
    },
    // 自检 按钮
    filtrate_pop(index) {
      this.filtrate_show = true;
      if (index == 0) {
        //删除
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: "请先选择需要删除的",
            type: "warning",
          });
        } else {
          this.Del_id = [];
          this.multipleSelection.forEach((item) => {
            this.Del_id.push(item.id);
          });
          this.DeleteSingle = 2;

          this.DelDialog = true;
        }
      } else if (index == 1) {
        //刷新
        this.tablepage_search();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bigimg {
  div {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  position: fixed;
  top: 0;
  overflow-y: auto;
  left: 0;
  z-index: 2100;
  text-align: center;
  vertical-align: middle;
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}
::v-deep .el-table {
  .cell {
    font-size: 14px;
    text-align: center;
  }
  .el-checkbox__inner {
    border: 1px solid #dbdbdb;
  }

  tr {
    height: 45px;
  }
  .el-table__header-wrapper {
    tr {
      border-radius: 1px;
      th {
        font-size: 16px;
        background-color: #f2fbff;
        border-bottom: 0;
        color: #364147;
      }
    }
  }
  .el-table__body-wrapper {
    tr {
      td {
        &:last-child {
          span {
            &:first-child {
              padding-left: 0;
            }
            cursor: pointer;
            color: #2d92ff;
            padding-left: 10px;
          }
        }
        font-size: 16px;
        font-family: $font-scre;
        font-weight: 400;
        color: #364147;
      }
      span {
        display: inline-block;
      }
      .yellow {
        background: #f5a623;
        padding: 5px;
        color: white;
      }
      .blue {
        background: #2d92ff;
        padding: 5px;
        color: white;
      }
    }
  }
}
.DeleteDialog {
  ::v-deep .el-dialog {
    width: 30%;
    border-radius: 10px 10px 0px 0px;
    .el-dialog__header {
      height: 54px;
      text-align: center;
      background: #2d92ff;
      border-radius: 10px 10px 0px 0px;
      .el-dialog__title {
        font-size: 18px;
        font-family: $font-scre;
        font-weight: 400;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .el-dialog__close {
        color: white;
        font-size: 20px;
      }
    }
    .el-dialog__body {
      text-align: center;
    }
    .el-dialog__footer {
      text-align: center;
      .el-button {
        width: 92px;
        height: 42px;
        border-radius: 3px;
      }
    }
  }
}
.Dialog {
  ::v-deep .el-dialog {
    width: 833px;
    border-radius: 10px 10px 0px 0px;
    .el-dialog__header {
      height: 54px;
      text-align: center;
      background: #2d92ff;
      border-radius: 10px 10px 0px 0px;
      .el-dialog__title {
        font-size: 18px;
        font-family: $font-scre;
        font-weight: 400;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .el-dialog__close {
        color: white;
        font-size: 20px;
      }
    }
    .el-dialog__body {
      padding: 23px 18px;
      .dealwith {
        box-shadow: 0px 0px 0px 0px !important;
        font-size: 16px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        letter-spacing: 1px;
        margin-top: 10px;
      }
      .ul {
        background-image: url("../../assets/images/data_management/xinzhuang.svg");
        background-repeat: no-repeat;
        background-position: 100% 0;
      }
      ul,
      .dealwith {
        padding: 10px;
        box-shadow: 0px 2px 8px 0px rgba(204, 204, 204, 0.6);
        label {
          line-height: 25px;
          vertical-align: middle;
          display: inline-block;
          width: 120px;
          margin-right: 10px;
          text-align: right;
        }
        img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
        }
        span {
          color: red;
        }
        p {
          display: inline-block;
          line-height: 25px;
          width: 630px;
          vertical-align: middle;
        }
        li {
          font-size: 16px;
          font-family: $font-scre;
          font-weight: 400;
          color: #212d33;
          letter-spacing: 1px;
          padding-bottom: 16px;
        }
      }
    }
    .el-dialog__footer {
      .el-button {
        width: 92px;
        height: 42px;
        border-radius: 3px;
      }
    }
  }
}
.box {
  padding: 10px 20px;

  .filtrate-heared {
    margin-bottom: 20px;
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    .filtrate-title {
      padding-bottom: 10px;
      border-bottom: 1px solid #dedede;
      .left {
        font-size: 16px;
        font-family: $font-scme;
        font-weight: 500;
        text-align: left;
        color: #212d33;
        i {
          margin-right: 8px;
        }
        .right1 {
          font-weight: 400;
          float: right;
        }
      }
    }
    .filtrate-content {
      margin-top: 18px;
      .filtrate-content-left {
        float: left;
        margin-right: 300px;
        .text {
          font-size: 14px;
          font-weight: 400;
          color: #212d33;
          margin-bottom: 10px;
        }
        .el-select {
          width: 323px;
          height: 36px;
        }
      }
      .filtrate-content-right {
        float: left;
        .text {
          font-size: 14px;
          font-weight: 400;
          color: #212d33;
          margin-bottom: 10px;
        }
        .el-input {
          width: 323px !important;
        }
      }
      .info {
        margin-top: 15px;
        text-align: center;
        button {
          width: 89px;
          padding: 0;
          line-height: 33px;
          height: 33px;
          background: #2d92ff;
          border-radius: 5px;
          &:last-child {
            margin-left: 15px;
          }
        }
      }
    }
  }
  .filtrate-table {
    border-radius: 10px;
    background-color: #ffffff;
    padding: 0 20px;
    padding-top: 20px;
    /deep/ .el-button {
      border-radius: 10px;
      margin-bottom: 10px;
    }

    .filtrate-title {
      border-bottom: 1px solid #dbdbdb;
      .filtrate-title-text {
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: #313c42;
        letter-spacing: 1px;
        padding-bottom: 10px;
      }
    }
    /deep/ .el-pagination {
      text-align: center;
      padding: 33px 0;
    }
  }
}
</style>

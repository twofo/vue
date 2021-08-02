<template>
  <div class="middle_content">
    <div class="filter">
      <h3 class="clearfix">
        <div class="fl">条件筛选</div>
        <div class="pointer fr" @click="filtercheck = !filtercheck">
          <i class="el-icon-arrow-up" v-if="filtercheck"></i>
          <i v-else class="el-icon-arrow-down"></i>
          <span v-if="filtercheck">收起</span>
          <span v-else>展开</span>
        </div>
      </h3>
      <div class="filter_enter clearfix" v-if="filtercheck">
        <div class="asscx fl">
          <p>栏目名称</p>
          <el-input clearable v-model="lm_name" placeholder="请输入栏目名称"></el-input>
        </div>
        <div class="asscx fl">
          <p>标题</p>
          <el-input clearable v-model="title" placeholder="请输入标题名称"></el-input>
        </div>
      </div>
      <div class="info butonnhover" v-if="filtercheck">
        <button
          v-preventReClick="2000"
          @click="
            currentpage = 1;
            article_search();
          "
        >
          搜索
        </button>
        <button
          v-preventReClick="2000"
          @click="
            currentpage = 1;
            reset();
          "
        >
          重置
        </button>
      </div>
    </div>
    <div class="hepl_management">
      <h3>帮助管理</h3>
      <div class="button">
        <button v-preventReClick="2000" @click="delall()">删除</button>
        <button
          @click="
            DialogAddorEdit = 1;
            AddorEdit = true;
          "
        >
          新增
        </button>
        <button v-preventReClick="2000" @click="article_search()">刷新</button>
      </div>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData.records"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="table_check"
      >
        <el-table-column type="selection" style="width: 1rem"></el-table-column>
        <el-table-column label="标题">
          <template slot-scope="scope">
            <span @click="details(scope.row)" class="fontblue">{{
              scope.row.title
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="栏目名称">
          <template slot-scope="scope">
            {{ scope.row.columnName || "该栏目已被删除" }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime">
          <template slot="header">
            <span>创建时间</span>
            <span
              @click="sorttable('create_time')"
              :class="sortnumber == 1 ? 'ascending' : sortnumber == 2 ? 'descending' : ''"
            >
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="操作">
          <template slot-scope="scope">
            <span
              class="fontblue"
              @click="
                DialogAddorEdit = 2;
                AddorEdit = true;
                EditDialog(scope.row);
              "
              >编辑</span
            >
            <span
              class="fontblue"
              @click="
                DelDialog = true;
                BatchDelorOneDel = 1;
                Delete(scope.row);
              "
              >删除</span
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="pagechange"
        :current-page="currentpage"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
      <el-dialog :visible.sync="detailsdialog" class="detailsdialog" center>
        <h3>{{ InfoDialogData.title }}</h3>
        <ul class="title">
          <li>
            <span>栏目:</span>
            {{ InfoDialogData.column }}
          </li>
          <li>
            <span>时间:</span>
            {{ InfoDialogData.createTime }}
          </li>
        </ul>
        <fieldset>
          <legend>内容</legend>
          <div v-html="InfoDialogData.content"></div>
        </fieldset>
        <span slot="footer" class="dialog-footer">
          <el-button @click="detailsdialog = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 新增弹出框 -->
    <el-dialog
      class="addorupdatedialog"
      @close="addoreditdialogclose"
      :title="DialogAddorEdit == 1 ? '新增' : '编辑'"
      :visible.sync="AddorEdit"
    >
      <ul>
        <li>
          <label>
            标题
            <span>*</span>:
          </label>
          <input
            class="title"
            type="text"
            v-model="rich_input"
            placeholder="请输入标题"
          />
        </li>
        <li>
          <label>
            栏目
            <span>*</span>:
          </label>
          <el-select v-model="tich_value" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.columnName"
              :value="item.id"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label>
            正文
            <span>*</span>:
          </label>
          <vue-editor v-model="richtext" />
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-preventReClick="2000" @click="afirm_button()"
          >确 定</el-button
        >
        <el-button @click="AddorEdit = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除" class="DeleteDialog" :visible.sync="DelDialog" center>
      <h3 class="dialog_add">是否删除</h3>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-preventReClick="2000" @click="dialogconfirm"
          >确 定</el-button
        >
        <el-button
          @click="
            BatchDelorOneDel = 0;
            DelDialog = false;
          "
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
export default {
  name: "articlemanagement",
  mixins: [sortmixin],
  data() {
    return {
      DelDialog: false, //删除弹框
      DialogAddorEdit: 0, //新增编辑弹窗 0-默认 1新增 2-修改
      detailsdialog: false, //详情dialog显示或隐藏
      edit_name: null, //dialog 修改name
      add_name: null, //dialog 新增name
      filtercheck: true, //条件筛选showorhide
      title: null, //筛选   输入框标题
      lm_name: null, //筛选 输入框栏目名称
      currentpage: 1, //分页默认页数
      pagesizes: [10, 20, 30, 50], //分页选择每页多少条
      pagesize: 10, //每页10条 可调整
      InfoDialogData: {}, //详情弹窗数据
      tableData: [],
      tablecheck_data: [], //表格选择行数据
      AddorEdit: false, //新增编辑弹窗
      rich_input: "", //Diaolog新增修改标题
      tich_value: "",
      options: [],
      richtext: "", //富文本内容
      articelId: "", //修改 文字id
      BatchDelorOneDel: 0, //单个删除-1  批量删除-2
      DelOneIds: [], //删除单个列表ids
      loading: false,
    };
  },
  methods: {
    delall() {
      if (this.tablecheck_data.length <= 0) {
        return this.$message.warning("请先选择需要删除的数据!");
      }
      this.DelDialog = true;
      this.BatchDelorOneDel = 2;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.article_search();
    },
    reset() {
      this.title = null;
      this.sortnumber = 0;
      this.lm_name = null;
      this.article_search();
    },
    dialogconfirm() {
      if (this.BatchDelorOneDel == 1) {
        // 单个
        this.$axios.post("/sys/article/remove?ids", this.DelOneIds).then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.article_search();
          this.BatchDelorOneDel = 0;
          this.DelDialog = false;
        });
      } else if (this.BatchDelorOneDel == 2) {
        // 多个
        if (this.tablecheck_data.length == 0) {
          this.DelDialog = false;
          this.$message({
            message: "请选择需要删除行",
            type: "warning",
          });
        } else {
          let ids = [];
          this.tablecheck_data.forEach((item) => {
            ids.push(item.id);
          });
          this.$axios.post("/sys/article/remove?ids", ids).then((res) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.article_search();
            this.BatchDelorOneDel = 0;
            this.DelDialog = false;
          });
        }
      }
    },
    Delete(row) {
      // 单个删除
      this.DelOneIds.push(row.id);
      this.DelDialog = true;
    },
    addoreditdialogclose() {
      this.DialogAddorEdit = 0;
      this.rich_input = "";
      this.tich_value = "";
      this.richtext = "";
    },
    EditDialog(row) {
      this.$axios.get("/sys/article/info/" + row.id).then((res) => {
        this.rich_input = res.data.rows.title;
        this.tich_value = res.data.rows.columnId;
        this.richtext = res.data.rows.content;
        this.articelId = res.data.rows.id;
      });
    },
    // 栏目查询
    CloumnName() {
      this.$axios.post("/sys/column/columnName", {}).then((res) => {
        this.options = res.data.rows;
      });
    },
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name)
        .then((res) => {
          this.tableData = res.data.rows;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 文章分页查询
    article_search() {
      this.loading = true;
      this.AxiosParams = {
        current: this.currentpage,
        size: this.pagesize,
        title: this.title,
        columnName: this.lm_name,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/sys/article/list";
      this.$axios
        .post("/sys/article/list", {
          current: this.currentpage,
          size: this.pagesize,
          title: this.title,
          columnName: this.lm_name,
        })
        .then((res) => {
          this.tableData = res.data.rows;
          this.loading = false;
        });
    },
    //   单击表格
    details(row) {
      let id = row.id;
      this.$axios.get("/sys/article/info/" + id).then((res) => {
        this.$set(res.data.rows, "column", row.columnName);
        this.InfoDialogData = res.data.rows;
        this.detailsdialog = true;
      });
    },
    // 单击表格多选按钮  讲数据存入其数组
    table_check(val) {
      this.tablecheck_data = val;
    },
    //   分页
    pagechange(val) {
      this.currentpage = val;
      this.article_search();
    },
    afirm_button() {
      if (this.richtext.indexOf("img") != -1 && this.richtext.indexOf("src=") != -1) {
        if (
          this.richtext.indexOf("https://") != -1 ||
          this.richtext.indexOf("http://") != -1
        ) {
          this.$message.warning("图片请从本地上传!");
          return;
        }
      }
      if (this.rich_input == "" || this.richtext == "" || this.tich_value == "") {
        this.$message.warning("内容不能为空!");
      } else {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        if (this.DialogAddorEdit == 1) {
          // 新增
          this.$axios
            .post("/sys/article/save", {
              title: this.rich_input,
              content: this.richtext,
              columnId: this.tich_value,
            })
            .then((res) => {
              if (res.data.code == 200) {
                loading.close();
                this.$message.success(res.data.msg);
              } else {
                loading.close();
                this.$message.warning(res.data.msg);
              }
              this.article_search();
              this.AddorEdit = false;
            });
        } else {
          // 编辑
          this.AddorEdit = true;
          this.$axios
            .post("/sys/article/update", {
              id: this.articelId,
              title: this.rich_input,
              content: this.richtext,
              columnId: this.tich_value,
            })
            .then((res) => {
              loading.close();
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
              } else if (res.data.code == 500) {
                this.$message({
                  message: res.data.msg,
                  type: "warning",
                });
              } else {
                this.$message.error(res.data.msg);
              }
              this.article_search();
              this.AddorEdit = false;
            });
        }
      }
    },
  },
  activated() {
    this.article_search(); //查询table分页数据
    this.CloumnName(); //栏目查询
  },
  created() {
    this.article_search(); //查询table分页数据
    this.CloumnName(); //栏目查询
  },
};
</script>

<style lang="scss" scoped>
.addorupdatedialog {
  ::v-deep .el-dialog {
    margin-top: 7vh !important;
    width: 883px;
    background: #ffffff;
    border-radius: 10px 10px 4px 4px;
    box-shadow: 0px 2px 16px 0px rgba(74, 74, 74, 0.52);
    .el-dialog__header {
      height: 54px;
      background: #2d92ff;
      border-radius: 10px 10px 0px 0px;
      text-align: center;
      .el-dialog__title {
        font-size: 18px;
        font-family: $font-scre;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .el-dialog__headerbtn {
        i {
          color: white;
        }
      }
    }
    .el-dialog__body {
      ul {
        padding: 0 0 0 26px;
        li {
          .title {
            text-indent: 15px;
          }
          input {
            width: 416px;
            height: 44px;
            border: 1px solid #999999;
            border-radius: 5px;
          }
          margin-top: 15px;
          .quillWrapper {
            width: 748px;
            vertical-align: top;
            display: inline-block;
          }
          label {
            margin-right: 5px;
            width: 60px;
            text-align: left;
            display: inline-block;
            font-size: 16px;
            font-family: $font-scre;
            font-weight: 400;
            color: #212d33;
            letter-spacing: 1px;
            span {
              color: red;
            }
          }
        }
      }
    }
  }
}
.DeleteDialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 22px 59px 30px 59px;
      text-align: center;
      h3 {
        font-size: 20px;
        text-align: center;
      }
    }
    .el-dialog__footer {
      padding-bottom: 21px;
      button {
        width: 92px;
        height: 42px;
        border-radius: 3px;
      }
      .el-button--default {
        border: 2px solid #dbdbdb;
        margin-left: 24px;
      }
      .el-button--primary {
        background: #2d92ff;
      }
    }
    .el-dialog__header {
      > span {
        font-size: 18px;
        font-family: $font-scre;
        font-weight: 400;
        color: #ffffff;
        letter-spacing: 1px;
      }
      height: 54px;
      padding: 0;
      text-align: center;
      line-height: 54px;
      background: #2d92ff;
      border-radius: 10px 10px 0px 0px;
    }
    width: 516px;
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;
  }
}
.detailsdialog {
  ::v-deep .el-dialog {
    margin: 7vh auto 0 auto !important;
    .el-dialog__footer {
      .el-button--default {
        width: 92px;
        height: 42px;
        background: #2d92ff;
        border-radius: 3px;
        font-size: 16px;
        font-family: $font-scme;
        color: #ffffff;
        letter-spacing: 1px;
      }
    }
    .el-dialog__body {
      fieldset {
        border: 1px solid #dbdbdb;
        border-radius: 1px;
        text-align: left;
        padding: 15px 10px;
        margin: 0;
        legend,
        div {
          font-size: 18px;
          font-family: $font-scme;
          font-weight: 500;
          color: #212d33;
        }
        p {
          font-family: $font-scre;
          line-height: 22px;
        }
      }
      .title {
        padding: 0 13px;
        margin: 10px 0;
        height: 40px;
        line-height: 40px;
        border: 1px solid #dbdbdb;
        border-left: 10px solid #2d92ff;
        li {
          &:first-child {
            padding-right: 75px;
          }
          display: inline-block;
          font-size: 18px;
          font-family: $font-scme;
          font-weight: 500;
          color: #212d33;
        }
      }
      img {
        width: 100% !important;
        height: 100%;
      }
      h3 {
        font-size: 24px;
        font-family: $font-scme;
        font-weight: 500;
        color: #000000;
        padding-bottom: 10px;
        border-bottom: 1px solid #dbdbdb;
      }
    }
    width: 883px;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 2px 16px 0px rgba(74, 74, 74, 0.52);
  }
}
::v-deep .el-pagination {
  text-align: center;
  padding: 33px 0 10px 0;
}
::v-deep .el-table {
  th,
  td {
    line-height: 45px;
    font-size: 14px;
    font-family: $font-scre;
    color: #364147;
    height: 45px;
  }
  td {
    &:last-child {
      span {
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
  th {
    background: $tablebg;
    border-bottom: 0;
  }
}
.hepl_management {
  > h3 {
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 10px;
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #313c42;
    letter-spacing: 1px;
  }
  margin-top: 19px;
  padding: 24px 24px 30px 27px;
  background: #ffffff;
  border-radius: 8px;
}
.filter {
  margin-top: 8px;
  padding: 18px 20px 18px 20px;
  background: #ffffff;
  border-radius: 8px;

  h3 {
    div {
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      text-align: left;
      color: #212d33;
      i {
        margin-right: 8px;
      }
    }
  }
  .filter_enter {
    margin-top: 12px;
    border-top: 1px solid #dbdbdb;
    > div {
      margin-right: 310px;
      margin-top: 18px;
    }
    .fl {
      width: 323px;
      ::v-deep .el-select {
        width: 100%;
      }
      ::v-deep .el-date-editor {
        width: 100%;
        .el-range-separator {
          width: 7%;
        }
      }
      p {
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        margin-bottom: 10px;
      }
    }
  }
  .info {
    width: 100%;
    text-align: center;
    margin-top: 33px;
    padding-bottom: 10px;
    button {
      margin: 0 15px;
      width: 80px;
      height: 33px;
      background: #2d92ff;
      border-radius: 5px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      text-align: center;
      line-height: 33px;
      color: #ffffff;
      border: 0;
    }
  }
}
.middle_content {
  padding: 0 19px;
}
</style>

<template>
  <div class="middle_content">
    <div class="filter">
      <h3 class="clearfix">
        <div class="fl">条件筛选</div>
        <div class="fr pointer" @click="filtercheck = !filtercheck">
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
      </div>
      <div class="info butonnhover" v-if="filtercheck">
        <button @click="search">搜索</button>
        <button @click="reset">重置</button>
      </div>
    </div>
    <div class="hepl_management">
      <h3>帮助管理</h3>
      <div class="button">
        <button v-preventReClick="2000" @click="batch_del()">删除</button>
        <button
          v-preventReClick="2000"
          @click="
            dialogshoworhide = true;
            del_add_edit = 1;
          "
        >
          新增
        </button>
        <button v-preventReClick="2000" @click="Refresh">刷新</button>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData.records"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="table_check"
      >
        <el-table-column type="selection" width="337px"></el-table-column>
        <el-table-column prop="columnName" label="栏目名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span @click="dialog_edit(scope.row)">编辑</span>
            <span @click="dialog_del(scope.row)">删除</span>
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
      <el-dialog
        :title="
          del_add_edit == 1
            ? '新增'
            : del_add_edit == 2
            ? '编辑'
            : del_add_edit == 3
            ? '删除'
            : del_add_edit == 4
            ? '删除'
            : '提示'
        "
        :visible.sync="dialogshoworhide"
        center
      >
        <div v-if="del_add_edit == 1">
          <label> <span>*</span>栏目名称: </label>
          <el-input placeholder="请输入栏目名称" v-model="add_name" clearable></el-input>
        </div>
        <div v-if="del_add_edit == 2">
          <label> <span>*</span>栏目名称: </label>
          <el-input placeholder="请输入栏目名称" v-model="edit_name" clearable></el-input>
        </div>
        <h3 class="dialog_del" v-if="del_add_edit == 3 || del_add_edit == 4">是否删除</h3>
        <p class="del_red" v-if="del_add_edit == 3 || del_add_edit == 4">
          执行该操作会将选择栏目下的文字一并删除,请注意!
        </p>
        <span slot="footer" class="dialog-footer butonnhover">
          <el-button type="primary" @click="dialogconfirm" v-preventReClick="2000"
            >确 定</el-button
          >
          <el-button
            @click="
              del_add_edit = 0;
              dialogshoworhide = false;
              add_name = '';
              edit_name = '';
            "
            >取 消</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "columnmanagement",
  data() {
    return {
      edit_name: "", //dialog 修改name
      add_name: "", //dialog 新增name
      del_add_edit: 0, //dialog  1-新增 2-编辑 3-删除单个 4-删除多个 0-默认
      dialogshoworhide: false, //dialog showorhide
      currentpage: 1, //分页默认页数
      pagesizes: [10, 20, 30, 50], //分页选择每页多少条
      pagesize: 10, //每页10条 可调整
      lm_name: "", //搜索输入框 栏目名称
      filtercheck: true, //条件筛选showorhide
      tableData: [], //table信息
      tablecheck_data: [], //表格选中后信息
      edit_id: "", //dialog 修改所需id
      del_id: [], //dialog  删除所需id  需数组格式
      loading: false,
    };
  },
  created() {
    this.tabledata();
  },
  activated() {
    this.tabledata();
  },
  methods: {
    Refresh() {
      this.loading = true;
      this.tabledata();
    },
    reset() {
      this.lm_name = null;
      this.tabledata();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.tabledata();
    },
    // dialog 批量删除
    batch_del() {
      if (this.tablecheck_data.length <= 0) {
        return this.$message.warning("请先选择需要删除的数据!");
      }
      this.del_add_edit = 4;
      this.dialogshoworhide = true;
    },
    // dialog删除
    dialog_del(row) {
      this.del_id.push(row.id);
      this.del_add_edit = 3;
      this.dialogshoworhide = true;
    },
    // dialog 编辑
    dialog_edit(row) {
      this.edit_name = row.columnName;
      this.del_add_edit = 2;
      this.dialogshoworhide = true;
      this.edit_id = row.id;
    },
    // dialog   单击确认
    dialogconfirm() {
      this.lm_name = "";
      if (this.del_add_edit == 1) {
        if (
          this.add_name == "" ||
          this.add_name == null ||
          this.add_name.match(/^[ ]*$/)
        ) {
          this.$message({
            message: "请输入栏目名称(空格无效)",
            type: "warning",
          });
        } else {
          this.$axios
            .post("/sys/column/save", { columnName: this.add_name })
            .then((res) => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.tabledata();
            });
        }
      } else if (this.del_add_edit == 2) {
        if (
          this.edit_name == "" ||
          this.edit_name == null ||
          this.edit_name.match(/^[ ]*$/)
        ) {
          this.$message({
            message: "请输入栏目名称(空格无效)",
            type: "warning",
          });
        } else {
          this.$axios
            .post("/sys/column/update", {
              id: this.edit_id,
              columnName: this.edit_name,
            })
            .then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.tabledata();
            });
        }
      } else if (this.del_add_edit == 3) {
        let ids = [];
        ids = this.del_id;
        this.$axios.post("/sys/column/remove?ids", ids).then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.tabledata();
        });
      } else if (this.del_add_edit == 4) {
        let ids = [];
        if (this.tablecheck_data == [] || this.tablecheck_data.length <= 0) {
          this.dialogshoworhide = false;
          return this.$message.warning("请先选择需要删除列!");
        }
        this.tablecheck_data.forEach((item) => {
          ids.push(item.id);
        });
        this.$axios.post("/sys/column/remove?ids", ids).then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.tabledata();
        });
      }
      this.add_name = null;
      this.dialogshoworhide = false;
    },
    // 表格数据查询
    tabledata() {
      this.$axios
        .post("/sys/column/list", {
          current: this.currentpage,
          size: this.pagesize,
          columnName: this.lm_name,
        })
        .then((res) => {
          this.tableData = res.data.rows;
          this.loading = false;
        });
    },
    //   分页
    pagechange(val) {
      this.currentpage = val;
      this.tabledata();
    },
    //   按钮单击 搜索功能
    search() {
      this.currentpage = 1;
      this.tabledata();
    },
    // 单击表格多选按钮  讲数据存入其数组
    table_check(val) {
      this.tablecheck_data = val;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__body {
    padding: 22px 59px 30px 59px;
    text-align: center;
    h3 {
      font-weight: 400;
      font-size: 18px;
      text-align: center;
    }
    .del_red {
      color: red;
      margin-top: 10px;
    }
    label {
      font-size: 16px;
      font-family: $font-scre;
      font-weight: 400;
      letter-spacing: 1px;
      span {
        color: #ff2020;
      }
    }
    .el-input,
    label {
      display: inline-block;
      vertical-align: middle;
    }
    .el-input {
      margin-left: 5px;
      width: 310px;
      height: 41px;
    }
  }
  .el-dialog__footer {
    padding-bottom: 21px;
    button {
      width: 92px;
      height: 42px;
      border-radius: 3px;
      &:last-child {
        border: 1px solid !important;
        &:hover {
          background: white !important;
          color: #2d92ff;
          border-color: #2d92ff;
        }
      }
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
    .el-dialog__headerbtn {
      top: 5px;
      i {
        color: white;
        font-size: 23px;
      }
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
::v-deep .el-pagination {
  text-align: center;
  padding: 33px 0 10px 0;
}
::v-deep .el-table {
  tr {
    height: 68px;
    .cell {
      font-size: 14px;
      font-family: $font-scre;
      color: #364147;
      .el-checkbox__inner {
        border: 1px solid #dbdbdb;
      }
    }
    td:last-child {
      .cell {
        cursor: pointer;
        color: #2d92ff;
        span:first-child {
          margin-right: 23px;
        }
      }
    }
  }
  .el-table__header-wrapper {
    table {
      thead {
        tr {
          .is-leaf {
            border-bottom: 0;
            background-color: $tablebg;
          }
          .cell {
            font-family: $font-scme;
            font-weight: 600;
          }
        }
      }
    }
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
.middle_content {
  padding: 0 19px;
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
      margin-right: 160px;
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
      &:last-child {
        margin-left: 15px;
      }
    }
  }
}
</style>

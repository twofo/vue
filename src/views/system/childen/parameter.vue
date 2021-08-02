<template>
  <main>
    <div class="middle_content">
      <h3>参数设置</h3>
      <div class="button">
        <button v-preventReClick="2000" @click="Refresh">刷新</button>
        <button v-preventReClick="2000" @click="globaladd()">新增</button>
        <button v-preventReClick="2000" @click="delall">删除</button>
      </div>
      <el-table
        v-loading="loading"
        :data="TableData.records"
        style="width: 100%; margin-bottom: 20px"
        row-key="macroId"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="参数名"
        ></el-table-column>
        <el-table-column
          prop="value"
          show-overflow-tooltip
          label="参数值"
        ></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span :class="scope.row.type == 0 ? 'blue' : 'yellow'">{{
              scope.row.type == 0 ? "目录" : "参数"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="orderNum"
          label="排序"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="address" label="启禁用">
          <template slot-scope="scope">
            <el-switch
              disabled
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="备注">
          <template slot-scope="scope">{{
            scope.row.remark || "-"
          }}</template></el-table-column
        >
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <span @click="update(scope.row)">编辑</span>
            <span v-if="scope.row.type == 1" @click="tabledel(scope.row)">删除</span>
            <el-dropdown trigger="click" v-else>
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="tableadd(scope.row)"
                  >新增</el-dropdown-item
                >
                <el-dropdown-item @click.native="tabledel(scope.row)"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        @close="AddDialogClose"
        title="新增字典"
        :visible.sync="AddDialog"
        center
      >
        <ul>
          <li>
            <label>类型</label>
            <el-radio @change="radiochange" v-model="DialogType" label="0">目录</el-radio>
            <el-radio @change="radiochange" v-model="DialogType" label="1">参数</el-radio>
          </li>
          <li>
            <label>
              名称
              <i>*</i>
            </label>
            <input v-model="DialogName" type="text" placeholder="目录名称或参数名称" />
          </li>
          <li>
            <label>
              参数值
              <i>*</i>
            </label>
            <input v-model="DialogCode" type="text" placeholder="类别编码或参数值" />
          </li>
          <li>
            <label>
              参数类型
              <i>*</i>
            </label>
            <el-select v-model="DialogselectValue" placeholder="一级目录">
              <el-option
                v-for="item in DialogselectOption"
                :key="item.typeId"
                :label="item.typeName"
                :value="item.typeId"
              ></el-option>
            </el-select>
          </li>
          <li v-if="DialogType == 1">
            <label>状态 <i>*</i></label>
            <el-radio v-model="DialogStatus" :label="1">启用</el-radio>
            <el-radio v-model="DialogStatus" :label="0">禁用</el-radio>
          </li>
          <li>
            <label>排序</label>
            <input v-model="DialogSort" type="text" />
          </li>
          <li>
            <label>备注</label>
            <input v-model="DialogRemark" type="text" />
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="Dialogcheckprimary" v-preventReClick="2000"
            >确 定</el-button
          >
          <el-button @click="AddDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        @close="updatedialogclose"
        title="修改"
        :visible.sync="updateDialog"
        center
      >
        <ul>
          <li>
            <label>
              名称
              <i>*</i>
            </label>
            <input v-model="DialogName" type="text" placeholder="目录名称或参数名称" />
          </li>
          <li>
            <label>
              参数值
              <i>*</i>
            </label>
            <input v-model="DialogCode" type="text" placeholder="类别编码或参数值" />
          </li>
          <li>
            <label>
              参数类型
              <i>*</i>
            </label>
            <el-select v-model="Dialogselectupdate" placeholder="请选择">
              <el-option
                v-for="item in DialogselectOption"
                :key="item.typeId"
                :label="item.typeName"
                :value="item.typeId"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label>排序</label>
            <input v-model="DialogSort" type="text" />
          </li>
          <li v-if="DialogType == 1">
            <label>备注</label>
            <input v-model="DialogRemark" type="text" />
          </li>
          <li v-if="DialogType == 1">
            <label>状态</label>
            <el-radio v-model="dialogstatusupdate" :label="1">启用</el-radio>
            <el-radio v-model="dialogstatusupdate" :label="0">禁用</el-radio>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updatecheck" v-preventReClick="2000"
            >确 定</el-button
          >
          <el-button @click="updateDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="系统提示"
        width="20%"
        class="deldialog"
        :visible.sync="DelDialog"
        center
      >
        <p>确定删除吗?</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogdel" v-preventReClick="2000"
            >确 定</el-button
          >
          <el-button @click="DelDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TableData.total"
      ></el-pagination>
    </div>
  </main>
</template>

<script>
export default {
  name: "parameter",
  data() {
    return {
      alldeloronedel: null,
      type_id: null,
      macro_id: null,
      updateDialog: false,
      DelDialog: false,
      DialogRemark: null,
      DialogSort: null,
      DialogCode: null,
      DialogStatus: 1,
      dialogstatusupdate: null,
      DialogselectOption: [],
      DialogselectValue: 0,
      Dialogselectupdate: null,
      DialogName: null,
      DialogType: null,
      AddDialog: false,
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      multipleSelection: [], //表格选中数据
      TableData: [], //表格数据
      rowdeldata: null,
      loading: false,
    };
  },
  created() {
    this.AxiosTableData();
  },
  methods: {
    Refresh() {
      this.loading = true;
      this.AxiosTableData();
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.AxiosTableData();
    },
    // 修改弹框关闭
    updatedialogclose() {
      this.DialogType = null;
      this.Dialogselectupdate = null;
      this.DialogName = null;
      this.DialogCode = null;
      this.DialogSort = null;
      this.DialogRemark = null;
      this.dialogstatusupdate = null;
      this.macro_id = null;
    },
    // 修改dialog
    updatecheck() {
      this.$axios
        .post("/sys/macro/update", {
          name: this.DialogName,
          value: this.DialogCode,
          type: this.DialogType,
          typeId: this.Dialogselectupdate,
          remark: this.DialogRemark,
          orderNum: this.DialogSort,
          status: this.dialogstatusupdate,
          macroId: this.macro_id,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "修改失败稍后重试",
              type: "warning",
            });
          }
          this.updateDialog = false;
          this.AxiosTableData();
        })
        .catch((error) => {
          return this.$message.warning(error.response.data.message);
        });
    },
    dialogdel() {
      if (this.alldeloronedel == 1) {
        //全局
        if (this.multipleSelection.length > 0) {
          let trueorfalse = null;
          let id = [];
          this.multipleSelection.forEach((item) => {
            if (item.children) {
              if (item.children.length > 0) {
                trueorfalse = false;
              } else {
                id.push(item.macroId);
              }
            } else {
              id.push(item.macroId);
            }
          });
          if (trueorfalse != false) {
            this.$axios.post("/sys/macro/delete", id).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("删除成功");
                [this.CurrentPage, this.DelDialog] = [1, false];
                this.AxiosTableData();
              } else {
                this.$message.warning("删除失败请稍后再试");
                this.AxiosTableData();
                [this.CurrentPage, this.DelDialog] = [1, false];
              }
            });
          } else {
            this.$message.warning("选中项下级存在参数请先删除");
            this.DelDialog = false;
          }
        } else {
          this.$message.warning("您还未选择数据");
          this.DelDialog = false;
        }
      } else if (this.alldeloronedel == 2) {
        //单列
        if (this.rowdeldata.children && this.rowdeldata.children.length > 0) {
          this.$message.warning("请先移除下级配置");
          this.DelDialog = false;
        } else {
          let id = [];
          id.push(this.rowdeldata.macroId);
          this.$axios.post("/sys/macro/delete", id).then((res) => {
            if (res.data.code == 200) {
              this.$message.success("删除成功");
              [this.CurrentPage, this.DelDialog] = [1, false];
              this.AxiosTableData();
            } else {
              this.$message.warning("删除失败,请稍后再试");
              [this.CurrentPage, this.DelDialog] = [1, false];
              this.AxiosTableData();
            }
          });
        }
      }
    },
    // 删除
    tabledel(row) {
      this.alldeloronedel = 2;
      this.rowdeldata = row;
      this.DelDialog = true;
    },
    // 全局删除
    delall() {
      if (this.multipleSelection.length <= 0) {
        return this.$message.warning("请先选择需要删除的参数!");
      }
      this.alldeloronedel = 1;
      this.DelDialog = true;
    },
    // 编辑
    update(row) {
      this.DialogType = row.type.toString();
      this.Dialogselectupdate = row.typeId;
      this.type_id = row.typeId;
      this.macro_id = row.macroId;
      this.DialogName = row.name;
      this.DialogCode = row.value;
      this.DialogSort = row.orderNum;
      this.DialogRemark = row.remark;
      this.dialogstatusupdate = row.status;
      this.AddDialog = false;
      this.Axiosselect(row.macroId);
      this.updateDialog = true;
    },
    // Axiosselect
    Axiosselect(macroId) {
      this.$axios.post("/sys/macro/catalog", {macroId}).then((res) => {
        this.DialogselectOption = res.data.rows;
      });
    },
    // 新增弹框 关闭清楚参数
    AddDialogClose() {
      this.DialogselectValue = 0;
      this.DialogSort = null;
      this.DialogRemark = null;
      this.DialogName = null;
      this.DialogCode = null;
    },
    // 新增弹框 选中radio 清空数据
    radiochange() {
      this.AddDialogClose();
    },
    // 全局新增
    globaladd() {
      this.DialogType = "0";
      this.Axiosselect();
      this.AddDialog = true;
    },
    // 新增单击确认
    Dialogcheckprimary() {
      let macroId = 0;
      if (this.DialogselectValue) {
        macroId = this.DialogselectValue;
      }
      if (this.DialogName == "" || this.DialogName == null) {
        return this.$message.warning("名称不能为空!");
      } else if (this.DialogCode == "" || this.DialogCode == null) {
        return this.$message.warning("参数值不能为空!");
      } else if (this.DialogType == "" || this.DialogType == null) {
        return this.$message.warning("参数类型不能为空!");
      } else if (
        this.DialogSort !== null &&
        this.DialogSort !== "" &&
        !/^\d+(?=\.{0,1}\d+$|$)/.test(this.DialogSort)
      ) {
        return this.$message.warning("排序请输入整数!");
      }
      if (this.DialogType == 0) {
        this.$axios
          .post("/sys/macro/save", {
            name: this.DialogName,
            value: this.DialogCode,
            type: this.DialogType,
            typeId: macroId,
            remark: this.DialogRemark,
            orderNum: this.DialogSort,
            status: 1,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning",
              });
            }
            this.AddDialog = false;
            this.AxiosTableData();
          });
      } else {
        this.$axios
          .post("/sys/macro/save", {
            name: this.DialogName,
            value: this.DialogCode,
            type: this.DialogType,
            typeId: macroId,
            remark: this.DialogRemark,
            orderNum: this.DialogSort,
            status: this.DialogStatus,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("新增成功");
            } else {
              this.$message.warning(res.data.msg);
            }
            this.AddDialog = false;
            this.AxiosTableData();
          });
      }
    },
    AxiosTableData() {
      this.$axios
        .post("/sys/macro/getList", {
          current: this.CurrentPage,
          size: this.PageSize,
        })
        .then((res) => {
          this.TableData = res.data.rows;
          this.loading = false;
        });
    },
    // 新增
    tableadd(row) {
      this.DialogType = "1";
      this.Axiosselect();
      this.DialogselectValue = row.macroId;
      this.AddDialog = true;
    },

    // 多选选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.AxiosTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
.deldialog {
  ::v-deep .el-dialog {
    p {
      text-align: center;
      font-size: 14px;
    }
    .el-dialog__body {
      padding: 15px 25px;
    }
    .el-dialog__footer {
      padding-top: 0;
      button {
        margin: 0;
        margin-right: 15px;
        &:last-child {
          margin: 0;
        }
      }
    }
  }
}
::v-deep .el-dialog {
  width: 554px;
  background: #ffffff;
  border-radius: 10px 10px 0px 0px;
  box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.13);
  .el-dialog__body {
    ul {
      li {
        &:last-child {
          .el-radio {
            text-align: left;
          }
        }
        margin-top: 16px;
        label {
          i {
            color: red;
            font-style: inherit;
          }
          margin-right: 10px;
          font-size: 16px;
          font-family: $font-scre;
          font-weight: 400;
          color: #4a4a4a;
          letter-spacing: 1px;
          width: 90px;
          display: inline-block;
          text-align: right;
        }
        input {
          text-indent: 10px;
          width: 365px;
          height: 40px;
          border: 1px solid #999999;
          border-radius: 4px;
        }
      }
    }
  }
  .el-dialog__header {
    height: 46px;
    background: #2d92ff;
    border-radius: 10px 10px 0px 0px;
    line-height: 46px;
    box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.13);
    padding: 0;
    .el-dialog__headerbtn {
      font-size: 18px;
      top: 0;
      i {
        color: white;
      }
    }
    .el-dialog__title {
      font-size: 18px;
      font-family: $font-scre;
      font-weight: 400;
      padding: 0;
      text-align: left;
      color: #ffffff;
      letter-spacing: 1px;
      text-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.13);
    }
  }
  .el-dialog__footer {
    button {
      width: 128px;
      margin: 0 40px;
      height: 36px;
      padding: 0;
      line-height: 36px;
      border-radius: 3px;
      box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.13);
    }
  }
}
::v-deep .el-table {
  margin-top: 15px;
  .el-checkbox__inner {
    border: 1px solid #dbdbdb;
  }
  .el-table__header-wrapper {
    th {
      height: 68px;
      text-align: center;
      background: $tablebg;
      font-size: 14px;
      font-family: $font-scme;
      font-weight: 600;
      color: #364147;
    }
  }
  .el-table__body-wrapper {
    td {
      font-size: 14px;
      text-align: center;
      font-family: $font-scre;
      font-weight: 400;
      color: #364147;
      &:last-child {
        cursor: pointer;
        span {
          margin-right: 5px;
          color: #2d92ff;
        }
      }
    }
    .yellow {
      background: #ffae53;
    }
    .blue,
    .yellow {
      border-radius: 2px;
      display: inline-block;
      padding: 3px 5px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 2px;
    }
    .blue {
      background: #268eff;
    }
  }
}
/deep/ .el-pagination {
  text-align: center;
  padding-top: 20px;
}
.middle_content {
  h3 {
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 10px;
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #313c42;
    letter-spacing: 1px;
  }
  background: white;
  padding: 15px 20px 20px;
  border-radius: 8px;
}
main {
  padding: 0 19px;
}
</style>

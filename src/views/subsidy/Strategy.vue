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
        <div class="sjfw fl">
          <p>业务类型</p>
          <el-select v-model="TypeValue" placeholder="请选择">
            <el-option
              v-for="item in TypeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="fl">
          <p>策略名称</p>
          <el-input
            clearable
            v-model="StrategyName"
            placeholder="请输入策略名称"
          ></el-input>
        </div>
      </div>
      <div class="info" v-if="filtercheck">
        <button @click="Search">搜索</button>
        <button @click="Reset">重置</button>
      </div>
    </div>
    <main>
      <div class="top">补贴策略</div>
      <button class="block" @click="AddDialog = true">新增</button>
      <table v-loading="loading">
        <tr>
          <th>序号</th>
          <th>策略名称</th>
          <th>设备名称</th>
          <th>业务名称</th>
          <th>补助发放类型</th>
          <th>补助周期规则</th>
          <th>补助是否叠加</th>
          <th>发放模式</th>
          <th>策略启禁用</th>
        </tr>
        <template v-if="tableData.records !== undefined && tableData.records.length > 0">
          <tr v-for="(item, index) in tableData.records" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.strategyName || "-" }}</td>
            <td>{{ item.deviceName || "-" }}</td>
            <td>
              {{
                item.businessName == 1
                  ? "冷水"
                  : item.businessName == 2
                  ? "电"
                  : item.businessName == 9
                  ? "热水"
                  : "-"
              }}
            </td>
            <td>
              {{
                item.grantType == 1
                  ? "按人员发放"
                  : item.grantType == 2
                  ? "按区域发放"
                  : "-"
              }}
            </td>
            <td>
              {{
                item.subsidyCycle == 1 ? "每月" : item.subsidyCycle == 2 ? "每学期" : "-"
              }}
            </td>
            <td>
              {{ item.isAccumulation == 1 ? "是" : item.grantModel == 0 ? "否" : "-" }}
            </td>
            <td>
              {{
                item.grantModel == 1 ? "循环" : item.grantModel == 2 ? "单次定量" : "-"
              }}
            </td>
            <td>
              <el-switch
                v-model="item.status"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                @change="switchchange(item)"
                inactive-color="#ff4949"
              >
              </el-switch>
            </td>
          </tr>
        </template>
      </table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      >
      </el-pagination>
      <el-dialog class="adddialog" title="新增策略" :visible.sync="AddDialog">
        <div>
          <label>补贴策略名称:</label>
          <el-input placeholder="输入策略名称" v-model="AddstrategyName" clearable>
          </el-input>
        </div>
        <ul>
          <li>
            <label>业务名称:</label>
            <el-select v-model="AddbusinessTypevalue" clearable placeholder="请选择">
              <el-option
                v-for="item in AddbusinessTypeSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li>
            <label>发放模式:</label>
            <el-select v-model="AddgrantModelValue" clearable placeholder="请选择">
              <el-option
                v-for="item in AddgrantModelSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li>
            <label>补助发放类型:</label>
            <el-select v-model="AddgranTypeValue" clearable placeholder="请选择">
              <el-option
                v-for="item in AddgranTypeSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li>
            <label>补助周期规则:</label>
            <el-select v-model="AddsubsidyCycleValue" clearable placeholder="请选择">
              <el-option
                v-for="item in AddsubsidyCycleSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li>
            <label>补贴是否叠加:</label>
            <el-select v-model="AddisAccumulationValue" clearable placeholder="请选择">
              <el-option
                v-for="item in AddisAccumulationSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="DialogAdd()">新 增</el-button>
        </span>
      </el-dialog>
    </main>
  </div>
</template>

<script>
export default {
  name: "Strategy",
  data() {
    return {
      loading: false,
      IsorNull: null,
      TypeValue: null,
      TypeSelect: [
        { label: "冷水", value: "1" },
        { value: "2", label: "电" },
        { value: "9", label: "热水" },
      ],
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      AddDialogStrategy: null, //策略内容 diaolog
      AddDialogbusinessvalue: null,
      AddDialogbusinessSelect: [
        { value: "1", label: "冷水" },
        { value: "2", label: "电" },
        { value: "9", label: "热水" },
      ],
      AddDialog: false,
      filtercheck: true, //筛选showorhide
      StrategyName: null,
      tableData: {},
      AddstrategyName: null, //策略名称
      AddbusinessTypevalue: null, //业务名称
      AddbusinessTypeSelect: [
        { label: "冷水", value: "1" },
        { label: "电", value: "2" },
        { label: "热水", value: "9" },
      ],
      AddgranTypeValue: null, //补助发放类型
      AddgranTypeSelect: [
        { label: "按人员发放", value: "1" },
        { label: "按区域发放", value: "2" },
      ],
      AddsubsidyCycleValue: null, //补助周期规则
      AddsubsidyCycleSelect: [
        { label: "无", value: "0" },
        { label: "每月", value: "1" },
        { label: "每学期", value: "2" },
      ],
      AddisAccumulationValue: null, //补贴是否叠加
      AddisAccumulationSelect: [
        { label: "否", value: "0" },
        { label: "是", value: "1" },
      ],
      AddgrantModelValue: null, //发放模式
      AddgrantModelSelect: [
        { label: "循环", value: "1" },
        { label: "单次定量", value: "2" },
      ],
    };
  },
  created() {
    this.AxiosTableList();
  },
  methods: {
    switchchange(item) {
      this.$axios
        .post("/subsidy/plan/updateStrategy", {
          id: item.id,
          status: item.status,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.warning(res.data.msg);
          }
          this.AxiosTableList();
        })
        .catch((error) => {
          this.$message.warning(error.response.data.message);
        });
    },
    inputIsornull() {
      this.IsorNull = null;
      if (this.AddstrategyName == "" || this.AddstrategyName == null) {
        this.AddstrategyName = null;
        this.$message.warning("补贴策略名称不能为空!");
        this.IsorNull = false;
      } else if (this.AddstrategyName.indexOf(" ") !== -1) {
        this.$message.warning("补贴策略名称不能包含空格!");
        this.AddstrategyName = null;
        this.IsorNull = false;
      } else if (this.AddbusinessTypevalue == "" || this.AddbusinessTypevalue == null) {
        this.$message.warning("业务名称不能为空");
        this.IsorNull = false;
      } else if (this.AddgranTypeValue == "" || this.AddgranTypeValue == null) {
        this.$message.warning("补助发放类型不能为空");
        this.IsorNull = false;
      } else if (this.AddsubsidyCycleValue == "" || this.AddsubsidyCycleValue == null) {
        this.$message.warning("补助周期规则不能为空");
        this.IsorNull = false;
      } else if (
        this.AddisAccumulationValue == "" ||
        this.AddisAccumulationValue == null
      ) {
        this.$message.warning("补贴是否叠加不能为空");
        this.IsorNull = false;
      } else if (this.AddgrantModelValue == "" || this.AddgrantModelValue == null) {
        this.$message.warning("发放模式不能为空");
        this.IsorNull = false;
      }
    },
    DialogAdd() {
      this.inputIsornull();
      if (this.IsorNull == false) {
        return;
      } else {
        this.$axios
          .post("/subsidy/plan/addStrategy", {
            strategyName: this.AddstrategyName,
            grantModel: this.AddgrantModelValue,
            isAccumulation: this.AddisAccumulationValue,
            subsidyCycle: this.AddsubsidyCycleValue,
            grantType: this.AddgranTypeValue,
            businessType: this.AddbusinessTypevalue,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            } else {
              this.$message.warning(res.data.msg);
            }
            this.AddDialog = false;
            this.AxiosTableList();
          })
          .catch((error) => {
            this.$message.warning(error.response.data.message);
          });
      }
    },
    AxiosTableList() {
      this.loading = true;
      this.$axios
        .post("/subsidy/plan/strategyList", {
          current: this.CurrentPage,
          size: this.PageSize,
          businessType: this.TypeValue,
          strategyName: this.StrategyName,
        })
        .then((res) => {
          this.tableData = res.data.rows;
          this.loading = false;
        });
    },
    Search() {
      this.AxiosTableList();
    },
    Reset() {
      this.TypeValue = null;
      this.StrategyName = null;
      this.CurrentPage = 1;
      this.AxiosTableList();
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
    },
    handleSizeChange(val) {
      this.PageSize = val;
    },
  },
  activated() {},
};
</script>

<style lang="scss" scoped>
.middle_content {
  padding: 0 19px;
  .filter {
    margin-top: 8px;
    padding: 18px 20px 5px 20px;
    background: #ffffff;
    border-radius: 8px;
    h3 {
      padding-bottom: 10px;
      div {
        font-size: 16px;
        font-family: $font-scme;
        font-weight: 500;
        text-align: left;
        color: #212d33;
        &:last-child {
          font-weight: 400;
        }
        i {
          margin-right: 8px;
        }
      }
      .fr {
        cursor: pointer;
      }
    }
    .filter_enter {
      margin-top: 2px;
      border-top: $border;
      > div {
        margin-right: 300px;
        margin-top: 18px;
      }
      > div:nth-child(3n) {
        margin-right: 0;
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
      margin-top: 20px;
      padding-bottom: 10px;
      button {
        &:hover {
          background: #59b3fd;
        }
        margin: 0 10px;
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
  main {
    table {
      margin-top: 15px;
      width: 100%;
      th {
        background: #f2f9ff;
        font-family: $font-scme;
        color: #364147;
      }
      td,
      th {
        font-size: 14px;
        color: #545454;
        font-family: $font-scre;
        height: 45px;
        line-height: 45px;
        text-align: center;
      }
    }
    ::v-deep .el-pagination {
      padding: 15px 0;
    }
    .top {
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      color: #313c42;
      letter-spacing: 1px;
      border-bottom: $border;
      padding-bottom: 10px;
      text-indent: 10px;
    }
    .block {
      margin: 20px 0 0 auto;
      text-align: center;
      &:hover {
        background: #59b3fd;
      }
      width: 80px;
      height: 33px;
      background: #2d92ff;
      border-radius: 5px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      line-height: 33px;
      color: #ffffff;
      border: 0;
    }
    .adddialog {
      ::v-deep .el-dialog {
        border-radius: 2px;
        width: 756px;
        .el-dialog__header {
          padding: 10px 20px;
          background: #2d92ff;
          border-radius: 2px 2px 0 0;
          .el-dialog__title {
            font-size: 16px;
            font-family: $font-scre;
            color: #ffffff;
            letter-spacing: 1px;
          }
          .el-dialog__close {
            color: white;
          }
        }
        .el-dialog__body {
          padding: 24px 22px;
          li {
            &:nth-of-type(1),
            &:nth-of-type(2) {
              padding-left: 28px;
            }
            margin-top: 25px;
            display: inline-block;
            width: 50%;
            .el-input {
              width: 234px;
            }
          }
          label {
            font-size: 14px;
            margin-right: 10px;
            font-family: $font-scre;
            font-weight: 400;
            color: #4a4a4a;
          }
          .el-input {
            width: 602px;
          }
        }
      }
    }
    margin-top: 20px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 0px 15px 8px rgba(229, 230, 255, 0.5);
    padding: 25px;
  }
}
</style>

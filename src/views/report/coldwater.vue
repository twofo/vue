<template>
  <div class="middle_content clearfix">
    <div class="left_tree">
      <div class="default" @click="whetherglobal">
        <i :class="default_qj == true ? 'active' : ''"></i>
        <span>默认全局</span>
      </div>
      <el-tree
        accordion
        :data="lefttree"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
    <div class="right fr">
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
            <p>报表类型</p>
            <el-select v-model="DayValue" placeholder="请选择">
              <el-option
                v-for="item in DaySelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="time fl">
            <p>日期</p>
            <el-date-picker
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              v-model="ChangeTime"
              :type="
                DayValue == 1
                  ? 'date'
                  : DayValue == 2
                  ? 'month'
                  : DayValue == 3
                  ? 'year'
                  : 'date'
              "
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
          <div class="fl">
            <p>按房间查询</p>
            <el-input clearable v-model="StudentId" placeholder="请输入房间名"></el-input>
          </div>
        </div>
        <div class="info" v-if="filtercheck">
          <button @click="Search">搜索</button>
          <button @click="Reset">重置</button>
        </div>
      </div>
      <div class="main">
        <div class="button">
          <button class="smaillbutton" @click="Search">刷新</button
          ><button class="jshidden">导出</button>
        </div>
        <div class="tabledata">
          <table v-loading="loading" class="tabledata">
            <tr>
              <th>房间号</th>
              <th>位置信息</th>
              <th>水表类型</th>
              <th>
                {{
                  DayValue == 1
                    ? "当日总用量(t)"
                    : DayValue == 2
                    ? "当月总用量(t)"
                    : DayValue == 3
                    ? "当年总用量(t)"
                    : "当日总用量(t)"
                }}
              </th>
              <th>
                {{
                  DayValue == 1
                    ? "当日补贴用量(t)"
                    : DayValue == 2
                    ? "当月补贴用量(t)"
                    : DayValue == 3
                    ? "当年补贴用量(t)"
                    : "当日补贴用量(t)"
                }}
              </th>
              <th>
                {{
                  DayValue == 1
                    ? "当日使用金额"
                    : DayValue == 2
                    ? "当月使用金额"
                    : DayValue == 3
                    ? "当年使用金额"
                    : "当日使用金额"
                }}
              </th>
              <th>
                {{
                  DayValue == 1
                    ? "当日充值金额"
                    : DayValue == 2
                    ? "当月充值金额"
                    : DayValue == 3
                    ? "当年充值金额"
                    : "当日充值金额"
                }}
              </th>
              <th>
                {{
                  DayValue == 1
                    ? "当日充值次数"
                    : DayValue == 2
                    ? "当月充值次数"
                    : DayValue == 3
                    ? "当年充值次数"
                    : "当日充值次数"
                }}
              </th>
              <th>
                {{
                  DayValue == 1
                    ? "当日申请退款金额"
                    : DayValue == 2
                    ? "当月申请退款金额"
                    : DayValue == 3
                    ? "当年申请退款金额"
                    : "当日申请退款金额"
                }}
              </th>
              <th>
                {{
                  DayValue == 1
                    ? "当日已退款金额"
                    : DayValue == 2
                    ? "当月已退款金额"
                    : DayValue == 3
                    ? "当年已退款金额"
                    : "当日已退款金额"
                }}
              </th>
              <th>
                {{
                  DayValue == 1
                    ? "当日退款次数"
                    : DayValue == 2
                    ? "当月退款次数"
                    : DayValue == 3
                    ? "当年退款次数"
                    : "当日退款次数"
                }}
              </th>
              <th>历史充值总额</th>
              <th>历史消费总额</th>
              <th>退款中总额</th>
              <th>已退款总额</th>
              <th>账户余额</th>
              <th>剩余补贴量</th>
            </tr>
            <tr v-for="(item, index) in tableData.records" :key="index">
              <td>{{ item.bodyName || "-" }}</td>
              <td>{{ item.bodyInfo || "-" }}</td>
              <td>{{ item.deviceType || "-" }}</td>
              <td>{{ item.totalUse }}</td>
              <td>{{ item.totalSubsidy }}</td>
              <td>{{ item.useMoney }}</td>
              <td>{{ item.rechargeMoney }}</td>
              <td>{{ item.rechargeTimes }}</td>
              <td>{{ item.applyRefundMoney }}</td>
              <td>{{ item.refundedMoney }}</td>
              <td>{{ item.refundTimes }}</td>
              <td>{{ item.historyRecharge }}</td>
              <td>{{ item.historyConsume }}</td>
              <td>{{ item.totalRefunding }}</td>
              <td>{{ item.totalRefunded }}</td>
              <td>{{ item.bodyBalance }}</td>
              <td>{{ item.remainderSubsidy }}</td>
            </tr>
            <tr v-if="tableData.records !== undefined && tableData.records.length == 0">
              <td colspan="17">暂无数据</td>
            </tr>
            <tr
              class="total"
              v-if="tableData.records !== undefined && tableData.records.length > 0"
            >
              <td colspan="3">总计</td>
              <td>{{ total.totalUse }}</td>
              <td>{{ total.totalSubsidy }}</td>
              <td>{{ total.useMoney }}</td>
              <td>{{ total.rechargeMoney }}</td>
              <td>{{ total.rechargeTimes }}</td>
              <td>{{ total.applyRefundMoney }}</td>
              <td>{{ total.refundedMoney }}</td>
              <td>{{ total.refundTimes }}</td>
              <td>{{ total.historyRecharge }}</td>
              <td>{{ total.historyConsume }}</td>
              <td>{{ total.totalRefunding }}</td>
              <td>{{ total.totalRefunded }}</td>
              <td>{{ total.bodyBalance }}</td>
              <td>{{ total.remainderSubsidy }}</td>
            </tr>
          </table>
        </div>
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "reporthotwater",
  data() {
    return {
      dataid: null,
      layer: null,
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      loading: true,
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      ChangeTime: null, //日期
      filtercheck: true, //筛选showorhide
      DayValue: "1", //时间范围选择
      DaySelect: [
        {
          value: "1",
          label: "日报表",
        },
        {
          value: "2",
          label: "月报表",
        },
        {
          value: "3",
          label: "年报表",
        },
      ],
      StudentId: null, //学号
      tableData: [],
      total: {},
    };
  },
  created() {
    this.AxiosTable();
    this.AxiosTotal();
    this.lddata();
  },
  activated() {
    this.AxiosTable();
    this.AxiosTotal();
    this.lddata();
  },
  methods: {
    AxiosTable() {
      this.loading = true;
      let date, formName;
      if (this.DayValue == 2) {
        date = this.ChangeTime.substring(0, 7);
        formName = date.split("-").join("");
      } else if (this.DayValue == 3) {
        date = this.ChangeTime.substring(0, 4);
      } else if (this.DayValue == 1) {
        date = this.ChangeTime;
        if (this.ChangeTime) {
          formName = this.ChangeTime.substring(0, 7);
          formName = formName.split("-").join("");
        }
      }
      let formType = parseInt(this.DayValue);
      this.$axios
        .post("/bus/report/form", {
          type: 1,
          startDate: date,
          formType,
          size: this.PageSize,
          current: this.CurrentPage,
          username: this.StudentId,
          layer: this.layer,
          areaId: this.dataid,
        })
        .then((res) => {
          this.tableData = res.data.rows;
          this.loading = false;
        });
    },
    AxiosTotal() {
      let formType = parseInt(this.DayValue);
      this.$axios
        .post("/bus/report/getTotal", {
          type: 1,
          startDate: this.ChangeTime,
          formType,
          username: this.StudentId,
          layer: this.layer,
          areaId: this.dataid,
        })
        .then((res) => {
          this.total = res.data.rows;
        });
    },
    Search() {
      this.loading = true;
      this.AxiosTable();
      this.AxiosTotal();
    },
    Reset() {
      this.StudentID = null;
      this.ChangeTime = null;
      this.DayValue = "1";
      this.AxiosTable();
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.AxiosTable();
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.AxiosTable();
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.loading = true;
      this.default_qj = !this.default_qj;
      this.AxiosTable();
      this.AxiosTotal();
    },
    handleNodeClick(data) {
      this.default_qj = false;
      this.loading = true;
      this.currentPage = 1;
      this.dataid = data.id.replace(/[^0-9]/gi, "");
      this.layer = data.layer;
      this.AxiosTable();
      this.AxiosTotal();
    },
    lddata() {
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
        this.lefttree = onelevel;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tabledata {
  margin-top: 7px;
  overflow-x: auto;
  border-collapse: collapse;
  width: 100%;
  .total {
    td {
      &:nth-of-type(2),
      &:nth-of-type(3) {
        z-index: 0;
      }
      color: #2d92ff;
      border-bottom: 0;
    }
  }
  td:first-child,
  th:first-child {
    position: sticky;
    left: 0px;
    z-index: 1;
  }
  td:nth-of-type(2),
  th:nth-of-type(2) {
    position: sticky;
    left: 130px;
    z-index: 1;
  }
  td:nth-of-type(3),
  th:nth-of-type(3) {
    position: sticky;
    left: 260px;
    z-index: 1;
  }
  th {
    position: sticky;
    top: 0px;
    padding: 0;
    background: #f2f9ff;
    height: 45px;
    font-size: 14px;
    font-family: $font-scme;
    font-weight: 500;
    color: #364147;
  }
  th,
  td {
    color: #364147;
    height: 45px;
    font-size: 14px;
    padding: 0;
    padding: 5px;
    text-align: center;
    min-width: 130px;
  }
  td {
    background: white;
    border-bottom: 1px solid #dbdbdb;
  }
}
/deep/ .el-pagination {
  text-align: center;
  padding-top: 15px;
}
.middle_content {
  padding: 0 19px;
  overflow: hidden;
  .right {
    width: 1350px;
  }
  .main {
    padding: 13px 13px 27px 39px;
    margin-top: 19px;
    background: #ffffff;
    border-radius: 8px;
    .button {
      text-align: right;
      button {
        width: 60px;
        height: 30px;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        color: #262626;
        letter-spacing: 1px;
        &:last-child {
          background: #2d92ff;
          color: white;
        }
      }
    }
  }
  .filter {
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
      margin-top: 12px;
      border-top: 1px solid #dbdbdb;
      > div {
        margin-right: 170px;
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
      margin-top: 33px;
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
}
</style>

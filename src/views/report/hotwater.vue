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
          <p>按学号查询</p>
          <el-input clearable v-model="StudentId" placeholder="请输入学号"></el-input>
        </div>
      </div>
      <div class="info" v-if="filtercheck">
        <button
          @click="
            CurrentPage = 1;
            Search();
          "
        >
          搜索
        </button>
        <button @click="Reset">重置</button>
      </div>
    </div>
    <div class="main">
      <div class="button">
        <button class="smaillbutton" @click="Search">刷新</button
        ><button @click="excelimport">导出</button>
        <button @click="createdAxios">更新报表数据</button>
      </div>
      <div class="tabledata">
        <table v-loading="loading" class="tabledata">
          <tr>
            <th>学工号</th>
            <th>用户名</th>
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
            <th
              @click="sorttable('useMoney')"
              :class="
                useMoneynumber == 1
                  ? 'ascending'
                  : useMoneynumber == 2
                  ? 'descending'
                  : ''
              "
            >
              {{
                DayValue == 1
                  ? "当日使用金额"
                  : DayValue == 2
                  ? "当月使用金额"
                  : DayValue == 3
                  ? "当年使用金额"
                  : "当日使用金额"
              }}<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th
              @click="sorttable('rechargeMoney')"
              :class="
                rechargeMoneynumber == 1
                  ? 'ascending'
                  : rechargeMoneynumber == 2
                  ? 'descending'
                  : ''
              "
            >
              {{
                DayValue == 1
                  ? "当日充值金额"
                  : DayValue == 2
                  ? "当月充值金额"
                  : DayValue == 3
                  ? "当年充值金额"
                  : "当日充值金额"
              }}<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
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
            <th
              @click="sorttable('applyRefundMoney')"
              :class="
                applyRefundMoneynumber == 1
                  ? 'ascending'
                  : applyRefundMoneynumber == 2
                  ? 'descending'
                  : ''
              "
            >
              {{
                DayValue == 1
                  ? "当日申请退款金额"
                  : DayValue == 2
                  ? "当月申请退款金额"
                  : DayValue == 3
                  ? "当年申请退款金额"
                  : "当日申请退款金额"
              }}<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th
              @click="sorttable('refundedMoney')"
              :class="
                refundedMoneynumber == 1
                  ? 'ascending'
                  : refundedMoneynumber == 2
                  ? 'descending'
                  : ''
              "
            >
              {{
                DayValue == 1
                  ? "当日已退款金额"
                  : DayValue == 2
                  ? "当月已退款金额"
                  : DayValue == 3
                  ? "当年已退款金额"
                  : "当日已退款金额"
              }}<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
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
            <th
              @click="sorttable('historyRecharge')"
              :class="
                historyRechargenumber == 1
                  ? 'ascending'
                  : historyRechargenumber == 2
                  ? 'descending'
                  : ''
              "
            >
              历史充值总额<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th
              @click="sorttable('historyConsume')"
              :class="
                historyConsumenumber == 1
                  ? 'ascending'
                  : historyConsumenumber == 2
                  ? 'descending'
                  : ''
              "
            >
              历史消费总额<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th
              @click="sorttable('totalRefunding')"
              :class="
                totalRefundingnumber == 1
                  ? 'ascending'
                  : totalRefundingnumber == 2
                  ? 'descending'
                  : ''
              "
            >
              退款中总额<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th
              @click="sorttable('totalRefunded')"
              :class="
                totalRefundednumber == 1
                  ? 'ascending'
                  : totalRefundednumber == 2
                  ? 'descending'
                  : ''
              "
            >
              已退款总额<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th
              @click="sorttable('bodyBalance')"
              :class="
                bodyBalancenumber == 1
                  ? 'ascending'
                  : bodyBalancenumber == 2
                  ? 'descending'
                  : ''
              "
            >
              账户余额<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th>剩余补贴量</th>
          </tr>
          <template
            v-if="tableData.records !== undefined && tableData.records.length > 0"
          >
            <tr v-for="(item, index) in tableData.records" :key="index">
              <td>{{ item.bodyName || "-" }}</td>
              <td>{{ item.bodyInfo || "-" }}</td>
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
            </tr></template
          >
          <tr v-else>
            <td colspan="16">暂无数据</td>
          </tr>
          <tr
            class="total"
            v-if="tableData.records !== undefined && tableData.records.length > 0"
          >
            <td colspan="2">总计</td>
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
</template>

<script>
import utils from "@/utils/utils";
import excel from "@/utils/methods.js";
import { sortmixin } from "@/mixin/sort.js";
import domMessage from "@/utils/messageOnce";
const messageOnce = new domMessage();
export default {
  name: "reporthotwater",
  mixins: [sortmixin],
  data() {
    return {
      loading: true,
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      pickerOptions: {
        disabledDate(time) {
           return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      ChangeTime: "", //日期
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
      useMoneynumber: 0,
      rechargeMoneynumber: 0,
      applyRefundMoneynumber: 0,
      refundedMoneynumber: 0,
      historyRechargenumber: 0,
      historyConsumenumber: 0,
      totalRefundingnumber: 0,
      totalRefundednumber: 0,
      bodyBalancenumber: 0,
    };
  },
  activated() {
    this.getdatatime();
    this.AxiosTable();
  },
  created() {
    this.getdatatime();
    this.AxiosTable();
  },
  methods: {
    switchcheck(name) {
      if (name == "useMoney") {
        this.useMoneynumber = this.sortnumber;
        [
          this.rechargeMoneynumber,
          this.applyRefundMoneynumber,
          this.refundedMoneynumber,
          this.historyRechargenumber,
          this.historyConsumenumber,
          this.totalRefundingnumber,
          this.totalRefundednumber,
          this.bodyBalancenumber,
        ] = [0, 0, 0, 0, 0, 0, 0, 0];
      } else if (name == "rechargeMoney") {
        this.rechargeMoneynumber = this.sortnumber;
        [
          this.useMoneynumber,
          this.applyRefundMoneynumber,
          this.refundedMoneynumber,
          this.historyRechargenumber,
          this.historyConsumenumber,
          this.totalRefundingnumber,
          this.totalRefundednumber,
          this.bodyBalancenumber,
        ] = [0, 0, 0, 0, 0, 0, 0, 0];
      } else if (name == "applyRefundMoney") {
        this.applyRefundMoneynumber = this.sortnumber;
        [
          this.useMoneynumber,
          this.rechargeMoneynumber,
          this.refundedMoneynumber,
          this.historyRechargenumber,
          this.historyConsumenumber,
          this.totalRefundingnumber,
          this.totalRefundednumber,
          this.bodyBalancenumber,
        ] = [0, 0, 0, 0, 0, 0, 0, 0];
      } else if (name == "refundedMoney") {
        this.refundedMoneynumber = this.sortnumber;
        [
          this.useMoneynumber,
          this.rechargeMoneynumber,
          this.applyRefundMoneynumber,
          this.historyRechargenumber,
          this.historyConsumenumber,
          this.totalRefundingnumber,
          this.totalRefundednumber,
          this.bodyBalancenumber,
        ] = [0, 0, 0, 0, 0, 0, 0, 0];
      } else if (name == "historyRecharge") {
        this.historyRechargenumber = this.sortnumber;
        [
          this.useMoneynumber,
          this.rechargeMoneynumber,
          this.applyRefundMoneynumber,
          this.refundedMoneynumber,
          this.historyConsumenumber,
          this.totalRefundingnumber,
          this.totalRefundednumber,
          this.bodyBalancenumber,
        ] = [0, 0, 0, 0, 0, 0, 0, 0];
      } else if (name == "historyConsume") {
        this.historyConsumenumber = this.sortnumber;
        [
          this.useMoneynumber,
          this.rechargeMoneynumber,
          this.applyRefundMoneynumber,
          this.refundedMoneynumber,
          this.historyRechargenumber,
          this.totalRefundingnumber,
          this.totalRefundednumber,
          this.bodyBalancenumber,
        ] = [0, 0, 0, 0, 0, 0, 0, 0];
      } else if (name == "totalRefunding") {
        this.totalRefundingnumber = this.sortnumber;
        [
          this.useMoneynumber,
          this.rechargeMoneynumber,
          this.applyRefundMoneynumber,
          this.refundedMoneynumber,
          this.historyRechargenumber,
          this.historyConsumenumber,
          this.totalRefundednumber,
          this.bodyBalancenumber,
        ] = [0, 0, 0, 0, 0, 0, 0, 0];
      } else if (name == "totalRefunded") {
        this.totalRefundednumber = this.sortnumber;
        [
          this.useMoneynumber,
          this.rechargeMoneynumber,
          this.applyRefundMoneynumber,
          this.refundedMoneynumber,
          this.historyRechargenumber,
          this.historyConsumenumber,
          this.totalRefundingnumber,
          this.bodyBalancenumber,
        ] = [0, 0, 0, 0, 0, 0, 0, 0];
      } else if (name == "bodyBalance") {
        this.bodyBalancenumber = this.sortnumber;
        [
          this.useMoneynumber,
          this.rechargeMoneynumber,
          this.applyRefundMoneynumber,
          this.refundedMoneynumber,
          this.historyRechargenumber,
          this.historyConsumenumber,
          this.totalRefundingnumber,
          this.totalRefundednumber,
        ] = [0, 0, 0, 0, 0, 0, 0, 0];
      }
    },
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name).then((res) => {
        this.tableData = res.data.rows;
        this.switchcheck(name);
        this.loading = false;
      });
    },
    excelimport() {
      let [url, text] = ["/export/reportForm/hotWaterReportForm", "热水报表数据"];
      let data = this.AxiosParams;
      this.$delete(data, "current");
      this.$delete(data, "size");
      excel.importexcel(url, data, text);
    },
    createdAxios() {
      this.$message.success("正在生成最新报表数据,请稍等!");
      let url = "/bus/report/buildData";
      let startDate, formName;
      if (this.DayValue == 2) {
        if (this.ChangeTime) {
          startDate = this.ChangeTime.substring(0, 7);
          formName = startDate.split("-").join("");
        } else {
          startDate = localStorage.getItem("thismonth").substring(0, 7);
          formName = startDate.split("-").join("");
        }
      } else if (this.DayValue == 3) {
        if (this.ChangeTime) {
          startDate = this.ChangeTime.substring(0, 4);
          formName = "";
        } else {
          startDate = localStorage.getItem("thismonth").substring(0, 4);
          formName = "";
        }
      } else if (this.DayValue == 1) {
        startDate = this.ChangeTime;
        if (this.ChangeTime) {
          formName = this.ChangeTime.substring(0, 7);
          formName = formName.split("-").join("");
        }
      }
      let formType = parseInt(this.DayValue);
      let params = { startDate, formType, formName };
      this.$axios
        .post(url, params, { timeout: 0 })
        .then((res) => {})
        .catch((error) => {
          return messageOnce.warning(error.response.data.message);
        });
    },
    getdatatime() {
      const today = new Date();
      const yesterday = new Date(today.setTime(today.getTime()));
      this.ChangeTime = utils.Timestandard(yesterday);
    },
    AxiosTable() {
      this.loading = true;
      let date, formName;
      if (this.DayValue == 2) {
        if (this.ChangeTime) {
          date = this.ChangeTime.substring(0, 7);
          formName = date.split("-").join("");
        } else {
          date = localStorage.getItem("thismonth").substring(0, 7);
          formName = date.split("-").join("");
        }
      } else if (this.DayValue == 3) {
        if (this.ChangeTime) {
          date = this.ChangeTime.substring(0, 4);
        } else {
          date = localStorage.getItem("thismonth").substring(0, 4);
        }
      } else if (this.DayValue == 1) {
        date = this.ChangeTime;
        if (this.ChangeTime) {
          formName = this.ChangeTime.substring(0, 7);
          formName = formName.split("-").join("");
        }
      }
      let formType = parseInt(this.DayValue);
      this.AxiosParams = {
        type: 3,
        startDate: date,
        formType,
        size: this.PageSize,
        current: this.CurrentPage,
        formName: formName,
        username: this.StudentId,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/bus/report/form";
      this.$axios
        .post(this.SortUrl, this.AxiosParams)
        .then((res) => {
          this.tableData = res.data.rows;
          this.loading = false;
          if (this.tableData.records.length == 0) {
            return messageOnce.success("当前暂未生成数据,请点击生成报表数据按钮!");
          }
        })
        .catch((error) => {
          this.loading = false;
          this.tableData = {};
          messageOnce.warning(error.response.data.message);
        });
      this.$axios
        .post("/bus/report/getTotal", {
          type: 3,
          startDate: date,
          formType,
          formName,
          username: this.StudentId,
        })
        .then((res) => {
          this.total = res.data.rows;
        })
        .catch((error) => {
          return messageOnce.warning(error.response.data.message);
        });
    },
    Search() {
      this.AxiosTable();
    },
    Reset() {
      this.ChangeTime = null;
      this.StudentId = null;
      this.CurrentPage = 1;
      this.DayValue = "1";
      this.getdatatime();
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
    left: 150px;
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
    min-width: 150px;
  }
  td {
    background: white;
    border-bottom: 1px solid #dbdbdb;
  }
}
/deep/ .el-pagination {
  text-align: center;
  padding: 15px 0;
}
.middle_content {
  padding: 0 19px;
  .main {
    padding: 13px 13px 27px 39px;
    margin-top: 19px;
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

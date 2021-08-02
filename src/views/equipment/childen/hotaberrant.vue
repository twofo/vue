<template>
  <div class="middle_content">
    <ul class="header">
      <li
        @click="
          CurrentPage = 1;
          headernumber = index;
          Reset();
          search();
        "
        :class="headernumber == index ? 'active' : ''"
        v-for="(item, index) in header"
        :key="index"
      >
        {{ item }}
      </li>
    </ul>
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
        <div class="fl">
          <p>按处理状态查询</p>
          <el-select clearable v-model="dealwithvalue" placeholder="请选择">
            <el-option
              v-for="item in dealwithselect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="fl" v-if="headernumber == 2">
          <p>按姓名/学号查询</p>
          <el-input
            clearable
            v-model="username"
            placeholder="请输入学生姓名或学号"
          ></el-input>
        </div>
        <div class="fl">
          <p>按设备编号查询</p>
          <el-input
            clearable
            v-model="devicecode"
            placeholder="请输入设备编号"
          ></el-input>
        </div>
        <div class="sjfw fl">
          <p>时间范围</p>
          <el-select
            clearable
            v-model="sjfwvalue"
            placeholder="请选择"
            @change="iftimedisabled()"
          >
            <el-option
              v-for="item in sjfwselect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="zdy_sjfw fl">
          <p>自定义时间范围</p>
          <el-date-picker
            v-model="zdystarttime"
            :picker-options="pickerOptions"
            type="date"
            value-format="yyyy-MM-dd"
            @change="
              test();
              iftimedisabled();
            "
            placeholder="选择开始时间"
          ></el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="zdyendtime"
            type="date"
            @change="
              test();
              iftimedisabled();
            "
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间"
            :picker-options="pickerOptions2"
            :disabled="zdystarttime == null"
          ></el-date-picker>
        </div>
      </div>
      <div class="info" v-if="filtercheck">
        <button
          @click="
            CurrentPage = 1;
            search();
          "
        >
          搜索
        </button>
        <button @click="Reset">重置</button>
      </div>
    </div>
    <main>
      <h4 class="clearfix" v-if="headernumber !== 1">
        水量总计(吨):<span>{{ watertotal }}</span>
      </h4>
      <div class="button">
        <button @click="search">刷新</button>
        <button @click="exportimport">导出列表</button>
      </div>
      <el-table v-loading="loading" :data="TableData.records" style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column label="卡号" v-if="headernumber == 0">
          <template slot-scope="item">
            {{ item.row.cardCode || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" v-if="headernumber == 2">
          <template slot-scope="item">
            {{ item.row.name || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="学号" v-if="headernumber == 2">
          <template slot-scope="item">
            {{ item.row.username || "-" }}
          </template>
        </el-table-column>
        <el-table-column v-if="headernumber == 2">
          <div
            slot="header"
            slot-scope="item"
            @click="sorttable('money')"
            :class="moneynumber == 1 ? 'ascending' : moneynumber == 2 ? 'descending' : ''"
          >
            <span>金额(元)</span
            ><span class="tablesort">
              <i class="ascending ascendingcheck"></i>
              <i class="descending descendingcheck"></i>
            </span>
          </div>
          <template slot-scope="item">
            {{ item.row.money || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="设备编号">
          <template slot-scope="item">
            {{ item.row.deviceCode || "-" }}
          </template>
        </el-table-column>
        <el-table-column v-if="headernumber == 1" label="设备区域">
          <template slot-scope="item">
            {{ item.row.roomInfo || "-" }}
          </template>
        </el-table-column>
        <el-table-column v-if="headernumber !== 1" label="用水区域">
          <template slot-scope="item">
            {{ item.row.roomInfo || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="上次水量上报" v-if="headernumber == 1">
          <template slot-scope="item">
            {{ item.row.lastReportTime || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="告警时间" v-if="headernumber == 1">
          <template slot-scope="item">
            {{ item.row.alarmTime || "-" }}
          </template>
        </el-table-column>
        <el-table-column v-if="headernumber !== 1" prop="useWater">
          <div
            slot="header"
            slot-scope="item"
            @click="sorttable('useWater')"
            :class="
              useWaternumber == 1 ? 'ascending' : useWaternumber == 2 ? 'descending' : ''
            "
          >
            <span>用水量(升)</span
            ><span class="tablesort">
              <i class="ascending ascendingcheck"></i>
              <i class="descending descendingcheck"></i>
            </span>
          </div>
        </el-table-column>
        <el-table-column v-if="headernumber !== 1" prop="useStartTime">
          <div
            slot="header"
            slot-scope="item"
            @click="sorttable('useStartTime')"
            :class="
              useStartTimenumber == 1
                ? 'ascending'
                : useStartTimenumber == 2
                ? 'descending'
                : ''
            "
          >
            <span>用水开始时间</span
            ><span class="tablesort">
              <i class="ascending ascendingcheck"></i>
              <i class="descending descendingcheck"></i>
            </span>
          </div>
        </el-table-column>
        <el-table-column v-if="headernumber !== 1" prop="useEndTime">
          <div
            slot="header"
            slot-scope="item"
            @click="sorttable('useEndTime')"
            :class="
              useEndTimenumber == 1
                ? 'ascending'
                : useEndTimenumber == 2
                ? 'descending'
                : ''
            "
          >
            <span>用水结束时间</span>
            <span class="tablesort">
              <i class="ascending ascendingcheck"></i>
              <i class="descending descendingcheck"></i>
            </span>
          </div>
        </el-table-column>
        <el-table-column v-if="headernumber !== 1" label="用水时长">
          <template slot-scope="item">
            {{ item.row.useTime || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="处理状态">
          <template slot-scope="scope">
            <i
              :class="[
                scope.row.status == '0'
                  ? 'bgred'
                  : scope.row.status == '1'
                  ? 'bggreen'
                  : scope.row.status == '2'
                  ? 'bgblue'
                  : scope.row.status == '3'
                  ? 'bggray'
                  : '',
                'i',
              ]"
            ></i>
            <span>{{
              scope.row.status == "0"
                ? "未处理"
                : scope.row.status == "1"
                ? "正常"
                : scope.row.status == "2"
                ? headernumber == 2
                  ? "已退款"
                  : "已处理"
                : scope.row.status == "3"
                ? "待退款"
                : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              v-if="scope.row.status == 0"
              class="blue"
              @click="
                refundordealwith = 1;
                statusclick(scope.row);
              "
              >处理</span
            >
            <span
              class="blue"
              @click="
                refundordealwith = 2;
                statusclick(scope.row);
              "
              v-if="scope.row.status == 3 && scope.row.canRefund == 1"
              >退款</span
            >
          </template>
        </el-table-column> </el-table
      ><el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TableData.total"
      >
      </el-pagination>
      <el-dialog title="系统提示" :visible.sync="systemdialog" center v-if="dialogdata">
        <div class="ffk" v-if="headernumber == 0">
          <img src="@/assets/images/system/zj.png" alt="" />
          <span>
            是否已处理设备编号<i>{{ dialogdata.deviceCode }}</i
            >非法卡异常？
          </span>
        </div>
        <div class="ffk" v-if="headernumber == 1">
          <img src="@/assets/images/system/zj.png" alt="" />
          <span>
            设备编号<i>{{ dialogdata.deviceCode }}</i
            >低水量异常处理结果
          </span>
        </div>
        <div class="ffk" v-if="headernumber == 2 && refundordealwith !== 2">
          <img src="@/assets/images/system/zj.png" alt="" />
          <span>
            设备编号<i>{{ dialogdata.deviceCode }}</i
            >异常用水处理结果
          </span>
        </div>
        <div class="ffk" v-if="headernumber == 2 && refundordealwith == 2">
          <img src="@/assets/images/data_management/money.svg" alt="" />
          <span>是否对该条异常用水记录进行退款？</span>
        </div>
        <el-select
          v-if="headernumber !== 0 && refundordealwith !== 2"
          v-model="dslvalue"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in dslselect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="dialogrefundordealwith()"
            v-preventReClick="2000"
            >{{ headernumber == 0 ? "处 理" : "确 定" }}</el-button
          >
          <el-button @click="systemdialog = false" v-preventReClick="2000"
            >取 消</el-button
          >
        </span>
      </el-dialog>
    </main>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
import excel from "@/utils/methods.js";
export default {
  name: "hotaberrant",
  mixins: [sortmixin],
  data() {
    return {
      refundordealwith: 0,
      dialogdata: null,
      watertotal: 0,
      timecheck: 0,
      loading: false,
      dslvalue: null,
      dslselect: [
        { value: "1", label: "设备正常" },
        { value: "2", label: "已处理" },
      ],
      systemdialog: false,
      CurrentPage: 1,
      PageSizes: [10, 20, , 30, 50],
      PageSize: 10,
      TableData: {},
      dealwithvalue: null,
      dealwithselect: [
        { value: "0", label: "未处理" },
        { value: "1", label: "正常" },
        { value: "2", label: "已处理" },
        { value: "3", label: "待退款" },
      ],
      username: null,
      test() {
        if (this.zdystarttime == null) {
          this.zdyendtime = null;
        }
        if (this.zdystarttime != null || this.zdyendtime != null) {
          this.sjfwvalue = null;
        }
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      pickerOptions2: {
        disabledDate: (time) => {
          return (
            time.getTime() > Date.now() - 8.64e6 ||
            time.getTime() <
              new Date(this.zdystarttime).getTime() - 1 * 24 * 60 * 60 * 1000
          );
        },
      },
      zdystarttime: null,
      zdyendtime: null,
      sjfwselect: [
        {
          value: "0",
          label: "本月",
        },
        {
          value: "1",
          label: "上月",
        },
        {
          value: "2",
          label: "上季度",
        },
      ],
      sjfwvalue: null,
      devicecode: null, //设备编号
      filtercheck: true, //筛选showorhide
      headernumber: 0,
      header: ["非法卡", "低水量", "异常用水"],
      useWaternumber: 0,
      useStartTimenumber: 0,
      useEndTimenumber: 0,
      moneynumber: 0,
    };
  },
  created() {
    this.search();
  },
  activated() {},
  methods: {
    exportimport() {
      let url = "/export/reportForm/hotWaterErrorWater";
      let text =
        this.headernumber == 0
          ? "非法卡数据"
          : this.headernumber == 1
          ? "低水量数据"
          : this.headernumber == 2
          ? "异常用水数据"
          : "";
      let data = this.AxiosParams;
      this.$delete(data, "size");
      this.$delete(data, "current");
      excel.importexcel(url, data, text);
    },
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name)
        .then((res) => {
          this.TableData = res.data.rows;
          if (name == "useWater") {
            this.useWaternumber = this.sortnumber;
            [this.useStartTimenumber, this.useEndTimenumber, this.moneynumber] = [
              0,
              0,
              0,
            ];
          } else if (name == "useStartTime") {
            this.useStartTimenumber = this.sortnumber;
            [this.useWaternumberthis.useEndTimenumber, this.moneynumber] = [0, 0, 0];
          } else if (name == "useEndTime") {
            [this.useWaternumber, this.useStartTimenumber, this.moneynumber] = [0, 0, 0];
            this.useEndTimenumber = this.sortnumber;
          } else if (name == "money") {
            this.moneynumber = this.sortnumber;
            [this.useWaternumber, this.useStartTimenumber, this.useEndTimenumber] = [
              0,
              0,
              0,
            ];
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dialogrefundordealwith() {
      let status = parseInt(this.dslvalue);
      if (this.headernumber == 2 && this.refundordealwith == 2) {
        this.Axiosrefund();
      } else if (this.headernumber == 0) {
        this.AxiosUpdateStatus(2);
      } else if (this.headernumber == 1) {
        this.AxiosUpdateStatus(status);
      } else if (this.headernumber == 2 && this.refundordealwith !== 2) {
        this.AxiosUpdateStatus(status);
      }
    },
    statusclick(index) {
      this.dialogdata = index;
      this.systemdialog = true;
    },
    AxiosUpdateStatus(status) {
      this.$axios
        .post("/iot/error/updateStatus", {
          id: this.dialogdata.id,
          errorType: this.headernumber,
          status,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.warning(res.data.msg);
          }
          this.systemdialog = false;
          this.search();
          this.dslvalue = null;
        });
    },
    Axiosrefund() {
      this.$axios
        .post("/iot/error/refund", {
          id: this.dialogdata.id,
          money: this.dialogdata.money * 100,
          status: this.dialogdata.status,
          userId: this.dialogdata.userId,
        })
        .then((res) => {
          this.systemdialog = false;
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.search();
          } else {
            this.$message.warning(res.data.msg);
            this.search();
          }
        });
    },
    search() {
      if (this.timecheck == 1) {
        if (this.sjfwvalue == 0) {
          this.AxiosTable(
            localStorage.getItem("thismonthstart"),
            localStorage.getItem("thismonth")
          );
          this.AxiosTotal(
            localStorage.getItem("thismonthstart"),
            localStorage.getItem("thismonth")
          );
        } else if (this.sjfwvalue == 1) {
          this.AxiosTable(
            localStorage.getItem("lastmonthstart"),
            localStorage.getItem("lastmonthend")
          );
          this.AxiosTotal(
            localStorage.getItem("lastmonthstart"),
            localStorage.getItem("lastmonthend")
          );
        } else if (this.sjfwvalue == 2) {
          this.AxiosTable(
            localStorage.getItem("lastquarterstart"),
            localStorage.getItem("lastquarterend")
          );
          this.AxiosTotal(
            localStorage.getItem("lastquarterstart"),
            localStorage.getItem("lastquarterend")
          );
        }
      } else if (this.timecheck == 2) {
        this.AxiosTable(this.zdystarttime, this.zdyendtime);
        this.AxiosTotal(this.zdystarttime, this.zdyendtime);
      } else {
        this.AxiosTable(null, null);
        this.AxiosTotal(null, null);
      }
    },
    AxiosTotal(startDate, endDate) {
      this.$axios
        .post("/iot/error/useWaterTotal", {
          errorType: this.headernumber,
          startDate,
          endDate,
          deviceCode: this.devicecode,
          status: this.dealwithvalue,
          username: this.username,
        })
        .then((res) => {
          this.watertotal = res.data.rows.useWater;
        });
    },
    AxiosTable(startDate, endDate) {
      this.loading = true;
      this.AxiosParams = {
        current: this.CurrentPage,
        size: this.PageSize,
        errorType: this.headernumber,
        startDate,
        endDate,
        deviceCode: this.devicecode,
        status: this.dealwithvalue,
        username: this.username,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/iot/error/useWaterList";
      this.$axios.post("/iot/error/useWaterList", this.AxiosParams).then((res) => {
        this.TableData = res.data.rows;
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.search();
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.search();
    },
    Reset() {
      this.dealwithvalue = null;
      this.devicecode = null;
      [
        this.sortnumber,
        this.useWaternumber,
        this.useStartTimenumber,
        this.useEndTimenumber,
        this.moneynumber,
      ] = [0, 0, 0, 0, 0];
      this.sjfwvalue = null;
      this.zdystarttime = null;
      this.timecheck = 0;
      this.zdyendtime = null;
      this.username = null;
      this.search();
    },
    iftimedisabled() {
      if (this.sjfwvalue == "") {
        this.sjfwvalue = null;
      }
      if (this.sjfwvalue != null) {
        this.zdyendtime = null;
        this.zdystarttime = null;
      }
      if (
        this.sjfwvalue == null &&
        this.zdyendtime == null &&
        this.zdystarttime == null
      ) {
        this.timecheck = 0;
      } else if (this.sjfwvalue != null) {
        this.timecheck = 1;
      } else {
        this.timecheck = 2;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  ::v-deep .el-dialog {
    width: 360px;
    border-radius: 8px 8px 0 0;
    .el-dialog__header {
      .el-dialog__title {
        font-size: 16px;
        font-family: $font-scre;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .el-dialog__close {
        color: white;
      }
      background: $dialogtopbg;
      border-radius: 8px 8px 0 0;
    }
    .el-dialog__body {
      padding: 25px 25px 20px 25px;
      .el-select {
        margin: 10px 0 0 45px;
      }
      .ffk {
        text-align: center;
        img {
          width: 24px;
        }
        span {
          margin-left: 12px;
          font-size: 14px;
          vertical-align: middle;
          font-family: $font-scre;
          font-weight: 400;
          color: #4a4a4a;
          letter-spacing: 1px;
          i {
            font-style: normal;
          }
        }
      }
    }
  }
  ::v-deep .el-table::before {
    height: 0;
  }
  ::v-deep .el-pagination {
    padding: 15px 0;
  }
  ::v-deep .el-table {
    margin-top: 10px;
    th {
      font-family: $font-scme;
      background: $tablebg;
      color: #364147;
    }
    .el-table__header {
      background: $tablebg;
    }
    .el-table__header,
    .el-table__body {
      padding-left: 36px;
    }
    .blue {
      color: $fontblue;
      cursor: pointer;
    }
    th,
    td {
      border-bottom: 0;
      font-size: 14px;
      height: 45px;
      line-height: 45px;
    }
    td {
      font-family: $font-scre;
      color: #212d33;
      span {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  margin-top: 15px;
  padding: 18px 20px;
  background: #ffffff;
  border-radius: 8px;
  h4 {
    span {
      font-size: 24px;
      display: inline-block;
      padding-left: 5px;
      font-family: $font-scse;
      font-weight: 600;
      color: #000000;
    }
    font-size: 16px;
    padding-bottom: 8px;
    font-family: $font-scme;
    font-weight: 500;
    color: #212d33;
    border-bottom: $border;
  }
}
.middle_content {
  padding: 0 19px;
  .filter {
    margin-top: 8px;
    padding: 18px 20px;
    background: #ffffff;
    border-radius: 8px;
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
      padding-bottom: 10px;
      border-bottom: $border;
    }
    .filter_enter {
      margin-top: 12px;
      > div {
        margin-right: 307px;
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
        p {
          font-size: 14px;
          font-family: $font-scre;
          font-weight: 400;
          color: #212d33;
          margin-bottom: 10px;
        }
      }
    }
  }
  .header {
    background: white;
    height: 45px;
    border-radius: 10px;
    li {
      &:hover {
        color: #2c9dff;
      }
      &:first-child {
        border-radius: 8px 0 0 8px;
      }
      cursor: pointer;
      display: inline-block;
      width: 120px;
      text-align: center;
      height: 100%;
      line-height: 45px;
      font-size: 16px;
      font-family: $font-scre;
      font-weight: 400;
      color: #212d33;
      &.active {
        background: $bg-color;
        font-family: $font-scme;
        font-weight: 500;
        color: #2c9dff;
      }
    }
  }
}
</style>

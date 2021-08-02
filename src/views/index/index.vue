<template>
  <div class="middle_content">
    <div class="left">
      <div class="top clearfix">
        <span>金额统计</span>
        <el-select class="fr" @change="SelectChange" v-model="TopCheck">
          <el-option
            v-for="item in TopCheckSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <ul>
        <li @click="Jumpincome">
          <img src="../../assets/images/index/2-1.png" alt="" />
          <div>
            <span>{{ Total.income || 0 }}</span>
            <span>本月总收入(¥)</span>
          </div>
        </li>
        <li @click="Jumpbalance">
          <img src="../../assets/images/index/4-1.svg" alt="" />
          <div>
            <span>{{ Total.balance || 0 }}</span>
            <span>余额(¥)</span>
          </div>
        </li>
        <li @click="Jumpconsume">
          <img src="../../assets/images/index/8.svg" alt="" />
          <div>
            <span>{{ Total.consume || 0 }}</span>
            <span>本月总消费(¥)</span>
          </div>
        </li>
        <li @click="JumpmodifyTimes">
          <img src="../../assets/images/index/9.svg" alt="" />
          <div>
            <span>{{ Total.modifyTimes || 0 }}</span>
            <span>本月手工纠正次数</span>
          </div>
        </li>
        <li @click="Jumprefund">
          <img src="../../assets/images/index/2-2.svg" alt="" />
          <div>
            <span>{{ Total.refund || 0 }}</span>
            <span>本月总退款(¥)</span>
          </div>
        </li>
      </ul>
      <h4>用量统计</h4>
      <ul>
        <li @click="JumptotalUse">
          <img src="../../assets/images/index/4-1.svg" alt="" />
          <div>
            <span>{{ Total.totalUse || 0 }}</span>
            <span>{{
              TopCheck == 0 || TopCheck == 1
                ? "本月总用水量(吨)"
                : TopCheck == 2
                ? "本月总用电量(度)"
                : ""
            }}</span>
          </div>
        </li>
        <li @click="JumptotalUse">
          <img src="../../assets/images/index/3.svg" alt="" />
          <div>
            <span>{{ Total.averageUse || 0 }}</span>
            <span>{{
              TopCheck == 0 || TopCheck == 1
                ? "本月平均用水量(吨)"
                : TopCheck == 2
                ? "本月平均用电量(吨)"
                : ""
            }}</span>
          </div>
        </li>
        <li @click="JumptotalUse">
          <img src="../../assets/images/index/3-1.svg" alt="" />
          <div>
            <span>{{ Total.dayLowUse || 0 }}</span>
            <span>{{
              TopCheck == 0 || TopCheck == 1
                ? "单日最低用水量(吨)"
                : TopCheck == 2
                ? "单日最低用电量(度)"
                : ""
            }}</span>
          </div>
        </li>
        <li @click="JumptotalUse">
          <img src="../../assets/images/index/3-2.svg" alt="" />
          <div>
            <span>{{ Total.dayHighUse || 0 }}</span>
            <span>{{
              TopCheck == 0 || TopCheck == 1
                ? "单日最高用水量(吨)"
                : TopCheck == 2
                ? "单日最高用电量(度)"
                : ""
            }}</span>
          </div>
        </li>
        <li @click="JumptotalUse">
          <img src="../../assets/images/index/1-1.svg" alt="" />
          <div>
            <span>{{ Total.unitLowUse || 0 }}</span>
            <span>{{
              TopCheck == 0 || TopCheck == 1
                ? "单位最低用水量(吨)"
                : TopCheck == 2
                ? "单位最低用电量(度)"
                : ""
            }}</span>
          </div>
        </li>
        <li @click="JumptotalUse">
          <img src="../../assets/images/index/1-2.svg" alt="" />
          <div>
            <span>{{ Total.unitHighUse || 0 }}</span>
            <span>{{
              TopCheck == 0 || TopCheck == 1
                ? "单位最高用水量(吨)"
                : TopCheck == 2
                ? "单位最高用电量(吨)"
                : ""
            }}</span>
          </div>
        </li>
        <li @click="JumptotalUse">
          <img src="../../assets/images/index/5.svg" alt="" />
          <div>
            <span>{{ Total.unitAverageUse || 0 }}</span>
            <span>{{
              TopCheck == 0 || TopCheck == 1
                ? "单位平均用水量(吨)"
                : TopCheck == 2
                ? "单位平均用电量(度)"
                : ""
            }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="right">
      <div class="number">
        <h4>设备信息</h4>
        <ul>
          <li>
            <div>设备总数</div>
            <div>{{ deviceTotal.deviceNum || 0 }}</div>
          </li>
          <li>
            <div>在线设备数</div>
            <div>{{ deviceTotal.isOnline || 0 }}</div>
          </li>
          <li>
            <div>离线设备数</div>
            <div>{{ deviceTotal.isOffline || 0 }}</div>
          </li>
          <li>
            <div>报警设备数</div>
            <div>{{ deviceTotal.alarmNum || 0 }}</div>
          </li>
        </ul>
      </div>
      <div class="alarm">
        <h4>报警信息</h4>
        <table v-loading="loading">
          <tr>
            <th>类型</th>
            <th>设备号</th>
            <th>时间</th>
            <th>内容</th>
            <th>级别</th>
          </tr>
          <template v-if="Alarm.records !== undefined && Alarm.records.length > 0">
            <router-link
              tag="tr"
              @click.native="jumprouter()"
              to="/query_stats/alertinfo"
              v-for="(item, index) in Alarm.records"
              :key="index"
            >
              <td>{{ item.type }}</td>
              <td>{{ item.deviceCode }}</td>
              <td>{{ item.alarmTime }}</td>
              <td>{{ item.alarmInfo }}</td>
              <td>
                <i
                  class="i"
                  :class="
                    item.alarmLevel == 1
                      ? 'bgblue'
                      : item.alarmLevel == 2
                      ? 'bgyellow'
                      : item.alarmLevel == 3
                      ? 'bgred'
                      : ''
                  "
                ></i
                ><span>{{
                  item.alarmLevel == 1
                    ? "提示"
                    : item.alarmLevel == 2
                    ? "一般"
                    : item.alarmLevel == 3
                    ? "紧急"
                    : "-"
                }}</span>
              </td>
            </router-link>
          </template>
          <tr v-else>
            <td colspan="5" class="center">暂无数据</td>
          </tr>
        </table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="CurrentPage"
          :page-size="10"
          layout="total,  prev, pager, next, jumper"
          :total="Alarm.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      loading: false,
      Total: {},
      Alarm: {},
      deviceTotal: {},
      CurrentPage: 1,
      TopCheck: "0",
      TopCheckSelect: [
        { label: "热水", value: "0" },
        { label: "冷水", value: "1" },
        { label: "电", value: "2" },
      ],
      result: null,
      hotwater: {
        label: "热水信息",
        name: "hot_water",
        path: "/query_stats/hot_water",
      },
      coldwater: {
        label: "冷水信息",
        name: "cold_water",
        path: "/query_stats/cold_water",
      },
      ele: {
        label: "用电信息",
        name: "ydinfo",
        path: "/query_stats/ElectricityUse",
      },
      hotdeposit: {
        label: "热水存款",
        name: "hotwaterdeposit",
        path: "/query_stats/hotwaterdeposit",
      },
      colddeposit: {
        label: "冷水存款",
        name: "coldwaterdeposit",
        path: "/query_stats/coldwaterdeposit",
      },
      colddeposit: {
        label: "用电存款",
        name: "yddeposit",
        path: "/query_stats/yddeposit",
      },
    };
  },
  created() {
    this.AxiosHotWater();
    this.AxiosAlarm();
    this.AxiosNumber();
  },
  methods: {
    resultNunber() {
      this.result =
        this.TopCheck == 0
          ? this.$store.state.tab.tabsList.findIndex((item) => item.name === "hot_water")
          : this.TopCheck == 1
          ? this.$store.state.tab.tabsList.findIndex((item) => item.name === "cold_water")
          : this.TopCheck == 2
          ? this.$store.state.tab.tabsList.findIndex((item) => item.name === "ydinfo")
          : "";
    },
    // 用量统计跳转
    JumptotalUse() {},
    // 总收入
    Jumpincome() {
      let result;
      if (this.TopCheck == 0) {
        result === -1 ? this.$store.state.tab.tabsList.push(this.hotwater) : "";
        this.$router.push({
          path: "/query_stats/hot_water",
          query: {
            hotincome: true,
          },
        });
      } else if (this.TopCheck == 1) {
        result === -1 ? this.$store.state.tab.tabsList.push(this.coldwater) : "";
        this.$router.push({
          path: "/query_stats/cold_water",
          query: {
            coldincome: true,
          },
        });
      } else if (this.TopCheck == 2) {
        result === -1 ? this.$store.state.tab.tabsList.push(this.ele) : "";
        this.$router.push({
          path: "/query_stats/ElectricityUse",
          query: {
            eleincome: true,
          },
        });
      }
    },
    // 余额
    Jumpbalance() {
      let result =
        this.TopCheck == 0
          ? this.$store.state.tab.tabsList.findIndex((item) => item.name === "hot_water")
          : this.TopCheck == 1
          ? this.$store.state.tab.tabsList.findIndex((item) => item.name === "cold_water")
          : this.TopCheck == 2
          ? this.$store.state.tab.tabsList.findIndex((item) => item.name === "ydinfo")
          : "";
    },
    // 总消费
    Jumpconsume() {},
    // 手工纠正次数
    JumpmodifyTimes() {},
    // 本月总退款
    Jumprefund() {},
    jumprouter(row) {
      let val = { label: "报警信息", name: "alertinfo", path: "/query_stats/alertinfo" };
      let result = this.$store.state.tab.tabsList.findIndex(
        (item) => item.name === "alertinfo"
      );
      result === -1 ? this.$store.state.tab.tabsList.push(val) : "";
    },
    SelectChange() {
      if (this.TopCheck == 0) {
        this.AxiosHotWater();
      } else if (this.TopCheck == 1) {
        this.AxiosColdWater();
      } else if (this.TopCheck == 2) {
        this.AxiosEle();
      }
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.AxiosAlarm();
    },
    AxiosHotWater() {
      this.$axios.post("/system/device/hot-water").then((res) => {
        this.Total = res.data;
      });
    },
    AxiosColdWater() {
      this.$axios.post("/system/device/cold-water").then((res) => {
        this.Total = res.data;
      });
    },
    AxiosEle() {
      this.$axios.post("/system/device/ele").then((res) => {
        this.Total = res.data;
      });
    },
    AxiosNumber() {
      this.$axios.post("/system/device/number").then((res) => {
        this.deviceTotal = res.data;
      });
    },
    AxiosAlarm() {
      this.loading = true;
      this.$axios
        .post("/system/device/alarm", {
          current: this.CurrentPage,
          size: 10,
        })
        .then((res) => {
          this.Alarm = res.data;
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-pagination {
  padding-top: 15px;
  text-align: center;
}
.right {
  .alarm {
    margin-top: 15px;
    padding: 17px 42px 34px 34px;
    table {
      width: 100%;
      border-collapse: collapse;
      tr {
        &:nth-child(2n) {
          td {
            background: white;
          }
        }
        &:hover {
          td {
            color: #1768e4;
          }
        }
      }
      th {
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        background: #f2f2f2;
        color: #333333;
        text-align: center;
        height: 45px;
        line-height: 45px;
      }
      td {
        cursor: pointer;
        i {
          width: 8px;
          margin-right: 3px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          vertical-align: middle;
        }
        .bgyellow {
          background: #ffa107;
        }
        .bgred {
          background: #ff2020;
        }
        .bgblue {
          background: #1768e4;
        }
        span {
          display: inline-block;
          vertical-align: middle;
        }
        background: #f5f5f5;
        border-bottom: 1px solid #f2f2f2;
        line-height: 45px;
        height: 45px;
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        text-align: center;
        color: #41545b;
      }
    }
  }
  .number {
    padding: 17px 0 35px 28px;
    ul {
      li {
        &:last-child {
          padding-right: 0;
          border: 0;
        }
        &:first-child {
          padding-left: 0;
        }
        div {
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #4a4a4a;
          letter-spacing: 1px;
          text-align: center;
          &:last-child {
            padding-top: 5px;
            font-size: 24px;
            font-family: HelveticaNeue, HelveticaNeue-Medium;
            font-weight: 500;
            color: #333333;
            letter-spacing: 1px;
          }
        }
        padding-left: 72px;
        display: inline-block;
        vertical-align: middle;
        padding-right: 71px;
        border-right: 1px solid #8bb3f1;
      }
    }
  }
  .number,
  .alarm {
    background: white;
    border-radius: 10px;
    box-shadow: 0px 0px 15px 8px rgba(229, 230, 255, 0.5);
  }
}
.left {
  background: white;
  padding: 16px 40px 0 26px;
  margin-right: 15px;
  .top {
    padding-bottom: 33px;
    ::v-deep .el-select {
      width: 80px;
      .el-input .el-select__caret {
        color: #2c9dff;
      }
      input {
        border: 0;
        color: #2c9dff;
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        letter-spacing: 1px;
        &:hover {
          border-color: #2c9dff;
        }
      }
    }
    span {
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      text-align: left;
      color: #000000;
      letter-spacing: 1px;
    }
  }
  ul {
    li {
      display: inline-block;
      width: 33%;
      padding-bottom: 70px;
      cursor: pointer;
      &:hover {
        span {
          color: #1768e4 !important;
        }
      }
      div {
        padding-left: 12px;
        display: inline-block;
        vertical-align: middle;
        span:first-child {
          font-size: 24px;
          font-family: HelveticaNeue, HelveticaNeue-Medium;
          font-weight: 500;
          color: #333333;
          padding-bottom: 5px;
        }
        span {
          display: block;
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #4a4a4a;
          letter-spacing: 1px;
        }
      }
      img {
        width: 39px;
        height: 39px;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
.middle_content {
  padding: 0 19px;
  height: 800px;
  overflow-y: hidden;
}
.left,
.right {
  h4 {
    padding-bottom: 25px;
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #000000;
    letter-spacing: 1px;
  }
  vertical-align: middle;
  height: 100%;
  width: calc(50% - 10px);
  display: inline-block;
  border-radius: 8px;
}
</style>

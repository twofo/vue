<template>
  <div class="middle_content">
    <!-- 头部 -->
    <ul class="header">
      <li>
        <img src="../../assets/images/equipment/sum.svg" alt="" />
        <div class="title">
          <p>设备总数</p>
          <div></div>
        </div>
        <div class="number">
          <span>{{ GetDeviceNumData.deviceNum }}</span
          >台
        </div>
      </li>
      <li>
        <img src="../../assets/images/equipment/on.svg" alt="" />
        <div class="title">
          <p>在线设备</p>
          <div></div>
        </div>
        <div class="number">
          <span>{{ GetDeviceNumData.isOnline }}</span
          >台
        </div>
      </li>
      <li>
        <img src="../../assets/images/equipment/off.svg" alt="" />
        <div class="title">
          <p>离线设备</p>
          <div></div>
        </div>
        <div class="number">
          <span>{{ GetDeviceNumData.isOffline }}</span
          >台
        </div>
      </li>
    </ul>
    <!-- 主体 -->
    <div class="content clearfix">
      <div class="content-left">
        <ul class="content-left-charts">
          <li>设备分类</li>
          <li>设备数量</li>
          <li ref="classification" class="pie"></li>
          <li ref="amount_chart" class="bar"></li>
        </ul>
        <div class="content-left-report" v-infinite-scroll="load">
          <div class="content-left-report-heared">设备告警</div>
          <div v-loading="leftloading">
            <template
              v-if="equipment_police !== undefined && equipment_police.length > 0"
            >
              <div class="list" v-for="(item, index) in equipment_police" :key="index">
                <p class="jshidden">查看>></p>
                <ul class="clearfix">
                  <li v-if="item.deviceName == '热水表'">
                    <img src="../../assets/images/equipment/rs.svg" alt="" />
                  </li>
                  <li v-else-if="item.deviceName == '冷水表'">
                    <img src="../../assets/images/equipment/ls.png" alt="" />
                  </li>
                  <li v-else-if="item.deviceName == 'sub433网关'">
                    <img src="../../assets/images/equipment/d.svg" alt="" />
                  </li>
                  <li v-else>
                    <img src="../../assets/images/equipment/rs.svg" alt="" />
                  </li>
                  <li>
                    <div>
                      <span>告警设备:</span><i>{{ item.deviceName || "-" }}</i>
                    </div>
                    <div>
                      <span>告警地点:</span><i>{{ item.address || "-" }}</i>
                    </div>
                  </li>
                  <li>
                    <div>事件描述:</div>
                    <p class="texthide" :title="item.alarmInfo">
                      {{ item.alarmInfo || "-" }}
                    </p>
                  </li>
                </ul>
                <div class="time">{{ item.alarmTime }}</div>
              </div>
            </template>
            <div class="nodata" v-else>暂无数据</div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="content-right-title">使用记录</div>
        <ul>
          <template
            v-if="
              equipment_usage.records !== undefined && equipment_usage.records.length > 0
            "
          >
            <li
              class="clearfix"
              v-for="(item, index) in equipment_usage.records"
              :key="index"
            >
              <div class="fl">
                <div class="title">{{ item.userName }}开启了{{ item.deviceName }}</div>
                <div class="time">{{ item.operationTime || "暂无时间" }}</div>
              </div>
              <img class="fr" src="../../assets/images/equipment/head.svg" alt="" /></li
          ></template>
          <li v-else style="text-align: center">暂无数据</li>
        </ul>
        <el-pagination
          :rightloading="true"
          @current-change="handleCurrentChangeRight"
          :current-page="CurrentPageright"
          :page-size="PageSizeright"
          layout="total, prev, pager, next, jumper"
          :total="equipment_usage.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leftloading: true,
      rightloading: true,
      GetDeviceNumData: {}, // 设备总数
      // 设备告警
      equipment_police: [],
      equipment_police_count: 0,
      //  设备记录
      equipment_usage: [],
      equipment_usage_count: 0,
      CurrentPageleft: 1,
      PageSizeSleft: [3],
      PageSizeleft: 3,
      CurrentPageright: 1,
      PageSizeright: 9,
    };
  },
  methods: {
    handleCurrentChangeRight(val) {
      this.CurrentPageright = val;
      this.usage();
    },
    handleCurrentChange(val) {
      this.CurrentPageleft = val;
      this.police();
    },
    echarts() {
      // 设备分类
      this.$axios.post("/iot/homePage/getDeviceSortNum").then((res) => {
        let equipment_classify = res.data.rows;
        let classification = this.$echarts.init(this.$refs.classification);
        classification.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
          },
          series: [
            {
              name: "数据",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "18",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                lineStyle: {
                  color: "#235894",
                },
              },
              data: [
                {
                  value: equipment_classify.hotWaterNum,
                  name: "热水表",
                  itemStyle: { color: "#ffae53" },
                },
                {
                  value: equipment_classify.coldWaterNum,
                  name: "冷水表",
                  itemStyle: { color: "#3d9aff" },
                },
                {
                  value: equipment_classify.eleNum,
                  name: "电表",
                  itemStyle: { color: "#76b5f7" },
                },
                {
                  value: equipment_classify.gatewayNum,
                  name: "网关",
                  itemStyle: { color: "#FFD4A4" },
                },
              ],
            },
          ],
        });
        window.addEventListener("resize", function () {
          classification.resize();
          amount_chart.resize();
        });
        let amount_chart = this.$echarts.init(this.$refs.amount_chart);
        amount_chart.setOption({
          xAxis: {
            type: "value",
            data: ["4.网关", "3.电表", "2.冷水表", "1.热水表"],
            show: false,
            splitLine: {
              show: false,
            },
          },
          grid: {
            left: "5.7%",
            right: "8%",
            bottom: "0%",
            top: "0%",
            containLabel: true,
          },
          yAxis: {
            axisLabel: {
              fontSize: "18",
              show: true,
            },
            show: true,
            type: "category",
            data: ["4.网关", "3.电表", "2.冷水表", "1.热水表"],
            splitLine: {
              show: false,
            },
            // splitNumber:5,
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              //y轴
              show: false,
            },
          },
          series: [
            {
              barWidth: 15,
              data: [equipment_classify.gatewayNum, equipment_classify.hotWaterNum],
              type: "bar",
              barGap: "80%",
              showBackground: true,
              barGap: "0%",
              backgroundStyle: {
                color: "white",
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    return {
                      colorStops: [
                        {
                          offset: 0,
                          color: "#2c9dff",
                        },
                        {
                          offset: 1,
                          color: "#ace4ff",
                        },
                      ],
                    };
                  },
                  // 柱形图圆角，初始化效果
                  barBorderRadius: [15, 15, 15, 15],
                },
              },
              label: {
                show: true,
                position: "right",
                // position:top, position: 'top'
              },
            },
          ],
        });
      });
    },
    load() {
      this.CurrentPageleft += 1;
      // 警告
      this.police();
    },
    // 设备报警
    police() {
      this.leftloading = true;
      this.$axios
        .post("/iot/homePage/getAlarm", {
          current: this.CurrentPageleft,
          size: this.PageSizeleft,
        })
        .then((res) => {
          if (res.data != undefined) {
            res.data.rows.records.forEach((item) => {
              this.equipment_police.push(item);
            });
          }
          this.leftloading = false;
        });
    },
    // 使用记录
    usage() {
      this.$axios
        .post("/iot/homePage/getDeviceOperate", {
          current: this.CurrentPageright,
          size: this.PageSizeright,
        })
        .then((res) => {
          this.equipment_usage = res.data.rows;
          this.rightloading = false;
        });
    },
    // 设备总数
    GetDeviceNum_Search() {
      this.$axios.post("/iot/homePage/getDeviceNum", {}).then((res) => {
        this.GetDeviceNumData = res.data.rows;
      });
    },
  },
  watch: {},
  mounted() {
    // 设备管理
    this.police();
    // 使用记录
    this.usage();
    this.echarts();
  },
  created() {
    this.GetDeviceNum_Search(); //查询设备总数
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-pagination {
  text-align: center;
  padding: 19px 0 0 0;
}
.middle_content {
  padding: 0 19px;
}
.header {
  height: 173px;
  background: #ffffff;
  border-radius: 11px;
  box-shadow: 0px 0px 15px 8px rgba(229, 230, 255, 0.5);
  padding: 36px 101px 36px 0;
  li {
    padding-left: 90px;
    img {
      width: 60px;
      height: 61px;
    }
    > div {
      display: inline-block;
    }
    &:last-child {
      .title {
        div {
          background: #ffae53;
        }
      }
    }
    .number {
      margin-left: 50px;
      font-family: $font-scse;
      color: #2b363c;
      font-size: 16px;
      letter-spacing: 1px;
      span {
        font-size: 36px;
        font-weight: 600;
      }
    }
    .title {
      margin-left: 19px;
      font-size: 26px;
      font-family: $font-scse;
      font-weight: 600;
      color: #2b363c;
      letter-spacing: 1px;
      div {
        margin-top: 15px;
        width: 70px;
        height: 4px;
        background: #2d92ff;
        border-radius: 8px;
      }
    }
    width: 33%;
    line-height: 101px;
    height: 101px;
    display: inline-block;
    border-right: 2px solid #2d92ff;
    &:last-child {
      border-right: 0;
    }
  }
}
.content {
  margin: 20px 0;

  .content-left {
    width: 58%;
    float: left;
    .content-left-charts {
      height: 308px;
      li {
        display: inline-block;
        width: 50%;
        font-size: 20px;
        font-family: $font-scse;
        font-weight: 600;
        color: #2b363c;
        letter-spacing: 1px;
      }
      padding: 20px 30px;
      background-color: #ffffff;
      border-radius: 11px;
      box-shadow: 0px 0px 15px 8px rgba(229, 230, 255, 0.5);
      .pie,
      .bar {
        width: 432px;
        height: 260px;
        display: inline-block;
      }
    }
    .content-left-report {
      .nodata {
        text-align: center;
      }
      .list {
        &:hover {
          cursor: pointer;
          background: #ebeff4;
        }
        .time {
          text-align: right;
          font-size: 12px;
          font-family: $font-scre;
          font-weight: 400;
          color: #212d33;
        }
        ul {
          li {
            vertical-align: middle;
            float: left;
            img {
              width: 62px;
              height: 62px;
            }
            &:nth-child(2) {
              margin: 0 39px 0 33px;
              width: 32%;
              div {
                &:first-child {
                  margin-top: 0;
                }
                &:last-child {
                  i {
                    line-height: 25px;
                  }
                }
                margin-top: 22px;
                font-size: 14px;
                font-family: $font-scme;
                font-weight: bold;
                text-align: left;
                color: #212d33;
              }
              i {
                font-style: normal;
                font-weight: 400;
                margin-left: 17px;
              }
            }
            &:last-child {
              width: 35%;
              div {
                font-size: 14px;
                font-family: $font-scme;
                font-weight: bold;
                color: #212d33;
              }
              p {
                margin-top: 5px;
                font-size: 14px;
                font-family: $font-scre;
                font-weight: 400;
                line-height: 24px;
                color: #212d33;
              }
            }
          }
        }
        > p {
          text-align: right;
          font-size: 14px;
          font-family: $font-scre;
          font-weight: 400;
          color: #212d33;
        }
        padding: 16px 46px 11px 46px;
        margin-top: 12px;
        background: white;
        border: 1px solid #2c9dff;
        border-radius: 6px;
        box-shadow: 0px 0px 6px 0px rgba(108, 130, 148, 0.5) inset;
      }
      margin-top: 20px;
      background-color: #ffffff;
      border-radius: 11px;
      box-shadow: 0px 0px 15px 8px rgba(229, 230, 255, 0.5);
      padding: 20px;
      height: 520px;
      overflow-y: auto;
      .content-left-report-heared {
        font-size: 20px;
        font-family: $font-scse;
        font-weight: 600;
        color: #2b363c;
        margin-bottom: 16px;
        letter-spacing: 1px;
      }
    }
  }
  .content-right {
    ul {
      li {
        .title {
          font-size: 16px;
          font-family: $font-scme;
          font-weight: 500;
          color: #212d33;
          font-weight: bold;
          letter-spacing: 1px;
        }
        padding: 20px 0;
        .fl {
          vertical-align: middle;
        }
        img {
          width: 34px;
          height: 34px;
        }
        .time {
          margin-top: 15px;
          font-size: 14px;
          font-family: $font-scre;
          font-weight: 400;
          color: #6a7174;
          letter-spacing: 1px;
        }
        height: 79px;
        border-bottom: 1px solid #eaeaea;
        &:last-child {
          border: 0;
        }
      }
    }
    width: 41%;
    margin-left: 10px;
    float: right;
    background-color: #ffffff;
    border-radius: 11px;
    box-shadow: 0px 0px 15px 8px rgba(229, 230, 255, 0.5);
    padding: 30px 40px 20px;
    .content-right-title {
      font-size: 20px;
      font-family: $font-scse;
      font-weight: 600;
      color: #2b363c;
      margin-bottom: 20px;
      letter-spacing: 1px;
    }
  }
}
</style>

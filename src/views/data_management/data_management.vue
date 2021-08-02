<template>
  <div>
    <ul class="header">
      <li>
        <div class="top clearfix">
          <div>
            <span>卡总数</span><span>{{ header_data.cardNumber }}</span
            ><i>张</i>
          </div>
          <img src="../../assets/images/data_management/title1.svg" alt="" />
        </div>
        <el-progress :percentage="header_data.total || 0"></el-progress>
      </li>
      <li>
        <div class="top clearfix">
          <div>
            <span>使用中</span><span>{{ header_data.cardUseNum }}</span
            ><i>张</i>
          </div>
          <img src="../../assets/images/data_management/title2.svg" alt="" />
        </div>
        <el-progress :percentage="header_data.using || 0"></el-progress>
      </li>
      <li>
        <div class="top clearfix">
          <div>
            <span>已挂失</span><span>{{ header_data.cardLostNum }}</span
            ><i>张</i>
          </div>
          <img src="../../assets/images/data_management/title3.svg" alt="" />
        </div>
        <el-progress :percentage="header_data.lostnum || 0"></el-progress>
      </li>
      <li>
        <div class="top clearfix">
          <div>
            <span>已冻结</span><span>{{ header_data.cardFrozeNum }}</span
            ><i>张</i>
          </div>
          <img src="../../assets/images/data_management/title4.svg" alt="" />
        </div>
        <el-progress :percentage="header_data.freeze || 0"></el-progress>
      </li>
    </ul>
    <div class="middle">
      <div class="middle-left">
        <div class="middle-left-text">
          <div class="middle-left-text-title">入住比例</div>
          <div class="middle-left-text-content">
            <div class="item">
              <div class="item-img">
                <img src="../../assets/images/data_management/user.svg" alt="" />
              </div>
              <div class="item-statistics">
                <div class="item-text">用户总数</div>
                <div class="item-num">
                  {{ middle_left.userTotal }} <span class="unit">人</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-img">
                <img src="../../assets/images/data_management/rz.svg" alt="" />
              </div>
              <div class="item-statistics">
                <div class="item-text">已入住</div>
                <div class="item-num">
                  {{ middle_left.userRoom }} <span class="unit">人</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-img">
                <img src="../../assets/images/data_management/wz.svg" alt="" />
              </div>
              <div class="item-statistics UserOut">
                <div class="item-text">未入住</div>
                <div class="item-num">
                  {{ middle_left.userOut }} <span class="unit">人</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="middle-left-charts" ref="user"></div>
      </div>
      <div class="middle-right">
        <div class="middle-right-title">楼栋数量排名</div>
        <div class="middle-right-content" ref="ld_num"></div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom-title">房间数占比</div>
      <ul>
        <li class="clearfix">
          <div class="left">
            <div>
              宿舍楼房间<span>{{ bottom_deta.dormitoryRoomNum }}</span>
            </div>
            <div>
              占总房间数<span>{{ bottom_deta.dormitory }}%</span>
            </div>
          </div>
          <div class="right">
            <el-progress
              type="circle"
              :percentage="bottom_deta.dormitory || 0"
              ref="progress"
            ></el-progress>
            <img src="../../assets/images/data_management/sc.svg" alt="" />
          </div>
        </li>
        <li class="clearfix">
          <div class="left">
            <div>
              教学楼房间<span>{{ bottom_deta.teachingRoomNum }}</span>
            </div>
            <div>
              占总房间数<span>{{ bottom_deta.teaching }}%</span>
            </div>
          </div>
          <div class="right">
            <el-progress
              type="circle"
              :percentage="bottom_deta.teaching || 0"
              ref="progress"
            ></el-progress>
            <img src="../../assets/images/data_management/jx.svg" alt="" />
          </div>
        </li>
        <li class="clearfix">
          <div class="left">
            <div>
              办公楼房间<span>{{ bottom_deta.officeRoomNum }}</span>
            </div>
            <div>
              占总房间数<span>{{ bottom_deta.office }}%</span>
            </div>
          </div>
          <div class="right">
            <el-progress
              type="circle"
              :percentage="bottom_deta.office || 0"
              ref="progress"
            ></el-progress>
            <img src="../../assets/images/data_management/bg.svg" alt="" />
          </div>
        </li>
        <li class="clearfix">
          <div class="left">
            <div>
              其他房间<span>{{ bottom_deta.otherRoomNum }}</span>
            </div>
            <div>
              占总房间数<span>{{ bottom_deta.other }}%</span>
            </div>
          </div>
          <div class="right">
            <el-progress
              type="circle"
              :percentage="bottom_deta.other || 0"
              ref="progress"
            ></el-progress>
            <img src="../../assets/images/data_management/qt.svg" alt="" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      header_data: {}, //校园卡数据
      middle_left: {},
      bottom_deta: {},
      EchartsData: [], //echarts数组数据
    };
  },
  created() {
    this.HomePageCard(); //校园卡数据
    this.HomePageUser(); //入住比例
    this.HomePageRoom(); //房间数据
    this.HomePageBuilding(); //楼栋数据
  },
  methods: {
    // 校园卡数据
    HomePageCard() {
      this.$axios.post("/bus/homePage/card", {}).then((res) => {
        // 总数
        let Total = parseFloat(
          Number((res.data.rows.cardNumber / res.data.rows.cardNumber) * 100).toFixed(2)
        );
        // 使用中
        let Using = parseFloat(
          Number((res.data.rows.cardUseNum / res.data.rows.cardNumber) * 100).toFixed(2)
        );
        // 已挂失
        let LostNum = parseFloat(
          Number((res.data.rows.cardLostNum / res.data.rows.cardNumber) * 100).toFixed(2)
        );
        // 已冻结
        let freeze = parseFloat(
          Number((res.data.rows.cardFrozeNum / res.data.rows.cardNumber) * 100).toFixed(2)
        );
        this.header_data = res.data.rows;
        this.$set(this.header_data, "total", Total);
        this.$set(this.header_data, "using", Using);
        this.$set(this.header_data, "lostnum", LostNum);
        this.$set(this.header_data, "freeze", freeze);
      });
    },
    // 入住比例
    HomePageUser() {
      this.$axios.post("/bus/homePage/user", {}).then((res) => {
        this.middle_left = res.data.rows;
        let my_letmiddle_left = this.$echarts.init(this.$refs.user);
        my_letmiddle_left.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            left: 10,
            data: [],
          },
          series: [
            {
              name: "入住情况",
              type: "pie",
              avoidLabelOverlap: false,
              label: {
                show: true,
              },
              formatter: "{d}%\n{b}",
              emphasis: {
                label: {
                  show: false,
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: true,
              },
              data: [
                {
                  value: this.middle_left.userOut,
                  name: "未入住",
                  itemStyle: { color: "#FFAE53" },
                },
                {
                  value: this.middle_left.userRoom,
                  name: "已入住",
                  itemStyle: { color: "#2D92FF" },
                },
              ],
            },
          ],
        });
        window.addEventListener("resize", function () {
          my_letmiddle_left.resize();
        });
      });
    },
    // 房间数据
    HomePageRoom() {
      this.$axios.post("/bus/homePage/room", {}).then((res) => {
        this.bottom_deta = res.data.rows;
        let total =
          res.data.rows.dormitoryRoomNum +
          res.data.rows.officeRoomNum +
          res.data.rows.teachingRoomNum +
          res.data.rows.otherRoomNum;
        //宿舍楼房间数百分百
        let DormitoryRatio = parseFloat(
          Number((res.data.rows.dormitoryRoomNum / total) * 100).toFixed(2)
        );
        //教学楼房间数百分百
        let TeachingRatio = parseFloat(
          Number((res.data.rows.teachingRoomNum / total) * 100).toFixed(2)
        );
        //办公楼楼房间数百分百
        let OfficeRatio = parseFloat(
          Number((res.data.rows.officeRoomNum / total) * 100).toFixed(2)
        );
        //其他楼房间数百分百
        let OtherRatio = parseFloat(
          Number((res.data.rows.otherRoomNum / total) * 100).toFixed(2)
        );
        this.$set(this.bottom_deta, "total", total);
        this.$set(this.bottom_deta, "dormitory", DormitoryRatio);
        this.$set(this.bottom_deta, "teaching", TeachingRatio);
        this.$set(this.bottom_deta, "office", OfficeRatio);
        this.$set(this.bottom_deta, "other", OtherRatio);
      });
    },
    // 楼栋数据
    HomePageBuilding() {
      this.$axios.post("/bus/homePage/building", {}).then((res) => {
        this.EchartsData.push(res.data.rows.otherBuilding); //其他
        this.EchartsData.push(res.data.rows.officeBuilding); //办公
        this.EchartsData.push(res.data.rows.teachBuilding); //教学楼
        this.EchartsData.push(res.data.rows.dormitoryNum); //宿舍楼
        this.EchartsData.push(res.data.rows.buildingTotal); //总楼栋
        let my_letmiddle_right = this.$echarts.init(this.$refs.ld_num);
        my_letmiddle_right.setOption({
          xAxis: {
            type: "value",
            data: ["其他楼栋数", "办公楼栋数", "教学楼栋数", "宿舍楼栋数", "全部楼栋数"],
            show: false,
            splitLine: {
              show: false,
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "0%",
            containLabel: true,
          },
          yAxis: {
            axisLabel: {
              fontSize: "16",
              show: true,
            },
            show: true,
            type: "category",
            data: ["其他楼栋数", "办公楼栋数", "教学楼栋数", "宿舍楼栋数", "全部楼栋数"],
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
              data: this.EchartsData,
              type: "bar",
              barGap: "70%",
              showBackground: true,
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
              },
            },
          ],
        });
        window.addEventListener("resize", function () {
          my_letmiddle_right.resize();
        });
      });
    },
    progress() {
      window.onresize = function () {
        this.$refs.progress.resize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
.header {
  padding: 0 20px;
  li {
    padding: 20px 24px 20px 34px;
    /deep/ .el-progress {
      margin-top: 20px;
      .el-progress-bar__outer {
        height: 15px !important;
      }
      .el-progress__text {
        font-size: 18px;
        font-family: HelveticaNeue;
        color: #2c9dff;
      }
      .el-progress-bar {
        width: 79%;
        margin-right: 0;
        padding-right: 0;
      }
    }
    .top {
      & > div {
        float: left;
        vertical-align: middle;
        margin-top: 23px;
      }
      font-size: 22px;
      font-family: $font-scse;
      font-weight: 500;
      color: #212d33;
      letter-spacing: 2px;
      span {
        &:first-child {
          margin-bottom: 10px;
          display: block;
        }
      }
      i {
        font-size: 16px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        font-style: inherit;
      }
      img {
        float: right;
        width: 100px;
        height: 100px;
      }
    }
    display: inline-block;
    width: calc(25% - 17px);
    margin-right: 22px;
    height: 180px;
    background: #ffffff;
    border-radius: 11px;
    box-shadow: 0px 0px 15px 8px #e5e6ff;
    &:last-child {
      margin-right: 0;
    }
  }
}
.middle {
  height: 400px;
  padding: 20px;
  .middle-left,
  .middle-right {
    width: 49.3%;
    height: 100%;
    background-color: #ffffff;
    float: left;
    padding: 20px;
    border-radius: 7px;
  }
  .middle-left {
    margin-right: 22px;
    .middle-left-text {
      width: 50%;
      float: left;
      .middle-left-text-title {
        font-size: 20px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #212d33;
        line-height: 33px;
        letter-spacing: 1px;
      }
      .middle-left-text-content {
        .item {
          margin-top: 20px;
          margin-left: 50px;
          height: 80px;
          .item-img {
            width: 50px;
            height: 50px;
            float: left;
            margin-right: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .UserOut {
            .item-num {
              color: #ffae53 !important;
              font-family: $font-scme;
            }
          }
          .item-statistics {
            float: left;
            .item-text {
              font-size: 16px;
              font-family: PingFangSC, PingFangSC-Semibold;
              font-weight: 600;
              text-align: left;
              color: #212d33;
              line-height: 28px;
              letter-spacing: 1px;
            }
            .item-num {
              font-size: 24px;
              font-family: PingFangSC, PingFangSC-Semibold;
              font-weight: 600;
              text-align: left;
              color: #2c9dff;
              line-height: 45px;
              letter-spacing: 2px;
              .unit {
                font-size: 16px;
                color: #3d484d;
              }
            }
          }
        }
      }
    }

    .middle-left-charts {
      width: 40%;
      height: 100%;
      float: left;
    }
  }
  .middle-right {
    .middle-right-title {
      font-size: 20px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #212d33;
      line-height: 33px;
      letter-spacing: 1px;
    }
    .middle-right-content {
      width: 95%;
      height: 85%;
      margin: 0 0 0 30px;
    }
  }
}
.bottom {
  ul {
    li {
      width: 25%;
      display: inline-block;
      .left {
        font-size: 16px;
        padding-right: 30px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 400;
        text-align: left;
        color: #212d33;
        & div:first-child {
          padding-bottom: 20px;
          span {
            color: #212d33;
          }
        }
        span {
          padding-left: 5px;
          display: inline-block;
          font-size: 16px;
          font-family: HelveticaNeue, HelveticaNeue-Medium;
          font-weight: 400;
          color: #2d92ff;
        }
      }
      > div {
        vertical-align: middle;
        display: inline-block;
      }
      .right {
        position: relative;
        img {
          position: absolute;
          z-index: 2;
          margin-top: -22px;
          margin-left: -22px;
          left: 50%;
          top: 50%;
          width: 44px;
          height: 44px;
        }
        width: 146px;
        height: 141px;
        /deep/ .el-progress--circle {
          width: 100% !important;
          height: 100% !important;
          .el-progress-circle {
            width: 100% !important;
            height: 100% !important;
          }
        }
      }
    }
  }
  height: 230px;
  background-color: #ffffff;
  margin: 0 20px;
  padding: 20px;
  border-radius: 7px;
  ::v-deep .el-progress__text {
    display: none;
  }
  .bottom-title {
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #212d33;
    line-height: 33px;
    letter-spacing: 1px;
  }
}
</style>

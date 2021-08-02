<template>
  <div class="middle_content">
    <header>
      <router-link to="/equipment/childen/intelligent/intelligent" tag="div"
        ><i class="el-icon-arrow-left"></i><span>返回</span></router-link
      >
    </header>
    <div class="state">
      <h3>运行状态</h3>
      <div class="state_content">
        <div class="img">
          <img src="../../../../assets/images/equipment/dlq.svg" alt="" />
        </div>
        <ul>
          <li><label>设备编号：</label><span>51423267dwe</span></li>
          <li><label>线路号：</label><span>总线</span></li>
          <li><label>在离线状态：</label><span>离线</span></li>
          <li><label>注册时间：</label><span>2020-12-2</span></li>
          <li><label>位置信息：</label><span>位置信息</span></li>
          <li><label>类型：</label><span>照明</span></li>
          <li><label>开合闸状态：</label><span>合闸</span></li>
          <li><label>最近登录时间：</label><span>2020-12-25</span></li>
        </ul>
      </div>
    </div>
    <div class="charts_content">
      <div class="time">
        <el-date-picker
          v-model="datestart"
          :picker-options="pickerOptions"
          type="date"
          value-format="yyyy-MM-dd"
          @change="test"
          placeholder="选择开始时间"
        >
        </el-date-picker>
        <span>至</span>
        <el-date-picker
          v-model="dateend"
          type="date"
          @change="test"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间"
          :picker-options="pickerOptions1"
          :disabled="datestart == null"
        ></el-date-picker>
      </div>
      <ul class="line_charts" v-for="(item, index) in list" :key="index">
        <li>
          <div class="line"></div>
          <el-button class="detail" @click="seeDetail(item.id)">
            <span>详情</span>
            <img src="@/assets/images/equipment/detail.svg" alt="" />
          </el-button>
        </li>
      </ul>
    </div>
    <el-dialog class="list_detail" :visible.sync="dialogTableVisible1">
      <div class="v_list">
      </div>
      <div class="time">
        <el-date-picker
          v-model="datestart"
          :picker-options="pickerOptions"
          type="date"
          value-format="yyyy-MM-dd"
          @change="test"
          placeholder="选择开始时间"
        >
        </el-date-picker>
        <span>至</span>
        <el-date-picker
          v-model="dateend"
          type="date"
          @change="test"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间"
          :picker-options="pickerOptions1"
          :disabled="datestart == null"
        ></el-date-picker>
      </div>
      <table class="Listannal" v-loading="drawerloading">
        <tr>
          <td>时间</td>
          <td>开关电压</td>
        </tr>
        <template>
          <tr>
            <td colspan="2">暂无数据</td>
          </tr>
        </template>
      </table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="PageChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </el-dialog>
    <el-dialog class="list_detail" :visible.sync="dialogTableVisible2">
      <div class="v_list">
      </div>
      <div class="time">
        <el-date-picker
          v-model="datestart"
          :picker-options="pickerOptions"
          type="date"
          value-format="yyyy-MM-dd"
          @change="test"
          placeholder="选择开始时间"
        >
        </el-date-picker>
        <span>至</span>
        <el-date-picker
          v-model="dateend"
          type="date"
          @change="test"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间"
          :picker-options="pickerOptions1"
          :disabled="datestart == null"
        ></el-date-picker>
      </div>
      <table class="Listannal" v-loading="drawerloading">
        <tr>
          <td>时间</td>
          <td>电流</td>
        </tr>
        <template>
          <tr>
            <td colspan="2">暂无数据</td>
          </tr>
        </template>
      </table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="PageChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </el-dialog>
    <el-dialog class="list_detail" :visible.sync="dialogTableVisible3">
      <div class="v_list" v-for="(item, index) in list" :key="index">
        {{ item }}
      </div>
      <div class="time">
        <el-date-picker
          v-model="datestart"
          :picker-options="pickerOptions"
          type="date"
          value-format="yyyy-MM-dd"
          @change="test"
          placeholder="选择开始时间"
        >
        </el-date-picker>
        <span>至</span>
        <el-date-picker
          v-model="dateend"
          type="date"
          @change="test"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间"
          :picker-options="pickerOptions1"
          :disabled="datestart == null"
        ></el-date-picker>
      </div>
      <table class="Listannal" v-loading="drawerloading">
        <tr>
          <td>时间</td>
          <td>开关电压</td>
        </tr>
      </table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="PageChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </el-dialog>
    <el-dialog class="list_detail" :visible.sync="dialogTableVisible4">
      <div class="v_list">
      </div>
      <div class="time">
        <el-date-picker
          v-model="datestart"
          :picker-options="pickerOptions"
          type="date"
          value-format="yyyy-MM-dd"
          @change="test"
          placeholder="选择开始时间"
        >
        </el-date-picker>
        <span>至</span>
        <el-date-picker
          v-model="dateend"
          type="date"
          @change="test"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间"
          :picker-options="pickerOptions1"
          :disabled="datestart == null"
        ></el-date-picker>
      </div>
      <table class="Listannal" v-loading="drawerloading">
        <tr>
          <td>时间</td>
          <td>开关电压</td>
        </tr>
      </table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="PageChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import websocketclass from "../../../../api/socket";
export default {
  name: "announcement_details",
  data() {
    return {
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,

      tableData: [
        {
          date: "2016-05-02",
          voltage: 36,
        },
        {
          date: "2016-05-04",
          voltage: 20,
        },
        {
          date: "2016-05-01",
          voltage: 16,
        },
        {
          date: "2016-05-03",
          voltage: 40,
        },
      ],
      drawerloading: false,
      datestart: null,
      dateend: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return (
            time.getTime() > Date.now() - 8.64e6 ||
            time.getTime() <
              new Date(this.datestart).getTime() - 1 * 24 * 60 * 60 * 1000
          );
        },
      },
      line_list_tab: 1,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisible4: false,

      ID: null, //查看详情传来的ID
      list: [
        {
          id: 1,
          name: "电流（单位A，精度0.01A）",
          data: {
            x: ["06-02 11：50",' ',' ', "06-02 11：55",' ',' ', "06-02 11：59"],
            y: [150, 230, 244, 518, 135, 147, 400],
          },
          color:'#5B8FF9',

        },
        {
          id: 2,
          name: "电压",
          data: {
            x: [' ',"06-02 11：50",' ',' ', "06-02 11：55",' ',' ', "06-02 11：59"],
            y: [' ',"12", "42", "53", "59", "32", "37", "12"],
          },
          color:'#814AFF',

        },
        {
          id: 3,
          name: "功率",
          data: {
            x: [' ',"06-02 11：50",' ',' ', "06-02 11：55",' ',' ', "06-02 11：59"],
            y: [' ',"12", "42", "53", "59", "32", "37", "12"],
          },
          color:'#36CBD6',

        },
        {
          id: 4,
          name: "温度",
          data: {
             x: [' ',"06-02 11：50",' ',' ', "06-02 11：55",' ',' ', "06-02 11：59"],
            y: [' ',"12", "42", "53", "59", "32", "37", "12"],
          },
          color:'#FD9269',

        },
      ],
    };
  },

  mounted() {
    this.getParams();
    // this.initCharts();
    this.drawCharts();
  },
  created(){
    this.detailshandle()
  },
  methods: {
    drawCharts() {
      var echarts = require("echarts");
      let line = document.getElementsByClassName("line");
      for (var i = 0; i < line.length; i++) {
        var myChart = echarts.init(line[i]);
        myChart.setOption({
          title: {
            show: true,
            text: this.list[i].name,
            x: "left",
            y: "top",
            textStyle: {
              fontSize: 16,
              fontWeight: 700,
            },
          },
          xAxis: {
            type: "category",
            data: this.list[i].data.x,
          },
          yAxis: {
            type: "value",
            nameTextStyle: {
              fontWeight: 700,
              fontSize: 16,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: this.list[i].color,
              },
            },
            axisTick: { show: false },
          },
          series: [
            {
              symbol:'star',//拐点样式
              itemStyle:{
                normal:{
                  color:this.list[i].color,
                }
              },
              data: this.list[i].data.y,
              type: "line",
              lineStyle:{
                color:this.list[i].color
              },
              // smooth: true,
              areaStyle: {
                normal: {
                  color: {
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: this.list[i].color, // 0% 处的颜色
                      },
                      {
                        offset: 0.8,
                        color: '#fff', // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                },
              },
            },
          ],
        });
      }
    },
    // 接收表格数据
    detailshandle() {
      //ws://localhost:8888/ws/{用户}/187ED5337B44?switch={路线号}
      var number ='187ED5337B44'
      var user='210325'
       var circuit ='0'
     new websocketclass(`192.168.1.98:8888/ws/${user}/${number}?switch=${circuit}`,msg=>{
       console.log(msg,'msg====');
     },5000)
    },
    // 接收参数的方法
    getParams() {
      this.param = this.$route.query.id;
    },
    seeDetail(index) {
      console.log("点击了第" + index + "个");
      if (index == 1) {
      this.dialogTableVisible1 = true
      }
      else if (index ==2 ){
        this.dialogTableVisible2 = true
      }
    },
    test() {
      if (this.PickerstartTime == null) {
        this.PickerendTime = null;
      }
      if (this.datestart == null) {
        this.dateend = null;
      }
    },
    // 列添加背景
    addClass({ row, column, rowIndex, columnIndex }) {
      // if (row.isOnline == 0) {
      //   return "background:#eeeeee";
      // } else {
      //   return "";
      // }
    },
    handleSizeChange() {},
    PageChange() {},
  },
};
</script>

<style lang="scss" scoped>
.middle_content {
  padding: 10px 19px 20px 19px;
}
header {
  background-color: white;
  border-radius: 8px;
  padding: 0 0 0 28px;
  div {
    cursor: pointer;
    line-height: 50px;
    height: 50px;
    font-size: 16px;
    i {
      display: inline-block;
      vertical-align: middle;
      margin-top: 1px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      font-weight: 700;
    }
  }
}
.state {
  margin-top: 10px;
  border-radius: 8px;
  background-color: white;
  padding: 24px 25px;
  height: 200px;
  h3 {
    font-size: 16px;
    font-family: $font-scme;
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 16px;
  }
  .state_content {
    display: flex;
    padding: 20px 0;
    .img {
      height: 150px;
      width: 180px;
      padding-left: 54px;
      text-align: left;
      img {
        width: 72px;
        height: 72px;
      }
    }
    ul {
      flex: 1;
      li {
        width: 25%;
        float: left;
        flex-wrap: wrap;
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }
}
.charts_content {
  margin-top: 10px;
  border-radius: 10px;
  background-color: white;
  padding-left: 190px;
  // padding: 0 20px;
  // background-color: pink;
  display: flex;
  flex-wrap: wrap;
  .time {
    width: 100%;
    height: 80px;
    margin-top: 20px;
    vertical-align: middle;
    display: inline-block;
    > span {
      display: inline-block;
      margin: 0 5px;
      font-size: 14px;
      border: none;
    }
    ::v-deep .el-date-editor {
      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
      .el-input__icon {
        line-height: 36px;
      }
    }
  }
  .line_charts {
    width: 100%;
    height: 100%;
    position: relative;

    flex: 1;
    // background: red;
    li {
      float: left;
      // width: 300px;
      width: 50%;
      .line {
        width: 600px;
        height: 400px;
      }
    }
  }
}
.time {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  vertical-align: middle;
  display: inline-block;
  > span {
    display: inline-block;
    margin: 0 5px;
    font-size: 14px;
    border: none;
  }
  ::v-deep .el-date-editor {
    .el-input__inner {
      height: 36px;
      line-height: 36px;
    }
    .el-input__icon {
      line-height: 36px;
    }
  }
}
.detail {
  position: absolute;
  width: 62px;
  height: 26px;
  border: 1px solid #5b8ff9;
  border-radius: 5px;
  float: left;
  left: 440px;
  top: 7px;
  line-height: 26px;
  padding: 4px 3px;
  span {
    float: left;
    text-align: center;
    color: #5b8ff9;
    padding: 0 3px;
  }
  img {
    float: left;
  }
}
.list_detail {
  // background-color: pink;
  // padding: 6px;
  padding: 20px;
  .v_list {
    font-size: 14;
    font-weight: 700;
    margin-top: -30px;
  }
}
.Listannal {
  width: 100%;
  margin-top: 13px;
  border-collapse: collapse;
  text-align: center;
  tr {
    height: 47px;
    text-align: center;
    &:nth-child(2n) {
      background: #f1f9ff;
    }
    &:first-child {
      background: #2c9dff;
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      color: #ffffff;
      letter-spacing: 2px;
      td {
        border-right: 2px solid white;
        color: white;
      }
    }
    td {
      text-align: center;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      text-align: center;
      color: #41545b;
    }
  }
}
</style>
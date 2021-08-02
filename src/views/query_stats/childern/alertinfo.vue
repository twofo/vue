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
    <div class="fr right_content">
      <ul class="top_header" >
        <li
          v-for="(item, index) in rightheader"
          :key="index"
          @click="righttoptab(item.value, index)"
          :class="rightheadertab == index ? 'active' : ''"

        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <transition name="fade-transform" mode="out-in">
      <div class="recharge fr">
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
          <transition
            name="fade-transform"
            mode="out-in"
            v-if="filtercheck == true"
          >
            <div class="filter_enter clearfix">
              <!-- <div class="abjlx fl jshidden">
                <p>按报警类型</p>
                <el-select v-model="abjlxvalue" clearable placeholder="请选择">
                  <el-option
                    v-for="item in abjlx"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div> -->
              <!-- <div class="asblx fl">
                <p>按设备信息</p>
                <el-select v-model="asblxvalue" clearable placeholder="请选择">
                  <el-option
                    v-for="item in asblx"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div> -->
              <div class="zdy_sjfw fl">
                <p>时间范围</p>
                <el-date-picker
                  v-model="zdystarttime"
                  :picker-options="pickerOptions"
                  type="date"
                  value-format="yyyy-MM-dd"
                  @change="test()"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
                <span>至</span>
                <el-date-picker
                  v-model="zdyendtime"
                  type="date"
                  @change="test()"
                  value-format="yyyy-MM-dd"
                  placeholder="选择结束时间"
                  :picker-options="pickerOptions2"
                  :disabled="zdystarttime == null"
                ></el-date-picker>
              </div>
            </div>
          </transition>
          <transition
            name="fade-transform"
            mode="out-in"
            v-if="filtercheck == true"
          >
            <div class="info butonnhover">
              <button
                @click="
                  CurrentPage = 1;
                  getList();
                "
              >
                搜索
              </button>
              <button
                @click="
                  CurrentPage = 1;
                  reset();
                "
              >
                重置
              </button>
            </div>
          </transition>
        </div>
        <div class="recharge_content">
          <h3 class="top_title"><span>报警总数(次):</span>{{ recharge.total }}</h3>
          <div class="button">
            <button @click="getList">刷新</button>
          </div>
          <table v-loading="loading" v-if="rightheadertab == 0 || rightheadertab ==2">
            <tr>
              <td>类型</td>
              <td>设备号</td>
              <td
                @click="sorttable('alarmTime')"
                :class="
                  sortnumber == 1
                    ? 'ascending'
                    : sortnumber == 2
                    ? 'descending'
                    : ''
                "
              >
                时间<span class="tablesort">
                  <i class="ascending ascendingcheck"></i>
                  <i class="descending descendingcheck"></i>
                </span>
              </td>
              <td>内容</td>
              <td>位置信息</td>
            </tr>
            <template
              v-if="
                recharge.records !== undefined && recharge.records.length > 0
              "
            >
              <tr v-for="(item, index) in recharge.records" :key="index">
                <td>
                  {{
                    item.deviceType == 2
                      ? "冷水表"
                      : item.deviceType == 4
                      ? "电控"
                      : item.deviceType == 8
                      ? "热水表"
                      : item.deviceType == 14
                      ? "sub433网关"
                      : item.deviceType == 16
                      ? "modBus网关"
                      : "-"
                  }}{{ item.type }}
                </td>
                <td>{{ item.deviceCode }}</td>
                <td>{{ item.alarmTime }}</td>
                <td>{{ item.alarmInfo }}</td>
                <td>
                  {{ item.address || "-" }}
                </td>
              </tr></template
            >
            <tr v-else>
              <td colspan="5" style="text-align: center">暂无数据</td>
            </tr>
          </table>
          <table v-loading="loading" v-if="rightheadertab == 1">
            <tr>
              <td>所属设备编号</td>
              <td>设备类型</td>
              <td>线路/类型</td>
              <!-- <td
                @click="sorttable('alarmTime')"
                :class="
                  sortnumber == 1
                    ? 'ascending'
                    : sortnumber == 2
                    ? 'descending'
                    : ''
                "
              >
                时间<span class="tablesort">
                  <i class="ascending ascendingcheck"></i>
                  <i class="descending descendingcheck"></i>
                </span>
              </td> -->
              <td>位置信息</td>
              <td>告警时间</td>
              <td>内容</td>
            </tr>
            <template
              v-if="
                recharge.records !== undefined && recharge.records.length > 0
              "
            >
              <tr v-for="(item, index) in recharge.records" :key="index">
                <td>
                  {{
                    item.deviceType == 2
                      ? "冷水表"
                      : item.deviceType == 4
                      ? "电控"
                      : item.deviceType == 8
                      ? "热水表"
                      : item.deviceType == 14
                      ? "sub433网关"
                      : item.deviceType == 16
                      ? "modBus网关"
                      : "-"
                  }}{{ item.type }}
                </td>
                <td>{{ item.deviceCode }}</td>
                <td>{{ item.alarmTime }}</td>
                <td>{{ item.alarmInfo }}</td>
                <td>
                  {{ item.address || "-" }}
                </td>
              </tr></template
            >
            <tr v-else>
              <td colspan="5" style="text-align: center">暂无数据</td>
            </tr>
          </table>
          <el-pagination
            :loading="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="CurrentPage"
            :page-sizes="PageSizes"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="recharge.total"
          >
          </el-pagination>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
export default {
  name: "hot_water",
  mixins: [sortmixin],
  data() {
    return {
      // tab栏切换
      rightheadertab: 0, //tab数 showorhide
      // rightheader: ["网关设备", "用电设备", "用水设备"], //右侧头部tab切换数据  "冷水", "用电",
      rightheader:[
        {
          value: "14",
          label: "网关",
        },
        {
          value: "4",
          label: "电表",
        },
        {
          value: "2",
          label: "水表",
        },
      ],
      loading: true,
      dataid: null,
      layer: null,
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
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
      asblxvalue: "",
      recharge: [],
      zdystarttime: null,
      zdyendtime: null,
      // asblx: [
      //   {
      //     value: "14",
      //     label: "网关",
      //   },
      //   {
      //     value: "4",
      //     label: "电表",
      //   },
      //   {
      //     value: "2",
      //     label: "水表",
      //   },
      // ],
      // abjlx: [
      //   {
      //     value: "1",
      //     label: "设备",
      //   },
      //   {
      //     value: "2",
      //     label: "系统",
      //   },
      //   {
      //     value: "3",
      //     label: "业务",
      //   },
      // ],
      abjlxvalue: "",
      filtercheck: true,
      default_qj: true,
      default_qj: true, //是否默认全局
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      Total: "", //总数
    };
  },
  methods: {
    // 切换tab
    righttoptab(type,index) {
      console.log(type);
      this.rightheadertab = index;
      this.asblxvalue = type
      this.getList();
    },
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name)
        .then((res) => {
          this.recharge = res.data.rows;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    test() {
      if (this.zdystarttime == null) {
        this.zdyendtime = null;
      }
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.getList(); //分页
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.getList();
    },
    //   处理树状图数据
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
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.default_qj = !this.default_qj;
      this.asblxvalue = "";
      this.abjlxvalue = "";
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.dataid = null;
      this.layer = null;
      this.getList();
    }, // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      this.dataid = data.id.replace(/[^0-9]/gi, "");
      this.CurrentPage = 1;
      this.layer = data.layer;
      this.getList();
    },
    getTotal() {
      this.$axios.post("/iot/alarm/getTotal", {}).then((res) => {
        this.Total = res.data.rows;
      });
    },
    reset() {
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.PageSize = 10;
      this.asblxvalue = null;
      this.abjlxvalue = null;
      this.sortnumber = 0;
      this.sortname = null;
      this.getList();
    },
    getList() {
      this.loading = true;
      this.AxiosParams = {
        startDate: this.zdystarttime,
        endDate: this.zdyendtime,
        current: this.CurrentPage,
        size: this.PageSize,
        deviceType: this.asblxvalue,
        // alarmType: this.abjlxvalue,
        buildingId: this.dataid,
        layer: this.layer,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/iot/alarm/getList";
      this.$axios.post("/iot/alarm/getList", this.AxiosParams).then((res) => {
        this.recharge = res.data.rows;
        this.loading = false;
      });
    },
  },
  activated() {
    this.getList();
  },
  created() {
    this.lddata(); //树状图
    this.getTotal(); //总数
    this.getList(); //分页
  },
  mounted() {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.right_content {
  width: 1350px;
}
.top_header {
  background: white;
  z-index: 999;
  height: 45px;
  border-radius: 8px;
  margin-bottom: 12px;
  li {
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
    &:hover {
      font-family: $font-scme;
      font-weight: 500;
      color: #2c9dff;
    }
  }
}
::v-deep .el-pagination {
  padding: 10px 0 0 0;
}
.recharge_content {
  border-radius: 8px;
  background: #ffffff;
  margin-top: 19px;
  padding: 10px 40px 20px 43px;
  > table {
    width: 100%;
    margin-top: 14px;
    border-collapse: collapse;
    tr {
      height: 58px;
      line-height: 58px;
      td {
        text-align: center;
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        border-bottom: 1px solid #dbdbdb;
      }
    }
    tr:first-of-type {
      td {
        font-size: 14px;
        font-family: $font-scme;
        font-weight: 600;
        color: #364147;
        border-bottom: 0;
      }
      padding: 0 34px;
      background: $tablebg;
      border-radius: 1px;
    }
  }

  .top_title {
    font-size: 24px;
    padding-bottom: 8px;
    font-family: $font-scse;
    font-weight: 600;
    color: #000000;
    border-bottom: $border;
    > div {
      margin-top: 3px;
    }
    span {
      margin-right: 3px;
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      letter-spacing: 1px;
      color: #212d33;
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
  }

  .info {
    width: 100%;
    text-align: center;
    margin-top: 33px;
    padding-bottom: 10px;
    button {
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
  .filter_enter {
    margin-top: 12px;
    border-top: 1px solid #dbdbdb;
    > div {
      margin-right: 160px;
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
        width: 45%;
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
.middle_content {
  padding: 10px 19px 20px 19px;
}
.recharge {
  width: 1355px;
}
</style>

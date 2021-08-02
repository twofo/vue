<template>
  <div class="middle_content">
    <ul class="headertab">
      <li
        :class="headertab_check == index ? 'active' : ''"
        @click="
          CurrentPage = 1;
          headertab_check = index;
          CurrentPage = 1;
          tabSwitch();
        "
        v-for="(item, index) in headertab"
        :key="index"
      >
        {{ item.text }}
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
      <transition name="fade-transform" mode="out-in" v-if="filtercheck == true">
        <div class="filter_enter clearfix">
          <div class="sjfw fl">
            <p>时间范围</p>
            <el-select
              clearable
              v-model="sjfw_value"
              placeholder="请选择"
              @change="iftimedisabled()"
            >
              <el-option
                v-for="item in sjfw_select"
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
      </transition>
      <transition name="fade-transform" mode="out-in" v-if="filtercheck == true">
        <div class="info butonnhover">
          <button
            @click="
              CurrentPage = 1;
              search();
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
    <div class="rz_content">
      <div class="button">
        <button @click="search()">刷新</button>
        <el-button type="primary" class="jshidden">
          <i class="el-icon-folder-add el-icon--left"></i>
          导出列表
        </el-button>
      </div>
      <table v-loading="loading">
        <tr>
          <td>序号</td>
          <template v-if="headertab_check == 0">
            <td>姓名</td>
            <td
              @click="sorttable('operationTime')"
              :class="
                operationTimenumber == 1
                  ? 'ascending'
                  : operationTimenumber == 2
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
          </template>
          <template v-if="headertab_check == 1">
            <td>系统资源</td>
            <td
              @click="sorttable('logTime')"
              :class="
                logTimenumber == 1 ? 'ascending' : logTimenumber == 2 ? 'descending' : ''
              "
            >
              时间<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </td>
            <td>账号</td>
            <td>姓名</td>
            <td>内容</td>
          </template>
        </tr>
        <template v-if="headertab_check == 0">
          <template
            v-if="czlog_table.records !== undefined && czlog_table.records.length > 0"
          >
            <tr v-for="(item, index) in czlog_table.records" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>{{ item.userName || "-" }}</td>
              <td>{{ item.operationTime || "-" }}</td>
              <td>{{ item.operateAction || "-" }}</td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="4">暂无数据</td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="(item, index) in system_table.records" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.resource || "-" }}</td>
            <td>{{ item.logTime || "-" }}</td>
            <td>{{ item.username || "-" }}</td>
            <td>{{ item.name || "-" }}</td>
            <td>{{ item.logInfo || "-" }}</td>
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
        :total="headertab_check == 0 ? czlog_table.total : system_table.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
export default {
  name: "logqueries",
  mixins: [sortmixin],
  data() {
    return {
      operationTimenumber: 0,
      logTimenumber: 0,
      loading: true,
      sjfw_value: "",
      sjfw_select: [
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
      zdystarttime: null,
      zdyendtime: null,
      filtercheck: true,
      headertab_check: 0,
      headertab: [{ text: "操作日志" }, { text: "系统日志" }],
      czlog_table: [],
      CurrentPage: 1,
      PageSize: 10,
      PageSizes: [10, 20, 30, 50],
      // 时间选择器
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
      time_twocheck: 0, //下拉选择时间or自定义时间  0都未选  1下拉时间  2自定义时间
      system_table: null,
      sortable: 0, //表格排序
    };
  },
  methods: {
    handleSizeChange(val) {
      this.PageSize = val;
      this.search();
    },
    reset() {
      this.PageSize = 10;
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.sjfw_value = null;
      this.time_twocheck = 0;
      this.search();
    },
    iftimedisabled() {
      if (this.sjfw_value == "") {
        this.sjfw_value = null;
      }
      if (this.sjfw_value != null) {
        this.zdyendtime = null;
        this.zdystarttime = null;
      }
      if (
        this.sjfw_value == null &&
        this.zdyendtime == null &&
        this.zdystarttime == null
      ) {
        this.time_twocheck = 0;
      } else if (this.sjfw_value != null) {
        this.time_twocheck = 1;
      } else {
        this.time_twocheck = 2;
      }
    },
    test() {
      if (this.zdystarttime == null) {
        this.zdyendtime = null;
      }
      if (this.zdystarttime != null || this.zdyendtime != null) {
        this.sjfw_value = null;
      }
    },
    tabSwitch() {
      this.czlog_table = [];
      [this.time_twocheck,this.sortnumber,this.operationTimenumber,this.logTimenumber] = [0,0,0,0];
      this.$delete(this.AxiosParams, "orderBy");
      this.$delete(this.AxiosParams, "orderParam");
      this.search();
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.search();
    },
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name).then((res) => {
        if (this.headertab_check == 0) {
          this.czlog_table = res.data.rows;
          this.operationTimenumber = this.sortnumber;
          this.logTimenumber = 0;
        } else if (this.headertab_check == 1) {
          this.system_table = res.data.rows;
          this.logTimenumber = this.sortnumber;
          this.operationTimenumber = 0;
        }
        this.loading = false;
      });
    },
    search() {
      if (this.headertab_check == 0) {
        //操作日志
        if (this.time_twocheck == 1) {
          if (this.sjfw_value == 0) {
            this.OperationSearch(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.OperationSearch(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else {
            this.OperationSearch(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else if (this.time_twocheck == 2) {
          this.OperationSearch(this.zdystarttime, this.zdyendtime);
        } else {
          this.OperationSearch(null, null);
        }
      } else if (this.headertab_check == 1) {
        //系统日志
        if (this.time_twocheck == 1) {
          if (this.sjfw_value == 0) {
            this.SystemSearch(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.SystemSearch(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else {
            this.SystemSearch(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else if (this.time_twocheck == 2) {
          this.SystemSearch(this.zdystarttime, this.zdyendtime);
        } else {
          this.SystemSearch(null, null);
        }
      }
    },
    // 系统日志查询
    SystemSearch(startDate, endDate) {
      this.loading = true;
      this.AxiosParams = {
        current: this.CurrentPage,
        size: this.PageSize,
        startDate,
        endDate,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/sys/systemLog/getList";
      this.$axios.post("/sys/systemLog/getList", this.AxiosParams).then((res) => {
        this.system_table = res.data.rows;
        this.loading = false;
      });
    },
    //操作日志查询
    OperationSearch(startDate, endDate) {
      this.loading = true;
      this.AxiosParams = {
        current: this.CurrentPage,
        size: this.PageSize,
        startDate,
        endDate,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/sys/operation/getList";
      this.$axios.post("/sys/operation/getList", this.AxiosParams).then((res) => {
        this.czlog_table = res.data.rows;
        this.loading = false;
      });
    },
  },
  activated() {
    this.search();
  },
  created() {
    this.OperationSearch(null, null);
    this.SystemSearch(null, null);
  },
  mounted() {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.middle_content {
  padding: 0 19px;
  .headertab_box {
    height: 45px;
  }
  .headertab {
    background: white;
    border-radius: 8px;
    li {
      cursor: pointer;
      display: inline-block;
      height: 45px;
      line-height: 45px;
      width: 154px;
      text-align: center;
      font-size: 16px;
      font-family: $font-scre;
      font-weight: 400;
      color: #212d33;
      letter-spacing: 1px;
      &:hover {
        color: #2c9dff;
      }
      &.active {
        color: #2c9dff;
        background: #e5e5ed;
      }
    }
  }
}
.filter {
  margin-top: 8px;
  padding: 18px 20px 18px 20px;
  background: #ffffff;
  border-radius: 8px;

  h3 {
    .fr {
      cursor: pointer;
    }
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
}
.rz_content {
  border-radius: 8px;
  background: #ffffff;
  margin-top: 19px;
  padding: 8px 40px 0 43px;
  margin-bottom: 10px;

  > table {
    width: 100%;
    margin-top: 14px;
    border-collapse: collapse;
    tr {
      height: 58px;
      line-height: 58px;
      td:first-of-type {
        padding-left: 15px;
      }
      td {
        text-align: center;
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        padding: 0;
        color: #212d33;
        border-bottom: 1px solid #dbdbdb;
      }
    }
    tr:first-of-type {
      td {
        border-bottom: 0;
        font-weight: 600;
      }
      padding: 0 34px;
      background: $tablebg;
      border-radius: 1px;
    }
  }
}
::v-deep .el-pagination {
  text-align: center;
  padding: 33px 0;
}
</style>

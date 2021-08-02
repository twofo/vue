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
        <div class="asscx fl">
          <p>按姓名/学工号查询</p>
          <el-input clearable v-model="UserName" placeholder="请输入用户名称"></el-input>
        </div>
        <div class="ysfs fl">
          <p>账户类型</p>
          <el-select clearable v-model="User_value" placeholder="请选择">
            <el-option
              v-for="item in UserSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="sjfw fl">
          <p>时间范围</p>
          <el-select
            clearable
            v-model="sjfw_value"
            placeholder="请选择"
            @change="iftimedisabled"
          >
            <el-option
              v-for="item in TimeSelect"
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
      <div class="info butonnhover" v-if="filtercheck">
        <button
          @click="
            currentPage = 1;
            sortnumber = 0;
            TableSearch();
          "
        >
          搜索
        </button>
        <button @click="reset()">重置</button>
      </div>
    </div>
    <div class="TableData">
      <h3 class="top_title">校正记录</h3>
      <div class="button">
        <button @click="TableSearch()" v-preventReClick="2000">刷新</button>
      </div>
      <table v-loading="loading">
        <tr>
          <th>序号</th>
          <th>学工号</th>
          <th>姓名</th>
          <th>账户类型</th>
          <th
            @click="sorttable('correctBalance')"
            :class="moneynumber == 1 ? 'ascending' : moneynumber == 2 ? 'descending' : ''"
          >
            纠正金额(元)
            <span class="tablesort">
              <i class="ascending ascendingcheck"></i>
              <i class="descending descendingcheck"></i>
            </span>
          </th>
          <th>纠正后金额(元)</th>
          <th>钱包类型</th>
          <th>纠正原因</th>
          <th>操作员编号</th>
          <th>操作员</th>
          <th
            @click="sorttable('correctTime')"
            :class="timenumber == 1 ? 'ascending' : timenumber == 2 ? 'descending' : ''"
          >
            操作时间
            <span class="tablesort">
              <i class="ascending ascendingcheck"></i>
              <i class="descending descendingcheck"></i>
            </span>
          </th>
        </tr>
        <template v-if="TableData.records !== undefined && TableData.records.length > 0">
          <tr v-for="(item, index) in TableData.records" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.identifier || "-" }}</td>
            <td>{{ item.fullName || "-" }}</td>
            <td>
              {{
                item.accountType == 9
                  ? "热水"
                  : item.accountType == 1
                  ? "冷水"
                  : item.accountType == 2
                  ? "电费"
                  : "-"
              }}
            </td>
            <td>{{ item.correctBalance || "-" }}</td>
            <td>{{ item.balance || "-" }}</td>
            <td>{{ item.bodyType == 0 ? "宿舍" : item.bodyType == 1 ? "个人" : "-" }}</td>
            <td>{{ item.correctCause || "-" }}</td>
            <td>{{ item.corrector || "-" }}</td>
            <td>{{ item.correctorName || "-" }}</td>
            <td>{{ item.correctTime || "-" }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="11" class="center">暂无数据</td>
        </tr>
      </table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TableData.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
export default {
  mixins: [sortmixin],
  name: "cwcorrect",
  data() {
    return {
      loading: false,
      currentPage: 1, //分页
      pagesizes: [10, 20, 30, 50],
      pagesize: 10,
      TableData: [], //表格数据
      UserName: null, //用户名input
      User_value: null, //账户类型 value
      // 账户类型Select
      UserSelect: [
        // {
        //   value: "1",
        //   label: "冷水费"
        // },
        // {
        //   value: "2",
        //   label: "电费"
        // },
        {
          value: "9",
          label: "热水",
        },
      ],
      sjfw_value: null, //时间选择 value
      // 时间范围Select
      TimeSelect: [
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
      ], //固定时间
      zdystarttime: null,
      zdyendtime: null, //自定义时间
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
      filtercheck: true, //筛选showorhide
      time_twocheck: 0, //下拉选择时间or自定义时间  0都未选  1下拉时间  2自定义时间
      moneynumber: 0,
      timenumber: 0,
    };
  },
  activated() {
    this.TableSearch(); //查询数据
  },
  created() {
    this.TableSearch(); //查询数据
  },
  methods: {
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name)
        .then((res) => {
          this.TableData = res.data.rows;
          if (name == "correctBalance") {
            this.moneynumber = this.sortnumber;
            this.timenumber = 0;
          } else if (name == "correctTime") {
            this.timenumber = this.sortnumber;
            this.moneynumber = 0;
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.TableSearch();
    },
    reset() {
      this.UserName = null;
      this.currentPage = 1;
      this.User_value = null;
      this.zdyendtime = null;
      this.zdystarttime = null;
      this.sjfw_value = null;
      [this.sortnumber, this.moneynumber, this.timenumber] = [0, 0, 0];
      this.time_twocheck = 0;
      this.TableSearch();
    },
    iftimedisabled(val) {
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
    TableSearch() {
      if (this.time_twocheck == 1) {
        // 本月
        if (this.sjfw_value == 0) {
          this.AxiosList(
            localStorage.getItem("thismonthstart"),
            localStorage.getItem("thismonth")
          );
        } else if (this.sjfw_value == 1) {
          this.AxiosList(
            localStorage.getItem("lastmonthstart"),
            localStorage.getItem("lastmonthend")
          );
        } else if (this.sjfw_value == 2) {
          this.AxiosList(
            localStorage.getItem("lastquarterstart"),
            localStorage.getItem("lastquarterend")
          );
        }
      } else if (this.time_twocheck == 2) {
        this.AxiosList(this.zdystarttime, this.zdyendtime);
      } else {
        this.AxiosList(null, null);
      }
    },
    AxiosList(startDate, endDate) {
      this.loading = true;
      this.AxiosParams = {
        current: this.currentPage,
        size: this.pagesize,
        userName: this.UserName,
        accountType: this.User_value,
        startDate,
        endDate,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/pay/correct/list";
      this.$axios.post("/pay/correct/list", this.AxiosParams).then((res) => {
        this.TableData = res.data.rows;
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.TableSearch();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-pagination {
  text-align: center;
  padding: 20px 0 10px 0;
}
.TableData {
  table {
    width: 100%;
    margin-top: 14px;
    td,
    th {
      border-bottom: $border;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #364147;
    }
    th {
      border-bottom: 0;
      color: #364147;
      text-align: left;
      background: $tablebg;
    }
  }
  .top_title {
    margin-top: 10px;
    border-bottom: 1px solid #dbdbdb;
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #313c42;
    letter-spacing: 1px;
    padding-bottom: 10px;
  }

  background: white;
  margin-top: 15px;
  border-radius: 8px;
  padding: 5px 38px 20px 27px;
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
.middle_content {
  padding: 0 19px;
}
</style>

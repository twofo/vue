<template>
  <div class="middle_content">
    <div class="filtrate-heared">
      <div
        class="filtrate-title"
        :style="filtrateClick == false ? 'border-bottom: none;' : ''"
      >
        <div class="left">
          条件筛选
          <div class="right1 pointer" @click="filtrateClick = !filtrateClick">
            <div v-if="filtrateClick == true"><i class="el-icon-arrow-up"></i> 收起</div>
            <div v-if="filtrateClick == false">
              <i class="el-icon-arrow-down"></i> 展开
            </div>
          </div>
        </div>
      </div>
      <div name="fade-transform" mode="out-in" v-if="filtrateClick">
        <div class="filtrate-content clearfix">
          <div class="fl">
            <div class="text">按用户查询(可输入用户名或学工号)</div>
            <div class="input">
              <el-input clearable v-model="Username" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="fl">
            <div class="text">按类型查询</div>
            <div class="input">
              <el-select clearable v-model="Typevalue" placeholder="请选择">
                <el-option
                  v-for="item in TypeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="fr">
            <div class="text">时间范围</div>
            <div class="input">
              <el-date-picker
                v-model="zdystarttime"
                :picker-options="pickerOptions"
                type="date"
                value-format="yyyy-MM-dd"
                @change="test()"
                placeholder="选择开始时间"
              ></el-date-picker>
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
        </div>
      </div>
      <div class="info butonnhover" v-if="filtrateClick">
        <el-button
          @click="
            CurrentPage = 1;
            table_search();
          "
          type="primary"
          >搜索</el-button
        >
        <el-button @click="reset()" type="primary">重置</el-button>
      </div>
    </div>
    <div class="filtrate-table">
      <div class="button">
        <button @click="table_search">刷新</button>
      </div>
      <table v-loading="loading">
        <tr>
          <th>序号</th>
          <th>姓名</th>
          <th
            @click="sorttable('createTime')"
            :class="timenumber == 1 ? 'ascending' : timenumber == 2 ? 'descending' : ''"
          >
            时间<span class="tablesort">
              <i class="ascending ascendingcheck"></i>
              <i class="descending descendingcheck"></i>
            </span>
          </th>
          <th>渠道</th>
          <th>操作类型</th>
        </tr>
        <template v-if="TableData.records !== undefined && TableData.records.length > 0">
          <tr v-for="(item, index) in TableData.records" :key="index">
            <td>{{ item.number }}</td>
            <td>{{ item.name || "-" }}</td>
            <td>{{ item.createTime || "-" }}</td>
            <td>{{ item.channel || "-" }}</td>
            <td>{{ item.type || "-" }}</td>
          </tr></template
        >
        <tr v-else>
          <td class="center" colspan="5">暂无数据</td>
        </tr>
      </table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizeS"
        :page-size="PageSize"
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
  data() {
    return {
      timenumber: 0,
      loading: false,
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
      TableData: [], //表格数据
      zdyendtime: null,
      zdystarttime: null, //时间选择
      filtrateClick: true,
      Username: null, //按用户名查询
      Typevalue: null, //按类型查询 value
      TypeSelect: [
        { value: "1", label: "绑卡" },
        { value: "2", label: "补卡" },
        { value: "3", label: "挂失" },
      ],
      // 分页
      CurrentPage: 1,
      PageSizeS: [10, 20, 30, 50],
      PageSize: 10,
    };
  },
  activated() {
    this.table_search();
  },
  created() {
    this.table_search();
  },
  methods: {
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name).then((res) => {
        this.TableData = res.data;
        this.timenumber = this.sortnumber;
        this.loading = false;
      });
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.table_search();
    },
    reset() {
      this.CurrentPage = 1;
      this.Username = null;
      [this.sortnumber, this.timenumber] = [0, 0];
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.Typevalue = null;
      this.table_search();
    },
    table_search() {
      this.loading = true;
      this.AxiosParams = {
        current: this.CurrentPage,
        size: this.PageSize,
        username: this.Username,
        type: this.Typevalue,
        startDate: this.zdystarttime,
        endDate: this.zdyendtime,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/bus/card/cardList";
      this.$axios.post("/bus/card/cardList", this.AxiosParams).then((res) => {
        this.TableData = res.data;
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.table_search();
    },
    test() {
      if (this.zdystarttime == null) {
        this.zdyendtime = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-date-editor {
  .el-range-separator {
    width: 8%;
  }
}
.middle_content {
  padding: 0 19px;
}
.filtrate-heared {
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 20px;
  background-color: white;
  .filtrate-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #dedede;
    .left {
      font-size: 16px;
      font-weight: 500;
      .right1 {
        float: right;
        font-weight: 400;
        font-size: 16px;
      }
    }
  }
  .filtrate-content {
    margin-top: 18px;
    > div {
      margin-right: 260px;
      width: 350px;
      &:last-child {
        margin-right: 0;
      }
      .el-date-editor {
        width: 45%;
        height: 36px;
      }
      .input {
        > span {
          margin: 0 10px;
          font-size: 14px;
        }
      }
      .text {
        margin-bottom: 10px;
        font-size: 14px;
      }
    }
    /deep/.el-select,
    .el-input {
      width: 323px;
      height: 36px;
    }
  }
  .info {
    text-align: center;
    margin: 20px 0 0 0;
    button {
      width: 80px;
      height: 33px;
      background: #2d92ff;
      border-radius: 5px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      text-align: center;
      padding: 0;
      line-height: 33px;
      margin: 0 10px;
      color: #ffffff;
      border: 0;
    }
  }
}
.filtrate-table {
  border-radius: 10px;
  background-color: #ffffff;
  padding: 0 20px;
  padding-top: 20px;
  h3 {
    font-size: 18px;
    padding-bottom: 10px;
  }
  /deep/ .el-pagination {
    text-align: center;
    padding: 33px 0;
  }
}
table {
  width: 100%;
  border-collapse: collapse;
  th {
    background: $tablebg;
  }
  td{
    border-bottom:$border;
  }
  td,
  th {
    text-align: center;
    font-size: 14px;
    height: 45px;
    line-height: 45px;
  }
}
</style>

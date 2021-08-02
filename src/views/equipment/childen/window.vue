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
        <div class="fl">
          <p>按标题查询</p>
          <el-input clearable v-model="inputTitle" placeholder="请输入标题"></el-input>
        </div>
        <div class="fl">
          <p>按内容查询</p>
          <el-input clearable v-model="inputContent" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="info butonnhover" v-if="filtercheck">
        <button @click="search">搜索</button>
        <button @click="Reset">重置</button>
      </div>
    </div>
    <div class="TableContent">
      <div class="button">
        <button @click="search()" v-preventReClick="5000">刷新</button>
        <button @click="Delete" v-preventReClick="5000">删除</button>
      </div>
      <el-table
        ref="multipleTable"
        :data="TableData.records"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="loading"
        @selection-change="TableCheck"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="content" label="内容"> </el-table-column>
        <el-table-column prop="date">
          <div
            slot="header"
            @click="sorttable('createTime')"
            :class="datenumber == 1 ? 'ascending' : datenumber == 2 ? 'descending' : ''"
          >
            <span>时间</span
            ><span class="tablesort">
              <i class="ascending ascendingcheck"></i>
              <i class="descending descendingcheck"></i>
            </span>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="PageChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TableData.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
export default {
  mixins: [sortmixin],
  name: "window",
  data() {
    return {
      loading:false,
      datenumber: 0,
      filtercheck: true, //筛选showorhide
      inputTitle: "", //标题input
      inputContent: "", //内容input
      TableCheckData: [], //表格选择列数据
      TableData: [], //表格数据
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
    };
  },
  activated() {
    this.AxiosData();
  },
  created() {
    this.AxiosData();
  },
  methods: {
    handleSizeChange(val) {
      this.PageSize = val;
      this.AxiosData();
    },
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name).then((res) => {
        this.TableData = res.data.rows;
        this.datenumber = this.sortnumber;
        this.loading = false;
      });
    },
    AxiosData() {
      this.loading = true;
      this.AxiosParams = {
        current: this.CurrentPage,
        size: this.PageSize,
        content: this.inputContent,
        title: this.inputTitle,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/sys/system/getNoticeList";
      this.$axios.post("/sys/system/getNoticeList", this.AxiosParams).then((res) => {
        this.TableData = res.data.rows;
        this.loading = false;
      });
    },
    // 分页
    PageChange(val) {
      this.CurrentPage = val;
      this.AxiosData();
    },
    // 表格多选框选中将数据存入新数组
    TableCheck(val) {
      this.TableCheckData = val;
    },
    // 删除
    Delete() {
      if (this.TableCheckData.length != 0) {
        let ids = [];
        this.TableCheckData.forEach((item) => {
          ids.push(item.id);
        });
        this.$axios.post("/sys/system/deleteNotice?ids", ids).then((res) => {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
          this.AxiosData();
        });
      } else {
        this.$message({
          message: "请选择要删除列",
          type: "warning",
        });
      }
    },
    // 单击筛选重置
    Reset() {
      this.inputTitle = "";
      this.inputContent = "";
      [this.sortnumber,this.datenumber]=[0,0]
      this.search();
    },
    // 单击筛选搜索
    search() {
      this.CurrentPage = 1;
      this.AxiosData();
    },
  },
};
</script>

<style lang="scss" scoped>
.TableContent {
  ::v-deep .el-pagination {
    text-align: center;
    margin-top: 15px;
  }
  /deep/ .el-table {
    .el-checkbox__inner {
      border-color: #dbdbdb;
    }
    th {
      font-weight: 500;
    }
    th,
    td {
      font-size: 14px;
      font-family: $font-scme;
      color: #212d33;
    }
    .el-table__body-wrapper {
      th {
        color: #212d33;
      }
    }
    .el-table__header-wrapper {
      th {
        background: $tablebg;
        border: 0;
        color: #364147;
        font-weight: 600;
      }
    }
  }

  margin-top: 19px;
  border-radius: 8px;
  padding: 10px 35px 20px 35px;
  background: white;
}
.middle_content {
  padding: 0 19px;
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
</style>

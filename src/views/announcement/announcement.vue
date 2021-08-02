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
      <transition name="fade-transform" mode="out-in" v-if="filtercheck == true">
        <div class="filter_enter clearfix">
          <div class="aujcx fl">
            <p>按标题查询</p>
            <el-input
              v-model="title_search"
              clearable
              placeholder="请输入标题"
            ></el-input>
          </div>
          <div class="zdy_sjfw fl">
            <p>时间范围</p>
            <el-date-picker
              v-model="pickerstarttime"
              :picker-options="pickerOptions"
              type="date"
              value-format="yyyy-MM-dd"
              @change="test"
              placeholder="选择开始时间"
            ></el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="pickerendtime"
              type="date"
              @change="test"
              value-format="yyyy-MM-dd"
              placeholder="选择结束时间"
              :picker-options="pickerOptions2"
              :disabled="pickerstarttime == null"
            ></el-date-picker>
          </div>
        </div>
      </transition>
      <transition name="fade-transform" mode="out-in" v-if="filtercheck == true">
        <div class="info butonnhover">
          <button
            @click="
              currentPage = 1;
              Table_Search();
            "
          >
            搜索
          </button>
          <button
            @click="
              currentPage = 1;
              reset();
            "
          >
            重置
          </button>
        </div>
      </transition>
    </div>
    <div class="content_tbale">
      <h3>公告管理</h3>
      <div class="button">
        <button @click="Table_Search()">刷新</button>
        <router-link to="/add_announcement" tag="button">新增</router-link>
      </div>
      <table class="table" v-loading="loading">
        <tr>
          <td>标题</td>
          <td>发布时间</td>
          <td>发布人</td>
          <td>操作</td>
        </tr>
        <template
          v-if="
            announcementtable.records !== undefined &&
            announcementtable.records.length > 0
          "
        >
          <tr v-for="(item, index) in announcementtable.records" :key="index">
            <td>{{ item.title }}</td>
            <td>{{ item.createTime }}</td>
            <td>{{ item.creator || "-" }}</td>
            <td @click="SeeDetails(item.id)"><span class="fontblue">查看详情</span></td>
          </tr>
        </template>
        <tr v-else class="zwsj">
          <td colspan="4">暂无数据</td>
        </tr>
      </table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="announcementtable.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "announcement",
  data() {
    return {
      loading: false,
      sortable: 0,
      currentPage: 1, // 默认第一页
      pagesizes: [10, 20, 30, 50], // 个数选择器
      pagesize: 10, // 默认每页显示条数
      filtercheck: true, //条件筛选显示or隐藏
      title_search: null, //标题查询
      pickerendtime: null,
      pickerstarttime: null, //时间选择器选择的时间
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
      //table内容
      announcementtable: [],
    };
  },
  methods: {
    reset() {
      this.title_search = null;
      this.pickerendtime = null;
      this.pickerstarttime = null;
      this.Table_Search();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.Table_Search();
    },
    test() {
      if (this.pickerstarttime == null) {
        this.pickerendtime = null;
      }
    },
    SeeDetails(id) {
      this.$router.push({
        path: "/announcement_details",
        query: { id: id },
      });
    },
    //分页点击事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.Table_Search();
    },
    Table_Search() {
      this.loading = true;
      this.$axios
        .post("/msg/message/list", {
          current: this.currentPage,
          size: this.pagesize,
          title: this.title_search,
          startDate: this.pickerstarttime,
          endDate: this.pickerendtime,
        })
        .then((res) => {
          this.announcementtable = res.data;
          this.loading = false;
        });
    },
  },
  activated() {
    this.Table_Search(); //查询表格分页
  },
  created() {
    this.Table_Search(); //查询表格分页
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
::v-deep .el-pagination {
  text-align: center;
  padding: 20px 0 10px 0;
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
      i {
        margin-right: 8px;
      }
    }
    .fr {
      font-weight: 400;
      cursor: pointer;
    }
  }

  .info {
    width: 100%;
    text-align: center;
    margin-top: 33px;
    padding-bottom: 10px;
    button {
      width: 80px;
      height: 33px;
      padding: 0;
      background: #2d92ff;
      border-radius: 5px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      text-align: center;
      line-height: 33px;
      color: #ffffff;
      border: 0;
      &:last-child {
        margin-left: 15px;
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
.content_tbale {
  .table {
    width: 100%;
    border-collapse: collapse;
    tr {
      &:first-child {
        font-family: $font-scme;
        font-weight: 500;
        height: 45px;
        background: #f2f9ff;
        border-radius: 1px;
        border-bottom: 0;
        td {
          color: #364147 !important;
          font-weight: 600;
        }
      }
      td {
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        height: 45px;
        font-weight: 400;
        text-align: center;
        width: 25%;
        line-height: 45px;
      }
      border-bottom: 1px solid #dbdbdb;
    }
    .zwsj {
      td {
        color: #909399;
      }
    }
  }
  h3 {
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #313c42;
    letter-spacing: 1px;
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 10px;
  }
  margin-top: 20px;
  padding: 24px 27px 20px 27px;
  background: white;
  border-radius: 8px;
}
</style>

<template>
  <div class="middle_content clearfix">
    <div class="left_tree fl">
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
    <div class="right fr">
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
              <p>按名称查询</p>
              <el-input v-model="Username" clearable placeholder="请输入名称"></el-input>
            </div>
          </div>
        </transition>
        <transition name="fade-transform" mode="out-in" v-if="filtercheck == true">
          <div class="info butonnhover">
            <button
              @click="
                CurrentPage = 1;
                Table_Search();
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
      <div class="filtrate-table" v-if="true">
        <div class="button">
          <button @click="Table_Search">刷新</button>
          <button class="jshidden">导出列表</button>
        </div>
        <table v-loading="loading">
          <tr>
            <th>
              {{
                layer == 0
                  ? "楼栋编号"
                  : layer == 1
                  ? "楼层编号"
                  : layer == 2
                  ? "房间编号"
                  : "-"
              }}
            </th>
            <th>名称</th>
            <th>层级</th>
            <th v-if="layer == 0">楼栋类型</th>
            <th>所属校区</th>
            <th
              @click="sorttable('createTime')"
              :class="
                createTimenumber == 1
                  ? 'ascending'
                  : createTimenumber == 2
                  ? 'descending'
                  : ''
              "
            >
              创建时间<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th
              @click="sorttable('updateTime')"
              :class="
                updateTimenumber == 1
                  ? 'ascending'
                  : updateTimenumber == 2
                  ? 'descending'
                  : ''
              "
            >
              修改时间<span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th>操作</th>
          </tr>
          <template
            v-if="TableData.records !== undefined && TableData.records.length > 0"
          >
            <tr v-for="(item, index) in TableData.records" :key="index">
              <td>
                {{
                  layer == 0
                    ? item.buildingNumber
                    : layer == 1
                    ? item.floorNumber
                    : layer == 2
                    ? item.roomNumber
                    : "-"
                }}
              </td>
              <td>
                {{
                  layer == 0
                    ? item.buildingName
                    : layer == 1
                    ? item.floorName
                    : layer == 2
                    ? item.roomName
                    : "-"
                }}
              </td>
              <td v-if="layer == 0">{{ item.buildingType }}</td>
              <td>
                <span
                  :class="
                    item.floorLevel == '楼栋'
                      ? 'bgblue'
                      : item.floorLevel == '楼层'
                      ? 'bggreen'
                      : item.floorLevel == '房间'
                      ? 'bgyellow'
                      : ''
                  "
                  >{{ item.floorLevel || "-" }}</span
                >
              </td>
              <td>{{ item.campus || "-" }}</td>
              <td>{{ item.createTime || "-" }}</td>
              <td>{{ item.updateTime || "-" }}</td>
              <td class="fontblue" @click="particularshandle(item)">查看详情</td>
            </tr></template
          >
          <tr v-else>
            <td class="center" colspan="8">暂无数据</td>
          </tr>
        </table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="CurrentPage"
          :page-sizes="PageSizes"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TableData.total"
        ></el-pagination>
      </div>
    </div>
    <el-drawer :title="DialogData.floorLevel + '信息'" :visible.sync="drawer">
      <h4>基本信息</h4>
      <ul>
        <li>
          <label>上级名称:</label>
          <span>{{ DialogData.topName || "-" }}</span>
        </li>
        <li>
          <label>层级:</label>
          <span>{{ DialogData.floorLevel || "-" }}</span>
        </li>
        <li>
          <label>房间编号:</label>
          <span>{{ DialogData.roomNumber || "-" }}</span>
        </li>
        <li>
          <label>房间名称:</label>
          <span>{{ DialogData.roomName || "-" }}</span>
        </li>
        <li>
          <label>区域类型:</label>
          <span>
            {{
              DialogData.buildingType == 1
                ? "教学楼"
                : DialogData.buildingType == 2
                ? "宿舍楼"
                : DialogData.buildingType == 3
                ? "办公楼"
                : "-"
            }}
          </span>
        </li>
        <li>
          <label>容纳数量:</label>
          <span>{{ DialogData.capacity || "-" }}</span>
        </li>
        <li>
          <label>所属楼栋:</label>
          <span>{{ DialogData.building || "-" }}</span>
        </li>
        <li>
          <label>创建时间:</label>
          <span>{{ DialogData.createTime || "-" }}</span>
        </li>
        <li>
          <label>所属校区:</label>
          <span>{{ DialogData.campus || "-" }}</span>
        </li>
        <li>
          <label>修改时间:</label>
          <span>{{ DialogData.updateTime || "-" }}</span>
        </li>
        <li>
          <label>使用单位:</label>
          <span>{{ DialogData.useUnit || "-" }}</span>
        </li>
        <li>
          <label>装修投入:</label>
          <span>{{ DialogData.renovation || "-" }}</span>
        </li>
        <li>
          <label>坐落地址:</label>
          <span>{{ DialogData.address || "-" }}</span>
        </li>
        <li>
          <label>公摊面积:</label>
          <span>
            {{ DialogData.publicSquare || "-" }}
          </span>
        </li>
        <li>
          <label>建筑面积:</label>
          <span>
            {{ DialogData.buildingSquare || "-" }}
          </span>
        </li>
        <li>
          <label>使用面积:</label>
          <span>{{ DialogData.useSquare || "-" }}</span>
        </li>
        <li>
          <label>备注:</label>
          <span>
            {{ DialogData.note || "-" }}
          </span>
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
export default {
  mixins: [sortmixin],
  data() {
    return {
      filtercheck: true,
      loading: false,
      drawer: false,
      TableData: [],
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      lefttree: [], //树状图数据
      default_qj: true, //是否默认全局
      Username: null, //用户信息
      //   分页
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      DialogData: {}, //dialog数据
      layer: 0,
      buildingType: null,
      dataid: null,
      updateTimenumber: 0,
      createTimenumber: 0,
    };
  },
  components: {},
  activated() {
    this.Table_Search(); //查询表格数据
  },
  created() {
    this.lddata(); //树状图数据
    this.Table_Search(); //查询表格数据
  },
  methods: {
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name).then((res) => {
        this.TableData = res.data.rows;
        if (name == "updateTime") {
          this.updateTimenumber = this.sortnumber;
          this.createTimenumber = 0;
        } else if (name == "createTime") {
          this.createTimenumber = this.sortnumber;
          this.updateTimenumber = 0;
        }
        this.loading = false;
      });
    },
    reset() {
      this.Username = null;
      [this.createTimenumber, this.updateTimenumber, this.sortnumber] = [0, 0, 0];
      this.Table_Search();
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.Table_Search();
    },
    Table_Search() {
      this.loading = true;
      this.AxiosParams = {
        current: this.CurrentPage,
        size: this.PageSize,
        areaName: this.Username,
        layer: this.layer,
        areaIds: this.dataid,
        buildingType: this.buildingType,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/bus/common/buildingData";
      this.$axios.post("/bus/common/buildingData", this.AxiosParams).then((res) => {
        this.TableData = res.data.rows;
        this.loading = false;
      });
    },
    // 单击树状图查询
    handleNodeClick(data) {
      this.layer = null;
      this.buildingType = null;
      this.dataid = null;
      this.default_qj = false;
      let dataid = data.id.replace(/[^0-9]/gi, "");
      this.dataid = dataid;
      this.buildingType = data.buildingType;
      this.CurrentPage = 1;
      this.layer = data.layer;
      this.Table_Search();
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
      this.default_qj = !this.default_qj;
      // 重置树状图
      this.lddata();
      this.layer = 0;
      this.Username = null;
      this.dataid = null;
      this.buildingType = null;
      this.Table_Search();
    },
    // 分页
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.Table_Search();
    },
    // 查看详情
    particularshandle(index) {
      this.$axios({
        url: "/bus/common/selectDetails",
        method: "get",
        params: {
          areaId: index.areaId,
          floorLevel: index.floorLevel,
        },
      }).then((res) => {
        this.DialogData = res.data.rows;
        this.drawer = true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.filtrate-table {
  border-radius: 8px;
  margin-top: 10px;
  background: #ffffff;
  padding: 10px 40px;
}
::v-deep .el-drawer {
  width: 860px;
  .el-drawer__body {
    ul {
      padding-left: 43px;
      li {
        label {
          margin-right: 5px;
          font-size: 14px;
        }
        font-size: 14px;
        display: inline-block;
        width: 50%;
        margin-top: 20px;
      }
    }
    h4 {
      font-size: 16px;
      padding-left: 43px;
      font-family: $font-scme;
      font-weight: 500;
      color: #212d33;
    }
  }
  .el-drawer__header {
    height: 45px;
    line-height: 45px;
    padding: 0;
    border-bottom: 1px solid #dbdbdb;
    margin: 0 0 10px 0;
    span {
      padding-left: 43px;
      display: inline-block;
      font-size: 18px;
      font-family: $font-scse;
      color: #212d33;
    }
    button {
      margin-right: 10px;
    }
  }
}
.right {
  table {
    width: 100%;
    border-collapse: collapse;
    th {
      background-color: $tablebg;
    }
    td,
    th {
      font-size: 14px;
      text-align: left;
      line-height: 45px;
      height: 45px;
    }
    td{
      border-bottom:$border;
    }
    span {
      padding: 8px;
      color: white;
      border-radius: 5px;
      text-align: center;
      display: inline-block;
    }
  }
  /deep/ .el-pagination {
    text-align: center;
    padding: 33px 0;
  }
}
.middle_content {
  padding: 0 19px;
}
.filter {
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
.right {
  width: 1350px;
}
</style>

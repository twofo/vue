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
          <div class="czqd fl">
            <p>按类型查询</p>
            <el-select clearable v-model="devicetypevalue" placeholder="请选择">
              <el-option
                v-for="item in devicetypeselect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="jlzt fl">
            <p>按在/离线查询</p>
            <el-select clearable v-model="isOnlinevalue" placeholder="请选择">
              <el-option
                v-for="item in isOnlineselect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="aujcx fl">
            <p>按设备查询</p>
            <el-input
              clearable
              v-model="deviceName"
              placeholder="请输入设备编号/名称"
            ></el-input>
          </div>
        </div>
        <div class="info butonnhover" v-if="filtercheck">
          <button @click="search" v-preventReClick="2000">搜索</button>
          <button @click="Reset" v-preventReClick="2000">重置</button>
        </div>
      </div>
      <div class="TableData">
        <div class="button">
          <button @click="statusSync" v-preventReClick="2000">设备状态校准</button>
          <button @click="search" v-preventReClick="2000">刷新</button>
        </div>
        <table v-loading="loading">
          <tr>
            <th>序号</th>
            <th>设备编号</th>
            <th>设备名称</th>
            <th>设备类型</th>
            <th>位置信息</th>
            <th>在离线状态</th>
            <th>最近登录时间</th>
            <th>最近离线时间</th>
          </tr>
          <template
            v-if="TableData.records !== undefined && TableData.records.length > 0"
          >
            <tr v-for="(item, index) in TableData.records" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.deviceCode || "-" }}</td>
              <td>{{ item.deviceName || "-" }}</td>
              <td>
                {{
                  item.deviceType == 2
                    ? "冷水表"
                    : item.deviceType == 4
                    ? "电表"
                    : item.deviceType == 8
                    ? "热水表"
                    : item.deviceType == 14
                    ? "433网关"
                    : item.deviceType == 25
                    ? "ecmt网关"
                    : "ModBus网关"
                }}
              </td>
              <td>
                {{ item.address || "-" }}
              </td>
              <td>
                <i :class="[item.isOnline == 0 ? 'bggray' : 'bggreen', 'i']"></i>
                <span>{{ item.isOnline == 0 ? "离线" : "在线" }}</span>
              </td>
              <td>{{ item.loginTime || "-" }}</td>
              <td>{{ item.offLineTime || "-" }}</td>
            </tr>
          </template>
          <tr v-else>
            <td class="center" colspan="8">暂无数据</td>
          </tr>
        </table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="PageChange"
          :current-page="CurrentPage"
          :page-sizes="PageSizes"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TableData.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "equipment",
  data() {
    return {
      loading: false,
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      filtercheck: true, //筛选showorhide
      devicetypevalue: null, //设备类型value
      isOnlinevalue: null, //在离线value
      deviceName: null, //设备名称
      // 设备类型select
      devicetypeselect: [
        {
          value: "2",
          label: "冷水表",
        },
        {
          value: "4",
          label: "电表",
        },
        {
          value: "8",
          label: "热水表",
        },
        {
          value: "14",
          label: "433网关",
        },
        {
          value: "16",
          label: "ModBus网关",
        },
        {
          value: "25",
          label: "ecmt网关",
        },
      ],
      //在离线select
      isOnlineselect: [
        { value: "1", label: "在线" },
        { value: "0", label: "离线" },
      ],
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      TableData: [], //表格数据
      laery: null,
      dataid: null,
    };
  },
  methods: {
    // 设备校准状态
    statusSync() {
      this.$axios.get("/device/maintain/statusSync").then((res) => {
        this.$message.success(res.data.msg);
      });
    },
    // 分页
    handleSizeChange(val) {
      this.PageSize = val;
      this.AxiosData();
    },
    PageChange(val) {
      this.CurrentPage = val;
      this.AxiosData();
    },
    // 请求表格数据
    AxiosData() {
      this.loading = true;
      this.$axios
        .post("/sys/device/getGeneralList", {
          current: this.CurrentPage,
          size: this.PageSize,
          deviceType: this.devicetypevalue,
          deviceName: this.deviceName,
          isOnline: this.isOnlinevalue,
          layer: this.layer,
          areaId: this.dataid,
        })
        .then((res) => {
          this.TableData = res.data.rows;
          this.loading = false;
        });
    },
    // 重置
    Reset() {
      this.devicetypevalue = null;
      this.deviceName = null;
      this.isOnlinevalue = null;
      this.search();
    },
    // 搜索
    search() {
      this.CurrentPage = 1;
      this.AxiosData();
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.layer = null;
      this.dataid = null;
      this.default_qj = !this.default_qj;
      this.AxiosData();
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
    // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      this.dataid = data.id.replace(/[^0-9]/gi, "");
      this.layer = data.layer;
      this.CurrentPage = 1;
      this.AxiosData();
    },
  },
  activated() {
    this.AxiosData();
  },
  created() {
    this.lddata();
    this.AxiosData();
  },
};
</script>

<style lang="scss" scoped>
.TableData {
  margin: 15px 0;
  border-radius: 8px;
  background-color: white;
  padding: 20px 35px;
  ::v-deep .el-pagination {
    text-align: center;
    margin-top: 15px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    th {
      background: $tablebg;
    }
    td{border-bottom: $border;}
    th,
    td {
      text-align: left;
      line-height: 45px;
      height: 45px;
      font-size: 14px;
      font-family: $font-scme;
      color: #212d33;
    }
  }
}
.right_content {
  width: 1355px;
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
    .filter_enter {
      margin-top: 12px;
      border-top: 1px solid #dbdbdb;
      > div {
        margin-right: 173px;
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
}
.middle_content {
  padding: 0 19px;
}
</style>

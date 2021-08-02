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
        <div class="sjfw fl">
          <p>补贴类型</p>
          <el-select v-model="TypeValue" placeholder="请选择">
            <el-option
              v-for="item in TypeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="fl">
          <p>计划状态</p>
          <el-input
            clearable
            v-model="StrategyName"
            placeholder="请输入策略名称"
          ></el-input>
        </div>
      </div>
      <div class="info" v-if="filtercheck">
        <button @click="Search">搜索</button>
        <button @click="Reset">重置</button>
      </div>
    </div>
    <main>
      <h3>补贴计划</h3>
      <div class="button">
        <button v-preventReClick="3000"  @click="AddDialog = true; addPlan()" >新建</button>
        <button v-preventReClick="3000">导入</button>
        <button v-preventReClick="3000">导出</button>
        <button v-preventReClick="3000" @click="Search()">刷新</button>
      </div>
      <el-table
        class="tabledata"
        v-loading="loading"
        :data="TableDate.records"
        style="width: 100%"
      >
        <el-table-column fixed type="index" label="序号"> </el-table-column>
        <el-table-column fixed prop="jhmc" label="计划名称" width="140">
        </el-table-column>
        <el-table-column fixed prop="btcl" label="补贴策略" width="120">
        </el-table-column>
        <el-table-column fixed prop="btlx" label="补贴类型" width="120">
        </el-table-column>
        <el-table-column prop="jhzt" label="计划状态"> </el-table-column>
        <el-table-column prop="bzl" label="补助量(用量单位)" width="130">
        </el-table-column>
        <el-table-column prop="zqql" label="周期清零"> </el-table-column>
        <el-table-column prop="btzq" label="补贴周期"> </el-table-column>
        <el-table-column prop="btdw" label="补贴单位"> </el-table-column>
        <el-table-column prop="spr" label="审批人"> </el-table-column>
        <el-table-column fixed="right" prop="sptime" label="审批时间">
        </el-table-column>
        <el-table-column fixed="right" prop="bttime" label="补贴有效期">
        </el-table-column>
        <el-table-column fixed="right" prop="createdtime" label="创建时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="item">
            <span
              class="fontblue first"
              @click="
                view(item.row);
                dialogTableVisible1 = true;
              "
              >查看</span
            >
            <span
              class="fontblue"
              @click="
                approve(item.row);
                dialogTableVisible2 = true;
              "
              >审批</span
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TableDate.total"
      >
      </el-pagination>
    </main>
    <el-dialog :visible.sync="dialogTableVisible1" customClass="customWidth">
      <div class="view_content">
        <div class="title">
          <div class="state">
            <span>发放状态</span>
            <span class="el-dropdown-link">
              全部<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </div>
          <div class="button">
            <button>一键补发</button>
            <button>导出列表</button>
          </div>
        </div>
        <ul class="view_data">
          <li><label>补助房间（间）：</label><span>808</span></li>
          <li><label>补助总量（度）：</label><span>80888</span></li>
        </ul>
        <!-- tab 栏 -->
        <table class="Listannal">
          <tr>
            <td>序号</td>
            <td>房间地址</td>
            <td>补助发放状态</td>
            <td>补助量（度）</td>
            <td>原因</td>
            <td>操作</td>
          </tr>
          <template v-if="TableDate.records">
            <tr v-for="(item, index) in TableDate.records" :key="index">
              <td>{{ index + 1 }}</td>
            </tr>
          </template>
        </table>
      </div>
      <el-dialog-footer>
        <el-pagination layout="prev,pager, next" :total="TableDate.total">
        </el-pagination>
      </el-dialog-footer>
    </el-dialog>

    <el-dialog :visible.sync="dialogTableVisible2" customClass="customWidth">
      <div class="view_content">
        <div class="title">
          <div class="state">
            <span>发放状态</span>
            <span class="el-dropdown-link">
              全部<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </div>
          <div class="button">
            <button>导出列表</button>
          </div>
        </div>
        <ul class="view_data">
          <li><label>补助房间（间）：</label><span>808</span></li>
          <li><label>补助总量（度）：</label><span>80888</span></li>
        </ul>
        <!-- tab 栏 -->
        <table class="Listannal" :data="TableDate.records">
          <tr>
            <td>序号</td>
            <td>房间地址</td>
            <td>补助发放状态</td>
            <td>补助量（度）</td>
            <td>原因</td>
            <td>操作</td>
          </tr>
          <template v-if="TableDate.records">
            <tr v-for="(item, index) in TableDate.records" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.ffzt == 0 ? "发放失败" : "未发放" }}</td>
              <td>{{ item.reason }}</td>
              <td class="bluefont">补发</td>
            </tr></template
          >
        </table>
        <el-pagination
          layout="prev,pager, next"
          :page-size="5"
          :total="TableDate.total"
        >
        </el-pagination>
      </div>
      <ul class="approval">
        <li>
          <lable>审批状态：</lable>
          <el-select
            class="el-select_appro"
            v-model="approval_value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in approval_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </li>
        <li>
          <lable>审批意见：</lable>
          <input
            class="approval_input"
            v-model="approval_message"
            placeholder="请输入"
          />
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible2 = false"
          >提 交</el-button
        >
        <el-button @click="dialogTableVisible2 = false">取 消</el-button>
        
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "plan",
  data() {
    return {
      AddDialog:true,
      approval_message:'',
      approval_options: [
        {
          value: "选项1",
          label: "通过",
        },
        {
          value: "选项2",
          label: "不通过",
        },
      ],
      approval_value: "",
      input: "",
      loading: false,
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      TableDate: {
        total: 5,
        records: [
          {
            jhmc: "111",
            btcl: "策略名称",
            jhzt: "已终止",
            btlx: "电费补助",
            bzl: "120吨",
            zqql: "清零",
            btzq: "按月",
            btdw: "房间",
            spr: "许van强",
            spyj: "不通过",
            sptime: "2021-04-02",
            bttime: "2021-04-02",
            createdtime: "2021-04-02",
            address: "广州市天河区",
            reason: "未找到设备",
            ffzt: "0",
          },
          {
            jhmc: "111",
            btcl: "策略名称",
            jhzt: "已过期",
            btlx: "电费补助",
            bzl: "120吨",
            zqql: "清零",
            btzq: "按月",
            btdw: "房间",
            spr: "许van强",
            spyj: "不通过",
            sptime: "2021-04-02",
            bttime: "2021-04-02",
            createdtime: "2021-04-02",
            address: "广州市天河区2",
            ffzt: "0",
          },
          {
            jhmc: "111",
            btcl: "策略名称",
            jhzt: "审批拒绝",
            btlx: "电费补助",
            bzl: "120吨",
            zqql: "清零",
            btzq: "按月",
            btdw: "房间",
            spr: "许van强",
            spyj: "不通过",
            sptime: "2021-04-02",
            bttime: "2021-04-02",
            createdtime: "2021-04-02",
            address: "广州市天河区3",
            ffzt: "0",
          },
          {
            jhmc: "111",
            btcl: "策略名称",
            jhzt: "待审批",
            btlx: "电费补助",
            bzl: "120吨",
            zqql: "清零",
            btzq: "按月",
            btdw: "房间",
            spr: "许van强",
            spyj: "不通过",
            sptime: "2021-04-02",
            bttime: "2021-04-02",
            createdtime: "2021-04-02",
            address: "广州市天河区4",
            ffzt: "1",
          },
          {
            jhmc: "111",
            btcl: "策略名称",
            jhzt: "未开始",
            btlx: "电费补助",
            bzl: "120吨",
            zqql: "清零",
            btzq: "按月",
            btdw: "房间",
            spr: "许van强",
            spyj: "不通过",
            sptime: "2021-04-02",
            bttime: "2021-04-02",
            createdtime: "2021-04-02",
            address: "广州市天河区5",
            ffzt: "1",
          },
        ],
      },
      TypeSelect: [
        {
          label: "策略1",
          value: "0",
        },
        {
          label: "策略2",
          value: "1",
        },
      ],
      TypeValue: null,
      StrategyName: null,
      filtercheck: true, //筛选showorhide

      dialogTableVisible1: false,
      dialogTableVisible2: false,
    };
  },
  created() {},
  methods: {
    view(index) {
      //查看
    },
    approve(index) {
      // 审批
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.Search();
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.Search();
    },
    // 列添加背景
    addClass({ row, column, rowIndex, columnIndex }) {
      if (row.isOnline == 0) {
        return "background:#eeeeee";
      } else {
        return "";
      }
    },
    Search() {},
    Reset() {},
    addPlan(){

    },
  },
  activated() {},
};
</script>

<style lang="scss" scoped>
::v-deep .el-pagination {
  margin: 10px 0;
}
.middle_content {
  padding: 0 19px;
  main {
    ::v-deep .el-table {
      margin-top: 10px;
      th {
        font-family: $font-scme;
        color: #364147;
        background: $thbg;
        border-bottom: 0;
      }
      td,
      th {
        height: 45px;
        line-height: 45px;
        font-size: 14px;
      }
      td {
        color: #212d33;
      }
    }
    margin-top: 20px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 0px 15px 8px rgba(229, 230, 255, 0.5);
    padding: 15px;
    h3 {
      padding-bottom: 10px;
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      border-bottom: $border;
      color: #212d33;
      margin-bottom: 20px;
    }
  }
  .filter {
    margin-top: 8px;
    padding: 15px;
    background: #ffffff;
    border-radius: 8px;
    h3 {
      padding-bottom: 10px;
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
      .fr {
        cursor: pointer;
      }
    }
    .filter_enter {
      margin-top: 2px;
      border-top: $border;
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
      margin-top: 20px;
      padding-bottom: 10px;
      button {
        &:hover {
          background: #59b3fd;
        }
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
.first {
  padding-right: 5px;
}
.customWidth {
  width: 74%;
  .view_content {
    width: 100%;
    height: 420px;
    .title {
      // margin-top: -10px;
      // width: 1054px;
      height: 50px;
      line-height: 50px;
      .state {
        float: left;
        span {
          padding-right: 10px;
        }
        span:first-child {
          font-weight: 700;
        }
        // padding-right: 50px;
        .el-dropdown-link {
          display: inline-block;
          width: 150px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          padding: 0 8px;
          border: 1px solid #ccc;
          .el-icon-arrow-down {
            padding-top: 5px;
            float: right;
          }
        }
      }
      .button {
        margin: 0;
        float: right;
        button {
          height: 30px;
          background-color: #2c9dff;
          color: #fff;
        }
      }
    }
    .view_data {
      height: 40px;
      background: #e7f7ff;
      border-top: 1px solid #2d92ff;
      border-bottom: 1px solid #2d92ff;
      padding-left: 30px;
      font-weight: 700;

      li {
        float: left;
        font-size: 14px;
        height: 100%;
        line-height: 40px;

        span {
          font-size: 18px;
          color: #2d92ff;
        }
      }
      li:first-child {
        padding-right: 130px;
      }
    }
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
.approval {
  width: 100%;
  font-size: 14px;
  li {
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    display: flex;
    lable {
      padding-right: 5px;
      letter-spacing: 2px;
      // width: 20%;
      width: 100px;
    }
    lable:last-child {
      width: 78px;
    }
    .approval_input {
      border: 1px solid #ccc;
      flex: 1;
      height: 36px;
      padding-left: 8px;
    }
  }
}
.el-dropdown-link {
  display: inline-block;
  width: 150px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding: 0 8px;
  border: 1px solid #ccc;
  .el-icon-arrow-down {
    padding-top: 5px;
    float: right;
  }
  ::v-deep .el-dropdown-menu {
    width: 150px;
  }
}
::v-deep .el-input__inner {
  // width: 150px;
  height: 35px;
}
</style>

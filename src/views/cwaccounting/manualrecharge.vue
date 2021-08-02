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
    <div class="right_content">
      <div class="filter jshidden">
        <h3 class="clearfix">
          <div class="fl">条件筛选</div>
          <div class="fr" @click="filtercheck = !filtercheck">
            <i class="el-icon-arrow-up" v-if="filtercheck"></i>
            <i v-else class="el-icon-arrow-down"></i>
            <span v-if="filtercheck">收起</span>
            <span v-else>展开</span>
          </div>
        </h3>
        <div class="filter_enter clearfix" v-if="filtercheck">
          <div class="asscx fl">
            <p>按用户姓名查询</p>
            <el-input
              clearable
              v-model="UserName"
              placeholder="请输入用户姓名"
            ></el-input>
          </div>
          <div class="asscx fl">
            <p>按学工号查询</p>
            <el-input clearable v-model="Usercode" placeholder="请输入学工号"></el-input>
          </div>
        </div>
        <div class="info" v-if="filtercheck">
          <button>搜索</button>
        </div>
      </div>
      <div class="table_content">
        <h3>人员充值</h3>
        <el-table :data="TableData.records" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="学工号"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              <span>{{ scope.row.sex == 1 ? "男" : "女" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span @click="rechargefunction(scope.row)">充值</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="layer != null"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TableData.total"
        ></el-pagination>
      </div>
      <div class="recharge" v-if="details">
        <ul>
          <li
            v-for="(item, index) in rechargetext"
            @click="
              rechargetab = index;
              rechargetabclick(index);
            "
            :class="rechargetab == index ? 'active' : ''"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
        <div class="text">
          <div>
            姓名:
            <span>{{ username }}</span>
          </div>
          <div>
            账户余额:
            <span class="yellow">{{ details.bodyPurse.money || 0 }}元</span>
          </div>
        </div>
        <div class="enter">
          <label>充值金额:</label>
          <input placeholder="请输入" type="text" v-model="money" />
        </div>
        <ul class="rechargemoney">
          <li
            @click="money = rechargemoney[index].money"
            v-for="(item, index) in rechargemoney"
            :key="index"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="button butonnhover">
          <button
            :class="details.isShowBtn == false ? 'dia' : ''"
            :disabled="details.isShowBtn == false"
            @click="rechargeclick"
            v-loading.fullscreen.lock="fullscreenLoading"
            v-preventReClick="2000"
          >
            充值
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "manualrecharge",
  data() {
    return {
      fullscreenLoading: false,
      rechargemoney: [
        { name: "5元", money: "5" },
        { name: "10元", money: "10" },
        { name: "20元", money: "20" },
        { name: "50元", money: "50" },
        { name: "100元", money: "100" },
      ],
      rechargedata: null, //单击缴费 用户数据
      rechargetab: 0, //缴费tab
      rechargetext: ["热水缴费","冷水费缴费", "电费缴费"], //, "冷水费缴费", "电费缴费"
      TableData: [], //table数据
      currentPage: 1,
      pagesizes: [10, 20, 30, 50],
      pagesize: 10,
      filtercheck: true, //筛选showorhide
      UserName: null, //用户名查询
      Usercode: null, //用户学工号
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      layer: null,
      dataid: null, //房间id
      userid: null, //用户id
      details: null, //充值用户详情
      username: null, //用户name
      money: null, //输入金额
      usercode: null, //用户code
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
      this.AxiosTableData();
    },
    rechargeclick() {
      let money = this.money;
      if (isNaN(money) || !/^[1-9]+[0-9]*$/.test(money) || money <= 0) {
        this.money = null;
        return this.$message.warning("充值金额只能为整数并且大于0");
      }
      this.fullscreenLoading = true;
      money = parseInt(money);
      if (this.rechargetab == 0) {
        this.$axios
          .post("/pay/recharge/account/recharge", {
            amount: money,
            rechargeType: 9,
            username: this.usercode, //username 是传接口返回的username  就是学工号  不是名字  切记
            userId: this.userid,
          })
          .then((res) => {
            if (res.data.code == 200) {
              setTimeout(() => {
                this.getuserinfo();
                this.$message.success(res.data.msg);
              }, 500);
            } else {
              this.$message.warning(res.data.msg);
            }
            this.money = null;
            this.fullscreenLoading = false;
          });
      }
    },
    rechargetabclick() {
      this.getuserinfo();
    },
    // 获取用户详细信息
    getuserinfo() {
      let type = 9;
      let bodytype = 1;
      let id;
      if (this.rechargetab == 0) {
        type = 9;
        bodytype = 1;
        id = this.userid;
      } else if (this.rechargetab == 1) {
        type = 1;
        bodytype = 0;
        id = parseInt(this.dataid);
        console.log(id);
      } else {
        type = 2;
        bodytype = 0;
        id = parseInt(this.dataid);
        console.log(id);

      }
      this.$axios
        .post("/pay/recharge/getAccountWallet", {
          accountType: type,
          bodyType: bodytype,
          bodyId: id,
        })
        .then((res) => {
          console.log(res);
          this.details = res.data.rows;
          if (res.data.rows.isShowBtn == false) {
            this.$message({
              message: res.data.rows.msg,
              type: "warning",
            });
          }
        });
    },
    rechargefunction(index) {
      this.userid = index.id;
      this.usercode = index.username;
      this.username = index.name;
      this.getuserinfo();
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.dataid = null;
      this.layer = null;
      this.default_qj = !this.default_qj;
      this.details = false;
      this.TableData = [];
    },
    AxiosTableData() {
      this.$axios
        .post("/pay/recharge/listUserByRoomId", {
          current: this.currentPage,
          size: this.pagesize,
          layer: this.layer,
          buildingId: this.dataid,
          userCode: this.Usercode,
          userName: this.UserName,
        })
        .then((res) => {
          console.log(res);
          this.TableData = res.data;
        });
    },
    // 分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.AxiosTableData();
    },
    //   处理树状图数据
    lddata() {
      this.$axios.get("/bus/common/building/select").then((res) => {
        // console.log(res);
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
      this.currentPage = 1;
      if (data.layer == 3) {
        this.dataid = data.id.replace(/[^0-9]/gi, "");
        this.layer = data.layer;
        this.AxiosTableData();
      }
    },
  },
  created() {
    this.lddata(); //查询树状图
  },
};
</script>

<style lang="scss" scoped>
.rechargemoney {
  li {
    border: 1px solid #dbdbdb;
    margin-right: 10px;
    cursor: pointer;
    &:hover {
      border-color: #2d92ff;
    }
  }
}
::v-deep .el-pagination {
  text-align: center;
  margin-top: 15px;
}
.recharge {
  background: white;
  border-radius: 8px;
  padding: 32px 30px 20px 30px;
  margin-top: 15px;
  ul {
    margin-bottom: 40px;
    .active {
      background: #d6eaff;
      color: #2d92ff;
    }
    li {
      width: 153px;
      line-height: 64px;
      height: 64px;
      display: inline-block;
      font-size: 16px;
      font-family: $font-scse;
      text-align: center;
    }
  }
  .text {
    font-size: 16px;
    font-family: $font-scse;
    color: #3b3b3b;
    margin-bottom: 38px;
    span {
      font-size: 18px;
      margin-left: 11px;
    }
    .yellow {
      color: #fd9209;
    }
    div {
      display: inline-block;
      &:last-child {
        margin-left: 90px;
      }
    }
  }
  .enter {
    margin-bottom: 38px;
    font-size: 16px;
    font-family: $font-scse;
    color: #3b3b3b;
    input {
      width: 287px;
      text-indent: 10px;
      height: 40px;
      border: 1px solid #dbdbdb;
      border-radius: 4px;
      margin-left: 11px;
    }
  }
  .button {
    text-align: left;
    .dia {
      opacity: 0.7;
    }
    button {
      font-size: 16px;
      font-family: $font-scre;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 1px;
      width: 109px;
      height: 42px;
      border: 0;
      background: #2d92ff;
      border-radius: 5px;
    }
  }
}
.table_content {
  ::v-deep .el-table {
    margin-top: 15px;
    .el-table__header-wrapper {
      th {
        font-size: 14px;
        font-family: $font-scme;
        font-weight: 600;
        color: #364147;
        background: $tablebg;
        border-bottom: 0;
      }
    }
    .el-table__body {
      td:last-child {
        color: #2d92ff;
        font-size: 14px;
        cursor: pointer;
        font-family: $font-scme;
        font-weight: 500;
      }
      td {
        font-size: 14px;
        font-family: $font-scme;
        font-weight: 500;
      }
    }
  }
  table {
    margin-top: 52px;
    width: 100%;
    border-collapse: collapse;
    tr {
      height: 58px;
      border-bottom: 1px solid #dbdbdb;
      &:first-child {
        background: $tablebg;
        border-radius: 1px;
        border-bottom: 0;
        td {
          font-weight: bold;
        }
      }
      .cz {
        color: #2d92ff;
      }
      td {
        font-size: 16px;
        font-family: $font-scme;
        font-weight: 500;
        color: #364147;
        &:first-child {
          padding-left: 40px;
        }
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
    text-indent: 10px;
  }
  background: white;
  border-radius: 8px;
  padding: 20px 30px;
}
.right_content {
  width: 1360px;
  float: right;
}
.middle_content {
  padding: 0 19px;
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
  }
  .filter_enter {
    margin-top: 12px;
    border-top: 1px solid #dbdbdb;
    > div {
      margin-right: 300px;
      margin-top: 26px;
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
        font-size: 16px;
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
      width: 109px;
      height: 42px;
      background: #2d92ff;
      border-radius: 5px;
      font-size: 16px;
      font-family: $font-scre;
      font-weight: 400;
      text-align: center;
      line-height: 42px;
      color: #ffffff;
      border: 0;
    }
  }
}
</style>

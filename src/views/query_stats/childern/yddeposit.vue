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
    <!-- 用量统计 -->
    <transition name="fade-transform" mode="out-in">
      <div class="statistics fr" id="statistics">
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
              <div class="zhzt fl">
                <p>账户状态</p>
                <el-select v-model="zhztvalue" clearable placeholder="请选择">
                  <el-option
                    v-for="item in zhztselect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="aujcx fl">
                <p>按宿舍查询</p>
                <el-input
                  v-model="info_name"
                  clearable
                  placeholder="请输入宿舍名"
                ></el-input>
              </div>
            </div>
          </transition>
          <transition name="fade-transform" mode="out-in" v-if="filtercheck == true">
            <div class="info butonnhover">
              <button
                @click="
                  currentPage = 1;
                  TableSearch();
                  loading = true;
                "
              >
                搜索
              </button>
              <button
                @click="
                  currentPage = 1;
                  reset();
                  loading = true;
                "
              >
                重置
              </button>
            </div>
          </transition>
        </div>
        <div class="recharge_content">
          <div class="jshidden top_title clearfix">
            <el-button type="primary" class="fr">
              <i class="el-icon-folder-add el-icon--left"></i>
              导出列表
            </el-button>
          </div>
          <div class="padding_table">
            <el-table :data="TableData.records" v-loading="loading">
              <el-table-column type="index"> </el-table-column>
              <el-table-column sortable prop="areaInfo" label="宿舍信息">
              </el-table-column>
              <el-table-column label="充值总额(元)">
                <template slot-scope="scope">{{ scope.row.rechargeSum || "-" }}</template>
              </el-table-column>
              <el-table-column label="消费总额(元)">
                <template slot-scope="scope">{{ scope.row.consumerSum || "-" }}</template>
              </el-table-column>
              <el-table-column label="已退款总额(元)">
                <template slot-scope="scope">{{ scope.row.refundSum || "-" }}</template>
              </el-table-column>
              <el-table-column label="退款中总额(元)">
                <template slot-scope="scope">{{
                  scope.row.refundingSum || "-"
                }}</template>
              </el-table-column>
              <el-table-column label="账户余额(元)">
                <template slot-scope="scope">{{
                  scope.row.balance || "-"
                }}</template></el-table-column
              >
              <el-table-column property="address" label="操作">
                <template slot-scope="scope">
                  <router-link
                    tag="span"
                    @click.native="jumprouter(scope.row)"
                    :to="{
                      path: '/query_stats/ElectricityUse',
                      query: { roomname: scope.row.roomId },
                    }"
                    >详情</router-link
                  >
                  <!-- <span @click="xfjz(scope.row)">消费纠正</span> -->
                </template>
              </el-table-column>
            </el-table>
            <el-dialog
              title="系统提示"
              class="xfjzdialog"
              :visible.sync="xfjzdialog"
              center
            >
              <div class="imgandtext clearfix">
                <div class="fl">
                  <img
                    class="fl"
                    src="../../../assets/images/query_stats/money.png"
                    alt=""
                  />
                </div>
                <div class="fl">
                  <p>
                    您将进行消费纠正操作，请自仔细确认账户<i>相关信息</i>以完成以下内容的填写：
                  </p>
                  <ul>
                    <li>
                      <label><span>*</span>纠正金额:</label
                      ><el-select
                        class="PushorLessvalue"
                        v-model="PushorLessvalue"
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in PushorLessSelect"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option> </el-select
                      ><input
                        class="moneyinput"
                        type="text"
                        placeholder="请输入金额"
                        v-model="jz_money"
                      />元
                    </li>
                    <li>
                      <label>纠正原因:</label
                      ><el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请具体纠正原因"
                        v-model="jz_textarea"
                      >
                      </el-input>
                    </li>
                  </ul>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="jz_confirm" v-preventReClick="6000">确 定</el-button>
                <el-button type="primary" @click="xfjzdialog = false">取 消</el-button>
              </span>
            </el-dialog>
            <el-dialog
              title="系统提示"
              class="jztruedialog"
              :visible.sync="jztruedialog"
              center
            >
              <div>
                <img src="../../../assets/images/query_stats/true.png" alt="" />
                <p>纠正成功</p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="jztrue_confirm" v-preventReClick="2000"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
            <el-dialog
              title="系统提示"
              class="jzfailuredialog"
              :visible.sync="jzfailuredialog"
              center
            >
              <div>
                <img src="../../../assets/images/query_stats/jz_failure.png" alt="" />
                <p>纠正失败</p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="jz_again">重 来</el-button>
                <el-button type="primary" @click="jzfailuredialog = false"
                  >取 消</el-button
                >
              </span>
            </el-dialog>
          </div>

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pagesizes"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="TableData.total"
          >
          </el-pagination>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "hot_water",
  data() {
    return {
      loading: true,
      PushorLessvalue: "+",
      PushorLessSelect: [
        {
          value: "+",
          label: "+",
        },
        {
          value: "-",
          label: "-",
        },
      ],
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      zhztvalue: null, //账户状态下拉
      // 账户状态select
      zhztselect: [
        { value: "0", label: "未销户" },
        { value: "1", label: "已销户" },
      ],
      lefttree: [], //树状图数据
      default_qj: true, //是否默认全局
      info_name: "",
      jztruedialog: false,
      trueorfalse: true,
      jz_money: "",
      jz_textarea: "",
      currentPage: 1,
      TableData: [], //表格数据
      filtercheck: true,
      xfjzdialog: false,
      jzfailuredialog: false,
      pagesizes: [10, 20, 30, 50],
      pagesize: 10,
      dataid: null,
      layer: null,
    };
  },
  methods: {
    jumprouter(row) {
      let val = {
        label: "用电信息",
        name: "ydinfo",
        path: "/query_stats/ElectricityUse",
      };
      let result = this.$store.state.tab.tabsList.findIndex(
        (item) => item.name === "ElectricityUse"
      );
      result === -1 ? this.$store.state.tab.tabsList.push(val) : "";
    },
    reset() {
      this.info_name = null;
      this.zhztvalue = null;
      this.pagesize = 10;
      this.TableSearch();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.TableSearch();
    },
    TableSearch() {
      if (this.zhztvalue != "" || this.zhztvalue != null) {
        let account = parseInt(this.zhztvalue);
        this.$axios
          .post("/pay/accountRecord/waterAndEle/list", {
            current: this.currentPage,
            size: this.pagesize,
            accountType: 2,
            roomName: this.info_name,
            accountStatic: account,
            layer: this.layer,
            buildingId: this.dataid,
          })
          .then((res) => {
            this.TableData = res.data.rows;
            this.loading = false;
          });
      } else {
        this.$axios
          .post("/pay/accountRecord/waterAndEle/list", {
            current: this.currentPage,
            size: this.pagesize,
            accountType: 2,
            userName: this.info_name,
            // accountStatic: static,
            layer: this.layer,
            buildingId: this.dataid,
          })
          .then((res) => {
            this.TableData = res.data.rows;
            this.loading = false;
          });
      }
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
      this.layer = null;
      this.dataid = null;
      this.info_name = null;
      this.zhztvalue = null;
      this.loading = true;
      this.TableSearch();
      this.default_qj = true;
    }, // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      this.layer = data.layer;
      this.currentPage = 1;
      this.loading = true;
      this.dataid = data.id.replace(/[^0-9]/gi, "");
      this.TableSearch();
    },
    jz_again() {
      this.jzfailuredialog = false;
      this.xfjzdialog = true;
    },
    jztrue_confirm() {
      this.jztruedialog = false;
    },
    jz_confirm() {
      if (this.jz_money == "") {
        this.$message({
          message: "纠正金额不能为空",
          type: "warning",
        });
      } else {
        this.$axios
          .post("/pay/accountRecord/BalanceCorrect", {
            correctBalance: this.jz_money,
            bodyId: this.info_name,
            type: 2,
            cause: this.jz_textarea,
            operator: this.PushorLessvalue,
          })
          .then((res) => {
            this.jz_money = null;
            this.jz_textarea = null;
            this.xfjzdialog = false;
            this.jztruedialog = true;
            this.info_name=null;
            if (res.data.code == 200) {
              this.TableSearch();
              return this.$message.success("操作成功");
            } else {
              return this.$message.warning("纠正失败");
            }
          })
          .catch((error) => {
            this.$message.warning(error.response.data.message);
            this.jz_money = null;
            this.info_name=null;
            this.jz_textarea = null;
            this.xfjzdialog = false;
          });
      }
    },
    xfjz(index) {
      this.info_name = index.roomId;
      this.jz_money = null;
      this.jz_textarea = null;
      this.xfjzdialog = true;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.TableSearch();
    },
  },
  activated() {
    this.TableSearch();
  },
  created() {
    this.lddata(); //树状图数据
    this.TableSearch(); //表格数据
  },
  mounted() {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.moneyinput {
  margin-left: 10px;
}
::v-deep .el-textarea {
  width: 311px;
  height: 84px;
  display: inline-block;
  vertical-align: top;
  margin-left: 8px;
  .el-textarea__inner {
    width: 100%;
    height: 100%;
  }
}
.jzfailuredialog {
  ::v-deep .el-dialog {
    width: 516px;
    height: 344px;
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;
    .el-dialog__header {
      height: 46px;
      background: #2d92ff;
      border-radius: 10px 10px 0px 0px;
      padding: 0;
      span {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        line-height: 46px;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .el-dialog__headerbtn {
        top: 15px;
        i {
          color: white;
          font-size: 18px;
        }
      }
    }
    .el-dialog__body {
      text-align: center;
      img {
        width: 74px;
        height: 74px;
      }
      .PushorLessvalue {
        ::v-deep .el-input {
          width: 61px;
          height: 29px;
          margin: 0 5px;
        }
      }
      p {
        margin: 18px 0 47px 0;
        font-size: 24px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        letter-spacing: 1px;
      }
    }
    .el-dialog__footer {
      padding: 20px 0;
      .el-button {
        width: 92px;
        height: 42px;
        font-size: 16px;
        font-family: $font-scre;
        font-weight: 400;
        color: #ffffff;
        background: #2d92ff;
        border-radius: 3px;
      }
      .el-button--primary {
        border: 2px solid #dbdbdb;
        border-radius: 3px;
        color: #6f6f6f;
        background-color: white;
        margin-left: 24px;
      }
    }
  }
}
.jztruedialog {
  ::v-deep .el-dialog {
    width: 516px;
    height: 344px;
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;
    .el-dialog__header {
      height: 46px;
      background: #2d92ff;
      border-radius: 10px 10px 0px 0px;
      padding: 0;
      span {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        line-height: 46px;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .el-dialog__headerbtn {
        top: 15px;
        i {
          color: white;
          font-size: 18px;
        }
      }
    }
    .el-dialog__body {
      text-align: center;
      img {
        width: 74px;
        height: 74px;
      }
      p {
        margin: 18px 0 47px 0;
        font-size: 24px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        letter-spacing: 1px;
      }
    }
    .el-dialog__footer {
      .el-button {
        width: 92px;
        height: 42px;
        font-size: 16px;
        font-family: $font-scre;
        font-weight: 400;
        color: #ffffff;
        background: #2d92ff;
        border-radius: 3px;
      }
    }
  }
}
.xfjzdialog {
  ::v-deep .el-dialog {
    width: 516px;
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;
    .el-dialog__header {
      height: 46px;
      background: #2d92ff;
      border-radius: 10px 10px 0px 0px;
      padding: 0;
      span {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        line-height: 46px;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .el-dialog__headerbtn {
        top: 15px;
        i {
          color: white;
          font-size: 18px;
        }
      }
    }
    .el-dialog__body {
      padding: 0;
      .imgandtext {
        padding: 14px 26px 17px 39px;
        img {
          width: 36px;
          height: 38px;
        }
        p {
          i {
            font-style: normal;
            font-family: $font-scme;
          }
          font-size: 14px;
          font-family: $font-scre;
          font-weight: 400;
          color: #4a4a4a;
          line-height: 25px;
          letter-spacing: 1px;
          width: 398px;
          margin-left: 17px;
        }
        ul {
          li {
            margin-top: 13px;
            label {
              display: inline-block;
              width: 93px;
              span {
                color: #ff2020;
              }
              font-size: 14px;
              font-family: $font-scre;
              font-weight: 400;
              text-align: right;
              letter-spacing: 1px;
            }
            .monetinput {
              font-size: 14px;
              width: 142px;
              height: 29px;
              border: 1px solid #d8d8d8;
              text-indent: 4px;
              margin: 0 8px;
            }
            .el-select {
              margin-left: 7px;
              input {
                height: 29px;
              }
              .el-input__suffix {
                top: 4px;
              }
              width: 61px;
              height: 29px;
            }
            .el-textarea {
              font-size: 14px;
            }
          }
        }
      }
    }
    .el-dialog__footer {
      padding: 20px 0;
      .el-button {
        width: 92px;
        height: 42px;
        font-size: 16px;
        font-family: $font-scre;
        font-weight: 400;
        color: #ffffff;
        background: #2d92ff;
        border-radius: 3px;
      }
      .el-button--primary {
        border: 2px solid #dbdbdb;
        border-radius: 3px;
        color: #6f6f6f;
        background-color: white;
        margin-left: 24px;
      }
    }
  }
}
#statistics {
  width: 1350px;
  .recharge_content {
    border-radius: 8px;
    background: #ffffff;
    margin-top: 19px;
    padding: 20px 0 20px 0;
    .padding_table {
      margin: 14px 40px 0 40px;
      ::v-deep .el-table {
        tr {
          height: 50px;
        }
        .el-table__header-wrapper {
          th {
            height: 40px;
            background: #f2f9ff;
            font-size: 14px;
            font-family: $font-scme;
            font-weight: 600;
            color: #364147;
            border-bottom: 0;
          }
        }
        td {
          &:last-child {
            span {
              cursor: pointer;
              color: #2d92ff;
              margin-right: 10px;
              &:last-child {
                margin-right: 0;
              }
            }
          }
          i {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-right: 5px;
            vertical-align: middle;
            border-radius: 50px;
          }
          span {
            display: inline-block;
            vertical-align: middle;
          }
          .blue {
            background: #1991ff;
          }
          .green {
            background: #51c41b;
          }
          .red {
            background: #ff2020;
          }
          .yellow {
            background: #ffa107;
          }
        }
      }
    }
  }
  .top_title {
    padding-right: 40px;
    button {
      width: 96px;
      height: 33px;
      padding: 0;
      line-height: 33px;
      text-align: center;
      background: #2d92ff;
      border-radius: 5px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 1px;
      i {
        margin: 0;
      }
    }
  }
  ::v-deep .el-pagination {
    text-align: center;
    padding: 33px 0;
  }
  border-radius: 0px;
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

.middle_content {
  padding: 0 19px;
}
</style>

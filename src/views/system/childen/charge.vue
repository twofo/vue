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
      <ul class="top_header">
        <li
          :class="rightheadertab == index ? 'active' : ''"
          v-for="(item, index) in rightheader"
          :key="index"
          @click="righttoptab(index)"
        >
          {{ item }}
        </li>
      </ul>
      <div class="ChangeConfig">
        <h3>配置数据</h3>
        <h4>
          <i class="el-icon-warning"></i
          ><span
            >默认配置如下，并非代表该区域的所有房间是该配置，可点击左侧区域树查看某区域的当前实际配置</span
          >
        </h4>
        <table>
          <tr>
            <td>参数名称</td>
            <td>参数值</td>
            <td>备注</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item, index) in TableData" :key="index">
            <td>{{ item.paramName }}</td>
            <td>{{ item.paramValue }}</td>
            <td>{{ item.note }}</td>
            <td class="blue" @click="UpdateFunction(index)">修改</td>
          </tr>
        </table>
        <el-dialog title="系统提示" :visible.sync="UpdateDialog" center>
          <span>需要注意的是内容是默认不居中的</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "charge",
  data() {
    return {
      UpdateDialog: false,
      rightheader: ["冷水", "用电", "热水"], //右侧头部tab切换数据
      rightheadertab: 0, //tab数 showorhide
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      TableData: [], //表格数据
      UpdateDialogdata: {}, //弹窗所需参数数据
    };
  },
  methods: {
    UpdateFunction(index) {
      this.UpdateDialogdata = this.TableData[index];
      console.log(this.UpdateDialogdata);
      this.UpdateDialog = true;
    },
    AxiosData(layer, areaid) {
      this.$axios
        .post("/pay/select/chargeConfig", {
          configType: this.rightheadertab + 1,
          layer: layer,
          areaId: areaid,
        })
        .then((res) => {
          this.TableData = res.data.rows;
        });
    },
    //   切换右侧tab
    righttoptab(index) {
      this.rightheadertab = index;
      // 切换重置数据
      this.lddata();
      this.AxiosData(0, -1);
      this.default_qj = true;
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.default_qj = !this.default_qj;
      this.AxiosData(0, -1);
    }, //   处理树状图数据
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
      let dataid = data.id.replace(/[^0-9]/gi, "");
      this.AxiosData(data.layer, dataid);
    },
  },
  created() {
    this.lddata();
    this.AxiosData(0, -1);
  },
};
</script>

<style lang="scss" scoped>
.right_content {
  width: 1350px;
  .ChangeConfig {
    ::v-deep .el-dialog {
      width: 398px;
      height: 349px;
      border-radius: 10px 10px 0px 0px;
      .el-dialog__header {
        .el-dialog__title {
          font-size: 18px;
          font-family: $font-scre;
          font-weight: 400;
          color: #ffffff;
          letter-spacing: 1px;
          text-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.21);
        }
        .el-dialog__headerbtn {
          i {
            color: white;
          }
          top: 0;
        }
        height: 46px;
        background: #2d92ff;
        padding: 0;
        line-height: 46px;
        border-radius: 10px 10px 0px 0px;
        box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.21);
      }
      .el-dialog__footer{
        button{
          width: 128px;
        }
      }
    }
    h4 {
      margin-bottom: 39px;
      i {
        color: #ffae53;
        font-size: 22px;
        display: inline-block;
        vertical-align: middle;
      }
      span {
        margin-left: 5px;
        font-size: 16px;
        font-family: $font-scse;
        font-weight: 600;
        display: inline-block;
        vertical-align: middle;
        color: #212d33;
        letter-spacing: 1px;
      }
    }
    h3 {
      font-size: 18px;
      font-family: $font-scme;
      font-weight: 500;
      color: #313c42;
      letter-spacing: 1px;
      border-bottom: 1px solid #EBEEF5;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    border-radius: 8px;
    background: white;
    margin-top: 15px;
    padding: 24px 30px;
    table {
      border-collapse: collapse;
      width: 100%;
      tr {
        height: 58px;
        &:first-child {
          background: #f2f9ff;
        }
        .blue {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #2d92ff;
        }
        td {
          width: 25%;
          text-align: center;
          font-size: 14px;
          font-family: $font-scme;
          font-weight: 500;
          color: #364147;
        }
      }
    }
  }
  .top_header {
    background: white;
    z-index: 999;
    height: 45px;
    width: 1350px;
    border-radius: 8px;
    li {
      display: inline-block;
      width: 120px;
      text-align: center;
      height: 100%;
      line-height: 45px;
      font-size: 16px;
      font-family: $font-scre;
      font-weight: 400;
      color: #212d33;
      &.active {
        background: $bg-color;
        font-family: $font-scme;
        font-weight: 500;
        color: #2c9dff;
      }
    }
  }
}
.middle_content {
  padding: 0 19px;
}
</style>

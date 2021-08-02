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
    <div class="right fr">
      <ul class="top_header">
        <li
          :class="RightTabNumber == index ? 'active' : ''"
          v-for="(item, index) in rightheader"
          :key="index"
          @click="righttoptab(index)"
        >
          {{ item }}
        </li>
      </ul>
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
            <p>按房间查询</p>
            <el-input clearable v-model="roomname" placeholder="请输入房间号"></el-input>
          </div>
        </div>
        <div class="info" v-if="filtercheck">
          <button @click="Search">搜索</button>
          <button @click="Reset">重置</button>
        </div>
      </div>
      <div class="main">
        <div class="button">
          <el-button plain class="jshidden">帮助</el-button>
          <button @click="download">模板下载</button>
          <label class="file">
            <input
              type="file"
              accept=".xls, .xlsx"
              ref="importExcel"
              @change="submitUpload"
              :multiple="false"
            />配置导入
          </label>
          <button @click="exceldownload">配置导出</button>
        </div>
        <transition name="fade-transform" mode="out-in">
          <el-table
            v-if="RightTabNumber == 0"
            v-loading="loading"
            :default-sort="{ prop: 'date' }"
            :data="TableData.records"
            style="width: 100%"
          >
            <el-table-column
              sortable
              fixed
              prop="buildingId"
              label="楼栋"
              width="120"
            ></el-table-column>
            <el-table-column
              sortable
              fixed
              prop="floorId"
              label="楼层"
              width="120"
            ></el-table-column>
            <el-table-column
              sortable
              fixed
              prop="roomId"
              label="房间"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="blueToothName"
              label="蓝牙名称"
              width="120"
            ></el-table-column>
            <el-table-column prop="point" label="频点" width="120"></el-table-column>
            <el-table-column
              prop="heartBeat"
              label="心跳间隔"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="serverIp"
              label="服务器IP"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="serverPort"
              label="服务器端口"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="serverDomain"
              label="服务器域名"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="staticIp"
              label="网关静态IP"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="upperIp"
              label="上级网关IP"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="subnetMask"
              label="子网掩码"
              width="120"
            ></el-table-column>
          </el-table>
        </transition>
        <transition name="fade-transform" mode="out-in">
          <el-table
            v-if="RightTabNumber == 1"
            v-loading="loading"
            :default-sort="{ prop: 'date' }"
            :data="TableData.records"
            style="width: 100%"
          >
            <el-table-column sortable prop="buildingId" label="楼栋"></el-table-column>
            <el-table-column sortable prop="floorId" label="楼层"></el-table-column>
            <el-table-column sortable prop="roomId" label="房间"></el-table-column>
            <el-table-column prop="blueToothName" label="蓝牙名称"></el-table-column>
            <el-table-column prop="pointSendOne" label="发射频点1"></el-table-column>
            <el-table-column prop="pointReceiveOne" label="接收频点1"></el-table-column>
            <el-table-column prop="pointSendTwo" label="发射频点2"></el-table-column>
            <el-table-column prop="pointReceiveTwo" label="接收频点2"></el-table-column>
            <el-table-column prop="heartBeat" label="心跳间隔"></el-table-column>
          </el-table>
        </transition>
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
    <el-dialog title="提示" :visible.sync="importexceldialog" center>
      <span>是否覆盖现有配置?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelimportexcel">取 消</el-button>
        <el-button
          type="primary"
          @click="importexcel"
          v-loading.fullscreen.lock="importexcelloading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "yunwei",
  data() {
    return {
      RightTabNumber: 0,
      importexcelloading: false,
      roomname: null,
      rightheader: ["网关", "热水表"],
      filtercheck: true, //筛选showorhide
      DeviceTypeSelect: [
        {
          value: "0",
          label: "热水设备",
        },
        { value: "1", label: "冷水设备" },
        { value: "2", label: "电设备" },
      ],
      lefttree: [], //树状图数据
      default_qj: true,
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      loading: true,
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      dataid: null,
      layer: null,
      TableData: [],
      importexceldialog: false,
    };
  },
  methods: {
    cancelimportexcel() {
      let inputDom = this.$refs.importExcel;
      inputDom.value = "";
      this.importexceldialog = false;
    },
    // 导入配置
    submitUpload() {
      let inputDom = this.$refs.importExcel;
      if (this.TableData.records !== undefined && this.TableData.records.length > 0) {
        if (inputDom.value) {
          this.importexceldialog = true;
        }
      } else {
        this.importexcel();
      }
    },
    importexcel() {
      this.importexcelloading = true;
      let inputDom = this.$refs.importExcel;
      let file = inputDom.files;
      let formData = new FormData();
      if (file.length !== 0) {
        if (file[0].name.indexOf(".xlsx") == -1) {
          this.$message.warning("请上传.xlsx格式的文件!");
          [this.importexceldialog, this.importexcelloading] = [false, false];
        } else {
          formData.append("excelFile", file[0]);
          if (this.RightTabNumber == 0) {
            this.$axios
              .post("/device/area/configuration/uploadGatewayFile", formData)
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message.success("网关配置导入成功");
                  this.AxiosNetworkData();
                  inputDom.value = "";
                  file = null;
                  formData = null;
                  [this.importexceldialog, this.importexcelloading] = [false, false];
                } else if (res.data.code == 401) {
                  this.$message.warning(res.data.msg);
                  this.AxiosNetworkData();
                  inputDom.value = "";
                  file = null;
                  formData = null;
                  [this.importexceldialog, this.importexcelloading] = [false, false];
                }
              })
              .catch((error) => {
                if (
                  error.response.data.message ==
                  "com.platform.common.exception.CustomException: 频点,心跳,蓝牙名称不能为空,请检查配置文件"
                ) {
                  this.$message.warning("频点,心跳,蓝牙名称不能为空,请检查配置文件");
                }
                inputDom.value = "";
                [this.importexceldialog, this.importexcelloading] = [false, false];
              });
          } else if (this.RightTabNumber == 1) {
            this.$axios
              .post("/device/area/configuration/uploadHotWaterFile", formData)
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message.success("热水配置导入成功");
                  file = null;
                  formData = null;
                  inputDom.value = "";
                  [this.importexceldialog, this.importexcelloading] = [false, false];
                  this.AxiosHotwaterData();
                } else if (res.data.code == 401) {
                  this.$message.warning(res.data.msg);
                  this.AxiosHotwaterData();
                  inputDom.value = "";
                  formData = null;
                  [this.importexceldialog, this.importexcelloading] = [false, false];
                }
              })
              .catch((error) => {
                this.$message.warning(error.response.data.message);
                inputDom.value = "";
                [this.importexceldialog, this.importexcelloading] = [false, false];
              });
          }
        }
      }
    },
    // 配置导出
    exceldownload() {
      let requestConfig = {
        headers: {
          "Content-Type": "application/json;application/octet-stream",
        },
      };
      if (this.RightTabNumber == 0) {
        this.$axios
          .post("/device/area/configuration/downloadGatewayData", requestConfig, {
            responseType: "blob",
          })
          .then((res) => {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = "网关运行配置" + ".xlsx";
            if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          });
      } else if (this.RightTabNumber == 1) {
        this.$axios
          .post("/device/area/configuration/downloadHotWaterData", requestConfig, {
            responseType: "blob",
          })
          .then((res) => {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = "热水运行配置" + ".xlsx";
            if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          });
      }
    },
    // 模板下载
    download() {
      let requestConfig = {
        headers: {
          "Content-Type": "application/json;application/octet-stream",
        },
      };
      if (this.RightTabNumber == 0) {
        this.$axios
          .post("/device/area/configuration/downloadGatewayTemplate", requestConfig, {
            responseType: "blob",
          })
          .then((res) => {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = "网关运行配置模板" + ".xlsx";
            if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          });
      } else if (this.RightTabNumber == 1) {
        this.$axios
          .post("/device/area/configuration/downloadHotWaterTemplate", requestConfig, {
            responseType: "blob",
          })
          .then((res) => {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = "热水运行配置模板" + ".xlsx";
            if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          });
      }
    },
    AxiosHotwaterData() {
      this.loading = true;
      this.$axios
        .post("/device/area/configuration/getHotWaterList", {
          current: this.CurrentPage,
          size: this.PageSize,
          layer: this.layer,
          areaId: this.dataid,
          roomName: this.roomname,
        })
        .then((res) => {
          this.TableData = res.data.rows;
          this.loading = false;
        });
    },
    AxiosNetworkData() {
      this.loading = true;
      this.$axios
        .post("/device/area/configuration/getGatewayList", {
          current: this.CurrentPage,
          size: this.PageSize,
          layer: this.layer,
          areaId: this.dataid,
          roomName: this.roomname,
        })
        .then((res) => {
          this.TableData = res.data.rows;
          this.loading = false;
        });
    },
    righttoptab(index) {
      this.RightTabNumber = index;
      this.whetherglobal();
      this.Search();
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.Search();
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.Search();
    },
    Search() {
      if (this.RightTabNumber == 0) {
        this.AxiosNetworkData();
      } else if (this.RightTabNumber == 1) {
        this.AxiosHotwaterData();
      }
    },
    Reset() {
      this.roomname = null;
      this.Search();
    },
    // 是否全局搜索
    whetherglobal() {
      this.lddata();
      this.loading = true;
      this.layer = null;
      this.dataid = null;
      this.CurrentPage = 1;
      this.roomname = null;
      this.default_qj = true;
      this.Search();
    },
    handleNodeClick(data) {
      this.default_qj = false;
      this.loading = true;
      this.currentPage = 1;
      this.dataid = data.id.replace(/[^0-9]/gi, "");
      this.layer = data.layer;
      this.Search();
    },
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
  },
  created() {
    this.lddata();
    this.Search();
  },
  activated() {},
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 400px;
  border-radius: 10px 10px 0 0;
  .el-dialog__header {
    height: 54px;
    padding: 0;
    line-height: 54px;
    background: #2d92ff;
    border-radius: 10px 10px 0 0;
    .el-dialog__title {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 1px;
    }
    button {
      top: 0;
    }
    .el-dialog__close {
      color: white;
      font-size: 18px;
    }
  }
  .el-dialog__body {
    text-align: center;
    font-size: 14px;
  }
}
.top_header {
  background: white;
  margin-bottom: 15px;
  z-index: 999;
  height: 45px;
  border-radius: 10px;
  li {
    &:hover {
      color: #2c9dff;
    }
    &:first-child {
      border-radius: 8px 0 0 8px;
    }
    cursor: pointer;
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
/deep/ .el-pagination {
  text-align: center;
  padding-top: 15px;
}
.main {
  padding: 13px 20px 27px 20px;
  margin-top: 19px;
  background: #ffffff;
  border-radius: 8px;
  .button {
    text-align: right;
    label {
      &:hover {
        color: #2d92ff;
        border-color: #2d92ff;
      }
      position: relative;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      border-radius: 3px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      color: #262626;
      letter-spacing: 1px;
      background: white;
      border: 1px solid #d9d9d9;
      overflow: hidden;
      margin-right: 10px;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      text-decoration: none;
      text-indent: 0;
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        opacity: 0;
        height: 30px;
      }
    }
    button {
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        color: #2d92ff;
        border-color: #2d92ff;
      }
      margin-right: 10px;
      vertical-align: middle;
      display: inline-block;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      border-radius: 3px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      color: #262626;
      letter-spacing: 1px;
      background: white;
      border: 1px solid #d9d9d9;
      &:last-child {
        background: #2d92ff;
        border: 0;
        color: white;
      }
    }
  }
  /deep/ .el-table {
    margin-top: 15px;
    th {
      padding: 0;
      background: $tablebg;
      height: 45px;
      font-size: 14px;
      font-family: $font-scme;
      font-weight: 500;
      text-align: center;
      color: #364147;
      border-bottom: 0;
    }
    td {
      color: #364147;
      height: 45px;
      font-size: 14px;
      text-align: center;
    }
  }
}
.right {
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
      .fr {
        cursor: pointer;
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
.middle_content {
  padding: 0 19px;
}
</style>

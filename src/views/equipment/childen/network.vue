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
          <div class="fl">
            <p>在离线状态</p>
            <el-select clearable v-model="onlinevalue" placeholder="请选择">
              <el-option
                v-for="item in onlineselect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="fl">
            <p>分配状态</p>
            <el-select clearable v-model="fpvalue" placeholder="请选择">
              <el-option
                v-for="item in fpselect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="fl">
            <p>按设备编号查询</p>
            <el-input
              clearable
              v-model="user_name"
              placeholder="请输入设备编号"
            ></el-input>
          </div>
          <div class="fl">
            <p>网关类型</p>
            <el-select clearable v-model="device_type" placeholder="请选择">
              <el-option
                v-for="item in device_type_select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="info butonnhover" v-if="filtercheck">
          <button
            @click="
              CurrentPage = 1;
              search();
            "
            v-preventReClick="2000"
          >
            搜索
          </button>
          <button @click="Reset" v-preventReClick="2000">重置</button>
        </div>
      </div>
      <div class="tableData">
        <div class="button">
          <button @click="AxiosTablepage()" v-preventReClick="2000">刷新</button>
          <button v-preventReClick="2000" @click="alldel()">删除</button>
          <button class="jshidden" v-preventReClick="2000">导出</button>
        </div>
        <el-table
          v-loading="tableloading"
          :row-key="getRowKeys"
          :data="TableData.records"
          tooltip-effect="dark"
          :cell-style="addClass"
          :default-expand-all="false"
          :expand-row-keys="expands"
          @selection-change="handleSelectionChange"
          @expand-change="exChange"
        >
          <el-table-column type="expand">
            <template>
              <el-table :data="LevelTwoTable">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="deviceCode" label="设备编号"></el-table-column>
                <el-table-column prop="deviceName" label="设备名称"></el-table-column>
                <el-table-column prop="location" label="位置信息" sortable>
                  <!-- <template slot-scope="scope">{{ scope.row.location || "-" }}</template> -->
                </el-table-column>
                <el-table-column label="在离线状态">
                  <template slot-scope="scope">
                    <i :class="scope.row.isOnline == 0 ? 'gray' : 'green'"></i>
                    {{ scope.row.isOnline == 1 ? "在线" : "离线" }}
                  </template>
                </el-table-column>
                <el-table-column label="注册时间">
                  <template slot-scope="scope">
                    {{ scope.row.deviceRegisterTime }}
                  </template>
                </el-table-column>
                <el-table-column label="更新时间">
                  <template slot-scope="scope">
                    {{ scope.row.updateTime || "-" }}
                  </template>
                </el-table-column>
                <!-- <el-table-column label="操作"
                  ><span slot-scope="scope" @click="Leveltwoinfo(scope.row)"
                    >查看详情</span
                  ></el-table-column
                >-->
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编号"></el-table-column>

          <el-table-column prop="location">
            <div
              slot="header"
              @click="sorttable('location')"
              :class="
                locationnumber == 1
                  ? 'ascending'
                  : locationnumber == 2
                  ? 'descending'
                  : ''
              "
            >
              <span>位置信息</span>
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </div>
            <!-- <template slot-scope="scope">{{
              scope.row.location == null ? "-" : scope.row.location
            }}</template>-->
          </el-table-column>
          <el-table-column label="在离线状态">
            <template slot-scope="scope">
              <i :class="scope.row.isOnline == 0 ? 'gray' : 'green'"></i>
              {{ scope.row.isOnline == 0 ? "离线" : "在线" }}
            </template>
          </el-table-column>
          <el-table-column prop="gatewayDeviceNumber">
            <div slot="header">
              <span>设备数量</span>
            </div>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="blue" @click="ckdrawer(scope.row)">查看详情</span>
              <span
                class="blue"
                @click="
                  deldialog = true;
                  delnum = 2;
                  deltabledata = scope.row;
                "
                >删除</span
              >
            </template>
          </el-table-column>
        </el-table>
        <el-drawer @open="opendrawer" title="网关信息" :visible.sync="drawer">
          <div class="info" v-if="drawerdata">
            <h4>基本信息</h4>
            <div class="buttoninfo">
              <button v-preventReClick="2000" @click="Selectinstallposition()">
                选择安装位置
              </button>
            </div>
            <ul v-if="drawerdata.deviceCache">
              <li>
                <label>设备编号:</label>
                {{ drawerdata.deviceCode }}
              </li>
              <li>
                <label>在离线状态:</label>
                <i :class="drawerdata.isOnline == 0 ? 'gray' : 'green'"></i>
                {{ drawerdata.isOnline == 0 ? "离线" : "在线" }}
              </li>
              <li>
                <label>设备名称:</label>
                {{ drawerdata.deviceName }}
              </li>
              <li>
                <label>当前版本号:</label>
                {{ drawerdata.deviceVersion }}
              </li>
              <li>
                <label>位置信息:</label>
                {{ drawerdata.location || "-" }}
              </li>
              <li>
                <label>设备芯片型号:</label>
                {{ drawerdata.deviceChip }}
              </li>
              <li>
                <label>注册时间:</label>
                {{ drawerdata.deviceRegisterTime }}
              </li>
              <li>
                <label>更新时间:</label>
                {{ drawerdata.updateTime }}
              </li>
              <li>
                <label>最近登录时间:</label>
                {{ drawerdata.deviceCache.lastLoginTime || "-" }}
              </li>
              <li>
                <label>最近离线时间:</label>
                {{ drawerdata.deviceCache.offlineTime || "-" }}
              </li>
            </ul>
          </div>
          <div class="list" v-if="drawerdata">
            <h4>记录列表</h4>
            <div class="code clearfix">
              设备编号:
              <span class="blue">{{ drawerdata.deviceCode }}</span>
            </div>
            <div class="time3">
              <div class="picker">
                <el-date-picker
                  v-model="ListstartTime"
                  :picker-options="pickerOptions"
                  type="date"
                  value-format="yyyy-MM-dd"
                  @change="test"
                  placeholder="选择开始时间"
                ></el-date-picker>
                <span>至</span>
                <el-date-picker
                  v-model="ListendTime"
                  type="date"
                  @change="test"
                  value-format="yyyy-MM-dd"
                  placeholder="选择结束时间"
                  :picker-options="pickerOptions2"
                  :disabled="ListstartTime == null"
                ></el-date-picker>
              </div>
              <div
                class="search"
                @click="
                  infoTotalCurrent = 1;
                  getoperatedetail();
                  dreawerloading = true;
                "
              >
                <i class="el-icon-search"></i>
              </div>
            </div>
            <ul class="listtab">
              <li
                v-for="(item, index) in listtexttab"
                :class="listtabnumber == index ? 'active' : ''"
                @click="
                  listtabnumber = index;
                  ListTime = [];
                  dreawerloading = true;
                  listtablecurrent = 1;
                  getoperatedetail();
                "
                :key="index"
              >
                {{ item }}
              </li>
            </ul>
            <table v-loading="dreawerloading">
              <tr v-if="listtabnumber == 0">
                <th>设备名称</th>
                <th>操作渠道</th>
                <th>操作类型</th>
                <th>操作人员账号</th>
                <th>操作人员姓名</th>
                <th>操作开始时间</th>
              </tr>
              <tr v-else>
                <th>设备状态</th>
                <th>操作时间</th>
              </tr>
              <template v-if="listtabnumber == 0">
                <template
                  v-if="
                    listAxiosdata.records !== undefined &&
                    listAxiosdata.records.length > 0
                  "
                >
                  <tr v-for="(item, index) in listAxiosdata.records" :key="index">
                    <td>{{ item.deviceName }}</td>
                    <td>{{ item.operateChannel }}</td>
                    <td>{{ item.operateAction }}</td>
                    <td>{{ item.userNumber }}</td>
                    <td>{{ item.userName }}</td>
                    <td>{{ item.operationStartTime || "-" }}</td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="6" class="center">暂无数据</td>
                </tr>
              </template>
              <template v-if="listtabnumber == 1">
                <template
                  v-if="
                    listAxiosdata.records !== undefined &&
                    listAxiosdata.records.length > 0
                  "
                >
                  <tr v-for="(item, index) in listAxiosdata.records" :key="index">
                    <td>{{ item.deviceStatus }}</td>
                    <td>{{ item.operationStartTime || "-" }}</td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="2" class="center">暂无数据</td>
                </tr>
              </template>
            </table>
            <el-pagination
              v-if="listAxiosdata"
              @current-change="Listtablechange"
              :current-page="listtablecurrent"
              :page-sizes="listtablesizes"
              :page-size="listtablesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="listAxiosdata.total"
            ></el-pagination>
          </div>
        </el-drawer>
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
    <el-dialog
      class="installpositon"
      title="选择安装位置"
      :visible.sync="SleectinstallDialog"
      @close="checkinstall"
    >
      <el-dialog
        title="系统提示"
        class="xtts"
        :visible.sync="TwoSelectDialogShoworHide"
        append-to-body
      >
        <div class="dialogcontent">
          <img src="../../../assets/images/system/zj.png" alt />
          <span>您确定要保存当前数据修改操作吗？</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-preventReClick="2000" @click="TwoSelectDialogShoworHide = false"
            >取 消</el-button
          >
          <el-button v-preventReClick="2000" type="primary" @click="TwoSelectDialog"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-tree
        :data="lefttree"
        :props="defaultProps"
        check-strictly
        @check-change="checkChange"
        @check="checktreechange"
        :default-expanded-keys="treecheckonetwolevel"
        :default-checked-keys="treecheckid"
        accordion
        show-checkbox
        node-key="id"
        ref="treeForm"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick="2000" @click="SleectinstallDialog = false"
          >取 消</el-button
        >
        <el-button
          v-preventReClick="2000"
          type="primary"
          @click="TwoSelectDialogShoworHide = true"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      class="deldialog"
      @close="delnum = 0"
      title="系统提示"
      :visible.sync="deldialog"
      center
    >
      <span>确认删除设备吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deldialog = false">取 消</el-button>
        <el-button type="primary" @click="Deldiaologmethods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
import utils from "../../../utils/utils";
export default {
  mixins: [sortmixin],
  name: "network",
  data() {
    return {
      tableloading: false,
      dreawerloading: false,
      deltabledata: null,
      delnum: 0,
      deldialog: false,
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
              new Date(this.ListstartTime).getTime() - 1 * 24 * 60 * 60 * 1000
          );
        },
      },
      TwoSelectDialogShoworHide: false, //第二次弹框
      SleectinstallDialog: false,
      listtablecurrent: 1,
      listtablesizes: [5],
      listtablesize: 5,
      ListstartTime: null,
      ListendTime: null, //时间选择器
      drawerdata: null, //抽屉数据
      // 时间选择器
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      listtexttab: ["操作记录", "设备上下线日志"], //抽屉记录列表 tab
      drawer: false,
      expands: [],
      getRowKeys(row) {
        return row.id;
      },
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      TableData: [], //表格数据
      TableCheckData: [], //table选中数据
      filtercheck: true, //筛选showorhide
      // 分配状态select
      fpselect: [
        { value: 0, label: "未分配" },
        { value: 1, label: "已分配" },
      ],
      fpvalue: null, //分配状态value
      user_name: null, //设备条件查询name
      onlinevalue: null, //是否在线value
      device_type:null,
      //是否在线select
      onlineselect: [
        { value: 1, label: "在线" },
        { value: 0, label: "离线" },
      ],
      // 网关类型
      device_type_select: [
        { value: 14, label: "sub433网关" },
        { value: 16, label: "modBus网关" },
        { value: 17, label: "485网关" },
        { value: 19, label: "zigBee网关" },
        { value: 25, label: "电控终端" },

      ],
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      treelayer: null, //树状图layer
      treeid: null, //树状图id
      LevelTwoTable: [], //二级表格数据
      listtabnumber: 0, //抽屉记录列表tab number
      listAxiosdata: {}, //抽屉记录列表请求数据
      LeftDataId: "", //选择安装位置所需的区域id
      treecheckonetwolevel: [],
      treecheckid: [],
      selecttree: [], //树状图数据未处理
      locationnumber: 0,
    };
  },
  activated() {
    this.AxiosTablepage();
  },
  created() {
    this.lddata(); //树状图数据
    this.AxiosTablepage();
  },
  methods: {
    Deldiaologmethods() {
      if (this.delnum == 1) {
        this.batchdel();
        this.deldialog = false;
      } else if (this.delnum == 2) {
        this.tabledel(this.deltabledata);
        this.deldialog = false;
      }
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.AxiosTablepage();
    },
    test() {
      if (this.ListstartTime == null) {
        this.ListendTime = null;
      }
    },
    checkinstall() {
      this.treecheckonetwolevel = null;
      this.treecheckid = null;
    },
    Selectinstallposition() {
      this.$nextTick(() => {
        this.$refs.treeForm.setCheckedKeys([]);
      });
      this.SleectinstallDialog = true;
      if (this.drawerdata.roomId == 0) {
        this.treecheckonetwolevel = null;
        this.treecheckid = null;
        this.$refs.treeForm.setCheckedKeys([]);
        this.SleectinstallDialog = true;
        return;
      }
      this.treecheckonetwolevel = [];
      this.treecheckid = [];
      let roomid = this.drawerdata.roomId;
      let fjid = "";
      let lcid = "";
      let ldid = "";
      let data = this.selecttree.filter((item) => {
        return item.id == roomid;
      });
      data.forEach((item) => {
        this.treecheckid.push(item.id);
        fjid = item.parentId;
      });
      let twolevel = this.selecttree.filter((item) => {
        return item.id == fjid;
      });
      twolevel.forEach((item) => {
        lcid = item.id;
      });
      let onelevel = this.selecttree.filter((item) => {
        return item.id == lcid;
      });
      onelevel.forEach((item) => {
        ldid = item.parentId;
      });
      this.treecheckonetwolevel.push(ldid, lcid);
    },
    checktreechange(data, node) {
      if (data.layer == 1 || data.layer == 2) {
        return;
      } else {
        if (node.checkedKeys !== undefined && node.checkedKeys.length > 0) {
          this.LeftDataId = data.id.replace(/[^0-9]/gi, "");
        } else {
          this.LeftDataId = null;
        }
      }
    },
    //点击选择位置树状图存取区域id
    checkChange(data, checked, node) {
      if (checked) {
        this.$refs.treeForm.setCheckedKeys([data.id]);
      }
    },
    alldel() {
      if (this.TableCheckData.length != 0) {
        this.deldialog = true;
        this.delnum = 1;
      } else {
        this.delnum = 0;
        this.$message.warning("您没有选中任何数据项");
      }
    },
    //  批量删除
    batchdel() {
      let deviceList = [];
      this.TableCheckData.forEach((item) => {
        deviceList.push(item.id);
      });
      let deviceType = this.TableCheckData[0].deviceType;
      let gatewayType = this.TableCheckData[0].gatewayType;
      this.$axios
        .post(
          "/device/remove?deviceList=" +
            deviceList +
            "&deviceType=" +
            deviceType +
            "&gatewayType=" +
            gatewayType
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.AxiosTablepage();
          } else {
            this.$message({
              message: "删除失败,请稍后重试!",
              type: "warning",
            });
            this.AxiosTablepage();
          }
        });
    },
    tabledel(row) {
      let deviceList = [row.id];
      let deviceType = row.deviceType;
      let gatewayType = row.gatewayType;
      this.$axios
        .post(
          "/device/remove?deviceList=" +
            deviceList +
            "&deviceType=" +
            deviceType +
            "&gatewayType=" +
            gatewayType
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.AxiosTablepage();
          } else {
            this.$message({
              message: "删除失败,请稍后重试!",
              type: "warning",
            });
            this.AxiosTablepage();
          }
        });
    },
    // 列添加背景
    addClass({ row, column, rowIndex, columnIndex }) {
      if (row.isOnline == 0) {
        return "background:#eeeeee";
      } else {
        return "";
      }
    },
    TwoSelectDialog() {
      this.LeftDataId == "" ? (this.LeftDataId = null) : this.LeftDataId;
      if (this.treecheckid == null && this.LeftDataId == null) {
        this.TwoSelectDialogShoworHide = false;
        this.SleectinstallDialog = false;
        return this.$message.warning("请先选择需要安装的房间!");
      } else if (
        this.treecheckid !== null &&
        this.treecheckid !== undefined &&
        this.treecheckid.length > 0 &&
        this.treecheckid[0] == this.LeftDataId
      ) {
        this.TwoSelectDialogShoworHide = false;
        this.SleectinstallDialog = false;
        return this.$message.warning("设备已安装到该房间,请勿重复操作!");
      } else if (this.treecheckid == null && this.LeftDataId !== null) {
        this.$axios
          .post("/device/deviceAreaDistribution", {
            roomId: this.LeftDataId,
            deviceCode: this.drawerdata.deviceCode,
            id: this.drawerdata.id,
            deviceType: this.drawerdata.deviceType,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("安装成功");
              this.AxiosTablepage();
              this.TwoSelectDialogShoworHide = false;
              this.SleectinstallDialog = false;
              this.drawer = false;
            } else {
              this.$message.warning(res.data.msg);
              this.TwoSelectDialogShoworHide = false;
              this.SleectinstallDialog = false;
            }
          })
          .catch((error) => {
            this.$message.warning(error.response.data.message);
            this.TwoSelectDialogShoworHide = false;
            this.SleectinstallDialog = false;
          });
      } else if (
        this.treecheckid !== undefined &&
        this.treecheckid.length > 0 &&
        this.LeftDataId == null
      ) {
        this.$axios
          .post("/device/deviceAreaDistribution", {
            deviceCode: this.drawerdata.deviceCode,
            deviceType: this.drawerdata.deviceType,
            id: this.drawerdata.id,
            roomId: 0,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("已将设备移出房间");
              this.treecheckonetwolevel = [];
              this.treecheckid = [];
              this.AxiosTablepage();
              this.TwoSelectDialogShoworHide = false;
              this.SleectinstallDialog = false;
              this.drawer = false;
            } else {
              this.$message.warning(res.data.msg);
              this.AxiosTablepage();
              this.TwoSelectDialogShoworHide = false;
              this.SleectinstallDialog = false;
            }
          });
      } else {
        this.$message.warning("请先将该设备移除房间,再勾选新房间");
        this.TwoSelectDialogShoworHide = false;
        this.SleectinstallDialog = false;
      }
    },
    Listtablechange(val) {
      this.listtablecurrent = val;
      this.getoperatedetail();
    },
    // 打开抽屉事件
    opendrawer() {
      this.getoperatedetail();
    },
    // 记录列表axios
    getoperatedetail() {
      if (this.listtabnumber == 0) {
        this.$axios
          .post("/iot/device/getOperateDetail", {
            current: this.listtablecurrent,
            endDate: this.ListendTime,
            startDate: this.ListstartTime,
            deviceType: 14,
            size: 5,
            deviceCode: this.drawerdata.deviceCode,
          })
          .then((res) => {
            this.listAxiosdata = res.data.rows;
            this.dreawerloading = false;
          });
      } else {
        this.$axios
          .post("/iot/device/getDeviceOnlineDetail", {
            current: this.listtablecurrent,
            endDate: this.ListendTime,
            startDate: this.ListstartTime,
            size: 5,
            deviceCode: this.drawerdata.deviceCode,
          })
          .then((res) => {
            this.listAxiosdata = res.data.rows;
            this.dreawerloading = false;
          });
      }
    },
    // 二级table查看详情
    // Leveltwoinfo(row) {
    //   this.drawerdata = row;
    // },
    ckdrawer(row) {
      row.createTime =
        row.createTime !== null ? utils.TimeChange(row.createTime) : row.createTime;
      row.updateTime =
        row.updateTime !== null ? utils.TimeChange(row.updateTime) : row.updateTime;
      row.deviceCache.lastLoginTime =
        row.deviceCache !== null && row.deviceCache.lastLoginTime !== null
          ? utils.timeToDate(row.deviceCache.lastLoginTime)
          : row.deviceCache.lastLoginTime;
      row.deviceCache.offlineTime =
        row.deviceCache !== null && row.deviceCache.offlineTime
          ? utils.timeToDate(row.deviceCache.offlineTime)
          : row.deviceCache.offlineTime;
      this.drawerdata = row;
      this.drawer = true;
    },
    // 分页
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.AxiosTablepage();
    },
    exChange(row, expandedRows) {
      let that = this;
      let arr = [];
      if (expandedRows.length) {
        that.expands = [];
        if (row) {
          that.expands.push(row.id);
        }
        this.$axios
          .post("/device/gateway/subDevices/list?gatewayCode=" + row.deviceCode)
          .then((res) => {
            arr.push(...res.data.rows);
            arr.forEach((item) => {
              item.updateTime = utils.TimeChange(item.updateTime);
            });
          });
        this.LevelTwoTable = arr;
      } else {
        that.expands = [];
        this.LevelTwoTable = [];
      }
    },
    sorttable(name) {
      this.tableloading = true;
      this.SortReady(name);
      this.AxiosSort(name).then((res) => {
        this.TableData = res.data.rows;
        this.locationnumber = this.sortnumber;
        this.tableloading = false;
      });
    },
    // 请求table数据
    AxiosTablepage() {
      this.tableloading = true;
      this.AxiosParams = {
        current: this.CurrentPage,
        size: this.PageSize,
        online: this.onlinevalue,
        layer: this.treelayer,
        deviceType: this.device_type,
        // deviceType: 14,
        areaId: this.treeid,
        deviceCode: this.user_name,
        allocationStatus: this.fpvalue,
        isGateway:1
      };
      console.log(this.AxiosParams.deviceType);
      console.log(typeof(this.AxiosParams.deviceType));

      this.SortNumberUpdate();
      this.SortUrl = "/device/page";
      this.$axios.post("/device/page", this.AxiosParams).then((res) => {
        if (res.data.code == 200) {
          console.log(res);
          console.log(res.data);
          this.TableData = res.data.rows;
          this.tableloading = false;
        } else {
          this.tableloading = false;
        }
      });
    },
    // 多选按钮选中存入数组
    handleSelectionChange(val) {
      this.TableCheckData = val;
    },
    // 筛选搜索
    search() {
      if (this.device_type == '' || this.device_type == null || this.device_type == undefined){
        this.device_type = null
      }
      if (this.onlinevalue === 0) {
        this.onlinevalue = parseInt(this.onlinevalue);
      } else if (this.onlinevalue === 1) {
        this.onlinevalue = parseInt(this.onlinevalue);
      } else {
        this.onlinevalue = null;
      }
      this.AxiosTablepage();
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.default_qj = !this.default_qj;
      this.treelayer = null;
      this.treeid = null;
      this.AxiosTablepage();
    },
    // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      let dataid = data.id.replace(/[^0-9]/gi, "");
      this.treelayer = data.layer;
      this.treeid = dataid;
      this.CurrentPage = 1;
      this.AxiosTablepage();
    }, //   处理树状图数据
    lddata() {
      this.$axios.get("/bus/common/building/select").then((res) => {
        let data = res.data;
        this.selecttree = res.data;
        let onelevel = data.filter((item) => {
          return item.layer == 1;
        });
        onelevel.forEach((item) => {
          item.disabled = true;
        });
        let twolevel = data.filter((item) => {
          return item.layer == 2;
        });
        twolevel.forEach((item) => {
          item.disabled = true;
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
    // 筛选重置
    Reset() {
      this.fpvalue = null;
      this.user_name = null;
      this.CurrentPage = 1;
      [this.locationnumber, this.sortnumber] = [0, 0, 0];
      this.fpvalue = null;
      this.onlinevalue = null;
      this.device_type = 14;
      this.AxiosTablepage();
    },
  },
};
</script>

<style lang="scss" scoped>
.deldialog {
  ::v-deep .el-dialog {
    width: 516px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.34);
    .el-dialog__header {
      background: #2d92ff;
      border-radius: 10px 10px 0 0;
      .el-dialog__title,
      .el-dialog__close {
        color: white;
      }
    }
    .el-dialog__body {
      text-align: center;
      font-size: 18px;
    }
  }
}
.xtts {
  ::v-deep .el-dialog {
    width: 438px;
    height: 218px;
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;

    .el-dialog__header {
      height: 46px;
      padding: 0;
      line-height: 46px;
      text-align: center;
      background: #2d92ff;
      border-radius: 10px 10px 0px 0px;
      .el-dialog__title {
        color: white;
      }
      button {
        top: 0;
        i {
          color: white;
        }
      }
    }
    .el-dialog__body {
      .dialogcontent {
        text-align: center;
        img {
          width: 50px;
          height: 50px;
        }
        span {
          color: #4a4a4a;
          display: inline-block;
          vertical-align: middle;
          padding-left: 20px;
        }
      }
    }
    .el-dialog__footer {
      text-align: center;
      padding: 0;
      button {
        width: 112px;
        height: 36px;
        border-radius: 3px;
      }
    }
  }
}
.gray {
  background: gray;
  display: inline-block;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  border-radius: 50%;
  margin-right: 3px;
}
.green {
  vertical-align: middle;
  background: #51c41b;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 3px;
}
::v-deep .el-drawer {
  width: 1000px !important;
  header {
    font-size: 16px;
    height: 45px;
    margin: 0;
    line-height: 45px;
    padding: 0 0 0 43px;
    font-family: $font-scse;
    font-weight: 600;
    text-align: left;
    color: #212d33;
    border-bottom: 1px solid #dbdbdd;
    i {
      font-size: 18px;
      color: #979797;
    }
  }
  .list {
    padding: 18px 30px 30px 45px;
    table {
      width: 100%;
      margin-top: 10px;
      th {
        background: $tablebg;
      }
      th,
      td {
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 14px;
      }
    }
    .blue {
      color: #2c9dff;
    }
    h4 {
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      color: #212d33;
    }
    .listtab {
      li {
        cursor: pointer;
        &:hover {
          color: #2c9dff;
        }
        display: inline-block;
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        padding: 0 15px 0 15px;
        &:first-child {
          padding-left: 0;
          border-right: 1px solid #dbdbdd;
        }
        &.active {
          color: #2c9dff;
        }
      }
    }
    .code {
      margin: 10px 0;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      color: #212d33;
      .fl {
        vertical-align: middle;
      }
    }
  }
  .info {
    padding: 18px 0 30px 45px;
    .buttoninfo {
      margin-top: 10px;
      button {
        height: 30px;
        padding: 0 8px;
        line-height: 30px;
        border: 1px solid #d9d9d9;
        background-color: white;
        border-radius: 3px;
        font-size: 14px;
        font-weight: 400;
        color: #262626;
        letter-spacing: 1px;
        &:hover {
          border: 1px solid #2d92ff;
          color: #2d92ff;
        }
      }
    }
    ul {
      li {
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        text-align: left;
        color: #212d33;
        display: inline-block;
        width: 50%;
        margin-top: 15px;
        label {
          display: inline-block;
          margin-right: 5px;
        }
        i {
          display: inline-block;
          width: 8px;
          vertical-align: middle;
          height: 8px;
          border-radius: 50%;
          margin-right: 3px;
        }
      }
    }
    h4 {
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      color: #212d33;
    }
    border-bottom: 1px solid #dbdbdd;
  }
}

.time3 {
  margin-bottom: 10px;
  vertical-align: middle;
  .picker {
    /deep/ .el-date-editor {
      input {
        height: 36px;
        line-height: 36px;
      }
    }
    > span {
      display: inline-block;
      margin: 0 5px;
      font-size: 14px;
    }
    vertical-align: middle;
    display: inline-block;
  }
  .search {
    vertical-align: middle;
    display: inline-block;
    width: 50px;
    height: 36px;
    background: #2d92ff;
    border-radius: 0px 16px 16px 0px;
    line-height: 36px;
    padding: 0 10px;
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #ffffff;
  }
}
::v-deep .el-pagination {
  text-align: center;
  margin-top: 15px;
}
/deep/ .el-table__expanded-cell {
  padding: 0 15px;
  text-align: center;
}
.tableData {
  ::v-deep .el-table {
    margin-top: 10px;
    .el-checkbox__inner {
      border: 1px solid #dbdbdb;
    }
    .el-table__header-wrapper {
      tr {
        height: 58px;
        border-radius: 1px;
        th {
          border-bottom: 0;
          background: $tablebg;
          font-size: 14px;
          font-family: $font-scme;
          font-weight: 600;
          color: #364147;
        }
      }
    }
    .el-table__body-wrapper {
      .el-table__body {
        .el-table__row {
          td {
            font-size: 14px;
            font-family: $font-scme;
            font-weight: 500;
            color: #364147;
            span:first-child {
              display: inline-block;
            }
            .blue {
              color: #2d92ff;
              cursor: pointer;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  .button {
    margin: 0;
  }
  border-radius: 8px;
  background: #ffffff;
  margin-top: 19px;
  padding: 20px 40px 20px 43px;
}
.middle_content {
  padding: 0 19px;
}
.right_content {
  width: 1350px;
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
        margin-right: 170px;
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
.installpositon {
  ::v-deep .el-dialog {
    width: 342px;
    height: 454px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.33);
    .el-dialog__header {
      height: 47px;
      line-height: 47px;
      background: #f1f9ff;
      padding: 0;
      border-radius: 8px 8px 0px 0px;
      .el-dialog__title {
        font-size: 19px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        display: inline-block;
        padding-left: 20px;
        color: #2b9cff;
        letter-spacing: 1px;
      }
      .el-dialog__headerbtn {
        top: 0;
      }
    }
    .el-dialog__body {
      overflow-y: auto;
      height: 350px;
    }
    .el-dialog__footer {
      padding: 0;
      padding-top: 10px;
      text-align: center;
      button {
        width: 112px;
        height: 36px;
        border-radius: 3px;
      }
    }
  }
}
</style>

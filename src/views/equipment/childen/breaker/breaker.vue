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
    <div class="filtrate">
      <div class="filtrate-heared">
        <div
          class="filtrate-title"
          :style="filtrateClick == false ? 'border-bottom: none;' : ''"
        >
          <div class="left">
            条件筛选
            <div class="right1 pointer" @click="filtrateClick = !filtrateClick">
              <div v-if="filtrateClick == true">
                <i class="el-icon-arrow-up"></i> 收起
              </div>
              <div v-if="filtrateClick == false">
                <i class="el-icon-arrow-down"></i> 展开
              </div>
            </div>
          </div>
        </div>
        <transition
          name="fade-transform"
          mode="out-in"
          v-if="filtrateClick == true"
        >
          <div class="filtrate-content clearfix">
            <div class="fl">
              <p>设备状态</p>
              <el-select clearable v-model="IsonlineValue" placeholder="请选择">
                <el-option
                  v-for="item in IsonlineSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="fl">
              <p>分配状态</p>
              <el-select clearable v-model="IsAllotValue" placeholder="请选择">
                <el-option
                  v-for="item in IsAllotSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="fl">
              <p>开合闸状态</p>
              <el-select clearable v-model="IsGateValue" placeholder="请选择">
                <el-option
                  v-for="item in IsonlineSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="fl">
              <p>设备id查询</p>
              <el-input
                clearable
                v-model="user_name"
                placeholder="请输入设备id"
              ></el-input>
            </div>
          </div>
        </transition>
        <transition
          name="fade-transform"
          mode="out-in"
          v-if="filtrateClick == true"
        >
          <div class="search butonnhover">
            <el-button
              type="primary"
              v-preventReClick="2000"
              @click="
                CurrentPage = 1;
                TableDataSearch();
              "
              >搜索</el-button
            ><el-button type="primary" v-preventReClick="2000" @click="reset"
              >重置</el-button
            >
          </div>
        </transition>
      </div>
      <div class="filtrate-table">
        <div class="button">
          <button v-preventReClick="2000" @click="AllOperate('lz')">
            开闸
          </button>
          <button v-preventReClick="2000" @click="AllOperate('hz')">
            合闸
          </button>
          <button v-preventReClick="2000" @click="AllOperate()" class="del">
            删除
          </button>
        </div>
        
        <el-table
          v-loading="tableloading"
          :data="TableData.records"
          tooltip-effect="dark"
          style="width: 100%"
          :cell-style="addClass"
          @selection-change="handleSelectionChange"
          class="content_table"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编号">
            <!-- <p>123e3de</p> -->
          </el-table-column>
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
              <span>位置信息</span
              ><span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </div>
          </el-table-column>
          <el-table-column label="在离线状态"> </el-table-column>
          <el-table-column label="开合闸状态"> </el-table-column>

          <el-table-column label="管控计划"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                class="bluefont"
                @click="
                  dialog = true;
                  detailshandle(scope.row);
                "
                >详情</span
              >
              <span
                class="bluefont"
                @click="domainManager(scope.row);"
                >域名配置</span
              >
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="SeeDetails"
                    >状态</el-dropdown-item
                  >
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <span
                class="bluefont"
                @click="
                  deldialog = true;
                  delnum = 2;
                  deltabledata = scope.row;
                "
                >更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span> -->
            </template>
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
    <el-drawer
      title="照明管理"
      @open="opendrawer"
      @close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      :with-header="true"
    >
      <div class="info">
        <h4>基本信息</h4>
        <div class="button">
          <button v-preventReClick="2000">选择安装位置</button>
        </div>
        <ul>
          <li><label>设备编号:</label><span>1231csdcd24</span></li>
          <li><label>在离线状态</label><span></span></li>
          <li>
            <label>线路号</label>
            <span>线路1</span>
          </li>
          <li>
            <label>类型:</label>
            <span>照明</span>
          </li>
          <li><label>位置信息:</label><span>-</span></li>
          <li><label>开合闸状态:</label><span>合闸</span></li>
          <li><label>注册时间:</label><span> 2021-07-05 14：28</span></li>
          <li><label>最近登录时间:</label><span>2021-07-05 14：30</span></li>
        </ul>
      </div>
      <div class="record-list" v-if="essentialinformation">
        <div class="record-list-title">
          <div class="text">记录列表</div>

          <div class="num clearfix">设备编号: <span>14234d</span></div>
        </div>
        <div class="time2">
          <div class="picker">
            <el-date-picker
              v-model="datestart"
              :picker-options="pickerOptions"
              type="date"
              value-format="yyyy-MM-dd"
              @change="test"
              placeholder="选择开始时间"
            >
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="dateend"
              type="date"
              @change="test"
              value-format="yyyy-MM-dd"
              placeholder="选择结束时间"
              :picker-options="pickerOptions1"
              :disabled="datestart == null"
            ></el-date-picker>
          </div>
          <div
            class="search"
            @click="
              ListannalCurrent = 1;
              OperateListtablesearch();
            "
          >
            <i class="el-icon-search"></i>
            查询
          </div>
        </div>
        <div class="record-list-tab">
          <div>
            <span
              :class="
                record_list_tab_num == index ? 'record-list-tab-handle' : ''
              "
              v-for="(item, index) in record_list_tab"
              :key="index"
              @click="
                drawerloading = false;
                record_list_tab_num = index;
                ListannalCurrent = 1;
                OperateListtablesearch();
                dateend = null;
                datestart = null;
              "
              >{{ item }}</span
            >
          </div>
        </div>
       
        <!-- tab 栏 -->
        <table class="Listannal" v-loading="drawerloading">
          <tr v-if="record_list_tab_num == 0">
            <td>线路名称</td>
            <td>类型</td>
            <td>位置</td>
            <td>在离线状态</td>
            <td>开合闸状态</td>
          </tr>
          <tr v-if="record_list_tab_num == 1">
            <td>线路名称</td>
            <td>类型</td>
            <td>位置</td>
            <td>报警类型</td>
            <td>报警时间</td>
          </tr>
          <tr v-if="record_list_tab_num == 2">
            <td>线路名称</td>
            <td>类型</td>
            <td>位置</td>
            <td>操作人</td>
            <td>开合闸</td>
            <td>操作时间</td>
          </tr>
          <template v-if="record_list_tab_num == 0">
            <tr>
              <td colspan="5">暂无数据</td>
            </tr></template
          >
          <template v-if="record_list_tab_num == 1">
            <tr>
              <td colspan="6">暂无操作数据</td>
            </tr></template
          >
        </table>
        <el-pagination
          @current-change="ListannalPage"
          :current-page="ListannalCurrent"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="5"
          layout="total,sizes, prev, pager, next, jumper"
          :total="OperateListtable.total"
        >
        </el-pagination>
      </div>
    </el-drawer>
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
          <img src="../../../../assets/images/system/zj.png" alt="" />
          <!-- <img src="../../../assets/images/system/zj.png" alt="" /> -->
          <span>您确定要保存当前数据修改操作吗？</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="TwoSelectDialogShoworHide = false"
            >取 消</el-button
          >
          <el-button
            type="primary"
            v-preventReClick="3000"
            @click="TwoSelectDialog"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-tree
        :data="lefttree"
        :props="defaultProps"
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
        <el-button @click="SleectinstallDialog = false">取 消</el-button>
        <el-button type="primary" @click="TwoSelectDialogShoworHide = true"
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
        <el-button
          v-preventReClick="3000"
          type="primary"
          @click="Deldiaologmethods"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  <el-dialog
    title="主站服务器地址设置"
    :visible.sync="dialogVisible"
    width="700px">
    <el-form :label-position="labeldirection" label-width="280px" :model="ruleForm"  ref="ruleForm" >
      <el-form-item label="主站服务器IP地址服务模式：">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label=0 >域名模式</el-radio>
          <el-radio label=1 >IP模式</el-radio>
        </el-radio-group>
      </el-form-item> 
      <el-form-item label="输入域名地址：" v-if="ruleForm.resource==0">
        <el-input v-model="ruleForm.name" style="width: 288px;"></el-input>
      </el-form-item>
      <el-form-item label="输入IP地址：" v-if="ruleForm.resource==1">
        <el-input v-model="ruleForm.name" style="width: 288px;"></el-input>
      </el-form-item>
      <el-form-item label="输入端口号：">
        <el-input v-model="ruleForm.name" style="width: 288px;"></el-input>
      </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import utils from "../../../../utils/utils";

export default {
  data() {
    return {
      essentialinformation: {
        deviceCache: {
          deviceCode: "f4ab230ea2",
          deviceDescription: "热水表-f4ab230ea2",
          deviceName: "热水表-f4ab230ea2",
          deviceRegisterTime: "2021-03-31 08:39:26",
          deviceType: 8,
          deviceVersion: "2.0",
          attributes: {
            ammeterType: 0,
            accountStatus: 0,
            batteryUnderVoltage: 0,
            blueToothId: "032a749bac",
            blueToothName: "032a749bac",
            controlType: null,
            deviceChip: "ESP32",
            deviceVersion: "1.2",
            emergencyFunction: false,
            feesChargedStatus: 0,
            isNormallyOpenMode: 1,
            protocolVersion: "1.0",
            summary: true,
          },
        },
      }, //基本信息数据
      TableData: {
        records: [
          {
            deviceCode: "040120000221",
            lineCode: "1",
            location: "天河荷光路照明",
          },
        ],
      },
      treecheckonetwolevel:[],
      treecheckonetwolevel:[],
      treecheckid:[],
      dialogVisible:false,
      labeldirection:'right',
      CurrentPage: 1,
      ListannalCurrent: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      filtercheck: true,
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      //域名配置对话框
      ruleForm:{
       name:'',
       resource:'0'
      },
      OperateListtable: [], //操作记录table
      TwoSelectDialogShoworHide: false,
      deldialog:false,
      // TableData: [], //表格数据
      filtrateClick: true,
      user_name: null,
      IsonlineValue: null,
      IsAllotValue: null,
      IsGateValue:null,
      IsAllotSelect: [
        { value: 0, label: "已分配" },
        { value: 1, label: "未分配" },
      ],
      IsonlineSelect: [
        { value: 0, label: "离线" },
        { value: 1, label: "在线" },
      ],
      IsGateSelect: [
        { value: 0, label: "开闸" },
        { value: 1, label: "合闸" },
      ],
      tableloading: false,
      locationnumber: 0,
      TableCheckData: [], //table选中数据
      drawerloading: false,
      SleectinstallDialog: false,

      // 抽屉数据
      // 抽屉
      table: false,
      dialog: false,
      loading: false,
      datestart: null,
      dateend: null,
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date();
        },
      },
      record_list_tab: ["线路列表","报警记录", "操作记录"],
      record_list_tab_num: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return (
            time.getTime() > Date.now() - 8.64e6 ||
            time.getTime() <
              new Date(this.datestart).getTime() - 1 * 24 * 60 * 60 * 1000
          );
        },
      },
      pickerOptions2: {
        disabledDate: (time) => {
          return (
            time.getTime() > Date.now() - 8.64e6 ||
            time.getTime() <
              new Date(this.PickerstartTime).getTime() - 1 * 24 * 60 * 60 * 1000
          );
        },
      },
    };
  },
  created() {
    this.lddata(); //树状图数据
    // this.AxiosTablepage();
  },
  methods: {
    // 抽屉
    handleClose() {
      this.datestart = null;
      this.dateend = null;
      this.dialog = false;
      this.loading = false;
    },
    test() {
      if (this.PickerstartTime == null) {
        this.PickerendTime = null;
      }
      if (this.datestart == null) {
        this.dateend = null;
      }
    },
    ListannalPage(val) {
      // this.ListannalCurrent = val;
      this.ListannalCurrent = 1;
      this.OperateListtablesearch();
    },
    // 点击域名配置
    domainManager(){
      this.dialogVisible=true
    },
    OperateListtablesearch() {
      console.log("11");
      this.drawerloading == false;
    },
    checkinstall() {
      this.treecheckonetwolevel = [];
      this.treecheckid = [];
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
            deviceCode: this.essentialinformation.deviceCode,
            deviceType: this.essentialinformation.deviceType,
            id: this.essentialinformation.id,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("安装成功");
              this.TwoSelectDialogShoworHide = false;
              this.SleectinstallDialog = false;
              this.TableDataSearch();
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
            deviceCode: this.essentialinformation.deviceCode,
            deviceType: this.essentialinformation.deviceType,
            id: this.essentialinformation.id,
            roomId: 0,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("已将设备移出房间");
              this.treecheckonetwolevel = [];
              this.treecheckid = [];
              this.TableDataSearch();
              this.TwoSelectDialogShoworHide = false;
              this.SleectinstallDialog = false;
              this.drawer = false;
            } else {
              this.$message.warning(res.data.msg);
              this.TableDataSearch();
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
     //点击选择位置树状图存取区域id
    checkChange(data, checked, node) {
      if (checked === true) {
        this.$refs.treeForm.setCheckedKeys([data.id]);
      } else {
        return false;
      }
    },
    checktreechange(data) {
      if (data.layer == 1 || data.layer == 2) {
        return;
      } else {
        this.LeftDataId = data.id.replace(/[^0-9]/gi, "");
      }
    },



    

    AllOperate(name) {
      if (this.TableCheckData.length <= 0) {
        return this.$message.warning("请先选择设备再进行操作!");
      }
      if (name == "lz") {
        this.OperateObject = {
          name: "ammeterControl",
          main: "zhubiao",
          status: "lazha",
          list: this.TableCheckData,
          Allorone: "all",
        };
      } else if (name == "hz") {
        this.OperateObject = {
          name: "ammeterControl",
          main: "zhubiao",
          status: "hezha",
          list: this.TableCheckData,
          Allorone: "all",
        };
      }
      this.OperateDialog = true;
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
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.layer = null;
      this.dataid = null;
      this.default_qj = !this.default_qj;
      // this.AxiosData();
    },
    // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      let dataid = data.id.replace(/[^0-9]/gi, "");
      this.treelayer = data.layer;
      this.treeid = dataid;
      this.CurrentPage = 1;
      // this.AxiosTablepage();
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
      // this.AxiosData();
    },
    reset() {
      this.CurrentPage = 1;
      this.fpvalue = null;
      this.user_name = null;
      this.CurrentPage = 1;
      [this.locationnumber, this.sortnumber] = [0, 0, 0];
      this.fpvalue = null;
      this.IsonlineValue = null;
      this.IsAllotValue = null;
      this.IsGateValue = null;
      this.AxiosTablepage();
    },
    // 列添加背景
    addClass({ row, column, rowIndex, columnIndex }) {
      if (row.isOnline == 0) {
        return "background:#eeeeee";
      } else {
        return "";
      }
    },
    // 多选按钮选中存入数组
    handleSelectionChange(val) {
      this.TableCheckData = val;
    },
    // 抽屉
    opendrawer() {
      console.log("打开抽屉");
    },
    detailshandle(row, index) {
      this.essentialinformation = row;
      this.drawerRoomid = row.roomId;
      if (this.essentialinformation.deviceCache) {
        this.essentialinformation.deviceCache.lastLoginTime = utils.timeToDate(
          this.essentialinformation.deviceCache.lastLoginTime
        );
      }
      if (this.essentialinformation.deviceCache) {
        if (this.essentialinformation.deviceCache.offlineTime != null) {
          this.essentialinformation.deviceCache.offlineTime = utils.timeToDate(
            this.essentialinformation.deviceCache.offlineTime
          );
        }
      }
      this.drawer = true;
    },
    Deldiaologmethods() {
      if (this.delnum == 1) {
        this.batchdel();
        this.deldialog = false;
      } else if (this.delnum == 2) {
        this.TableDel(this.deltabledata);
        this.deldialog = false;
      }
    },
    SeeDetails() {
      console.log("跳转");

      this.$router.push({
        name: "breaker_details",
        query: { id: 1 },
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.middle_content {
  padding: 0 19px;
}
.filtrate {
  width: 1350px;
  overflow: auto;
  float: right;
  .filtrate-heared {
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 0 20px;
    // border: 1px solid red;
    background-color: white;
    .filtrate-title {
      height: 50px;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      padding-top: 20px;
      border-bottom: 1px solid #dedede;
      .left {
        .right1 {
          font-weight: 400;
          float: right;
        }
      }
    }

    .search {
      text-align: center;
      padding: 32px 0;
      button {
        width: 80px;
        height: 36px;
        font-size: 14px;
        padding: 0;
        line-height: 36px;
        background: #2d92ff;
        border-radius: 5px;
      }
    }
    .filtrate-content {
      // height: 1000px;
      margin-top: 18px;
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
  }
  .filtrate-table {
    border-radius: 10px;
    background-color: #ffffff;
    padding: 0 20px;
    position: relative;
    .button {
      padding-top: 20px;
      button {
        margin-right: 10px;
        border: 0;
        color: #333333;
        font-size: 14px;
        width: 61px;
        height: 30px;
        background: #ffffff;
        border-radius: 5px;
        border: 1px solid #d9d9d9;
      }
      .del {
        background: #ff2020;
        color: #fff;
      }
    }
    /deep/ .el-pagination {
      padding: 20px 0;
    }
  }
  .reset-pop-up {
    position: fixed;
    top: 30%;
    left: 40%;
    z-index: 999;
    width: 380px;
    box-shadow: -3px 3px 5px #b6b6b6;
    border-radius: 20px 20px 0 0;
    .reset-pop-up-title {
      height: 40px;
      background-color: #2c9dff;
      border-radius: 20px 20px 0 0;
      line-height: 40px;
      text-align: center;
      color: white;
      padding: 0 10px;
      i {
        float: right;
        margin-top: 13px;
        cursor: pointer;
        font-size: 20px;
      }
    }
    .reset-pop-up-content {
      height: 160px;
      padding: 20px 0;
      background-color: white;

      ul {
        width: 200px;
        margin: 0 auto;
        position: relative;
        font-weight: 700;
        color: #525252;
        li {
          height: 40px;
          span {
            height: 100%;
            display: inline-block;
          }
          .reset_pop_up_style {
            background-color: #2c9dff;
          }
        }
        li:nth-child(2) {
          /deep/ .el-input__inner {
            display: inline-block;
            width: 100px;
            border: 2px solid #dddddd;
            border-radius: 5px;
            position: absolute;
            top: -67px;
            left: 100px;
          }
        }
        li:nth-child(3) {
          //  margin-top: 10px;
          span {
            width: 80px;
            height: 30px;
            // background-color: red;
            line-height: 30px;
            text-align: center;
            margin-right: 10px;
            border-radius: 5px;
            border: 2px solid #dddddd;
          }
        }
      }
    }
  }
  .filtrate-pop-up {
    position: fixed;
    top: 30%;
    left: 40%;
    z-index: 999;
    width: 380px;
    box-shadow: -3px 3px 5px #b6b6b6;
    border-radius: 20px 20px 0 0;
    .filtrate-pop-up-title {
      height: 40px;
      background-color: #2c9dff;
      border-radius: 20px 20px 0 0;
      line-height: 40px;
      text-align: center;
      color: white;
      padding: 0 10px;
      i {
        float: right;
        margin-top: 13px;
        cursor: pointer;
        font-size: 20px;
      }
    }
    .filtrate-pop-up-content {
      height: 160px;
      padding: 20px 0;
      background-color: white;

      ul {
        //  width: 200px;
        //  margin: 0 auto;
        position: relative;
        font-weight: 700;
        color: #525252;

        li {
          //  width: 100px;
          .filtrate-pop-up-content-img {
            width: 60px;
            height: 60px;
            margin-left: 40px;
            display: inline-block;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .filtrate-pop-up-content-text {
            margin-left: 20px;
          }
          //  height: 40px;
          span {
            height: 100%;
            display: inline-block;
          }
          .filtrate_pop_up_style {
            background-color: #2c9dff;
          }
        }
        li:nth-child(2) {
          margin-top: 20px;
          margin-left: 120px;
          span {
            width: 80px;
            height: 30px;
            // background-color: red;
            line-height: 30px;
            text-align: center;
            margin-right: 10px;
            border-radius: 5px;
            border: 2px solid #dddddd;
          }
        }
      }
    }
  }
}
::v-deep .el-dialog__body{
  border-bottom: 2px solid rgb(241, 241, 241);
  border-top: 2px solid rgb(241, 241, 241);
}
.content_table {
  ::v-deep .el-table__header-wrapper {
    tr {
      height: 58px;
      th {
        border-bottom: 0;
        background: $tablebg;
      }

      .cell {
        font-size: 14px;
        font-family: $font-scme;
        font-weight: 600;
        color: #364147;
      }
    }
  }
  ::v-deep .el-table__body-wrapper {
    .el-table__body {
      tr {
        height: 69px;
        .greenbackground {
          width: 44px;
          height: 24px;
          line-height: 24px;
          background: #79e46c;
          display: inline-block;
          border-radius: 2px;
          font-size: 14px;
          font-family: $font-scre;
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          letter-spacing: 2px;
        }
        .bluefont {
          font-size: 14px;
          cursor: pointer;
          font-family: $font-scre;
          font-weight: 400;
          display: inline-block;
          margin-left: 10px;
          color: #2d92ff;
        }
        .garybackground {
          width: 44px;
          height: 24px;
          background: #d8d8d8;
          line-height: 24px;
          display: inline-block;
          border-radius: 2px;
          font-size: 14px;
          text-align: center;
          font-family: $font-scre;
          font-weight: 400;
          color: #888888;
          letter-spacing: 2px;
        }
        .gray {
          width: 8px;
          height: 8px;
          background: #888888;
          border-radius: 50%;
          display: inline-block;
          margin-right: 3px;
        }
        .green {
          width: 8px;
          height: 8px;
          margin-right: 3px;
          background: #51c41b;
          border-radius: 50%;
          display: inline-block;
        }
        td {
          font-size: 14px;
          padding: 0;
          font-family: $font-scre;
          font-weight: 400;
          color: #212d33;
        }
      }
    }
  }
}
::v-deep .el-table__body-wrapper {
  .el-table__body {
    tr {
      height: 69px;
      .greenbackground {
        width: 44px;
        height: 24px;
        line-height: 24px;
        background: #79e46c;
        display: inline-block;
        border-radius: 2px;
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        letter-spacing: 2px;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
      .bluefont {
        font-size: 14px;
        cursor: pointer;
        font-family: $font-scre;
        font-weight: 400;
        display: inline-block;
        margin-left: 10px;
        margin-right: 10px;
        color: #2d92ff;
      }
      .garybackground {
        width: 44px;
        height: 24px;
        background: #d8d8d8;
        line-height: 24px;
        display: inline-block;
        border-radius: 2px;
        font-size: 14px;
        text-align: center;
        font-family: $font-scre;
        font-weight: 400;
        color: #888888;
        letter-spacing: 2px;
      }
      .gray {
        width: 8px;
        height: 8px;
        background: #888888;
        border-radius: 50%;
        display: inline-block;
        margin-right: 3px;
      }
      .green {
        width: 8px;
        height: 8px;
        margin-right: 3px;
        background: #51c41b;
        border-radius: 50%;
        display: inline-block;
      }
      td {
        font-size: 14px;
        padding: 0;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
      }
    }
  }
}
::v-deep .el-drawer {
  width: 1000px !important;
  min-height: 100vh;
  overflow: auto;
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

  .info {
    padding: 18px 0 30px 45px;
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
    .button {
      text-align: left;
      button {
        border: 0.00521rem solid #d9d9d9;
        background-color: white;
        color: #262626;
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
  .info {
    padding: 18px 0 30px 45px;
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
    .button {
      text-align: left;
      button {
        border: 0.00521rem solid #d9d9d9;
        background-color: white;
        color: #262626;
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
.record-list {
  width: 100%;
  padding: 18px 0 30px 45px;
  /deep/ .el-pagination {
    text-align: center;
    padding-top: 10px;
  }
  .record-list-title {
    margin-bottom: 20px;
    .text {
      font-size: 20px;
      font-family: $font-scme;
      font-weight: 700;
      color: #212d33;
      margin-bottom: 10px;
    }
    
    .num {
      padding-top: 10px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      > span {
        color: #2c9dff;
      }
    }
  }
  .record-list-tab {
    height: 40px;
    line-height: 40px;
    div:first-child {
      float: left;
      height: 40px;
      line-height: 40px;
    }
    .time2{
      
    }
    span {
      display: inline-block;
      padding: 0 8px;
      border-left: 1px solid #41545b;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #2c9dff;
      }
    }
    .record-list-tab-handle {
      color: #2c9dff;
    }
    span:first-child {
      border: none;
      padding-left: 0;
    }
  }

  .record-list-paging {
    width: 20%;
    margin: 10px auto;
    div {
      display: inline-block;
    }
    .paging-ico {
      cursor: pointer;
    }
  }
}
.time2 {
  margin-top: 10px;
  .picker {
    > span {
      display: inline-block;
      margin: 0 5px;
      font-size: 14px;
      border: none;
    }
    ::v-deep .el-date-editor {
      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
      .el-input__icon {
        line-height: 36px;
      }
    }
    vertical-align: middle;
    display: inline-block;
  }
  .search {
    vertical-align: middle;
    display: inline-block;
    width: 85px;
    height: 36px;
    background: #2c9dff;
    border-radius: 0px 16px 16px 0px;
    line-height: 36px;
    padding: 0 10px;
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #ffffff;
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
</style>
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
              <p>在离线状态</p>
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
              <p>按通讯类型查询</p>
              <el-select
                clearable
                v-model="gatewayTypeValue"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gatewayTypeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="fl">
              <p>按设备ID查询</p>
              <el-input
                clearable
                v-model="NameInput"
                placeholder="请输入设备ID"
              ></el-input>
            </div>
            <div class="fl fp">
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
          <button
            v-for="(item, index) in filtrate_table_button_value"
            :key="index"
            @click="filtrate_pop(index)"
            v-preventReClick="2000"
          >
            {{ item }}
          </button>
          <button v-preventReClick="2000" @click="alldel()">删除</button>
          <button class="jshidden" v-preventReClick="2000">导出</button>
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
          <el-table-column prop="deviceCode" label="设备ID"> </el-table-column>
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
          <el-table-column label="通讯类型">
            <template slot-scope="scope">{{
              scope.row.gatewayType == 0
                ? "无网关"
                : scope.row.gatewayType == 4
                ? "sub433网关"
                : scope.row.gatewayType == 6
                ? "nb直连"
                : "-"
            }}</template>
          </el-table-column>
          <el-table-column label="在离线状态">
            <template slot-scope="scope">
              <i :class="scope.row.isOnline == 1 ? 'green' : 'gray'"></i>
              <span>{{ scope.row.isOnline == 1 ? "在线" : "离线" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="阀门开关">
            <template slot-scope="scope">
              <span v-if="scope.row.deviceCache">{{
                scope.row.deviceCache.status.isOpen == 1 ? "开" : "关"
              }}</span>
              <span v-else>-</span>
            </template></el-table-column
          >
          <el-table-column label="阀门启禁用标识">
            <template slot-scope="scope">
              <span
                v-if="scope.row.deviceCache"
                :class="
                  scope.row.deviceCache.status.enable == true
                    ? 'greenbackground'
                    : 'garybackground'
                "
                >{{
                  scope.row.deviceCache.status.enable == true ? "启用" : "禁用"
                }}</span
              >
              <span v-else>-</span>
            </template></el-table-column
          >
          <el-table-column label="网关号">
            <template slot-scope="scope">
              <span
                v-if="scope.row.deviceCache && scope.row.deviceCache.gateway"
                >{{ scope.row.deviceCache.gateway.gatewayCode || "-" }}</span
              >
              <span v-else>-</span>
            </template></el-table-column
          >
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="bluefont" @click="detailshandle(scope.row)"
                >查看详情</span
              >
              <span
                class="bluefont"
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
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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
      @open="opendrawer"
      @close="closedrawer"
      :visible.sync="drawer"
      title="水表信息"
      :with-header="true"
    >
      <div class="info" v-if="essentialinformation">
        <h4>基本信息</h4>
        <div class="buttoninfo">
          <button v-preventReClick="2000" @click="Selectinstallposition">
            选择安装位置
          </button>
        </div>
        <ul>
          <li>
            <label>设备编号:</label
            ><span>{{ essentialinformation.deviceCode || "-" }}</span>
          </li>
          <li>
            <label>设备名称:</label>
            <span v-if="essentialinformation.deviceCache">{{
              essentialinformation.deviceCache.deviceName || "-"
            }}</span>
            <span v-else>-</span>
          </li>
          <li>
            <label>位置信息:</label
            ><span>{{ essentialinformation.location || "-" }}</span>
          </li>
          <li>
            <label>芯片型号:</label
            ><span>{{ essentialinformation.deviceChip || "-" }}</span>
          </li>
          <li>
            <label>版本号:</label
            ><span>{{ essentialinformation.deviceVersion || "-" }}</span>
          </li>
          <li>
            <label>所属网关:</label
            ><span>{{
              essentialinformation.gatewayType == 0
                ? "WIFI直连"
                : essentialinformation.gatewayType == 4
                ? "sub433"
                : essentialinformation.gatewayType == 6
                ? "NB直连"
                : "-"
            }}</span>
          </li>
          <li>
            <label>注册时间:</label
            ><span>{{ essentialinformation.deviceRegisterTime || "-" }}</span>
          </li>
          <li>
            <label>在离线状态:</label
            ><span
              ><i
                :class="essentialinformation.isOnline == 1 ? 'green' : 'gray'"
              ></i
              >{{
                essentialinformation.isOnline == true ? "在线" : "离线"
              }}</span
            >
          </li>
          <li>
            <label>阀门启禁标识:</label>
            <span
              v-if="essentialinformation.deviceCache"
              :class="
                essentialinformation.deviceCache.status.enable == false
                  ? 'details-right-label-gray'
                  : 'details-right-label-green'
              "
              >{{
                essentialinformation.deviceCache.status.enable == false
                  ? "禁用"
                  : "启用"
              }}</span
            >
            <span v-else>-</span>
          </li>
          <li>
            <label>网关号:</label>
            <span
              v-if="
                essentialinformation.deviceCache &&
                essentialinformation.deviceCache.gateway
              "
              >{{
                essentialinformation.deviceCache.gateway.gatewayCode || "-"
              }}</span
            >
            <span v-else>-</span>
          </li>
          <li>
            <label>阀门开关:</label>
            <span v-if="essentialinformation.deviceCache">{{
              essentialinformation.deviceCache.status.isOpen == 0
                ? "关闭"
                : "开启"
            }}</span>
            <span v-else>-</span>
          </li>
          <li>
            <label>最近登录时间:</label
            ><span v-if="essentialinformation.deviceCache">{{
              essentialinformation.deviceCache.lastLoginTime || "-"
            }}</span
            ><span v-else>-</span>
          </li>
          <li>
            <label>离线时间:</label
            ><span v-if="essentialinformation.deviceCache">{{
              essentialinformation.deviceCache.offlineTime || "-"
            }}</span
            ><span v-else>-</span>
          </li>
        </ul>
      </div>
      <div class="record jshidden" v-if="essentialinformation">
        <div class="record-title">用量记录</div>
        <div class="serial-number clearfix">
          <span>设备编号:</span>
          <span>{{ essentialinformation.deviceCode || "-" }}</span>
        </div>
        <div class="time3">
          <div class="picker">
            <el-date-picker
              v-model="PickerstartTime"
              :picker-options="pickerOptions"
              type="date"
              value-format="yyyy-MM-dd"
              @change="test"
              placeholder="选择开始时间"
            >
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="PickerendTime"
              type="date"
              @change="test"
              value-format="yyyy-MM-dd"
              placeholder="选择结束时间"
              :picker-options="pickerOptions2"
              :disabled="PickerstartTime == null"
            ></el-date-picker>
          </div>
          <div
            class="search"
            @click="
              infoTotalCurrent = 1;
              getInfoTableData();
            "
          >
            <i class="el-icon-search"></i>
          </div>
        </div>
        <div class="gross-right butonnhover clearfix">
          <div class="gross-left">
            <span>用水总量（吨）:</span><span>{{ energyTotalUse }}</span>
          </div>
          <button
            @click="
              getInfoTableData();
              drawerylloading = true;
            "
            class="gross-right-button"
            v-preventReClick="2000"
          >
            <i class="el-icon-refresh"></i>
            刷新
          </button>
          <button v-preventReClick="3000" class="jshidden gross-right-button">
            <i class="el-icon-folder-add"></i>
            导出
          </button>
        </div>
        <!-- 表单 -->
        <table class="record-table" v-loading="drawerylloading">
          <tr>
            <td>序号</td>
            <td>时间</td>
            <td>用水量(升)</td>
          </tr>
          <template
            v-if="
              InfoTableData.records !== undefined &&
              InfoTableData.records.length != 0
            "
          >
            <tr v-for="(item, index) in InfoTableData.records" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.useTime || "-" }}</td>
              <td>{{ item.useEnergy || "-" }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="3">暂无数据</td>
            </tr>
          </template>
        </table>
        <el-pagination
          @current-change="getinfoTotal"
          :current-page="infoTotalCurrent"
          :page-size="5"
          layout="total, prev, pager, next"
          :total="InfoTableData.total"
        >
        </el-pagination>
      </div>
      <div class="record-list" v-if="essentialinformation">
        <div class="record-list-title">
          <div class="text">记录列表</div>
          <div class="num clearfix">
            设备编号: <span>{{ essentialinformation.deviceCode }}</span>
          </div>
          <div class="time3">
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
            </div>
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
                drawerloading = true;
                record_list_tab_num = index;
                ListannalCurrent = 1;
                dateend = null;
                datestart = null;
                OperateListtablesearch();
              "
              >{{ item }}</span
            >
          </div>
        </div>
        <!-- tab 栏 -->
        <table class="Listannal" v-loading="drawerloading">
          <tr v-if="record_list_tab_num == 0">
            <th>操作渠道</th>
            <th>操作类型</th>
            <th>账号</th>
            <th>姓名</th>
            <th
              @click="sorttable('useHotWater')"
              :class="
                useHotWaternumber == 1
                  ? 'ascending'
                  : useHotWaternumber == 2
                  ? 'descending'
                  : ''
              "
            >
              用水量(升)
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th
              @click="sorttable('money')"
              :class="
                moneynumber == 1
                  ? 'ascending'
                  : moneynumber == 2
                  ? 'descending'
                  : ''
              "
            >
              消费金额
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th>操作开始时间</th>
            <th>操作结束时间</th>
          </tr>
          <tr v-else-if="record_list_tab_num == 1">
            <th>卡号</th>
            <th>用水方式</th>
            <th>用水量(升)</th>
            <th>操作开始时间</th>
            <th>操作结束时间</th>
          </tr>
          <tr v-else-if="record_list_tab_num == 2">
            <th>告警类型</th>
            <th>告警记录</th>
            <th>时间</th>
          </tr>
          <tr v-else-if="record_list_tab_num == 3">
            <th>设备状态</th>
            <th>上线/离线时间</th>
          </tr>
          <template
            v-if="
              OperateListtable1.records !== undefined &&
              OperateListtable1.records.length > 0 &&
              record_list_tab_num == 0
            "
          >
            <tr v-for="(item, index) in OperateListtable1.records" :key="index">
              <!-- 操作记录 -->
              <td>{{ item.operateChannel || "-" }}</td>
              <td>{{ item.operateAction || "-" }}</td>
              <td>{{ item.userNumber || "-" }}</td>
              <td>{{ item.userName || "-" }}</td>
              <td>{{ item.useHotWater }}</td>
              <td>{{ item.money }}</td>
              <td>
                {{ item.operationStartTime || "-" }}
              </td>
              <td>{{ item.operationEndTime || "-" }}</td>
            </tr>
          </template>
          <template
            v-else-if="
              OperateListtable2.records !== undefined &&
              OperateListtable2.records.length > 0 &&
              record_list_tab_num == 1
            "
          >
            <tr v-for="(item, index) in OperateListtable2.records" :key="index">
              <!-- 异常用水记录 -->
              <td>{{ item.cardCode || "-" }}</td>
              <td>
                {{
                  item.useType == 0
                    ? "刷卡用水"
                    : (item.useType = 1 ? "小程序用水" : "-")
                }}
              </td>
              <td>{{ item.useWater || "-" }}</td>
              <td>{{ item.useStartTime || "-" }}</td>
              <td>{{ item.useEndTime || "-" }}</td>
            </tr>
          </template>
          <template
            v-else-if="
              OperateListtable3.records !== undefined &&
              OperateListtable3.records.length > 0 &&
              record_list_tab_num == 2
            "
          >
            <tr v-for="(item, index) in OperateListtable3.records" :key="index">
              <!-- 告警记录 -->
              <td>{{ item.type || "-" }}</td>
              <td>{{ item.alarmInfo || "-" }}</td>
              <td>{{ item.alarmTime || "-" }}</td>
            </tr>
          </template>
          <template
            v-else-if="
              OperateListtable4.records !== undefined &&
              OperateListtable4.records.length > 0 &&
              record_list_tab_num == 3
            "
          >
            <tr v-for="(item, index) in OperateListtable4.records" :key="index">
              <!-- 上下线 -->
              <td>{{ item.deviceStatus || "-" }}</td>
              <td>
                {{ item.operationStartTime || "-" }}
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="8" class="center">暂无数据</td>
          </tr>
        </table>
        <el-pagination
          @current-change="ListannalPage"
          :current-page="ListannalCurrent"
          :page-size="5"
          layout="total, prev, pager, next"
          :total="
            record_list_tab_num == 0
              ? OperateListtable1.total
              : record_list_tab_num == 1
              ? OperateListtable2.total
              : record_list_tab_num == 2
              ? OperateListtable3.total
              : record_list_tab_num == 3
              ? OperateListtable4.total
              : ''
          "
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
          <img src="../../../assets/images/system/zj.png" alt="" />
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
        check-strictly
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
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
import utils from "../../../utils/utils";
export default {
  mixins: [sortmixin],
  data() {
    return {
      gatewayTypeValue: null,
      gatewayTypeSelect: [
        {
          label: "无网关",
          value: "0",
        },
        {
          label: "sub433网关",
          value: "2",
        },
        {
          label: "nb直连",
          value: "3",
        },
      ],
      locationnumber: 0,
      useHotWaternumber: 0,
      moneynumber: 0,
      deltabledata: null,
      delnum: 0,
      deldialog: false,
      drawerylloading: false,
      // 分配状态select
      fpselect: [
        { value: 0, label: "未分配" },
        { value: 1, label: "已分配" },
      ],
      fpvalue: null, //分配状态value
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
              new Date(this.PickerstartTime).getTime() - 1 * 24 * 60 * 60 * 1000
          );
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
      dateend: null,
      datestart: null,
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date();
        },
      },
      treecheckonetwolevel: [],
      treecheckid: [],
      // checkedId: "",
      clicktime: "", //日月年时间
      TwoSelectDialogShoworHide: false, //第二次弹框
      LeftDataId: "", //选择安装位置所需的区域id
      SleectinstallDialog: false,
      ListannalTime: [], //记录列表 time
      OperateListtable1: [], //操作记录table
      OperateListtable2: [], //操作记录table
      OperateListtable3: [], //操作记录table
      OperateListtable4: [], //操作记录table
      ListannalCurrent: 1, //记录列表
      infoTotalCurrent: 1, //用水总量页数
      TableData: [],
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据已处理
      selecttree: [], //树状图数据未处理
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      IsonlineSelect: [
        { value: 0, label: "离线" },
        { value: 1, label: "在线" },
      ],
      IsonlineValue: null,
      NameInput: "",
      filtrateClick: true,
      PickerstartTime: null,
      PickerendTime: null,
      filtrate_table_button_value: ["刷新", "下发水表参数配置"],
      record_list_tab: [
        "操作记录",
        "异常用水记录",
        "告警记录",
        "设备上下线日志",
      ],
      record_list_tab_num: 0,
      TableCheck: [], //多选单选框选择table数据
      treelayer: null, //树状图layer
      treeid: null, //树状图id
      essentialinformation: null, //基本信息数据
      InfoTableData: [], //用量记录table数据
      energyTotalUse: "", //用户记录 用水总量
      drawer: false, //抽屉显示隐藏
      drawerRoomid: null, //roomid
      tableloading: false, //表格刷新
      drawerloading: false, //抽屉表格刷新
    };
  },
  methods: {
    alldel() {
      if (this.TableCheck.length != 0) {
        this.deldialog = true;
        this.delnum = 1;
      } else {
        this.delnum = 0;
        this.$message.warning("您没有选中任何数据项");
      }
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
    closedrawer() {
      [
        this.locationnumber,
        this.moneynumber,
        this.sortnumber,
        this.useHotWaternumber,
      ] = [0, 0, 0, 0];
      this.datestart = null;
      this.dateend = null;
      this.TableDataSearch();
    },
    test() {
      if (this.PickerstartTime == null) {
        this.PickerendTime = null;
      }
      if (this.datestart == null) {
        this.dateend = null;
      }
    },
    checkinstall() {
      this.treecheckonetwolevel = [];
      this.treecheckid = [];
    },
    clicktimesearch() {
      var d = new Date(this.clicktime);
      let month = "";
      let day = "";
      if (d.getMonth() <= 9) {
        month = "0" + (d.getMonth() + 1);
      }
      if (d.getDate() <= 9) {
        day = "0" + d.getDate();
      }
      let date = d.getFullYear() + "-" + month + "-" + day;
    },
    // 刷新下发
    filtrate_pop(index) {
      if (index == 0) {
        this.tableloading = true;
        this.TableDataSearch();
      } else if (index == 1) {
        if (this.TableCheck.length != 0) {
          let deviceList = [];
          this.TableCheck.forEach((item) => {
            deviceList.push(item.deviceCode);
          });
          let gatewayType = this.TableCheck[0].gatewayType;
          let deviceType = this.TableCheck[0].deviceType;
          this.$axios
            .post(
              "/device/config?deviceList=" +
                deviceList +
                "&deviceType=" +
                deviceType +
                "&gatewayType=" +
                gatewayType
            )
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning",
                });
              }
            });
        } else {
          this.$message({
            message: "您没有选中任何数据项",
            type: "warning",
          });
        }
      }
    },
    //批量删除
    batchdel() {
      let deviceList = [];
      this.TableCheck.forEach((item) => {
        deviceList.push(item.id);
      });
      let deviceType = this.TableCheck[0].deviceType;
      let gatewayType = this.TableCheck[0].gatewayType;
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
            this.TableDataSearch();
          } else {
            this.$message({
              message: "删除失败,请稍后重试!",
              type: "warning",
            });
            this.TableDataSearch();
          }
        });
    },
    // 表格单击某列删除
    TableDel(row) {
      debugger;
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
            this.TableDataSearch();
          } else {
            this.$message({
              message: "删除失败,请稍后重试!",
              type: "warning",
            });
            this.TableDataSearch();
          }
        });
    },
    // 重置
    reset() {
      this.IsonlineValue = null;
      this.fpvalue = null;
      this.gatewayTypeValue = null;

      [
        this.locationnumber,
        this.moneynumber,
        this.sortnumber,
        this.useHotWaternumber,
      ] = [0, 0, 0, 0];
      this.NameInput = null;
      this.TableDataSearch();
    },
    opendrawer() {
      this.getInfoTableData(); //用量记录table
      this.OperateListtablesearch(); //操作记录table
    },
    // 抽屉
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
    addClass({ row, column, rowIndex, columnIndex }) {
      if (row.isOnline == 0) {
        return "background:#eeeeee";
      } else {
        return "";
      }
    },
    //点击选择位置树状图存取区域id
    Selectinstallposition() {
      this.$nextTick(() => {
        this.$refs.treeForm.setCheckedKeys([]);
      });
      if (this.essentialinformation.roomId == 0) {
        this.treecheckonetwolevel = null;
        this.treecheckid = null;
        this.$nextTick(() => {
          this.$refs.treeForm.setCheckedKeys([]);
        });
        this.SleectinstallDialog = true;
        return;
      }
      this.treecheckonetwolevel = [];
      this.treecheckid = [];
      let roomid = this.essentialinformation.roomId;
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
        lcid = item.parentId;
      });
      let onelevel = this.selecttree.filter((item) => {
        return item.id == lcid;
      });
      onelevel.forEach((item) => {
        ldid = item.id;
      });
      this.treecheckonetwolevel.push(ldid, fjid);
      this.SleectinstallDialog = true;
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
    // 选择记录状态时间
    ListannalTimecheck() {
      if (this.ListannalTime[0] != "")
        this.ListannalTime[0] = utils.Timestandard(this.ListannalTime[0]);
      if (this.ListannalTime[1] != "")
        this.ListannalTime[1] = utils.Timestandard(this.ListannalTime[1]);
    },
    sorttable(name) {
      if (this.drawer == true) {
        this.drawerloading = true;
      } else {
        this.tableloading = true;
      }
      this.SortReady(name);
      this.AxiosSort(name).then((res) => {
        if (this.drawer == true) {
          this.OperateListtable1 = res.data.rows;
          if (name == "money") {
            this.moneynumber = this.sortnumber;
            this.useHotWaternumber = 0;
          } else if (name == "useHotWater") {
            this.useHotWaternumber = this.sortnumber;
            this.moneynumber = 0;
          }
          this.drawerloading = false;
        } else {
          this.locationnumber = this.sortnumber;
          this.TableData = res.data.rows;
          this.tableloading = false;
        }
      });
    },
    // 操作记录table查询
    OperateListtablesearch() {
      this.drawerloading = true;
      if (this.record_list_tab_num == 0) {
        this.AxiosgetOperateDetail();
      } else if (this.record_list_tab_num == 1) {
        this.AxiosuseWaterList();
      } else if (this.record_list_tab_num == 2) {
        this.AxiosgetAlarmDetail();
      } else if (this.record_list_tab_num == 3) {
        this.AxiosgetDeviceOnlineDetail();
      }
    },
    ListannalPage(val) {
      this.ListannalCurrent = val;
      this.OperateListtablesearch();
    },
    // 用量记录table
    getInfoTableSearch() {
      this.$axios
        .post("/iot/device/hotWaterDetail", {
          current: this.infoTotalCurrent,
          size: 5,
          startDate: this.PickerstartTime,
          endDate: this.PickerendTime,
          deviceCode: this.essentialinformation.deviceCode,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.InfoTableData = res.data.rows;
            this.drawerylloading = false;
          } else {
            this.drawerylloading = false;
          }
        });
    },
    getInfoTableData() {
      this.getInfoTableSearch();
      this.getdetailstotal();
    },
    // 用量记录分页
    getinfoTotal(val) {
      this.infoTotalCurrent = val;
      this.getInfoTableData();
    },
    // 获取抽屉用水总量
    getdetailstotal() {
      this.$axios
        .post("/iot/device/hotWaterDetailTotal", {
          deviceCode: this.essentialinformation.deviceCode,
          startDate: this.PickerstartTime,
          endDate: this.PickerendTime,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.energyTotalUse = res.data.rows.energyTotalUse;
            this.drawerylloading = false;
          } else {
            this.drawerylloading = false;
          }
        });
    },
    // 获取表格数据
    TableDataSearch() {
      if (this.IsonlineValue === 0) {
        this.IsonlineValue = parseInt(this.IsonlineValue);
      } else if (this.IsonlineValue === 1) {
        this.IsonlineValue = parseInt(this.IsonlineValue);
      } else {
        this.IsonlineValue = null;
      }
      this.tableloading = true;
      this.AxiosParams = {
        current: this.CurrentPage,
        size: this.PageSize,
        deviceType: 8,
        online: this.IsonlineValue,
        layer: this.treelayer,
        areaId: this.treeid,
        deviceCode: this.NameInput,
        allocationStatus: this.fpvalue,
        gatewayType: this.gatewayTypeValue,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/device/page";
      this.$axios.post("/device/page", this.AxiosParams).then((res) => {
        if (res.data.code == 200) {
          console.log(res.data);
          this.tableloading = false;
          this.TableData = res.data.rows;
        } else {
          this.tableloading = false;
        }
      });
    },
    handleSelectionChange(val) {
      this.TableCheck = val;
    },
    //   处理树状图数据
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
        this.dialogtree = onelevel;
      });
    },
    // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      let dataid = data.id.replace(/[^0-9]/gi, "");
      this.treelayer = data.layer;
      this.CurrentPage = 1;
      this.treeid = dataid;
      this.TableDataSearch();
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.treelayer = null;
      this.treeid = null;
      this.default_qj = !this.default_qj;
      this.TableDataSearch();
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.TableDataSearch();
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.TableDataSearch();
    },
    // 设置上下线日志
    AxiosgetDeviceOnlineDetail() {
      this.$axios
        .post("/iot/device/getDeviceOnlineDetail", {
          current: this.ListannalCurrent,
          endDate: this.dateend,
          startDate: this.datestart,
          size: 5,
          deviceCode: this.essentialinformation.deviceCode,
        })
        .then((res) => {
          this.OperateListtable4 = res.data.rows;
          this.drawerloading = false;
        });
    },
    // 告警记录
    AxiosgetAlarmDetail() {
      this.$axios
        .post("/iot/device/getAlarmDetail", {
          current: this.ListannalCurrent,
          endDate: this.dateend,
          startDate: this.datestart,
          size: 5,
          deviceCode: this.essentialinformation.deviceCode,
        })
        .then((res) => {
          this.OperateListtable3 = res.data.rows;
          this.drawerloading = false;
        });
    },
    // 异常用水
    AxiosuseWaterList() {
      this.$axios
        .post("/iot/error/useWaterList", {
          current: this.ListannalCurrent,
          endDate: this.dateend,
          startDate: this.datestart,
          size: 5,
          deviceCode: this.essentialinformation.deviceCode,
          errorType: 0,
        })
        .then((res) => {
          this.OperateListtable2 = res.data.rows;
          this.drawerloading = false;
        });
    },
    // 操作记录
    AxiosgetOperateDetail() {
      this.AxiosParams = {
        current: this.ListannalCurrent,
        endDate: this.dateend,
        startDate: this.datestart,
        size: 5,
        deviceCode: this.essentialinformation.deviceCode,
        deviceType: 8,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/iot/device/getOperateDetail";
      this.$axios.post(this.SortUrl, this.AxiosParams).then((res) => {
        this.OperateListtable1 = res.data.rows;
        this.drawerloading = false;
      });
    },
  },
  activated() {
    this.TableDataSearch();
  },
  created() {
    this.lddata(); //树状图数据
    //查询数据
    this.TableDataSearch();
  },
  mounted() {},
  watch: {},
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
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      color: #212d33;
      margin-bottom: 10px;
    }
    .time3 {
      margin-top: 10px;
      .picker {
        > span {
          display: inline-block;
          margin: 0 5px;
          font-size: 14px;
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
    .num {
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      > span {
        color: #2c9dff;
      }
    }
  }
  .record-list-tab {
    span {
      display: inline-block;
      padding: 0 15px;
      border-right: 1px solid black;
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
    span:nth-child(4) {
      border: none;
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
.record {
  padding: 18px 0 30px 45px;
  border-bottom: 1px solid #efefef;
  .record-title {
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #212d33;
  }
  /deep/ .el-pagination {
    text-align: center;
    padding-top: 10px;
  }
  .time3 {
    margin-top: 10px;
    .picker {
      > span {
        display: inline-block;
        margin: 0 5px;
        font-size: 14px;
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
  .serial-number {
    margin-top: 10px;
    span {
      font-weight: 400;
      font-size: 14px;
    }
    > span:nth-child(2) {
      color: #4faeff;
    }
  }
  .gross-right {
    margin-top: 10px;
    button {
      float: right;
      vertical-align: middle;
    }
    .gross-left {
      text-align: left;
      float: left;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #212d33;
      span {
        font-weight: 500;
        &:last-child {
          display: inline-block;
          margin-left: 10px;
          font-size: 18px;
          font-weight: 500;
        }
      }
    }
    .gross-right-button {
      display: inline-block;
      width: 96px;
      height: 36px;
      border: 1px solid rgba(180, 180, 180, 0.56);
      border-radius: 5px;
      line-height: 36px;
      text-align: center;
      font-size: 12px;
      cursor: pointer;
    }
    .gross-right-button:nth-child(2) {
      background: #2d92ff;
      border: 0;
      margin-left: 4%;
      color: white;
      i {
        color: white;
      }
    }
  }
  .record-table {
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
    tr {
      height: 47px;
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
  .paging {
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
  .list {
    padding: 18px 30px 30px 45px;
    table {
      width: 100%;
      margin-top: 10px;
      tr {
        &:first-child {
          background: #2c9dff;
          td {
            font-size: 14px;
            font-family: $font-scme;
            font-weight: 500;
            color: #ffffff;
            letter-spacing: 2px;
          }
        }
        td {
          text-align: center;
          height: 38px;
        }
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
      margin: 10px 0 20px 0;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      color: #212d33;
      .el-date-editor {
        float: right;
        .el-range-separator {
          width: 9%;
        }
      }
    }
  }
  .details-right-label-gray {
    display: inline-block;
    padding: 3px 5px;
    margin-left: 5px;
    background-color: gray;
    color: white;
    font-size: 9px;
    font-weight: 500;
    text-align: center;
  }
  .details-right-label-green {
    display: inline-block;
    padding: 3px 5px;
    margin-left: 5px;
    background-color: #79e46c;
    color: white;
    font-size: 9px;
    font-weight: 500;
    text-align: center;
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
    .buttoninfo {
      margin: 10px 0 0 0;
      button {
        padding: 5px;
        border: 1px solid rgba(180, 180, 180, 0.56);
        border-radius: 5px;
        opacity: 0.8;
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        color: #243154;
        letter-spacing: 1px;
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
.tablebackgroundgray {
  background: #e5e5e5;
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
.Listannal {
  width: 100%;
  margin-top: 13px;
  th {
    font-family: $font-scme;
    background: $tablebg;
  }
  th,
  td {
    font-size: 14px;
    text-align: center;
    height: 45px;
    line-height: 45px;
  }
  tr {
    height: 45px;
    line-height: 45px;
  }
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
.middle_content {
  padding: 0 19px;
}
.filtrate {
  width: 1350px;
  overflow: auto;
  float: right;
  .filtrate-heared {
    margin-bottom: 20px;
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
      > div:nth-child(3n) {
        margin-right: 0;
      }
      .fl {
        // margin-top: 12px;
        margin-right: 170px;
        width: 323px;
        ::v-deep .el-select {
          width: 100%;
        }
        ::v-deep .el-date-editor {
          width: 314px;
          height: 36px;
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
      .fp {
        margin-top: 12px;
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
</style>

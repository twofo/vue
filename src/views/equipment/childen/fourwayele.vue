<template>
  <div class="middle_content clearfix">
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
          <p>按设备编号查询</p>
          <el-input clearable v-model="user_name" placeholder="请输入设备编号"></el-input>
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
        <button @click="AllOperate('lz')" v-preventReClick="2000">拉闸</button>
        <button @click="AllOperate('hz')" v-preventReClick="2000">合闸</button>
        <button @click="DeviceConfig()" v-preventReClick="2000">参数配置</button>
        
        <button v-preventReClick="2000" @click="alldel()">删除</button>
        <button class="jshidden" v-preventReClick="2000">导出</button>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="tableloading"
        :row-key="getRowKeys"
        :data="TableData.records"
        tooltip-effect="dark"
        :cell-style="addClass"
        :default-expand-all="false"
        :expand-row-keys="expands"
        @selection-change="handleSelectionChange"
        @expand-change="exChange"
        :default-sort="{ prop: 'registerTime' }"
      >
        <el-table-column type="expand">
          <el-table :data="LevelTwoTable">
            <el-table-column prop="deviceCode" label="设备编号"></el-table-column>
            <el-table-column prop="deviceName" label="设备名称"></el-table-column>
            <el-table-column prop="roomName" label="房间名称" sortable> </el-table-column>
            <el-table-column label="费控状态">
              <template slot-scope="scope" v-if="scope.row.deviceCache">
                <i
                  :class="
                    scope.row.deviceCache.attributes.feesChargedStatus == 0
                      ? 'gray'
                      : 'green'
                  "
                ></i>
                {{
                  scope.row.deviceCache.attributes.feesChargedStatus == 0
                    ? "关闭"
                    : "开启"
                }}
              </template>
            </el-table-column>
            <el-table-column label="闸门状态">
              <template slot-scope="scope" v-if="scope.row.deviceCache">
                {{ scope.row.deviceCache.status.isOpen == 0 ? "拉闸" : "合闸" }}
              </template>
            </el-table-column>
            <el-table-column label="所属功能">
              <template slot-scope="scope" v-if="scope.row.deviceCache">
                {{
                  scope.row.deviceCache.attributes.action == 0
                    ? "基本用电"
                    : scope.row.deviceCache.attributes.action == 1
                    ? "照明用电"
                    : scope.row.deviceCache.attributes.action == 2
                    ? "空调用电"
                    : "-"
                }}
              </template>
            </el-table-column>
            <el-table-column label="所属钱包">
              <template slot-scope="scope" v-if="scope.row.deviceCache">
                {{
                  scope.row.deviceCache.attributes.walletCode == 1
                    ? "钱包一"
                    : scope.row.deviceCache.attributes.walletCode == 2
                    ? "钱包二"
                    : scope.row.deviceCache.attributes.walletCode == 3
                    ? "钱包三"
                    : scope.row.deviceCache.attributes.walletCode == 4
                    ? "钱包四"
                    : "-"
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  class="fontblue"
                  @click="
                    ckdrawer(scope.row);
                    PrimarytableorChildtable = 2;
                  "
                  >查看详情</span
                >
                <el-dropdown class="fontblue">
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-loading.fullscreen.lock="fullscreenLoading"
                      @click.native="
                        OperateObject = {
                          name: 'ammeterControl',
                          list: scope.row,
                          status: 'lazha',
                          main: 'fubiao',
                          Allorone: 'one',
                        };
                        OperateDialog = true;
                      "
                      >拉闸</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-loading.fullscreen.lock="fullscreenLoading"
                      @click.native="
                        OperateObject = {
                          name: 'ammeterControl',
                          list: scope.row,
                          status: 'hezha',
                          main: 'fubiao',
                          Allorone: 'one',
                        };
                        OperateDialog = true;
                      "
                      >合闸</el-dropdown-item
                    >
                    
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-table-column>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="deviceCode" label="电表表号"></el-table-column>
        <el-table-column label="电表类型">
          <template slot-scope="scope">{{
            scope.row.ammeterType == 0
              ? "四相电表"
              : scope.row.ammeterType == 1
              ? "单路电表"
              : "-"
          }}</template>
        </el-table-column>
        <el-table-column label="在离线状态">
          <template slot-scope="scope" v-if="scope.row.deviceCache">
            <i
              :class="scope.row.deviceCache.status.online == true ? 'green' : 'gray'"
            ></i>
            {{ scope.row.deviceCache.status.online == true ? "在线" : "离线" }}
          </template>
        </el-table-column>
        <el-table-column label="电表模式">
          <template slot-scope="scope" v-if="scope.row.deviceCache">
            {{
              scope.row.deviceCache.attributes.summary == true
                ? "总表"
                : scope.row.deviceCache.attributes.summary == false
                ? "分表"
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="gatewayCode" label="网关编号"></el-table-column>
        <el-table-column label="网关类型">
          <template slot-scope="item">
            {{
              item.row.gatewayType == 0
                ? "无网关"
                : item.row.gatewayType == 1
                ? "485网关"
                : item.row.gatewayType == 2
                ? "zigbee"
                : item.row.gatewayType == 3
                ? "modbus网关"
                : item.row.gatewayType == 4
                ? "sub433网关"
                : item.row.gatewayType == 5
                ? "ecmt网关"
                : item.row.gatewayType == 6
                ? "nb直连"
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" sortable></el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="fontblue"
              @click="
                ckdrawer(scope.row);
                PrimarytableorChildtable = 1;
              "
              >查看详情</span
            >
            <el-dropdown class="fontblue">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="
                    deldialog = true;
                    delnum = 2;
                    deltabledata = scope.row;
                  "
                  >删除</el-dropdown-item
                >
                <el-dropdown-item
                  v-loading.fullscreen.lock="fullscreenLoading"
                  @click.native="
                    OperateObject = {
                      name: 'ammeterControl',
                      list: scope.row,
                      status: 'lazha',
                      main: 'zhubiao',
                      Allorone: 'one',
                    };
                    OperateDialog = true;
                  "
                  >拉闸</el-dropdown-item
                >
                <el-dropdown-item
                  v-loading.fullscreen.lock="fullscreenLoading"
                  @click.native="
                    OperateObject = {
                      name: 'ammeterControl',
                      list: scope.row,
                      status: 'hezha',
                      main: 'zhubiao',
                      Allorone: 'one',
                    };
                    OperateDialog = true;
                  "
                  >合闸</el-dropdown-item
                >
                
                <el-dropdown-item
                  v-loading.fullscreen.lock="fullscreenLoading"
                  @click.native="DataInquire(scope.row.deviceCode)"
                  >数据查询</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-drawer @open="opendrawer" title="电表信息" :visible.sync="drawer">
        <div class="info" v-if="drawerdata">
          <h4>基本信息</h4>
          <div class="button" v-if="PrimarytableorChildtable == 2">
            <button v-preventReClick="2000" @click="Selectinstallposition()">
              选择安装位置
            </button>
          </div>
          <ul v-if="drawerdata.deviceCache">
            <li>
              <label>设备编号:</label><span>{{ drawerdata.deviceCode || "-" }}</span>
            </li>
            <li>
              <label>设备类型:</label
              ><span>{{
                drawerdata.deviceCache.attributes.ammeterType == 0
                  ? "双路电表"
                  : drawerdata.deviceCache.attributes.ammeterType == 1
                  ? "单路电表"
                  : drawerdata.deviceCache.attributes.ammeterType == 2
                  ? "三相电表"
                  : drawerdata.deviceCache.attributes.ammeterType == 3
                  ? "组合电表"
                  : "-"
              }}</span>
            </li>
            <li>
              <label>是否为总表:</label>
              <span>{{
                drawerdata.deviceCache.attributes.summary == true ? "是" : "否"
              }}</span>
            </li>
            <li>
              <label>设备名称:</label>
              <span v-if="drawerdata.deviceCache">{{
                drawerdata.deviceCache.deviceName || "-"
              }}</span>
              <span v-else>-</span>
            </li>
            <li v-if="PrimarytableorChildtable == 2">
              <label>位置信息:</label><span>{{ drawerdata.location || "-" }}</span>
            </li>
            <li>
              <label>所属网关:</label
              ><span>{{
                drawerdata.gatewayType == 0
                  ? "WIFI直连"
                  : drawerdata.gatewayType == 1
                  ? "zigbee"
                  : drawerdata.gatewayType == 2
                  ? "485"
                  : drawerdata.gatewayType == 3
                  ? "modbus"
                  : drawerdata.gatewayType == 4
                  ? "sub433"
                  : drawerdata.gatewayType == 5
                  ? "ECMT"
                  : drawerdata.gatewayType == 6
                  ? "NB直连"
                  : "-"
              }}</span>
            </li>
            <li>
              <label>注册时间:</label
              ><span>{{ drawerdata.deviceRegisterTime || "-" }}</span>
            </li>
            <li>
              <label>连接类型:</label
              ><span>{{
                drawerdata.gatewayType == 0
                  ? "WIFI直连"
                  : drawerdata.gatewayType == 1
                  ? "zigbee"
                  : drawerdata.gatewayType == 2
                  ? "485"
                  : drawerdata.gatewayType == 3
                  ? "modbus"
                  : drawerdata.gatewayType == 4
                  ? "sub433"
                  : drawerdata.gatewayType == 5
                  ? "ECMT"
                  : drawerdata.gatewayType == 6
                  ? "NB直连"
                  : "-"
              }}</span>
            </li>
            <li>
              <label>在离线状态:</label
              ><span
                ><i
                  :class="drawerdata.deviceCache.status.online == true ? 'green' : 'gray'"
                ></i
                >{{
                  drawerdata.deviceCache.status.online == true ? "在线" : "离线"
                }}</span
              >
            </li>

            <li>
              <label>所属网关:</label>
              <!-- <span> {{drawerdata.deviceCache}}</span> -->
              <!-- <span v-if="drawerdata.deviceCache.deviceType">{{
                drawerdata.deviceCache.deviceType || "-"
              }}</span> -->
              <span  v-if="drawerdata.deviceCache.deviceType">
                {{
                  drawerdata.deviceCache.deviceType == 1
                  ? '电控'
                  :drawerdata.deviceCache.deviceType == 2
                  ? '冷水表'
                  :drawerdata.deviceCache.deviceType == 3
                  ? '消费机'
                  :drawerdata.deviceCache.deviceType == 4
                  ? '电控'
                  :drawerdata.deviceCache.deviceType == 5
                  ? '灯控'
                  :drawerdata.deviceCache.deviceType == 6
                  ? '酒店锁'
                  :drawerdata.deviceCache.deviceType == 7
                  ? '消防锁'
                  :drawerdata.deviceCache.deviceType == 8
                  ? '热水表'
                  :drawerdata.deviceCache.deviceType == 14
                  ? 'sub433网关'
                  :drawerdata.deviceCache.deviceType == 15
                  ? '中继器'
                  :drawerdata.deviceCache.deviceType == 16
                  ? 'modBus网关'
                  :drawerdata.deviceCache.deviceType == 17
                  ? '485网关'
                  :drawerdata.deviceCache.deviceType == 19
                  ? 'zigBee网关'
                  :drawerdata.deviceCache.deviceType == 20
                  ? '身份核验终端'
                  :drawerdata.deviceCache.deviceType == 21
                  ? '自助服务终端'
                  :drawerdata.deviceCache.deviceType == 22
                  ? '考勤机终端'
                  :drawerdata.deviceCache.deviceType == 23
                  ? '实训室门禁终端'
                  :drawerdata.deviceCache.deviceType == 24
                  ? '消防门禁终端'
                  :drawerdata.deviceCache.deviceType == 25
                  ? '电控终端'
                  :drawerdata.deviceCache.deviceType == 26
                  ? '人脸核验机'
                  :drawerdata.deviceCache.deviceType == 27
                  ? '舞蹈房门禁终端'
                  :'-'
                }}
              </span>
              <span v-else></span>
            </li>
            <li>
              <label>费控状态:</label>
              <i
                :class="
                  drawerdata.deviceCache.attributes.feesChargedStatus == 0
                    ? 'gray'
                    : 'green'
                "
              ></i>
              <span>{{
                drawerdata.deviceCache.attributes.feesChargedStatus == 0
                  ? "未开启"
                  : "已开启"
              }}</span>
            </li>
            <li>
              <label>账户状态:</label>
              <span>{{
                drawerdata.deviceCache.attributes.accountStatus == 0
                  ? "未开启"
                  : drawerdata.deviceCache.attributes.accountStatus == 1
                  ? "已开启"
                  : drawerdata.deviceCache.attributes.accountStatus == 2
                  ? "已销户"
                  : "-"
              }}</span>
            </li>
            <li>
              <label>运行模式:</label>
              <span>{{
                drawerdata.deviceCache.attributes.accountStatus == 1
                  ? "后付费模式"
                  : drawerdata.deviceCache.attributes.accountStatus == 2
                  ? "预付费模式"
                  : "-"
              }}</span>
            </li>
            <li>
              <label>最近登录时间:</label
              ><span v-if="drawerdata.deviceCache">{{
                drawerdata.deviceCache.lastLoginTime || "-"
              }}</span
              ><span v-else>-</span>
            </li>
            <li>
              <label>离线时间:</label
              ><span v-if="drawerdata.deviceCache">{{
                drawerdata.deviceCache.offlineTime || "-"
              }}</span
              ><span v-else>-</span>
            </li>
          </ul>
        </div>
        <div class="record" v-if="drawerdata">
          <h4>用量记录</h4>
          <div class="code">
            设备编号:<span class="fontblue">{{ drawerdata.deviceCode }}</span>
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
          <div class="Total clearfix butonnhover">
            <div class="fl">
              用电总量(度):<span>{{ energyTotalUse || 0 }}</span>
            </div>
            <button class="fr jshidden">导出</button>
            <button
              v-preventReClick="2000"
              class="fr"
              @click="
                getInfoTableData();
                drawerylloading = true;
              "
            >
              <i class="el-icon-refresh"></i>刷新
            </button>
          </div>
          <table v-loading="drawerylloading">
            <tr>
              <th>序号</th>
              <th>时间</th>
              <th>用电量(度)</th>
            </tr>
            <template
              v-if="
                InfoTableData.records !== undefined && InfoTableData.records.length > 0
              "
            >
              <tr v-for="(item, index) in InfoTableData.records" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.useTime || "-" }}</td>
                <td>{{ item.useEnergy || "-" }}</td>
              </tr>
            </template>
            <tr v-else>
              <td class="center" colspan="3">暂无数据</td>
            </tr>
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
        <div class="list" v-if="drawerdata">
          <h4>记录列表</h4>
          <div class="code clearfix">
            设备编号:
            <span class="fontblue">{{ drawerdata.deviceCode }}</span>
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
              <td>设备名称</td>
              <td>操作渠道</td>
              <td>操作类型</td>
              <td>操作人员账号</td>
              <td>操作人员姓名</td>
              <td>操作开始时间</td>
              <td>操作结束时间</td>
            </tr>
            <tr v-else>
              <td>设备状态</td>
              <td>操作时间</td>
            </tr>
            <template v-if="listtabnumber == 0">
              <template
                v-if="
                  listAxiosdata.records !== undefined && listAxiosdata.records.length > 0
                "
              >
                <tr v-for="(item, index) in listAxiosdata.records" :key="index">
                  <td>{{ item.deviceName }}</td>
                  <td>{{ item.operateChannel }}</td>
                  <td>{{ item.operateAction }}</td>
                  <td>{{ item.userNumber }}</td>
                  <td>{{ item.userName }}</td>
                  <td>{{ item.operationStartTime || "-" }}</td>
                  <td>{{ item.operationEndTime || "-" }}</td>
                </tr>
              </template>
            </template>
            <template v-if="listtabnumber == 1">
              <template
                v-if="
                  listAxiosdata.records !== undefined && listAxiosdata.records.length > 0
                "
              >
                <tr v-for="(item, index) in listAxiosdata.records" :key="index">
                  <td>{{ item.deviceStatus }}</td>
                  <td>{{ item.operationStartTime || "-" }}</td>
                </tr>
              </template>
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
        <el-button v-preventReClick="5000" type="primary" @click="Deldiaologmethods"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      class="Featuresormoneydialog"
      center
      title="系统提示"
      :visible.sync="OperateDialog"
    >
      <div v-if="OperateObject.list && OperateObject.Allorone == 'one'">
        确定将{{ OperateObject.list.deviceCode }}电表{{
          OperateObject.status == "lazha"
            ? "拉闸"
            : OperateObject.status == "hezha"
            ? "合闸"
            : "-"
        }}吗?
      </div>
      <div v-if="OperateObject.list && OperateObject.Allorone == 'all'">
        确定将选中设备{{
          OperateObject.status == "lazha"
            ? "拉闸"
            : OperateObject.status == "hezha"
            ? "合闸"
            : "-"
        }}吗?
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick="2000" @click="OperateDialog = false"
          >取 消</el-button
        >
        <el-button v-preventReClick="2000" type="primary" @click="OperateFunction"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      class="DataInquireDialog"
      center
      title="电表数据"
      :visible.sync="DataInquireDialog"
    >
    <!-- <div>1111</div> -->
      <table
        v-if="
          DatainquireAmmeters !== undefined &&
          DatainquireAmmeters.length > 0
        "
      >
        <tr>
          <td>电表表号</td>
          <td>路数</td>
          <td>电量</td>
          <td>在离线状态</td>
          <!-- <td>路数</td> -->
          <td>功率(KW)</td>
          <td>闸门状态</td>
          <!-- <td>费控状态</td>
          <td>电量(KW/H)</td>
          <td>功率(KW)</td>
          <td>余额(元)</td>
          <td>充值总额(元)</td> -->
        </tr>
        <tr v-for = "(item, index) in DataInquireJson" :key = "index">
          <td>{{ Object.keys(DataInquireJson)[0] }} </td>
          <td> 一路</td>
          <td>{{item.electric[0]}}</td>
          <td><span
                ><i
                  :class="item.online == true ? 'green' : 'gray'"
                ></i
                >{{
                  item.online == true ? "在线" : "离线"
                }}</span
              > </td>
              <td>
                {{item.power[0]}}
              </td>
                            <td>{{item.controlState[3] == 1 ? '合闸' : '拉闸'}}</td>


        </tr>
        <tr v-for = "(item, index) in DataInquireJson" :key = "index">
          <!-- <td>{{ DataInquireJson.keys }} </td> -->
          <td>{{ Object.keys(DataInquireJson)[0] }} </td>

          <td> 二路</td>
          <td>{{item.electric[1]}}</td>
          <td><span
                ><i
                  :class="item.online == true ? 'green' : 'gray'"
                ></i
                >{{
                  item.online == true ? "在线" : "离线"
                }}</span
              > </td>
              <td>
                {{item.power[1]}}
              </td>
                            <td>{{item.controlState[3] == 1 ? '合闸' : '拉闸'}}</td>



        </tr>
        <tr v-for = "(item, index) in DataInquireJson" :key = "index">
          <td>{{ Object.keys(DataInquireJson)[0] }} </td>

          <!-- <td>{{ DataInquireJson.keys }} </td> -->
          <td> 三路</td>
          <td>{{item.electric[2]}}</td>
          <td><span
                ><i
                  :class="item.online == true ? 'green' : 'gray'"
                ></i
                >{{
                  item.online == true ? "在线" : "离线"
                }}</span
              > </td>
              <td>
                {{item.power[2]}}
              </td>
              <td>{{item.controlState[3] == 1 ? '合闸' : '拉闸'}}</td>


        </tr>
        <tr v-for = "(item, index) in DataInquireJson" :key = "index">
          <td>{{ Object.keys(DataInquireJson)[0] }} </td>

          <!-- <td>{{ DataInquireJson.keys }} </td> -->
          <td> 四路</td>
          <td>{{item.electric[3]}}</td>
          <td><span
                ><i
                  :class="item.online == true ? 'green' : 'gray'"
                ></i
                >{{
                  item.online == true ? "在线" : "离线"
                }}</span
              > </td>
              <td>
                {{item.power[3]}}

              </td>
              <td>{{item.controlState[3] == 1 ? '合闸' : '拉闸'}}</td>

        </tr>
          <!-- <td>{{ DatainquireAmmeters[0].deviceName }}</td> -->
          <!-- <td>
            {{
              DatainquireAmmeters[0].deviceCache.attributes.walletCode == 1
                ? "钱包一"
                : DatainquireAmmeters[0].deviceCache.attributes.walletCode == 2
                ? "钱包二"
                : DatainquireAmmeters[0].deviceCache.attributes.walletCode == 3
                ? "钱包三"
                : DatainquireAmmeters[0].deviceCache.attributes.walletCode == 4
                ? "钱包四"
                : "-"
            }}
          </td> -->
          <!-- <td>{{ DataInquireJson.account[0] == 1 ? "未销户" : "销户" }}</td>
          <td>{{ DataInquireJson.controlState[0] == 1 ? "拉闸" : "合闸" }}</td>
          <td>{{ DataInquireJson.feeState[0] == 1 ? "开启" : "关闭" }}</td>
          <td>{{ DataInquireJson.electric[0] }}</td>
          <td>{{ DataInquireJson.power[0] }}</td>
          <td>{{ DataInquireJson.balance[0] }}</td>
          <td>{{ DataInquireJson.totalAmount[0] }}</td>
        </tr>
        <tr>
          <td>{{ DatainquireAmmeters[1].deviceName }}</td>
          <td>
            {{
              DatainquireAmmeters[1].deviceCache.attributes.walletCode == 1
                ? "钱包一"
                : DatainquireAmmeters[1].deviceCache.attributes.walletCode == 2
                ? "钱包二"
                : DatainquireAmmeters[1].deviceCache.attributes.walletCode == 3
                ? "钱包三"
                : DatainquireAmmeters[1].deviceCache.attributes.walletCode == 4
                ? "钱包四"
                : "-"
            }} -->
          <!-- </td>
          <td>{{ DataInquireJson.account[1] == 1 ? "未销户" : "销户" }}</td>
          <td>{{ DataInquireJson.controlState[1] == 1 ? "拉闸" : "合闸" }}</td>
          <td>{{ DataInquireJson.feeState[1] == 1 ? "开启" : "关闭" }}</td>
          <td>{{ DataInquireJson.electric[1] }}</td>
          <td>{{ DataInquireJson.power[1] }}</td>
          <td>{{ DataInquireJson.balance[1] }}</td>
          <td>{{ DataInquireJson.totalAmount[1] }}</td> -->
        <!-- </tr> -->
        <!-- <tr>
          <td>{{ DatainquireAmmeters[2].deviceName }}</td>
          <td>
            {{
              DatainquireAmmeters[2].deviceCache.attributes.walletCode == 1
                ? "钱包一"
                : DatainquireAmmeters[2].deviceCache.attributes.walletCode == 2
                ? "钱包二"
                : DatainquireAmmeters[2].deviceCache.attributes.walletCode == 3
                ? "钱包三"
                : DatainquireAmmeters[2].deviceCache.attributes.walletCode == 4
                ? "钱包四"
                : "-"
            }}
          </td>
          <td>{{ DataInquireJson.account[2] == 1 ? "未销户" : "销户" }}</td>
          <td>{{ DataInquireJson.controlState[2] == 1 ? "拉闸" : "合闸" }}</td>
          <td>{{ DataInquireJson.feeState[2] == 1 ? "开启" : "关闭" }}</td>
          <td>{{ DataInquireJson.electric[2] }}</td>
          <td>{{ DataInquireJson.power[2] }}</td>
          <td>{{ DataInquireJson.balance[2] }}</td>
          <td>{{ DataInquireJson.totalAmount[2] }}</td>
        </tr> -->
        <!-- <tr>
          <td>{{ DatainquireAmmeters[3].deviceName }}</td>
          <td>
            {{
              DatainquireAmmeters[3].deviceCache.attributes.walletCode == 1
                ? "钱包一"
                : DatainquireAmmeters[3].deviceCache.attributes.walletCode == 2
                ? "钱包二"
                : DatainquireAmmeters[3].deviceCache.attributes.walletCode == 3
                ? "钱包三"
                : DatainquireAmmeters[3].deviceCache.attributes.walletCode == 4
                ? "钱包四"
                : "-"
            }}
          </td>
          <td>{{ DataInquireJson.account[3] == 1 ? "未销户" : "销户" }}</td>
          <td>{{ DataInquireJson.controlState[3] == 1 ? "拉闸" : "合闸" }}</td>
          <td>{{ DataInquireJson.feeState[3] == 1 ? "开启" : "关闭" }}</td>
          <td>{{ DataInquireJson.electric[3] }}</td>
          <td>{{ DataInquireJson.power[3] }}</td>
          <td>{{ DataInquireJson.balance[3] }}</td>
          <td>{{ DataInquireJson.totalAmount[3] }}</td>
        </tr> -->
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick="2000" @click="DataInquireDialog = false"
          >取 消</el-button
        >
        <el-button
          v-preventReClick="2000"
          type="primary"
          @click="DataInquireDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import utils from "../../../utils/utils";
export default {
  name: "fourwayele",
  data() {
    return {
      DataInquireJson: null,
      DataInquireloading: false,
      DataInquireDialog: false,
      OperateObject: {},
      OperateDialog: false,
      Featuresvalue: null,
      Featuresselect: [
        { label: "基本用电", value: 0 },
        { label: "照明用电", value: 1 },
        { label: "空调用电", value: 2 },
      ],
      moneyvalue: null,
      
      Featuresormoneydialog: false,
      // sendWalletConfigurationorwalletAssignment: null,
      drawerylloading: false, //用量记录table 过度
      PickerstartTime: null, //用量记录 开始时间
      PickerendTime: null, //用量记录结束时间
      fullscreenLoading: false,
      // sendWalletConfigurationData: {},
      sendWalletConfigurationDialog: false,
      sendWalletConfigurationAllorone: null,
      PrimarytableorChildtable: 0,
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
      user_name: null, //设备条件查询name
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
      PickerstartTime: null,
      PickerendTime: null,
      infoTotalCurrent: 1, //用电总量页数
      energyTotalUse: "", //用户记录   用电总量
      InfoTableData: {}, //用量记录table
      DatainquireAmmeters: [],
    };
  },
  activated() {
    this.AxiosTablepage();
  },
  created() {
    this.lddata(); //树状图数据
    this.AxiosTablepage();
  },
  mounted() {},
  methods: {
    DataInquire(deviceCode) {
      this.DataInquireDialog = true;
      this.DataInquireloading = true;
      this.$axios
        .post("/device/getVirtualAmmeters", { ammeterCode: deviceCode })
        .then((res) => {
          // console.log('数据查询',res);
          // console.log('数据查询msg',res.data.msg);
          this.DatainquireAmmeters = res.data.rows;
          console.log(this.DatainquireAmmeters);
        });
      this.$axios
        .post(`/iot/ammeter/queryAmmeterData/${deviceCode}`)
        .then((res) => {
          if (res.data.code == 200) {
            console.log('1', res);
            console.log('数据查询',res.data.msg);
            // console.log(JSON.stringfy(res.data.msg));
            console.log(JSON.parse(res.data.msg));
            this.DataInquireJson = JSON.parse(res.data.msg);
            // this.DataInquireJson = res.data.msg
            // console.log('数据查询',res.data.msg);
            console.log(this.DataInquireJson);
          } else {
            this.DataInquireDialog = false;
            return this.$message.warning(res.data.msg);
          }
          this.DataInquireloading = false;
        })
        .catch((error) => {
          this.$message.warning(error.response.data.message);
        });
    },
    AllOperate(name) {
      if (this.TableCheckData.length <= 0) {
        return this.$message.warning("请先选择设备再进行操作!");
      }
      console.log(name);
      if (name == "lz") {
        this.OperateObject = {
          name: "ammeterControl",
          main: "zhubiao",
          status: "lazha",
          list: this.TableCheckData,
          Allorone: "all",
        };
        console.log(this.OperateObject);
      } else if (name == "hz") {
        this.OperateObject = {
          name: "ammeterControl",
          main: "zhubiao",
          status: "hezha",
          list: this.TableCheckData,
          Allorone: "all",
        };
        console.log(this.OperateObject);

      }
      this.OperateDialog = true;
    },
    // 拉闸合闸费控开启费控关闭
    OperateFunction() {
      let status;
      let list = [];
      let deviceCode = {};
      let wayCode = [];
      let deviceCodeAndwayCode = {}
      let data = this.OperateObject;
      console.log(data);
      if (data.name == "ammeterControl") {
        // 拉闸合闸
        if (data.main == "zhubiao") {
          let way = [1,2,3,4]  // 选主表的时候默认路数全选,即为[1,2,3,4]
          if (data.Allorone == "all") {
            data.list.forEach((item) => {
              deviceCodeAndwayCode.deviceCode = item.deviceCode;
              deviceCodeAndwayCode.wayCodes = way;
              list.push(deviceCodeAndwayCode)
            console.log(list);

              // list.push(item.deviceCode);
            });
          } else {
              deviceCodeAndwayCode.deviceCode = data.list.deviceCode;
              deviceCodeAndwayCode.wayCodes = way;
              list.push(deviceCodeAndwayCode)
            console.log(list);


          }
          if (data.status == "lazha") {
            // console.log(list);
            this.OperateAxios(list, 1);
          } else {
            this.OperateAxios(list, 0);
          }
          this.$refs.multipleTable.clearSelection();
        } else if (data.main == "fubiao") {
          deviceCodeAndwayCode.deviceCode = data.list.deviceCode;
              wayCode.push(data.list.deviceCache.attributes.wayCode)
              deviceCodeAndwayCode.wayCodes = wayCode;
              list.push(deviceCodeAndwayCode)
              console.log(list);
          if (data.status == "lazha") {
            status = 1
            this.OperateAxios(list, status);
          } else {
            status = 0
            this.OperateAxios(list, status);
          }
        }
      }
    },
    OperateAxios(deviceCodeAndWayCodesDtos, control) {
      this.$axios
        .post(`/device/operate/fourWayAmmeterControl`, {
          deviceCodeAndWayCodesDtos,
          deviceType: 4,
          control,
        })
        .then((res) => {
          console.log(res);
          this.expands = [];
          this.LevelTwoTable = [];
          this.OperateDialog = false;
          return this.$message.success("已发送请求,请去系统通知界面查看结果!");
        })
        .catch((error) => {
          return this.$message.warning(error.response.data.message);
        });
    },
    
    // 下发参数配置请求
    DeviceConfig() {
      if (this.TableCheckData.length > 0) {
        let devicelist = [];
        this.TableCheckData.forEach((item) => {
          devicelist.push(item.deviceCode);
        });
        let gatewaytype = this.TableCheckData[0].gatewayType;
        let devicetype = this.TableCheckData[0].deviceCache.deviceType;
        this.$axios
          .post(
            `/device/config?deviceList=${devicelist}&deviceType=${gatewaytype}&gatewayType=${devicetype}`
          )
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            } else {
              this.$message.warning(res.data.msg);
            }
          });
      } else {
        return this.$message.warning("请先选择需要下发配置的设备!");
      }
    },
    // 用量记录分页
    getinfoTotal(val) {
      this.infoTotalCurrent = val;
      this.getInfoTableData();
    },
    // 用量记录table
    getInfoTableSearch() {
      this.$axios
        .post("/iot/device/eleDetail", {
          current: this.infoTotalCurrent,
          size: 5,
          startDate: this.PickerstartTime,
          endDate: this.PickerendTime,
          deviceCode: this.drawerdata.deviceCode,
        })
        .then((res) => {
          this.InfoTableData = res.data.rows;
          this.drawerylloading = false;
        });
    },
    // 用量记录搜索
    getInfoTableData() {
      this.getInfoTableSearch();
      this.getdetailstotal();
    },
    // 获取抽屉用电总量
    getdetailstotal() {
      this.$axios
        .post("/iot/device/eleDetailTotal", {
          deviceCode: this.drawerdata.deviceCode,
          startDate: this.PickerstartTime,
          endDate: this.PickerendTime,
        })
        .then((res) => {
          this.energyTotalUse = res.data.rows.energyTotalUse;
        });
    },
    // 钱包分配
    // sendWalletConfiguration() {
    //   if (this.sendWalletConfigurationorwalletAssignment == 1) {
    //     this.$axios
    //       .post(
    //         "/iot/ammeter/sendWalletConfiguration/" +
    //           this.sendWalletConfigurationData.deviceCode
    //       )
    //       .then((res) => {
    //         if (res.data.code == 200) {
    //           this.$message.success(res.data.msg);
    //           this.sendWalletConfigurationDialog = false;
    //           this.AxiosTablepage();
    //         } else if (res.data.code == 500) {
    //           this.$message.warning(res.data.msg);
    //           this.sendWalletConfigurationDialog = false;
    //           this.AxiosTablepage();
    //         }
    //       });
    //   } else if (this.sendWalletConfigurationorwalletAssignment == 2) {
    //     let deviceCodes = [];
    //     if (this.sendWalletConfigurationAllorone == "all") {
    //       this.TableCheckData.forEach((item) => {
    //         deviceCodes.push(item.deviceCode);
    //       });
    //     } else if (this.sendWalletConfigurationAllorone == "one") {
    //       deviceCodes.push(this.sendWalletConfigurationData.deviceCode);
    //     }
    //     this.$axios
    //       .post("/iot/ammeter/ammeterInitialize?deviceCodes=" + deviceCodes)
    //       .then((res) => {
    //         if (res.data.code == 200) {
    //           this.$message.success(res.data.msg);
    //           this.sendWalletConfigurationDialog = false;
    //           this.AxiosTablepage();
    //         } else {
    //           this.$message.warning(res.data.msg);
    //           this.sendWalletConfigurationDialog = false;
    //           this.AxiosTablepage();
    //         }
    //       });
    //   }
    // },
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
      if (this.PickerstartTime == null) {
        this.PickerendTime = null;
      }
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
        this.$nextTick(() => {
          this.$refs.treeForm.setCheckedKeys([]);
        });
        // this.$refs.treeForm.setCheckedKeys([]);
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
    checktreechange(data) {
      console.log(data);
      if (data.layer == 1 || data.layer == 2) {
        return;
      } else {
        this.LeftDataId = data.id.replace(/[^0-9]/gi, "");
        console.log(this.LeftDataId);
      }
    },
    //点击选择位置树状图存取区域id
    checkChange(data, checked, node) {
      if (checked === true) {
        console.log(this.$refs);
        console.log(this.$refs.treeForm);
        // this.$refs.treeForm.setCheckedKeys([data.id]);
        this.$nextTick(() => {
          this.$refs.treeForm.setCheckedKeys([data.id]);
        });
      } else {
        return;
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
      console.log('确定', this.treecheckid);
      console.log(typeof(this.treecheckid));
      console.log(this.drawerdata);
      if (this.treecheckid == null || this.LeftDataId != this.treecheckid[0]){
        console.log(this.treecheckid[0]);
        console.log(this.LeftDataId);
        if (this.treecheckid == null || this.treecheckid[0] == 0 || this.treecheckid[0] == undefined) {
          console.log('1');
          this.$axios
            .post("/device/deviceAreaDistribution", {
              roomId: this.LeftDataId,
              deviceCode: this.drawerdata.deviceCode,
              id: this.drawerdata.id,
              deviceType: this.drawerdata.deviceType,
            })
            .then((res) => {
                console.log(res);

              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
                this.AxiosTablepage();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning",
                });
                this.AxiosTablepage();
              }
              this.expands = [];
              this.LevelTwoTable = [];
              this.TwoSelectDialogShoworHide = false;
              this.SleectinstallDialog = false;
              this.drawer = false;
            });
        } else {
          console.log('2');
          this.$message({
            message: "请先将该设备移除房间,再勾选新房间",
            type: "warning",
          });
          this.TwoSelectDialogShoworHide = false;
          this.SleectinstallDialog = false;
          this.drawer = false;
        }
      } else if (this.LeftDataId == this.treecheckid[0]) {
        console.log('2222');
        this.$axios
          .post("/device/deviceAreaDistribution", {
            deviceCode: this.drawerdata.deviceCode,
            deviceType: this.drawerdata.deviceType,
            id: this.drawerdata.id,
            roomId: 0,
          })
          .then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              this.$message({
                message: "已将设备移出房间",
                type: "success",
              });
              this.treecheckonetwolevel = [];
              this.treecheckid = [];
              this.AxiosTablepage();
              this.TwoSelectDialogShoworHide = false;
              this.SleectinstallDialog = false;
              this.expands = [];
              this.LevelTwoTable = [];
              this.drawer = false;
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning",
              });
              this.AxiosTablepage();
              this.expands = [];
              this.LevelTwoTable = [];
              this.TwoSelectDialogShoworHide = false;
              this.SleectinstallDialog = false;
            }
          });
      }
    },
    Listtablechange(val) {
      this.listtablecurrent = val;
      this.getoperatedetail();
    },
    // 打开抽屉事件
    opendrawer() {
      this.getoperatedetail();
      this.getInfoTableData(); //用量记录table
    },
    // 记录列表axios
    getoperatedetail() {
      if (this.listtabnumber == 0) {
        this.$axios
          .post("/iot/device/getOperateDetail", {
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
    ckdrawer(row) {
      if (row.createTime) {
        row.createTime = utils.TimeChange(row.createTime);
      }
      if (row.updateTime) {
        row.updateTime = utils.TimeChange(row.updateTime);
      }
      if (row.deviceCache) {
        if (row.deviceCache.lastLoginTime) {
          row.deviceCache.lastLoginTime = utils.timeToDate(row.deviceCache.lastLoginTime);
        }
        if (row.deviceCache.offlineTime) {
          row.deviceCache.offlineTime = utils.timeToDate(row.deviceCache.offlineTime);
        }
      }
      this.drawerdata = row;
      this.drawer = true;
    },
    // 分页
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.AxiosTablepage();
    },
    exChange(row, expandedRows) {
      let arr = [];
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.id);
        }
        this.$axios
          .post("/device/getVirtualAmmeters", { ammeterCode: row.deviceCode })
          .then((res) => {
            console.log(res);
            this.LevelTwoTable = res.data.rows;
            arr.push(...res.data.rows);
            arr.forEach((item) => {
              if (item.updateTime !== null) {
                item.updateTime = utils.TimeChange(item.updateTime);
              }
            });
          });
        this.LevelTwoTable = arr;
      } else {
        this.expands = [];
        this.LevelTwoTable = [];
      }
    },
    // 请求table数据
    AxiosTablepage() {
      this.tableloading = true;
      this.$axios
        .post("/device/ammeterList", {
          current: this.CurrentPage,
          size: this.PageSize,
          deviceCode: this.user_name,
        })
        .then((res) => {
          if (res.data.code == 200) {
            res.data.rows.records.forEach((item) => {
              if (item.updateTime !== null) {
                item.updateTime = utils.TimeChange(item.updateTime);
              }
            });
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
      this.AxiosTablepage();
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.default_qj = !this.default_qj;
      this.treelayer = null;
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
      this.CurrentPage = 1;
      this.AxiosTablepage();
    },
  },
};
</script>

<style lang="scss" scoped>
.DataInquireDialog {
  ::v-deep .el-dialog {
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
    table {
      width: 100%;
      border-collapse: collapse;
      th {
        background: #f2f9ff;
        border-bottom: 0;
      }
      td {
        border-bottom: $border;
      }
      th,
      td {
        font-size: 14px;
        font-family: $font-scme;
        letter-spacing: 2px;
        text-align: center;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
.deldialog,
.Featuresormoneydialog {
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
      label {
        display: inline-block;
        margin-right: 15px;
      }
      p {
        text-align: left;
        padding-bottom: 6px;
        display: inline-block;
        width: 50%;
        font-size: 16px;
      }
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
  overflow-y: auto;
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
  h4 {
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #212d33;
  }
  .record {
    padding: 18px 30px 15px 45px;
    .Total {
      .fl {
        font-size: 14px;
        color: #212d33;
        span {
          font-weight: 500;
          &:last-child {
            display: inline-block;
            margin-left: 10px;
            font-size: 18px;
          }
        }
      }
      button {
        display: inline-block;
        width: 96px;
        height: 36px;
        border: 0;
        border-radius: 5px;
        line-height: 36px;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
        background: #2d92ff;
        color: white;
      }
    }
    table {
      width: 100%;
      margin-top: 10px;
      th {
        background: #2c9dff;
        color: #ffffff;
      }
      td,
      th {
        font-size: 14px;
        font-family: $font-scme;
        letter-spacing: 2px;
        text-align: center;
        height: 38px;
        line-height: 38px;
      }
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
      margin: 10px 0 0 0;
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
    .el-checkbox__inner {
      border: 1px solid #dbdbdb;
    }
    th {
      background: $tablebg;
      border-bottom: 0;
    }
    td,
    th {
      font-size: 14px;
      color: #364147;
    }
    .fontblue {
      margin-right: 5px;
    }
  }
  border-radius: 8px;
  background: #ffffff;
  margin-top: 19px;
  padding: 20px 40px 20px 43px;
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
// ::v-deep .el-dialog__body{
//   // border-bottom: 2px solid rgb(241, 241, 241);
//   // border-top: 2px solid rgb(241, 241, 241);
// }
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
::v-deep .jv-container {
  text-align: left;
}
</style>

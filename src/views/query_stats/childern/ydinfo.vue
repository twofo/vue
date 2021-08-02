<template>
  <div class="middle_content">
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
          :class="rightheadertab == index ? 'active' : ''"
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
          <div class="czqd fl" v-if="rightheadertab == 0">
            <p>充值渠道</p>
            <el-select clearable v-model="czqd_value" placeholder="请选择">
              <el-option
                v-for="item in czqd_select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="jlzt fl" v-if="rightheadertab == 0">
            <p>记录状态</p>
            <el-select clearable v-model="jlzt_value" placeholder="请选择">
              <el-option
                v-for="item in jlzt_select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="fl" v-if="rightheadertab == 2">
            <p>记录状态</p>
            <el-select clearable v-model="tkjlzt_value" placeholder="请选择">
              <el-option
                v-for="item in tkjlzt_select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="fl" v-if="rightheadertab != 4">
            <p>按宿舍名查询</p>
            <el-input clearable v-model="roomname" placeholder="请输入宿舍名"></el-input>
          </div>
          <div class="fl" v-if="rightheadertab == 3">
            <p>操作类型</p>
            <el-select v-model="CZTypeValue" placeholder="请选择">
              <el-option
                v-for="item in CZTypeSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="sjfw fl">
            <p>时间范围</p>
            <el-select
              clearable
              v-model="sjfw_value"
              placeholder="请选择"
              @change="iftimedisabled()"
            >
              <el-option
                v-for="item in sjfw_select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="zdy_sjfw fl">
            <p>自定义时间范围</p>
            <el-date-picker
              v-model="zdystarttime"
              :picker-options="pickerOptions"
              type="date"
              value-format="yyyy-MM-dd"
              @change="
                test();
                iftimedisabled();
              "
              placeholder="选择开始时间"
            ></el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="zdyendtime"
              type="date"
              @change="
                test();
                iftimedisabled();
              "
              value-format="yyyy-MM-dd"
              placeholder="选择结束时间"
              :picker-options="pickerOptions2"
              :disabled="zdystarttime == null"
            ></el-date-picker>
          </div>
        </div>
        <div class="info" v-if="filtercheck">
          <button v-preventReClick="2000" @click="search()">搜索</button>
          <button v-preventReClick="2000" @click="Reset">重置</button>
        </div>
      </div>
      <div class="table_data">
        <div class="recharge" v-if="rightheadertab == 0">
          <div class="top_title clearfix">
            <h3 class="fl">
              <span>总计金额(元):</span>
              {{ RechargeTotalData == null ? "0" : RechargeTotalData }}
            </h3>
            <el-button type="primary" class="jshidden fr">
              <i class="el-icon-folder-add el-icon--left"></i>
              导出列表
            </el-button>
          </div>
          <table v-loading="loading">
            <tr>
              <th>序号</th>
              <th>宿舍信息</th>
              <th>充值金额(元)</th>
              <th>充值单号</th>
              <th>充值渠道</th>
              <th>充值时间</th>
              <th>记录状态</th>
              <th>操作</th>
            </tr>
            <template
              v-if="
                RechargeTableData.records !== undefined &&
                RechargeTableData.records.length > 0
              "
            >
              <tr v-for="(item, index) in RechargeTableData.records" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.areaInfo || "-" }}</td>
                <td>{{ item.rechargeSum || 0 }}</td>
                <td>{{ item.outTradeNo || "-" }}</td>
                <td>
                  {{
                    item.rechargeChannel == 0
                      ? "系统充值"
                      : item.rechargeChannel == 1
                      ? "微信"
                      : item.rechargeChannel == 2
                      ? "支付宝"
                      : item.rechargeChannel == 3
                      ? "平台充值"
                      : item.rechargeChannel == 4
                      ? "桌面应用充值"
                      : item.rechargeChannel == 5
                      ? "农行e支付"
                      : "-"
                  }}
                </td>
                <td>{{ item.rechargeTime || "-" }}</td>
                <td>
                  <i
                    class="i"
                    :class="
                      item.rechargeStatus == 1
                        ? 'bgred'
                        : item.rechargeStatus == 2
                        ? 'bggreen'
                        : item.rechargeStatus == 3
                        ? 'bgblue'
                        : item.rechargeStatus == 4
                        ? 'bgyellow'
                        : ''
                    "
                  ></i>
                  {{
                    item.rechargeStatus == 1
                      ? "充值中"
                      : item.rechargeStatus == 2
                      ? "已充值"
                      : item.rechargeStatus == 3
                      ? "充值关闭"
                      : item.rechargeStatus == 4
                      ? "冻结"
                      : "-"
                  }}
                </td>
                <td>
                  <span
                    @click="RechargeDialogShow(item)"
                    class="fontblue"
                    v-if="item.rechargeStatus == 2 || item.rechargeStatus == 4"
                    >核单退款</span
                  >
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="7" style="text-aligin: center">暂无数据</td>
            </tr>
          </table>
          <el-dialog title="核单退款" :visible.sync="RechargeDialog">
            <h3>{{ RechargeDialogareaInfo }}电表设备充值总金额</h3>
            <ul class="MoneyAndCode" v-if="RechargeDialogTotal">
              <li>
                <div>设备编号</div>
                <div>{{ RechargeDialogTotal.deviceCode || "-" }}</div>
              </li>
              <li>
                <div>设备金额(元)</div>
                <div>{{ RechargeDialogTotal.deviceCharge || "-" }}</div>
              </li>
            </ul>
            <div class="params">
              <i class="el-icon-warning"></i>
              <span
                >第三方支付成功总金额：
                <span class="colorblue">{{
                  RechargeDialogTotal.successCharge || 0
                }}</span>
                元,水表充值异常金额
                <span class="colorred">{{ RechargeDialogTotal.failedCharge || 0 }}</span
                >元
              </span>
            </div>
            <table v-loading="DialogLoading">
              <tr>
                <th>学工号</th>
                <th>充值订单号</th>
                <th>充值金额(元)</th>
                <th>充值渠道</th>
                <th>充值状态</th>
                <th>设备充值状态</th>
                <th>退款状态</th>
                <th>退款原因</th>
                <th>备注</th>
              </tr>
              <template
                v-if="
                  RechargeDialogTableData.records !== undefined &&
                  RechargeDialogTableData.records.length > 0
                "
              >
                <tr v-for="(item, index) in RechargeDialogTableData.records" :key="index">
                  <td>{{ item.identifier }}</td>
                  <td>{{ item.outTradeNo }}</td>
                  <td>{{ item.rechargeSum }}</td>
                  <td>
                    {{
                      item.rechargeChannel == 0
                        ? "系统充值"
                        : item.rechargeChannel == 1
                        ? "微信"
                        : item.rechargeChannel == 2
                        ? "支付宝"
                        : item.rechargeChannel == 3
                        ? "平台充值"
                        : item.rechargeChannel == 4
                        ? "桌面应用充值"
                        : "-"
                    }}
                  </td>
                  <td>
                    <i
                      class="i"
                      :class="
                        item.rechargeStatus == 1
                          ? 'bgblue'
                          : item.rechargeStatus == 2
                          ? 'bggreen'
                          : item.rechargeStatus == 3
                          ? 'bgyellow'
                          : item.rechargeStatus == 4
                          ? 'bgviolet'
                          : ''
                      "
                    ></i>
                    <span>
                      {{
                        item.rechargeStatus == 1
                          ? "充值中"
                          : item.rechargeStatus == 2
                          ? "已充值"
                          : item.rechargeStatus == 3
                          ? "充值关闭"
                          : item.rechargeStatus == 4
                          ? "充值失败"
                          : "-"
                      }}</span
                    >
                  </td>
                  <td>
                    <i
                      class="i"
                      :class="
                        item.deviceRechargeStatus == '充值成功'
                          ? 'bggreen'
                          : item.deviceRechargeStatus == '充值失败'
                          ? 'bgred'
                          : ''
                      "
                    ></i
                    >{{ item.deviceRechargeStatus || "-" }}
                  </td>
                  <td>
                    <span
                      class="span"
                      :class="
                        item.refundStatus == 1
                          ? 'bgblue'
                          : item.refundStatus == 2
                          ? 'bgviolet'
                          : item.refundStatus == 3
                          ? 'bggreen'
                          : item.refundStatus == 4
                          ? 'bgred'
                          : ''
                      "
                    >
                      {{
                        item.refundStatus == 1
                          ? "未审核"
                          : item.refundStatus == 2
                          ? "审核中"
                          : item.refundStatus == 3
                          ? "审核通过"
                          : item.refundStatus == 4
                          ? "审核拒绝"
                          : item.refundStatus == 5
                          ? "原渠道退费失败"
                          : item.refundStatus == 6
                          ? "原渠道退费成功"
                          : "-"
                      }}
                    </span>
                  </td>
                  <td>{{ item.refundReason || "-" }}</td>
                  <td>{{ item.remark || "-" }}</td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="8" style="text-align: center">暂无数据</td>
              </tr>
            </table>
            <el-pagination
              @current-change="RechargeDialogCurrentChange"
              :current-page="RechargeDialogCurrentPage"
              :page-size="5"
              layout="total,  prev, pager, next"
              :total="1"
            >
            </el-pagination>
            <span slot="footer" class="dialog-footer">
              <el-button @click="RechargeDialog = false">取 消</el-button>
              <el-button v-preventReClick="5000" type="primary" @click="HDRefundMethods"
                >退 款</el-button
              >
            </span>
          </el-dialog>
        </div>
        <div class="consumption" v-if="rightheadertab == 1">
          <div class="top_title clearfix" v-if="ConsumptionTotalData">
            <h3 class="fl">
              <div>
                <span>总用电量(度):</span>
                {{ ConsumptionTotalData.totalUseAmount || 0 }}
              </div>
              <div>
                <span>消费总额(元):</span>
                {{ ConsumptionTotalData.totalUseMoney || 0 }}
              </div>
            </h3>
            <el-button type="primary" class="jshidden fr" v-preventReClick="2000">
              <i class="el-icon-folder-add el-icon--left"></i>
              导出列表
            </el-button>
          </div>
          <table v-loading="loading">
            <tr>
              <th>序号</th>
              <th>宿舍信息</th>
              <th>用电量(度)</th>
              <th>消费金额(元)</th>
              <th>消费时间</th>
            </tr>
            <template
              v-if="
                ConsumptionTableData.records !== undefined &&
                ConsumptionTableData.records.length > 0
              "
            >
              <tr v-for="(item, index) in ConsumptionTableData.records" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.areaInfo }}</td>
                <td>{{ item.consumeAmount }}</td>
                <td>{{ item.consumeSum }}</td>
                <td>{{ item.consumeTime }}</td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="6" style="text-aligin: center">暂无数据</td>
            </tr>
          </table>
        </div>
        <div class="refund" v-if="rightheadertab == 2">
          <div class="top_title clearfix">
            <h3 class="fl">
              <div><span>待处理总额(元):</span>{{ RefundTotal.totalMoney }}</div>
            </h3>
            <el-button type="primary" class="jshidden fr">
              <i class="el-icon-folder-add el-icon--left"></i>
              导出列表
            </el-button>
            <button
              v-preventReClick="2000"
              class="fr"
              @click="
                if (RefundCheckData.length == 0) {
                  $message.warning('请先选择需要留存的数据!');
                  return;
                }
                RefundDialog = true;
                RefundDialogNumber = 1;
                RefundDialogAllorone = 1;
              "
            >
              留存
            </button>
            <button
              v-preventReClick="2000"
              class="fr"
              @click="
                if (RefundCheckData.length == 0) {
                  $message.warning('请先选择需要清零的数据!');
                  return;
                }
                RefundDialogNumber = 2;
                RefundDialog = true;
                RefundDialogAllorone = 1;
              "
            >
              清零
            </button>
          </div>
          <el-table
            v-loading="loading"
            :data="RefundTableData.records"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="roomInfo" label="宿舍信息"></el-table-column>
            <el-table-column prop="refundMoney" label="退款金额(元)"></el-table-column>
            <el-table-column prop="refundChannel" label="退款渠道"></el-table-column>
            <el-table-column label="退款来源">
              <template slot-scope="scope">{{
                scope.row.source == 1
                  ? "退宿退款"
                  : scope.row.source == 2
                  ? "收费模式转换退款"
                  : "-"
              }}</template>
            </el-table-column>
            <el-table-column prop="applyTime" label="申请时间"> </el-table-column>
            <el-table-column label="操作时间">
              <template slot-scope="scope">{{
                scope.row.settlementTime || "-"
              }}</template>
            </el-table-column>
            <el-table-column label="记录状态">
              <template slot-scope="scope">
                <i
                  class="i"
                  :class="
                    scope.row.refundStatus == 1
                      ? 'bgred'
                      : scope.row.refundStatus == 2
                      ? 'bgblue'
                      : scope.row.refundStatus == 3
                      ? 'bggreen'
                      : scope.row.refundStatus == 4
                      ? 'bgyellow'
                      : ''
                  "
                ></i>
                {{ scope.row.recordStatus || "-" }}
              </template>
            </el-table-column>
            <el-table-column label="操作人">
              <template slot-scope="scope">
                {{ scope.row.creator || "-" }}
              </template>
            </el-table-column>
            <el-table-column label="操作角色">
              <template slot-scope="scope">
                {{ scope.row.roleType || "-" }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.refundStatus == 1 && scope.row.source !== 3"
                  @click="RefundTable(scope.row)"
                  >退款</span
                >
                <span
                  v-if="scope.row.refundStatus == 2"
                  @click="
                    RefundDialogApproval = true;
                    RefundDialogApprovalId = scope.row.id;
                  "
                  >审批</span
                >
                <el-dropdown v-if="scope.row.refundStatus == 1">
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="scope.row.source !== 2"
                      @click.native="
                        RefundDialogNumber = 1;
                        LiuCunOrClearId = scope.row.id;
                        RefundDialogAllorone = 2;
                        RefundDialog = true;
                      "
                      >留存</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native="
                        RefundDialogNumber = 2;
                        LiuCunOrClearId = scope.row.id;
                        RefundDialogAllorone = 2;
                        RefundDialog = true;
                      "
                      >清零</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            @close="RefundDialogApprovalClose"
            title="审批"
            :visible.sync="RefundDialogApproval"
            center
          >
            <div>
              <label><span>*</span>操作类型</label>
              <el-select v-model="RefundDialogApprovalValue" placeholder="请选择">
                <el-option
                  v-for="item in RefundDialogApprovalSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="reason" v-if="RefundDialogApprovalValue == false">
              <label>拒绝原因</label>
              <el-input
                type="textarea"
                :rows="2"
                v-model="RefundReason"
                placeholder="请输入原因"
              ></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="RefundDialogApproval = false">取 消</el-button>
              <el-button type="primary" @click="RefundDialogApprovalMethods"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <el-dialog title="系统提示" :visible.sync="RefundDialog" center>
            <div>
              <img src="../../../assets/images/system/zj.png" alt="" />
              <span v-if="RefundDialogNumber == 2">确定进行清零操作吗?</span>
              <span v-if="RefundDialogNumber == 1">确定进行留存操作吗?</span>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="RefundDialog = false">取 消</el-button>
              <el-button type="primary" @click="RefundDialogCheck">确 定</el-button>
            </span>
          </el-dialog>
          <el-dialog title="退款" :visible.sync="RefundTableDialog" center>
            <label>退款学生</label>
            <el-select v-model="RefundUserValue" clearable placeholder="请选择退款学生">
              <el-option
                v-for="item in RefundUser"
                :key="item.username"
                :label="item.name"
                :value="item.username"
              >
              </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
              <el-button @click="RefundTableDialog = false">取 消</el-button>
              <el-button type="primary" @click="RefundCheckMethods">确定</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="clear" v-if="rightheadertab == 3">
          <div class="top_title butonnhover clearfix">
            <ul class="fl" v-if="ClearTotal !== undefined && ClearTotal.length > 0">
              <li v-for="(item, index) in ClearTotal" :key="index">
                {{
                  item.operationType == 1
                    ? "清零金额"
                    : item.operationType == 2
                    ? "留存金额"
                    : item.operationType == 3
                    ? "退款金额"
                    : "-"
                }}(元)
                <span>{{ item.totalMoney || 0 }}</span>
              </li>
            </ul>
            <el-button type="primary" class="fr">
              <i class="el-icon-folder-add el-icon--left"></i>
              导出列表
            </el-button>
          </div>
          <table v-loading="loading">
            <tr>
              <th>序号</th>
              <th>宿舍信息</th>
              <th>金额(元)</th>
              <th>来源</th>
              <th>操作类型</th>
              <th>操作人</th>
              <th>操作时间</th>
            </tr>
            <template
              v-if="
                ClearTableData.records !== undefined && ClearTableData.records.length > 0
              "
            >
              <tr v-for="(item, index) in ClearTableData.records" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.roomInfo || "-" }}</td>
                <td>{{ item.money || 0 }}</td>
                <td>
                  {{ item.source == 1 ? "退宿" : item.source == 2 ? "付款模式转换" : "" }}
                </td>
                <td>
                  {{
                    item.operationType == 1
                      ? "清零"
                      : item.operationType == 2
                      ? "留存"
                      : item.operationType == 3
                      ? "退款"
                      : "-"
                  }}
                </td>
                <td>{{ item.operator || "-" }}</td>
                <td>{{ item.operateTime }}</td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="7" class="center">暂无数据</td>
            </tr>
          </table>
        </div>
        <div class="statistics" v-if="rightheadertab == 4">
          <ul class="top_text">
            <li>
              总用水量(吨)<span>{{ StatisticsTotal.totalUse || 0 }}</span>
            </li>
            <li>
              日平均用水量(吨)<span>{{ StatisticsTotal.averageUse || 0 }}</span>
            </li>
            <li>
              日最低用水量(吨)<span>{{ StatisticsTotal.lowUse || 0 }}</span>
            </li>
            <li>
              日最高用水量(吨)<span>{{ StatisticsTotal.highUse || 0 }}</span>
            </li>
          </ul>
          <div class="top_title clearfix">
            <template>
              <ul>
                <li v-if="StatisticsColdUseTotal.waterBuildingTotal !== null">
                  当前楼栋用水量(吨):<span>{{
                    StatisticsColdUseTotal.waterBuildingTotal
                  }}</span>
                </li>
                <li v-if="StatisticsColdUseTotal.waterFloorTotal !== null">
                  当前楼层用水量(吨):<span>{{
                    StatisticsColdUseTotal.waterFloorTotal
                  }}</span>
                </li>
              </ul>
            </template>
            <el-button type="primary" class="jshidden fr">
              <i class="el-icon-folder-add el-icon--left"></i>
              导出列表
            </el-button>
          </div>
          <table v-loading="loading">
            <tr>
              <td>序号</td>
              <td>单位名称</td>
              <td>用水量(升)</td>
              <td>操作</td>
            </tr>
            <template
              v-if="
                StatisticsTableData.records !== undefined &&
                StatisticsTableData.records.length > 0
              "
            >
              <tr v-for="(item, index) in StatisticsTableData.records" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.unitName || "-" }}</td>
                <td>{{ item.useEnergy || 0 }}</td>
                <td
                  class="fontblue"
                  v-if="item.layer == 3"
                  @click="StatisticsDIalogClick(item)"
                >
                  查看详情
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="4" class="center">暂无数据</td>
            </tr>
          </table>
          <el-dialog :visible.sync="StatisticsDialog" center class="consumptiondialog">
            <div class="top">
              <p>
                单位名称:
                <span>{{ StatisticsDialogTotal.unitName }}</span>
              </p>
              <ul class="clearfix">
                <li class="fl">
                  热水总量(吨):
                  <span>{{ StatisticsDialogTotal.totalUse }}</span>
                </li>
                <li class="jshidden fr">
                  <el-button type="primary">
                    <i class="el-icon-folder-add el-icon--left"></i>
                    导出列表
                  </el-button>
                </li>
                <li class="fr">
                  时间范围
                  <el-date-picker
                    @change="StatisticsDialogTimeChange"
                    v-model="StatisticsDialogTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </li>
              </ul>
            </div>
            <table>
              <tr>
                <th>序号</th>
                <th>用水日期</th>
                <th>用水量(升)</th>
              </tr>
              <template
                v-if="
                  StatisticsDailogTableData.records !== undefined &&
                  StatisticsDailogTableData.records.length > 0
                "
              >
                <tr
                  v-for="(item, index) in StatisticsDailogTableData.records"
                  :key="index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.useTime || "-" }}</td>
                  <td>{{ item.useEnergy || "0" }}</td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="3" class="center">暂无数据</td>
              </tr>
            </table>
            <el-pagination
              @current-change="StatisticsDialogCurrentChange"
              :current-page="StatisticsDialogCurrentPage"
              :page-sizes="StatisticsDialogPageSizes"
              :page-size="StatisticsDialogPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="StatisticsDailogTableData.total"
            ></el-pagination>
          </el-dialog>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="CurrentPage"
          :page-sizes="PageSizes"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="
            rightheadertab == 0
              ? RechargeTableData.total
              : rightheadertab == 1
              ? ConsumptionTableData.total
              : rightheadertab == 2
              ? RefundTableData.total
              : rightheadertab == 3
              ? ClearTableData.total
              : rightheadertab == 4
              ? StatisticsTableData.total
              : 0
          "
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ydinfo",
  data() {
    return {
      DialogLoading: false,
      RechargeDialogRefundId: null, //核单退款所需记录id
      RechargeDialogTableData: {}, //核单退款table数据
      RechargeDialogTotal: {}, //核单退款总量
      RechargeDialogCurrentPage: 1, //核单退款弹窗分页
      RechargeDialogareaInfo: null, //核单退款的房间信息
      RechargeDailogRoomId: null, //核单退款所需roomid
      RechargeDialog: false, //核单退款dialog
      ConsumptionTotalData: null, //消费Total
      ConsumptionTableData: {}, //消费表格数据
      loading: false,
      RechargeTableData: {}, //充值表格数据
      RechargeTotalData: null, //充值总额
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
              new Date(this.zdystarttime).getTime() - 1 * 24 * 60 * 60 * 1000
          );
        },
      },
      zdystarttime: null, //自定义开始时间
      zdyendtime: null, //自定义结束时间
      sjfw_value: null, //时间范围下框框选中值
      //   时间范围 下拉框内容
      sjfw_select: [
        {
          value: "0",
          label: "本月",
        },
        {
          value: "1",
          label: "上月",
        },
        {
          value: "2",
          label: "上季度",
        },
      ],
      roomname: null, //房间名
      tkjlzt_value: null,
      tkjlzt_select: [
        { value: "1", label: "未退款" },
        { value: "2", label: "退款中" },
        { value: "3", label: "退款成功" },
        { value: "4", label: "退款失败" },
      ],
      jlzt_select: [
        {
          value: "1",
          label: "充值中",
        },
        {
          value: "2",
          label: "已充值",
        },
        {
          value: "3",
          label: "充值关闭",
        },
        {
          value: "4",
          label: "冻结",
        },
      ],
      jlzt_value: null, //记录状态下拉框选择
      //   充值渠道 下拉框内容
      czqd_select: [
        {
          value: "1",
          label: "微信",
        },
        {
          value: "3",
          label: "平台充值",
        },
      ],
      czqd_value: null, //充值渠道下拉框选择
      filtercheck: true, //筛选showorhide
      lefttree: [],
      layer: null,
      dataid: null,
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      default_qj: true,
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      rightheadertab: 0,
      rightheader: ["充值", "消费", "待办", "余额明细", "用量统计"],
      timecheck: 0, //下拉选择时间or自定义时间  0都未选  1下拉时间  2自定义时间
      LiuCunOrClearId: null, //留存or清零id
      CZTypeValue: "0",
      CZTypeSelect: [
        { value: "0", label: "全部" },
        { value: "1", label: "清零" },
        { value: "2", label: "留存" },
        { value: "3", label: "退款" },
      ],
      RefundTotal: {},
      RefundUserValue: null,
      RefundId: null, //退款id
      RefundUser: null, //退款学生数据
      RefundTableDialog: false, //退款弹窗
      RefundDialogApprovalId: null, //退款 审批弹框所需id
      RefundReason: null, //拒绝原因
      RefundDialogApprovalValue: null, //退款审批弹窗Value
      RefundDialogApprovalSelect: [
        //退款审批弹窗select
        { label: "同意", value: true },
        { label: "拒绝", value: false },
      ],
      RefundDialogApproval: false, //退款审批弹窗
      RefundDialogid: null, //退款待处理弹窗id
      RefundDialogAllorone: 0, //多选or单个
      RefundDialog: false, //退款待处理dialog
      RefundDialogNumber: null, //退款待处理 留存or清零
      RefundCheckData: [], //退款待处理选中数据
      RefundTableData: [], //退款待处理数据
      ClearTableData: {}, //清零表格数据
      ClearTotal: [], //清零总额
      StatisticsTotal: {}, //用量统计 总量最高最低平均
      StatisticsColdUseTotal: {}, //用量统计楼层楼栋总计
      StatisticsTableData: [], //用量统计table全部的
      StatisticsDailogTableData: {}, //用量统计弹窗
      StatisticsDialogTime: [], //用量统计弹窗时间选择器
      StatisticsDialogTotal: {}, //用量统计弹窗总计
      StatisticsDialogTable: {}, //用量统计弹窗table数据
      StatisticsDialogPageSizes: [5],
      StatisticsDialogPageSize: 5,
      StatisticsDialogCurrentPage: 1, //用量统计详情分页
      StatisticsDialog: false, //用量统计详情弹窗
    };
  },
  created() {
    if (this.$route.query.roomname) {
      this.roomname = this.$route.query.roomname;
    }
    //首页本月总收入
    if (this.$route.query.eleincome) {
      this.timecheck = 1;
      this.sjfw_value = "0";
      this.rightheadertab = 0;
    }
    this.lddata();
    this.search();
  },
  activated() {
    this.search();
  },
  methods: {
    // 用量统计总用平均最高最低
    AxiosStatisticsTotal(startDate, endDate) {
      this.$axios
        .post("/iot/cold-water/getUpperTotal", {
          startDate,
          endDate,
          layer: this.layer,
          areaId: this.dataid,
        })
        .then((res) => {
          this.StatisticsTotal = res.data.rows;
        });
    },
    // 用量统计 楼栋楼层total
    AxiosStatisticsColdUseTotal(startDate, endDate) {
      this.$axios
        .post("/iot/cold-water/getColdUseTotal", {
          startDate,
          endDate,
          layer: this.layer,
          areaId: this.dataid,
        })
        .then((res) => {
          this.StatisticsColdUseTotal = res.data.rows;
        });
    },
    //用量统计  表格数据
    AxiosStatisticsTableData(startDate, endDate) {
      this.loading = true;
      this.$axios
        .post("/iot/cold-water/getColdUseList", {
          current: this.CurrentPage,
          size: this.PageSize,
          startDate,
          endDate,
          layer: this.layer,
          areaId: this.dataid,
        })
        .then((res) => {
          this.StatisticsTableData = res.data.rows;
          this.loading = false;
        });
    },
    StatisticsDialogTimeChange() {
      this.StatisticsDialogTime == null
        ? (this.StatisticsDialogTime = [])
        : this.StatisticsDialogTime;
      this.AxiosStatisticsDialogTableData(
        this.StatisticsDialogTime[0],
        this.StatisticsDialogTime[1],
        this.StatisticsDialogLayer,
        this.StatisticsDailogAreaId
      );
      this.AxiosStatisticsDialogTotal(
        this.StatisticsDialogTime[0],
        this.StatisticsDialogTime[1],
        this.StatisticsDialogLayer,
        this.StatisticsDailogAreaId
      );
    },
    // 用量统计Dialogtable
    AxiosStatisticsDialogTableData(startDate, endDate, layer, areaId) {
      this.$axios
        .post("/iot/cold-water/getColdUseDetailsList", {
          layer,
          areaId,
          endDate,
          startDate,
          current: this.StatisticsDialogCurrentPage,
          size: this.StatisticsDialogPageSize,
        })
        .then((res) => {
          this.StatisticsDailogTableData = res.data.rows;
        });
    },
    // 用量统计Dialog详情
    AxiosStatisticsDialogTotal(startDate, endDate, layer, areaId) {
      this.$axios
        .post("/iot/cold-water/getColdUseDetailsTotal", {
          startDate,
          endDate,
          layer,
          areaId,
        })
        .then((res) => {
          this.StatisticsDialogTotal = res.data.rows;
        });
    },
    // 用量统计dialog详情
    StatisticsDIalogClick(item) {
      this.StatisticsDialogLayer = item.layer;
      this.StatisticsDailogAreaId = item.areaId;
      this.AxiosStatisticsDialogTableData(
        null,
        null,
        this.StatisticsDialogLayer,
        this.StatisticsDailogAreaId
      );
      this.AxiosStatisticsDialogTotal(
        null,
        null,
        this.StatisticsDialogLayer,
        this.StatisticsDailogAreaId
      );
      this.StatisticsDialog = true;
    },
    // 用量统计diaolog分页
    StatisticsDialogCurrentChange(val) {
      this.StatisticsDialogCurrentPage = val;
      this.StatisticsDialogTimeChange();
    },
    // 清零table
    AxiosClearData(startDate, endDate) {
      this.loading = true;
      this.$axios
        .post("/pay/refund/getProcessList", {
          current: this.CurrentPage,
          size: this.PageSize,
          type: 1,
          startDate,
          endDate,
          layer: this.layer,
          areaId: this.dataid,
          roomName: this.roomname,
          processMode: this.CZTypeValue,
        })
        .then((res) => {
          this.ClearTableData = res.data.rows;
          this.loading = false;
        });
    },
    // 清零总额
    AxiosClearTotal(startDate, endDate) {
      this.$axios
        .post("/pay/refund/getProcessTotal", {
          type: 1,
          startDate,
          endDate,
          layer: this.layer,
          areaId: this.dataid,
          roomName: this.roomname,
          processMode: parseInt(this.CZTypeValue),
        })
        .then((res) => {
          this.ClearTotal = res.data.rows;
        });
    },
    // 退款清零
    RefundCleared(id) {
      this.$axios
        .get("/pay/roomBalance/process/deviceBalanceReset", {
          params: { ids: id },
          paramsSerializer: (params) => {
            return params.ids.map((item) => `ids=${item}`).join("&");
          },
        })
        .then((res) => {
          if (res.data.code == 500) {
            this.$message.warning(res.data.msg);
          } else {
            this.$message.success("清零成功!");
          }
          this.search();
          this.RefundDialog = false;
        });
    },
    // 退款留存
    RefundLiuCun(id) {
      this.$axios
        .get("/pay/roomBalance/process/refundKeep", {
          params: { ids: id },
          paramsSerializer: (params) => {
            return params.ids.map((item) => `ids=${item}`).join("&");
          },
        })
        .then((res) => {
          if (res.data.code == 500) {
            this.$message.warning(res.data.msg);
          } else {
            this.$message.success("留存成功!");
          }
          this.RefundDialog = false;
          this.search();
        });
    },
    // 退款学生
    RefundTable(scope) {
      this.$axios
        .post("/pay/refund/refundUser", {
          roomId: scope.roomId,
          source: scope.source,
        })
        .then((res) => {
          this.RefundUser = res.data.rows;
          this.RefundId = scope.id;
          this.RefundTableDialog = true;
        });
    },
    // 退款金额
    AxiosRefundMoney(startDate, endDate) {
      this.$axios
        .post("/pay/refund/getEleTotal", {
          recordStatus: this.tkjlzt_value,
          roomName: this.roomname,
          current: this.CurrentPage,
          size: this.PageSize,
          layer: this.layer,
          buildingId: this.dataid,
          startDate,
          endDate,
          haveDeal: 1,
        })
        .then((res) => {
          this.RefundTotal = res.data.rows;
        });
    },
    // 退款table
    AxiosRefundTableData(startDate, endDate) {
      this.loading = true;
      this.$axios
        .post("/pay/refund/getEleList", {
          recordStatus: this.tkjlzt_value,
          roomName: this.roomname,
          current: this.CurrentPage,
          size: this.PageSize,
          layer: this.layer,
          buildingId: this.dataid,
          startDate,
          endDate,
          haveDeal: 1,
        })
        .then((res) => {
          this.RefundTableData = res.data.rows;
          this.loading = false;
        });
    },
    RefundCheckMethods() {
      this.$axios
        .post("/pay/refund/checkoutRefund", {
          id: this.RefundId,
          username: this.RefundUserValue,
        })
        .then((res) => {
          this.RefundUserValue = null;
          this.RefundTableDialog = false;
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.search();
          } else {
            this.$message.warning(res.data.msg);
            this.search();
          }
        });
    },
    RefundDialogCheck() {
      let [TKZ, Sfms] = [null, null];
      let ids = [];
      if (this.RefundDialogNumber == 1) {
        if (this.RefundDialogAllorone == 1) {
          TKZ = this.RefundCheckData.filter((item) => {
            return item.recordStatus == "退款中";
          });
          Sfms = this.RefundCheckData.filter((item) => {
            return item.source == 2;
          });
          if (TKZ !== null && TKZ.length > 0) {
            this.$message.warning("退款中不能进行留存操作,请重新选择!");
            this.RefundDialog = false;
            return;
          } else if (Sfms !== null && Sfms.length > 0) {
            this.$message.warning("不能将收费模式转换退款留存,请重新选择!");
            this.RefundDialog = false;
            return;
          } else {
            this.RefundCheckData.forEach((item) => {
              ids.push(item.id);
            });
            this.RefundLiuCun(ids);
          }
        } else if (this.RefundDialogAllorone == 2) {
          ids.push(this.LiuCunOrClearId);
          this.RefundLiuCun(ids);
        }
        this.LiuCunOrClearId = null;
        this.RefundDialogAllorone = null;
      } else if (this.RefundDialogNumber == 2) {
        if (this.RefundDialogAllorone == 1) {
          TKZ = this.RefundCheckData.filter((item) => {
            return item.recordStatus == "退款中";
          });
          if (TKZ !== null && TKZ.length > 0) {
            this.$message.warning("退款中不能进行留存操作,请重新选择!");
            this.RefundDialog = false;
            return;
          } else {
            this.RefundCheckData.forEach((item) => {
              ids.push(item.id);
            });
            this.RefundCleared(ids);
          }
        } else if (this.RefundDialogAllorone == 2) {
          ids.push(this.LiuCunOrClearId);
          this.RefundCleared(ids);
        }
        this.LiuCunOrClearId = null;
        this.RefundDialogAllorone = null;
      }
    },
    RefundDialogApprovalMethods() {
      if (this.RefundDialogApprovalValue == false) {
        if (this.RefundReason == null) {
          this.$message.warning("请填写拒绝原因!");
        } else {
          this.$axios
            .post("/pay/refund/checkoutApproval", {
              id: this.RefundDialogApprovalId,
              isPass: this.RefundDialogApprovalValue,
              reason: this.RefundReason,
            })
            .then((res) => {
              this.$message.success(res.data.msg);
              this.RefundDialogApproval = false;
              this.search();
            });
        }
      } else if (this.RefundDialogApprovalValue == true) {
        this.$axios
          .post("/pay/refund/checkoutApproval", {
            id: this.RefundDialogApprovalId,
            isPass: this.RefundDialogApprovalValue,
          })
          .then((res) => {
            this.$message.success(res.data.msg);
            this.RefundDialogApproval = false;
            this.search();
          });
      } else {
        this.$message.warning("请先选择操作类型!");
      }
    },
    RefundDialogApprovalClose() {
      this.RefundDialogApprovalValue = null;
      this.RefundReason = null;
    },
    handleSelectionChange(val) {
      this.RefundCheckData = val;
    },
    RechargeDialogShow(item) {
      this.RechargeDialogRefundId = item.id;
      this.RechargeDailogRoomId = item.roomId;
      this.RechargeDialogareaInfo = item.areaInfo;
      this.AxiosRechargeDialogTableData();
      this.AxiosRechargeDialogTotal();
      this.RechargeDialog = true;
    },
    HDRefundMethods() {
      if (
        this.RechargeDialogTotal.failedCharge + this.RechargeDialogTotal.deviceCharge !==
        this.RechargeDialogTotal.successCharge
      ) {
        this.$notify({
          title: "系统提示",
          message: `设备充值异常金额${this.RechargeDialogTotal.failedCharge}元和设备充值历史总额${this.RechargeDialogTotal.deviceCharge}元之和不等于 第三方充值成功总金额${this.RechargeDialogTotal.successCharge}元，不能退款！`,
          type: "warning",
          duration: 0,
        });
        return;
      } else {
        this.$axios
          .post(
            "/pay/rechargeRecord/ele/refund?rechargeId=" + this.RechargeDialogRefundId
          )
          .then((res) => {
            this.$message.success(res.data.msg);
            this.RechargeDialog = false;
          })
          .catch((error) => {
            this.$message.warning(error.response.data.message);
          });
      }
    },
    // 核单退款弹窗table
    AxiosRechargeDialogTableData() {
      this.$axios
        .post("/pay/rechargeRecord/ele/accountingList", {
          current: this.RechargeDialogCurrentPage,
          size: 5,
          roomId: this.RechargeDailogRoomId,
        })
        .then((res) => {
          this.RechargeDialogTableData = res.data.rows;
        });
    },
    // 核单退款弹窗总量
    AxiosRechargeDialogTotal() {
      this.DialogLoading = true;
      this.$axios
        .post(
          "/pay/rechargeRecord/ele/caleChargeTotal?roomId=" + this.RechargeDailogRoomId
        )
        .then((res) => {
          this.RechargeDialogTotal = res.data.rows;
          this.DialogLoading = false;
        })
        .catch((error) => {
          this.DialogLoading = false;
          this.$message.warning(error.response.data.message);
          this.RechargeDialog = false;
        });
    },
    // 核单退款弹窗分页
    RechargeDialogCurrentChange(val) {
      this.RechargeDialogCurrentPage = val;
      this.AxiosRechargeDialogTableData();
    },
    search() {
      if (this.rightheadertab == 0) {
        if (this.timecheck == 1) {
          if (this.sjfw_value == 0) {
            this.AxiosRechargeTableData(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
            this.AxiosRechargeTotal(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.AxiosRechargeTableData(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
            this.AxiosRechargeTotal(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else if (this.sjfw_value == 2) {
            this.AxiosRechargeTableData(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
            this.AxiosRechargeTotal(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else if (this.timecheck == 2) {
          this.AxiosRechargeTableData(this.zdystarttime, this.zdyendtime);
          this.AxiosRechargeTotal(this.zdystarttime, this.zdyendtime);
        } else {
          this.AxiosRechargeTableData(null, null);
          this.AxiosRechargeTotal(null, null);
        }
      } else if (this.rightheadertab == 1) {
        if (this.timecheck == 1) {
          if (this.sjfw_value == 0) {
            this.AxiosConsumptionTableData(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
            this.AxiosConsumptionTotal(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.AxiosConsumptionTableData(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
            this.AxiosConsumptionTotal(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else if (this.sjfw_value == 2) {
            this.AxiosConsumptionTableData(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
            this.AxiosConsumptionTotal(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else if (this.timecheck == 2) {
          this.AxiosConsumptionTableData(this.zdystarttime, this.zdyendtime);
          this.AxiosConsumptionTotal(this.zdystarttime, this.zdyendtime);
        } else {
          this.AxiosConsumptionTableData(null, null);
          this.AxiosConsumptionTotal(null, null);
        }
      } else if (this.rightheadertab == 2) {
        if (this.timecheck == 1) {
          if (this.sjfw_value == 0) {
            this.AxiosRefundTableData(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
            this.AxiosRefundMoney(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.AxiosRefundTableData(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
            this.AxiosRefundMoney(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else if (this.sjfw_value == 2) {
            this.AxiosRefundTableData(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
            this.AxiosRefundMoney(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else if (this.timecheck == 2) {
          this.AxiosRefundTableData(this.zdystarttime, this.zdyendtime);
          this.AxiosRefundMoney(this.zdystarttime, this.zdyendtime);
        } else {
          this.AxiosRefundTableData(null, null);
          this.AxiosRefundMoney(null, null);
        }
      } else if (this.rightheadertab == 3) {
        if (this.timecheck == 2) {
          this.AxiosClearData(this.zdystarttime, this.zdyendtime);
          this.AxiosClearTotal(this.zdystarttime, this.zdyendtime);
        } else if (this.timecheck == 1) {
          if (this.sjfw_value == 0) {
            this.AxiosClearTotal(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
            this.AxiosClearData(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.AxiosClearTotal(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
            this.AxiosClearData(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else if (this.sjfw_value == 2) {
            this.AxiosClearTotal(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
            this.AxiosClearData(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else {
          this.AxiosClearTotal(null, null);
          this.AxiosClearData(null, null);
        }
      } else if (this.rightheadertab == 4) {
        if (!this.dataid) {
          this.dataid = -1;
        }
        if (this.timecheck == 2) {
          this.AxiosStatisticsTotal(this.zdystarttime, this.zdyendtime);
          this.AxiosStatisticsTableData(this.zdystarttime, this.zdyendtime);
          this.AxiosStatisticsColdUseTotal(this.zdystarttime, this.zdyendtime);
        } else if (this.timecheck == 1) {
          if (this.sjfw_value == 0) {
            this.AxiosStatisticsTotal(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
            this.AxiosStatisticsTableData(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
            this.AxiosStatisticsColdUseTotal(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.AxiosStatisticsTotal(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
            this.AxiosStatisticsTableData(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
            this.AxiosStatisticsColdUseTotal(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else if (this.sjfw_value == 2) {
            this.AxiosStatisticsTotal(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
            this.AxiosStatisticsTableData(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
            this.AxiosStatisticsColdUseTotal(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else {
          this.AxiosStatisticsTotal(null, null);
          this.AxiosStatisticsTableData(null, null);
          this.AxiosStatisticsColdUseTotal(null, null);
        }
      }
    },
    Reset() {
      this.whetherglobal();
    },
    // 消费table
    AxiosConsumptionTableData(startDate, endDate) {
      this.loading = true;
      this.$axios
        .post("/pay/consumeRecord/waterAndEle/list", {
          current: this.CurrentPage,
          size: this.PageSize,
          consumerType: 2,
          startDate,
          endDate,
          layer: this.layer,
          buildingId: this.dataid,
          roomName: this.roomname,
        })
        .then((res) => {
          this.ConsumptionTableData = res.data.rows;
          this.loading = false;
        });
    },
    // 消费总和
    AxiosConsumptionTotal(startDate, endDate) {
      this.$axios
        .post("/pay/consumeRecord/waterAndEle/caleTotalUse", {
          consumerType: 2,
          startDate,
          endDate,
          layer: this.layer,
          buildingId: this.dataid,
          roomName: this.roomname,
        })
        .then((res) => {
          this.ConsumptionTotalData = res.data;
        });
    },
    //充值table数据
    AxiosRechargeTableData(startDate, endDate) {
      this.loading = true;
      this.$axios
        .post("/pay/rechargeRecord/list", {
          rechargeType: 2,
          current: this.CurrentPage,
          size: this.PageSize,
          rechargeChannel: this.czqd_value,
          rechargeStatus: this.jlzt_value,
          startDate: startDate,
          endDate: endDate,
          layer: this.layer,
          buildingId: this.dataid,
          roomName: this.roomname,
        })
        .then((res) => {
          this.RechargeTableData = res.data.rows;
          this.loading = false;
        });
    },
    // 充值总和
    AxiosRechargeTotal(startDate, endDate) {
      this.$axios
        .post("/pay/rechargeRecord/totalRecharge", {
          rechargeType: 2,
          rechargeChannel: this.czqd_value,
          rechargeStatus: this.jlzt_value,
          startDate: startDate,
          endDate: endDate,
          layer: this.layer,
          buildingId: this.dataid,
          roomName: this.roomname,
        })
        .then((res) => {
          this.RechargeTotalData = res.data.rows;
        });
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.search();
    },
    test() {
      if (this.zdystarttime == null) {
        this.zdyendtime = null;
      }
      if (this.zdystarttime != null || this.zdyendtime != null) {
        this.sjfw_value = null;
      }
    },
    iftimedisabled() {
      if (this.sjfw_value == "") {
        this.sjfw_value = null;
      }
      if (this.sjfw_value != null) {
        this.zdyendtime = null;
        this.zdystarttime = null;
      }
      if (
        this.sjfw_value == null &&
        this.zdyendtime == null &&
        this.zdystarttime == null
      ) {
        this.timecheck = 0;
      } else if (this.sjfw_value != null) {
        this.timecheck = 1;
      } else {
        this.timecheck = 2;
      }
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
        if (this.rightheadertab == 1 || this.rightheadertab == 4) {
          this.lefttree.push({
            id: "0",
            name: "未知区域",
            layer: "0",
            id: "0",
          });
        }
      });
    },
    // 切换tabs
    righttoptab(index) {
      this.rightheadertab = index;
      this.whetherglobal();
      this.default_qj = true;
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.default_qj = true;
      this.CurrentPage = 1;
      this.tkjlzt_value = null;
      this.roomname = null;
      this.jlzt_value = null;
      this.czqd_value = null;
      this.layer = null;
      this.dataid = null;
      this.timecheck = 0;
      this.sjfw_value = null;
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.search();
    },
    // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      this.CurrentPage = 1;
      this.dataid = data.id.replace(/[^0-9]/gi, "");
      this.layer = data.layer;
      this.search();
    },
  },
};
</script>

<style lang="scss" scoped>
.consumptiondialog {
  ::v-deep .el-date-editor {
    margin-left: 5px;
    width: 314px;
    height: 36px;
    background: #f5f6f7;
    border-radius: 6px;
    border: 0;
    .el-range-separator {
      width: 8%;
    }
    .el-range-input {
      background: #f5f6f7;
    }
  }
  ::v-deep .el-dialog {
    width: 858px;
    background: #ffffff;
    border-radius: 8px;
    .el-dialog__body {
      .small_pages {
        text-align: center;
        margin-top: 25px;
        li {
          display: inline-block;
          font-size: 18px;
          font-family: $font-scse;
          font-weight: 600;
          text-align: left;
          color: #178bff;
          vertical-align: middle;
          i {
            color: #b1bac9;
            font-size: 23px;
          }
          margin-right: 2px;
        }
      }
      p {
        font-size: 14px;
        font-family: $font-scme;
        font-weight: 500;
        color: #4a4a4a;
        letter-spacing: 2px;
      }
      .top {
        margin-top: 7px;
        ul {
          height: 42px;
          li {
            height: 100%;
            line-height: 42px;
            display: inline-block;
            font-size: 14px;
            font-family: $font-scme;
            font-weight: 500;
            color: #4a4a4a;
            letter-spacing: 2px;
            > span {
              font-size: 14px;
            }
          }
          button {
            width: 96px;
            height: 33px;
            background: #2d92ff;
            border-color: #2d92ff;
            border-radius: 5px;
            padding: 0;
            line-height: 33px;
            text-align: center;
            font-size: 14px;
            font-family: $font-scre;
            font-weight: 400;
            color: #ffffff;
            letter-spacing: 1px;
          }
        }
      }
      table {
        width: 100%;
        margin-top: 15px;
        text-align: center;
        border-collapse: collapse;
        tr:first-child {
          background: #2c9dff;
          th {
            font-size: 14px;
            border-right: 1px solid white;
            font-family: PingFangSC, PingFangSC-Medium;
            color: #ffffff;
            letter-spacing: 2px;
            &:last-child {
              border-right: 0;
              color: #ffffff;
            }
          }
        }
        tr {
          height: 40px;
          line-height: 40px;
          &:nth-child(2n) {
            background: #f1f9ff;
          }
          td {
            font-size: 14px;
            font-family: $font-scme;
            font-weight: 400;
            color: #41545b;
            &:last-child {
              color: #41545b;
            }
          }
        }
      }
      /deep/ .el-pagination {
        padding: 10px 0 0 0;
      }
    }
  }
}
.statistics {
  border-radius: 8px;
  padding: 25px 0 25px 0;
  background: #ffffff;
  margin-top: 19px;
  padding-bottom: 10px;
  .top_text {
    height: 55px;
    background: #e7f7ff;
    border: 1px solid #2d92ff;
    border-left: 0;
    border-right: 0;
    padding: 0 86px;
    > li {
      height: 100%;
      width: 25%;
      display: inline-block;
      line-height: 55px;
      font-size: 16px;
      font-family: $font-scme;
      color: #212d33;
      & li:last-child {
        padding-right: 0;
      }
      span {
        font-size: 24px;
        font-family: $font-scse;
        font-weight: 600;
        margin-left: 6px;
        color: #2d92ff;
      }
    }
  }
  .top_title {
    padding: 0 40px;
    margin-bottom: 20px;
    li {
      display: inline-block;
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      color: #212d33;
      &:first-child {
        margin-right: 68px;
      }
      span {
        display: inline-block;
        margin-left: 5px;
        font-size: 24px;
        font-family: $font-scse;
        font-weight: 600;
        color: #000000;
      }
    }
  }
}
.clear {
  padding: 10px 40px 25px 40px;
  .top_title {
    ul {
      display: inline-block;
      li {
        padding-right: 100px;
        &:last-child {
          padding-right: 0;
        }
        display: inline-block;
        font-size: 16px;
        font-family: $font-scme;
        font-weight: 500;
        color: #212d33;
        span {
          font-size: 24px;
          font-family: $font-scse;
          font-weight: 600;
          color: #000000;
        }
      }
    }
  }
}
.refund {
  /deep/ .el-table {
    margin-top: 15px;
    width: 100%;
    th {
      background: $thbg;
      font-size: 14px;
      text-align: center;
      height: 45px;
      line-height: 45px;
      color: #364147;
    }
    td {
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      color: #41545b;
      height: 45px;
      line-height: 45px;
      &:last-child {
        cursor: pointer;
        span {
          &:first-child {
            margin-right: 5px;
          }
        }
      }
    }
  }
  .top_title {
    button {
      &:hover {
        background: #59b3fd;
      }
      padding: 0 10px;
      margin: 0 10px;
      background: #2d92ff;
      border-radius: 5px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      border: 0;
      &:last-child {
        margin-right: 20px;
      }
    }
  }
  /deep/ .el-dialog {
    width: 450px;
    background: #ffffff;
    border-radius: 10px;
    .el-dialog__header {
      height: 46px;
      padding: 0;
      line-height: 46px;
      background: #2d92ff;
      border-radius: 10px 10px 0 0;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
      }
      .el-dialog__headerbtn {
        top: 0;
        i {
          color: white;
        }
      }
    }
    .el-dialog__body {
      padding-bottom: 10px;
      text-align: center;
      .el-select {
        width: 217px;
      }
      .reason {
        label {
          margin-left: 8px;
          display: inline-block;
          vertical-align: top;
          margin-top: 8px;
        }
        .el-textarea {
          display: inline-block;
          vertical-align: middle;
          width: 217px;
          input {
            height: 50px;
            line-height: 0;
            width: 217px;
          }
        }
      }
      > div {
        &:last-child {
          margin-top: 10px;
        }
      }
      label {
        text-align: right;
        margin-right: 10px;
        span {
          color: red;
          margin: 0;
        }
      }
      img {
        width: 32px;
      }
      span {
        font-size: 14px;
        font-weight: 400;
        color: #4a4a4a;
        display: inline-block;
        vertical-align: middle;
        margin-left: 18px;
      }
    }
  }
}
.table_data {
  .recharge {
    /deep/ .el-dialog {
      width: 65%;
      margin-top: 5vh !important;
      border-radius: 8px;
      padding: 24px 59px 20px 68px;
      .el-dialog__header {
        padding: 0;
        .el-dialog__title {
          font-size: 18px;
          font-family: $font-scme;
          color: #4a4a4a;
          font-weight: 500;
        }
      }
      .el-dialog__footer {
        padding: 0;
      }
      .el-dialog__body {
        .params {
          i {
            margin-left: 16px;
            color: #2d92ff;
            font-size: 16px;
            display: inline-block;
            vertical-align: middle;
          }
          > span {
            display: inline-block;
            vertical-align: middle;
            padding: 0 3px;
            font-size: 14px;
          }
          margin-top: 40px;
          border-top: 1px solid #2d92ff;
          height: 55px;
          line-height: 55px;
          background: #e7f7ff;
        }
        padding: 39px 0 16px 0;
        h3 {
          text-align: center;
          font-size: 16px;
          font-family: $font-scme;
          font-weight: 500;
          color: #41545b;
        }
        .MoneyAndCode {
          background: #ffffff;
          box-shadow: 2px 2px 16px 0px rgba(166, 169, 175, 0.5);
          margin-top: 31px;
          li {
            width: 50%;
            padding: 16px 0;
            div {
              &:last-child {
                margin-top: 8px;
                font-size: 18px;
              }
            }
            &:first-child {
              border-right: $border;
            }
            font-size: 16px;
            font-family: $font-scme;
            text-align: center;
            color: #41545b;
            display: inline-block;
          }
        }
        table {
          margin-top: 0;
          background: white;
          th {
            background: #2c9dff;
            color: white;
            font-size: 14px;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
          }
          td {
            font-size: 14px;
            font-weight: 400;
            text-align: center;
          }
          tr:nth-of-type(2n) {
            td {
              background: #f1f9ff;
            }
          }
        }
      }
    }
  }
  margin-top: 15px;
  border-radius: 8px;
  padding: 10px 40px 25px 40px;
  background: white;
  ::v-deep .el-pagination {
    text-align: center;
    padding: 15px 0;
  }
  .colorblue {
    color: #268eff;
  }
  .colorred {
    color: #ff2020;
  }
  .bgblue {
    background: #1991ff;
  }
  .bggreen {
    background: #51c41b;
  }
  .bgred {
    background: #ff2020;
  }
  .bgyellow {
    background: #ffa107;
  }
  .bgviolet {
    background: #c931ff;
  }

  .recharge,
  .clear,
  .statistics,
  .consumption {
    table {
      width: 100%;
      margin-top: 14px;
      border-collapse: collapse;
      tr {
        .fontblue {
          color: #2d92ff;
          cursor: pointer;
        }
        .span {
          display: inline-block;
          padding: 3px 5px;
          border-radius: 2px;
          border-radius: 2px;
        }
        .i {
          display: inline-block;
          vertical-align: middle;
          width: 8px;
          height: 8px;
          margin-right: 5px;
          border-radius: 50px;
        }
        height: 58px;
        line-height: 58px;
        td:first-of-type {
          padding-left: 15px;
        }
        td {
          font-size: 14px;
          text-align: center;
          font-family: $font-scre;
          font-weight: 400;
          color: #212d33;
          border-bottom: 1px solid #ebeef5;
          span {
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
      tr:first-of-type {
        background: #f2f9ff;
        th {
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }
  .top_title {
    h3 {
      font-size: 24px;
      font-family: $font-scse;
      font-weight: 600;
      color: #000000;
      > div {
        margin-top: 3px;
      }
      span {
        margin-right: 3px;
        font-size: 16px;
        font-family: $font-scme;
        font-weight: 500;
        letter-spacing: 1px;
        color: #212d33;
      }
    }
    button {
      height: 33px;
      line-height: 33px;
      text-align: center;
      background: #2d92ff;
      border-radius: 5px;
      border: 0;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 1px;
      i {
        margin: 0;
      }
    }
    border-radius: 8px;
    margin-top: 6px;
  }
}
.middle_content {
  padding: 0 19px;
  .right {
    width: 1350px;
    .top_header {
      background: white;
      z-index: 999;
      height: 45px;
      border-radius: 10px;
      li {
        &:hover {
          color: #2c9dff;
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
  }
  .filter {
    margin-top: 15px;
    padding: 18px 20px;
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
      border-top: 1px solid #ebeef5;
      > div {
        margin-right: 167px;
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
</style>

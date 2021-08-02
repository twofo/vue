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
          <div class="refundjlzt fl" v-if="rightheadertab == 2">
            <p>记录状态</p>
            <el-select clearable v-model="refundjlzt_value" placeholder="请选择">
              <el-option
                v-for="item in refundjlzt_select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="fl" v-if="rightheadertab == 0 || rightheadertab == 2">
            <p>按姓名/学工号查询</p>
            <el-input
              clearable
              v-model="user_name"
              placeholder="请输入姓名/学工号"
            ></el-input>
          </div>
          <div class="fl" v-if="rightheadertab == 1">
            <p>按学工号查询</p>
            <el-input clearable v-model="userCode" placeholder="请输入学工号"></el-input>
          </div>
          <div class="fl" v-if="rightheadertab == 1">
            <p>按姓名查询</p>
            <el-input clearable v-model="user_name" placeholder="按姓名查询"></el-input>
          </div>
          <div class="fl" v-if="rightheadertab == 2">
            <p>按订单号查询</p>
            <el-input
              clearable
              v-model="outTradeNo"
              placeholder="按订单号查询"
            ></el-input>
          </div>
          <div class="fl Money" v-if="rightheadertab == 1">
            <p>按金额查询(元)</p>
            <el-input
              @input="
                (val) => {
                  minMoney = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
                }
              "
              clearable
              v-model="minMoney"
              placeholder="请输入最小金额"
            ></el-input>
            <span>-</span>
            <el-input
              @input="
                (val) => {
                  maxMoney = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
                }
              "
              clearable
              v-model="maxMoney"
              placeholder="请输入最大金额"
              :disabled="minMoney == null || minMoney == ''"
            ></el-input>
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
          <button
            @click="
              currentPage = 1;
              search();
            "
          >
            搜索
          </button>
          <button @click="Reset">重置</button>
        </div>
      </div>
      <!-- 充值 -->
      <div class="recharge" v-if="rightheadertab == 0">
        <h3 class="top_title">
          <div>
            <span>总计金额(元):</span>
            {{ rechargetotal || 0 }}
          </div>
          <div>
            <span>已充值金额(元)</span>
            {{ rechargemoney || 0 }}
          </div>
        </h3>
        <div class="button">
          <button v-preventReClick="2000" @click="search">刷新</button>
          <button v-preventReClick="2000" @click="exportimport">导出列表</button>
        </div>
        <table v-loading="loading">
          <tr>
            <td>学工号</td>
            <td>宿舍信息</td>
            <td>姓名</td>
            <td
              @click="sorttable('rechargeSum')"
              :class="
                recharge_sumnumber == 1
                  ? 'ascending'
                  : recharge_sumnumber == 2
                  ? 'descending'
                  : ''
              "
            >
              充值金额(元)
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </td>
            <td>充值单号</td>
            <td>充值渠道</td>
            <td
              @click="sorttable('rechargeTime')"
              :class="
                recharge_timeconsume_timenumber == 1
                  ? 'ascending'
                  : recharge_timeconsume_timenumber == 2
                  ? 'descending'
                  : ''
              "
            >
              充值时间
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </td>
            <td>充值状态</td>
          </tr>
          <template
            v-if="rechargedata.records !== undefined && rechargedata.records.length > 0"
          >
            <tr v-for="(item, index) in rechargedata.records" :key="index">
              <td>{{ item.identifier == null ? "-" : item.identifier }}</td>
              <td>{{ item.areaInfo || "-" }}</td>
              <td>{{ item.fullName == null ? "-" : item.fullName }}</td>
              <td>{{ item.rechargeSum == null ? "-" : item.rechargeSum }}</td>
              <td>{{ item.outTradeNo == null ? "-" : item.outTradeNo }}</td>
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
                    : ""
                }}
              </td>
              <td>{{ item.rechargeTime }}</td>
              <td>
                <i v-if="item.rechargeStatus == '3'" class="i bgblue"></i>
                <i v-if="item.rechargeStatus == '2'" class="i bggreen"></i>
                <i v-if="item.rechargeStatus == '1'" class="i bgred"></i>
                <i v-if="item.rechargeStatus == '4'" class="i bgyellow"></i>
                <span v-if="item.rechargeStatus == '3'">充值关闭</span>
                <span v-if="item.rechargeStatus == '2'">已充值</span>
                <span v-if="item.rechargeStatus == '1'">充值中</span>
                <span v-if="item.rechargeStatus == '4'">冻结</span>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td class="center" colspan="8">暂无数据</td>
          </tr>
        </table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="rechargedata.total"
        ></el-pagination>
      </div>
      <!-- 消费 -->
      <div v-if="rightheadertab == 1" class="consumption">
        <h3 class="top_title" v-if="consumption_total">
          <div>
            <span>总用水量(吨):</span>
            {{ consumption_total.totalUseAmount || 0 }}
          </div>
          <div>
            <span>消费总额(元):</span>
            {{ consumption_total.totalUseMoney || 0 }}
          </div>
        </h3>
        <div class="button">
          <button v-preventReClick="2000" @click="search">刷新</button>
          <button v-preventReClick="2000" @click="exportimport">导出列表</button>
        </div>
        <table v-loading="loading">
          <tr>
            <th>学工号</th>
            <th>姓名</th>
            <th>消费位置信息</th>
            <th
              @click="sorttable('consumeAmount')"
              :class="
                consume_amountnumber == 1
                  ? 'ascending'
                  : consume_amountnumber == 2
                  ? 'descending'
                  : ''
              "
            >
              用水量(L)
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th
              @click="sorttable('consumeSum')"
              :class="
                consume_sumnumber == 1
                  ? 'ascending'
                  : consume_sumnumber == 2
                  ? 'descending'
                  : ''
              "
            >
              消费金额(元)
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th>消费渠道</th>
            <th
              @click="sorttable('consumeTime')"
              :class="
                consume_timenumber == 1
                  ? 'ascending'
                  : consume_timenumber == 2
                  ? 'descending'
                  : ''
              "
            >
              消费时间
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </th>
            <th>记录状态</th>
            <th>详情</th>
          </tr>
          <template
            v-if="
              consumption_data.records !== undefined &&
              consumption_data.records.length > 0
            "
          >
            <tr v-for="(item, index) in consumption_data.records" :key="index">
              <td>{{ item.identifier || "-" }}</td>
              <td>{{ item.fullName || "-" }}</td>
              <td>{{ item.areaInfo || "-" }}</td>
              <td>{{ item.consumeAmount || "-" }}</td>
              <td>{{ item.consumeSum || "-" }}</td>
              <td>
                {{
                  item.consumeChannel == 0
                    ? "系统代扣"
                    : item.consumeChannel == 1
                    ? "微信支付"
                    : item.consumeChannel == 2
                    ? "支付宝支付"
                    : item.consumeChannel == 3
                    ? "银联支付"
                    : item.consumeChannel == 4
                    ? "二维码"
                    : item.consumeChannel == 5
                    ? "卡"
                    : item.consumeChannel == 6
                    ? "人脸"
                    : "-"
                }}
              </td>
              <td>{{ item.consumeTime || "-" }}</td>
              <td>
                <i
                  :class="[
                    item.status == 0
                      ? 'bggreen'
                      : item.status == 1
                      ? 'bgred'
                      : item.status == 2
                      ? 'bgyellow'
                      : item.status == 3
                      ? 'bgblue'
                      : '',
                    'i',
                  ]"
                ></i>
                {{
                  item.status == 0
                    ? "交易成功"
                    : item.status == 1
                    ? "交易失败"
                    : item.status == 2
                    ? "状态"
                    : item.status == 3
                    ? "交易撤销"
                    : "-"
                }}
              </td>
              <td>
                <span class="fontblue" @click="consumptiondialogshow(item)">详情</span>
              </td>
            </tr>
          </template>
        </table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="consumption_data.total"
        ></el-pagination>
        <el-dialog
          :visible.sync="consumptiondialogshoworhide"
          center
          @close="consumptiondialog_time = null"
          class="consumptiondialog"
        >
          <div class="top_text">
            <p>
              用户名称:
              <span v-if="consumption_dialogdata !== null">{{
                consumption_dialogdata.fullName || "-"
              }}</span>
              <span v-else>-</span>
            </p>
            <ul class="clearfix">
              <li class="fl">
                该用户累计用量(吨):
                <span>
                  {{
                    consumption_dialogwatertotal == null
                      ? "0"
                      : consumption_dialogwatertotal
                  }}
                </span>
              </li>
            </ul>
          </div>
          <table>
            <tr>
              <td>设备编号</td>
              <td>用水区域信息</td>
              <td>开始时间</td>
              <td>结束时间</td>
              <td>用水时长</td>
              <td>用水量(L)</td>
            </tr>
            <tr v-if="consumption_dialogdata !== null">
              <td>{{ consumption_dialogdata.deviceCode || "-" }}</td>
              <td>{{ consumption_dialogdata.areaInfo || "-" }}</td>
              <td>{{ consumption_dialogdata.startTime || "-" }}</td>
              <td>{{ consumption_dialogdata.endTime || "-" }}</td>
              <td>{{ consumption_dialogdata.useTime || "-" }}</td>
              <td>{{ consumption_dialogdata.waterConsumption || "-" }}</td>
            </tr>
            <tr v-else>
              <td colspan="6" style="text-align: center">暂无数据</td>
            </tr>
          </table>
        </el-dialog>
      </div>
      <!-- 退款 -->
      <div class="refund" v-if="rightheadertab == 2">
        <h3 class="top_title">
          <div>
            <span>退款总额(元):</span>
            {{ refund_total.totalMoney == "" ? "0" : refund_total.totalMoney }}
          </div>
        </h3>
        <div class="button">
          <button v-preventReClick="2000" @click="search">刷新</button>
          <button v-preventReClick="2000" @click="exportimport">导出列表</button>
        </div>
        <el-table v-loading="loading" :data="refund_data.records" style="width: 100%">
          <el-table-column label="记录状态">
            <template slot-scope="scope">
              <i
                :class="[
                  scope.row.recordStatus == '审核成功'
                    ? 'bggreen'
                    : scope.row.recordStatus == '退款成功'
                    ? 'bgblue'
                    : scope.row.recordStatus == '审核拒绝'
                    ? 'bgred'
                    : scope.row.recordStatus == '退款失败'
                    ? 'bgyellow'
                    : '',
                  'i',
                ]"
              ></i>
              <span
                class="fontblue pointer"
                @click="refundeldial(scope.row)"
                v-if="
                  scope.row.recordStatus == '审核中' || scope.row.recordStatus == '未审核'
                "
                >审批</span
              >
              <span v-else> {{ scope.row.recordStatus || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" width="160">
            <div
              slot="header"
              slot-scope="item"
              @click="sorttable('applyTime')"
              :class="
                applyTimenumber == 1
                  ? 'ascending'
                  : applyTimenumber == 2
                  ? 'descending'
                  : ''
              "
            >
              <span>申请时间</span>
              <span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </div>
          </el-table-column>
          <el-table-column label="学号" width="100">
            <template slot-scope="scope">{{ scope.row.identifier || "-" }}</template>
          </el-table-column>
          <el-table-column label="姓名" width="100">
            <template slot-scope="scope">{{ scope.row.fullName || "-" }}</template>
          </el-table-column>
          <el-table-column width="130" prop="refundMoney">
            <div
              slot="header"
              slot-scope="item"
              @click="sorttable('refundMoney')"
              :class="
                refundMoneynumber == 1
                  ? 'ascending'
                  : refundMoneynumber == 2
                  ? 'descending'
                  : ''
              "
            >
              <span>退款金额(元)</span
              ><span class="tablesort">
                <i class="ascending ascendingcheck"></i>
                <i class="descending descendingcheck"></i>
              </span>
            </div>
          </el-table-column>
          <el-table-column label="银行卡号" width="180">
            <template slot-scope="scope">{{ scope.row.cardNumber || "-" }}</template>
          </el-table-column>
          <el-table-column label="退款订单号">
            <template slot-scope="scope">{{ scope.row.outTradeNo || "-" }}</template>
          </el-table-column>
          <el-table-column label="电话号码">
            <template slot-scope="scope">{{ scope.row.mobile || "-" }}</template>
          </el-table-column>
          <el-table-column label="备注" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.note || "-" }}</template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="系统提示"
          :visible.sync="refund_dialog"
          center
          class="refunddialog"
        >
          <div>
            <img src="../../../assets/images/query_stats/caveat.png" alt />
            <span>是否进行退款操作?</span>
          </div>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="备注"
            v-model="refundnote"
          ></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-preventReClick="3000" @click="Approved()"
              >审批通过</el-button
            >
            <el-button v-preventReClick="3000" @click="recordsreturn()">打回</el-button>
          </span>
        </el-dialog>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="refund_data.total"
        ></el-pagination>
      </div>
      <!-- 用量统计 -->
      <div class="statistics" v-if="rightheadertab == 3">
        <ul class="top_text clearfix">
          <li class="fl">
            总用水量(吨):
            <span>{{ statistics_total.totalUse || 0 }}</span>
          </li>
          <li class="fl">
            日平均用水量(吨):
            <span>{{ statistics_total.averageUse || 0 }}</span>
          </li>
          <li class="fl">
            日最低用水量(吨):
            <span>{{ statistics_total.lowUse || 0 }}</span>
          </li>
          <li class="fr">
            日最高用水量(吨):
            <span>{{ statistics_total.highUse || 0 }}</span>
          </li>
        </ul>
        <div class="top_title clearfix">
          <template v-if="layer0">
            <p class="fl" v-if="statisticsBuildingandFloor.waterBuildingTotal != null">
              当前楼栋用水量(吨):
              <span>{{ statisticsBuildingandFloor.waterBuildingTotal }}</span>
            </p>
            <p class="fl" v-if="statisticsBuildingandFloor.waterFloorTotal != null">
              当前楼层用水量(吨):
              <span>{{ statisticsBuildingandFloor.waterFloorTotal }}</span>
            </p>
          </template>
          <el-button type="primary" class="jshidden fr">
            <i class="el-icon-folder-add el-icon--left"></i>
            导出列表
          </el-button>
        </div>
        <div class="padding_table">
          <table>
            <tr>
              <td>序号</td>
              <td>单位名称</td>
              <td>用水量(升)</td>
              <td v-if="statistics_data.layer" class="fontblue">详情</td>
            </tr>
            <template
              v-if="
                statistics_data.records !== undefined &&
                statistics_data.records.length > 0
              "
            >
              <tr v-for="(item, index) in statistics_data.records" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.unitName }}</td>
                <td>{{ item.useEnergy }}</td>
                <td v-if="statistics_data.layer" @click="SeeDetails(index)">
                  <span class="fontblue pointer">查看详情</span>
                </td>
              </tr>
            </template>
          </table>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="statistics_data.total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :visible.sync="statisticsdialogshoworhide"
      width="30%"
      center
      @close="consumption_dialogdata = ''"
      class="consumptiondialog"
    >
      <div class="top_text">
        <p>
          单位名称:
          <span>{{ statisticsdialogName }}</span>
        </p>
        <ul class="clearfix">
          <li class="fl">
            热水总量(吨):
            <span>{{ statisticstdialogtotal || 0 }}</span>
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
              @change="statisticsdialog_timesearch"
              v-model="statistics_dialogdatatime"
              type="daterange"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions0"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </li>
        </ul>
      </div>
      <table>
        <tr>
          <td>序号</td>
          <td>用水日期</td>
          <td>用水量(升)</td>
        </tr>
        <tr v-for="(item, index) in statistics_dialogdata.records" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.dateTime }}</td>
          <td>{{ item.useEnergy }}</td>
        </tr>
      </table>
      <el-pagination
        @current-change="statisticsdialog_tablepages"
        :current-page="statisticsdialog_tablecurrent"
        :page-sizes="statisticsdialog_tablepagesizes"
        :page-size="statisticsdialog_tablepagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="statistics_dialogdata.total"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
import utils from "@/utils/utils";
import excel from "@/utils/methods";
export default {
  name: "hotwater",
  mixins: [sortmixin],
  data() {
    return {
      refundMoneynumber: 0,
      applyTimenumber: 0,
      consume_timenumber: 0,
      consume_amountnumber: 0,
      consume_sumnumber: 0,
      recharge_sumnumber: 0,
      recharge_timeconsume_timenumber: 0,
      loading: false,
      rechargemoney: null,
      minMoney: null,
      maxMoney: null,
      refundnote: null,
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
      statisticstdialogtotal: "", //总量dialog热水总量
      refund_total: "", //退款记录总和
      refundjlzt_value: null, //退款记录状态
      // 退款记录select
      refundjlzt_select: [
        // {
        //   value: "0",
        //   label: "未审核",
        // },
        {
          value: "2",
          label: "审核中",
        },
        {
          value: "3",
          label: "审核成功",
        },
        {
          value: "4",
          label: "审核拒绝",
        },
        {
          value: "5",
          label: "退款失败",
        },
        {
          value: "6",
          label: "退款成功",
        },
      ],
      refund_dialog: false, //退款dialog
      refund_data: [], //退款数据
      pagesshoworhide: true, //分页显示or隐藏
      statistics_total: {}, //总用量
      statistics_data: [], //总用量数据
      consumption_dialogwatertotal: "", //消费diaolog用水总量
      consumption_dialogdata: "", //消费dialog默认数据
      statisticsdialog_tablecurrent: 1, //用量统计dialog分页
      statisticsdialog_tablepagesizes: [5],
      statisticsdialog_tablepagesize: 5,
      statistics_dialogdatatime: [], //用量统计dialogtime数据
      statistics_dialogdata: [], //用量统计dialog默认数据
      statistics_dialogsearchId: "", //用量统计dialog查询id
      statisticsBuildingandFloor: {
        waterBuildingTotal: null,
        waterFloorTotal: null,
      }, //用量统计当前楼栋楼层用水量
      statisticsdialogshoworhide: false, //用量统计dialog显示隐藏
      consumption_total: {}, //消费统计总数
      consumption_data: [], //消费数据
      consumptiondialogshoworhide: false, //消费dialog showorhide
      rechargetotal: null, //充值总金额
      rechargedata: [], //充值查询数据
      pagesizes: [10, 20, , 30, 50], // 个数选择器
      pagesize: 10, // 默认每页显示条数
      currentPage: 1, //默认页数
      time_twocheck: 0, //下拉选择时间or自定义时间  0都未选  1下拉时间  2自定义时间
      zdystarttime: null, //自定义时间范围
      zdyendtime: null,
      sjfw_value: null, //时间范围下框框选中值
      user_name: null, //用户查询
      outTradeNo: null,
      jlzt_value: null, //记录状态下拉框选择
      czqd_value: null, //充值渠道下拉框选择
      filtercheck: true, //筛选showorhide
      rightheadertab: 0, //tab数 showorhide
      rightheader: ["充值", "消费", "退款", "用量统计"], //右侧头部tab切换数据
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      // 时间选择器
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
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
      //   充值渠道 下拉框内容
      czqd_select: [
        // {
        //   value: "0",
        //   label: "系统充值",
        // },
        {
          value: "1",
          label: "微信",
        },
        // {
        //   value: "2",
        //   label: "支付宝",
        // },
        {
          value: "3",
          label: "平台充值",
        },
        // {
        //   value: "4",
        //   label: "桌面应用充值",
        // },
      ],
      //   记录状态 下拉框内容
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
      statisticsdialogName: "", //用量统计dialog单位名称
      statisticslayer: null, //用量统计dialog分页所需layer
      statisticsdataid: null, //用量统计dialog分页所需id
      recordsDialogdata: {}, //退款审批所需数据
      unitName: null, //用量统计未知区域设备查详情所需code
      layer0: true,
      userCode: null, //学工号
      sortable: 0, //表格排序
    };
  },
  watch: {
    minMoney: function (oldnumber, newnumber) {
      if (oldnumber == "" || oldnumber == null) {
        this.maxMoney = null;
      }
    },
    deep: true,
  },
  methods: {
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
        this.time_twocheck = 0;
      } else if (this.sjfw_value != null) {
        this.time_twocheck = 1;
      } else {
        this.time_twocheck = 2;
      }
    },
    test() {
      if (this.zdystarttime == null) {
        this.zdyendtime = null;
      }
      if (this.zdystarttime != null || this.zdyendtime != null) {
        this.sjfw_value = null;
      }
    },
    // 审批通过
    Approved() {
      this.$axios
        .post("/pay/refund/hotWaterRefund", {
          id: this.recordsDialogdata.id,
          username: this.recordsDialogdata.identifier,
          refundSum: this.recordsDialogdata.refundMoney,
          refundStatus: 3,
          userId: this.recordsDialogdata.userId,
          note: this.refundnote,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message.success("审批成功");
          } else {
            this.$message.warning("审批失败,请稍后重试!");
          }
          this.search();
          this.refund_dialog = false;
          this.refundnote = null;
        })
        .catch((error) => {});
    },
    // 审批打回
    recordsreturn() {
      this.$axios
        .post("/pay/refund/hotWaterRefund", {
          id: this.recordsDialogdata.id,
          username: this.recordsDialogdata.identifier,
          refundSum: this.recordsDialogdata.refundMoney,
          refundStatus: 4,
          userId: this.recordsDialogdata.userId,
          note: this.refundnote,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.warning(res.data.msg);
          }
          this.search();
          this.refund_dialog = false;
          this.refundnote = null;
        })
        .catch((error) => {});
    },
    Reset() {
      // 重置搜索条件
      this.currentPage = 1;
      this.refundjlzt_value = null;
      this.userCode = null;
      this.outTradeNo = null;
      this.statisticslayer = null;
      this.statisticsdataid = null;
      this.sortable = 0;
      this.user_name = null;
      this.sjfw_value = null;
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.minMoney = null;
      this.maxMoney = null;
      [
        this.recharge_sumnumber,
        this.recharge_timeconsume_timenumber,
        this.sortnumber,
        this.consume_sumnumber,
        this.consume_amountnumber,
        this.consume_timenumber,
        this.applyTimenumber,
        this.refundMoneynumber,
      ] = [0, 0, 0, 0, 0, 0, 0, 0];
      this.time_twocheck = 0;
      this.default_qj = true;
      this.lddata();
      if (this.rightheadertab == 0) {
        this.czqd_value = null; //充值渠道
        this.jlzt_value = null;
        this.search();
      } else if (this.rightheadertab == 2) {
        this.search();
      } else if (this.rightheadertab == 1) {
        this.search();
      } else {
        this.statisticsPagesearch();
      }
    },
    // 导出
    exportimport() {
      let url =
        this.rightheadertab == 0
          ? "/export/reportForm/hotWaterRecharge"
          : this.rightheadertab == 1
          ? "/export/reportForm/hotWaterConsume"
          : this.rightheadertab == 2
          ? "/export/reportForm/hotWaterRefund"
          : "";
      let text =
        this.rightheadertab == 0
          ? "热水充值记录"
          : this.rightheadertab == 1
          ? "热水消费记录"
          : this.rightheadertab == 2
          ? "热水退款记录"
          : "";
      let data = this.AxiosParams;
      this.$delete(data, "current");
      this.$delete(data, "size");
      excel.importexcel(url, data, text);
    },
    refundeldial(index) {
      this.recordsDialogdata = index;
      this.refund_dialog = true;
    },
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name).then((res) => {
        if (this.rightheadertab == 0) {
          this.rechargedata = res.data.rows;
          if (name == "rechargeSum") {
            this.recharge_sumnumber = this.sortnumber;
            this.recharge_timeconsume_timenumber = 0;
          } else if (name == "rechargeTime") {
            this.recharge_timeconsume_timenumber = this.sortnumber;
            this.recharge_sumnumber = 0;
          }
          this.loading = false;
        } else if (this.rightheadertab == 1) {
          this.consumption_data = res.data.rows;
          if (name == "consumeSum") {
            this.consume_sumnumber = this.sortnumber;
            this.consume_amountnumber = 0;
            this.consume_timenumber = 0;
          } else if (name == "consumeAmount") {
            this.consume_amountnumber = this.sortnumber;
            this.consume_sumnumber = 0;
            this.consume_timenumber = 0;
          } else if (name == "consumeTime") {
            this.consume_amountnumber = 0;
            this.consume_sumnumber = 0;
            this.consume_timenumber = this.sortnumber;
          }
          this.loading = false;
        } else if (this.rightheadertab == 2) {
          this.refund_data = res.data.rows;
          if (name == "applyTime") {
            this.applyTimenumber = this.sortnumber;
            this.refundMoneynumber = 0;
          } else if (name == "refundMoney") {
            this.refundMoneynumber = this.sortnumber;
            this.applyTimenumber = 0;
          }
          this.loading = false;
        }
      });
    },
    //查询按钮带条件查询
    search() {
      if (this.rightheadertab == 0) {
        if (this.time_twocheck == 1) {
          if (this.sjfw_value == 0) {
            this.AxiosRecharge(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.AxiosRecharge(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else if (this.sjfw_value == 2) {
            this.AxiosRecharge(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else if (this.time_twocheck == 2) {
          this.AxiosRecharge(this.zdystarttime, this.zdyendtime);
        } else {
          this.AxiosRecharge(null, null);
        }
      } else if (this.rightheadertab == 1) {
        if (this.time_twocheck == 1) {
          if (this.sjfw_value == 0) {
            this.AxiosConsumption(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.AxiosConsumption(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else if (this.sjfw_value == 2) {
            this.AxiosConsumption(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else if (this.time_twocheck == 2) {
          this.AxiosConsumption(this.zdystarttime, this.zdyendtime);
        } else {
          this.AxiosConsumption(null, null);
        }
      } else if (this.rightheadertab == 2) {
        if (this.time_twocheck == 1) {
          if (this.sjfw_value == 0) {
            this.AxiosRefund(
              localStorage.getItem("thismonthstart"),
              localStorage.getItem("thismonth")
            );
          } else if (this.sjfw_value == 1) {
            this.AxiosRefund(
              localStorage.getItem("lastmonthstart"),
              localStorage.getItem("lastmonthend")
            );
          } else if (this.sjfw_value == 2) {
            this.AxiosRefund(
              localStorage.getItem("lastquarterstart"),
              localStorage.getItem("lastquarterend")
            );
          }
        } else if (this.time_twocheck == 2) {
          this.AxiosRefund(this.zdystarttime, this.zdyendtime);
        } else {
          this.AxiosRefund(null, null);
        }
      } else if (this.rightheadertab == 3) {
        this.statisticsPagesearch();
      }
    },
    //用量统计dialog分页
    statisticsdialog_tablepages(val) {
      this.statisticsdialog_tablecurrent = val;
      this.statisticsdialogdata();
    },
    // 用量统计查看详情dialog数据查询
    statisticsdialogdata() {
      if (this.statistics_dialogdatatime == null) {
        this.statistics_dialogdatatime = [];
      }
      this.$axios
        .post("/iot/hot-water/getDetails", {
          deviceCode: this.unitName,
          buildingId: this.statistics_dialogsearchId,
          current: this.statisticsdialog_tablecurrent,
          size: 5,
          startDate: this.statistics_dialogdatatime[0],
          endDate: this.statistics_dialogdatatime[1],
        })
        .then((res) => {
          this.statistics_dialogdata = res.data.rows;
        });
    },
    statisticsUsernameTotal() {
      if (this.statistics_dialogdatatime == null) {
        this.statistics_dialogdatatime == [];
      }
      this.$axios
        .post("/iot/hot-water/getDetailsTotal", {
          deviceCode: this.unitName,
          buildingId: this.statistics_dialogsearchId,
          startDate: this.statistics_dialogdatatime[0],
          endDate: this.statistics_dialogdatatime[1],
        })
        .then((res) => {
          this.statisticstdialogtotal = res.data.rows.useTotal;
          this.statisticsdialogName = res.data.rows.unitName;
        });
    },
    // 用量统计查看详情
    SeeDetails(index) {
      this.statistics_dialogsearchId = this.statistics_data.records[index].buildingId;
      this.unitName = this.statistics_data.records[index].unitName;
      this.statisticsdialogdata();
      this.statisticsUsernameTotal();
      this.statisticsdialogshoworhide = true;
    },
    // 用量统计查看详情选择时间查询
    statisticsdialog_timesearch() {
      this.statisticsdialogdata();
      this.statisticsUsernameTotal();
    },
    //总用量查询
    statistics_search() {
      if (this.time_twocheck == 1) {
        if (this.sjfw_value == 0) {
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              startDate: localStorage.getItem("thismonthstart"),
              endDate: localStorage.getItem("thismonth"),
              buildingId: -1,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });
          // 数据
          this.$axios
            .post("/iot/hot-water/getAllHotUseTotal", {
              current: this.currentPage,
              size: this.pagesize,
              startDate: localStorage.getItem("thismonthstart"),
              endDate: localStorage.getItem("thismonth"),
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", false);
            });
        } else if (this.sjfw_value == 1) {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              startDate: localStorage.getItem("lastmonthstart"),
              endDate: localStorage.getItem("lastmonthend"),
              buildingId: -1,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });
          this.$axios
            .post("/iot/hot-water/getAllHotUseTotal", {
              current: this.currentPage,
              size: this.pagesize,
              startDate: localStorage.getItem("lastmonthstart"),
              endDate: localStorage.getItem("lastmonthend"),
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", false);
            });
        } else {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              startDate: localStorage.getItem("lastquarterstart"),
              endDate: localStorage.getItem("lastquarterend"),
              buildingId: -1,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });
          this.$axios
            .post("/iot/hot-water/getAllHotUseTotal", {
              current: this.currentPage,
              size: this.pagesize,
              startDate: localStorage.getItem("lastquarterstart"),
              endDate: localStorage.getItem("lastquarterend"),
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", false);
            });
        }
      } else if (this.time_twocheck == 2) {
        // 数据
        this.$axios
          .post("/iot/hot-water/getAllHotUseTotal", {
            current: this.currentPage,
            size: this.pagesize,
            startDate: this.zdystarttime,
            endDate: this.zdyendtime,
          })
          .then((res) => {
            this.statistics_data = res.data.rows;
            this.$set(this.statistics_data, "layer", false);
          });
        this.$axios
          .post("/iot/hot-water/getUseTotal", {
            startDate: this.zdystarttime,
            endDate: this.zdyendtime,
            buildingId: -1,
          })
          .then((res) => {
            this.statistics_total = res.data.rows;
          });
      } else {
        this.$axios.post("/iot/hot-water/getUseTotal", { buildingId: -1 }).then((res) => {
          this.statistics_total = res.data.rows;
        });
        // 数据
        this.$axios
          .post("/iot/hot-water/getAllHotUseTotal", {
            current: this.currentPage,
            size: this.pagesize,
          })
          .then((res) => {
            this.statistics_data = res.data.rows;
            this.$set(this.statistics_data, "layer", false);
          });
      }
    },
    // 消费 单击查询弹框
    consumptiondialogshow(index) {
      // 查询table数据 不带时间 只有一条
      this.$axios
        .get("/pay/consumeRecord/hotWater/Details?consumerId=" + index.id)
        .then((res) => {
          this.consumption_dialogdata = res.data.rows;
        });
      // 查询所有用水数据  不带时间
      this.$axios
        .post("/pay/consumeRecord/hotWater/caleTotalNum", {
          userId: index.userId,
        })
        .then((res) => {
          this.consumption_dialogwatertotal = res.data.totalWaterConsumption;
        });
      this.consumptiondialogshoworhide = true;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      if (this.rightheadertab == 0) {
        this.search(); //充值分页查询
      } else if (this.rightheadertab == 1) {
        this.search();
      } else if (this.rightheadertab == 2) {
        this.search();
      } else {
        this.statisticsPagesearch();
      }
    },
    // 分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.rightheadertab == 0) {
        this.search(); //充值分页查询
      } else if (this.rightheadertab == 1) {
        this.search();
      } else if (this.rightheadertab == 2) {
        this.search();
      } else {
        this.statisticsPagesearch();
      }
    },
    //   切换右侧tab
    righttoptab(index) {
      this.default_qj = true;
      this.rightheadertab = index;
      this.user_name = null;
      // 切换重置数据
      this.lddata();
      this.statisticslayer = null;
      this.statisticsdataid = null;
      this.outTradeNo = null;
      this.userCode = null;
      this.sjfw_value = null;
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.time_twocheck = 0;
      this.currentPage = 1;
      this.pagesize = 10;
      this.Reset();
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
        if (this.rightheadertab == 1 || this.rightheadertab == 3) {
          this.lefttree.push({
            id: "0",
            name: "未知区域",
            layer: "0",
            id: "0",
          });
        }
      });
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.userCode = null;
      this.currentPage = 1;
      this.czqd_value = null;
      this.jlzt_value = null;
      this.user_name = null;
      this.ysfs_value = null;
      this.refundjlzt_value = null;
      this.sjfw_value = null;
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.time_twocheck = 0;
      this.default_qj = !this.default_qj;
      this.statisticslayer = null;
      this.statisticsdataid = null;
      if (this.rightheadertab == 0) {
        // 重新查询充值数据 不带参数
        this.search();
      } else if (this.rightheadertab == 1) {
        this.search();
      } else if (this.rightheadertab == 3) {
        this.statisticslayer = null;
        this.statisticsdataid = null;
        this.statisticsBuildingandFloor.waterBuildingTotal = null;
        this.statisticsBuildingandFloor.waterFloorTotal = null;
        this.statistics_search();
        this.statisticsPagesearch();
      } else if (this.rightheadertab == 2) {
        this.search();
      }
    },
    //用量统计分页查询
    statisticsPagesearch() {
      // 是否楼栋
      if (this.statisticslayer == 1) {
        if (this.time_twocheck == 1) {
          if (this.sjfw_value == 0) {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", false);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });
            // 楼栋总和
            this.$axios
              .post("/iot/hot-water/getBuildingUseTotal", {
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterBuildingTotal =
                  res.data.rows.waterBuildingTotal;
                this.statisticsBuildingandFloor.waterFloorTotal =
                  res.data.rows.waterFloorTotal;
              });
          } else if (this.sjfw_value == 1) {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", false);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });
            // 楼栋总和
            this.$axios
              .post("/iot/hot-water/getBuildingUseTotal", {
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterBuildingTotal =
                  res.data.rows.waterBuildingTotal;
                this.statisticsBuildingandFloor.waterFloorTotal =
                  res.data.rows.waterFloorTotal;
              });
          } else {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", false);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("lastquarterstart"),
                endDate: localStorage.getItem("lastquarterend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });

            // 楼栋总和
            this.$axios
              .post("/iot/hot-water/getBuildingUseTotal", {
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
                startDate: localStorage.getItem("lastquarterstart"),
                endDate: localStorage.getItem("lastquarterend"),
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterBuildingTotal =
                  res.data.rows.waterBuildingTotal;
                this.statisticsBuildingandFloor.waterFloorTotal =
                  res.data.rows.waterFloorTotal;
              });
          }
        } else if (this.time_twocheck == 2) {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUse", {
              current: this.currentPage,
              size: this.pagesize,
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", false);
            });
          // 总和
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });
          // 楼栋总和
          this.$axios
            .post("/iot/hot-water/getBuildingUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterBuildingTotal =
                res.data.rows.waterBuildingTotal;
              this.statisticsBuildingandFloor.waterFloorTotal =
                res.data.rows.waterFloorTotal;
            });
        } else {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUse", {
              current: this.currentPage,
              size: this.pagesize,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", false);
            });
          // 总和
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });
          // 楼栋总和
          this.$axios
            .post("/iot/hot-water/getBuildingUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterBuildingTotal =
                res.data.rows.waterBuildingTotal;
              this.statisticsBuildingandFloor.waterFloorTotal =
                res.data.rows.waterFloorTotal;
            });
        }
      } else if (this.statisticslayer == 2) {
        if (this.time_twocheck == 1) {
          if (this.sjfw_value == 0) {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", false);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });
            // 楼层总和
            this.$axios
              .post("/iot/hot-water/getFloorUseTotal", {
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterFloorTotal =
                  res.data.rows.waterFloorTotal;
              });
            this.$axios
              .post("/iot/hot-water/getBuildingUseTotal", {
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterBuildingTotal =
                  res.data.rows.waterBuildingTotal;
              });
          } else if (this.sjfw_value == 1) {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", false);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });

            // 楼层总和
            this.$axios
              .post("/iot/hot-water/getFloorUseTotal", {
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterFloorTotal =
                  res.data.rows.waterFloorTotal;
              });
            this.$axios
              .post("/iot/hot-water/getBuildingUseTotal", {
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterBuildingTotal =
                  res.data.rows.waterBuildingTotal;
              });
          } else {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", false);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("lastquarterstart"),
                endDate: localStorage.getItem("lastquarterend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });

            // 楼层总和
            this.$axios
              .post("/iot/hot-water/getFloorUseTotal", {
                startDate: localStorage.getItem("lastquarterstart"),
                endDate: localStorage.getItem("lastquarterend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterFloorTotal =
                  res.data.rows.waterFloorTotal;
              });
            this.$axios
              .post("/iot/hot-water/getBuildingUseTotal", {
                startDate: localStorage.getItem("lastquarterstart"),
                endDate: localStorage.getItem("lastquarterend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterBuildingTotal =
                  res.data.rows.waterBuildingTotal;
              });
          }
        } else if (this.time_twocheck == 2) {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUse", {
              current: this.currentPage,
              size: this.pagesize,
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", false);
            });
          // 总和
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });

          // 楼层总和
          this.$axios
            .post("/iot/hot-water/getFloorUseTotal", {
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterFloorTotal =
                res.data.rows.waterFloorTotal;
            });
          this.$axios
            .post("/iot/hot-water/getBuildingUseTotal", {
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterBuildingTotal =
                res.data.rows.waterBuildingTotal;
            });
        } else {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUse", {
              current: this.currentPage,
              size: this.pagesize,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", false);
            });
          // 总和
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });

          // 楼层总和
          this.$axios
            .post("/iot/hot-water/getFloorUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterFloorTotal =
                res.data.rows.waterFloorTotal;
            });
          this.$axios
            .post("/iot/hot-water/getBuildingUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterBuildingTotal =
                res.data.rows.waterBuildingTotal;
            });
        }
      } else if (this.statisticslayer == 3) {
        if (this.time_twocheck == 1) {
          if (this.sjfw_value == 0) {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", true);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });
            // 楼层总和
            this.$axios
              .post("/iot/hot-water/getFloorUseTotal", {
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterFloorTotal =
                  res.data.rows.waterFloorTotal;
              });
            this.$axios
              .post("/iot/hot-water/getBuildingUseTotal", {
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterBuildingTotal =
                  res.data.rows.waterBuildingTotal;
              });
          } else if (this.sjfw_value == 1) {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", true);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });

            // 楼层总和
            this.$axios
              .post("/iot/hot-water/getFloorUseTotal", {
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterFloorTotal =
                  res.data.rows.waterFloorTotal;
              });
            this.$axios
              .post("/iot/hot-water/getBuildingUseTotal", {
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterBuildingTotal =
                  res.data.rows.waterBuildingTotal;
              });
          } else {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", true);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("lastquarterstart"),
                endDate: localStorage.getItem("lastquarterend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });

            // 楼层总和
            this.$axios
              .post("/iot/hot-water/getFloorUseTotal", {
                startDate: localStorage.getItem("lastquarterstart"),
                endDate: localStorage.getItem("lastquarterend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterFloorTotal =
                  res.data.rows.waterFloorTotal;
              });
            this.$axios
              .post("/iot/hot-water/getBuildingUseTotal", {
                startDate: localStorage.getItem("lastquarterstart"),
                endDate: localStorage.getItem("lastquarterend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statisticsBuildingandFloor.waterBuildingTotal =
                  res.data.rows.waterBuildingTotal;
              });
          }
        } else if (this.time_twocheck == 2) {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUse", {
              current: this.currentPage,
              size: this.pagesize,
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", true);
            });
          // 总和
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });

          // 楼层总和
          this.$axios
            .post("/iot/hot-water/getFloorUseTotal", {
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterFloorTotal =
                res.data.rows.waterFloorTotal;
            });
          this.$axios
            .post("/iot/hot-water/getBuildingUseTotal", {
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterBuildingTotal =
                res.data.rows.waterBuildingTotal;
            });
        } else {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUse", {
              current: this.currentPage,
              size: this.pagesize,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", true);
            });
          // 总和
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });

          // 楼层总和
          this.$axios
            .post("/iot/hot-water/getFloorUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterFloorTotal =
                res.data.rows.waterFloorTotal;
            });
          this.$axios
            .post("/iot/hot-water/getBuildingUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statisticsBuildingandFloor.waterBuildingTotal =
                res.data.rows.waterBuildingTotal;
            });
        }
      } else if (this.statisticslayer == 0) {
        if (this.time_twocheck == 1) {
          if (this.sjfw_value == 0) {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", true);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("thismonthstart"),
                endDate: localStorage.getItem("thismonth"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });
          } else if (this.sjfw_value == 1) {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", true);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });
          } else {
            // 数据
            this.$axios
              .post("/iot/hot-water/getUse", {
                current: this.currentPage,
                size: this.pagesize,
                startDate: localStorage.getItem("lastmonthstart"),
                endDate: localStorage.getItem("lastmonthend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_data = res.data.rows;
                this.$set(this.statistics_data, "layer", true);
              });
            // 总和
            this.$axios
              .post("/iot/hot-water/getUseTotal", {
                startDate: localStorage.getItem("lastquarterstart"),
                endDate: localStorage.getItem("lastquarterend"),
                layer: this.statisticslayer,
                buildingId: this.statisticsdataid,
              })
              .then((res) => {
                this.statistics_total = res.data.rows;
              });
          }
        } else if (this.time_twocheck == 2) {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUse", {
              current: this.currentPage,
              size: this.pagesize,
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", true);
            });
          // 总和
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              startDate: this.zdystarttime,
              endDate: this.zdyendtime,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });
        } else {
          // 数据
          this.$axios
            .post("/iot/hot-water/getUse", {
              current: this.currentPage,
              size: this.pagesize,
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_data = res.data.rows;
              this.$set(this.statistics_data, "layer", true);
            });
          // 总和
          this.$axios
            .post("/iot/hot-water/getUseTotal", {
              layer: this.statisticslayer,
              buildingId: this.statisticsdataid,
            })
            .then((res) => {
              this.statistics_total = res.data.rows;
            });
        }
      } else {
        this.statisticsBuildingandFloor.waterBuildingTotal = null;
        this.statisticsBuildingandFloor.waterFloorTotal = null;
        this.statistics_search();
      }
    },
    // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      this.currentPage = 1;
      let dataid = data.id.replace(/[^0-9]/gi, "");
      this.statisticslayer = data.layer;
      this.statisticsdataid = dataid;
      if (data.layer == 0) {
        this.layer0 = false;
      } else {
        this.layer0 = true;
      }
      // 充值点击树状图查询
      if (this.rightheadertab == 0) {
        this.search();
      } else if (this.rightheadertab == 1) {
        this.search();
      } else if (this.rightheadertab == 3) {
        this.statisticsPagesearch();
      } else if (this.rightheadertab == 2) {
        this.search();
      }
    },
    // 充值请求
    AxiosRecharge(startDate, endDate) {
      this.loading = true;
      if (this.czqd_value == "") {
        this.czqd_value = null;
      }
      if (this.jlzt_value == "") {
        this.jlzt_value = null;
      }
      this.AxiosParams = {
        current: this.currentPage,
        size: this.pagesize,
        userName: this.user_name,
        rechargeType: 9,
        rechargeChannel: this.czqd_value,
        rechargeStatus: this.jlzt_value,
        startDate,
        endDate,
        layer: this.statisticslayer,
        buildingId: this.statisticsdataid,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/pay/rechargeRecord/list";
      this.$axios
        .post("/pay/rechargeRecord/list", this.AxiosParams)
        .then((res) => {
          this.rechargedata = res.data.rows;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error.response.data.message);
          this.loading = false;
        });
      this.$axios
        .post("/pay/rechargeRecord/totalRecharge", {
          rechargeType: 9,
          rechargeChannel: this.czqd_value,
          rechargeStatus: this.jlzt_value,
          startDate,
          endDate,
          layer: this.statisticslayer,
          buildingId: this.statisticsdataid,
          userName: this.user_name,
        })
        .then((res) => {
          this.rechargetotal = res.data.rows;
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
      this.$axios
        .post("/pay/rechargeRecord/totalRecharge", {
          rechargeType: 9,
          rechargeChannel: this.czqd_value,
          rechargeStatus: 2,
          startDate,
          endDate,
          layer: this.statisticslayer,
          buildingId: this.statisticsdataid,
          userName: this.user_name,
        })
        .then((res) => {
          this.rechargemoney = res.data.rows;
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
    // 消费请求
    AxiosConsumption(startDate, endDate) {
      this.loading = true;
      if (this.minMoney !== null && this.minMoney !== "" && this.maxMoney !== null && this.maxMoney != "") {
        let minMoney = parseFloat(this.minMoney);
        let maxMoney = parseFloat(this.maxMoney);
        if (maxMoney < minMoney) {
          this.maxMoney = null;
          return this.$message.warning("最大金额不能小于最小金额,请重新输入!");
        } else {
          minMoney = minMoney * 100;
          maxMoney = maxMoney * 100;
        }
      }
      this.AxiosParams = {
        current: this.currentPage,
        minMoney: this.minMoney,
        maxMoney: this.maxMoney,
        size: this.pagesize,
        userCode: this.userCode,
        userName: this.user_name,
        startDate,
        endDate,
        layer: this.statisticslayer,
        buildingId: this.statisticsdataid,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/pay/consumeRecord/hotWater/list";
      this.$axios
        .post("/pay/consumeRecord/hotWater/list", this.AxiosParams)
        .then((res) => {
          this.consumption_data = res.data.rows;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error.response.data.message);
          this.loading = false;
        });
      this.$axios
        .post("/pay/consumeRecord/hotWater/caleTotalUse", {
          minMoney: this.minMoney,
          maxMoney: this.maxMoney,
          userName: this.user_name,
          userCode: this.userCode,
          startDate,
          endDate,
          layer: this.statisticslayer,
          buildingId: this.statisticsdataid,
        })
        .then((res) => {
          this.consumption_total = res.data;
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
    // 退款请求
    AxiosRefund(startDate, endDate) {
      this.loading = true;
      this.AxiosParams = {
        current: this.currentPage,
        size: this.pagesize,
        recordStatus: this.refundjlzt_value,
        outTradeNo: this.outTradeNo,
        userName: this.user_name,
        startDate,
        endDate,
        layer: this.statisticslayer,
        buildingId: this.statisticsdataid,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/pay/refund/getHotList";
      this.$axios
        .post("/pay/refund/getHotList", this.AxiosParams)
        .then((res) => {
          this.refund_data = res.data.rows;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error.response.data.message);
          this.loading = false;
        });
      this.$axios
        .post("/pay/refund/getHotTotal", {
          current: this.currentPage,
          size: this.pagesize,
          recordStatus: this.refundjlzt_value,
          outTradeNo: this.outTradeNo,
          userName: this.user_name,
          startDate,
          endDate,
          layer: this.statisticslayer,
          buildingId: this.statisticsdataid,
        })
        .then((res) => {
          this.refund_total = res.data.rows;
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
  },
  mounted() {
    // 首页点击本月总收入
    if (this.$route.query.rssrday) {
      this.rightheadertab = 0;
      this.sjfw_value = "0";
      this.time_twocheck = 1;
      this.recharge_search();
    }
    if (this.$route.query.rsyeday) {
    }
  },
  activated() {
    if (this.rightheadertab == 0) {
      this.search();
    } else if (this.rightheadertab == 2) {
      this.search();
    } else if (this.rightheadertab == 1) {
      this.search();
    } else {
      this.statisticsPagesearch();
    }
  },
  created() {
    // 热水存款点击详情查
    if (this.$route.query.rsuserid) {
      this.user_name = this.$route.query.rsuserid;
    }
    this.lddata(); //树状图数据
    this.search(); //查询充值数据表格
  },
};
</script>

<style lang="scss" scoped>
.Money {
  span {
    display: inline-block;
    padding: 0 5px;
    font-size: 14px;
  }
  ::v-deep .el-input {
    width: 47%;
    display: inline-block;
  }
}
.refund {
  border-radius: 8px;
  background: #ffffff;
  margin-top: 19px;
  padding: 5px 40px 20px 43px;
  ::v-deep .el-textarea {
    margin-top: 25px;
    width: 242px;
  }
  ::v-deep .el-dialog {
    width: 438px;
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;
    .el-dialog__header {
      height: 46px;
      background: #2d92ff;
      border-radius: 10px 10px 0px 0px;
      padding: 0;
      line-height: 46px;
      button {
        top: 0px;
        i {
          color: white;
          font-size: 18px;
        }
      }
      .el-dialog__title {
        font-size: 18px;
        font-family: $font-scre;
        color: #ffffff;
        letter-spacing: 1px;
      }
    }
    .el-dialog__body {
      padding-bottom: 20px;
      padding-top: 20px;
      text-align: center;
      .el-textarea {
        margin-top: 25px;
        width: 242px;
      }
      img {
        width: 30px;
        height: 30px;
      }
      span {
        margin-left: 15px;
        font-size: 16px;
        font-family: $font-scre;
        font-weight: 400;
        display: inline-block;
        vertical-align: middle;
        color: #4a4a4a;
        letter-spacing: 1px;
      }
    }
    .el-dialog__footer {
      padding-top: 0px;
      padding-bottom: 26px;
      button {
        width: 112px;
        border-radius: 3px;
        height: 36px;
        font-size: 16px;
        padding: 0;
        font-family: $font-scre;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .el-button--default {
        margin-left: 17px;
        background: #ff2020;
      }
    }
  }
  ::v-deep .el-table {
    margin-top: 14px;
    th {
      background: $tablebg;
      border-bottom: 0;
    }
    span {
      vertical-align: middle;
    }

    .i {
      display: inline-block;
      vertical-align: middle;
      width: 8px;
      height: 8px;
      margin-right: 5px;
      border-radius: 50px;
    }
    th,
    td {
      padding: 0;
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      color: #212d33;
      font-family: $font-scre;
    }
    td {
      font-weight: 400;
    }
    .fontblue {
      color: #2d92ff;
      cursor: pointer;
      &:hover {
        color: #59b3fd;
      }
    }
  }
}
.consumption {
  ::v-deep .el-table {
    margin-top: 15px;
    td {
      &:last-child {
        color: #2d92ff;
        &:hover {
          color: #59b3fd;
        }
      }
    }
    th {
      background: $tablebg;
    }
    th,
    td {
      .fontblue {
        color: #2d92ff;
        cursor: pointer;
        &:hover {
          color: #59b3fd;
        }
      }
      height: 50px;
      line-height: 50px;
      padding: 0;
      text-align: center;
      font-size: 14px;
      color: #364147;
    }
  }
  > table {
    tr {
      td:last-child {
        color: #2d92ff;
        &:hover {
          color: #59b3fd;
        }
      }
    }
    tr:first-child {
      td {
        color: #364147;
        &:hover {
          color: #364147;
        }
      }
    }
  }
}
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
    width: 858px !important;
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
      .top_text {
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
        margin-top: 25px;
        text-align: center;
        border-collapse: collapse;
        tr:first-child {
          height: 47px;
          background: #2c9dff;
          td {
            font-size: 14px;
            border-right: 1px solid white;
            font-family: PingFangSC, PingFangSC-Medium;
            color: #ffffff;
            line-height: 22px;
            letter-spacing: 2px;
            &:last-child {
              border-right: 0;
              color: #ffffff;
            }
          }
        }
        tr {
          height: 47px;
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
::v-deep .el-pagination {
  text-align: center;
  padding: 33px 0;
}
.statistics {
  border-radius: 8px;
  background: #ffffff;
  margin-top: 19px;
  padding: 33px 0;
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
      line-height: 55px;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      color: #212d33;
      & li:last-child {
        padding-right: 0;
      }
      span {
        font-size: 24px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        margin-left: 6px;
        color: #2d92ff;
      }
    }
  }
  .padding_table {
    margin: 14px 40px 0 40px;
    table {
      width: 100%;
      border-collapse: collapse;
      tr {
        height: 58px;
        line-height: 58px;
        td:first-of-type {
          padding-left: 15px;
        }
        td {
          font-size: 14px;
          font-family: $font-scre;
          font-weight: 400;
          color: #212d33;
          border-bottom: 1px solid #dbdbdb;
        }
      }
      tr:first-of-type {
        td {
          font-size: 14px;
          font-family: $font-scme;
          font-weight: 600;
          color: #364147;
          border-bottom: 0;
        }
        padding: 0 34px;
        background: $tablebg;
        border-radius: 1px;
      }
    }
  }
  ::v-deep .el-pagination {
    text-align: center;
    padding: 33px 0;
  }

  border-radius: 0px;
  margin-top: 19px;
}
.recharge,
.consumption {
  border-radius: 8px;
  background: #ffffff;
  margin-top: 19px;
  padding: 5px 40px 20px 43px;
  > table {
    width: 100%;
    margin-top: 14px;
    border-collapse: collapse;
    tr {
      height: 58px;
      line-height: 58px;
      td:first-of-type,
      th:first-of-type {
        padding-left: 15px;
      }
      td {
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        border-bottom: 1px solid #dbdbdb;
        span {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    tr:first-of-type {
      td,
      th {
        font-size: 14px;
        font-family: $font-scme;
        font-weight: 600;
        color: #364147;
        border-bottom: 0;
        text-align: left;
      }
      padding: 0 34px;
      background: $tablebg;
      border-radius: 1px;
    }
  }
}
.top_title {
  padding-top: 10px;
  p {
    &:first-child {
      margin: 0 68px 0 45px;
    }
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    font-family: $font-scme;
    font-weight: 500;
    color: #212d33;

    span {
      display: inline-block;
      margin-left: 5px;
      font-size: 24px;
      font-family: $font-scse;
      font-weight: 600;
      color: #000000;
    }
  }
  border-bottom: $border;
  padding-bottom: 8px;
  font-size: 24px;
  font-family: $font-scse;
  font-weight: 600;
  color: #000000;
  > div {
    display: inline-block;
    &:first-child {
      margin-right: 80px;
    }
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
.filter {
  margin-top: 8px;
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
.right_content {
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
.middle_content {
  padding: 0 19px;
}
</style>

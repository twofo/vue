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
    </div>
    <div class="table_content">
      <div class="report form" v-if="rightheadertab == 0">
        <div class="report_title form_title">上报设置</div>
        <!-- <el-divider></el-divider> -->
        <ul class="report_form">
          <li class="form_lable fl">
            <el-form
              :model="breaker_form"
              status-icon
              :rules="rules"
              ref="breaker_form"
              label-width="110px"
              class="demo-ruleForm"
              :labelPosition="labelPosition"
            >
              <el-form-item label="上报周期" prop="period">
                <el-input
                  class="report_set"
                  type="number"
                  v-model="breaker_form.period"
                ></el-input>
                秒/次
              </el-form-item>
            </el-form>
          </li>
          <li class="form_explanation">
            <span
              ><i>
                <img src="../../../assets/images/system/tips.svg" alt="" />
              </i>
              需要填写5-600秒之间，不填或不符合要求时默认为3秒</span
            >
          </li>
        </ul>
      </div>
      <div class="remote form">
        <div class="remote_title form_title">远程控制</div>
        <ul class="report_form">
          <li class="form_lable fl">
            <span class="lable_content">远程控制</span>
            <el-switch
              v-model="breaker_form.remote_switch"
              active-color="#1890FF"
              inactive-color="#C0CCDA"
              active-text="开"
              inactive-text="关"
              :active-value="0"
              :inactive-value="1"
              class="tableScopeSwitch"
            >
            </el-switch>
          </li>
          <li class="form_explanation">
            <span
              ><i>
                <img src="../../../assets/images/system/tips.svg" alt="" />
              </i>
              开启时可以远程进行控制开合闸，关闭时不允许远程控制</span
            >
          </li>
        </ul>
      </div>
      <div class="power form">
        <div class="power_title form_title">功率控制</div>
        <el-form
          :model="breaker_form"
          status-icon
          :rules="rules"
          ref="breaker_form"
          label-width="110px"
          class="demo-ruleForm report_form"
          :labelPosition="labelPosition"
        >
          <el-form-item label="上报周期" prop="period" class="form_lable">
            <el-input
              class="report_set"
              type="number"
              v-model="breaker_form.power"
            ></el-input>
            <span> W</span>
          </el-form-item>
          <el-form-item
            label="电流限额"
            prop="electric"
            class="form_lable form_item"
          >
            <el-input
              class="report_set"
              type="number"
              v-model="breaker_form.electric"
            ></el-input>
            <span> 单位：0.01A 最小值：150（1.5A）</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="warn form">
        <div class="warn_title form_title">告警设置</div>
        <ul class="report_form">
          <li class="form_lable fl">
            <span class="lable_content">告警上报</span>
            <el-switch
              v-model="breaker_form.warn_switch"
              active-color="#1890FF"
              inactive-color="#C0CCDA"
              active-text="开"
              inactive-text="关"
              :active-value="0"
              :inactive-value="1"
              class="tableScopeSwitch"
            >
            </el-switch>
          </li>
          <li class="form_explanation">
            <span
              ><i>
                <img src="../../../assets/images/system/tips.svg" alt="" />
              </i>
              开启时断路器若发生告警将进行上报，关闭时发生警告将不主动上报</span
            >
          </li>
          <li class="form_lable fl">
            <span class="lable_content">告警时自动开关</span>
            <el-switch
              v-model="breaker_form.autoAlarm_switch"
              active-color="#1890FF"
              inactive-color="#C0CCDA"
              active-text="开"
              inactive-text="关"
              :active-value="0"
              :inactive-value="1"
              class="tableScopeSwitch"
            >
            </el-switch>
          </li>
          <li class="form_explanation">
            <span
              ><i>
                <img src="../../../assets/images/system/tips.svg" alt="" />
              </i>
              开启时断路器若发生告警将进行上报，关闭时发生警告将不主动上报</span
            >
          </li>
          <li class="form_lable fl">
            <span class="lable_content">远程合闸</span>
            <el-switch
              v-model="breaker_form.remoteClose"
              active-color="#1890FF"
              inactive-color="#C0CCDA"
              active-text="开"
              inactive-text="关"
              :active-value="0"
              :inactive-value="1"
              class="tableScopeSwitch"
            >
            </el-switch>
          </li>
          <li class="form_explanation">
            <span
              ><i>
                <img src="../../../assets/images/system/tips.svg" alt="" />
              </i>
              开启时断路器若发生告警自动开闸后，可以进行远程合闸，关闭则不允许远程合闸</span
            >
          </li>
          <li class="form_lable fl">
            <span class="lable_content">阈值设置</span>
            <button class="setting_button" @click="alarmSetDialog = true">
              <img src="../../../assets/images/system/setting.svg" alt="" />
              告警阈值设置
            </button>
          </li>
          <li class="form_explanation">
            <span
              ><i>
                <img src="../../../assets/images/system/tips.svg" alt="" />
              </i>
              对各个告警的阈值进行设置</span
            >
          </li>
        </ul>
      </div>
      <div class="selfcheck form"   v-if="rightheadertab == 0">
        <div class="form_title">
          <!-- <span class="checked"
            ><i v-if="date_checked" class="checked_show"></i
          ></span> -->
          <el-radio v-model="selfcheck_radio " label = '0' @click.native.prevent="radioRadio(selfcheck_radio)">{{hidden}}</el-radio>
          <span>自检设置</span>
        </div>
        <div class="report_form">
          <span class="form_lable fl">
            <span class="lable_content">自检时间</span>
            <el-select
              v-model="daysModel"
              placeholder=""
              style="width: 70px"
              :disabled="selfcheck_radio == '1'? true : false"
            >
              <el-option
              @change="init()"
                v-for="item in days"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span> 日 </span>
            <el-select
              v-model="hoursModel"
              placeholder=""
              style="width: 70px"
              :disabled="selfcheck_radio == '1'? true : false"

            >
              <el-option
              @change="init()"

                v-for="item in hours"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span> 时 </span>

            <el-select
              v-model="minutesModel"
              placeholder=""
              style="width: 70px"
              :disabled="selfcheck_radio == '1'? true : false"

            >
              <el-option
              @change="init()"

                v-for="item in minutes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span> 分</span>
          </span>
          <span class="form_explanation"
            ><i>
              <img src="../../../assets/images/system/tips.svg" alt="" />
            </i>
            设置自检时间，每月达到该时间自动进行自检</span
          >
        </div>
      </div>
      <div class="submit">
        <el-button type="primary">提交</el-button>
      </div>
    </div>
    <!-- 告警阈值弹窗 -->
    <el-dialog
      title="告警阈值设置"
      :visible.sync="alarmSetDialog"
      customClass="customWidth"
      width="35%"
    >
      <!-- <el-divider></el-divider> -->
      <table class="Listannal">
        <tr>
          <td>名称</td>
          <td>值</td>
          <td>备注</td>
        </tr>
        <tr v-for="(item, index) in gridData" :key="index">
          <td>{{ item.name }}</td>
          <!-- <td>{{ item.value }}</td> -->
          <td @blur.prevent="inputorspan = 0">
            <span v-if="inputorspan == 0">{{ item.value }}</span>
            <el-input
              v-else
              v-model="item.value"
              placeholder="请输入"
              class="alarm_table"
            ></el-input>
          </td>
          <td>{{ item.notes }}</td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="inputorspan == 0" @click="inputorspan = 1">编 辑</el-button>
        <el-button v-if="inputorspan == 1" @click="inputorspan = 0">取 消</el-button>
        <el-button  v-if="inputorspan == 0" type="primary" @click="alarmSetDialog = false; inputorspan = 1"
          >确 定</el-button
        >
        <el-button v-if="inputorspan == 1" type="primary" @click="alarmSetDialog = false; inputorspan = 0 "
          >保 存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hidden:'',
      selfcheck_radio:'1', //自检设置单选框
      date_checked: false,
      switchdialog: false,
      inputorspan: 0, //table 显示输入框orspan 0span 1input
      daysModel: null,
      hoursModel: null,
      minutesModel: null,
      days: [],
      hours: [],
      minutes: [],

      alarmSetDialog: false, // 告警阈值设置弹窗
      gridData: [
        {
          name: "过电流告警阈值",
          value: 94.5,
          notes: "单位:0.01A",
        },
        {
          name: "过电流告警阈值",
          value: 91.5,
          notes: "单位:0.01A",
        },
        {
          name: "过漏电流告警阈值",
          value: 94.55,
          notes: "单位:0.01A",
        },
        {
          name: "过漏电流告警阈值",
          value: 24.51,
          notes: "单位:0.01A",
        },
        {
          name: "过电流告警阈值",
          value: 91.5,
          notes: "单位:0.01A",
        },
        {
          name: "过漏电流告警阈值",
          value: 94.55,
          notes: "单位:0.01A",
        },
        {
          name: "过漏电流告警阈值",
          value: 24.51,
          notes: "单位:0.01A",
        },
        {
          name: "过电流告警阈值",
          value: 44.15,
          notes: "单位:0.01A",
        },
        {
          name: "过电流告警阈值",
          value: 44.5,
          notes: "单位:0.01A",
        },
        {
          name: "过电流告警阈值",
          value: 94.15,
          notes: "单位:1w",
        },
        {
          name: "打火告警灵敏度阈值",
          value: 94.35,
          notes: "0-100,数值越高灵敏度越强",
        },
      ],
      // 树状图
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      // tab栏切换
      rightheadertab: 0, //tab数 showorhide
      rightheader: ["总闸参数", "照明参数", "空调参数", "插座参数"], //右侧头部tab切换数据

      // 表单数据
      labelPosition: "left",
      breaker_form: {
        period: 100,
        remote_switch: false,
        power: 200,
        electric: 300,
        warn_switch: false,
        autoAlarm_switch: true,
        remoteClose: false,
      },
      // 校验规则
      rules: {
        fAdderss: [
          {
            required: true, //是否必填
            message: "地址不能为空", //规则
            trigger: "blur", //何事件触发
          },
          //可以设置双重验证标准
          { min: 3, max: 5, message: "长度在 3 到 5 个字符" },
        ],
      },
    };
  },
  created() {
    this.lddata(); //树状图数据
    this.init();
  },
  methods: {
    radioRadio(e){
      if(e == '0'){
        this.selfcheck_radio = '1'
      } else {
        this.selfcheck_radio = '0'
      }
    },
    init() {
      // var myDate = new Date();
      // var day = myDate.getDate(); //获取当前日
      // var hour = myDate.getHours();
      // var minute = myDate.getMinutes();
      this.initSelectDay();
      this.initSelectHour();
      this.initSelectMinutes();
      if (this.daysModel != null & this.minutesModel != null & this.hoursModel != null) {
        this.date_checked = true;
      }
      // this.daysModel = null;
      // this.hoursModel = this.add0(hour);
      // this.minutesModel = this.add0(minute);
    },
    initSelectDay() {
      this.days = [];
      for (var i = 1; i <= 31; i++) {
        this.days.push({ value: i, label: this.add0(i) });
      }
    },
    initSelectHour() {
      this.hours = [];
      for (var i = 1; i <= 24; i++) {
        this.hours.push({ value: i, label: this.add0(i) });
      }
    },
    initSelectMinutes() {
      this.minutes = [];
      for (var i = 1; i <= 60; i++) {
        this.minutes.push({ value: i, label: this.add0(i) });
      }
    },
    //修改月、天的格式，保持两位数显示
    add0(m) {
      return m < 10 ? "0" + m : m;
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
    //   处理树状图数据
    lddata() {
      this.$axios.get("/bus/common/building/select").then((res) => {
        let data = res.data;
        this.selecttree = res.data;
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
    // 切换tab
    righttoptab(index) {
      this.rightheadertab = index;
      console.log(index);
    },
  },
};
</script>

<style lang='scss' scoped>
.middle_content {
  padding: 10px 19px 20px 19px;
}
.right_content {
  width: 1350px;
}
.top_header {
  background: white;
  z-index: 999;
  height: 45px;
  border-radius: 8px;
  li {
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
    &:hover {
      font-family: $font-scme;
      font-weight: 500;
      color: #2c9dff;
    }
  }
}
::v-deep .el-switch__core {
  width: 42px;
}
.table_content {
  width: 1350px;
  overflow: auto;
  float: right;
  background-color: #ffffff;
  margin-top: 10px;
  border-radius: 10px;
  padding: 20px 30px;
  font-size: 14px;
  // .input {
  //   width: 160px;
  //   height: 32px;
  // }
  .form {
    // margin-bottom: 10px;
    height: 100px;
    width: 100%;
    // background-color: pink;
    .form_title {
      padding-left: 5px;
      border-left: 4px solid #2d92ff;
      font-weight: 700;
    }
    .report_set {
      width: 162px;
      height: 30px;
    }
    .form_lable {
      // float: left;
      padding-left: 9px;
      width: 550px;
      height: 50px;
      padding-top: 5px;
    }
    .report_form {
      height: 70px;
      margin-top: 10px;
      align-items: center;
      width: 100%;

      .lable_content {
        width: 110px;
        display: inline-block;
        height: 50px;
        line-height: 50px;
      }
    }
    .form_explanation {
      width: 650px;
      height: 50px;
      line-height: 50px;
      float: left;
      color: rgba(0,0,0,0.40);
      font-family: PingFangSC, PingFangSC-Regular;
      i {
        img {
          margin-top: -3px;
        }
        //   display: inline-block;
        //   width: 13px;
        //   height: 13px;
        //   background: url("../../../assets/images/system/tips.svg");
      }
    }
    .form_item {
      margin-top: -15px;
    }
  }
  .power {
    height: 154px;
  }
  .warn {
    height: 246px;
    .setting_button {
      border: 1px dashed #bfbfbf;
      background-color: #fff;
      width: 160px;
      height: 32px;
      img {
        margin-top: -3px;
      }
    }
  }
  .selfcheck {
    .form_title {
      border: none;
      // padding-left:-7px;
      margin-left: -11px;
      ::v-deep .el-radio__inner{
        width: 10px;
        height: 10px;
      }
      span {
        // padding-left: -20px;
        margin-left: -35px;
      }
      // .checked {
      //   margin-top: 2px;
      //   display: inline-block;
      //   width: 14px;
      //   height: 14px;
      //   opacity: 1;
      //   background: #ffffff;
      //   border: 1px solid rgba(0, 0, 0, 0.15);
      //   border-radius: 2px;
      //   position: relative;
      //   .checked_show {
      //     position: absolute;
      //     left: 3px;
      //     top: 3px;
      //     display: inline-block;
      //     width: 6px;
      //     height: 6px;
      //     background: #1890ff;
      //   }
      // }
    }
    span {
      padding-right: 6px;
    }
  }
}
.submit {
  padding-top: 20px;
  padding-left: 650px;
}

.customWidth {
  width: 650px;
}
::v-deep .el-dialog__header {
  height: 55px;
  padding-bottom: 40px;
  border-bottom: 1px solid #dcdfe6;
  span {
    font-weight: 700;
    font-size: 16px;
  }
}
::v-deep .el-dialog__body {
  padding-top: 20px;
}
.Listannal {
  width: 100%;
  // margin-top: 13px;
  border-collapse: collapse;
  border: 1px solid #ebeef5;

  tr {
    height: 35px;
    // text-align: center;
    // &:nth-child(2n) {
    //   background: #f1f9ff;
    // }
    &:first-child {
      background: #f1f9ff;
      font-size: 16px;
      font-family: $font-scme;
      font-weight: 500;
      color: #000;
      letter-spacing: 2px;
      td {
        height: 35px;
        font-weight: 700;
      }
    }
    td {
      height: 35px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      color: #41545b;
      padding-left: 30px;
      border-bottom: 1px solid #ebeef5;
    }
  }
}
.alarm_table {
  width: 100px;
  ::v-deep .el-input__inner {
    height: 25px;
  }
}

.tableScopeSwitch {
  ::v-deep.el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
    // font-size: 10px;
    span {
      font-size: 10px;
    }
  }
  /*打开时文字位置设置*/
  ::v-deep.el-switch__label--right {
    z-index: 1;
    right: 20px; /*不同场景下可能不同，自行调整*/
    top: 2px;
  }
  /*关闭时文字位置设置*/
  ::v-deep.el-switch__label--left {
    z-index: 1;
    left: 20px; /*不同场景下可能不同，自行调整*/
    top: 2px;
  }
  /*显示文字*/
  ::v-deep.el-switch__label.is-active {
    display: block;
  }
  ::v-deep.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 75px !important; /*开关按钮的宽度大小*/
  }
}
//  ::v-deep.el-switch .el-switch__core,
//   .el-switch .el-switch__label {
//     width: 75px !important; /*开关按钮的宽度大小*/
//   }
::v-deep .el-switch__core{
  width: 42px !important;
}
</style>
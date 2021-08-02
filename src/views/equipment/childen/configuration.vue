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
        <div class="RunorToll">
          <span
            :class="RunorTollTextCheck == index ? 'active' : ''"
            @click="RunorTollclick(index)"
            v-for="(item, index) in RunortollText"
            :key="index"
            >{{ item }}</span
          >
        </div>
        <div class="tabledata">
          <div class="button">
            <button @click="addDialog = true">新增</button>
            <button
              v-preventReClick="2000"
              @click="JudgeRunOrToll(layer, areaid)"
            >
              刷新
            </button>
          </div>
          <table v-loading="loading">
            <tr>
              <td>参数名称</td>
              <td>参数值</td>
              <td>备注</td>
              <td v-if="RunorTollTextCheck == 1">操作</td>
            </tr>

            <template v-if="RunorTollTextCheck == 0"
              ><tr v-for="(item, index) in TableData.paramValue" :key="index">
                <!-- <td>{{ item }}</td> -->
                <td>{{ item.paramName }}</td>
                <!-- <td></td> -->
                <td @blur.prevent="inputorspan = 0">
                  <el-switch
                    @click.native="switchdialog = true"
                    v-if="item.paramType == 1"
                    disabled
                    v-model="item.paramValue"
                    active-value="1"
                    inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  >
                  </el-switch>
                  <template v-else>
                    <el-input
                      v-if="inputorspan == 1"
                      v-model="item.paramValue"
                      @blur.prevent="inputorspan = 0"
                      placeholder="请输入"
                    ></el-input>
                    <span v-else @click="inputorspan = 1">{{
                      item.paramValue
                    }}</span>
                  </template>
                </td>
                <td @blur.prevent="inputorspan = 0">
                  <el-input
                    v-model="item.note"
                    placeholder="请输入"
                    @blur.prevent="inputorspan = 0"
                    v-if="inputorspan == 1"
                  ></el-input>
                  <span v-else @click="inputorspan = 1">{{ item.note }}</span>
                </td>
              </tr></template
            >
            <template v-if="RunorTollTextCheck == 1">
              <tr v-for="(item, index) in TableData" :key="index">
                <td>{{ item.text }}</td>
                <td @blur.prevent="inputorspan = 0">
                  <span
                    @click="inputorspan = 1"
                    @blur.prevent="inputorspan = 0"
                    v-if="inputorspan == 0"
                    >{{ item.value }}</span
                  >
                  <el-input
                    @blur.prevent="inputorspan = 0"
                    v-else
                    v-model="item.value"
                    placeholder="请输入"
                  ></el-input>
                </td>
                <td @blur.prevent="inputorspan = 0">
                  <span
                    @click="inputorspan = 1"
                    @blur.prevent="inputorspan = 0"
                    v-if="inputorspan == 0"
                    >{{ item.remark }}</span
                  >
                  <el-input
                    @blur.prevent="inputorspan = 0"
                    v-else
                    v-model="item.remark"
                    placeholder="请输入"
                  ></el-input>
                </td>
                <td
                  class="blue"
                  @click="
                    delrunnum = index;
                    delrundialog = true;
                  "
                >
                  删除
                </td>
              </tr>
            </template>
          </table>
          <el-dialog
            title="系统提示"
            class="delrundialog"
            :visible.sync="delrundialog"
            center
          >
            <h3>确认要删除吗?</h3>
            <span slot="footer" class="dialog-footer">
              <el-button @click="delrundialog = false" v-preventReClick="2000"
                >取 消</el-button
              >
              <el-button
                type="primary"
                @click="delrundata"
                v-preventReClick="500"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <div class="savebutton" v-if="TableData != []">
            <button
              v-if="updateOrSave == 0"
              @click="
                UpdateDialog = true;
                updateorsavenumber = 0;
              "
              v-preventReClick="2000"
            >
              保存
            </button>
            <button
              v-else
              @click="
                UpdateDialog = true;
                updateorsavenumber = 1;
              "
              v-preventReClick="2000"
            >
              更新
            </button>
            <button v-preventReClick="2000" @click="inputorspan = 0">
              取消
            </button>
          </div>
        </div>
        <el-dialog
          class="switchdialog"
          title="系统提示"
          :visible.sync="switchdialog"
          center
        >
          <p>模式切换可能导致出现一部分用水计费异常，是否仍要切换?</p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="switchdialog = true">取 消</el-button>
            <el-button type="primary" @click="switchchange">切换</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="系统提示"
          @close="closedialog"
          :visible.sync="UpdateDialog"
          center
        >
          <div class="DialogContent">
            <div class="center" v-if="RunorTollTextCheck == 1">
              是否配置参数?
            </div>
            <div class="password" v-if="RunorTollTextCheck == 0">
              <p>密码验证</p>
              <p class="gray clearfix">
                请输入管理员密码<button class="password" @click="checkpassword">
                  校验密码
                </button>
              </p>
              <el-input
                v-model="password"
                show-password
                placeholder="输入密码"
              ></el-input>
            </div>
            <ul v-if="checkHaveConfig.room">
              <li>下级已配置参数:</li>
              <li v-for="(item, index) in checkHaveConfig.room" :key="index">
                {{ item }}
              </li>
            </ul>
            <div class="radiocheck" v-if="checkHaveConfig.room">
              <label>是否覆盖下级参数</label>
              <el-radio :disabled="isnotData" v-model="dialogradio" label="0"
                >否</el-radio
              >
              <el-radio :disabled="isnotData" v-model="dialogradio" label="1"
                >是</el-radio
              >
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="UpdateDialog = false">取 消</el-button>
            <el-button
              type="primary"
              v-if="RunorTollTextCheck == 0"
              :disabled="checkpasswordnumber == 0"
              @click="DailogSave"
              >保存并下发</el-button
            >
            <el-button type="primary" v-else @click="DailogSave"
              >保存下发</el-button
            >
          </span>
        </el-dialog>
        <el-dialog
          @close="adddialogclose"
          title="新增"
          class="addDialog"
          :visible.sync="addDialog"
          center
        >
          <div class="red">
            <label>注意:</label>如新增类型已有将是修改,确认后还需点击保存(切记)
          </div>
          <div>
            <label class="label">参数类型<span>*</span>:</label
            ><el-select
              @change="checkselect"
              v-model="parametertypevalue"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in parametertypeselect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <label class="label">值<span>*</span>:</label>
            <template v-if="checkselectnumber == 0">
              <el-radio v-model="yesorno" label="1">开</el-radio>
              <el-radio v-model="yesorno" label="0">关</el-radio>
            </template>
            <el-input
              v-else
              placeholder="请输入值"
              v-model="addnumber"
              clearable
            >
            </el-input>
          </div>
          <div>
            <label class="label">备注:</label>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="addnote"
            >
            </el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialog = false">取 消</el-button>
            <el-button type="primary" @click="addDialogtrue">确 定</el-button>
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
      switch_elect: "0", // 0开 1关
      switchdialog: false,
      loading: false,
      delrundialog: false,
      delrunnum: null,
      dialogradio: "0",
      checkselectnumber: null,
      yesorno: "1", //1是 0否
      checkpasswordnumber: 0, //校验密码 0-失败 1-成功
      isnotData: true, //下级是否有参数
      checkHaveConfig: "0", //是否覆盖
      updateorsavenumber: null, //点击是更新-1  保存0
      inputorspan: 0, //table 显示输入框orspan 0span 1input
      addnumber: null, //新增弹框值
      addnote: null, //新增弹框备注
      RunorTollTextCheck: 0, //收费0 运行1
      RunortollText: ["配置设备收费标准", "配置设备运行参数"],
      paramValue: [], //弹框修改值
      textarea: null, //弹框文本域
      password: null, //弹框所需密码
      UpdateDialog: false,
      rightheader: ["冷水", "用电", "热水"], //右侧头部tab切换数据  "冷水", "用电",
      rightheadertab: 0, //tab数 showorhide
      default_qj: true, //是否默认全局
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
      },
      TableData: [], //表格数据
      RunTableAxiosData: [], //运行参数配置所传的值
      UpdateDialogdata: {}, //弹窗所需参数数据
      addDialog: false, //新增弹框
      parametertypevalue: null, //新增弹框selectvalue
      parametertypeselect: [
        {
          label: "收费开关",
          value: "0",
          paramType: 1,
          paramKey: "chargeSwitch",
        },
        { label: "水费单价", value: "1", paramType: 2, paramKey: "waterFee" },
        // {
        //   label: "欠费额度",
        //   value: "2",
        //   paramType: 3,
        //   paramKey: "allowArrearsThreshold",
        // },
      ], //新增弹框select
      layer: 0,
      areaid: -1,
      updateOrSave: null, //判断是否有数据 0-没有 1-有
    };
  },
  mounted() {},
  methods: {
    switchchange() {
      console.log("开关");
      console.log(this.TableData);
      console.log(this.TableData.paramValue);
      this.TableData.paramValue.forEach((item) => {
        if (item.paramType == 1) {
          item.paramValue =
            item.paramValue == 1 ? "0" : item.paramValue == 0 ? "1" : item.paramValue;
          this.switchdialog = false;
          console.log(item.paramValue);
        }
      });
    },
    // 运行参数删除某列
    delrundata() {
      this.TableData.splice(this.delrunnum, 1);
      this.delrundialog = false;
      this.delrunnum = null;
    },
    // 关闭弹窗
    closedialog() {
      this.checkpasswordnumber = 0;
      this.password = null;
    },
    checkselect(val) {
      if (this.parametertypeselect[val].paramType == 1) {
        this.checkselectnumber = 0;
      } else {
        this.checkselectnumber = 1;
      }
    },
    // 校验密码
    checkpassword() {
      if (this.password == "" || this.password == null) {
        this.$message({
          message: "密码不能为空",
          type: "warning",
        });
      } else {
        this.$axios
          .post("/pay/chargeConfig/auth", {
            passWord: this.password,
          })
          .then((res) => {
            if (res.data.rows == 0) {
              this.$message({
                message: "密码错误请重新输入",
                type: "warning",
              });
              this.password = null;
              this.checkpasswordnumber = 0;
            } else {
              this.$message({
                message: "校验成功",
                type: "success",
              });
              this.checkpasswordnumber = 1;
            }
          });
      }
    },
    // add弹框单击确认
    addDialogtrue() {
      let Rundata = {
        name: this.parametertypeselect[this.parametertypevalue].name,
        remark: this.addnote,
        text: this.parametertypeselect[this.parametertypevalue].label,
        value: this.addnumber,
      };
      console.log(Rundata);
      let Moneydata = {
        note: this.addnote,
        paramValue: this.checkselectnumber == 0 ? this.yesorno : this.addnumber,
        paramType: this.parametertypeselect[this.parametertypevalue].paramType,
        paramName: this.parametertypeselect[this.parametertypevalue].label,
        paramKey: this.parametertypeselect[this.parametertypevalue].paramKey,
      };
      console.log(Moneydata.paramValue);
      if (this.RunorTollTextCheck == 1) {
        console.log(this.TableData.paramValue);
        if (this.TableData) {
          let trueorfalse = false;
          for (let i of this.TableData) {
            if (
              i.name == this.parametertypeselect[this.parametertypevalue].name
            ) {
              i.remark = this.addnote;
              i.value = this.addnumber;
              this.addDialog = false;
              trueorfalse = true;
              return;
            }
            trueorfalse = false;
          }
          if (trueorfalse == false) {
            this.TableData.push(Rundata);
            this.addDialog = false;
            return;
          }
        } else {
          this.TableData = [];
          this.TableData.push(Rundata);
          this.addDialog = false;
        }
      } else {
        if (this.TableData != null) {
          let trueorfalse = null;
          for (let i of this.TableData.paramValue) {
            if (
              i.paramName ==
              this.parametertypeselect[this.parametertypevalue].label
            ) {
              i.note = this.addnote;
              i.paramValue =
                this.checkselectnumber == 0 ? this.yesorno : this.addnumber;
              trueorfalse = true;
              this.addDialog = false;
              return;
            }
            trueorfalse = false;
          }
          if (trueorfalse == false) {
            this.TableData.paramValue.push(Moneydata);
            console.log(this.TableData.paramValue);
            this.addDialog = false;
            return;
          }
        } else {
          this.TableData = {};
          this.$set(this.TableData, "paramValue", []);
          this.TableData.paramValue.push(Moneydata);
          console.log(this.TableData.paramValue);

          this.addDialog = false;
        }
      }
    },
    adddialogclose() {
      this.checkselectnumber = null;
      this.addnote = null;
      this.addnumber = null;
      this.parametertypevalue = null;
    },
    // 弹框保存并下发
    DailogSave() {
      console.log(this.paramValue);
      if (this.RunorTollTextCheck == 0) {
        if (this.updateorsavenumber == 1 && this.TableData.id !== -1) {
          // 有数据 更新
          this.$axios
            .post("/pay/chargeConfig/save", {
              passWord: this.password,
              paramValue: JSON.stringify(this.TableData.paramValue),
              id: this.TableData.id,
              layer: this.layer,
              areaId: this.areaid,
              configType: this.rightheadertab + 1,
              cover: this.dialogradio,
            })
            .then((res) => {
              console.log(res.data);
              if (res.data.code == 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
                this.JudgeRunOrToll(this.layer, this.areaid);
              } else {
                this.$message({
                  message: "操作失败，请重试",
                  type: "warning",
                });
                this.JudgeRunOrToll(this.layer, this.areaid);
              }
            });
        } else {
          // 没数据 保存
          this.$axios
            .post("/pay/chargeConfig/save", {
              passWord: this.password,
              paramValue: JSON.stringify(this.TableData.paramValue),
              areaId: this.areaid,
              layer: this.layer,
              configType: this.rightheadertab + 1,
              cover: this.dialogradio,
            })
            .then((res) => {
              console.log(res);
              if (res.data.code == 200) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
                this.JudgeRunOrToll(this.layer, this.areaid);
              } else {
                this.$message({
                  message: "新增失败",
                  type: "warning",
                });
                this.JudgeRunOrToll(this.layer, this.areaid);
              }
            });
        }
        this.password = null;
        this.UpdateDialog = false;
      } else {
        let arr = this.TableData;
        let configname =
          this.rightheadertab == 0 ? "2" : this.rightheadertab == 1 ? "4" : "8";
        if (arr !== undefined && arr.length > 0) {
          arr.forEach((item) => {
            if (item.name == "ReportIntervalTime") {
              item.value = (item.value * 60).toString();
            }
          });
        }
        if (this.updateOrSave == 1) {
          this.$axios
            .post("/iot/deviceConfig/updateAreaConfig", {
              configName: configname,
              areaId: this.areaid,
              layer: this.layer,
              configValue: JSON.stringify(arr),
              deleteFlag: this.dialogradio,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.UpdateDialog = false;
                this.JudgeRunOrToll(this.layer, this.areaid);
              } else {
                this.$message({
                  message: "修改失败",
                  type: "warning",
                });
                this.UpdateDialog = false;
                this.JudgeRunOrToll(this.layer, this.areaid);
              }
            });
        } else {
          if (arr !== undefined && arr.length > 0) {
            this.$axios
              .post("/iot/deviceConfig/saveAreaConfig", {
                configName: configname,
                areaId: this.areaid,
                layer: this.layer,
                configValue: JSON.stringify(arr),
                deleteFlag: this.dialogradio,
              })
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message({
                    message: "新增成功",
                    type: "success",
                  });
                  this.UpdateDialog = false;
                  this.JudgeRunOrToll(this.layer, this.areaid);
                } else {
                  this.$message({
                    message: "新增失败",
                    type: "warning",
                  });
                  this.UpdateDialog = false;
                  this.JudgeRunOrToll(this.layer, this.areaid);
                }
              });
          } else {
            this.$message.warning("请先新增配置!");
            this.UpdateDialog = false;
          }
        }
      }
    },
    // 单击运行or收费
    RunorTollclick(index) {
      this.RunorTollTextCheck = index;
      // 切换重置数据
      this.checkHaveConfig = "0";
      this.lddata();
      this.isnotData = true;
      this.updateorsavenumber = null;
      this.TableData = null;
      this.tabcheckdata();
      if (index == 0) {
        this.layer = 0;
        this.areaid = -1;
      }
      this.JudgeRunOrToll(this.layer, this.areaid);
    },
    // 判断运行or收费 请求数据
    JudgeRunOrToll(layer, dataid) {
      if (this.RunorTollTextCheck == 0) {
        // 收费请求
        this.chargeConfig(layer, dataid);
        this.AxiosTollData(layer, dataid);
        this.$axios
          .post("/pay/check/lowLevelConfig", {
            layer: this.layer,
            areaId: this.areaid,
            configType: this.rightheadertab + 1,
          })
          .then((res) => {
            this.isnotData = res.data.rows.haveConfig == 1 ? false : true;
            this.checkHaveConfig = res.data.rows;
          });
      } else {
        // 运行请求
        this.checkSettingExist(layer, dataid);
        this.AxiosRunData();
        let configname =
          this.rightheadertab == 0 ? "2" : this.rightheadertab == 1 ? "4" : "8";
        this.$axios
          .post("/iot/deviceConfig/checkHaveConfig", {
            layer: this.layer,
            areaId: this.areaid,
            configName: configname,
          })
          .then((res) => {
            this.isnotData = res.data.rows.haveConfig == 1 ? false : true;
            this.checkHaveConfig = res.data.rows;
          });
      }
    },
    // 单击修改显示弹框
    UpdateFunction(index) {
      this.UpdateDialogdata = this.TableData[index];
      this.UpdateDialog = true;
    },
    // 请求运行数据
    AxiosRunData() {
      this.loading = true;
      let configname =
        this.rightheadertab == 0 ? "2" : this.rightheadertab == 1 ? "4" : "8";
      this.$axios
        .post("/iot/deviceConfig/getSettingsInfo", {
          areaId: this.areaid,
          layer: this.layer,
          configName: configname,
        })
        .then((res) => {
          this.TableData = [];
          this.TableData = res.data.rows;
          this.RunTableAxiosData = this.TableData;
          this.loading = false;
        });
    },
    // 请求收费数据
    AxiosTollData(layer, areaid) {
      this.loading = true;
      this.$axios
        .post("/pay/chargeConfig/select", {
          configType: this.rightheadertab + 1,
          layer: layer,
          areaId: areaid,
        })
        .then((res) => {
          console.log(res.data);
          this.TableData = null;
          if (res.data.rows) {
            this.TableData = res.data.rows;
            this.TableData.paramValue = JSON.parse(this.TableData.paramValue);
            console.log(this.TableData.paramValue);
          }
          this.loading = false;
        });
    },
    // 当前楼栋是否有数据
    // 运行参数
    checkSettingExist(layer, areaid) {
      let configname =
        this.rightheadertab == 0 ? "2" : this.rightheadertab == 1 ? "4" : "8";
      this.$axios
        .post("/iot/deviceConfig/checkSettingExist", {
          layer: layer,
          areaId: areaid,
          configName: configname,
        })
        .then((res) => {
          this.updateOrSave = res.data.rows.updateOrSave;
        });
    },
    // 收费标准
    chargeConfig(layer, areaid) {
      this.$axios
        .post("/pay/chargeConfig/check", {
          layer: layer,
          areaId: areaid,
          configType: this.rightheadertab + 1,
        })
        .then((res) => {
          this.updateOrSave = res.data.rows.updateOrSave;
        });
    },
    //   切换右侧tab
    righttoptab(index) {
      this.rightheadertab = index;
      // 切换重置数据
      this.lddata();
      this.checkHaveConfig = "0";
      this.isnotData = true;
      this.updateOrSave = null;
      this.TableData = null;
      this.default_qj = true;
      this.layer = 0;
      this.areaid = -1;
      this.parametertypevalue = null;
      this.inputorspan = 0;
      this.tabcheckdata();
      this.JudgeRunOrToll(this.layer, this.areaid);
    },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.default_qj = !this.default_qj;
      this.layer = 0;
      this.areaid = -1;
      this.JudgeRunOrToll(0, -1);
    },
    // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      let dataid = data.id.replace(/[^0-9]/gi, "");
      this.layer = data.layer;
      this.areaid = dataid;
      this.JudgeRunOrToll(data.layer, dataid);
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
    }, // 切换tab修改新增弹框select数据
    tabcheckdata() {
      if (this.RunorTollTextCheck == 0) {
        if (this.rightheadertab == 0) {
          this.parametertypeselect = [
            {
              label: "收费开关",
              value: "0",
              paramType: 1,
              paramKey: "chargeSwitch",
            },
            {
              label: "水费单价",
              value: "1",
              paramType: 2,
              paramKey: "waterFee",
            },
            // {
            //   label: "欠费额度",
            //   value: "2",
            //   paramType: 3,
            //   paramKey: "allowArrearsThreshold",
            // },
          ];
        } else if (this.rightheadertab == 1) {
          this.parametertypeselect = [
            {
              label: "收费开关",
              value: "0",
              paramType: 1,
              paramKey: "chargeSwitch",
            },
            {
              label: "电费单价",
              value: "1",
              paramType: 2,
              paramKey: "electricityFee",
            },
            // {
            //   label: "欠费额度",
            //   value: "2",
            //   paramType: 3,
            //   paramKey: "allowArrearsThreshold",
            // },
          ];
        } else {
          this.parametertypeselect = [
            // { label: "收费开关", value: "0", paramType: 1, paramKey: "chargeSwitch" },
            {
              label: "水费单价",
              value: "0",
              paramType: 2,
              paramKey: "waterFee",
            },
            // {
            //   label: "欠费额度",
            //   value: "2",
            //   paramType: 3,
            //   paramKey: "allowArrearsThreshold",
            // },
          ];
        }
      } else if (this.RunorTollTextCheck == 1) {
        if (this.rightheadertab == 0) {
          this.parametertypeselect = [
            {
              label: "水量补贴",
              value: "0",
              name: "waterAllowance",
            },
            {
              label: "水压阈值",
              value: "1",
              name: "waterPressureThreshold",
            },
            {
              label: "水温阈值",
              value: "2",
              name: "waterTemperatureThreshold",
            },
            {
              label: "限时开始时间",
              value: "3",
              name: "limitedStartTime",
            },
            {
              label: "限时结束时间",
              value: "4",
              name: "limitedEndTime",
            },
            {
              label: "刷卡方式",
              value: "5",
              name: "swipeType",
            },
            {
              label: "数据上报周期",
              value: "6",
              name: "ReportIntervalTime",
            },
            {
              label: "断电停水开关",
              value: "7",
              name: "powerOfWaterSwitch",
            },
          ];
        } else if (this.rightheadertab == 1) {
          this.parametertypeselect = [
            {
              label: "电费补贴",
              value: "0",
              name: "electricityAllowance",
            },
            {
              label: "低电量阈值",
              value: "1",
              name: "electricBalanceThreshold",
            },
            {
              label: "允许欠费额度",
              value: "2",
              name: "allowArrearsThreshold",
            },
            {
              label: "电表一路额定功率",
              value: "3",
              name: "ammeterFirstRatedPower",
            },
            {
              label: "电表二路额定功率",
              value: "4",
              name: "ammeterSecondRatedPower",
            },
            {
              label: "数据上报周期",
              value: "5",
              name: "ReportIntervalTime",
            },
            {
              label: "限制电流",
              value: "6",
              name: "limitCurrent",
            },
            {
              label: "设置日结时间",
              value: "7",
              name: "settlementDate",
            },
            {
              label: "当前时区电价有效起始月日",
              value: "8",
              name: "effectiveDate",
            },
            {
              label: "购电次数",
              value: "9",
              name: "powerPurchases",
            },
            {
              label: "售电区号",
              value: "10",
              name: "areaCode",
            },
            {
              label: "购电金额",
              value: "11",
              name: "totalAmount",
            },
            {
              label: "1路电价",
              value: "12",
              name: "electricityPrice1",
            },
            {
              label: "2路电价",
              value: "13",
              name: "electricityPrice2",
            },
          ];
        } else if (this.rightheadertab == 2) {
          this.parametertypeselect = [
            {
              label: "允许欠费额度",
              value: "0",
              name: "allowArrearsThreshold",
              remark: "允许欠费额度",
            },
            {
              label: "水压阈值",
              value: "1",
              name: "waterPressureThreshold",
              remark: "水压阈值",
            },
            {
              label: "水温阈值",
              value: "2",
              name: "waterTemperatureThreshold",
              remark: "单位：℃",
            },
            {
              label: "限时开始时间",
              value: "3",
              name: "limitedStartTime",
              remark: "限时开始时间",
            },
            {
              label: "限时结束时间",
              value: "4",
              name: "limitedEndTime",
              remark: "限时结束时间",
            },
            {
              label: "开阀方式",
              value: "5",
              name: "useWaterType",
              remark: "0-非触控式 1-触控式",
            },
            {
              label: "消费模式",
              value: "6",
              name: "consumerType",
              remark: "0-计费 1-计时",
            },
            {
              label: "按键等待时间",
              value: "7",
              name: "keyWaitingTime",
              remark: "单位：s",
            },
            {
              label: "温度检测开关",
              value: "8",
              name: "temperatureDetectingSwitch",
              remark: "0-关 1-开",
            },
            {
              label: "下发额度百分比",
              value: "9",
              name: "percentageIssueLines",
              remark: "下发额度百分比",
            },
            {
              label: "额度阈值配置",
              value: "10",
              name: "amountThreshold",
              remark: "额度阈值配置",
            },

            {
              label: "应急用水开关",
              value: "11",
              name: "emergencyWaterSwitch",
              remark: "0-关闭 1-开启",
            },
            {
              label: "最低余额限额",
              value: "12",
              name: "minimumBalanceLimit",
              remark: "单位：元 （可以有两位小数）",
            },
            {
              label: "单次流量(消费)限额",
              value: "13",
              name: "singleTrafficLimit",
              remark: "单位L （不可以有小数）",
            },
            {
              label: "超时停水时长",
              value: "14",
              name: "overtimeWaterShutdownTime",
              remark: "单位：分钟 （最大255分钟）",
            },
            {
              label: "刷卡功能开关",
              value: "15",
              name: "swipeCardFunctionSwitch",
              remark: "0-关闭 1-开启",
            },
          ];
        }
      }
    },
  },
  created() {
    this.lddata();
    this.JudgeRunOrToll(this.layer, this.areaid);
  },
};
</script>

<style lang="scss" scoped>
.switchdialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      p {
        text-align: center;
        font-size: 14px;
        line-height: 24px;
      }
    }
  }
}
.delrundialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      h3 {
        text-align: center;
        font-size: 16px;
        font-weight: 400;
      }
    }
  }
}
.right_content {
  width: 1350px;
  .ChangeConfig {
    .addDialog {
      ::v-deep .el-dialog {
        width: 538px;
        .el-dialog__body {
          padding: 19px 53px 14px 53px;
          > div {
            margin: 15px 0 0 0;
            .label {
              font-size: 14px;
              font-family: $font-scre;
              font-weight: 400;
              color: #212d33;
              display: inline-block;
              width: 20%;
              text-align: right;
              margin: 5px 5px 5px 0;
              letter-spacing: 1px;
              span {
                color: #ff2020;
              }
            }
            .el-input {
              width: 335px;
              height: 0.20833rem;
            }
            label {
              display: inline-block;
            }
            .el-textarea {
              width: 335px;
              display: inline-block;
              vertical-align: top;
            }
          }
          .red {
            label {
              color: red;
            }
            color: red;
            font-size: 14px;
          }
        }
      }
    }
    ::v-deep .el-dialog {
      width: 398px;
      border-radius: 10px 10px 0px 0px;
      .el-dialog__body {
        .DialogContent {
          ul {
            padding-top: 10px;
            li {
              line-height: 25px;
              font-size: 14px;
            }
          }
          .radiocheck {
            margin-top: 10px;
          }
          label {
            margin-right: 0.15625rem;
          }
          .red {
            font-size: 16px;
            margin: 3px 0;
            span {
              color: red;
              font-size: 18px;
            }
          }
          .gray {
            font-size: 14px;
            color: #979797;
            button {
              text-align: right;
              border-radius: 4px;
              vertical-align: middle;
              padding: 5px;
              background: white;
              float: right;
              border: 1px solid #ebeef5;
            }
          }
          input {
            text-indent: 5px;
            height: 41px;
            width: 100%;
            border: 1px solid #999999;
            font-size: 16px;
            font-family: $font-scre;
            font-weight: 400;
            color: #4a4a4a;
            letter-spacing: 1px;
            text-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.37);
          }
          p {
            margin: 5px 0;
            font-size: 18px;
            font-family: $font-scme;
            font-weight: 500;
            color: #4a4a4a;
            letter-spacing: 1px;
          }
        }
      }
      .el-dialog__header {
        .el-dialog__title {
          font-size: 18px;
          font-family: $font-scre;
          font-weight: 400;
          color: #ffffff;
          letter-spacing: 1px;
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
      .el-dialog__footer {
        button {
          width: 128px;
          font-size: 16px;
        }
      }
    }
    .RunorToll {
      border-bottom: 1px solid #ebeef5;
      span {
        cursor: pointer;
        display: inline-block;
        height: 45px;
        line-height: 45px;
        padding: 0 2px;
        &:first-child {
          margin: 0 34px 0 43px;
        }
        font-size: 16px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
      }
      .active {
        color: #2b9cff;
        border-bottom: 3px solid #2b9cff;
      }
    }
    border-radius: 8px;
    background: white;
    margin-top: 15px;
    .tabledata {
      padding: 24px 30px;
      ::v-deep .el-switch__core,
      .el-switch {
        cursor: pointer;
        opacity: 1;
      }
    }
    table {
      border-collapse: collapse;
      width: 100%;
      tr {
        &:first-child {
          background: #f2f9ff;
        }
        .blue {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #2d92ff;
          cursor: pointer;
        }
        td {
          height: 58px;
          line-height: 58px;
          .el-input {
            width: 175px;
            /deep/ .el-input__inner {
              text-align: center;
            }
          }
          > span {
            display: inline-block;
            width: 100%;
            line-height: 58px;
            height: 100%;
          }
          text-align: center;
          font-size: 14px;
          font-family: $font-scme;
          font-weight: 500;
          color: #364147;
        }
      }
    }
    .savebutton {
      text-align: center;
      margin: 15px 0;
      button {
        border: 0;
        margin: 0 10px;
        width: 0.41667rem;
        height: 0.17188rem;
        border-radius: 5px;
        background-color: white;
        border: 1px solid #ebeef5;
        font-size: 16px;
        font-family: $font-scre;
        letter-spacing: 1px;
        &:first-child {
          background: #2d92ff;
          color: white;
        }
      }
    }
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
}
.middle_content {
  padding: 0 19px;
}
</style>

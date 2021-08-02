<template>
    <div class="middle_content clearfix">
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
      <div class="filtrate">
        <div class="filtrate-table">
          <div class="button">
            <button v-preventReClick="2000" @click="AllOperate" class="success">
              新增
            </button>
            <button v-preventReClick="2000" @click="alldel()" class="del">
              删除
            </button>
          </div>
          <!-- 管控计划 -->
          <el-table
            v-loading="tableloading"
            :data="TableData0.records"
            tooltip-effect="dark"
            style="width: 100%"
           
            @selection-change="handleSelectionChange"
            class="content_table"
            v-if="rightheadertab == 0"
          >
            <el-table-column type="selection"/>
            <el-table-column label="序号" type="index"/>
            <el-table-column prop="deviceCode" label="计划名称"/>
            <el-table-column prop="lineCode" label="管控类型"/>
            <el-table-column prop="deviceCode" label="周期"/>
            <el-table-column prop="zzz" label="开合闸"/>
            <el-table-column prop="lineCode" label="时间"/>
            <el-table-column prop="lineCode" label="是否跳过节假日"/>
         
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text"   @click="handleUpdate(scope.row)">修改</el-button>
                <el-button type="text"   @click="alldel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 自定义假期 -->
          <el-table
            v-loading="tableloading"
            :data="TableData1.records"
            tooltip-effect="dark"
            style="width: 100%"
            :cell-style="addClass"
            @selection-change="handleSelectionChange"
            class="content_table"
            v-if="rightheadertab == 1"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="序号" type="index"/>
            <el-table-column prop="deviceCode" label="开始时间" />
            <el-table-column prop="deviceCode" label="结束时间"/>
            <el-table-column prop="deviceCode" label="备注"/>
          </el-table>
          <!-- 节假日设置 -->
          <el-table
          v-loading="tableloading"
          :data="TableData1.records"
          tooltip-effect="dark"
          style="width: 100%"
          :cell-style="addClass"
          @selection-change="handleSelectionChange"
          class="content_table"
          v-if="rightheadertab == 2"
        >
            <el-table-column type="selection"/>
            <el-table-column label="序号" type="index"/>
            <el-table-column prop="lineCode" label="节假日名" />
            <el-table-column prop="deviceCode" label="放假时间"/>
            <el-table-column prop="deviceCode" label="调休时间"/>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text"   @click="handleUpdate(scope.row)"  v-if="rightheadertab == 2">修改</el-button>
                <el-button type="text"   @click="alldel(scope.row)"  v-if="rightheadertab == 2">删除</el-button>
              </template>
            </el-table-column>
          
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="PageChange"
            :current-page="CurrentPage"
            :page-sizes="PageSizes"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="TableData1.total"
          >
          </el-pagination>
          <!-- 管控计划新增对话框 -->
         <el-dialog title="新增管控计划"  :visible.sync="dialogFormVisible" width="1150px">
            <div class="dialog_left">
              <el-checkbox v-model="sizeForm.checked" style="margin: 0 0 10px 10px;">全选</el-checkbox>
                <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                v-model="sizeForm.checked"
                :props="defaultProps">
              </el-tree>
              </div>
            <div class="dialog_right">
                <el-form ref="form" :model="sizeForm" label-width="180px" size="mini">
                    <el-form-item label="活动名称：">
                        <el-input v-model="sizeForm.name" style="width: 288px;"></el-input>
                      </el-form-item>
                      <el-form-item label="业务类型：">
                        <el-checkbox v-model="sizeForm.checked1">照明</el-checkbox>
                        <el-checkbox v-model="sizeForm.checked1">空调</el-checkbox>
                        <el-checkbox v-model="sizeForm.checked1">插座</el-checkbox>
                      </el-form-item>
                      <el-form-item label="周期：">
                        <el-checkbox v-model="sizeForm.checked2">周一</el-checkbox>
                        <el-checkbox v-model="sizeForm.checked2">周二</el-checkbox>
                        <el-checkbox v-model="sizeForm.checked2">周三</el-checkbox>
                        <el-checkbox v-model="sizeForm.checked2">周四</el-checkbox>
                        <el-checkbox v-model="sizeForm.checked2">周五</el-checkbox>
                        <el-checkbox v-model="sizeForm.checked2">周六</el-checkbox>
                        <el-checkbox v-model="sizeForm.checked2">周日</el-checkbox>
                      </el-form-item>
                      <el-form-item label="开合闸：">
                        <el-radio v-model="sizeForm.radio" label="1">合闸</el-radio>
                        <el-radio v-model="sizeForm.radio" label="2">开闸</el-radio>
                      </el-form-item>
                      <el-form-item label="时间：">
                        <el-time-picker
                        style="width: 128px;"
                        v-model="sizeForm.value1"  format="HH点mm分ss秒" >
                      </el-time-picker>
                      </el-form-item>
                      <el-form-item label="是否跳过节假日：">
                        <el-radio v-model="sizeForm.radio0" label="1">是</el-radio>
                        <el-radio v-model="sizeForm.radio0" label="2">否</el-radio>
                      </el-form-item>
                </el-form>
              </div>
        <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFormVisible = false">取 消</el-button>
         <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
       </div>
        </el-dialog>
         <!-- 自定义假期新增对话框 -->

        <el-dialog title="新增管控计划" :visible.sync="dialogFormdata" width="600px">
         <div  class="dialog_right_form">
            <el-form ref="form" :model="formdata" label-width="140px">
               <el-form-item label="开始时间：" > 
             
            <el-date-picker
            v-model="formdata.startTime"
            style="width: 288px;"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
               </el-form-item>
               <el-form-item label="结束时间：">
                <el-date-picker
                v-model="formdata.endTime"
                style="width: 288px;"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
                 </el-form-item>
               <el-form-item label="备注：">
                <el-input type="textarea" v-model="formdata.desc"   style="width: 288px;"></el-input>
              </el-form-item>
            </el-form>
          </div>
    <div slot="footer" class="dialog-footer">
     <el-button @click="dialogFormdata = false">取 消</el-button>
     <el-button type="primary" @click="dialogFormdata = false">确 定</el-button>
   </div>
         </el-dialog>
         <!-- 节假日新增对话框 -->
         <el-dialog title="新增节假日" :visible.sync="dialogHoliday" width="800px">
          <div class="dialog_right_form">
                <el-form ref="form" :model="datatype" label-width="180px">
                   <el-form-item label="节假日名称：">
                    <el-input  v-model="datatype.desc" style="width: 503px;"></el-input>
                   </el-form-item>

                   <el-form-item label="放假时间：">
                  <el-date-picker
                  v-model="datatype.value2"
                  type="daterange"
                  style="width: 502px;"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                   </el-form-item>
                   <el-form-item label="是否跳过节假日：">
                    <el-radio v-model="datatype.radio" label="1">是</el-radio>
                    <el-radio v-model="datatype.radio" label="2">否</el-radio>
                  </el-form-item>
                  <el-form-item label="调休时间：">
               <el-date-picker
               v-model="datatype.value1"
               style="width: 234px;"
               type="date"
               placeholder="选择日期"
               format="yyyy 年 MM 月 dd 日">
             </el-date-picker>
             <i class="el-icon-circle-plus" style="color: #1890ff;font-size: 20px; margin-left: 5px;" @click="timeClick"></i>
                  </el-form-item>
             <el-form-item  v-for="(item,i) of items" v-model="items[i]" :key="i">
               <el-date-picker
               style="width: 234px;"
               type="date"
               placeholder="选择日期"
               format="yyyy 年 MM 月 dd 日">
             </el-date-picker>
             <i class="el-icon-remove" style="color: rgba(255,32,32,0.80);font-size: 20px; margin-left: 5px;" @click="deleteItem(item, index)" ></i>
                  </el-form-item>
                </el-form>
              </div>
        <div slot="footer" class="dialog-footer">
         <el-button @click="dialogHoliday = false">取 消</el-button>
         <el-button type="primary" @click="dialogHoliday = false">确 定</el-button>
       </div>
             </el-dialog>
        </div>
      </div>
      
    </div>
  </template>
  
  <script>
  import utils from "../../../../utils/utils";
  
  export default {
    data() {
      return {
        // tab栏切换
        rightheadertab: 0, //tab数 showorhide
        rightheader: ["管控计划配置", "自定义假期", "节假日设置"], //右侧头部tab切换数据  "冷水", "用电",
  
        // 照明表格
        loading: false,
        rechargedata: [],
        rechargetotal: null, //充值总金额
        items:[],
        // 分页
        CurrentPage: 1,
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
        PrimarytableorChildtable: 0,
       //管控计划对话框
       dialogFormVisible:false,
       data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        TableData0: {
          records: [
            {
              deviceCode: "040120000221",
              lineCode: "1",
              location: "天河荷光路照明",
            },
          ],
        },
        sizeForm: {
          name: '',
          checked:true,
          radio:1,
          radio0:1,
          value1: '09:41:00',
        },
        // 自定义假期
        formdata: {
            startTime: '',
            endTime: '',
            desc:''
        },
        dialogFormdata:false,
        // 节假日
        datatype:{
            desc:'',
            value1: '09:41:00',
            value2: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
            radio:'',
      
        },
        dialogHoliday:false,
        TableData1: {
          records: [
            {
              deviceCode: "0000q32341",
              lineCode: "1",
              location: "天河荷光路空调",
            },
          ],
        },
        TableData2: {
          records: [
            {
              deviceCode: "040120000221",
              lineCode: "1",
              location: "天河荷光路插座",
            },
          ],
        },
        //表格数据
        tableloading: false,
        TableCheckData: [], //table选中数据
  
        filtrateClick: true,
        user_name: null, //设备条件查询name
        IsonlineValue: null,
        IsAllotValue: null,
        IsGateValue: null,
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
        locationnumber: 0,
  
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
        SleectinstallDialog: false,
        treecheckonetwolevel: [],
        treecheckid: [],
        TwoSelectDialogShoworHide: false, // 第二次弹窗
        LeftDataId: "", //选择安装位置所需的区域id
        deldialog: false,
        PickerstartTime: null,
        PickerendTime: null,
        energyTotalUse: "", //用户记录 用水总量
        drawerloading: false, //抽屉表格刷新
        InfoTableData: [], //用量记录table数据
        OperateListtable: [], //操作记录table
        OperateListtable2: [], //操作记录table
        OperateListtable3: [], //操作记录table
        OperateListtable4: [], //操作记录table
        drawerylloading: false,
        infoTotalCurrent: 1, //用水总量页数
        ListannalCurrent: 1, //记录列表
        filtrate_table_button_value: ["刷新", "下发水表参数配置"],
        record_list_tab: ["报警记录", "操作记录"],
        record_list_tab_num: 0,
        selecttree: [], //树状图数据未处理
      };
    },
    created() {
      this.lddata(); //树状图数据
      // this.AxiosTablepage();
      this.TableDataSearch();
    },
    methods: {
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
      // 切换tab
      righttoptab(index) {
        this.rightheadertab = index;
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
      // 获取表格数据
      TableDataSearch() {
        console.log("获取表格数据");
        if (this.IsonlineValue === 0) {
          this.IsonlineValue = parseInt(this.IsonlineValue);
        } else if (this.IsonlineValue === 1) {
          this.IsonlineValue = parseInt(this.IsonlineValue);
        } else {
          this.IsonlineValue = null;
        }
  
        this.tableloading = true;
        this.$axios
          .post("/device/page", {
            gatewayType: this.gatewayTypeValue,
            current: this.CurrentPage,
            size: this.PageSize,
            deviceType: 5,
            online: this.IsonlineValue,
            layer: this.treelayer,
            areaId: this.treeid,
            deviceCode: this.NameInput,
            allocationStatus: this.IsAllotValue,
          })
          .then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              this.tableloading = false;
              this.TableData = res.data.rows;
            } else {
              this.tableloading = false;
            }
          });
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
      //点击调休时间的加
      timeClick(){
        if(this.items.length==8){
          this.$message({
          message: '已到达限制',
          type: 'warning'
        });
        }else{
          this.items.push('')
        }
        
      },
      //点击删除
      deleteItem(item, index){
        this.items.splice(index, 1)
      },
      // 单击树状图查询
      handleNodeClick(data) {
        this.default_qj = false;
        let dataid = data.id.replace(/[^0-9]/gi, "");
        this.treelayer = data.layer;
        this.treeid = dataid;
        this.CurrentPage = 1;
        // this.AxiosTablepage();
        this.TableDataSearch();
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
      // 筛选重置
      reset() {
        this.fpvalue = null;
        this.user_name = null;
        this.CurrentPage = 1;
        [this.locationnumber, this.sortnumber] = [0, 0, 0];
        this.fpvalue = null;
        this.IsonlineValue = null;
        this.IsAllotValue = null;
        this.IsGateValue = null;
        // this.AxiosTablepage();
        this.TableDataSearch();
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
      // 新增
      AllOperate(row) {
          let me=this
          if( me.rightheadertab == 0|| me.rightheadertab == '0'){
            if(row !=null&&row.deptId){
              me.TableData0.parentId=row.deptId
            }else{
              me.TableData0.parentId=0
            }
            me.dialogFormVisible=true
            me.title="新增管控计划"
          }else if(me.rightheadertab == 1|| me.rightheadertab == '1'){
            me.dialogFormdata=true
          }else{
           me.dialogHoliday=true
          }
      },
      handleUpdate(row){
        let me=this
          if( me.rightheadertab == 0|| me.rightheadertab == '0'){
            if(row !=null&&row.deptId){
              me.TableData0.parentId=row.deptId
            }else{
              me.TableData0.parentId=0
            }
            me.dialogFormVisible=true
            me.title="修改管控计划"
          }else if(me.rightheadertab == 1|| me.rightheadertab == '1'){
            me.dialogFormdata=true
          }else{
           me.dialogHoliday=true
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

      //删除
      alldel() {
      if (this.TableCheckData.length != 0) {
        this.deldialog = true;
        this.delnum = 1;
      } else {
        this.delnum = 0;
        this.$message.warning("您没有选中任何数据项");
      }
    },
    //修改
    //  handleUpdate(row) {
    //   this.reset();
    //   this.getTreeselect();
    //   if (row != null) {
    //     this.form.parentId = row.deptId;
    //   }
    //   getDept(row.deptId).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改管控计划";
    //   });
    // },
      // 提交
      submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != null) {
            updateDept(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
   
      test() {
        if (this.PickerstartTime == null) {
          this.PickerendTime = null;
        }
        if (this.datestart == null) {
          this.dateend = null;
        }
      },
      getinfoTotal(val) {
        this.infoTotalCurrent = val;
        this.getInfoTableData();
      },
      ListannalPage(val) {
        // this.ListannalCurrent = val;
        this.ListannalCurrent = 1;
        this.OperateListtablesearch();
      },
      OperateListtablesearch() {
        console.log("11");
        this.drawerloading == false;
      },
      SeeDetails() {
        console.log('跳转');
  
        this.$router.push({
          name: "intelligent_details",
          query: { id: 1 },
        });
      }
    },
  };
  </script>
  
  <style lang='scss' scoped>
  .middle_content {
    padding: 0 19px;
  }
  .right_content {
    width:100%;
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
  
  table {
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
        .index {
          width: 12px;
          height: 12px;
          opacity: 1;
          border: 1px solid #b4b4b4;
          border-radius: 2px;
        }
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
        // text-align: left;
      }
      padding: 0 34px;
      background: $tablebg;
      border-radius: 1px;
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
  .filtrate {
    width: 100%;
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
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
        }
        .del {
          background: #ff2020;
          color: #fff;
        }
        .success {
            background: #2c9dff;
          color: #fff;
        }
      }
      /deep/ .el-pagination {
        padding: 20px 0;
      }
    }
    .dialog_left{
        position: fixed;
        width: 240px;
        height: 369px;
        background: #ffffff;
        border-radius: 8px;
       overflow-y: auto;
      overflow-x: hidden;
      border-radius: 2px;
      box-shadow: 0px 2px 8px 0px rgba(200,201,204,0.50);
      -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
     
    }
    .dialog_right{ 
        width: 500px;
        height: 369px;
        margin-left: 260px;
    }
    .dialog_right_form{
      margin-left: 40px;
width: 492px;
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
        float: right;
      }
      span {
        display: inline-block;
        padding-right: 15px;
        border-right: 1px solid #41545b;
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
      span:last-child {
        border: none;
        padding-left: 15px;
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
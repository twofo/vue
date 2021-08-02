<template>
    <div class="middle_content clearfix">
        <div class="fr right_content">
            <ul class="top_header">
              <li  @click="handleReturn">
                 <i class="el-icon-arrow-left"></i> 返回
              </li>
            </ul>
          </div>
         <div class="right_iconUpdate">
            <div class="right_top_content">
            </div>
            <div class="rignt_content_text">
                <b> 固件详情</b>
             </div>
           <div class="rignt_content_img">
             <img src="../../../../assets/images/equipment/dlq.svg" alt="">
           </div>
           <div class="rignt_content_details">
             <p>固件名称：</p>
             <span>断路器升级固件</span>
             </div>
            <div>
                <div class="right_background">
                    <div class="right_background_img bg_blur">

                    </div>
              </div>
              <div class="right_background_text content_blur">
                <p>产品类型：</p>
                <span>断路器</span>
      </div>
            </div>
              
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
      <div class="filtrate"  v-if="rightheadertab == 1">
          <!-- 升级记录 -->
           <div class="filter-top" >
                <el-form ref="form" :inline="true" :model="datatype" label-width="80px" style="margin-top: 10px;">
                    <el-form-item label="设备编号" style="margin-left: 18px;">
                       <el-select clearable v-model="datatype.asblx" placeholder="请选择" style="width: 160px;">
                           <el-option
                             v-for="item in asblx"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"
                           ></el-option>
                         </el-select>
                    </el-form-item>
                   
                    <el-form-item label="状态">
                       <el-select clearable v-model="datatype.asblx" placeholder="请选择" style="width: 160px;">
                           <el-option
                             v-for="item in asblx"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"
                           ></el-option>
                         </el-select>
                    </el-form-item>
                   
                    <el-form-item label="时间">
                     <el-date-picker
                     v-model="datatype.value2"
                       range-separator="-"
                       style="width: 240px;"
                     type="daterange"
                     start-placeholder="开始日期"
                     end-placeholder="结束日期">
                   </el-date-picker>
                      </el-form-item>
                      <el-form-item style="margin-left: 80px;">
                        <el-button type="primary">搜索</el-button> 
                        <el-button>重置</el-button>
                      </el-form-item>
                </el-form> 
              </div>
           </div>
          <!-- 基本信息 -->
          <div class="box_table"  v-if="rightheadertab == 0">
            <table  id="left_table"  v-if="rightheadertab == 0"  >
              <tr >
                <th>固件名称</th>
                <td>小小</td>
                <th>所属产品</th>
                <td>小小</td>
              </tr>
              <tr>
                <th>版本号</th>
                <td>$100</td>
                <th>上传时间</th>
                <td>$100</td>
              </tr>
              <tr>
                <th>备注</th>
                <td>$100</td>
                <th></th>
                <td></td>
              </tr>
              
            </table>
          </div>
          
           <!-- 升级记录 -->
          <el-table
            v-loading="tableloading"
            :data="TableData1.records"
            tooltip-effect="dark"
            :cell-style="addClass"
            @selection-change="handleSelectionChange"
            class="content_table"
            v-if="rightheadertab == 1"
          >
          <el-table-column type="selection"/>
          <el-table-column label="序号" type="index"/>
          <el-table-column prop="deviceCode" label="设备编号"/>
          <el-table-column prop="lineCode" label="位置信息"/>
          <el-table-column prop="deviceCode" label="升级状态"/>
          <el-table-column prop="lineCode" label="升级时间"/>
          <el-table-column prop="lineCode" label="操作人"/>
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
            v-if="rightheadertab == 1"
          >
          </el-pagination>
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
        rightheader: ["基本信息", "升级记录"], //右侧头部tab切换数据  "冷水", "用电",
  
        // 照明表格
        loading: false,
        rechargedata: [],
        rechargetotal: null, //充值总金额
  
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
        datatype:{
            asblx:'',
            value2:''
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
      //点击返回  回到固件升级页面
      handleReturn(){
        this.$router.push({name: 'firmware'});
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
          return "";
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
     handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.deptId;
      }
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改管控计划";
      });
    },
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
    .el-pagination {
      width: 1287px;
      }
  }
  .right_content {
    width:1287px;
    float: left;
    border-radius: 8px;
  }
  .right_content:nth-child(1){
    width:100%;
    height: 60px;
    background-color: #fff;
  }
  .right_iconUpdate{
    float: right;
    /* background-size: 100% 100%; */
    position: fixed;
    right: 28px;
     bottom: -7 8px;
     width: 331px;
     height: 864px;
     opacity: 0.96;
     background: rgba(255,255,255,0.30);
     border-radius: 8px;
     box-shadow: 0px 0px 15px 8px rgba(255,255,255,0.50); 
     .right_top_content{
         height: 321px;
         filter: blur(15px);
         float: left;
     }
     .right_background{
         height: 543px;
         width: 331px;
         background: url(../../../.././assets/images/equipment/beij2@1x.png) no-repeat;
         z-index:-10;
         .right_background_img{
          height: 543px;
         width: 300px;
         margin-left: 15px;
          background: url(../../../.././assets/images/equipment/beij2@1x.png) no-repeat;
         }
     }
     .right_background_text{
            p{
            color:#212D33;
            font-size: 12px;
         } 
        span{
            font-size: 14px;
            display: block;
            color: rgb(0, 0, 0);
           padding: 8px 0 0 0;
        }   
          }  
     .bg_blur{
        float: left;
         filter: blur(5px);
             
     }
     .content_blur{
        position:absolute;
          left: 28px;
          top:381px
     }
    .rignt_content_text{
      font-size: 16px;
      margin: 20px 0 0 20px;
      height: 22px;
      line-height: 22px;
      font-family: PingFangSC, PingFangSC-Medium;
     font-weight: 500;
    }
    .rignt_content_img{
        width: 98px;
        height: 98px;
        margin: 77px auto;
        img{
            width: 100%;
        }
    }
    .rignt_content_details{
        margin-left: 28px;
        
        p{
            color: #212D33;
            font-size: 12px;
        }   
        span{
            font-size: 14px;
            display: block;
            color: rgb(0, 0, 0);
           margin: 8px 0 0 0;
        }                          
    }
  }
  .top_header {
    background: white;
    z-index: 999;
    height: 36px;
    margin-top: 10px;
    border-radius: 8px;
    li {
      cursor: pointer;
      display: inline-block;
      width: 58px;
      text-align: center;
      height: 100%;
      line-height: 36px;
      font-size: 14px;
      font-family: $font-scre;
      font-weight: 400;
      color: #212d33;
      margin: 0 10px 0 32px;
      &.active {
        font-family: $font-scme;
        font-weight: 500;
        color: #2c9dff;
        border-bottom: 2px solid #2D92FF;
      
      }
      &:hover {
        font-family: $font-scme;
        font-weight: 500;
        color: #2c9dff;
        border-bottom: 2px solid #2D92FF;
      }

    }
       
  }
  .top_header li:first-child,
.headertab li:first-child {
    border-radius: 0;
}

  .filtrate-content{
      width: 100%;
  }
  ::v-deep .el-dialog__body{
  border-bottom: 2px solid rgb(241, 241, 241);
  border-top: 2px solid rgb(241, 241, 241);
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
  .box_table{
    width: 1287px;
    height: 730px;
    float: left;
    background-color: #fff;
  }
  #left_table{
        float: left;
        width: 1196px;
        height: 186px;
        border: 1px solid #dddddd;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 28px;
        font-size: 14px;
        opacity: 0.8;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #313c42;
        tr>th{
         background-color: #F2F9FF;
         height: 42px;
         width: 150px;
        border-right: 1px solid #dddddd;
        border-bottom: 1px solid #dddddd;
        }
        tr:nth-child(3)>th{
            height: 100px;
            border-bottom: none;
        }
        tr:nth-child(3)>td:nth-child(2){
        border-right: none;
        }
        tr:nth-child(3)>th:nth-child(3){
            background-color: #fff;
            border: none;
        }
        tr>td{
            background-color: #fff;
            border-right: 1px solid #dddddd;
        border-bottom: 1px solid #dddddd;
       color: #313c42;
       padding-left: 30px;
    
        }
    }
  .filtrate {
    width: 1287px;
    /* overflow: auto; */
    float: left;
    height: 90px;
    background-color: #fff;
     .filter-top>div {
        margin-right: 40px;
        margin-left: 28px;
        .el-button{
            margin-top: 12px;
        }
        ::v-deep .el-select {
          width: 100%;
        }
        ::v-deep .el-date-editor {
          width: 160px;
          height: 32px;
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
    }
    .filter-top{
        width: 100%;
      
        background-color: #fff;
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
        margin-right: 375px;
      margin-top:20px
      }
    }
    .dialog_left{
        position: fixed;
        width: 15%;
        height: 400px;
        background: #ffffff;
        border-radius: 8px;
       overflow-y: auto;
      overflow-x: hidden;
      -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
     
    }
    
    .dialog_right{ 
        width: 35%;
        margin-left: 300px;
    }
    .dialog_right_form{
      margin-left: 100px;
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
  .content_table {
    width: 1287px;
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
    width: 1287px;
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
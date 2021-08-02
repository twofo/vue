<template>
  <div class="middle_content clearfix">
    <transition name="fade-transform" mode="out-in">
      <div class="recharge fr">
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
          <transition name="fade-transform" mode="out-in" v-if="filtercheck == true">
              <div class="filtrate-content clearfix">
                  <div class="fl">
                    <p>固件名称</p>
                    <el-select clearable v-model="asblx" placeholder="请选择">
                      <el-option
                        v-for="item in asblx"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="fl">
                    <p>所属产品</p>
                    <el-select clearable v-model="asblx" placeholder="请选择">
                      <el-option
                        v-for="item in asblx"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
      
                </div>
          </transition>
          <transition name="fade-transform" mode="out-in" v-if="filtercheck == true">
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
        <div class="filtrate">
          <div class="filtrate-table">
            <div class="button">
             
              <button v-preventReClick="2000" @click="alldel()" class="del">
                删除
              </button>
              <button v-preventReClick="2000" @click="AllOperate" class="success">
                新增
              </button>
            </div>
            <!-- 表单 -->
            <el-table
              v-loading="tableloading"
              :data="TableData0.records"
              tooltip-effect="dark"
              style="width: 100%"
             
              @selection-change="handleSelectionChange"
              class="content_table"
            >
              <el-table-column type="selection"/>
              <el-table-column label="序号" type="index"/>
              <el-table-column prop="deviceCode" label="固件名称"/>
              <el-table-column prop="lineCode" label="固件版本号"/>
              <el-table-column prop="deviceCode" label="所属产品"/>
              <el-table-column prop="lineCode" label="时间"/>
              <el-table-column prop="lineCode" label="操作人"/>
           
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text"   @click="confirmUpgrade">详情</el-button>
                  <el-button type="text"   @click="handleUpgrade(scope.row)" >一键升级</el-button>
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
              </div>
        </div>
        
      </div>
      
    </transition>
    <!--  新增固件版本-->
    <el-dialog title="新增固件版本" :visible.sync="dialogFormdata" width="600px">
      <div  class="dialog_right_form">
         <el-form ref="form" :model="formdata" label-width="140px" >
    
            <el-form-item label="所属产品："> 
              <el-select clearable v-model="formdata.asblx" placeholder="请选择"  style="width: 288px">
                <el-option
                  v-for="item in asblx"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="固件名称：">
              <el-input  v-model="formdata.desc1"  style="width: 288px"></el-input>
              </el-form-item>
            <el-form-item label="版本号：" >
              <el-input  v-model="formdata.desc2"  style="width: 288px"></el-input>
              </el-form-item>
            <el-form-item label="升级文件：">
              <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small"  class="el-icon-upload2" style="width: 106px; height: 32px;">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.bin</div>
            </el-upload>

              </el-form-item>
            <el-form-item label="备注：" >
             <el-input type="textarea" v-model="formdata.desc"  style="width: 288px"></el-input>
           </el-form-item>
         </el-form>
       </div>
 <div slot="footer" class="dialog-footer">
  <el-button @click="dialogFormdata = false">取 消</el-button>
  <el-button type="primary" @click="dialogFormdata = false">确 定</el-button>
</div>
      </el-dialog>
   <!-- 一键升级 -->
   <el-dialog
  title="提示"
  :visible.sync="dialogUpgrade"
  width="30%">
  <span>是否对所属产品为断路器的硬件进行固件升级</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogUpgrade = false">取 消</el-button>
    <el-button type="primary" @click="dialogUpgrade = false" >确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import { sortmixin } from "@/mixin/sort.js";
export default {
  name: "hot_water",
  mixins: [sortmixin],
  data() {
    return {
      loading: true,
      dataid: null,
      layer: null,
      // fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
      // {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      fileList:[],
      // 一键升级对话框处理
      dialogUpgrade:false,
         //表格数据
         tableloading: false,
         dialogFormdata:false,
      formdata:{
          radio:1,
          text:''
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
        // 新增对话框表单
        formdata:{
          desc1:'',
          desc2:'',
          desc:'',
          asblx:''
        },
        TableData1: {
          records: [
            {
              deviceCode: "0000q32341",
              lineCode: "1",
              location: "天河荷光路空调",
            },
          ],
        },
      lefttree: [], //树状图数据
      defaultProps: {
        //树状图匹配数据
        children: "children",
        label: "name",
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
              new Date(this.zdystarttime).getTime() - 1 * 24 * 60 * 60 * 1000
          );
        },
      },
      asblxvalue: "",
      recharge: [],
      zdystarttime: null,
      zdyendtime: null,
      asblx: [
        {
          value: "14",
          label: "网关",
        },
        // {
        //   value: "4",
        //   label: "电表",
        // },
        {
          value: "2",
          label: "水表",
        },
      ],
      abjlx: [
        {
          value: "1",
          label: "设备",
        },
        {
          value: "2",
          label: "系统",
        },
        {
          value: "3",
          label: "业务",
        },
      ],
      abjlxvalue: "",
      filtercheck: true,
      default_qj: true,
      default_qj: true, //是否默认全局
      CurrentPage: 1,
      PageSizes: [10, 20, 30, 50],
      PageSize: 10,
      Total: "", //总数
    };
  },
  methods: {
    sorttable(name) {
      this.loading = true;
      this.SortReady(name);
      this.AxiosSort(name)
        .then((res) => {
          this.recharge = res.data.rows;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
     // 多选按钮选中存入数组
     handleSelectionChange(val) {
        this.TableCheckData = val;
      },
    test() {
      if (this.zdystarttime == null) {
        this.zdyendtime = null;
      }
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.getList(); //分页
    },
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.getList();
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
   // 新增
   AllOperate(){
    let me=this
  me.dialogFormdata=true
},
// 一键升级
handleUpgrade(){
   let me=this
   me.dialogUpgrade=true
},
//确定一键升级
confirmUpgrade(){
  this.$router.push({name: 'firmSublevel'});
  this.dialogUpgrade = false
},

PageChange(val) {
        this.CurrentPage = val;
        this.AxiosData();
      },
    // 是否全局搜索
    whetherglobal() {
      // 重置树状图
      this.lddata();
      this.default_qj = !this.default_qj;
      this.asblxvalue = "";
      this.abjlxvalue = "";
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.dataid = null;
      this.layer = null;
      this.getList();
    }, // 单击树状图查询
    handleNodeClick(data) {
      this.default_qj = false;
      this.dataid = data.id.replace(/[^0-9]/gi, "");
      this.CurrentPage = 1;
      this.layer = data.layer;
      this.getList();
    },
    getTotal() {
      this.$axios.post("/iot/alarm/getTotal", {}).then((res) => {
        this.Total = res.data.rows;
      });
    },
    reset() {
      this.zdystarttime = null;
      this.zdyendtime = null;
      this.PageSize = 10;
      this.asblxvalue = null;
      this.abjlxvalue = null;
      this.sortnumber = 0;
      this.sortname = null;
      this.getList();
    },
    //判断
    Dontempty(){
       if(this.formdata !=''){
          
       }
    },
    //点击上传
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
    getList() {
      this.loading = true;
      this.AxiosParams = {
        startDate: this.zdystarttime,
        endDate: this.zdyendtime,
        current: this.CurrentPage,
        size: this.PageSize,
        deviceType: this.asblxvalue,
        alarmType: this.abjlxvalue,
        buildingId: this.dataid,
        layer: this.layer,
      };
      this.SortNumberUpdate();
      this.SortUrl = "/iot/alarm/getList";
      this.$axios.post("/iot/alarm/getList", this.AxiosParams).then((res) => {
        this.recharge = res.data.rows;
        this.loading = false;
      });
    },
  },
 
  activated() {
    this.getList();
  },
  created() {
    this.lddata(); //树状图
    this.getTotal(); //总数
    this.getList(); //分页
  },
  mounted() {},
  computed: {},
};
</script>

<style lang="scss" scoped>
::v-deep .el-pagination {
  padding: 10px 0 0 0;
}
.recharge_content {
  border-radius: 8px;
  background: #ffffff;
  margin-top: 19px;
  padding: 10px 40px 20px 43px;
  > table {
    width: 100%;
    margin-top: 14px;
    border-collapse: collapse;
    tr {
      height: 58px;
      line-height: 58px;
      td {
        text-align: center;
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

  .top_title {
    font-size: 24px;
    padding-bottom: 8px;
    font-family: $font-scse;
    font-weight: 600;
    color: #000000;
    border-bottom: $border;
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
  .filter_enter {
    margin-top: 12px;
    border-top: 1px solid #dbdbdb;
    > div {
      margin-right: 120px;
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
.middle_content {
  padding: 0 19px;
}
.recharge {
  width: 100%;
}
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
    .upload_text{
      font-size: 12px;
      color: rgba(0,0,0,0.30);
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
          /* box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3); */
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
  ::v-deep .el-dialog__body{
  border-bottom: 2px solid rgb(241, 241, 241);
  border-top: 2px solid rgb(241, 241, 241);
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
      }}
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

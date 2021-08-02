<template>
  <div class="middle_content">
    <div class="filtrate-heared">
      <div
        class="filtrate-title"
        :style="filtrateClick == false ? 'border-bottom: none;' : ''"
      >
        <div class="left">
          条件筛选
          <div class="right1 pointer" @click="filtrateClick = !filtrateClick">
            <div v-if="filtrateClick == true"><i class="el-icon-arrow-up"></i> 收起</div>
            <div v-if="filtrateClick == false">
              <i class="el-icon-arrow-down"></i> 展开
            </div>
          </div>
        </div>
      </div>
      <div class="filter" v-if="filtrateClick">
        <div class="filtrate-content clearfix">
          <div class="fl">
            <div class="text">按用户姓名查询</div>
            <div class="input">
              <el-input
                v-model="Username"
                clearable
                placeholder="请输入用户姓名"
              ></el-input>
            </div>
          </div>
          <div class="fl">
            <div class="text">按用户学工号查询</div>
            <div class="input">
              <el-input
                v-model="UserCode"
                clearable
                placeholder="请输入用户学工号"
              ></el-input>
            </div>
          </div>
          <div class="fl">
            <div class="text">按类型查询</div>
            <div class="input">
              <el-select v-model="Typevalue" clearable placeholder="请选择">
                <el-option
                  v-for="item in TypeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="info butonnhover">
          <el-button
            v-preventReClick="2000"
            type="primary"
            @click="
              CurrentPage = 1;
              TableSearch();
            "
            >搜索</el-button
          >
          <el-button
            v-preventReClick="2000"
            type="primary"
            @click="
              CurrentPage = 1;
              reset();
            "
            >重置</el-button
          >
        </div>
      </div>
    </div>
    <div class="filtrate-table">
      <div class="button">
        <button @click="TableSearch">刷新</button>
      </div>
      <table
        class="filtrate-table-content"
        border="0"
        cellspacing="0"
        cellpadding="0"
        v-loading="loading"
      >
        <tr>
          <th>序号</th>
          <th>学工号</th>
          <th>姓名</th>
          <th>类型</th>
          <th>联系电话</th>
          <th>账户状态</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in TableData.records" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.userCode }}</td>
          <td>{{ item.userName }}</td>
          <td>
            {{ item.personType == 0 ? "学生" : item.personType == 1 ? "老师" : "-" }}
          </td>
          <td>{{ item.mobile || "-" }}</td>
          <td>
            <el-switch
              v-model="item.status"
              :active-value="1"
              :disabled="switchDisabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </td>
          <td>
            <span class="particulars" @click="particularshandle(index)">详情</span>
            <span class="to-up" @click="pop_up_on(index)">热水充值</span>
          </td>
        </tr>
      </table>
      <div class="block">
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
    </div>
    <el-dialog
      class="rechagedialog"
      center
      title="热水充值"
      :visible.sync="dialogTableVisible"
    >
      <h3 class="clearfix">
        <img src="../../../assets/images/data_management/money.svg" alt="" />
        <span>你将进行热水充值,请仔细确认账户 相关信息以完成以下内容的填写：</span>
      </h3>
      <div>
        <label><span>*</span>充值金额:</label
        ><input type="text" v-model="money" placeholder="请输入金额" />元
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="affirmhandle()"
          v-loading.fullscreen.lock="fullscreenLoading"
          v-preventReClick="3000"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-drawer title="个人信息" :visible.sync="drawer">
      <div class="img">
        <span>基本信息</span>
        <img
          @click="imgbig"
          :src="
            GetDetails.image ||
            require('../../../assets/images/data_management/userlogo.png')
          "
          alt
        />
      </div>
      <ul class="ct-list" v-if="teachorstudent == 1">
        <li>
          <span class="item-left">账户类型:</span>
          <span class="item-right">学生</span>
        </li>
        <li>
          <span class="item-left">学号:</span>
          <span class="item-right">{{ GetDetails.studentNumber }}</span>
        </li>
        <li>
          <span class="item-left">姓名:</span>
          <span class="item-right">{{ GetDetails.name }}</span>
        </li>
        <li>
          <span class="item-left">身份证</span>
          <span class="item-right">{{ GetDetails.identificationNumber }}</span>
        </li>
        <li>
          <span class="item-left">宿舍信息:</span
          ><span class="item-right">{{ GetDetails.areaInfo || "-" }}</span>
        </li>
        <li>
          <span class="item-left">性别:</span>
          <span class="item-right">{{ GetDetails.gender == 1 ? "男" : "女" }}</span>
        </li>
        <li>
          <span class="item-left">民族:</span>
          <span class="item-right">
            {{
              GetDetails.ethnicCode == 1
                ? "汉族"
                : GetDetails.ethnicCode == 2
                ? "蒙古族"
                : GetDetails.ethnicCode == 3
                ? "回族"
                : GetDetails.ethnicCode == 4
                ? "藏族"
                : GetDetails.ethnicCode == 5
                ? "维吾尔族"
                : GetDetails.ethnicCode == 6
                ? "苗族"
                : GetDetails.ethnicCode == 7
                ? "彝族"
                : GetDetails.ethnicCode == 8
                ? "壮族"
                : GetDetails.ethnicCode == 9
                ? "布依族"
                : GetDetails.ethnicCode == 10
                ? "朝鲜族"
                : GetDetails.ethnicCode == 11
                ? "满族"
                : GetDetails.ethnicCode == 12
                ? "侗族"
                : GetDetails.ethnicCode == 13
                ? "瑶族"
                : GetDetails.ethnicCode == 14
                ? "白族"
                : GetDetails.ethnicCode == 15
                ? "土家族"
                : GetDetails.ethnicCode == 16
                ? "哈尼族"
                : GetDetails.ethnicCode == 17
                ? "哈萨克族"
                : GetDetails.ethnicCode == 18
                ? "傣族"
                : GetDetails.ethnicCode == 19
                ? "黎族"
                : GetDetails.ethnicCode == 20
                ? "傈僳族"
                : GetDetails.ethnicCode == 21
                ? "佤族"
                : GetDetails.ethnicCode == 22
                ? "畲族"
                : GetDetails.ethnicCode == 23
                ? "高山族"
                : GetDetails.ethnicCode == 24
                ? "拉祜族"
                : GetDetails.ethnicCode == 25
                ? "水族"
                : GetDetails.ethnicCode == 26
                ? "东乡族"
                : GetDetails.ethnicCode == 27
                ? "纳西族"
                : GetDetails.ethnicCode == 28
                ? "景颇族"
                : GetDetails.ethnicCode == 29
                ? "柯尔克孜族"
                : GetDetails.ethnicCode == 30
                ? "土族"
                : GetDetails.ethnicCode == 31
                ? "达斡尔族"
                : GetDetails.ethnicCode == 32
                ? "仫佬族"
                : GetDetails.ethnicCode == 33
                ? "羌族"
                : GetDetails.ethnicCode == 34
                ? "布朗族"
                : GetDetails.ethnicCode == 35
                ? "撒拉族"
                : GetDetails.ethnicCode == 36
                ? "毛南族"
                : GetDetails.ethnicCode == 37
                ? "仡佬族"
                : GetDetails.ethnicCode == 38
                ? "锡伯族"
                : GetDetails.ethnicCode == 39
                ? "阿昌族"
                : GetDetails.ethnicCode == 40
                ? "普米族"
                : GetDetails.ethnicCode == 41
                ? "塔吉克族"
                : GetDetails.ethnicCode == 42
                ? "怒族"
                : GetDetails.ethnicCode == 43
                ? "乌孜别克族"
                : GetDetails.ethnicCode == 44
                ? "俄罗斯族"
                : GetDetails.ethnicCode == 45
                ? "鄂温克族"
                : GetDetails.ethnicCode == 46
                ? "德昂族"
                : GetDetails.ethnicCode == 47
                ? "保安族"
                : GetDetails.ethnicCode == 48
                ? "裕固族"
                : GetDetails.ethnicCode == 49
                ? "京族"
                : GetDetails.ethnicCode == 50
                ? "塔塔尔族"
                : GetDetails.ethnicCode == 51
                ? "独龙族"
                : GetDetails.ethnicCode == 52
                ? "鄂伦春族"
                : GetDetails.ethnicCode == 53
                ? "赫哲族"
                : GetDetails.ethnicCode == 54
                ? "门巴族"
                : GetDetails.ethnicCode == 55
                ? "珞巴族"
                : GetDetails.ethnicCode == 56
                ? "基诺族"
                : GetDetails.ethnicCode == 99
                ? "其他"
                : "-"
            }}
          </span>
        </li>
        <li>
          <span class="item-left">院系:</span>
          <span class="item-right">{{ GetDetails.collegeName }}</span>
        </li>
        <li>
          <span class="item-left">专业:</span>
          <span class="item-right">{{ GetDetails.majorName }}</span>
        </li>
        <li>
          <span class="item-left">班级:</span>
          <span class="item-right">{{ GetDetails.className }}</span>
        </li>
        <li>
          <span class="item-left">卡号:</span>
          <span class="item-right" style="color: #55a7ff">
            {{ GetDetails.cardNumber || "-" }}
          </span>
        </li>
        <li>
          <span class="item-left">卡状态:</span>
          <span class="item-right">
            {{
              GetDetails.cardStatus == 1
                ? "未激活"
                : GetDetails.cardStatus == 2
                ? "在用"
                : GetDetails.cardStatus == 3
                ? "挂失"
                : GetDetails.cardStatus == 4
                ? "冻结"
                : "-"
            }}
          </span>
        </li>
        <li>
          <span class="item-left">账户状态:</span>
          <el-switch
            v-model="GetDetails.status"
            :active-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            class="item-right"
            disabled
          ></el-switch>
        </li>
        <li>
          <span class="item-left">政治面貌:</span>
          <span class="item-right">
            {{
              GetDetails.politicalStatusCode == "01"
                ? "中共党员"
                : GetDetails.politicalStatusCode == "02"
                ? "中共预备党员"
                : GetDetails.politicalStatusCode == "03"
                ? "共青团员"
                : GetDetails.politicalStatusCode == "04"
                ? "民革会员"
                : GetDetails.politicalStatusCode == "05"
                ? "民盟盟员"
                : GetDetails.politicalStatusCode == "06"
                ? "民建会员"
                : GetDetails.politicalStatusCode == "07"
                ? "民进会员"
                : GetDetails.politicalStatusCode == "08"
                ? "农工党党员"
                : GetDetails.politicalStatusCode == "09"
                ? "致公党党员"
                : GetDetails.politicalStatusCode == "10"
                ? "九三学社社员"
                : GetDetails.politicalStatusCode == "11"
                ? "台盟盟员"
                : GetDetails.politicalStatusCode == "12"
                ? "无党派民主人士"
                : GetDetails.politicalStatusCode == "13"
                ? "群众"
                : GetDetails.politicalStatusCode == "99"
                ? "其他"
                : "-"
            }}
          </span>
        </li>
        <li>
          <span class="item-left">手机号:</span>
          <span class="item-right">{{ GetDetails.mobile }}</span>
        </li>
        <li>
          <span class="item-left">紧急联系电话:</span>
          <span class="item-right">{{ GetDetails.emergencyContactNumber || "-" }}</span>
        </li>
        <li>
          <span class="item-left">家庭住址:</span>
          <span class="item-right">{{ GetDetails.residentialAddress || "-" }}</span>
        </li>
        <li>
          <span class="item-left">婚姻情况:</span>
          <span class="item-right">
            {{
              GetDetails.marriageCode == 10
                ? "未婚"
                : GetDetails.marriageCode == 20
                ? "已婚"
                : GetDetails.marriageCode == 30
                ? "丧偶"
                : GetDetails.marriageCode == 21
                ? "初婚"
                : GetDetails.marriageCode == 22
                ? "再婚"
                : GetDetails.marriageCode == 23
                ? "复婚"
                : GetDetails.marriageCode == 40
                ? "离婚"
                : "未说明婚姻情况"
            }}
          </span>
        </li>
        <li>
          <span class="item-left">毕业中学:</span>
          <span class="item-right">{{ GetDetails.graduationHighSchool || "-" }}</span>
        </li>
        <li>
          <span class="item-left">是否入住:</span>
          <span class="item-right">账户类型</span>
        </li>
        <!-- <li>
          <span class="item-left">宿舍信息:</span>
          <span class="item-right">
            {{ GetDetails.buildingName }}>{{ GetDetails.floorName }}>{{
              GetDetails.roomName
            }}
          </span>
        </li> -->
        <li>
          <span class="item-left">是临时人员 :</span>
          <span class="item-right">{{ GetDetails.isMortal == 0 ? "否" : "是" }}</span>
        </li>
        <li>
          <span class="item-left" v-if="GetDetails.isMortal == 1"
            >临时人员结束时间 :</span
          >
          <span class="item-right">{{ GetDetails.mortalEndTime }}</span>
        </li>
      </ul>
      <ul class="ct-list" v-if="teachorstudent == 2">
        <li>
          <span>账户类型:</span>
          <span>
            {{
              GetDetails.teacherTypeCode == 10
                ? "普通教职工"
                : GetDetails.teacherTypeCode == 11
                ? "专任教室"
                : GetDetails.teacherTypeCode == 12
                ? "教辅人员"
                : GetDetails.teacherTypeCode == 13
                ? "行政人员"
                : GetDetails.teacherTypeCode == 14
                ? "工勤人员"
                : GetDetails.teacherTypeCode == 15
                ? "技术工人"
                : GetDetails.teacherTypeCode == 19
                ? "其他普通教职工"
                : GetDetails.teacherTypeCode == 20
                ? "科研机构人员"
                : GetDetails.teacherTypeCode == 30
                ? "校办企业职工"
                : GetDetails.teacherTypeCode == 40
                ? "其他附属机构人员"
                : GetDetails.teacherTypeCode == 50
                ? "兼任教师"
                : GetDetails.teacherTypeCode == 51
                ? "来自校外科研、事业单位"
                : GetDetails.teacherTypeCode == 52
                ? "来自校外企业"
                : GetDetails.teacherTypeCode == 53
                ? "国外聘请"
                : GetDetails.teacherTypeCode == 59
                ? "其他兼任教师"
                : GetDetails.teacherTypeCode == 99
                ? "其他教职工"
                : "-"
            }}
          </span>
        </li>
        <li>
          <span>账户状态:</span>
          <el-switch
            v-model="GetDetails.status"
            :active-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            class="item-right"
            disabled
          ></el-switch>
        </li>
        <li>
          <span>
            卡号信息:
            <span>{{ GetDetails.cardNumber || "-" }}</span>
          </span>
        </li>
        <li>
          <span>卡状态:</span>
          <span>
            {{
              GetDetails.cardStatus == 1
                ? "未激活"
                : GetDetails.cardStatus == 2
                ? "在用"
                : GetDetails.cardStatus == 3
                ? "挂失"
                : GetDetails.cardStatus == 4
                ? "冻结"
                : "-"
            }}
          </span>
        </li>
        <li>
          <span>职工号:</span>
          <span>{{ GetDetails.teacherCode }}</span>
        </li>
        <li>
          <span>身份证:</span>
          <span>{{ GetDetails.identificationNumber }}</span>
        </li>
        <li>
          <span class="item-left">宿舍信息:</span
          ><span class="item-right">{{ GetDetails.areaInfo || "-" }}</span>
        </li>
        <li>
          <span>参加工作时间:</span>
          <span>{{ GetDetails.entryDate || "-" }}</span>
        </li>
        <li>
          <span>编制类别:</span>
          <span>
            {{
              GetDetails.coding == 10
                ? "教学类"
                : GetDetails.coding == 20
                ? "行政类"
                : GetDetails.coding == 30
                ? "教辅类"
                : GetDetails.coding == 40
                ? "工勤类"
                : GetDetails.coding == 50
                ? "科研类"
                : GetDetails.coding == 60
                ? "校办企业类"
                : GetDetails.coding == 70
                ? "附设机构类"
                : GetDetails.coding == 99
                ? "其他类"
                : "-"
            }}
          </span>
        </li>
        <li>
          <span>姓名:</span>
          <span>{{ GetDetails.fullName }}</span>
        </li>
        <li>
          <span>手机号:</span>
          <span>{{ GetDetails.mobile }}</span>
        </li>
        <li>
          <span>性别:</span>
          <span>{{ GetDetails.gender == 1 ? "男" : "女" }}</span>
        </li>
        <li>
          <span>积分:</span>
          <span>{{ GetDetails.integral || "-" }}</span>
        </li>
        <li>
          <span>电子邮箱:</span>
          <span>{{ GetDetails.email }}</span>
        </li>
        <li>
          <span>民族:</span>
          <span class="item-right">
            {{
              GetDetails.ethnicCode == 1
                ? "汉族"
                : GetDetails.ethnicCode == 2
                ? "蒙古族"
                : GetDetails.ethnicCode == 3
                ? "回族"
                : GetDetails.ethnicCode == 4
                ? "藏族"
                : GetDetails.ethnicCode == 5
                ? "维吾尔族"
                : GetDetails.ethnicCode == 6
                ? "苗族"
                : GetDetails.ethnicCode == 7
                ? "彝族"
                : GetDetails.ethnicCode == 8
                ? "壮族"
                : GetDetails.ethnicCode == 9
                ? "布依族"
                : GetDetails.ethnicCode == 10
                ? "朝鲜族"
                : GetDetails.ethnicCode == 11
                ? "满族"
                : GetDetails.ethnicCode == 12
                ? "侗族"
                : GetDetails.ethnicCode == 13
                ? "瑶族"
                : GetDetails.ethnicCode == 14
                ? "白族"
                : GetDetails.ethnicCode == 15
                ? "土家族"
                : GetDetails.ethnicCode == 16
                ? "哈尼族"
                : GetDetails.ethnicCode == 17
                ? "哈萨克族"
                : GetDetails.ethnicCode == 18
                ? "傣族"
                : GetDetails.ethnicCode == 19
                ? "黎族"
                : GetDetails.ethnicCode == 20
                ? "傈僳族"
                : GetDetails.ethnicCode == 21
                ? "佤族"
                : GetDetails.ethnicCode == 22
                ? "畲族"
                : GetDetails.ethnicCode == 23
                ? "高山族"
                : GetDetails.ethnicCode == 24
                ? "拉祜族"
                : GetDetails.ethnicCode == 25
                ? "水族"
                : GetDetails.ethnicCode == 26
                ? "东乡族"
                : GetDetails.ethnicCode == 27
                ? "纳西族"
                : GetDetails.ethnicCode == 28
                ? "景颇族"
                : GetDetails.ethnicCode == 29
                ? "柯尔克孜族"
                : GetDetails.ethnicCode == 30
                ? "土族"
                : GetDetails.ethnicCode == 31
                ? "达斡尔族"
                : GetDetails.ethnicCode == 32
                ? "仫佬族"
                : GetDetails.ethnicCode == 33
                ? "羌族"
                : GetDetails.ethnicCode == 34
                ? "布朗族"
                : GetDetails.ethnicCode == 35
                ? "撒拉族"
                : GetDetails.ethnicCode == 36
                ? "毛南族"
                : GetDetails.ethnicCode == 37
                ? "仡佬族"
                : GetDetails.ethnicCode == 38
                ? "锡伯族"
                : GetDetails.ethnicCode == 39
                ? "阿昌族"
                : GetDetails.ethnicCode == 40
                ? "普米族"
                : GetDetails.ethnicCode == 41
                ? "塔吉克族"
                : GetDetails.ethnicCode == 42
                ? "怒族"
                : GetDetails.ethnicCode == 43
                ? "乌孜别克族"
                : GetDetails.ethnicCode == 44
                ? "俄罗斯族"
                : GetDetails.ethnicCode == 45
                ? "鄂温克族"
                : GetDetails.ethnicCode == 46
                ? "德昂族"
                : GetDetails.ethnicCode == 47
                ? "保安族"
                : GetDetails.ethnicCode == 48
                ? "裕固族"
                : GetDetails.ethnicCode == 49
                ? "京族"
                : GetDetails.ethnicCode == 50
                ? "塔塔尔族"
                : GetDetails.ethnicCode == 51
                ? "独龙族"
                : GetDetails.ethnicCode == 52
                ? "鄂伦春族"
                : GetDetails.ethnicCode == 53
                ? "赫哲族"
                : GetDetails.ethnicCode == 54
                ? "门巴族"
                : GetDetails.ethnicCode == 55
                ? "珞巴族"
                : GetDetails.ethnicCode == 56
                ? "基诺族"
                : GetDetails.ethnicCode == 99
                ? "其他"
                : "-"
            }}
          </span>
        </li>
        <li>
          <span>婚姻状况:</span>
          <span>
            {{
              GetDetails.marriageCode == 10
                ? "未婚"
                : GetDetails.marriageCode == 20
                ? "已婚"
                : GetDetails.marriageCode == 30
                ? "丧偶"
                : GetDetails.marriageCode == 21
                ? "初婚"
                : GetDetails.marriageCode == 22
                ? "再婚"
                : GetDetails.marriageCode == 23
                ? "复婚"
                : GetDetails.marriageCode == 40
                ? "离婚"
                : "未说明婚姻情况"
            }}
          </span>
        </li>
        <li>
          <span>出生日期:</span>
          <span>{{ GetDetails.birthday }}</span>
        </li>
        <li>
          <span>户口性质:</span>
          <span>
            {{
              GetDetails.householdCharacterCode == 10
                ? "家庭户口"
                : GetDetails.householdCharacterCode == 11
                ? "非农业家庭户口"
                : GetDetails.householdCharacterCode == 12
                ? "农业家庭户口"
                : GetDetails.householdCharacterCode == 20
                ? "集体户口"
                : GetDetails.householdCharacterCode == 21
                ? "非农业集体户口"
                : GetDetails.householdCharacterCode == 22
                ? "农业集体户口"
                : GetDetails.householdCharacterCode == 30
                ? "非落常住户口"
                : "其他户口"
            }}
          </span>
        </li>
        <li>
          <span>入职日期:</span>
          <span>{{ GetDetails.entryDate || "-" }}</span>
        </li>
        <li>
          <span>户籍地址:</span>
          <span>{{ GetDetails.residentialAddress || "-" }}</span>
        </li>
        <li>
          <span>文化程度:</span>
          <span>
            {{
              GetDetails.educationalCode == "02"
                ? "博士后"
                : GetDetails.educationalCode == "03"
                ? "博士"
                : GetDetails.educationalCode == "04"
                ? "硕士"
                : GetDetails.educationalCode == "10"
                ? "研究生"
                : GetDetails.educationalCode == "11"
                ? "研究生毕业"
                : GetDetails.educationalCode == "19"
                ? "研究生肄业"
                : GetDetails.educationalCode == "20"
                ? "大学本科"
                : GetDetails.educationalCode == "21"
                ? "大学毕业"
                : GetDetails.educationalCode == "28"
                ? "相当大学毕业"
                : GetDetails.educationalCode == "29"
                ? "大学肄业"
                : GetDetails.educationalCode == "30"
                ? "大学专科和专科学校"
                : GetDetails.educationalCode == "31"
                ? "专科毕业"
                : GetDetails.educationalCode == "38"
                ? "想当专科毕业"
                : GetDetails.educationalCode == "39"
                ? "专科肄业"
                : GetDetails.educationalCode == "90"
                ? "其他"
                : "-"
            }}
          </span>
        </li>
      </ul>
    </el-drawer>
    <div @click="closebigimg" class="bigimg" v-if="bigimgshoworhide">
      <img
        :src="
          GetDetails.image ||
          require('../../../assets/images/data_management/userlogo.png')
        "
        alt
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      fullscreenLoading: false,
      bigimgshoworhide: false,
      drawer: false,
      money: "", //充值金额
      PageSizes: [10, 20, 30, 50], //选择页数
      PageSize: 10, //默认每页10条
      CurrentPage: 1, //默认第一页
      Username: null, //按用户查询
      UserCode: null, //按学工号查询
      switchDisabled: true, //switch
      teachorstudent: 0, //0-默认  1-学生 2-老师
      filtrateClick: true,
      TypeSelect: [
        {
          value: "0",
          label: "学生",
        },
        {
          value: "1",
          label: "教师",
        },
      ],
      GetDetails: {}, //详情数据
      TableData: [], //表格数据
      Typevalue: null,
      dialogTableVisible: false,
      hotwaterrecharge: {}, //热水充值信息
    };
  },
  activated() {
    this.TableSearch(); //查询表格数据
  },
  created() {
    this.TableSearch(); //查询表格数据
  },
  methods: {
    handleSizeChange(val) {
      this.PageSize = val;
      this.TableSearch();
    },
    reset() {
      this.Username = null;
      this.UserCode = null;
      this.Typevalue = null;
      this.TableSearch();
    },
    closebigimg() {
      this.bigimgshoworhide = false;
    },
    imgbig() {
      this.bigimgshoworhide = true;
    },
    TableSearch() {
      this.loading = true;
      this.$axios
        .post("/bus/person/getList", {
          current: this.CurrentPage,
          size: this.PageSize,
          personType: this.Typevalue,
          userCode: this.UserCode,
          userName: this.Username,
        })
        .then((res) => {
          this.TableData = res.data.rows;
          this.loading = false;
        });
    },
    // 分页
    handleCurrentChange(val) {
      this.CurrentPage = val;
      this.TableSearch();
    },
    // 弹出框
    affirmhandle() {
      //确认
      let money = this.money;
      if (isNaN(money) || !/^[1-9]+[0-9]*$/.test(money) || money <= 0) {
        this.money = null;
        return this.$message.warning("充值金额只能为整数并且大于0");
      }
      this.fullscreenLoading = true;
      money = parseInt(money);
      this.$axios
        .post("/pay/recharge/account/recharge", {
          username: this.hotwaterrecharge.userCode,
          rechargeType: 9,
          userId: this.hotwaterrecharge.id,
          amount: money,
        })
        .then((res) => {
          this.$message.success(res.data.msg);
          this.money = null;
          this.dialogTableVisible = false;
          this.fullscreenLoading = false;
        });
    },
    pop_up_on(index) {
      this.hotwaterrecharge = this.TableData.records[index];
      this.dialogTableVisible = true;
    },
    particularshandle(index) {
      let id = this.TableData.records[index].id;
      let personType = this.TableData.records[index].personType;
      this.GetDetails = {};
      if (this.TableData.records[index].personType == 0) {
        // 学生   详细信息获取
        this.teachorstudent = 1;
        this.$axios.get("/bus/person/getStudentDetails?id=" + id).then((res) => {
          this.$set(res.data.rows, "personType", personType);
          this.GetDetails = res.data.rows;
          this.drawer = true;
        });
      } else {
        // 老师
        this.$axios.get("/bus/person/getTeacherDetails?id=" + id).then((res) => {
          if (res.data.rows == null) {
            this.$message({
              message: "该用户暂无数据",
            });
            return;
          } else {
            this.teachorstudent = 2;
            this.$set(res.data.rows, "personType", personType);
            this.GetDetails = res.data.rows;
            this.drawer = true;
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rechagedialog {
  ::v-deep .el-dialog {
    width: 516px;
    border-radius: 10px 10px 0 0;
    .el-dialog__header {
      height: 54px;
      padding: 0;
      line-height: 54px;
      background: #2d92ff;
      border-radius: 10px 10px 0 0;
      .el-dialog__title {
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #ffffff;
        letter-spacing: 1px;
      }
      button {
        top: 0;
      }
      .el-dialog__close {
        color: white;
        font-size: 18px;
      }
    }
    .el-dialog__body {
      h3 {
        img {
          width: 44px;
        }
        span {
          display: inline-block;
          vertical-align: middle;
          width: 86%;
          margin-left: 15px;
          line-height: 25px;
          font-size: 16px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #4a4a4a;
          letter-spacing: 1px;
        }
      }
      div {
        margin: 20px 0 0 65px;
        color: #6f6f6f;
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        letter-spacing: 1px;
        label {
          span {
            color: red;
          }
        }
        input {
          margin: 0 5px;
          height: 36px;
          text-indent: 4px;
          border: 1px solid #dbdbdb;
        }
      }
    }
  }
}
.bigimg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2100;
  text-align: center;
  vertical-align: middle;
  img {
    width: 800px;
    height: 800px;
  }
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}
::v-deep .el-drawer {
  width: 800px !important;
  .el-drawer__header {
    padding: 0;
    margin: 0;
    height: 45px;
    line-height: 45px;
    border-bottom: 1px solid #dbdbdb;
    span {
      padding-left: 43px;
      font-size: 16px;
      font-family: $font-scse;
      color: #212d33;
    }
    button {
      margin-right: 10px;
    }
  }
  .el-drawer__body {
    margin-top: 15px;
    padding-left: 43px;
    .img {
      font-size: 16px;
      font-family: $font-scme;
      color: #212d33;
      span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }
      img {
        width: 50px;
        height: 50px;
      }
    }
    .ct-list {
      li {
        margin-top: 20px;
        display: inline-block;
        width: 50%;
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        color: #212d33;
        .blue {
          color: #2d92ff;
        }
        span:first-child {
          margin-right: 5px;
          display: inline-block;
        }
      }
    }
  }
}
.filtrate-heared {
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 0 20px;
  // border: 1px solid red;
  background-color: white;
  .filtrate-title {
    height: 50px;
    font-size: 16px;
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
  .filter {
    .info {
      text-align: center;
      margin: 20px 0 0 0;
      padding-bottom: 15px;
      button {
        width: 80px;
        height: 33px;
        background: #2d92ff;
        border-radius: 5px;
        font-size: 14px;
        font-family: $font-scre;
        font-weight: 400;
        text-align: center;
        padding: 0;
        line-height: 33px;
        margin: 0 10px;
        color: #ffffff;
        border: 0;
      }
    }
  }
  .filtrate-content {
    margin-top: 18px;
    > div {
      margin-right: 307px;
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
        width: 45%;
      }
      .text {
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
  /deep/ .el-button {
    border-radius: 10px;
    margin-bottom: 10px;
  }
  /deep/ .el-button:nth-child(7) {
    margin-left: 680px;
  }
  padding-top: 20px;
  .filtrate-table-content {
    margin-top: 20px;
    width: 100%;
    tr {
      height: 60px;
      background-color: #ffffff;
      padding-top: 20px;
      line-height: 60px;
      &:first-child {
        td {
          font-weight: 600;
        }
      }
      th {
        text-align: center;
        font-size: 14px;
        font-family: $font-scme;
        color: #364147;
      }
      td {
        text-align: center;
        font-size: 14px;
        color: #364147;
        border-bottom: $border;
        &:last-child span:hover {
          color: #59b3fd;
        }
      }

      .particulars,
      .to-up {
        color: #2d92ff;
        display: inline-block;
        cursor: pointer;
      }
      .particulars {
        width: 40px;
        border-right: 2px solid #ebebeb;
        margin-right: 10px;
      }
    }
    tr:nth-child(1) {
      background-color: $tablebg;
    }

    tr:nth-child(n + 2):hover {
      background-color: #f4f4f4;
    }
  }
  /deep/ .el-pagination {
    text-align: center;
    padding: 33px 0;
  }
}
.middle_content {
  padding: 0 19px;
}
</style>

<template>
  <!--collapse 是否水平折叠收起菜单-->
  <el-menu
    :collapse="isCollapse"
    :unique-opened="true"
    :default-active="$route.path"
    class="el-menu-vertical-demo"
  >
    <el-menu-item
      :index="item.path"
      v-for="item in noChildren"
      :key="item.path"
      @click="clickMenu(item)"
    >
      <i :class="item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu :index="item.label" v-for="(item, index) in hasChildren" :key="index">
      <template slot="title">
        <i :class="item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          :index="subItem.path"
          v-for="(subItem, subIndex) in item.children"
          :key="subIndex"
          @click="clickMenu(subItem)"
        >
          <span slot="title">{{ subItem.label }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import domMessage from "../utils/messageOnce";
const messageOnce = new domMessage();
export default {
  computed: {
    //没有子菜单
    noChildren() {
      return this.menu.filter((item) => !item.children);
    },
    //有子菜单 (这样设置会有一个问题 就是有子菜单的 永远会在没有子菜单的下面
    hasChildren() {
      return this.menu.filter((item) => item.children);
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
  },
  data() {
    return {
      menu: [
        {
          path: "/",
          name: "index",
          label: "首页",
          icon: "el-icon-house",
        },
        {
          label: "系统设置",
          icon: "el-icon-setting",
          children: [
            {
              path: "/systemIndex/childen/parameter",
              label: "参数设置",
              name: "parameter",
            },
            {
              path: "/systemIndex/childen/breaker_param",
              label: "断路器参数",
              name: "breaker_param",
            },
          ],
        },
        {
          label: "查询统计",
          icon: "el-icon-tickets",
          children: [
            {
              path: "/query_stats",
              name: "query_stats",
              label: "查询统计详情",
            },
            {
              path: "/query_stats/hot_water",
              label: "热水信息",
              name: "hot_water",
            },
            {
              path: "/query_stats/hotwaterdeposit",
              label: "热水存款",
              name: "hotwaterdeposit",
            },
            {
              path: "/query_stats/cold_water",
              label: "冷水信息",
              name: "cold_water",
            },
            {
              path: "/query_stats/coldwaterdeposit",
              label: "冷水存款",
              name: "coldwaterdeposit",
            },
            {
              path: "/query_stats/ElectricityUse",
              label: "用电信息",
              name: "ydinfo",
            },
            {
              path: "/query_stats/yddeposit",
              label: "用电存款",
              name: "yddeposit",
            },
            {
              path: "/query_stats/logqueries",
              label: "日志查询",
              name: "logqueries",
            },
            {
              path: "/query_stats/alertinfo",
              label: "报警信息",
              name: "alertinfo",
            },
            {
              path: "/query_stats/criminal_records",
              label: "违规记录",
              name: "criminal_records",
            },
          ],
        },
        {
          label: "设备管理",
          icon: "el-icon-coin",
          children: [
            {
              path: "/equipment",
              name: "equipment",
              label: "设备管理详情",
            },
            {
              path: "/equipment/childen/hot_water",
              name: "equipmenthot_water",
              label: "热水表",
            },
            
            {
              path: "/equipment/childen/cold_water",
              name: "equipmentcold_water",
              label: "冷水表",
            },
            {
              path: "/equipment/childen/electricity",
              name: "electricity",
              label: "电表",
            },
            {
              path: "/equipment/childen/twocircuit/twocircuit",
              name: "twocircuit",
              label: "双路电表",
            },
            {
              path: "/equipment/childen/fourwayele",
              name: "fourwayele",
              label: "四路电表",
            },
            {
              path: "/equipment/childen/configuration",
              name: "configuration",
              label: "区域配置",
            },
            {
              path: "/equipment/hotaberrant",
              label: "热水-异常用水",
              name: "hotaberrant",
            },
            {
              path: "/equipment/childen/equipment",
              name: "childenequipment",
              label: "设备通用",
            },
            {
              path: "/equipment/childen/network",
              name: "network",
              label: "网关管理",
            },
            {
              path: "/equipment/childen/breaker/breaker",
              name: "breaker",
              label: "断路器管理",
            },
            {
              path: "/equipment/childen/intelligent/intelligent",
              name: "intelligent",
              label: "智能管控",
            },
            {
              path: "/equipment/childen/firmware/firmware",
              name: "firmware",
              label: "固件升级",
            },
            {
              path: "/equipment/childen/mangement/managementPlan",
              name: "managementPlan",
              label: "管理计划配置",
            },
            {
              path: "/equipment/childen/window",
              name: "window",
              label: "系统通知",
            },
          ],
        },
        {
          icon: "el-icon-data-analysis",
          label: "数据管理",
          children: [
            {
              path: "/data_management",
              name: "data_management",
              label: "数据管理详情",
            },
            {
              path: "/data_management/childen/history",
              label: "卡务历史",
              name: "history",
            },
            {
              path: "/data_management/childen/user_data",
              label: "用户数据",
              name: "user_data",
            },
            {
              path: "/data_management/childen/architecture_data",
              label: "建筑数据",
              name: "architecture_data",
            },
            {
              path: "/data_management/childen/yunwei",
              label: "运维配置",
              name: "yunwei",
            },
          ],
        },
        {
          label: "补贴管理",
          icon: "el-icon-coin",
          children: [
            {
              path: "/subsidy/strategy",
              label: "补贴策略管理",
              name: "strategysubsidy",
            },
            {
              path: "/subsidy/plan",
              label: "补贴计划管理",
              name: "strategyplan",
            },
          ],
        },
        {
          label: "报表管理",
          icon: "el-icon-data-line",
          children: [
            {
              path: "/report/hotwater",
              label: "热水报表",
              name: "hotwaterreport",
            },
            {
              path: "/report/coldwater",
              label: "冷水报表",
              name: "coldwaterreport",
            },
            {
              path: "/report/electricity",
              label: "用电报表",
              name: "electricityreport",
            },
          ],
        },
        {
          icon: "el-icon-help",
          label: "帮助",
          children: [
            {
              path: "/help/columnmanagement",
              label: "栏目管理",
              name: "columnmanagement",
            },
            {
              path: "/help/articlemanagement",
              label: "文章管理",
              name: "articlemanagement",
            },
          ],
        },
        {
          label: "公告管理",
          path: "/announcement",
          name: "announcement",
          icon: "el-icon-document-copy",
        },
        {
          label: "意见反馈",
          path: "/opinion",
          name: "opinion",
          icon: "el-icon-message",
        },
        {
          label: "财务核算",
          icon: "el-icon-money",
          children: [
            {
              path: "/annalcorrect",
              label: "纠正记录",
              name: "annalcorrect",
            },
            {
              path: "/manualrecharge",
              label: "人工充值",
              name: "manualrecharge",
            },
          ],
        },
      ],
    };
  },
  created() {},
  methods: {
    //跳转路由 根据名称跳转
    clickMenu(item) {
      let carry_on = false;
      if (this.$store.state.tab.tabsList.length + 1 >= 12) {
        this.$store.state.tab.tabsList.forEach((vuexdata) => {
          if (vuexdata.name == item.name) {
            carry_on = true;
          }
        });
        if (carry_on) {
          this.$store.commit("selectMenu", item);
          this.$router.push({ name: item.name });
        } else {
          messageOnce.warning({
            message: "已超出最大长度,请先关闭标签,再点击!",
            type: "warning",
          });
        }
        return;
      } else {
        this.$store.commit("selectMenu", item);
        this.$router.push({ name: item.name });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-submenu {
  .el-menu {
    .el-menu-item-group {
      > ul {
        .el-menu-item {
          padding-left: 55px !important;
          background: #020c16;
        }
      }
    }
  }
}
.el-menu {
  border-right: 0;
  background-color: #051527;
  .is-opened {
    /deep/ .el-submenu__title {
      color: white;
      i {
        color: white;
      }
    }
  }
  .el-menu-item:hover {
    color: white;
    i {
      color: white;
    }
  }
  /deep/ .el-menu-item.is-active {
    background: #2d8cf0 !important;
    color: white;
  }
  /deep/ .el-menu-item-group__title {
    padding: 0 !important;
  }
  .el-submenu__title {
    i {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
    }
  }
  .el-menu-item {
    height: 39px;
    line-height: 39px;
    i {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
    }
    > span {
      display: inline-block;
      vertical-align: middle;
    }
  }
  /deep/ .el-submenu__title {
    background-color: #051527;
    height: 39px;
    line-height: 39px;
    &:hover {
      background: #051527;
      color: white;
      i {
        color: white;
      }
    }
    font-size: 14px;
    font-weight: Normal;
    text-align: left;
    color: #a5adb4;
    letter-spacing: 1px;
  }
  li {
    background-color: #051527;
    font-size: 14px;
    font-weight: Normal;
    text-align: left;
    color: #a5adb4;
    letter-spacing: 1px;
  }
}
</style>

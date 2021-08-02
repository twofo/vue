import Vue from "vue";
import VueRouter from "vue-router";
import utils from '@/utils/utils'
import store from "@/store/index";
Vue.use(VueRouter);

const routes = [{
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
    },
    component: () => import("@/views/login/login"),
  },
  {
    path: '/',
    name: '',
    meta: {
      title: '首页'
    },
    component: () => import('@/views/index'),
    children: [{
        path: '/',
        name: 'index',
        meta: {
          title: '首页'
        },
        component: () => import('@/views/index/index'),
      },
      // 系统设置2级
      {
        path: '/systemIndex/childen/charge',
        name: 'charge',
        meta: {
          title: '收费设置'
        },
        component: () => import('@/views/system/childen/charge')
      },
      {
        path: '/systemIndex/childen/parameter',
        name: 'parameter',
        meta: {
          title: '参数设置'
        },
        component: () => import('@/views/system/childen/parameter')
      },
      {
        path: '/systemIndex/childen/breaker_param',
        name: 'breaker_param',
        meta: {
          title: '断路器参数'
        },
        component: () => import('@/views/system/childen/breaker_param')
      },

      {
        path: '/query_stats',
        name: 'query_stats',
        meta: {
          title: '查询统计'
        },
        component: () => import('@/views/query_stats/query_stats')
      },

      /* 查询统计二级 **/
      {
        path: '/query_stats/hot_water',
        name: 'hot_water',
        meta: {
          title: '热水信息',
          alive: true
        },
        component: () => import('@/views/query_stats/hotwater/hotwater')
      },
      {
        path: '/query_stats/hotwaterdeposit',
        name: 'hotwaterdeposit',
        meta: {
          title: '热水存款',
          alive: true
        },
        component: () => import('@/views/query_stats/childern/hot_waterdeposit')
      },
      {
        path: '/query_stats/cold_water',
        name: 'cold_water',
        meta: {
          title: '冷水信息',
          alive: true
        },
        component: () => import('@/views/query_stats/coldwater/coldwater')
      },
      {
        path: '/query_stats/coldwaterdeposit',
        name: 'coldwaterdeposit',
        meta: {
          title: '冷水存款',
          alive: true
        },
        component: () => import('@/views/query_stats/childern/coldwaterdeposit')
      },
      {
        path: '/query_stats/ElectricityUse',
        name: 'ydinfo',
        meta: {
          title: '用电信息',
          alive: true
        },
        component: () => import('@/views/query_stats/childern/ydinfo')
      },
      {
        path: '/query_stats/yddeposit',
        name: 'yddeposit',
        meta: {
          title: '用电存款',
          alive: true
        },
        component: () => import('@/views/query_stats/childern/yddeposit')
      },
      {
        path: '/query_stats/logqueries',
        name: 'logqueries',
        meta: {
          title: '日志查询',
          alive: true
        },
        component: () => import('@/views/query_stats/childern/logqueries')
      },
      {
        path: '/query_stats/alertinfo',
        name: 'alertinfo',
        meta: {
          title: '报警信息',
          alive: true
        },
        component: () => import('@/views/query_stats/childern/alertinfo')
      },
      {
        path: '/query_stats/criminal_records',
        name: 'criminal_records',
        meta: {
          title: '违规记录',
          alive: true
        },
        component: () => import('@/views/query_stats/childern/criminal_records')
      },

      // 隔开
      {
        path: '/equipment',
        name: 'equipment',
        meta: {
          title: '设备管理'
        },
        component: () => import('@/views/equipment/equipment')
      },
      // 设备管理二级
      {
        path: '/equipment/childen/hot_water',
        name: 'equipmenthot_water',
        meta: {
          title: '热水表',
          alive: true
        },
        component: () => import('@/views/equipment/childen/hot_water')
      },
      {
        path: '/equipment/childen/cold_water',
        name: 'equipmentcold_water',
        meta: {
          title: '冷水表',
          alive: true
        },
        component: () => import('@/views/equipment/childen/cold_water')
      },
      {
        path: '/equipment/childen/electricity',
        name: 'electricity',
        meta: {
          title: '电表',
          alive: true
        },
        component: () => import('@/views/equipment/childen/electricity')
      },
      {
        path: '/equipment/childen/fourwayele',
        name: 'fourwayele',
        meta: {
          title: '四路电表',
          alive: true
        },
        component: () => import('@/views/equipment/childen/fourwayele')
      },
      {
        path: '/equipment/childen/breaker/breaker',
        name: 'breaker',
        meta: {
          title: '断路器管理',
          alive: true
        },
        component: () => import('@/views/equipment/childen/breaker/breaker')
      },
      {
        path: '/equipment/childen/twocircuit/twocircuit',
        name: 'twocircuit',
        meta: {
          title: '双路电表',
          alive: true
        },
        component: () => import('@/views/equipment/childen/twocircuit/twocircuit')
      },
      {
        path: '/equipment/childen/breaker/breaker_details',
        name: 'breaker_details',
        meta: {
          title: '断路器管理-状态',
          alive: true
        },
        component: () => import('@/views/equipment/childen/breaker/breaker_details')
      },
      {
        path: '/equipment/childen/intelligent/intelligent',
        name: 'intelligent',
        meta: {
          title: '智能管控',
          alive: true
        },
        component: () => import('@/views/equipment/childen/intelligent/intelligent')
      },
      {
        path: '/equipment/childen/intelligent/intelligent_details',
        name: 'intelligent_details',
        meta: {
          title: '智能管控-状态',
          alive: true
        },
        component: () => import('@/views/equipment/childen/intelligent/intelligent_details')
      },
      {
        path: '/equipment/childen/mangement/managementPlan',
        name: 'managementPlan',
        meta: {
          title: '管理计划配置',
          alive: true
        },
        component: () => import('@/views/equipment/childen/mangement/managementPlan')
      },
      {
        path: '/equipment/childen/firmware/firmware',
        name: 'firmware',
        meta: {
          title: '固件升级',
          alive: true
        },
        component: () => import('@/views/equipment/childen/firmware/firmware')
      },
      {
        path: '/equipment/childen/firmware/firmSublevel ',
        name: 'firmSublevel',
        meta: {
          title: '固件升级',
          alive: true
        },
        component: () => import('@/views/equipment/childen/firmware/firmSublevel')
      },
      {
        path: '/equipment/hotaberrant',
        name: 'hotaberrant',
        meta: {
          title: '热水-异常用水',
          alive: true

        },
        component: () => import('@/views/equipment/childen/hotaberrant')
      },
      {
        path: '/equipment/childen/configuration',
        name: 'configuration',
        meta: {
          title: '区域配置'
        },
        component: () => import('@/views/equipment/childen/configuration')
      },
      {
        path: '/equipment/childen/equipment',
        name: 'childenequipment',
        meta: {
          title: '设备通用',
          alive: true
        },
        component: () => import('@/views/equipment/childen/equipment')
      },
      {
        path: '/equipment/childen/network',
        name: 'network',
        meta: {
          title: '网关管理',
          alive: true
        },
        component: () => import('@/views/equipment/childen/network')
      },
      {
        path: '/equipment/childen/window',
        name: 'window',
        meta: {
          title: '系统通知',
          alive: true
        },
        component: () => import('@/views/equipment/childen/window')
      }, {
        path: '/data_management',
        name: 'data_management',
        meta: {
          title: '数据管理'
        },
        component: () => import('@/views/data_management/data_management')
      },
      //  数据管理二级
      //                卡务历史
      {
        path: '/data_management/childen/history',
        name: 'history',
        meta: {
          title: '卡务历史',
          alive: true
        },
        component: () => import('@/views/data_management/childen/history')
      }, {
        path: '/data_management/childen/yunwei',
        name: 'yunwei',
        meta: {
          title: '运维配置',
          alive: true

        },
        component: () => import('@/views/data_management/childen/yunwei')
      },
      {
        path: '/data_management/childen/user_data',
        name: 'user_data',
        meta: {
          title: '用户数据',
          alive: true
        },
        component: () => import('@/views/data_management/childen/user_data')
      },
      {
        path: '/data_management/childen/architecture_data',
        name: 'architecture_data',
        meta: {
          title: '建筑数据',
          alive: true
        },
        component: () => import('@/views/data_management/childen/architecture_data')
      },
      // 帮助
      {
        path: '/help/columnmanagement',
        name: 'columnmanagement',
        meta: {
          title: '栏目管理',
          alive: true
        },
        component: () => import('@/views/help/childern/columnmanagement')
      },
      {
        path: '/help/articlemanagement',
        name: 'articlemanagement',
        meta: {
          title: '文章管理',
          alive: true
        },
        component: () => import('@/views/help/childern/articlemanagement')
      },
      // 隔开
      {
        path: '/announcement',
        name: 'announcement',
        meta: {
          title: '公告管理',
          alive: true
        },
        component: () => import('@/views/announcement/announcement')
      },
      {
        path: '/add_announcement',
        name: 'add_announcement',
        meta: {
          title: '公告管理-新增'
        },
        component: () => import('@/views/announcement/add_announcement')
      },
      {
        path: '/announcement_details',
        name: 'announcement_details',
        meta: {
          title: '公告详情'
        },
        component: () => import('@/views/announcement/announcement_details')
      },
      {
        path: '/opinion',
        name: 'opinion',
        meta: {
          title: '意见反馈',
          alive: true
        },
        component: () => import('@/views/opinion/opinion')
      },
      //** 财务核算 */
      {
        path: '/annalcorrect',
        name: 'annalcorrect',
        meta: {
          title: '纠正记录',
          alive: true
        },
        component: () => import('@/views/cwaccounting/annalcorrect')
      }, {
        path: '/manualrecharge',
        name: 'manualrecharge',
        meta: {
          title: '人工充值'
        },
        component: () => import('@/views/cwaccounting/manualrecharge')
      },
      /**隔开 */
      {
        path: '/report/hotwater',
        name: 'hotwaterreport',
        meta: {
          title: '热水报表',
          alive: true
        },
        component: () => import('@/views/report/hotwater')
      },
      {
        path: '/report/coldwater',
        name: 'coldwaterreport',
        meta: {
          title: '冷水报表',
          alive: true
        },
        component: () => import('@/views/report/coldwater')
      },
      {
        path: '/report/electricity',
        name: 'electricityreport',
        meta: {
          title: '用电报表',
          alive: true
        },
        component: () => import('@/views/report/electricity')
      },
      // 补贴管理------------------------------
      {
        path: '/subsidy/strategy',
        name: 'strategysubsidy',
        meta: {
          title: '补贴策略管理',
          alive: true
        },
        component: () => import('@/views/subsidy/Strategy')
      }, {
        path: '/subsidy/plan',
        name: 'strategyplan',
        meta: {
          title: '补贴计划管理',
          alive: true
        },
        component: () => import('@/views/subsidy/plan')
      }
    ]
  },

];

const originalPush = VueRouter.prototype.push

// 重写push函数 解决相同路径跳转报错
VueRouter.prototype.push = function push(location) {

   // 这个语句用来解决报错
  // 调用原来的push函数，并捕获异常
  return originalPush.call(this, location).catch(err => err)
};
const router = new VueRouter({
  routes,
  // mode: 'history',
  base: process.env.BASE_URL,
});

router.beforeEach((to, from, next) => {
  // next()
  if (localStorage.getItem("token")) {
    if (to.path === "/login") {
      next({
        path: "/"
      });
    } else {
      next();
      utils.timetest();
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next({
        path: '/login'
      });
    }
  }
});

export default router;
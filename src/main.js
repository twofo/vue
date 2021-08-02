import "babel-polyfill"
import promise from 'es6-promise'
promise.polyfill()
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)
import preventReClick from './utils/debounce' //防抖
Vue.use(preventReClick)
// editor
import Vue2Editor from "vue2-editor";
Vue.use(Vue2Editor);
//elementui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
// iview


//引入css
import "@/styles/reset.css";
import "@/styles/utils.css";
// echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// IE9返回封装的AXIOS
import axios from "@/api/axios"; //引入axios实例
import qs from 'qs';
let axios_ = axios;
if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].includes('9.0')) {
  class Axios {
    constructor(opt = {}) {
      this.init(opt);
      return this.ajax();
    }
    init(opt) {
      this.opt = {
        method: "get",
        headers: {
          "Accept": "*", //接收数据的类型  
          "Content-Type": "application/json;charset=UTF-8", //发送的数据类型  
          // "token": localStorage.getItem('token')
        },
        url: '/',
        baseUrl: "",
        params: undefined,
        data: undefined,
        responseType: 'json',
        timeout: 6000,
        withCredentials: true,
        ...opt,
      };
    }
    post(url = '/', data, opt = {}) {
      opt = {
        method: 'post',
        url,
        data,
        ...opt
      };
      this.init(opt)
      return this.ajax();
    }
    get(url = '/', data, opt = {}) {
      opt = {
        method: 'get',
        url,
        data,
        ...opt
      };
      this.init(opt)
      return this.ajax();
    }
    ajax() {
      // const xhr = new XDomainRequest();
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;
      let {
        headers,
        method,
        timeout,
        withCredentials,
        baseUrl,
        params,
        responseType,
        url,
        data
      } = this.opt;
      return new Promise((resolve, reject) => {
        let url_ = baseUrl && baseUrl + url || url;
        if (params) url_ = url_ + '?' + qs.stringify(params);
        xhr.withCredentials = withCredentials;
        xhr.responseType = responseType;
        xhr.open(method, url_);
        xhr.timeout = timeout;

        Object.keys(headers).forEach(k => xhr.setRequestHeader(k, headers[k]));
        xhr.onload = res => resolve({
          data: responseType === 'json' && typeof xhr.responseText === 'string' && JSON.parse(xhr.responseText) || xhr.responseText,
          headers,
          method,
          url,
          status: res.currentTarget.status,
        })
        if (typeof data === 'object') data = JSON.stringify(data);
        xhr.send(data);
      })
    }



  }

  axios_ = function (opt) {
    return new Axios(...arguments);
  }
  axios_.post = function (url, data, opt) {
    return Axios.prototype.post(...arguments);
  }
  axios_.get = function () {
    return Axios.prototype.get(...arguments);
  }
}
Vue.prototype.$axios = axios_;

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
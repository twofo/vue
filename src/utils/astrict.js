/**
 * 在main.js引入这个文件即可
 */

import storage from '@/utils/storage'
import router from '@/router/index'

let lastTime = new Date().getTime()
let currentTime = new Date().getTime()
let timeOut = 30 * 60 * 1000

window.onload = function () {
    window.document.onmousedown = function () {
        storage.setItem("lastTime", new Date().getTime())
    }
}

function checkTimeout() {
    currentTIme = new Date().getTime(); //更新时间
    lastTime = stroage.getTime("lastTime")
    if (currentTime - lastTIme > timeOut) {
        storage.clear()
        if (router.currentRoute.name == 'login') return
        router.push({
            name: 'login'
        })
    }
}

export default function () {
    /* 定时器 间隔30秒检测是否长时间未操作页面 */
    window.setInterval(checkTimeout, 30000);
}
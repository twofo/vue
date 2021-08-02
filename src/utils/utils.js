/**
 * 对象转URL
 */
export const urlEncode = function (data) {
    var _result = [];
    for (var key in data) {
        var value = data[key];
        if (value.constructor == Array) {
            value.forEach(_value => {
                _result.push(key + "=" + _value);
            });
        } else {
            _result.push(key + '=' + value);
        }
    }
    return _result.join('&');
}
export const timetest = function () {
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += nowYear < 2000 ? 1900 : 0; //
    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();

    function getMonthDays(myMonth) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }
    //获得本季度的开始月份
    function getQuarterStartMonth() {
        var quarterStartMonth = 0;
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    }
    //格式化日期：yyyy-MM-dd
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return myyear + "-" + mymonth + "-" + myweekday;
    }
    //获得本月的开始日期
    localStorage.setItem("thismonthstart", formatDate(new Date(nowYear, nowMonth, 1)));
    //获得当前日期
    localStorage.setItem("thismonth", formatDate(new Date(nowYear, nowMonth, nowDay)));
    //获得上月开始时间
    localStorage.setItem("lastmonthstart", formatDate(new Date(nowYear, lastMonth, 1)));
    //获得上月结束时间
    localStorage.setItem(
        "lastmonthend",
        formatDate(new Date(nowYear, lastMonth, getMonthDays(lastMonth)))
    );
    // 上季度开始
    localStorage.setItem(
        "lastquarterstart",
        formatDate(new Date(nowYear, getQuarterStartMonth() - 3, 1))
    );
    // 上季度结束
    var quarterEndMonth = getQuarterStartMonth() - 3 + 2;
    localStorage.setItem(
        "lastquarterend",
        formatDate(new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth)))
    );

}
export const deepCopy = function (obj) {
    //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    var objClone = Array.isArray(obj) ? [] : {};
    //进行深拷贝的不能为空，并且是对象或者是
    if (obj && typeof obj === "object") {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = deepCopy(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
};
/*
@parmas current 页面栈,非必传,不传的时候默认返回上一页
*/
export const getPage = function (current) {
    if (!current) {
        current = 2;
    }
    var pages = getCurrentPages(),
        length = pages.length,
        page = pages[length - current];
    return page
};
/** 
 * Thu Dec 31 2020 00:00:00 GMT+0800 (中国标准时间)
 */
export const Timestandard = function (val) {
    if (!val) {
        throw new Error('val')
    }
    let date = new Date(val);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    const time = y + '-' + m + '-' + d;
    return time
}
/**
 * 
 * @param {UTC时间转换} val 
 */
export const UtcTime = function (val) {
    let T_pos = val.indexOf('T');
    let Z_pos = val.indexOf('Z');
    let year_month_day = val.substr(0, T_pos);
    let hour_minute_second = val.substr(T_pos + 1, Z_pos - 1)
    return year_month_day + " " + hour_minute_second;
}

/**
 * 2021-01-04T08:31:55.000+0000转成 yy-mm-dd
 */
export const TimeChange = function (val) {
    if (!val) {
        throw new Error('val')
    }
    var d = new Date(val).toJSON();
    return new Date(new Date(d) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

/*
 *时间戳转化日期方法
 *@params val 时间戳,必传;
 *@params type 转化类型,非必传,默认返回年月日加时间,等于ymd时,返回年月日,等于hms返回时间
 */
export const timeToDate = function (val, type) {
    var date = new Date(val)
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
};
//支付统一处理方法
export const payMoney = function (pay_info) {
    return new Promise((resolve, reject) => {
        uni.requestPayment({
            timeStamp: pay_info.timestamp,
            nonceStr: pay_info.nonceStr,
            package: pay_info.package,
            signType: pay_info.signType,
            paySign: pay_info.paySign,
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}
export const hasLogin = function () {
    return new Promise((resolve, reject) => {
        uni.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    uni.getUserInfo({
                        success(res) {
                            console.log('我授权登陆过了')
                            resolve(res);
                        }
                    })
                } else {
                    uni.hideLoading();
                    reject()
                }
            },
            fail(err) {
                reject(err)
            }
        })
    })
}
/**
 * 将时间戳转化为多久以前
 * */
export const changeTime = function (timestamp) {
    let currentUnixTime = Math.round((new Date()).getTime() / 1000);
    let deltaSecond = currentUnixTime - parseInt(timestamp, 10);
    let result;
    if (deltaSecond < 60) {
        result = deltaSecond + '秒前';
    } else if (deltaSecond < 3600) {
        result = Math.floor(deltaSecond / 60) + '分钟前';
    } else if (deltaSecond < 86400) {
        result = Math.floor(deltaSecond / 3600) + '小时前';
    } else {
        result = Math.floor(deltaSecond / 86400) + '天前';
    }
    return result;
}

const professTotal = function (val) {
    if (!val) return 0;
    if (val > 10000) {
        return (val / 10000).toFixed(2) + '万'
    } else {
        return val
    }
}
/**
 * 获取本年本月本日
 */
export const NewDate = function () {
    let date = new Date();
    let Year = date.getFullYear(); //完整年份
    let Month = date.getMonth() + 1; //月份 需+1
    let Day = date.getDate(); //当前日
    console.log(Year, Month, Day)
    // return Year, Month, Day
}

export default {
    UtcTime,
    timetest,
    Timestandard,
    NewDate,
    deepCopy,
    getPage,
    timeToDate,
    payMoney,
    hasLogin,
    urlEncode,
    changeTime,
    professTotal,
    TimeChange
}
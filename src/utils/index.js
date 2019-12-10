/**
 * Created by zhangyao on 18/4/12.
 */
var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'

function padding(s, len) {
  let l = len - (s + '').length
  for (var i = 0; i < l; i++) {
    s = '0' + s
  }
  return s
};

export function parseQueryString(url) {
  var index = -1,
    str = '',
    arr = [],
    length = 0,
    res = {};
  if (url) {
    // if(url.indexOf('?')!=-1){
    // index = url.indexOf('?');
    str = url.substring(index + 1);
    arr = str.split('&');
    length = arr.length;
    for (var i = 0; i < length; i++) {
      res[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }
  } else {
    res = {};
  }
  return res;
}

// 去掉对象中的空字段
export function checkBe(obj) {
  if (!(typeof obj === 'object')) {
    return
  }
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] === undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}
//转为保留小数点后几位的数字并最后几位不为0
//max: 小数点后最大位数
//num： 数字
//minHold： 小数点后最少要保留的位数
export function fixedNum(num, max, minHold) {
  let n = num + '';
  max = max || 6;
  let arr = n.split('.');
  if (arr.length > 1) {
    let decimal = arr[1];
    if (decimal.length > max) {
      n = num.toFixed(max);
      n = n.replace(/0+$/g, '');
      decimal = n.split('.')[1];
      if (!decimal) {
        n = n.split('.')[0];
      }
    }
    if(minHold && decimal.length < minHold) {
      return n.toFixed(minHold);
    }
    return n;
  }
  return n;
}

//时间转换
export function format(date, pattern) {
  pattern = pattern || DEFAULT_PATTERN
  return pattern.replace(SIGN_REGEXP, function ($0) {
    switch ($0.charAt(0)) {
      case 'y':
        return padding(date.getFullYear(), $0.length)
      case 'M':
        return padding(date.getMonth() + 1, $0.length)
      case 'd':
        return padding(date.getDate(), $0.length)
      case 'w':
        return date.getDay() + 1
      case 'h':
        return padding(date.getHours(), $0.length)
      case 'm':
        return padding(date.getMinutes(), $0.length)
      case 's':
        return padding(date.getSeconds(), $0.length)
    }
  })
}

// 时间段
export function time_range(beginTime, endTime) {
  var strb = beginTime.split(":");
  if (strb.length != 2) {
    return false;
  }
  var stre = endTime.split(":");
  if (stre.length != 2) {
    return false;
  }
  var b = new Date();
  var e = new Date();
  var n = new Date();
  b.setHours(strb[0]);
  b.setMinutes(strb[1]);
  e.setHours(stre[0]);
  e.setMinutes(stre[1]);
  if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
    return true;
  } else {
    this.$message({
      type: 'warning',
      message: `当前时间是${n.getHours()}:${n.getMinutes()}，不在推送消息时间范围内，请在早上6点至晚上8点内进行推送！`
    });
    return false;
  }
}

// 时间戳转换
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 标准时间格式化
export function timeformatting(time, format) {
  var t = new Date(time);
  var tf = function (i) {
    return (i < 10 ? '0' : '') + i
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

// 数字转汉字的数字
export function convertCurrency(money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '整';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money == '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* 合并两个对象,给出最后一个优先级。 */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [{
  text: '最近一周',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '最近一个月',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '最近三个月',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
    picker.$emit('pick', [start, end]);
  }
}]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = source[keys].constructor === Array ? [] : {}
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 函数节流
 * @param fn  函数
 * @param delay 多久执行一次
 * @param mustRunDelay 执行时间间隔
 * @return {Function}
 */
export function throttle(fn, delay, mustRunDelay) {
  let timer = null
  let t_start
  return function () {
    let context = this, args = arguments, t_curr = +new Date()
    clearTimeout(timer)
    if (!t_start) {
      t_start = t_curr
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args)
      t_start = t_curr
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
}

// 下是算法实现:属性进行排序
export function countSort(array, keyName) {
  var length = array.length,
    output = new Array(length),
    max,
    min,
    simpleArray = keyName ? array.map(function (v) {
      return v[keyName];
    }) : array; // 如果keyName是存在的，那么就创建一个只有keyValue的简单数组

  // 获取最大最小值
  max = min = simpleArray[0];
  simpleArray.forEach(function (v) {
    v > max && (max = v);
    v < min && (min = v);
  });
  // 获取计数数组的长度
  var k = max - min + 1;
  // 新建并初始化计数数组
  var countArray = new Array(k);
  simpleArray.forEach(function (v) {
    countArray[v - min] = (countArray[v - min] || 0) + 1;
  });
  // 累加计数，存储不同值的初始下标
  countArray.reduce(function (prev, current, i, arr) {
    arr[i] = prev;
    return prev + current;
  }, 0);
  // 从原数组挨个取值(因取的是原数组的相应值，只能通过遍历原数组来实现)
  simpleArray.forEach(function (v, i) {
    var j = countArray[v - min]++;
    output[j] = array[i];
  });
  return output;
}

// 去重
export function unique(arr) {
  var res = [];
  var json = {};
  for (var i = 0; i < arr.length; i++) {
    if (!json[arr[i]]) {
      res.push(arr[i]);
      json[arr[i]] = 1;
    }
  }
  return res;
}

//组合
export function ArrarGroup(arr) {
  let list = []
  let nameArr = []
  arr.map((item, index) => {
    if (nameArr.indexOf(item.attrName) === -1) {
      nameArr.push(item.attrName);
      list.push({
        name: item.name,
        attrName: item.attrName,
      })
    } else {
      for (let i in list) {
        index = i
        if (list[i].attrName == item.attrName && item.name) {
          if (list[i].name == item.name || list[i].name.indexOf(item.name) != -1) {

          } else {
            list[i].name += `,${item.name}`;
            break
          }
          list[i][list[i].attrName] = list[i].name
        }
      }
    }
  })
  return list
}

// 递归根据id查找对应的label值  console.log(getBinaryTreeVal([1, 12, 121, 1211, 12111], data));
export function getBinaryTreeVal(arr, data) {
  let treeVal = [];
  let flage = 0;
  if (data && data.length > 0) {
    for (const item of data) {
      if (item.id === arr[flage]) {
        treeVal.push(item.label);
        flage++;
      } else if (item.children && item.children.length > 0) {
        (function fn() {
          let obj = arguments[0];
          for (const item of obj) {
            if (item.id === arr[flage]) {
              flage++;
              treeVal.push(item.label);
              // debugger;
              if (item.children && item.children.length > 0) {
                return fn(item.children, arr);
              }
            }
          }
        })(item.children, flage)
      }
    }
  }
  return treeVal;
}

export function quickSort1(arr) {
  if (arr.length <= 1) {
    return arr
  }
  var pIndex = Math.floor(arr.length / 2);
  var p = arr.splice(pIndex, 1)[0];
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < p) {
      left.push(arr[i]);
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(p, quickSort(right))
}

// getDate(dates) dates为数字类型，0代表今日,-1代表昨日，1代表明日，返回yyyy-mm-dd格式字符串，dates不传默认代表今日。

export function getDate(dates) {
  var dd = new Date();
  var n = dates || 0;
  dd.setDate(dd.getDate() + n);
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;
  var d = dd.getDate();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  var day = y + "-" + m + "-" + d;
  return day;
}

// getMonth(type,months)  // type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，months为数字类型，不传或0代表本月，-1代表上月，1代表下月
// getMonth("s",1)  // 得到下月第一天的yyyy-mm-dd格式日期
// getMonth("e",1)  // 得到下月最后一天的yyyy-mm-dd格式日期

export function getMonth(type, months) {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  if (Math.abs(months) > 12) {
    months = months % 12;
  }
  if (months != 0) {
    if (month + months > 12) {
      year++;
      month = (month + months) % 12;
    } else if (month + months < 1) {
      year--;
      month = 12 + month + months;
    } else {
      month = month + months;
    }
  }
  month = month < 10 ? "0" + month : month;
  var date = d.getDate();
  var firstday = year + "-" + month + "-" + "01";
  var lastday = "";
  if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
    lastday = year + "-" + month + "-" + 31;
  } else if (month == "02") {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
      lastday = year + "-" + month + "-" + 29;
    } else {
      lastday = year + "-" + month + "-" + 28;
    }
  } else {
    lastday = year + "-" + month + "-" + 30;
  }
  var day = "";
  if (type == "s") {
    day = firstday;
  } else {
    day = lastday;
  }
  return day;
}

// getYear(type,dates)  //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表今年，-1代表去年，1代表明年
// getYear("s",1)  //得到明年第一天的yyyy-mm-dd格式日期
// getYear("e",1)  //得到明年最后一天的yyyy-mm-dd格式日期
export function getYear(type, dates) {
  var dd = new Date();
  var n = dates || 0;
  var year = dd.getFullYear() + Number(n);
  if (type == "s") {
    var day = year + "-01-01";
  }
  if (type == "e") {
    var day = year + "-12-31";
  }
  if (!type) {
    var day = year + "-01-01/" + year + "-12-31";
  }
  return day;
}

/**
 * js数组排序 支持数字和字符串
 * @param params
 * @param arrObj   obj     必填  数组对象
 * @param keyName  string  必填  要排序的属性名称
 * @param type     int     选填  默认type:0 正顺  type:1反顺
 */
export function arrItemSort(arrObj, keyName, type) {
  //这里如果 直接等于arrObj，相当于只是对对象的引用，改变排序会同时影响原有对象的排序，而通过arrObj.slice(0)，
  //表示把对象复制给另一个对象，两者间互不影响
  var tempArrObj = arrObj.slice(0);
  var compare = function (keyName, type) {
    return function (obj1, obj2) {
      var val1 = obj1[keyName];
      var val2 = obj2[keyName];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      //如果值为空的，放在最后
      if (val1 == null && val2 == null) {
        return 0;
      } else if (val1 == null && val2 != null) {
        return (type == 1 ? -1 : 1);
      } else if (val2 == null && val1 != null) {
        return (type == 1 ? 1 : -1);
      }
      //排序
      if (val1 < val2) {
        return (type == 1 ? 1 : -1);
      } else if (val1 > val2) {
        return (type == 1 ? -1 : 1);
      } else {
        return 0;
      }
    }
  }
  return tempArrObj.sort(compare(keyName, type));
}
/**
 * 根据数组对象里的关联字段生成对应数组
 * @param  {[array]} list     [数据源]
 * @param  {[number/string]} parentId [关联的字段值]
 * @param  {[string]} sortBy   [匹配关联的字段]
 * @param  {[string]} backStr  [需要返回的字段]
 * @param  {[array]} arr      [返回结果的数组]
 */
export function sortByParentId(list, parentId, sortBy, backStr, arr) {
  for (var i = 0; i < list.length; i++) {
    if (list[i][sortBy] === parentId && list[i][backStr]) {
        return arr.unshift(list[i][backStr]);
    }
  }
}
/**
 * [根据数组元素间的关系组成字符串]
 * @param  {[array]} list     [数据源]
 * @param  {[number/string]} parentId [关联的字段值]
 * @param  {[string]} sortBy   [匹配关联的字段]
 * @param  {[string]} backStr  [需要返回的字段]
 * @param  {[string]} formatter [值之间的连接符]
 * @return {[string]}           [组成的字符串]
 */
export function arrToString(list, parentId, sortBy, backStr, formatter) {
    if (!sortBy) {
        sortBy = 'id';
    }
    if (!formatter) {
        formatter = '>';
    }
    if (!backStr) {
        backStr = 'name';
    }
    let arr = [];
    sortByParentId(list, parentId, sortBy, backStr, arr);

    let str = '';
    if (arr.length) {
        str = arr.join(formatter);
    }
    return str;
}
/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
** xuanfeng 2014-08-28
** isReset a+6位数字
*/
// 生成3-32位随机串：randomWord(true, 3, 32)
// 生成43位随机串：randomWord(false, 43)

export function randomPassword(randomFlag, min, max, isReset) {
  var str = "",
    range = min,
    numArr = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    strArr = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ],
    arr = [].concat(numArr, strArr);
  if (isReset === true) {
    // let current = strArr[Math.floor(Math.random() * strArr.length)];
    // str = current;
    str = 'a';
    for (var i = 0; i < 6; i++) {
      let s = numArr[Math.floor(Math.random() * numArr.length)]
      str += s;
    }
    return str;
  }
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    var pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  if (!(/\d/g.test(str))) {
    let inx = Math.floor(Math.random() * str.length);
    let current = numArr[inx];
    if (inx === 0) {
      str = current + str.substring(inx + 1);
    } else {
      str = str.substring(0, inx - 1) + current + str.substring(inx);
    }
  }
  if (!(/[a-zA-Z]/g.test(str))) {
    let inx = Math.floor(Math.random() * str.length);
    let current = strArr[inx];
    if (inx === 0) {
      str = current + str.substring(inx + 1);
    } else {
      str = str.substring(0, inx - 1) + current + str.substring(inx);
    }
  }
  return str;
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function openExternal(path) {
  window.open(path, '_blank');
}

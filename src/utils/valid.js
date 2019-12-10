//obj.type;//验证类型
//obj.novalidval;//是否验证是否有值 默认false，验证值 为true,不验证
//obj.min;//验证长度的最小值
//obj.max;//验证长度的最大值
//obj.fun;//默认为false 没有传入的验证函数，为true时则有验证函数传入

export class Valid {

  constructor() {

  }

  trigger = () => {
    return 'blur';
  }

  isNull = (obj, validObj, trigger) => { //验证是否有值
    let validArr = [];
    let item = {
      required: obj && obj.novalidval ? false : true,
      message: '请输入',
      trigger: trigger ? trigger : this.trigger()
    };
    if (obj && obj.type) {
      item.type = obj.type;
    }
    validArr.push(item);
    if (obj && obj.fun) {
      validArr.push(validObj);
    }
    return validArr;
  }

  isNullChoice = (obj, validObj) => { //验证是否有值 提示为 请选择
    let validArr = [];
    let item = {
      required: obj && obj.novalidval ? false : true,
      message: '请选择',
      trigger: 'change'
    };
    if (obj && obj.type) {
      item.type = obj.type;
    }
    validArr.push(item);
    if (obj && obj.fun) {
      validArr.push(validObj);
    }
    return validArr;
  }

  ispassword = (rule, value, callback, obj) => {//验证是否包含数字和字母以及特殊字符
    if (value.length < obj.min || value.length > obj.max) {
      callback(new Error('请输入6位-16位密码'));
    } else {
      if (!/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,}$/.test(value)) {
        callback(new Error('请输入包含数字、字母、特殊字符的密码'));
      } else {
        callback();
      }
    }
  }

  isLength = (obj) => { //验证值的长度
    let validArr = [];
    if (obj && !obj.novalidval) {
      validArr = JSON.parse(JSON.stringify(this.isNull()));
    }
    if (obj && obj.min && obj.max) {
      validArr.push({
        min: obj.min,
        max: obj.max,
        message: `长度在${obj.min}到${obj.max}个字符`,
        trigger: this.trigger()
      });
    }
    return validArr;
  }

  number = (validObj, obj) => {//验证是否为数字
    let validArr = JSON.parse(JSON.stringify(this.isNull()));
    if (obj && !obj.novalidval) {
      validArr = [];
    }
    validArr.push(validObj);
    return validArr;
  }

  isNumber = (rule, value, callback, obj, otherFun, existPromiss, row) => {//验证是否为数字
    if (!Number(value) && Number(value) !== 0) {
      callback(new Error('请输入数字'));
    } else {
      if (obj && obj.fun) {
        otherFun(rule, value, callback, obj, existPromiss, row)
      } else if (obj && obj.price) {
        value = value.toString();
        let price = value.split('.');
        if (price.length === 2) {
          let float = price[1];
          if (float.length > 2) {
            callback(new Error('请输入保留两位小数'));
          }
        }
        callback();
      } else {
        callback();
      }
    }
  }

  phone = (validObj, obj) => {//验证手机号
    let validArr = JSON.parse(JSON.stringify(this.isNull()));
    if (obj && obj.novalidval === true) {
      validArr = [];
    }
    validArr.push(validObj);
    return validArr;
  }

  isPhone = (rule, value, callback, obj, existPromiss, row) => {//验证手机号
    this.isNumber(rule, value, callback, obj, this.textPhone, existPromiss, row);
  }

  textPhone = (rule, value, callback, obj, existPromiss, row) => {
    if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(value)) {
      callback(new Error('请输入正确的手机号码'));
    } else {
      if (obj.fun) {
        this.isExist(rule, value, callback, existPromiss, row);
      } else {
        callback();
      }
    }
  }

  isPhones = (rule, value, callback) => {//验证手机号
    if (!(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).test(value)) {
      callback(new Error('请输入正确的手机号!'))
    } else {
      callback()
    }
  }

  isExist = (rule, value, callback, existPromiss, row) => {//验证是否已存在
    (async () => {
      try {
        let form = row.ruleForm2;
        if (form[row.idKey] && value === form[row.valKey]) {//如果是修改，并且值未变，不用调接口验证
          callback();
          return
        }
        let queryPo = {};
        queryPo[row.valKey] = value;
        if (row.param && row.param.length) {
          row.param.forEach((item) => {
            queryPo[item] = row.ruleForm2[item];
          })
        }
        let res = await existPromiss(queryPo);
        if (res.data instanceof Array) {
          if (res.data.length) {
            callback(new Error('已存在,请重新输入'));
          } else {
            callback();
          }
        } else {
          if (res.data) {
            callback(new Error('已存在,请重新输入'));
          } else {
            callback();
          }
        }
      } catch (error) {
        console.log(error);
      }
    })(this);
  }

}

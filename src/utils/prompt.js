import Vue from 'vue'
import {MessageBox, Message} from 'element-ui'

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

export class Prompt {

  constructor() {

  }

  infoTip() {
    Message({
      type: 'info',
      message: '已取消'
    });
  }

  saveText() {
    return '确认提交吗, 是否继续?';
  }

  failTip(msg) {
    Message({
      type: 'error',
      message: msg || '操作失败'
    });
  }
  saveTip(msg) {
    Message({
      type: 'success',
      message: msg || '保存成功!'
    });
  }

  delText(msg) {
    let message = typeof(msg) === 'string' ? msg : '禁用该数据';
    return `此操作将${message}, 是否继续?`;
  }

  delTip() {
    Message({
      type: 'success',
      message: '操作成功!'
    });
  }

  verificationTip() {
    Message({
      type: 'success',
      message: '核销成功!'
    });
  }

  save(handleSave, row, handleCancel, cancelRow) {
    MessageBox.confirm(this.saveText(), '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      handleSave(row);
    }).catch(() => {
      if (!handleCancel) {
        this.infoTip();
      } else {
        handleCancel(cancelRow);
      }
    });
  }

  del(handleDel, row, handleCancel, msg) {
    MessageBox.confirm(this.delText(msg), '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      handleDel(row);
    }).catch(() => {
      this.infoTip();
      if (typeof(handleCancel) === 'function') {
        handleCancel(row);
      }
    });
  }

  verification(handleVerification, row) {
    MessageBox.confirm(this.saveText(), '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      handleVerification(row);
    }).catch(() => {
      this.infoTip();
    });
  }

  imgtype(file) {
    const isType = file.name.split('.')[1];
    const isImg = isType === 'jpeg' || isType === 'png'

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImg) {
      Message.error('上传头像图片只能是 JPG 格式!');
      return isImg && isLt2M;
    }
    if (!isLt2M) {
      Message.error('上传头像图片大小不能超过 2MB!');
    }
    return isImg && isLt2M;
  }

}

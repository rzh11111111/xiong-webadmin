<!--如果tableBool为true更新表格，否则更新树-->
<template>
  <el-row>
    <el-col :span="24">
      <el-dialog :title="dialog.titleText" :close-on-click-modal="true" :width="dialog.width?dialog.width:'750px'"
                 :visible.sync="saveFormVisible" :fullscreen="dialog.fullscreen || false" :top="dialog.top || '15vh'"
                 :append-to-body="dialog.appendToBody===true" @close="reset('ruleForm2')">
        <table class="form-table" ref="tableForm" v-if="dialog.isTable">
          <slot name="dialog"></slot>
        </table>
        <el-form :model="dialog.ruleForm2" :inline="dialog.inline || false" :rules="dialog.rules2" ref="ruleForm2" size="small" :label-width="dialog.labelWidth?dialog.labelWidth:'140px'"
                 class="demo-ruleForm" v-else>
          <slot name="dialog"></slot>
        </el-form>

        <div slot="footer" class="dialog-footer" v-if="!dialog.readBool">
          <el-button size="small" v-if="!dialog.cancelBtnBool" @click="handleCancel('ruleForm2')">取消</el-button>
          <slot name="dialogBtn"></slot>
          <el-button type="primary" size="small" v-if="!dialog.btnBool" @click="submitForm" :loading="saveLoading">提交
          </el-button>
          <el-button type="primary" size="small" v-if="dialog.closeBtnBool" @click="handleClose">关闭</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
  import bus from '../../utils/bus.js'

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {}
        }
      },
      table: {
        type: Object,
        default() {
          return {}
        }
      },
      getDataList: {
        type: Function
      },
      customValidate: {
        type: Function
      }
    },
    data() {
      return {
        saveFormVisible: false,
        saveLoading: false,
        formData: {}
      }
    },
    methods: {
      submitForm() { //新增
        if (this.dialog.isTable) {
          if (this.tableFormValidate(this.dialog.ruleForm2)) {
            if (typeof(this.customValidate) === 'function') {
              if (this.customValidate()) {
                this.$plug.prompt.save(this.emitSave);
              }
            } else {
              this.$plug.prompt.save(this.emitSave);
            }
          }
          return false;
        }
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            if (typeof(this.customValidate) === 'function') {
              if (this.customValidate()) {
                this.$plug.prompt.save(this.emitSave);
              } else {
                return false;
              }
            } else {
              this.$plug.prompt.save(this.emitSave);
            }
          } else {
            return false;
          }
        });
      },
      emitSave() {

        this.$emit("submit", this.dialog.ruleForm2, this.savePrompt, this.dialog.type);
      },
      async savePrompt(savePromiss, param, otherPromiss) {
        this.saveLoading = true;
        try {
          let res = await savePromiss(param);
          if (res.status === 1) {
            this.saveFormVisible = false;
            this.$plug.prompt.saveTip();
            if (this.dialog.tableBool) {
              bus.$emit("loadDialogData");
            } else {
              this.getDataList()
            }
            if (otherPromiss) {
              otherPromiss(res);
            }
          }
        } catch (error) {
          console.log(error);
        }
        this.saveLoading = false;
      },
      reset(formName) { //重置表单
        if (!this.dialog.isTable) {
          this.$refs[formName] && this.$refs[formName].clearValidate();
        }
        this.dialog.ruleForm2 = Object.assign({}, this.formData);
        this.$emit('reset');
      },
      handleCancel(formName) {
        if (!this.dialog.isTable) {
          this.$refs[formName] && this.$refs[formName].clearValidate();
        }
        this.dialog.ruleForm2 = Object.assign({}, this.formData);
        this.dialog.saveFormVisible = false;
      },
      handleClose() {
        this.dialog.saveFormVisible = false;
        this.$emit('close');
      },
      tableFormValidate(row) {
        let trs = this.$refs.tableForm.children;
        for (let i = 0; i < trs.length; i++) {
          let item = trs[i].children;

          for (var j = 0; j < item.length; j++) {
            if (j % 2 === 0 && item[j].children && item[j].children.length) {
              let dataset = item[j].children[0].dataset;
              if (dataset && dataset.name) {
                let subname = dataset.subname || 'id';
                let message = dataset.message || '请输入' + dataset.name;
                if (!row[dataset.name] && row[dataset.name] !== 0) {
                  this.$plug.prompt.failTip(message);
                  return false;
                } else if(row[dataset.name] instanceof Array) {
                  if (!row[dataset.name].length) {
                    this.$plug.prompt.failTip(message);
                    return false;
                  }
                } else if(typeof(row[dataset.name]) === 'object' && !dataset.isdate && !row[dataset.name][subname] && row[dataset.name][subname] !== 0) {
                  this.$plug.prompt.failTip(message);
                  return false;
                }
              }
            }
          }

        }
        return true;
      }
    },
    watch: {
      'dialog.saveFormVisible': function (val) {
        if (val != this.saveFormVisible) {
          this.saveFormVisible = val;
        }
      },
      saveFormVisible: function (val) {
        if (val != this.dialog.saveFormVisible) {
          this.dialog.saveFormVisible = val;
        }
      },
      'dialog.validBool'(val) {
        this.$refs.ruleForm2.validateField(this.dialog.validType);
      },
      'dialog.imgBool'(val) {
        this.dialog.imgArr.forEach((item) => {
          if (!this.dialog.ruleForm2.id) {
            this.$refs.ruleForm2.validateField(item);
          }
        })
      }
    },
    created() {
      if (this.dialog.ruleForm2) {
        this.formData = JSON.parse(JSON.stringify(this.dialog.ruleForm2));
      }
    },
    mounted() {
      this.$set(this.dialog, 'saveFormVisible', false);
    }
  }
</script>
<style>
  .el-dialog /deep/ .el-dialog__body {
    display: flex;
    justify-content: center;
    padding-top: 15px;
  }
</style>

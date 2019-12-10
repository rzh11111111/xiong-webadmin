<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="form-title">
        <span>邀请注册</span>
        <el-button type="primary" @click="dialog.readBool = !dialog.readBool" size="mini">{{dialog.readBool ? '编辑内容' : '取消编辑'}}</el-button>
      </div>
      <table class="form-table">
        <tr>
          <td><i class="red-star" data-message="请输入活动名称" data-name="name">*</i>活动名称：</td>
          <td>
            <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
          </td>
          <td>最多邀请多少人：</td>
          <td>
            <el-input v-model.number="dialog.ruleForm2.maxNum" placeholder="空即不限制" :disabled="dialog.readBool"></el-input>
          </td>
        </tr>
        <tr>
          <td><i class="red-star" data-message="请输入活动展示标题" data-name="title">*</i>活动展示标题：</td>
          <td>
            <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
          </td>

          <td><i class="red-star" data-message="请选择是否启用" data-name="isEnable">*</i>是否启用：</td>
          <td>
            <el-radio-group v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">停用</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td>活动开启时间：</td>
          <td>
            <el-date-picker
              v-model="dialog.ruleForm2.activeTime"
              type="date"
              placeholder="请选择开启时间" :disabled="dialog.readBool">
            </el-date-picker>
          </td>
          <td>活动关闭时间：</td>
          <td>
            <el-date-picker
              v-model="dialog.ruleForm2.invalidTime"
              type="date"
              placeholder="请选择关闭时间" :disabled="dialog.readBool">
            </el-date-picker>
          </td>
        </tr>
        <tr>
          <td>活动规则：</td>
          <td>
            <el-input type="textarea" v-model="dialog.ruleForm2.rule" :disabled="dialog.readBool"></el-input>
          </td>
          <td>活动引导语：</td>
          <td>
            <el-input type="textarea" v-model="dialog.ruleForm2.content" :disabled="dialog.readBool"></el-input>
          </td>
        </tr>
        <tr>
          <td>活动展示图标：</td>
          <td>
             <selector key="icoUrl" :dialog="subDialogIco" @submit="handleSelectIco" :disabled="dialog.readBool"></selector>
          </td>
          <td>活动展示图：</td>
          <td>
            <selector key="bgUrl" :dialog="subDialogPic" @submit="handleSelectPic" :disabled="dialog.readBool"></selector>
          </td>
        </tr>
        <tr>
          <td>备注：</td>
          <td colspan="3">
            <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
          </td>
        </tr>
      </table>
      <div v-if="!dialog.readBool" style="margin: 20px 0;text-align: center;">
        <el-button type="primary" @click="handleSave">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {format} from "@/utils";
  import bus from '@/utils/bus.js'
  import selector from '@/components/Selector/filesEntry';

  export default {

    data() {
      let awardType = ['积分'];
      return {
        searchBool: true,
        format,
        awardType,
        dialog: {
          readBool: true,
          ruleForm2: {
            name: '',
            title: '',
            icoUrl: '',
            bgUrl: '',
            bgUrlObj: {},
            icoUrlObj: {},
            activeTime: null,
            invalidTime: null,
            isEnable: 0,
            maxNum: null
          }
        },
        subDialogIco: {
          innerVisible: false,
          addBool: true,
          type: 5,
          tableType: 'radio',
          files: {}
        },
        subDialogPic: {
          innerVisible: false,
          addBool: true,
          type: 5,
          tableType: 'radio',
          files: {}
        }
      }
    },
    components: {
      selector
    },
    methods: {
      async getSource() {
        let res = await this.Api.getInviteRegActivity();
        if (res.data) {
          this.dialog.ruleForm2 = Object.assign({}, res.data);
          this.subDialogPic.files = {url: res.data.bgUrl};
          this.subDialogIco.files = {url: res.data.icoUrl};
        }

      },
      async handleSave() {
        this.$plug.prompt.save(this.handleSureSave);
      },
      async handleSureSave() {
        let params = {};
        Object.assign(params, this.dialog.ruleForm2);
        if (this.dialog.ruleForm2.activeTime) {
          params.activeTime = format(new Date(this.dialog.ruleForm2.activeTime), 'yyyy-MM-dd');
        }
        if (this.dialog.ruleForm2.invalidTime) {
          params.invalidTime = format(new Date(this.dialog.ruleForm2.invalidTime), 'yyyy-MM-dd');
        }
        if (this.subDialogPic.files && this.subDialogPic.files.url) {
          params.bgUrl = this.subDialogPic.files.url;
        }
        if (this.subDialogIco.files && this.subDialogIco.files.url) {
          params.icoUrl = this.subDialogIco.files.url;
        }
        if (!params.maxNum) {
          params.maxNum = null;
        }
        let res = await this.Api.saveInviteRegActivity(params);
        if (res.status === 1) {
          this.$plug.prompt.saveTip('操作成功');
          this.dialog.readBool = true;
        };
      },
      handleSelectIco(row) {
        this.dialog.ruleForm2.icoUrlObj = Object.assign({}, this.dialog.ruleForm2.icoUrlObj, row);
        this.dialog.ruleForm2.icoUrl = row.url;
      },
      handleSelectPic(row) {
        this.dialog.ruleForm2.bgUrlObj = Object.assign({}, this.dialog.ruleForm2.bgUrlObj, row);
        this.dialog.ruleForm2.bgUrl = row.url;
      },
    },
    computed: {},
    async mounted() {
      this.getSource();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.form-table{
  background-color: #fff;
  td{
    &:nth-child(even){
      width: 462px;
    }
  }
}
.form-title{
  display: flex;
  padding-top: 20px;
  padding-bottom: 10px;
  span{
    flex: 1;
  }
}

</style>

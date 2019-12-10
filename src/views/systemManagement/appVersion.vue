<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog" @add="handleAdd">
        <template slot="arrDel">
          <el-button size="mini" @click="handleEditIOS">编辑IOS版本信息</el-button>
        </template>
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :dialog="dialog" :pagination="pagination">
        <template slot="appType" slot-scope="{ index,row }">
          <span v-for="s in appType" :key="s.value" v-if="s.value == row.appType">{{s.label}}</span>
        </template>
        <template slot="activeTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.activeTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <span v-for="s in status" :key="s.value" v-if="s.value == row.status">
            <el-tag :type="s.type">{{s.label}}</el-tag>
          </span>
        </template>
        <template slot="isUpdate" slot-scope="{ index,row }">
            <el-tag :type="row.isUpdate == 1? 'success' : 'danger'">{{!!row.isUpdate ? '是' : '否'}}</el-tag>
        </template>
        <template slot="appDownUrl" slot-scope="{ index,row }">
          <a :href="row.appDownUrl" target="_blank">{{row.appDownUrl}}</a>
        </template>
        <template slot="isTip" slot-scope="{ index,row }">
          <el-tag :type="row.isTip == '1'? 'success' : 'danger'">{{row.isTip == '1' ? '是' : '否'}}</el-tag>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
        <template slot="table" slot-scope="{index, row}">
          <el-button type="text"
                     size="mini"
                     v-if="row.status == 1"
                     @click.stop="handleRelease(index, row)">发布
          </el-button>
          <el-button type="text"
                     size="mini"
                     v-if="row.status == 1"
                     @click.stop="handleEdit(index, row)">编辑
          </el-button>
          <el-button type="text"
                     size="mini"
                     @click.stop="handleDetail(index, row)">详情
          </el-button>

          <!-- <el-button
            v-if="row.status != 2"
            type="text"
            size="mini"
            @click.stop="handleDel(index, row)">删除
          </el-button> -->
        </template>
      </table-sub>
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请选择APP类型" data-name="appType">*</i>APP类型：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.appType" :disabled="!!dialog.ruleForm2.id || dialog.readBool">
                <el-option
                  v-for="type in appType"
                  :key="type.value"
                  :value="type.value"
                  :label="type.label"></el-option>
              </el-select>
            </td>
            <td>发布状态：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.status" disabled>
                <el-option
                  v-for="type in status"
                  :key="type.value"
                  :value="type.value"
                  :label="type.label"></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>APP版本号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.appVersion" :disabled="true"></el-input>
            </td>
            <td><i class="red-star" data-message="请选择生效时间" data-name="appType">*</i>生效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.activeTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择生效时间" :disabled="dialog.readBool">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入APP平台版本" data-name="appPlatformVersion">*</i>APP平台版本：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.appPlatformVersion" :disabled="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入APP下载地址" data-name="appDownUrl">*</i>APP下载地址：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.appDownUrl" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择是否强制更新" data-name="isUpdate">*</i>强制更新：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isUpdate" :disabled="dialog.readBool">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </td>
            <td><i class="red-star" data-message="请选择是否显示版本更新提示" data-name="isTip">*</i>版本更新提示：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isTip" :disabled="dialog.readBool">
                <el-radio label="0">不显示</el-radio>
                <el-radio label="1">显示</el-radio>
              </el-radio-group>
            </td>
           <!--  <td>基础配置内容：</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.baseConfigContent" :disabled="dialog.readBool"></el-input>
            </td> -->
          </tr>
          <tr>
            <td>版本说明：</td>
            <td colspan="3">
              <el-input type="textarea" v-model="dialog.ruleForm2.info" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
        </template>
      </dialog-sub>
      <dialog-sub :dialog="IOSDialog" :getDataList="getDataList" :customValidate="customValidate" @submit="handleSaveChange">
        <template slot="dialog">
          <tr>
            <td colspan="2">
              {{IOSDialog.ruleForm2.description}}
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择是否展示红包" data-name="val">*</i>是否展示红包：</td>
            <td>
              <el-radio-group v-model="IOSDialog.ruleForm2.val">
                <el-radio label="false">否</el-radio>
                <el-radio label="true">是</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请填写IOS发布的版本" data-name="unit">*</i>IOS发布的版本：</td>
            <td>
              <el-input v-model="IOSDialog.ruleForm2.unit"></el-input>
              <p class="tips-box">格式必须为x.x.x</p>
            </td>
          </tr>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {format} from "@/utils";
  import bus from '@/utils/bus.js'

  export default {

    data() {
      let appType = [{
            value: 1,
            label: 'IOS'
          }, {
            value: 2,
            label: 'Android'
          }];
      let status = [{
          value: 1,
          type: '',
          label: '待发布'
        }, {
          value: 2,
          type: 'success',
          label: '发布中'
        }, {
          value: 3,
          type: 'info',
          label: '已失效'
        }];
      let versionValidate = (rule, value, callback) => {
        if (!Number.isInteger(value * 1)) {
          callback(new Error('请输入数字值'));
        } else {
          callback();
        }
      }
      return {
        searchBool: false,
        format,
        appType,
        status,
        quickSearch: {
          isShow: true,
          hideTime: true,
          group: [{
            value: 'appType',
            label: '',
            selected: '',
            list: appType
          }, {
            value: 'status',
            label: '',
            selected: '',
            list: status
          }]
        },
        searchObj: [{
          value: 'appVersion',
          label: null,
          name: 'APP版本号',
          isText: true
        }],

        table: {
          detailBool: false,
          editBool: true,
          delBool: true,
          arrDelBool: true,
          columns: [{
            value: 'appType',
            label: 'APP类型',
            slotBool: true,
            width: '100'
          }, {
            value: 'appPlatformVersion',
            label: '平台版本号',
            width: '140'
          }, {
            value: 'appVersion',
            label: 'APP版本号',
            width: '150'
          }, {
            value: 'status',
            label: '发布状态',
            slotBool: true,
            width: '100'
          }, {
            value: 'activeTime',
            label: '生效时间',
            slotBool: true,
            width: '140'
          }, {
            value: 'info',
            label: '版本说明',
            width: '140'
          }, {
            value: 'isUpdate',
            label: '强制更新',
            slotBool: true,
            width: '140'
          }, {
            value: 'isTip',
            label: '显示版本更新提示',
            slotBool: true,
            width: '140'
          }, {
            value: 'createTime',
            label: '创建时间',
            slotBool: true,
            width: '140'
          }, {
            value: 'createBy',
            label: '创建人',
            width: '140'
          }, {
            value: 'updateTime',
            label: '更新时间',
            slotBool: true,
            width: '140'
          }, {
            value: 'updateBy',
            label: '更新人',
            width: '140'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          width: '800px',
          btnText: '创建版本',
          titleText: '创建版本',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          readBool: false,
          ruleForm2: {
            appType: 1,
            appDownUrl: '',
            isTip: '1',
            isUpdate: 0,
            appPlatformVersion: '',
            status: 1,
            // baseConfigContent: '',
            activeTime: '',
            info: ''
          },
          rules2: {
            appType: this.$plug.valid.isNull(),
            isUpdate: this.$plug.valid.isNull(),
          	appDownUrl: this.$plug.valid.isNull(),
          	// baseConfigContent: this.$plug.valid.isNull(),
          	activeTime: this.$plug.valid.isNull(),
            appPlatformVersion: this.$plug.valid.isNull()
          }
        },
        currentVersionInfo: {},
        IOSDialog: {
          width: '400px',
          btnText: '编辑IOS当前版本信息',
          titleText: '编辑IOS当前版本信息',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          readBool: false,
          ruleForm2: {
            val: 'false',
            unit: ''
          },
          rules2: {
            unit: this.$plug.valid.isNull(),
            val: this.$plug.valid.isNull()
          }
        }
      }
    },
    components: {
      DialogSub,
      SearchSub,
      TableSub
    },
    methods: {
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        if (queryPo.appVersion) {
          if (!(/^\d+$/.test(queryPo.appVersion))) {
            this.$plug.prompt.failTip('APP版本号格式错误');
            return false ;
          }
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected || item.selected === 0) {
              quick[item.value] = item.selected;
            }
          })
        }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          }
        }, queryPo, quick)
        return await this.Api.getAppVersions(para);
      },
      handleDetail(index, row) {
      	this.dialog.titleText = '查看版本详情';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
        this.dialog.ruleForm2 = Object.assign({}, row);
        this.dialog.ruleForm2.activeTime = new Date(row.activeTime);
      },
      handleEdit(index, row) {
      	this.dialog.titleText = '编辑版本';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.ruleForm2 = Object.assign({}, row);
        this.dialog.ruleForm2.activeTime = new Date(row.activeTime);
      },
      handleRelease(index, row) {
        this.$plug.prompt.del(this.sureRelease, row, '', '发布版本');
      },
      async sureRelease(row) {
        let params = Object.assign({}, row);
        // params.activeTime = format(new Date(row.activeTime), 'yyyy-MM-dd hh:mm:ss');
        let res = await this.Api.releaseAppVersion(params);
        if (res.status === 1) {
          bus.$emit("loadDialogData");
        }
      },
      async handleSave(row, savePrompt, type) {
        if (!row.activeTime) {
          return this.$message({
            type: 'error',
            message: '请选择生效时间'
          })
        }
        let params = Object.assign({}, row);
        if (!row.id) {
          savePrompt(this.Api.addAppVersion, params);
        } else {
          savePrompt(this.Api.editAppVersion, params);
        }
      },
      handleDel(index, row) { //删除
        this.$plug.prompt.del(this.delPrompt, row);
      },
      delPrompt(row) {
        this.$refs.tableSub.delPrompt(this.Api.delAppVersion, {
          "id": row.id
        });
      },
      // async handleDel(index, row) {
      //   try {
      //     let res = await this.Api.delAppVersion({id: row.id});
      //     if (res.status != 1) return;
      //     this.$plug.prompt.delTip();
      //     this.getDataList();
      //   } catch (error) {
      //     console.log(error);
      //   }
      // },
      handleAdd() {
        this.dialog.saveFormVisible = true;
        this.dialog.titleText = '创建版本';
        this.dialog.readBool = false;
      },
      async handleEditIOS() {
        this.IOSDialog.saveFormVisible = true;
        if (!this.currentVersionInfo || !this.currentVersionInfo.id) {
          let res = await this.Api.getIOSAppVersion();
          if (res.status === 1 && res.data) {
            this.currentVersionInfo = res.data;
          }
        }
        this.IOSDialog.ruleForm2 = Object.assign({}, this.currentVersionInfo);
      },
      customValidate() {
        let unit = this.IOSDialog.ruleForm2.unit;
        if (unit) {
          let arr = unit.split('.');
          if (!arr || arr.length !== 3) {
            this.$plug.prompt.failTip('版本格式填写错误');
            return false;
          }
          return true;
        }
        return false;
      },
      async handleSaveChange() {
        let res = await this.Api.changeIOSAppVersion(Object.assign({}, this.IOSDialog.ruleForm2));
        if (res.status === 1) {
          this.IOSDialog.saveFormVisible = false;
          this.currentVersionInfo = Object.assign({}, this.IOSDialog.ruleForm2);
          this.$plug.prompt.saveTip('编辑成功');
        } else {
          this.IOSDialog.ruleForm2 = Object.assign({}, this.currentVersionInfo);
        }
      }
    },
    computed: {},
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .text-overflow{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
  }
</style>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :pagination="pagination" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd">
       <!--  <template slot="arrDel">
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="arrDel">批量删除
          </el-button>
        </template> -->
      </search-sub>
      <table-sub ref="tableSub" @del="handleDel" @submit="handleSave" @detail="handleDetail"
                 @edit="handleEdit"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
      </table-sub>
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入对象名称" data-name="entityName">*</i>对象名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.entityName" :disabled="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入表名" data-name="tableName">*</i>表名：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.tableName" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入字段数据值" data-name="fieldValue">*</i>字段数据值：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.fieldValue" :disabled="dialog.readBool"></el-input>
            </td>
            <td>字段描述：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.description" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入字段数据说明" data-name="fieldName">*</i>字段数据说明：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.fieldName" :disabled="dialog.readBool"></el-input>
            </td>
            <td>序号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>备注：</td>
            <td colspan="3">
              <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <!-- <el-form-item label="对象名称" prop="entityName">
            <el-input v-model="dialog.ruleForm2.entityName" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="表名" prop="tableName">
            <el-input v-model="dialog.ruleForm2.tableName" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="字段描述">
            <el-input v-model="dialog.ruleForm2.description" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="字段数据值" prop="fieldValue">
            <el-input v-model="dialog.ruleForm2.fieldValue" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="字段数据说明" prop="fieldName">
            <el-input v-model="dialog.ruleForm2.fieldName" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
          </el-form-item> -->
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {format} from "../../utils";

  export default {
    data() {
      return {
        searchBool: false,
        format,
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        searchObj: [{
        	value: 'keyWord',
        	label: '',
        	name: '关键字',
        	isText: true,
          placeholder: '对象名称/表名/字段数据说明/描述'
        }, {
          isTimeRange: true,
          value: "time1",
          label: "",
          name: "创建时间"
        }],

        table: {
          width: '200px',
          emitEditBool: true,
          emitDetailBool: true,
          detailBool: true,
          arrDelBool: true,
          columns: [{
            value: 'entityName',
            label: '对象名称',
            width: '100'
          }, {
            value: 'tableName',
            label: '表名',
            width: '150'
          }, {
            value: 'fieldValue',
            label: '字段数据值',
            width: '150'
          }, {
            value: 'fieldName',
            label: '字段数据说明',
            width: '140'
          }, {
            value: 'description',
            label: '描述',
            width: '100'
          }, {
            value: 'sortNo',
            label: '序号',
            width: '140'
          }, {
            value: 'createBy',
            label: '创建人',
            width: '140'
          }, {
            value: 'createTime',
            label: '创建时间',
            slotBool: true,
            width: '140'
          }, {
            value: 'updateBy',
            label: '更新人',
            width: '140'
          }, {
            value: 'updateTime',
            label: '更新时间',
            slotBool: true,
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
          btnText: '创建字典',
          titleText: '创建字典',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          ruleForm2: {
            entityName: '',
          	fieldValue: '',
          	tableName: '',
          	fieldName: '',
          	description: '',
          	sortNo: '',
          	remarks: '',
          },
          // rules2: {
          //   entityName: this.$plug.valid.isNull(),
          // 	fieldValue: this.$plug.valid.isNull(),
          // 	tableName: this.$plug.valid.isNull(),
          // 	fieldName: this.$plug.valid.isNull(),
          // }
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

        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo.time1) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter
        }

        return await this.Api.getDict(para);
      },
      handleDetail(params) {
      	this.dialog.titleText = '查看字典';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
        this.getInfo(params.id);
      },
      handleEdit(params) {
      	this.dialog.titleText = '编辑字典';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.getInfo(params.id);
      },
      async getInfo(id) {
        let res = await this.Api.getDictDetail({id});
        if (res.status == 1) {
          this.dialog.ruleForm2 = res.data;
        }
      },
      async handleSave(row, savePrompt, type) {
        if (row.sortNo || row.sortNo === '0') {
          row.sortNo = parseInt(row.sortNo);
        }
        if (!row.id) {
          savePrompt(this.Api.addDict, row);
        } else {
          savePrompt(this.Api.editDict, row);
        }
      },
      // async handleBatchOperate(row,handleBatchOperate) {
      // 	delPrompt(this.Api.deleteDict,row);
      // },
      handleDel(row, delPrompt) { //删除
        delPrompt(this.Api.deleteDict, {
          "id": row.id
        });
      },
      handleAdd() {
        this.dialog.saveFormVisible = true;
        this.dialog.titleText = '创建字典';
        this.dialog.readBool = false;
      }
    },
    computed: {},
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
  }
</style>

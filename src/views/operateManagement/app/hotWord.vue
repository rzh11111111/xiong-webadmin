<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :pagination="pagination" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
        @add="handleAdd">
      </search-sub>
      <table-sub ref="tableSub" @del="handleDel" @submit="handleSave" @detail="handleDetail"
                 @edit="handleEdit"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-switch
            @change="handleShowStatusChange(index, row)"
            :active-value="0"
            :inactive-value="1"
            v-model="row.isEnable">
          </el-switch>
        </template>
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
            <td><i class="red-star" data-message="请输入热词名称" data-name="name">*</i>热词名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入排序序号" data-name="sortNo">*</i>排序序号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择是否启用" data-name="name">*</i>是否启用：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
                <el-radio border :label="0">启用</el-radio>
                <el-radio border :label="1">禁用</el-radio>
              </el-radio-group>
            </td>
            <td>备注：</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>

          <!-- <el-form-item label="热词名称" prop="name">
            <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sortNo">
            <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-radio-group v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
              <el-radio border :label="0">启用</el-radio>
              <el-radio border :label="1">禁用</el-radio>
            </el-radio-group>
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
  import {format} from "@/utils";
  import bus from "@/utils/bus";

  export default {
    data() {
      return {
        searchBool: false,
        format,
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'isEnable',
            lable: '',
            selected: '',
            list: [{
              value: 0,
              label: '启用'
            }, {
              value: 1,
              label: '停用'
            }]
          }]
        },
        searchObj: [{
        	value: 'keyWord',
        	label: '',
        	name: '热词名称',
        	isText: true
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '创建时间段'
        }],

        table: {
          width: '200px',
          emitEditBool: true,
          emitDetailBool: true,
          detailBool: true,
          arrDelBool: true,
          columns: [{
            value: 'sortNo',
            label: '序号',
            width: '100'
          }, {
            value: 'name',
            label: '热词名称',
            width: '150'
          }, {
            value: 'isEnable',
            label: '是否启用',
            width: '150',
            slotBool: true
          }, {
            value: 'remarks',
            label: '备注',
            width: '100'
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
          btnText: '创建热词',
          titleText: '创建热词',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          isTable: true,
          tableBool: true,
          ruleForm2: {
            name: '',
          	sortNo: null,
          	isEnable: 0
          },
          rules2: {
            name: [
              { required: true, message: '请输入热词名称', trigger: 'blur' },
              { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
            ],
            sortNo: this.$plug.valid.isNull()
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

        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
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
          },
          searchParameter
        }, queryPo, quick);

        return await this.Api.getHotWord(para);
      },
      handleDetail(params) {
      	this.dialog.titleText = '查看热词';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
        this.dialog.ruleForm2 = Object.assign({}, params);
        // this.getInfo(params.id);
      },
      handleEdit(params) {
      	this.dialog.titleText = '编辑热词';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.ruleForm2 = Object.assign({}, params);
        // this.getInfo(params.id);
      },
      // async getInfo(id) {
      //   let res = await this.Api.getHotWordInfo({id});
      //   if (res.status == 1) {
      //     this.dialog.ruleForm2 = res.data;
      //   }
      // },
      async handleSave(row, savePrompt, type) {
        if (row.sortNo || row.sortNo === '0') {
          row.sortNo = parseInt(row.sortNo);
        }
        if (!row.id) {
          savePrompt(this.Api.addHotWord, row);
        } else {
          savePrompt(this.Api.editHotWord, row);
        }
      },
      // async handleBatchOperate(row,handleBatchOperate) {
      // 	delPrompt(this.Api.deleteDict,row);
      // },
      handleDel(row, delPrompt) { //删除
        delPrompt(this.Api.delHotWord, {
          "id": row.id
        });
      },
      handleAdd() {
        this.dialog.saveFormVisible = true;
        this.dialog.titleText = '创建热词';
        this.dialog.readBool = false;
      },
      handleShowStatusChange(index, row) {
        row.isEnable = row.isEnable === 1 ? 0 : 1;
        this.$plug.prompt.del(() => {
          this.Api.enableHotWord({
            id: row.id
          }).then(res => {
            if (res.status == 1) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
              bus.$emit('loadDialogData');
            }
          });
        }, row, null, row.isEnable === 1 ? '启用该数据' : '禁用该数据');
      },
    },
    computed: {},
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>

</style>

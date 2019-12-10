<template>
   <el-dialog
       width="1100px"
       maxHeight="600px"
       :title="dialog.titleText"
       :close-on-click-modal="true"
       :append-to-body="dialog.appendToBody===true"
       :visible.sync="dialog.innerVisible"
       append-to-body>
       <div class="check-module-box">
         <div class="filter-container">
           <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :searchBool="searchBool" :pagination="pagination" :table="table" :dialog="dialog" :getDataList="getDataList" v-if="!searchBool">
           </search-sub>
           <selector-table :key="tablekey" ref="tableSub" :getDataList="getDataList" :disabledCheck="disabledPeople" :dialog="dialog" :table="table" @select="handleDelArr" :pagination="pagination">
              <template :slot="item.value" slot-scope="{index,row }" v-for="(item,index) in table.columns"
                       v-if="item.slotBool">
               <slot :name="item.value" :index="index" :row="row"></slot>
             </template>
             <template slot="isEnable" slot-scope="{ index,row }">
               <span>{{row.isEnable === 1 ? '停用' : '启用'}}</span>
             </template>
             <template slot="createTime" slot-scope="{ index,row }">
               <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
             </template>
             <template slot="isEntry" slot-scope="{ index,row }">
               <el-tag :type="row.isEntry==1?'danger':'success'">{{row.isEntry==1?'离职':'在职'}}
               </el-tag :type="row.isEntry == 1 ? 'danger' : 'success'">
             </template>
           </selector-table>
         </div>
       </div>
       <div slot="footer" class="dialog-footer">
         <el-button size="small" @click="cancelSave">取消</el-button>
         <el-button type="primary" size="small" @click="emitSave">确定</el-button>
       </div>
   </el-dialog>
</template>
<script>
  import SelectorTable from '@/components/SelectorTable'
  import SearchSub from '@/components/SearchSub'
  import {format} from "@/utils";

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {
            ruleForm2: null
          }
        }
      },
      disabledPeople: {
        type: Array,
        default() {
          return []
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        searchBool: false,
        tablekey: new Date().valueOf(),
        quickSearch: {
          isShow: true,
          group: [{
            value: 'isEnable',
            label: '',
            selected: '',
            list: [{
              value: 0,
              label: '启用'
            }, {
              value: 1,
              label: '停用'
            }]
          }, {
            value: 'isEntry',
            label: '',
            selected: '',
            list: [{
              value: 0,
              label: '在职'
            }, {
              value: 1,
              label: '离职'
            }]
          }]
        },
         searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '账号/编码/姓名'
        }, {
          isDate: true,
          value: 'starTime',
          label: '',
          name: '创建开始时间'
        }, {
          isDate: true,
          value: 'endTime',
          label: '',
          name: '创建结束时间'
        }],
        optionsRole: [],
        optionsDep: [],
        resetPassword: false,
        table: {
          width: '150px',
          arrBool: true,
          reserveSelection: true,
          tableDataList: [],
          emitEditBool: true,
          multipleSelection: [],
          singleSelection: {},
          type: 'radio',
          btn: true,
          isDialogSelect: true,
          columns: [{
            value: 'username',
            label: '用户名',
            width: '100'
          }, {
            value: 'nickname',
            label: '昵称',
            width: '100'
          }, {
            value: 'phone',
            label: '手机号码',
            width: '100'
          }, {
            value: 'name',
            label: '姓名',
            width: '100'
          }, {
            value: 'isEnable',
            label: '是否启用',
            width: '120',
            slotBool: true
          }, {
            value: 'createTime',
            label: '创建时间',
            width: '140'
          }, {
            value: 'isEntry',
            label: '是否在职',
            slotBool: true,
            width: '100'
          }, {
            value: 'remarks',
            label: '备注',
            width: '100'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        }
      }
    },
    watch: {
      'dialog.tableType': function(type) {
        if (type && type != this.table.type) {
          this.table.type = type;
        }
      },
      'dialog.innerVisible': function (val) {
        if (val != this.innerVisible) {
          this.innerVisible = val;
        }
      },
      innerVisible: function (val) {
        if (val != this.dialog.innerVisible) {
          this.dialog.innerVisible = val;
        }
      }
    },
    methods: {
      cancelSave() {
        this.dialog.innerVisible = false;
      },
      emitSave() {
        if (this.table.type === 'selection') {
          if (!this.table.multipleSelection || !this.table.multipleSelection.length) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          let names = this.table.multipleSelection.map(item => {
            return item.name;
          })
          // this.dialog.names = names.join(',');
          this.$emit("submit", this.table.multipleSelection, 1);
        } else {
          if (!this.table.singleSelection || !this.table.singleSelection.id) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          // this.dialog.names = this.table.singleSelection.name;
          this.$emit("submit", this.table.singleSelection, 1);
        }
        this.dialog.innerVisible = false;
      },
      async handleDelArr(row) {
        if (this.table.type === 'selection') {
          this.table.multipleSelection = Object.assign([], this.dialog.ruleForm2, row);
        } else {
          this.table.singleSelection = Object.assign({}, this.dialog.ruleForm2, row);
        }
        // this.$emit("submit", row, 1);
      },
      // 获取列表
      async getDataList() {
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = Object.assign({}, queryPo);
        if (queryPo && queryPo.starTime) {
          searchParameter.starTime = queryPo.starTime;
        }
        if (queryPo && queryPo.endTime) {
          searchParameter.endTime = queryPo.endTime;
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
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          searchParameter
        }, quick);
        let resData = await this.Api.getStaffList(para)
        resData.data.list.map(item => {
          if (item.roles == null || tem.deps == null) {
            item.roles = [];
            item.deps = [];
          }
        })
        return resData
      },
      clearSelect() {
        this.dialog.ruleForm2 = {};
        this.dialog.names = '';
        this.table.multipleSelection = [];
        this.table.multipleSelected = [];
        this.table.singleSelection = {};
        this.table.singleSelected = '';
        // this.tablekey = new Date().valueOf();
        this.$refs.tableSub && this.$refs.tableSub.clearSelection();
      }
    },
    async mounted() {
      if (this.table.type === 'selection') {
        this.dialog.ruleForm2 = [];
        this.table.multipleSelection = Object.assign([], this.dialog.ruleForm2);
      } else {
        this.dialog.ruleForm2 = {};
        this.table.singleSelection = Object.assign({}, this.dialog.ruleForm2);
      }
    },
    created() {
      if (this.table.type != this.dialog.tableType) {
        this.table.type = this.dialog.tableType;
      }
    },
    components: {
      SearchSub,
      SelectorTable
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.check-module-box{
  width: 100%;
}
</style>

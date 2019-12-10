<template>
 <div>
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
           <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :searchBool="searchBool" :table="table" :pagination="pagination" :dialog="dialog" :getDataList="getDataList" v-if="!searchBool">
           </search-sub>
           <selector-table :key="tablekey" ref="tableSub" :getDataList="getDataList" :disabledCheck="disabledPeople" :dialog="dialog" :table="table" @select="handleDelArr" :pagination="pagination">
              <template slot="isEnable" slot-scope="{ index,row }">
                <el-tag :type="row.isEnable == '1' ? 'danger' : 'success'">
                  {{row.isEnable == '1' ? '停用' : '启用'}}
                </el-tag>
              </template>
              <template v-for="item in fixedData" :slot="item.value" slot-scope="{index,row }">
                <span v-for="status in item.list" :key="status.label" v-if="status.value === row[item.value]">
                  {{status.label}}
                </span>
              </template>
           </selector-table>
         </div>
       </div>
       <div slot="footer" class="dialog-footer">
         <el-button size="small" @click="cancelSave">取消</el-button>
         <el-button type="primary" size="small" @click="emitSave">确定</el-button>
       </div>
   </el-dialog>
 </div>
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
              value: 'status',
              label: '',
              selected: null,
              list: [{
                label: '正常',
                value: 1
              }, {
                label: '关闭',
                value: 2
              }, {
                label: '冻结',
                value: 3
              }]
            },{
              value: 'isEnable',
              label: '',
              selected: null,
              list: [{
                label: '停用',
                value: 1
              }, {
                label: '启用',
                value: 0
              }]
            }]
          },
          fixedData: [
            {
              label: "状态",
              value: "status",
              list: [
                {
                  label: "正常",
                  value: 1
                },
                {
                  label: "关闭",
                  value: 2
                }, {
                  label: "冻结",
                  value: 3
                }
              ]
            }
          ],
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
          type: '',
          btn: true,
          isDialogSelect: true,
          columns: [
            {
              value: 'code',
              label: '用户编码',
              width: '100'
            },
            {
              value: 'username',
              label: '登录名',
              width: '100'
            },
            {
              value: 'username',
              label: '姓名',
              width: '60'
            }, {
              value: 'isEnable',
              label: '启用状态',
              width: '110',
              slotBool: true
            }, {
              value: 'status',
              label: '状态',
              width: '110',
              slotBool: true
            }, {
              value: 'createTime',
              label: '创建时间',
              width: '140'
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
        if (type) {
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
          this.dialog.names = names.join(',');
          this.$emit("submit", this.table.multipleSelection, 4);
        } else {
          if (!this.table.singleSelection || !this.table.singleSelection.id) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          this.dialog.names = this.table.singleSelection.name;
          this.$emit("submit", this.table.singleSelection, 4);
        }
        this.dialog.innerVisible = false;
      },
      async handleDelArr(row) {
        if (this.table.type === 'selection') {
          this.table.multipleSelection = Object.assign([], this.dialog.ruleForm2, row);
        } else {
          this.table.singleSelection = Object.assign({}, this.dialog.ruleForm2, row);
        }
        // this.$emit("submit", row, 3);
      },
      // 获取列表
      async getDataList() {
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            quick[item.value] = item.selected;
          })
        }
        let para = Object.assign({}, queryPo, quick, {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          searchParameter,
          accountType: 3
        })
        let resData = await this.Api.getProvincesList(para);
        resData.data.list.map(item => {
          if (item.provinces == null) {
            item.provinces = { id: "" };
          }
          if(item.managerCooperation != null) {
            item.provinces = item.managerRegionBoss.code + '/' + item.managerRegionBoss.name;
          }else {
            item.provinces = "无";
          }

          if (item.partner == null) {
            item.partner = { id: "" };
          }
          if(item.managerCooperation != null) {
            item.partner = item.managerCooperation.code + '/' + item.managerCooperation.name;
          }else {
            item.partner = "无";
          }

          if (item.popedom == null) {
            item.popedom = { id: "" };
          }
          if(item.managerDutyAreaConfigs != null) {
            item.popedom = item.managerDutyAreaConfigs.code + '/' + item.managerDutyAreaConfigs.name;
          }else {
            item.popedom = "无";
          }
        });
        return resData;
      },
      clearSelect() {
        this.dialog.ruleForm2 = {};
        this.dialog.names = '';
        this.table.multipleSelection = [];
        this.table.singleSelection = {};
        this.tablekey = new Date().valueOf();
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
      this.table.type = this.dialog.tableType;
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

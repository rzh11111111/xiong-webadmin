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
          <selector-table ref="tableSub" :getDataList="getDataList" :disabledCheck="disabledCheck" :dialog="dialog" :table="table" @select="handleDelArr" :pagination="pagination">
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
  import SelectorTable from '@/components/SelectorTable';
  import SearchSub from '@/components/SearchSub';
  import {format} from "@/utils";

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {}
        }
      },
      tableType: {
        type: String,
        default() {
          return '';
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false;
        }
      },
      disabledCheck: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        format: format,
        searchBool: true,
        table: {
         btn: true,
        reserveSelection: true,
         addBool: true,
         width: '200px',
         editBool: true,
         emitEditBool: true,
         type: 'radio',
         arrDel: true,
         columns: [{
             value: 'name',
             label: '分组名称'
           }, {
             value: 'sortNo',
             label: '序号'
           }, {
             value: 'remarks',
             label: '备注'
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
      'tableType': function(type) {
        this.table.type = type;
      }
    },
    components: {
      SearchSub,
      SelectorTable
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
          let names = this.table.multipleSelection.forEach(item => {
            return item.name;
          })
          // this.dialog.names = names.join(',');
          this.$emit("submit", this.table.multipleSelection, 7);
        } else {
          if (!this.table.singleSelection || !this.table.singleSelection.id) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          // this.dialog.names = this.table.singleSelection.name;
          this.$emit("submit", this.table.singleSelection, 7);
        }
        this.dialog.innerVisible = false;
      },
      async handleDelArr(row) {
        if (this.table.type === 'selection') {
          this.table.multipleSelection = Object.assign([], this.dialog.ruleForm2, row);
        } else {
          this.table.singleSelection = Object.assign({}, this.dialog.ruleForm2, row);
        }
        // this.$emit("submit", row, 7);
      },
      async getDataList() {
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          }
        }
        let resData = await this.Api.getGoodsGroup(para);
        return resData;
      },
      selectInit() {
        if (this.tableType === 'selection') {
          if (this.dialog.ruleForm2 && this.dialog.ruleForm2.length) {
            this.dialog.ruleForm2.map(item => {
              if (item.id) {
                this.table.multipleSelection.push(item.id);
                this.table.multipleSelected.push(item);
              }
            })
          } else {
            this.table.multipleSelection = [];
            this.table.multipleSelected = [];
          }
        } else if(this.tableType == 'radio') {
          if (this.dialog.ruleForm2 && this.dialog.ruleForm2.id) {
            this.table.singleSelection = this.dialog.ruleForm2.id;
            this.table.singleSelected = Object.assign({}, this.dialog.ruleForm2);
          } else {
            this.table.singleSelection = '';
            this.table.singleSelected = {};
          }
        }
        // this.pagination.page = 1;
        // this.pagination.count = 10;
        // this.pagination.total = 0;
        // this.getDataList();
      },
      clearSelect() {
        this.dialog.ruleForm2 = {};
        this.dialog.names = '';
        this.table.multipleSelection = [];
        this.table.multipleSelected = [];
        this.table.singleSelection = {};
        this.table.singleSelected = '';
        if (this.$refs.tableSub && this.$refs.tableSub.$refs.multipleTable) {
          this.$refs.tableSub.$refs.multipleTable.clearSelection();
        }
      }
    },
    created() {
      this.table.type = this.tableType;
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.check-module-box{
  width: 100%;
}
</style>

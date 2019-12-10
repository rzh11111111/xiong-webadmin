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
          <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :table="table" :pagination="pagination" :dialog="dialog" :getDataList="getDataList">
          </search-sub>
          <selector-table ref="tableSub" :getDataList="getDataList" :disabledCheck="disabledCheck" :dialog="dialog" :table="table" @select="handleDelArr" :pagination="pagination">
             <template :slot="item.value" slot-scope="{index,row }" v-for="(item,index) in table.columns"
                      v-if="item.slotBool">
              <slot :name="item.value" :index="index" :row="row"></slot>
            </template>
            <template slot="isEnable" slot-scope="{ index,row }">
              <span>{{row.isEnable === 0 ? '启用' : '停用'}}</span>
            </template>
            <template slot="shortInfo" slot-scope="{ index,row }">
              <el-popover
                placement="top-start"
                width="250"
                trigger="hover"
                :content="row.shortInfo">
                <p class="ellipsis" slot="reference">{{row.shortInfo}}</p>
              </el-popover>
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
      },
      quickSearch: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
         return {
           format: format,
           searchObj: [{
             value: 'keyWord',
             label: '',
             name: '关键字',
             placeholder: '品牌名称/厂商名称',
             isText: true
           }, {
             isDate: true,
             value: 'time1',
             label: '',
             name: '开始时间'
           }, {
             isDate: true,
             value: 'time2',
             label: '',
             name: '结束时间'
           }],
           table: {
            btn: true,
            reserveSelection: true,
            addBool: true,
            width: '200px',
            editBool: true,
            emitEditBool: true,
            type: 'radio',
            arrDel: true,
            columns: [
              {
                value: 'code',
                label: '品牌编号',
                width: '100'
              }, {
                value: 'name',
                label: '品牌名称',
                width: '100'
              }, {
                value: 'icoUrl',
                label: '品牌图片',
                width: '100'
              }, {
                value: 'supplierName',
                label: '厂商名称',
                width: '100'
              }, {
                value: 'sortNo',
                label: '排序',
                width: '120'
              }, {
                value: 'isEnable',
                label: '是否启用',
                width: '120',
                slotBool: true
              }, {
                value: 'shortInfo',
                label: '介绍',
                width: '120',
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
          this.$emit("submit", this.table.multipleSelection, 4);
        } else {
          if (!this.table.singleSelection || !this.table.singleSelection.id) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          // this.dialog.names = this.table.singleSelection.name;
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
        // this.$emit("submit", row, 4);
      },
      async getDataList() { //获取用户列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1) {
          searchParameter.starTime = queryPo.time1;
        }
        if (queryPo && queryPo.time2) {
          searchParameter.endTime = queryPo.time2;
        }
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter: searchParameter
        }
        let resData = await this.Api.getGoodsBrandlist(para);
        return resData;
      },
      clearSelect() {
        this.dialog.ruleForm2 = {};
        this.dialog.names = '';
        this.table.multipleSelection = [];
        this.table.multipleSelected = [];
        this.table.singleSelection = {};
        this.table.singleSelected = '';
        // this.$refs.tableSub.clearSelection();
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

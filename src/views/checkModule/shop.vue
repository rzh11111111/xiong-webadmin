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
          <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :searchBool="searchBool" :table="table" :pagination="pagination" :dialog="dialog" :getDataList="getDataList" v-if="!searchBool">
          </search-sub>
          <selector-table ref="tableSub" :getDataList="getDataList" :disabledCheck="disabledCheck" :dialog="dialog" :table="table" @select="handleDelArr" :pagination="pagination">
             <template :slot="item.value" slot-scope="{index,row }" v-for="(item,index) in table.columns"
                      v-if="item.slotBool">
              <slot :name="item.value" :index="index" :row="row"></slot>
            </template>
            <template slot="isEnable" slot-scope="{index,row }">
              <el-tag :type="row.isEnable == 1 ? 'danger' : 'success'">
                {{row.isEnable == 1 ? '停用' : '启用'}}
              </el-tag>
            </template>
            <template slot="type" slot-scope="{index,row }">
                {{type[row.type - 1]}}
            </template>
            <template slot="status" slot-scope="{index,row }">
              <el-tag :type="statusColor[row.status - 1]">
                {{status[row.status - 1]}}
              </el-tag>
            </template>
            <template slot="createTime" slot-scope="{ index,row }">
              <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
            </template>
            <template slot="updateTime" slot-scope="{ index,row }">
              <span v-if="!!row.updateTime">{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
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
      let status = [{
            value: 1,
            label: '正常'
          }, {
            value: 2,
            label: '关闭'
          }, {
            value: 3,
            label: '冻结'
          }];
      return {
        format,
        type: ['生产企业', '同城企业'],
        status: ['正常', '关闭', '冻结'],
        statusColor: ['success', '', 'danger'],
        selection: [],
        innerVisible: false,
        searchBool: false,
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '店铺名称/账号/编码'
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '创建时间'
        }],
        table: {
          width: '200px',
          reserveSelection: true,
          btn: true,
          addBool: true,
          delBool: true,
          type: 'radio',
          emitDetailBool: true,
          columns: [{
            value: 'code',
            label: '编号',
            width: '100'
          }, {
            value: 'nickName',
            label: '店铺名称',
            width: '150'
          }, {
            value: 'userName',
            label: '账号',
            width: '150'
          }, {
            value: 'isEnable',
            label: '是否启用',
            slotBool: true,
            width: '140'
          }, {
            value: 'type',
            label: '店铺类型',
            slotBool: true,
            width: '120'
          }, {
            value: 'status',
            label: '店铺状态',
            slotBool: true,
            width: '100'
          }, {
            value: 'createTime',
            label: '创建时间',
            slotBool: true,
            width: '100'
          }, {
            value: 'updateTime',
            label: '更新时间',
            slotBool: true,
            width: '100'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

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
          this.$emit("submit", this.table.multipleSelection, 2);
        } else {
          if (!this.table.singleSelection || !this.table.singleSelection.id) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          this.$emit("submit", this.table.singleSelection, 2);
        }
        this.dialog.innerVisible = false;
      },
      async handleDelArr(row) {
        if (this.table.type === 'selection') {
          this.table.multipleSelection = Object.assign([], this.dialog.ruleForm2, row);
        } else {
          this.table.singleSelection = Object.assign({}, this.dialog.ruleForm2, row);
        }
        // this.$emit("submit", row, 2);
      },
      async getDataList() { //获取店铺列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
        }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter,
          isEnable: 0,
          status: 1
        }, queryPo);
        if (this.dialog.shopType) {
          para.type = this.dialog.shopType;
        }
        return await this.Api.getShopPage(para);
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
    },
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.check-module-box{
  width: 100%;
}
</style>

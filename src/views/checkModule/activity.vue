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
          <search-sub :searchObj="searchObj" :timeRangeVal="['time1', 'time2']" :pagination="pagination" :quickSearch="quickSearch" :table="table" :dialog="dialog" :getDataList="getDataList">
          </search-sub>
          <selector-table ref="tableSub" :getDataList="getDataList" :disabledCheck="disabledCheck" :dialog="dialog" :table="table" @select="handleDelArr" :pagination="pagination">
             <template :slot="item.value" slot-scope="{index,row }" v-for="(item,index) in table.columns"
                      v-if="item.slotBool">
              <slot :name="item.value" :index="index" :row="row"></slot>
            </template>
            <template slot="isEnable" slot-scope="{ index,row }">
              <el-tag :type="row.isEnable === 0 ? 'success' : 'danger'">{{row.isEnable === 0 ? '启用' : '停用'}}</el-tag>
            </template>
            <template slot="isTop" slot-scope="{ index,row }">
              <span>{{row.isTop === 0 ? '否' : '是'}}</span>
            </template>
            <template slot="bgColor" slot-scope="{index, row}">
              <span :style="'display:block;width:20px;height: 20px;backgroud-color: ' + row.bgColor"></span>
            </template>
            <template slot="saleGoodsGroup" slot-scope="{ index,row }">
              <template v-if="!!row.saleGoodsGroup">
                <el-popover
                  placement="top-start"
                  width="250"
                  trigger="hover"
                  :content="row.saleGoodsGroup.name">
                  <p class="ellipsis" slot="reference">{{row.saleGoodsGroup.name}}</p>
                </el-popover>
              </template>
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
      }
    },
    data() {
         return {
           format: format,
           quickSearch: {
             isShow: true
           },
           searchObj: [{
             value: 'keyWord',
             label: '',
             name: '关键字',
             placeholder: '活动编码/活动名称/活动展示标题/商品分组名称',
             isText: true
            }, {
              value: 'isTop',
              label: '',
              name: '推荐到首页',
              isSelect: true,
              list: [{
                value: 1,
                label: '是'
              }, {
                value: 0,
                label: '否'
              }]
            }, {
               isDate: true,
               value: 'time1',
               label: '',
               name: '生效开始时间'
             }, {
               isDate: true,
               value: 'time2',
               label: '',
               name: '生效截止时间'
           }],
           table: {
            btn: true,
            addBool: true,
            reserveSelection: true,
            width: '200px',
            editBool: true,
            emitEditBool: true,
            type: 'radio',
            arrDel: true,
            columns: [{
                value: 'code',
                label: '编码',
                width: '100'
              }, {
                value: 'sortNo',
                label: '序号',
                width: '100'
              }, {
                value: 'name',
                label: '活动名称',
                width: '100'
              }, {
                value: 'isEnable',
                label: '是否启用',
                width: '100',
                slotBool: true
              }, {
                value: 'isTop',
                label: '是否推荐到首页',
                width: '120',
                slotBool: true
              }, {
                value: 'title',
                label: '活动展示标题',
                width: '120'
              }, {
                value: 'icoUrl',
                label: '活动展示图标',
                width: '120'
              }, {
                value: 'picUrl',
                label: '活动展示图',
                width: '120'
              }, {
                value: 'bgColor',
                label: '活动背景色',
                width: '120',
                slotBool: true
              }, {
                value: 'saleGoodsGroup',
                label: '关联到商品分组',
                width: '120',
                slotBool: true
              }, {
                value: 'activeTime',
                label: '活动开启时间',
                width: '120',
                slotBool: true
              }, {
                value: 'invalidTime',
                label: '活动关闭时间',
                width: '120',
                slotBool: true
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
          this.$emit("submit", this.table.multipleSelection, 6);
        } else {
          if (!this.table.singleSelection || !this.table.singleSelection.id) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          // this.dialog.names = this.table.singleSelection.name;
          this.$emit("submit", this.table.singleSelection, 6);
        }
        this.dialog.innerVisible = false;
      },
      async handleDelArr(row) {
        if (this.table.type === 'selection') {
          this.table.multipleSelection = Object.assign([], this.dialog.ruleForm2, row);
        } else {
          this.table.singleSelection = Object.assign({}, this.dialog.ruleForm2, row);
        }
        // this.$emit("submit", row, 6);
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

        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter,
          isEnable: 0
        });
        let resData = await this.Api.getActivityList(para);
        return resData;
      },
      clearSelect() {
        this.dialog.ruleForm2 = {};
        this.dialog.names = '';
        this.table.multipleSelection = [];
        this.table.multipleSelected = [];
        this.table.singleSelection = {};
        this.table.singleSelected = '';
        // this.$refs.tableSub && this.$refs.tableSub.clearSelection();
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

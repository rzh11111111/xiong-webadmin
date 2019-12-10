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
          <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :pagination="pagination" :table="table" :dialog="dialog" :getDataList="getDataList">
          </search-sub>
          <selector-table ref="tableSub" :getDataList="getDataList" :disabledCheck="disabledCheck" :dialog="dialog" :table="table" @select="handleDelArr" :pagination="pagination">
             <template :slot="item.value" slot-scope="{index,row }" v-for="(item,index) in table.columns"
                      v-if="item.slotBool">
              <slot :name="item.value" :index="index" :row="row"></slot>
            </template>
            <template slot="title" slot-scope="{ index,row }">
              <p class="ellipsiss">{{row.title}}</p>
            </template>
            <template slot="brand" slot-scope="{ index,row }">
              <span v-if="!!row.brand">{{row.brand.name}}</span>
            </template>
            <template slot="shop" slot-scope="{ index,row }">
              <span v-if="!!row.shop">{{row.shop.nickName}}</span>
            </template>
            <template slot="createTime" slot-scope="{ index,row }">
              <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
            </template>
            <template slot="skuPriceSellMin" slot-scope="{ index,row }">
              <span>{{(row.skuPriceSellMin / 100)|currency}}</span>
            </template>
            <template slot="skuPriceMin" slot-scope="{ index,row }">
              <span>{{(row.skuPriceMin / 100)|currency}}</span>
            </template>
            <template slot="sellStatus" slot-scope="{ index,row }">
              <el-tag :type="row.sellStatus == 1 ? 'success' : 'danger'">{{row.sellStatus == 1 ? '上架' : '下架'}}</el-tag>
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
  import {getToken} from '@/utils/auth';
  import {format} from "@/utils";
  import {currency} from "@/filters";

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
           isShow: true,
           isTimeRange: true
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          placeholder: '商品名称/商品展示标题',
          isText: true
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '创建时间'
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
             label: '商品编号',
             width: '150'
           },
           {
             value: 'title',
             label: '商品名称',
             width: '210',
             slotBool: true
           }, {
             value: 'picUrl',
             label: '商品图片',
             width: '100',
             isShow: true
           }, {
             value: 'skuPriceMin',
             label: '最低市场价',
             width: '120',
             slotBool: true
           }, {
             value: 'skuPriceSellMin',
             label: '最低销售价',
             width: '120',
             slotBool: true
           }, {
             value: 'brand',
             label: '所属品牌',
             width: '120',
             slotBool: true
           }, {
             value: 'shop',
             label: '店铺',
             width: '120',
             slotBool: true
           }, {
            value: 'sellStatus',
            label: '是否上架',
            width: '120',
            slotBool: true
          }, {
             value: 'createTime',
             label: '创建时间',
             width: '140',
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
    filters: {
      currency
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
      async getDataList() { //获取用户列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
        }
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter,
          sellStatus: 1,
          isEnable: 0
        }
        let resData = await this.Api.getGoodsList(para);
        return resData;
      },
      returnTypeValue(type) {
        switch (type) {
          case 1:
            return '待审核';
          case 2:
            return '已通过';
          case 3:
            return '已拒绝';
          default:
            return '无'
        }
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
.ellipsiss {
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
  height: 40px;
}
</style>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :timeRangeVal="['time1']" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="storeName" slot-scope="{ index,row }">
          <span v-if="!!row.store">{{row.store.nickName}}</span>
        </template>
        <template slot="storeCode" slot-scope="{ index,row }">
          <span v-if="!!row.store">{{row.store.code}}</span>
        </template>
        <template slot="storeType" slot-scope="{ index,row }">
          <span>{{row.store.type == 1 ? '种子店' : '特色店'}}</span>
        </template>
        <template slot="type" slot-scope="{index, row}">
          <template v-for="t in type" v-if="t.value === row.type">{{t.label}}</template>
        </template>
        <template slot="income" slot-scope="{index, row}">
          <span v-if="row.type == 1">{{(row.money / 100)|currency}}</span>
        </template>
        <template slot="money" slot-scope="{index, row}">
          <span v-if="row.type == 2">{{(row.money / 100)|currency}}</span>
        </template>
        <template slot="moneyAfter" slot-scope="{index, row}">
          <span>{{(row.moneyAfter / 100)|currency}}</span>
        </template>
        <template slot="orderNo" slot-scope="{index, row}">
          <div style="text-align: left;">{{row.serviceType == 3 || row.serviceType == 4 || row.serviceType == 7 || row.serviceType == 8 ? '提现申请单号：' : '线下订单号：'}}<br/>{{row.orderNo}}</div>
        </template>
        <!-- <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template> -->
      </table-sub>
    </div>
  </div>
</template>
<script>
  import {currency} from "@/filters";
  import {format} from "@/utils";
  import TableSub from '@/components/TableSub';
  import DialogSub from '@/components/DialogSub';
  import SearchSub from '@/components/SearchSub';
  import storeInfo from '../../storeManagement/storeInfo';

  export default {
    data() {
      let storeType = [{
          value: 1,
          label: '种子店'
        }, {
          value: 2,
          label: '特色店'
        }];
      let type = [{
            value: 1,
            label: '进(收)'
          }, {
            value: 2,
            label: '出(支)'
          }];
      let query = this.$route.query;
      return {
        searchBool: false,
        format,
        type,
        storeType,
        serviceType: ['售出货款冻结', '售出货款收入', '货款提现冻结', '货款提现支出', '佣金收入冻结', '佣金收入', '佣金提现冻结', '佣金提现支出', '结算收入', '作废结算支出', '作废佣金分配支出', '从应收账户到可用账户支出'],
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'storeType',
            label: query.type * 1 || null,
            selected: query.type * 1 || null,
            list: storeType
          }]
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '收支流水号/业务单号'
        }, {
          value: 'nickName',
          label: '',
          name: '店铺名称',
          isText: true,
        }, {
          value: 'code',
          label: query.code || '',
          name: '店铺编码',
          isText: true,
        }, {
          value: 'accountType',
          label: 4,
          name: '账户',
          defaultSelect: 4,
          unclearable: true,
          isSelect: true,
          list: [{
            value: 4,
            label: '不可用账户'
          }, {
            value: 1,
            label: '可用账户'
          }, {
            value: 2,
            label: '冻结账户'
          }, {
            value: 3,
            label: '提现中账户'
          }]
        }, {
          value: 'type',
          label: '',
          name: '类型',
          isSelect: true,
          list: type
        }, {
          value: 'time1',
          label: '',
          name: '时间',
          isTimeRange: true
        }],

        table: {
          emitDetailBool: true,
          detailBool: false,
          arrDelBool: true,
          delBool: true,
          editBool: true,
          btn: true,
          columns: [{
            value: 'recordNo',
            label: '收支流水号',
            width: '160'
          }, {
            value: 'createTime',
            label: '流水时间',
            width: '140'
          }, {
            value: 'storeCode',
            label: '店铺编码',
            width: '150',
            slotBool: true
          }, {
            value: 'storeName',
            label: '店铺名称',
            width: '150',
            slotBool: true
          }, {
            value: 'storeType',
            label: '店铺类型',
            width: '150',
            slotBool: true
          }, {
            value: 'type',
            label: '类型',
            width: '100',
            slotBool: true
          }, {
            value: 'income',
            label: '收入',
            width: '140',
            slotBool: true
          }, {
            value: 'money',
            label: '支出',
            width: '140',
            slotBool: true
          }, {
            value: 'moneyAfter',
            label: '余额',
            width: '140',
            slotBool: true
          }, {
            value: 'orderNo',
            label: '业务单号',
            width: '160',
            slotBool: true
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          addBool: true
        }
      }
    },
    filters: {
      currency
    },
    components: {
      DialogSub,
      SearchSub,
      TableSub,
      storeInfo
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
        queryPo.store = {};
        if (queryPo.nickName) {
          queryPo.store.nickName = queryPo.nickName;
          delete queryPo.nickName;
        }
        if (queryPo.code) {
          queryPo.store.code = queryPo.code;
          delete queryPo.code;
        }

        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected) {
              if (item.value == 'storeType') {
                queryPo.store.type = item.selected;
              } else {
                quick[item.value] = item.selected;
              }
            }
          })
        }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter
        }, quick, queryPo);

        let res = await this.Api.getStoreBalancePage(para);
        return res;
      }
    }
  }
</script>

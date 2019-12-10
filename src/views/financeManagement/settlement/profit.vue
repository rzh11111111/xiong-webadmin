<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :timeRangeVal="['time1']" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="spreadType" slot-scope="{ index,row }">
          <span v-for="type in spreadType" :key="type.value" v-if="type.value == row.spreadType">{{type.label}}</span>
        </template>
        <template slot="payOrder" slot-scope="{index, row}">
          <span vif="!!row.payOrder">{{row.payOrder.payOrderNo}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <el-tag :type="statusColor[row.status - 1]">{{status[row.status - 1]}}</el-tag>
        </template>
        <template slot="distributeConfig" slot-scope="{ index,row }">
          <span v-if="!!row.distributeConfig">{{fixedNum(row.distributeConfig * 100)}}%</span>
        </template>
        <template slot="moneyOrderPay" slot-scope="{index, row}">
          <span>{{(row.moneyOrderPay / 100)|currency}}</span>
        </template>
        <template slot="money" slot-scope="{index, row}">
          <span>{{(row.money / 100)|currency}}</span>
        </template>

        <template slot="closeTime" slot-scope="{ index,row }">
          <span v-if="!!row.closeTime">{{format(new Date(row.closeTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
      </table-sub>

    </div>
  </div>
</template>
<script>
  import {currency} from "@/filters";
  import {format, fixedNum} from "@/utils";
  import TableSub from '@/components/TableSub';
  import SearchSub from '@/components/SearchSub';

  export default {
    data() {
      let query = this.$route.query;
      let spreadType = [{
            label: '省区总',
            value: 1
          }, {
            label: '合作商',
            value: 2
          }, {
            label: '推广员',
            value: 3
          }, {
            label: '线下店老板',
            value: 4
          }];
      return {
        searchBool: false,
        format,
        fixedNum,
        spreadType,
        statusColor: ['', 'success', 'info'],
        status: ['待入账', '已入账', '废弃'],
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '结算单号/支付单号/订单号'
        }, {
          value: 'spreadCode',
          label: query.code || '',
          name: '用户编码',
          isText: true
        }, {
          value: 'spreadType',
          label: null,
          isSelect: true,
          name: '角色',
          list: spreadType
        }, {
          value: 'time1',
          label: '',
          selectLabel: 1,
          defaultSelectLabel: 1,
          selectValue: 'timeType',
          list: [{
            value: 1,
            label: '生成时间'
          }, {
            value: 2,
            label: '结算时间'
          }],
          isDateRangeList: true
        }],

        table: {
          emitDetailBool: true,
          detailBool: false,
          arrDelBool: true,
          delBool: true,
          editBool: true,
          btn: true,
          columns: [{
            value: 'orderNo',
            label: '结算单号',
            width: '170'
          }, {
            value: 'createTime',
            label: '生成时间',
            width: '140'
          }, {
            value: 'spreadCode',
            label: '用户编码',
            width: '150'
          }, {
            value: 'spreadUsername',
            label: '用户名称',
            width: '150'
          }, {
            value: 'spreadType',
            label: '角色',
            width: '150',
            slotBool: true
          }, {
            value: 'distributeConfig',
            label: '提成比例',
            slotBool: true,
            width: '140'
          }, {
            value: 'moneyOrderPay',
            label: '订单应付金额',
            slotBool: true,
            width: '140'
          }, {
            value: 'money',
            label: '收益',
            width: '140',
            slotBool: true
          }, {
            value: 'status',
            label: '当前状态',
            width: '140',
            slotBool: true
          }, {
            value: 'payOrderNo',
            label: '对应支付单号',
            width: '160'
          }, {
            value: 'onlineOfflineOrderNo',
            label: '对应订单号',
            width: '160'
          }, {
            value: 'closeTime',
            label: '结算时间',
            width: '140',
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
          if (queryPo.timeType == 1) {
            queryPo.createStartTime = queryPo.time1[0];
            queryPo.createEndTime = queryPo.time1[1];
          } else {
            searchParameter.starTime = queryPo.time1[0];
            searchParameter.endTime = queryPo.time1[1];
          }
          delete queryPo.time1;
          delete queryPo.timeType;
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected) {
              quick[item.value] = item.selected;
            }
          })
        }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count,
          },
          searchParameter
        }, quick, queryPo);

        let res = await this.Api.getProfitSettlementPage(para);
        return res;
      }
    }
  }
</script>

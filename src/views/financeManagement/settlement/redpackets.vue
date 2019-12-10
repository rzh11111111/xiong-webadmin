<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :timeRangeVal="['time1']" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="nickName" slot-scope="{ index,row }">
          <span v-if="!!row.store">{{row.store.nickName}}</span>
        </template>
        <template slot="type" slot-scope="{ index,row }">
          <span v-for="type in packetsType" :key="type.value" v-if="type.value === row.type">{{type.label}}</span>
        </template>
        <template slot="payOrder" slot-scope="{index, row}">
          <span vif="!!row.payOrder">{{row.payOrder.payOrderNo}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <el-tag :type="statusColor[row.status - 1]">{{status[row.status - 1]}}</el-tag>
        </template>
        <template slot="platformRate" slot-scope="{ index,row }">
          <span v-if="!!row.platformRate">{{fixedNum(100 - row.platformRate * 100)}}%</span>
        </template>
        <template slot="luckmoney" slot-scope="{index, row}">
          <span>{{(row.luckmoney / 100)|currency}}</span>
        </template>
        <template slot="moneyPay" slot-scope="{index, row}">
          <span>{{(row.moneyPay / 100)|currency}}</span>
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
      let packetsType = [{
            label: '消费红包',
            value: 1
          }, {
            label: '分享红包',
            value: 2
          }];
      return {
        searchBool: false,
        format,
        fixedNum,
        packetsType,
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
          value: 'memberCode',
          label: query.code || '',
          name: '会员编码',
          isText: true
        }, {
          value: 'type',
          label: null,
          name: '类型',
          isSelect: true,
          list: packetsType
        }, {
          value: 'time1',
          label: '',
          selectLabel: 1,
          selectValue: 'timeType',
          defaultSelectLabel: 1,
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
            value: 'memberCode',
            label: '会员编码',
            width: '150'
          }, {
            value: 'memberUsername',
            label: '会员昵称',
            width: '150'
          }, {
            value: 'moneyPay',
            label: '实付金额',
            width: '150',
            slotBool: true
          }, {
            value: 'luckmoney',
            label: '红包',
            width: '140',
            slotBool: true
          }, {
            value: 'type',
            label: '红包类型',
            slotBool: true,
            width: '140'
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
          //   value: '',
          //   label: '对应订单号',
          //   width: '160'
          // }, {
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

        let res = await this.Api.getPacketsSettlementPage(para);
        return res;
      }
    }
  }
</script>

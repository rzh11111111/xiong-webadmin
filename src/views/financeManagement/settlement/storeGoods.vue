<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :timeRangeVal="['time1']" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="nickName" slot-scope="{ index,row }">
          <span v-if="!!row.store">{{row.store.nickName}}</span>
        </template>
        <template slot="storeType" slot-scope="{ index,row }">
          <span>{{row.storeType === 1 ? '种子店' : '特色店'}}</span>
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
        <template slot="moneyPayable" slot-scope="{index, row}">
          <span>{{(row.moneyPayable / 100)|currency}}</span>
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

      let timeLabel = [];
      if (query.code) {
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        let startTime = format(date, 'yyyy-MM-dd hh:mm:ss');
        date.setDate(date.getDate() + 1);
        let endTime = format(date, 'yyyy-MM-dd hh:mm:ss');
        timeLabel = [startTime, endTime];
      }
      return {
        searchBool: false,
        format,
        fixedNum,
        statusColor: ['', 'success', 'info', 'danger'],
        status: ['待结算', '已结算', '取消结算', '作废'],
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'storeType',
            label: null,
            selected: null,
            list: [{
              label: '种子店',
              value: 1
            }, {
              label: '特色店',
              value: 2
            }]
          }]
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '结算单号/订单编号/支付单号'
        }, {
          value: 'storeCode',
          label: query.code || '',
          name: '结算店铺',
          isText: true,
          placeholder: '编码'
        }, {
          value: 'time1',
          label: timeLabel,
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
            value: 'storeCode',
            label: '店铺编码',
            width: '150'
          }, {
            value: 'nickName',
            label: '店铺名称',
            width: '150',
            slotBool: true
          }, {
            value: 'storeType',
            label: '店铺类型',
            slotBool: true,
            width: '140'
          }, {
            value: 'platformRate',
            label: '提成比例',
            slotBool: true,
            width: '140'
          }, {
            value: 'moneyPayable',
            label: '订单应收金额',
            slotBool: true,
            width: '140'
          }, {
            value: 'money',
            label: '结算款',
            width: '140',
            slotBool: true
          }, {
            value: 'status',
            label: '当前状态',
            width: '140',
            slotBool: true
          }, {
            value: 'payOrder',
            label: '对应支付单号',
            width: '160',
            slotBool: true
          }, {
            value: 'otsOrderNo',
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

        let res = await this.Api.getStoreSettlementPage(para);
        return res;
      }
    }
  }
</script>

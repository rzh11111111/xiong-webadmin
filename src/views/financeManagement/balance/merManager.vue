<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :timeRangeVal="['time1']" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="merManagerName" slot-scope="{ index,row }">
          <span v-if="!!row.merManager">{{row.merManager.name}}</span>
        </template>
        <template slot="merManagerCode" slot-scope="{ index,row }">
          <span v-if="!!row.merManager">{{row.merManager.code}}</span>
        </template>
        <template slot="merManagerType" slot-scope="{ index,row }">
          <span v-if="!!row.merManager">{{merManagerType[row.merManager.accountType - 1]}}</span>
        </template>
        <template slot="type" slot-scope="{index, row}">
          <template v-for="t in type" v-if="t.value === row.type">{{t.label}}</template>
        </template>
       <!--  <template slot="serviceType" slot-scope="{index, row}">
          {{serviceType[row.serviceType - 1]}}
        </template> -->
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
          <div style="text-align: left;">{{getServiceOrderNo(row.serviceType)}}<br/>{{row.orderNo}}</div>
        </template>
      </table-sub>
    </div>
  </div>
</template>
<script>
  import {currency} from "@/filters";
  import {format} from "@/utils";
  import TableSub from '@/components/TableSub';
  import SearchSub from '@/components/SearchSub';

  export default {
    data() {
      let query = this.$route.query;
      let type = [{
            value: 1,
            label: '进(收)'
          }, {
            value: 2,
            label: '出(支)'
          }];
      return {
        searchBool: false,
        format,
        type,
        serviceType: ['省区总开发同城', '省区总抽成推广员收益', '合作商开发同城', '合作商对辖区同城抽成', '合作商对辖区种子店抽成', '合作商对辖区特色店抽成', '推广员开发同城', '推广员开发种子店', '推广员开发特色店', '提现'],
        merManagerType: ['推广员', '合作商', '省区总'],
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'merAccountType',
            label: query.type * 1 || null,
            selected: query.type * 1 || null,
            list: [{
              value: 1,
              label: '推广员'
            }, {
              value: 2,
              label: '合作商'
            }, {
              value: 3,
              label: '省区总'
            }]
          }]
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '收支流水号/业务单号'
        }, {
          value: 'name',
          label: '',
          name: '推广名称',
          isText: true
        }, {
          value: 'code',
          label: query.code || '',
          name: '推广编码',
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
          label: null,
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
            label: '时间',
            width: '140'
          }, {
            value: 'merManagerCode',
            label: '推广编码',
            width: '150',
            slotBool: true
          }, {
            value: 'merManagerName',
            label: '推广名称',
            width: '150',
            slotBool: true
          }, {
            value: 'merManagerType',
            label: '角色',
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
      SearchSub,
      TableSub
    },
    methods: {
      getServiceOrderNo(type) {
        switch(type) {
          case 1:
          case 2:
          case 3:
          case 4:
            return '线上订单号：';
          case 5:
          case 6:
          case 8:
          case 9:
            return '线下订单号：';
          case 10:
            return '提现申请单：';
        }
      },
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
        queryPo.merManager = {};
        if (queryPo.name) {
          queryPo.merManager.name = queryPo.name;
          delete queryPo.name;
        }
        if (queryPo.code) {
          queryPo.merManager.code = queryPo.code;
          delete queryPo.code;
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected) {
              if (item.value === 'merAccountType') {
                queryPo.merManager.accountType = item.selected;
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

        let res = await this.Api.getMerBalancePage(para);
        return res;
      }
    }
  }
</script>

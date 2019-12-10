<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :timeRangeVal="['time1']" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
         <template slot="memberName" slot-scope="{ index,row }">
           <span v-if="!!row.member">{{row.member.nickname}}</span>
         </template>
         <template slot="memberCode" slot-scope="{ index,row }">
           <span v-if="!!row.member">{{row.member.code}}</span>
         </template>
         <template slot="type" slot-scope="{index, row}">
           <template v-for="t in type" v-if="t.value === row.type">{{t.label}}</template>
         </template>
         <template slot="income" slot-scope="{index, row}">
           <span v-if="row.type == 1">{{(row.num / 100)|currency}}</span>
         </template>
         <template slot="num" slot-scope="{index, row}">
           <span v-if="row.type == 2">{{(row.num / 100)|currency}}</span>
         </template>
         <template slot="numAfter" slot-scope="{index, row}">
           <span>{{(row.numAfter / 100)|currency}}</span>
         </template>
         <!-- <template slot="numAfter" slot-scope="{index, row}">
           <span>{{(row.type == 1?(row.numAfter+row.num) / 100:(row.numAfter-row.num) / 100)|currency}}</span>
         </template> -->
        <template slot="serviceNo" slot-scope="{index, row}">
          <div style="text-align: left;">{{returnServiceType(row.serviceType)}}<br v-if="!!returnServiceType(row.serviceType)"/>{{row.serviceNo}}</div>
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
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键词',
          isText: true,
          placeholder: '收支流水号'
        }, {
          value: 'nickname',
          label: '',
          name: '会员昵称',
          isText: true
        }, {
          value: 'code',
          label: query.code || '',
          name: '会员编码',
          isText: true
        }, {
          value: 'accountType',
          label: 4,
          name: '账户',
          unclearable: true,
          defaultSelect: 4,
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
          label: [],
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
            value: 'memberCode',
            label: '会员编码',
            width: '150',
            slotBool: true
          }, {
            value: 'memberName',
            label: '会员昵称',
            width: '150',
            slotBool: true
          }, {
            value: 'type',
            label: '类型',
            width: '140',
            slotBool: true
          }, {
            value: 'income',
            label: '收入',
            width: '140',
            slotBool: true
          }, {
            value: 'num',
            label: '支出',
            width: '140',
            slotBool: true
          }, {
            value: 'numAfter',
            label: '余额',
            width: '140',
            slotBool: true
          }, {
            value: 'serviceNo',
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
      returnServiceType(type) {
        switch(type) {
          case 12:
            return '售后单号：';
          case 6:
          case 9:
          case 11:
          case 14:
            return '红包分账单单号：';
          case 3:
          case 4:
          case 5:
          case 13:
            return '支付单单号：';
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
        queryPo.member = {};
        if (queryPo.nickname) {
          queryPo.member.nickname = queryPo.nickname;
          delete queryPo.nickname;
        }
        if (queryPo.code) {
          queryPo.member.code = queryPo.code;
          delete queryPo.code;
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
            pageSize: this.pagination.count
          },
          searchParameter
        }, quick, queryPo);

        let res = await this.Api.getRedBalancePage(para);
        return res;
      }
    }
  }
</script>

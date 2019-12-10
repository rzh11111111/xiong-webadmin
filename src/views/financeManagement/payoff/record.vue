<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :timeRangeVal="['time1']" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub":getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="status" slot-scope="{ index,row }">
          <el-tag :type="statusColor[row.status - 1]" v-for="s in status" :key="s.value" v-if="s.value === row.status">{{s.label}}</el-tag>
        </template>
        <template slot="payPlatformType" slot-scope="{ index,row }">
          <span v-for="s in payPlatformType" :key="s.value" v-if="s.value === row.payPlatformType">{{s.label}}</span>
        </template>
   <!--      <template slot="memberCode" slot-scope="{index, row}">
          <span v-if="!!row.member">{{row.member.code}}</span>
        </template>
        <template slot="memberNickname" slot-scope="{index, row}">
          <span v-if="!!row.member">{{row.member.nickname}}</span>
        </template> -->
        <template slot="payType" slot-scope="{index, row}">
          {{row.payType == 1 ? '线上订单' : '线下订单'}}
        </template>
        <template slot="payIntegral" slot-scope="{index, row}">
          <span>{{(row.payIntegral / 100)|currency}}</span>
        </template>
        <template slot="payLuckmoney" slot-scope="{index, row}">
          <span>{{(row.payLuckmoney / 100)|currency}}</span>
        </template>
        <template slot="payMoney" slot-scope="{index, row}">
          <span>{{((row.payMoney - row.payLuckmoney)/ 100)|currency}}</span>
        </template>
        <template slot="integral" slot-scope="{index, row}">
          <span>{{(row.integral / 100)|currency}}</span>
        </template>
        <template slot="refundIntegral" slot-scope="{index, row}">
          <span>{{(row.refundIntegral / 100)|currency}}</span>
        </template>
        <template slot="refundLuckmoney" slot-scope="{index, row}">
          <span>{{(row.refundLuckmoney / 100)|currency}}</span>
        </template>
        <template slot="refundMoney" slot-scope="{index, row}">
          <span>{{(row.refundMoney / 100)|currency}}</span>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="payTime" slot-scope="{ index,row }">
          <span v-if="!!row.payTime">{{format(new Date(row.payTime), "yyyy-MM-dd hh:mm:ss")}}</span>
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
      let status = [{
        value: 1,
        label: '待支付'
      }, {
        value: 2,
        label: '支付中'
      }, {
        value: 3,
        label: '支付成功'
      }, {
        value: 4,
        label: '已取消'
      }, {
        value: 5,
        label: '支付异常'
      }];
      let payPlatformType = [{
        value: 1,
        label: '微信'
      }, {
        value: 2,
        label: '支付宝'
      }, {
        value: 3,
        label: '云闪付'
      }, {
        value: 4,
        label: '钱兔'
      }];
      return {
        searchBool: false,
        format,
        status,
        statusColor: ['', 'warning', 'success', 'info', 'danger'],
        payPlatformType,
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '支付单号/订单号/会员编码'
        }, {
          value: 'status',
          label: '',
          name: '状态',
          isSelect: true,
          list: status
        }, {
          value: 'payPlatformType',
          label: '',
          name: '支付渠道',
          isSelect: true,
          list: payPlatformType
        }, {
          value: 'time1',
          label: [],
          name: '支付完成时间',
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
            value: 'payOrderNo',
            label: '支付单号',
            width: '160'
          }, {
            value: 'createTime',
            label: '支付时间',
            width: '140',
            slotBool: true
          }, {
            value: 'status',
            label: '状态',
            width: '150',
            slotBool: true
          }, {
            value: 'payPlatformType',
            label: '支付渠道',
            width: '150',
            slotBool: true
          }, {
            value: 'memberCode',
            label: '会员编码',
            // slotBool: true,
            width: '140'
          }, {
            value: 'memberUsername',
            label: '会员昵称',
            // slotBool: true,
            width: '140'
          }, {
            value: 'payType',
            label: '支付类型',
            slotBool: true,
            width: '140'
          }, {
            value: 'payIntegral',
            label: '积分抵扣',
            width: '140',
            slotBool: true
          }, {
            value: 'payLuckmoney',
            label: '使用红包',
            width: '140',
            slotBool: true
          }, {
            value: 'payMoney',
            label: '实付金额',
            width: '140',
            slotBool: true
          }, {
            value: 'integral',
            label: '获得积分',
            width: '140',
            slotBool: true
          }, {
            value: 'refundIntegral',
            label: '退款积分',
            width: '140',
            slotBool: true
          }, {
            value: 'refundLuckmoney',
            label: '退款红包',
            width: '140',
            slotBool: true
          }, {
            value: 'refundMoney',
            label: '退款金额',
            width: '140',
            slotBool: true
          }, {
          //   value: 'payPlatformOrderNo',
          //   label: '第三方交易流水号',
          //   width: '140'
          // }, {
            value: 'baseOrderNo',
            label: '对应订单总单号',
            width: '160'
          }, {
            value: 'payTime',
            label: '支付完成时间',
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

        let searchParameter = {};
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
        }
        if (queryPo.keyWord) {
          searchParameter.keyWord = queryPo.keyWord;
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

        let res = await this.Api.getPayoffOrderPage(para);
        return res;
      }
    }
  }
</script>

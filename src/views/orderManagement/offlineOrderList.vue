<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :timeRangeVal="['time1']" :pagination="pagination" :searchObj="searchObj" :quickSearch="quickSearch" :getDataList="getDataList" :dialog="dialog" :searchBool="searchBool">
      </search-sub>
      <!-- <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination"> -->
      <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :dialog="dialog"
           :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="store" slot-scope="{ index,row }">
          <div class="container-box" v-if="!!row.store">
            <div class="container-img">
              <el-popover
                placement="top"
                trigger="click"
                popper-class="tootip-img-box"
                v-model="logoVisible">
                  <img :src="row.store.logo">
                <img slot="reference" :src="row.store.logo" width="80" height="80">
              </el-popover>
            </div>
            <div class="container-content">
              <el-button @click="handleStoreDetail(row)" type="text" size="medium">{{row.store==null?'':row.store.nickName}}</el-button>
              <p>编码：{{row.store==null?'':row.store.code}}</p>
              <p>{{row.store==null?'':row.store.address}}</p>
              <p>{{returnOrderTypeValue(row.store==null?'':row.store.type)}}</p>
            </div>
          </div>
        </template>
        <template slot="memberNickname" slot-scope="{ index,row }">
          <el-button @click="handleMemberDetail(row)" type="text" size="medium">{{row.member==null?'':row.member.nickname}}</el-button>
          <p v-if="!!row.member" style="margin:0;">手机号：{{row.member.phone}}</p>
          <p v-if="!!row.member" style="margin:0;">编码：{{row.member.code}}</p>
        </template>
        <template slot="orderType" slot-scope="{ index,row }">
          <template v-for="s in orderType" v-if="s.value === row.orderType">{{s.label}}</template>
        </template>
        <template slot="moneyOrderPayable" slot-scope="{ index,row }">
          <span>{{(row.moneyOrderPayable/100)|currency}}</span>
        </template>
        <template slot="moneyOrderPay" slot-scope="{ index,row }">
          <span>{{(row.moneyOrderPay/100)|currency}}</span>
        </template>s
        <template slot="payPlatformType" slot-scope="{ index,row }">
          <span>{{returnTypeValue(row.payOrder==null?'':row.payOrder.payPlatformType)}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <div class="container-box">
            <div class="container-content center">
              <p>{{returnStatusValue(row.status)}}</p>
              <el-button @click="handleDetail(row)" type="text" size="small">详情</el-button>
                <!-- <el-button type="text">详情</el-button> -->
            </div>
          </div>
        </template>
        <template slot="evaluateRemarks" slot-scope="{index, row}">
          <el-button @click="handleEvaluateDetail(row)" type="text" size="small" v-if="row.isEvaluate">查看评价</el-button>
          <span v-else>暂未评价</span>
        </template>
      <!-- </table-sub> -->
      </tree-sidebar-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList">
        <template slot="dialog">
          <tr>
            <td>环境：</td>
            <td>
              <!-- <el-rate
                v-model="dialog.ruleForm2.scoreStore"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
              </el-rate> -->

              {{dialog.ruleForm2.scoreStore / 2}}星
            </td>
          </tr>
          <tr>
            <td>服务：</td>
            <td>
              <!-- <el-rate
                v-model="dialog.ruleForm2.scoreService"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
              </el-rate> -->
              {{dialog.ruleForm2.scoreService / 2}}星
            </td>
          </tr>
          <tr>
            <td>评价内容：</td>
            <td>
              <span class="break-all">{{dialog.ruleForm2.evaluateRemarks==null?'默认评价':dialog.ruleForm2.evaluateRemarks}}</span>
            </td>
          </tr>
        </template>
      </dialog-sub>
      <!-- 店铺详情 -->
      <dialog-sub :dialog="detailDialog">
        <template slot="dialog">
          <store-info :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></store-info>
        </template>
      </dialog-sub>
      <!-- 订单详情 -->
      <dialog-sub :dialog="orderDialog">
        <template slot="dialog">
          <offline-info :dialog="orderDialog" v-if="orderDialog.saveFormVisible"></offline-info>
        </template>
      </dialog-sub>
      <!-- 会员详情 -->
      <dialog-sub :dialog="memberDialog">
        <template slot="dialog">
          <member-info :dialog="memberDialog" v-if="memberDialog.saveFormVisible"></member-info>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {format} from "@/utils";
  import bus from '@/utils/bus.js'
  import {currency} from "@/filters"
  import storeInfo from '../storeManagement/storeInfo';
  import offlineInfo from './offlineInfo';
  import memberInfo from '../memberManagement/memberInfo';

  export default {

    data() {
      let query = this.$route.query || {};
      return {
        citys: ['storeProvince', 'storeCity', 'storeRegion'],
        logoVisible: false,
        searchBool: false,
        format,
        status,

        quickSearch: {
          isTimeRange: true,
          isShow: true,
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
          label: query.memberCode || "",
          name: '会员帐号',
          isText: true,
          placeholder: '编码/手机号'
        }, {
          value: 'orderNo',
          label: '',
          name: '订单编号',
          isText: true
        }, {
          value: 'storeCode',
          label: '',
          name: '店铺编码',
          isText: true
        }, {
          value: 'time1',
          label: '',
          name: '创建时间',
          isTimeRange: true
        }],

        treeConfig: {
          treeProps: {
            label: 'name'
          },
          nodeKey: 'code',
          lazy: true,
          expandedKeys: ['0'],
          currentKey: '0'
        },
        table: {
          detailBool: false,
          editBool: true,
          delBool: true,
          emitEditBool: true,
          emitDetailBool: true,
          arrDelBool: true,
          btn: true,
          columns: [{
            value: 'orderNo',
            label: '订单编号',
            width: '100'
          }, {
            value: 'createTime',
            label: '创建时间',
            width: '140'
          }, {
            value: 'store',
            label: '店铺信息',
            width: '260',
            slotBool: true
          }, {
            value: 'moneyOrderPayable',
            label: '消费金额',
            width: '80',
            slotBool: true
          }, {
            value: 'moneyOrderPay',
            label: '实付金额',
            width: '80',
            slotBool: true
          }, {
            value: 'memberNickname',
            label: '买家',
            width: '190',
            slotBool: true
          }, {
            value: 'payPlatformType',
            label: '支付方式',
            width: '100',
            slotBool: true
          }, {
            value: 'status',
            label: '交易状态',
            width: '120',
            slotBool: true
          }, {
            value: 'evaluateRemarks',
            label: '评论',
            width: '100',
            slotBool: true
          }]
        },

        dialog: {
          width: "400px",
          addBool: true,
          readBool: true,
          titleText: '评价详情',
          saveFormVisible: false,
          type: 'permission',
          isTable: true,
          ruleForm2: {
          },
          rules2: {}
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
          shopType: 2,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true
        },
        orderDialog: {
          saveFormVisible: false,
          width: '1000px',
          shopType: 2,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true
        },
        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        memberDialog: {
          saveFormVisible: false,
          width: '1000px',
          shopType: 2,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true
        }
      }
    },
    filters: {
      currency: currency
    },
    components: {
      SearchSub,
      TableSub,
      DialogSub,
      TreeSidebarTable,
      storeInfo,
      offlineInfo,
      memberInfo
    },
    methods: {
      async getTreeList(node) {
        let res = await this.Api.getAreaConfig({parentCode: node && node.key ? node.key : '000000'});
        if (res.status === 1 && res.data) {
          let list = res.data.list || [];
          return list;
        }
      },
      async getDataList(params, areaAll) { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo.time1) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected || item.selected === 0) {
              quick[item.value] = item.selected;
            }
          })
        }
        // let store = {
        //   code : queryPo.storeCode,
        //   type : quick.storeType,
        // }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter
        }, queryPo,quick);
        if (params && params.id && params.name !== '全国') {
          areaAll.forEach(item => {
            if (item.areaLevel > 0) {
              para[this.citys[item.areaLevel - 1]] = item.name;
            }
          })
        }

        let resData = await this.Api.getOfflineOrder(para);
        return resData;
      },
      handleDetail(row) {
        this.orderDialog.id = row.id;
        this.orderDialog.saveFormVisible = true;
        // this.$router.push({path: '/order/offlineOrderDetails', query: {id: params.id}});
      },
      handleStoreDetail(row) {
        this.detailDialog.id = row.store.id;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/seller/store/' + row.store.id, query: {storeType: row.store.type}});
      },
      handleMemberDetail(row) {
      this.memberDialog.id = row.member.id;
      this.memberDialog.saveFormVisible = true;
        // this.$router.push({path: '/member/memberDetails', query: {id: params.member.id}});
      },
      async handleEvaluateDetail(params) {
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2 = Object.assign({}, params);
        let id = params.id;
        let res = await this.Api.findOfflineOrderEvaluate({orderId: id});
        if (res.status == 1) {
          this.dialog.ruleForm2 = res.data;
        }
      },
      returnTypeValue(type) {
        switch (type) {
          case 1:
            return '微信';
          case 2:
            return '支付宝';
          case 3:
            return '云闪付';
          case 4:
            return '红包全抵';
        }
      },
      returnStatusValue(type) {
        switch (type) {
          case 1:
            return '已创建待支付';
          case 4:
            return '交易成功';
        }
      },
      returnOrderTypeValue(type) {
        switch (type) {
          case '1':
            return '种子店';
          case '2':
            return '特色店';
        }
      }
    },
    computed: {},
    async mounted() {
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .center {
    text-align: center;
  }
  .dialog-box{
    width: 500px;
    overflow: hidden;
    margin-bottom: 10px;
    .dialog-item {
      width: 50%;
      float: left;
      .el-rate {
        display: inline;
      }
    }
  }
  .break-all {
    word-break: break-all;
  }
  .container-box{
    display: flex;
    text-align: left;
    .container-img{
      width: 70px;
      img{
        display: block;
        max-width: 100%;
      }
    }
    .container-content{
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      h6{
        margin: 0 0 5px;
        font-size: 13px;
      }
      p{
        font-size: 12px;
        margin: 0;
      }
    }
  }
  .img-list{
    display: flex;
    padding: 0;
    margin: 0;
    li{
      margin: 0 5px 5px 0;
    }
  }
  .img-box{
    display: flex;
    width: 50px;
    height: 50px;
    padding: 3px;
    align-items: center;
    justify-content: center;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    overflow:hidden;
    &>span{
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
    img{
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .evaluate-remarks{
    text-align: left;
    line-height: 1.5;
    .img-list{
      width: 100%;
    }
    h6{
      font-size: 13px;
      margin: 0 0 5px;
    }
    p{
      margin: 0;
      font-size: 12px;
    }
    .store-feedback{
      margin-top: 5px;
      color: #999;
      em{
        font-style: normal;
      }
    }
  }
</style>

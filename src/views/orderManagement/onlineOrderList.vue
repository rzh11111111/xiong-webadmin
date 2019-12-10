<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :timeRangeVal="['time1']" :pagination="pagination" :searchObj="searchObj" :quickSearch="quickSearch" :getDataList="getDataList" :dialog="dialog" :searchBool="searchBool">
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
      <!-- <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :dialog="dialog"
           :getDataList="getDataList" :table="table" :pagination="pagination"> -->
        <template slot="shop" slot-scope="{ index,row }">
          <div class="container-box container-border" v-if="!!row.shop">
            <div class="container-content">
              <el-button @click="handleShopDetail(row)" type="text" size="medium" v-if="!!row.shop">{{row.shop.nickName}}</el-button>
              <p v-if="!!row.shop">编码：{{row.shop.code}}</p>
            </div>
          </div>
        </template>
        <template slot="goodsInfo" slot-scope="{ index,row }" v-if="!!row.onlineOrderSkuList">
          <div class="container-box container-border" v-for="(item, index) in row.onlineOrderSkuList.length" :key="index">
            <div class="container-img">
              <el-popover
                placement="top"
                trigger="click"
                popper-class="tootip-img-box"
                v-model="logoVisible">
                  <img :src="row.onlineOrderSkuList[index].picUrl">
                <img slot="reference" :src="row.onlineOrderSkuList[index].picUrl" width="80" height="80">
              </el-popover>
            </div>
            <div class="container-content">
              <p>{{row.onlineOrderSkuList==null?'':row.onlineOrderSkuList[index].goodsTitle}}</p>
              <p>规格：{{row.onlineOrderSkuList==null?'':row.onlineOrderSkuList[index].goodsSkuName}}</p>
              <p>编码：{{row.onlineOrderSkuList==null?'':row.onlineOrderSkuList[index].goodsCode}}</p>
            </div>
          </div>
        </template>
        <template slot="priceSellDiscount" slot-scope="{ index,row }" v-if="!!row.onlineOrderSkuList">
          <div class="container-item container-border" v-for="(item, index) in row.onlineOrderSkuList.length" :key="index">
            <span>{{(row.onlineOrderSkuList[index].priceSellDiscount)/100|currency}}</span>
          </div>
        </template>
        <template slot="moneyOrderPay" slot-scope="{ index,row }" v-if="!!row.onlineOrderSkuList">
          <div class="container-item container-border" v-for="(item, index) in row.onlineOrderSkuList.length" :key="index">
            <span>{{row.onlineOrderSkuList==null?'':row.onlineOrderSkuList[index].num}}</span>
          </div>
        </template>
        <template slot="evaluateRemarks" slot-scope="{index, row}">
          <div class="container-item container-border" v-for="(item, index) in row.onlineOrderSkuList.length" :key="index">
            <el-button @click="handleEvaluateDetail(row,index)" type="text" size="small" v-if="row.isEvaluate">查看评价</el-button>
            <span v-else>暂未评价</span>
          </div>
        </template>
        <template slot="memberNickname" slot-scope="{ index,row }">
          <el-button @click="handleMemberDetail(row)" type="text" size="medium">{{row.name}}</el-button>
          <p v-if="!!row.member" style="margin:0;">手机号：{{row.member.phone}}</p>
          <p v-if="!!row.member" style="margin:0;">编码：{{row.member.code}}</p>
        </template>
        <template slot="amountPayable" slot-scope="{ index,row }">
          <div class="container-box">
            <div class="container-content center">
              <p>{{(row.moneyOrderPay/100)|currency}}</p>
              <p>(含快递{{row.isFreePostage?0:row.moneyPostagePay}}元)</p>
            </div>
          </div>
        </template>
        <template slot="orderType" slot-scope="{ index,row }">
          <template v-for="s in orderType" v-if="s.value === row.orderType">{{s.label}}</template>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <div class="container-box">
            <div class="container-content center">
              <p>{{returnStatusValue(row.status)}}</p>
              <el-button @click="handleDetail(row)" type="text" size="small">详情</el-button>
              <el-button type="primary" style="margin:0" size="mini" @click="handleExpress(row)">查看物流</el-button>
            </div>
          </div>
        </template>
      </table-sub>
      <!-- </tree-sidebar-table> -->
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList">
        <template slot="dialog">
          <tr>
            <td>商品：</td>
            <td>
              <!-- <el-rate
                v-model="dialog.ruleForm2.scoreStore"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
              </el-rate> -->
              {{dialog.ruleForm2.scoreGoods / 2}}星
            </td>
          </tr>
          <tr>
            <td>商家：</td>
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
            <td>物流：</td>
            <td>
              <!-- <el-rate
                v-model="dialog.ruleForm2.scoreService"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
              </el-rate> -->
              {{dialog.ruleForm2.scoreLogistics / 2}}星
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
          <shop-info :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></shop-info>
        </template>
      </dialog-sub>
      <!-- 订单详情 -->
      <dialog-sub :dialog="orderDialog">
        <template slot="dialog">
          <online-info :dialog="orderDialog" v-if="orderDialog.saveFormVisible"></online-info>
        </template>
      </dialog-sub>
      <!-- 会员详情 -->
      <dialog-sub :dialog="memberDialog">
        <template slot="dialog">
          <member-info :dialog="memberDialog" v-if="memberDialog.saveFormVisible"></member-info>
        </template>
      </dialog-sub>

      <dialog-sub :dialog="dialog2">
        <template slot="dialog">
          <div>
            <h3 v-if="!logistics">暂无物流信息</h3>
            <div v-else>
              <span>{{courierData[logisticsCode]}}：{{logisticsNo}}</span>
              <el-steps direction="vertical" :active="1" style="margin-top: 10px;">
                <el-step :title="item.context" :description="item.time" v-for="(item,index) in items" :key="index"></el-step>
              </el-steps>
            </div>
          </div>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
//   import TreeSidebarTable from '@/components/TreeSidebarTable'
  import TableSub from '@/components/TableSub'
  import SearchSub from '@/components/SearchSub'
  import DialogSub from '@/components/DialogSub'
  import {format} from "@/utils";
  import bus from '@/utils/bus.js'
  import shopInfo from '../shopManagement/shopInfo';
  import onlineInfo from './onlineInfo';
  import {currency} from "@/filters"
  import memberInfo from '../memberManagement/memberInfo';

  export default {

    data() {
      let query = this.$route.query || {};
      let status = [{
        label: '已创建待支付',
        value: 1
      }, {
        label: '已支付待发货',
        value: 2
      }, {
        label: '已发货待收货',
        value: 3
      }, {
        label: '已收货',
        value: 4
      }, {
        label: '已关闭',
        value: 5
      }, {
        label: '已完成',
        value: 6
      }, {
        label: '已取消',
        value: 7
      }];
      let courierData = {
          'shentong': '申通快递',
          'zhongtong': '中通快递',
          'yuantong': '圆通速递',
          'huitongkuaidi': '百世快递',
          'yunda': '韵达快递',
          'ems': 'EMS',
          'youzhengguonei': '邮政快递包裹',
          'tiantian': '天天快递',
          'shunfeng': '顺丰速运',
          'zhaijisong': '宅急送',
          'quanfengkuaidi': '全峰快递',
          'debangwuliu': '德邦物流',
          'youshuwuliu': '优速物流',
          'kuaijiesudi': '快捷快递'
      };
      return {
        citys: ['storeProvince', 'storeCity', 'storeRegion'],
        logoVisible: false,
        searchBool: false,
        format,
        status,
        courierData,
        express: {},
        query: {},
        items:[],
        logistics: true,
        logisticsCode: '',
        logisticsNo: 0,

        quickSearch: {
          isTimeRange: true,
          isShow: true,
          group: []
        },
        searchObj: [{
          value: 'goodsKeyWord',
          label: '',
          name: '商品',
          isText: true,
          placeholder: '编号/商品名'
        }, {
          value: 'shopKeyWord',
          label: '',
          name: '商家',
          isText: true,
          placeholder: '编号/商家名'
        }, {
          value: 'memberKeyWord',
          label: query.memberCode || "",
          name: '买家',
          isText: true,
          placeholder: '编号/手机'
        }, {
          value: 'baseOrderNo',
          label: '',
          name: '总订单编号',
          isText: true
        }, {
          value: 'orderNo',
          label: '',
          name: '订单编号',
          isText: true
        }, {
          value: 'status',
          label: '',
          name: '订单状态',
          isSelect: true,
          list: status
        }, {
          value: 'time1',
          label: '',
          name: '创建时间',
          isTimeRange: true
        }],

        // treeConfig: {
        //   treeProps: {
        //     label: 'name'
        //   },
        //   nodeKey: 'code',
        //   lazy: true,
        //   expandedKeys: ['0'],
        //   currentKey: '0'
        // },
        table: {
          detailBool: false,
          editBool: true,
          delBool: true,
          emitEditBool: true,
          emitDetailBool: true,
          arrDelBool: true,
          btn: true,
          isHeightAuto: true,
          columns: [{
            value: 'baseOrderNo',
            label: '总订单编号',
            width: '100'
          }, {
            value: 'orderNo',
            label: '订单编号',
            width: '100'
          }, {
            value: 'createTime',
            label: '创建时间',
            width: '140'
          }, {
            value: 'shop',
            label: '商家信息',
            width: '200',
            slotBool: true
          }, {
            value: 'goodsInfo',
            label: '商品信息',
            width: '270',
            slotBool: true
          }, {
            value: 'priceSellDiscount',
            label: '会员价',
            width: '80',
            slotBool: true
          }, {
            value: 'moneyOrderPay',
            label: '数量',
            width: '80',
            slotBool: true
          }, {
            value: 'evaluateRemarks',
            label: '评论',
            width: '200',
            slotBool: true
          }, {
            value: 'memberNickname',
            label: '买家',
            width: '190',
            slotBool: true
          }, {
            value: 'status',
            label: '交易状态',
            width: '120',
            slotBool: true
          }, {
            value: 'amountPayable',
            label: '应付金额',
            width: '120',
            slotBool: true
          }]
        },

        dialog: {
          width: "400px",
          addBool: true,
          titleText: '',
          saveFormVisible: false,
          readBool: true,
          type: 'permission',
          isTable: true,
          ruleForm2: {
          },
          rules2: {}
        },
        dialog2: {
          width: "600px",
          addBool: true,
          readBool: true,
          titleText: '物流详情',
          saveFormVisible: false,
          ruleForm2: {

          },
          rules2: {}
        },
        orderDialog: {
          saveFormVisible: false,
          width: '1000px',
          shopType: 2,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true
        },
        detailDialog: {
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
      shopInfo,
      onlineInfo,
      memberInfo
    //   TreeSidebarTable
    },
    methods: {
    //   async getTreeList(node) {
    //     let res = await this.Api.getAreaConfig({parentCode: node && node.key ? node.key : '000000'});
    //     if (res.status === 1 && res.data) {
    //       let list = res.data.list || [];
    //       return list;
    //     }
    //   },
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
        let goods = {
          code : queryPo.goodsCodeName,
          name : queryPo.goodsCodeName,
        }
        let para = Object.assign({
          // page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count,
          // },
          searchParameter,
          goods,
          // memberKeyWord
        }, queryPo,quick);

        let resData = await this.Api.getOnlineOrder(para);
        return resData;
      },
      handleDetail(row) {
        this.orderDialog.id = row.id;
        this.orderDialog.saveFormVisible = true;
        // this.$router.push({path: '/order/onlineOrderDetails', query: {id: params.id}});
      },
      async handleExpress(row) {
        this.dialog2.saveFormVisible = true;
        if(row.onlineDeliverGoodsOrder !=null){
          if(row.onlineDeliverGoodsOrder.logisticsCode==null || row.onlineDeliverGoodsOrder.logisticsNo==null){
            this.logistics = false;
          }else{
            this.logistics = true;
            this.logisticsCode = row.onlineDeliverGoodsOrder.logisticsCode;
            this.logisticsNo = row.onlineDeliverGoodsOrder.logisticsNo;
            let resData = await this.Api.expressInfo({
              emsCode: row.onlineDeliverGoodsOrder.logisticsCode,
              emsCompCode: row.onlineDeliverGoodsOrder.logisticsNo
            });
            if (resData.status == 1) {
              this.items = JSON.parse(resData.data).data;
              this.express = JSON.parse(resData.data);
              if(this.items == null){
                this.logistics = false;
              }
            }
          }
        }else {
          this.logistics = false;
        }
      },
      handleShopDetail(row) {
        this.detailDialog.id = row.shop.id;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/seller/store/' + row.store.id, query: {storeType: row.store.type}});
      },
      handleMemberDetail(row) {
      this.memberDialog.id = row.member.id;
      this.memberDialog.saveFormVisible = true;
        // this.$router.push({path: '/member/memberDetails', query: {id: params.member.id}});
      },
      async handleEvaluateDetail(params,index) {
        this.dialog.saveFormVisible = true;
        let res = await this.Api.findEvaluateDetails({
          onlineOrder: {id: params.id},
          goods: {id: params.onlineOrderSkuList[index].goods.id}
        });
        if (res.status == 1) {
          this.dialog.ruleForm2 = res.data;
        }
      },
      returnStatusValue(type) {
        switch (type) {
          case 1:
            return '已创建待支付';
          case 2:
            return '已支付待发货';
          case 3:
            return '已发货待收货';
          case 4:
            return '已收货/已完成';
          case 5:
            return '已关闭';
          case 6:
            return '已完成';
          case 7:
            return '已取消';
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
  .container-border:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
  .container-box{
    display: flex;
    text-align: left;
    padding: 5px 0;
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
  .container-item {
    padding: 5px 0;
    height: 91px;
    text-align: center;
  }
  .container-item:not(:first-child) {
    padding-top: 15px;
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

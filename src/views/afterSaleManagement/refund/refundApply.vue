<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :pagination="pagination" :searchObj="searchObj" :quickSearch="quickSearch" :getDataList="getDataList" :dialog="dialog" :searchBool="searchBool">
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
      <!-- <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :dialog="dialog"
           :getDataList="getDataList" :table="table" :pagination="pagination"> -->
        <template slot="goodsInfo" slot-scope="{ index,row }" v-if="!!row.onlineCustomerServiceSkus">
          <div class="container-box container-border" v-for="(item, index) in row.onlineCustomerServiceSkus.length" :key="index">
            <div class="container-img">
              <el-popover
                placement="top"
                trigger="click"
                popper-class="tootip-img-box"
                v-model="logoVisible">
                  <img :src="row.onlineCustomerServiceSkus[index].picUrl">
                <img slot="reference" :src="row.onlineCustomerServiceSkus[index].picUrl" width="80" height="80">
              </el-popover>
            </div>
            <div class="container-content">
              <p>{{row.onlineCustomerServiceSkus==null?'':row.onlineCustomerServiceSkus[index].goodsTitle}}</p>
              <p>规格：{{row.onlineCustomerServiceSkus==null?'':row.onlineCustomerServiceSkus[index].goodsSkuName}}</p>
              <!-- <p>编码：{{row.onlineCustomerServiceSkus==null?'':row.onlineCustomerServiceSkus[index].code}}</p> -->
            </div>
          </div>
        </template>
        <template slot="priceSellDiscount" slot-scope="{ index,row }" v-if="!!row.onlineCustomerServiceSkus">
          <div class="container-item container-border" v-for="(item, index) in row.onlineCustomerServiceSkus.length" :key="index">
            <span>{{((row.onlineCustomerServiceSkus==null?'':row.onlineCustomerServiceSkus[index].priceSellDiscount)/100)|currency}}</span>
          </div>
        </template>
        <template slot="moneyOrderPay" slot-scope="{ index,row }" v-if="!!row.onlineCustomerServiceSkus">
          <div class="container-item container-border" v-for="(item, index) in row.onlineCustomerServiceSkus.length" :key="index">
            <span>{{row.onlineCustomerServiceSkus==null?'':row.onlineCustomerServiceSkus[index].num}}</span>
          </div>
        </template>
        <template slot="evaluateRemarks" slot-scope="{index, row}">
          <div class="container-item container-border" v-for="(item, index) in row.onlineCustomerServiceSkus.length" :key="index">
            <el-button @click="handleEvaluateDetail(row, index)" type="text" size="small">查看评价</el-button>
          </div>
        </template>
        <template slot="memberNickname" slot-scope="{ index,row }">
          <div class="center">
            <p v-if="!!row.member">{{row.member.nickname}}</p>
            <p v-if="!!row.member">手机号：{{row.member.phone}}</p>
            <p v-if="!!row.member">编码：{{row.member.code}}</p>
          </div>
        </template>
        <template slot="amountPayable" slot-scope="{ index,row }">
          <div class="center">
            <p>{{(row.moneyOrderShouldRefund/100)|currency}}</p>
            <p>(含快递{{row.isFreePostage?0:(row.moneyPostageShouldRefund/100)}}元)</p>
          </div>
        </template>
        <template slot="orderType" slot-scope="{ index,row }">
          <template v-for="s in orderType" v-if="s.value === row.orderType">{{s.label}}</template>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <div class="center">
            <el-button @click="handleDetail(row)" type="text" size="small">详情</el-button>
            <el-button type="primary" style="margin:0" size="mini" @click="handleExpress(row)">查看物流</el-button>
          </div>
        </template>
        <template slot="statusPlatform" slot-scope="{ index,row }">
          <div class="center">
            <p>{{returnStatusPlatformValue(row.statusPlatform)}}</p>
            <p v-if="row.statusPlatform==4">金额：{{(row.moneyOrderRefund/100)|currency}}</p>
            <p v-if="row.statusPlatform==3 || row.statusPlatform==4">操作人：{{returnStaffList(row.platformEmployeeId)}}</p>
            <p v-if="row.statusPlatform==3 || row.statusPlatform==4">时间：{{row.platformDisposeTime}}</p>
            <p v-if="row.statusPlatform==3 || row.statusPlatform==4">备注：{{row.platformRemarks}}</p>
          </div>
        </template>
        <template slot="applicationTime" slot-scope="{ index,row }">
          <span v-if="!!row.onlineCustomerServiceSkus">{{row.onlineCustomerServiceSkus[0].createTime}}</span>
        </template>
        <template slot="payTime" slot-scope="{ index,row }">
          <span v-if="!!row.payOrder">{{row.payOrder.payTime}}</span>
        </template>
      </table-sub>
      <!-- </tree-sidebar-table> -->
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList">
        <template slot="dialog" v-if="isEvaluate">
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
        <template slot="dialog" v-else>
          <h2>用户未评价</h2>
        </template>
      </dialog-sub>
      <!-- 订单详情 -->
      <dialog-sub :dialog="orderDialog" @close="handleClose" @reset="handleClose">
        <template slot="dialog">
          <online-info :dialog="orderDialog" v-if="orderDialog.saveFormVisible"></online-info>
        </template>
      </dialog-sub>

      <dialog-sub :dialog="dialog2">
        <template slot="dialog">
          <div>
            <h3 v-if="!logistics">暂无物流信息</h3>
            <div v-else>
              <span>{{courierData[logisticsCode]}}：{{logisticsNo}}</span>
              <el-steps direction="vertical" :active="1" style="margin-top: 10px;">
                <el-step :title="item.context" :description="item.time" v-for="(item,index) in dialog2.ruleForm2.items" :key="index"></el-step>
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
  import {currency} from "@/filters"
  import onlineInfo from '../../orderManagement/onlineInfo';

  export default {

    data() {
      let query = this.$route.query || {};
      let statusPlatform = [{
        label: '客服处理中',
        value: 2
      }, {
        label: '驳回',
        value: 3
      }, {
        label: '退款',
        value: 4
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
        reverse: true,
        citys: ['storeProvince', 'storeCity', 'storeRegion'],
        logoVisible: false,
        searchBool: false,
        format,
        statusPlatform,
        courierData,
        query: {},
        isEvaluate: 0,
        logistics: true,
        express: {},
        logisticsCode: '',
        logisticsNo: 0,

        quickSearch: {
          isTimeRange: true,
          isShow: false,
          group: []
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字搜索',
          isText: true,
          placeholder: '订单号/退货单号全匹配/商品名称/买家编号/手机/姓名'
        }, {
          value: 'statusPlatform',
          label: '',
          name: '售后状态',
          isSelect: true,
          list: statusPlatform
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
            value: 'refundOrderNo',
            label: '售后单号',
            width: '100'
          }, {
          //   value: 'applicationTime',
          //   label: '申请时间',
          //   width: '140',
          //   slotBool: true
          // }, {
            value: 'disposeTime',
            label: '申请时间',
            width: '140'
          }, {
            value: 'onlineOrderNo',
            label: '订单编号',
            width: '100'
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
            width: '120',
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
            value: 'statusPlatform',
            label: '售后状态',
            width: '180',
            slotBool: true
          }, {
            value: 'amountPayable',
            label: '应退金额',
            width: '120',
            slotBool: true
          }]
        },

        dialog: {
          width: "400px",
          addBool: true,
          readBool: true,
          titleText: '',
          saveFormVisible: false,
          type: 'permission',
          isTable: true,
          ruleForm2: {
            items:{}
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
            items:[]
          },
          rules2: {}
        },
        orderDialog: {
          saveFormVisible: false,
          width: '1000px',
          shopType: 2,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true,
          tableBool: true
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
          shopType: 2,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true
        },
        optionsService:[],
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
      onlineInfo,
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
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter,
        }, queryPo,quick);

        let resData = await this.Api.getRefundApply(para);
        return resData;
      },
      async handleDetail(row) {
        this.orderDialog.refundOrderNo = row.refundOrderNo;
        this.orderDialog.serviceOrderId = row.id;
        this.orderDialog.id = row.onlineOrder==null?'':row.onlineOrder.id;
        this.orderDialog.refund = true;
        this.orderDialog.refundStatus = row.statusPlatform==2?true:false;
        this.orderDialog.saveFormVisible = true;
        let resData = await this.Api.getServiceRecord({onlineOrderId: row.onlineOrder.id});
        this.orderDialog.serviceRecord = resData.data;
        // console.log("1231231",resData)
      },
      async handleExpress(row) {
        this.dialog2.saveFormVisible = true;
        if(row.logisticsCode==null || row.logisticsNo==null){
          this.logistics = false;
        }else{
          this.logistics = true;
          this.logisticsCode = row.logisticsCode;
          this.logisticsNo = row.logisticsNo;
          let resData = await this.Api.expressInfo({
            emsCode: row.logisticsCode,
            emsCompCode: row.logisticsNo
                    // emsCode: 'zhongtong',
                    // emsCompCode: '75136982053770'
          });
          if (resData.status == 1) {
            this.dialog2.ruleForm2.items = JSON.parse(resData.data).data;
            this.express = JSON.parse(resData.data);
            if(this.dialog2.ruleForm2.items == null){
              this.logistics = false;
            }
          }
        }
      },
      async handleEvaluateDetail(params,index) {
        this.dialog.saveFormVisible = true;
        let res = await this.Api.findEvaluateDetails({
          onlineOrder: {id: params.id},
          goods: {id: params.onlineCustomerServiceSkus[index].goods.id}
        });
        if (res.status == 1) {
          this.dialog.ruleForm2 = res.data;
        }
        if(this.dialog.ruleForm2 == null){
          isEvaluate = 1
        }
      },
      // returnStatusValue(type) {
      //   switch (type) {
      //     case 1:
      //       return '已创建待支付';
      //     case 2:
      //       return '已支付待发货';
      //     case 3:
      //       return '已发货待收货';
      //     case 4:
      //       return '已收货/已完成';
      //     case 5:
      //       return '已关闭';
      //   }
      // },
      returnStatusPlatformValue(type) {
        switch (type) {
          case 1:
            return '未申请';
          case 2:
            return '客服介入中';
          case 3:
            return '驳回';
          case 4:
            return '退款';
          case 5:
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
      },
      returnStaffList(id) {
        for(var i=0;i<this.optionsService.length;i++){
          if(this.optionsService[i].id == id){
            return this.optionsService[i].name;
          }
        }
      },
      handleClose(){
        bus.$emit("loadDialogData");
      }
    },
    async created() {
      var resService = await this.Api.getStaffList({});
      this.optionsService = this.$plug.public.transformList(resService.data.list, 'id', 'name');
    },
    computed: {},
    async mounted() {
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .center {
    text-align: center;
    p {
      margin: 0;
      padding: 0;
    }
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

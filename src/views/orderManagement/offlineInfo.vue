<template>
  <el-container class="info-page-wrapper">
    <el-header>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="0">订单详情</el-radio-button>
      </el-radio-group>
    </el-header>
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main>
        <div class="info-page-box">
          <template v-if="activeName == 0">
            <div class="wrapper-box">
              <div class="info-list">
                <h4 class="step-title-tag"><i class="icon-tag"></i>订单状态</h4>
                  <el-steps :active="orderStatus" align-center>
                    <!-- <el-step title="提交订单" :description="source.createTime"></el-step>
                    <el-step title="支付订单" :description="source.payOrder==null?'':format(new Date(source.payOrder.payTime), 'yyyy-MM-dd hh:mm:ss')"></el-step>
                    <el-step title="完成评价" :description="source.offlineOrderEvaluateRecord==null?'':source.offlineOrderEvalu -->
                    <el-step title="提交订单"></el-step>
                    <el-step title="支付订单"></el-step>
                    <el-step title="完成评价"></el-step>
                  </el-steps>
              </div>
              <div class="info-list">
                <h4 class="step-title-tag"><i class="icon-tag"></i>订单信息</h4>
                <table class="form-table">
                  <tr>
                    <td>订单编号：</td>
                    <td>
                      {{source.orderNo}}
                    </td>
                  </tr>
                  <tr>
                    <td>订单状态：</td>
                    <td>
                      <span>{{returnStatusValue(source.status)}}</span>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="info-list">
                <h4 class="step-title-tag"><i class="icon-tag"></i>买家信息</h4>
                <table class="form-table">
                  <tr>
                    <td>支付流水号：</td>
                    <td>
                      {{source.payOrder!=null?source.payOrder.payOrderNo:''}}
                    </td>
                  </tr>
                  <tr>
                    <td>支付方式：</td>
                    <td>
                      <span v-if="!!source.payOrder">{{returnTypeValue(source.payOrder.payPlatformType)}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>买家：</td>
                    <td>
                      {{source.member==null?'':source.member.nickname}}
                    </td>
                  </tr>
                  <tr>
                    <td>买家编号：</td>
                    <td>
                      {{source.member==null?'':source.member.code}}
                    </td>
                  </tr>
                </table>
              </div>
              <div class="info-list">
                <h4 class="step-title-tag"><i class="icon-tag"></i>卖家信息</h4>
                <table class="form-table">
                  <tr>
                    <td>商家：</td>
                    <td>
                      {{source.store==null?'':source.store.name}}
                    </td>
                  </tr>
                  <tr>
                    <td>商家编号：</td>
                    <td>
                      {{source.store==null?'':source.store.code}}
                    </td>
                  </tr>
                  <tr>
                    <td>商户类型：</td>
                    <td>
                      {{returnStoreValue(source.store==null?'':source.store.type)}}
                    </td>
                  </tr>
                  <tr>
                    <td>合约折扣：</td>
                    <td>
                      {{source.store==null?'':source.store.rateConfig==null?'':(source.store.rateConfig.storeRateBase*100)/10}}折
                    </td>
                  </tr>
                  <tr>
                    <td>地址：</td>
                    <td>
                      {{source.store==null?'':source.store.address}}
                    </td>
                  </tr>
                </table>
              </div>
              <div class="info-list">
                <h4 class="step-title-tag"><i class="icon-tag"></i>支付信息</h4>
                <table class="form-table" style="margin-bottom: 20px;">
                  <tr>
                    <td>奖励积分：</td>
                    <td>
                      {{(source.integralGift/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>消费红包：</td>
                    <td>
                      ¥{{(source.luckmoneyConsume/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>分享红包：</td>
                    <td>
                      ¥{{(source.luckmoneyShare/100)|currency}}
                    </td>
                  </tr>
                </table>
                <table class="form-table">
                  <tr>
                    <td>消费金额：</td>
                    <td>
                      ¥{{(source.moneyOrderPayable/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>不参与优惠金额：</td>
                    <td>
                      ¥{{(source.discountStoreBan/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>店铺折扣：</td>
                    <td>
                      {{source.store==null?'':source.store.rateConfig==null?'':source.store.rateConfig.storeRateBase*10}}折/-¥{{source.discountStore!=null?((source.discountStore/100)|currency):''}}
                    </td>
                  </tr>
                  <tr>
                    <td>应付金额：</td>
                    <td>
                      ¥{{(source.moneyOrderPayable/100-source.discountStore/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>抵扣红包：</td>
                    <td>
                      -¥{{(source.redEnvelopePay/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>支付金额：</td>
                    <td>
                      ¥{{((source.moneyOrderPay*100-source.redEnvelopePay*100)/10000)|currency}}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </template>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {format} from "../../utils";
  import {currency} from "@/filters"

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        format: format,
        source: {},
        activeName: 0,
        orderStatus: 0
      }
    },
    filters: {
      currency: currency
    },
    components: {
    },
    methods: {
      async getSource() {
        let res = await this.Api.getOfflineOrdeDetail({orderId: this.dialog.id});
        if (res.status == 1) {
          this.source = res.data || {};
        }
        if(this.source.status != 5){
          if(this.source.status == 1){
            this.orderStatus = 1;
          }else if(this.source.isEvaluate == 1){
            this.orderStatus = 3;
          }
          else{
            this.orderStatus = 2;
          }
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
            return '钱兔';
        }
      },
      returnStoreValue(type) {
        switch (type) {
          case '1':
            return '种子店';
          case '2':
            return '特色店';
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
        }
      }
    },
    created() {
    },
    mounted() {
      this.getSource();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.wrapper-box{
  position: relative;
  padding-bottom: 50px;
  font-size: 14px;
  padding: 0 20px 20px;
  .el-card {
    margin-top: 10px;
  }
  .el-steps {
    margin-bottom: 10px;
  }
  .fifty {
    width: 49%;
    float: left;
    border-right: 1px dashed #e4e4e4;
    margin-right: 1%;
    h3 {
      margin: 5px 0;
    }
  }
  .right {
    float: right;
  }
  .operate-box{
    position: absolute;
    top: 0;
    right: 0;
    span{
      margin-right: 15px;
      font-size: 20px;
      color: #f0c;
    }
  }
  h2{
    font-weight: 200;
  }
}
.form-table {
  width: 100%;
}
</style>

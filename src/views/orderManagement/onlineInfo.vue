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
                <el-steps :active="orderStatus" align-center v-if="stepClose">
                  <el-step title="提交订单"></el-step>
                  <el-step :title="closes"></el-step>
                  <el-step title="支付订单"></el-step>
                  <el-step title="发货"></el-step>
                  <el-step title="确认"></el-step>
                </el-steps>
                <el-steps :active="orderStatus" align-center v-else>
                  <el-step title="提交订单"></el-step>
                  <el-step title="支付订单"></el-step>
                  <el-step title="发货"></el-step>
                  <el-step title="确认"></el-step>
                </el-steps>
              </div>
              <div class="info-list">
                <h4 class="step-title-tag"><i class="icon-tag"></i>订单信息</h4>
                <table class="form-table">
                  <tr>
                    <td>订单编号：</td>
                    <td colspan="3">
                      {{source.orderNo}}
                    </td>
                  </tr>
                  <tr>
                    <td>订单状态：</td>
                    <td colspan="3">
                      <span>{{returnStatusValue(source.status)}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>物流信息</td>
                    <td>
                      <el-popover placement="bottom" width="500" trigger="click">
                        <div style="max-height:500px;overflow-y: auto;">
                          <h3 v-if="!logistics">暂无物流信息</h3>
                          <div v-else>
                            <span>{{courierData[logisticsCode]}}：{{logisticsNo}}</span>
                            <el-steps direction="vertical" :active="1" style="margin-top: 10px;">
                              <el-step :title="item.context" :description="item.time" v-for="(item,index) in items" :key="index"></el-step>
                            </el-steps>
                          </div>
                        </div>
                        <el-button class="refund-btn" style="width:auto" slot="reference" type="text" @click="handleExpress(source)">查看物流</el-button>
                      </el-popover>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="info-list">
                <h4 class="step-title-tag"><i class="icon-tag"></i>买家信息</h4>
                <table class="form-table">
                  <tr>
                    <td>收货地址：</td>
                    <td>
                      {{source.province}} {{source.city}} {{source.region}} {{source.address}}
                    </td>
                  </tr>
                  <tr>
                    <td>买家留言：</td>
                    <td>
                      {{source.remarks}}
                    </td>
                  </tr>
                  <tr>
                    <td>买家：</td>
                    <td>
                      {{source.name}}
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
                <h4 class="step-title-tag"><i class="icon-tag"></i>商家信息</h4>
                <table class="form-table">
                  <!-- <tr>
                    <td>发货地址：</td>
                    <td>
                      {{source.address}}
                    </td>
                  </tr> -->
                  <tr>
                    <td>商家：</td>
                    <td>
                      {{source.shop==null?'':source.shop.nickName}}
                    </td>
                  </tr>
                  <tr>
                    <td>商家编号：</td>
                    <td>
                      {{source.shop==null?'':source.shop.code}}
                    </td>
                  </tr>
                </table>
              </div>
              <div class="info-list">
                <h4 class="step-title-tag"><i class="icon-tag"></i>商品列表</h4>
                  <el-table :data="source.onlineOrderSkuList" border style="width: 100%;max-height: 300px;overflow-y: auto;"><el-table-column
                    label="商品"
                    width="250">
                    <template slot-scope="scope">
                      <div class="container-box">
                        <div class="container-img">
                          <el-popover
                            placement="top"
                            trigger="click"
                            popper-class="tootip-img-box"
                            v-model="logoVisible">
                              <img :src="scope.row.picUrl">
                            <img slot="reference" :src="scope.row.picUrl" width="80" height="80">
                          </el-popover>
                        </div>
                        <div class="container-content">
                          <p>{{scope.row.goodsTitle}}</p>
                          <p>规格：{{scope.row.goodsSkuName}}</p>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="市场价">
                    <template slot-scope="scope">
                      <p>{{ (scope.row.priceSell/100)|currency }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="会员价">
                    <template slot-scope="scope">
                      <p>{{ (scope.row.priceSellDiscount/100)|currency }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="num" label="数量"></el-table-column>
                </el-table>
              </div>
              <div class="info-list">
                <h4 class="step-title-tag"><i class="icon-tag"></i>支付信息</h4>
                <table class="form-table">
                  <tr>
                    <td>返积分：</td>
                    <td>
                      {{(source.integralGift/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>商品总价：</td>
                    <td>
                      ¥{{(source.moneyOrderPayable/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>平台补贴（积分）：</td>
                    <td>
                      ¥{{(source.integralReducePay/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>运费（快递）：</td>
                    <td>
                      ¥{{(source.moneyPostagePay/100)|currency}}
                    </td>
                  </tr>
                  <tr>
                    <td>应付金额：</td>
                    <td>
                      ¥{{(source.moneyOrderPay/100)|currency}}
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
                  <tr>
                    <td>支付方式：</td>
                    <td>
                      {{returnPayPlatformType(source.payOrder==null?'':source.payOrder.payPlatformType)}}
                    </td>
                  </tr>
                </table>
              </div>
              <div class="info-list" v-if="refund">
                <h4 class="step-title-tag"><i class="icon-tag"></i>售后处理</h4>
                <table class="form-table">
                  <tr>
                    <td>商家售后记录：</td>
                    <td>
                      <ul class="record-box">
                        <li v-for="(item,index) in dialog.serviceRecord" :key="index">
                          <el-popover placement="top" width="500" trigger="click">
                            <table class="form-table">
                              <tr>
                                <td>退款类型：</td>
                                <td>
                                  <span>{{returnOrderType(serviceRecordList.orderType)}}</span>
                                </td>
                              </tr>
                              <tr>
                                <td>订单编号：</td>
                                <td>
                                  <span>{{serviceRecordList.onlineOrderNo}}</span>
                                </td>
                              </tr>
                              <tr>
                                <td>服务单号：</td>
                                <td>
                                  <span>{{serviceRecordList.refundOrderNo}}</span>
                                </td>
                              </tr>
                              <tr>
                                <td>最近申请时间：</td>
                                <td>
                                  <span>{{serviceRecordList.createTime}}</span>
                                </td>
                              </tr>
                              <tr>
                                <td>应付金额：</td>
                                <td>
                                  <span>{{(serviceRecordList.moneyOrderPay/100)|currency}}</span>
                                </td>
                              </tr>
                              <tr>
                                <td>退款金额：</td>
                                <td>
                                  <span>{{(serviceRecordList.moneyOrderShouldRefund/100)|currency}}</span>
                                </td>
                              </tr>
                              <tr>
                                <td>商品：</td>
                                <td>
                                  <span v-for="(item,index) in serviceRecordList.onlineCustomerServiceSkus" :key="index">{{item.goodsTitle}}</span>&nbsp;
                                </td>
                              </tr>
                              <tr>
                                <td>退款原因：</td>
                                <td>
                                  <span v-if="serviceRecordList.orderType==1">{{returnCustomerServiceType(serviceRecordList.customerServiceType)}}</span>
                                  <span v-if="serviceRecordList.orderType==2">{{returnRefundType(serviceRecordList.refundType)}}</span>
                                </td>
                              </tr>
                              <tr>
                                <td>图片：</td>
                                <td>
                                  <div v-for="(item,index) in pic" :key="index" v-if="pic[0]!=''" class="img-item">
                                    <el-popover placement="top" trigger="click">
                                      <img :src="item" width="300" height="300" class="pic"/>
                                      <img class="refund-btn pic" slot="reference" :src="item" width="40" height="40"/>
                                    </el-popover>
                                  </div>
                                  <!-- <img v-for="(item,index) in pic" :key="index" :src="item" width="40" height="40" class="pic" v-if="pic[0]!=''"/> -->
                                </td>
                              </tr>
                              <tr>
                                <td>说明：</td>
                                <td>
                                  <span>{{serviceRecordList.remarks}}</span>
                                </td>
                              </tr>
                              <tr>
                                <td>商家处理：</td>
                                <td>
                                  <span>{{returnStatus(serviceRecordList.status)}}</span>
                                </td>
                              </tr>
                              <tr>
                                <td>商家备注：</td>
                                <td>
                                  <span>{{serviceRecordList.shopRemarks}}</span>
                                </td>
                              </tr>
                            </table>
                            <el-button class="refund-btn" slot="reference" type="text" @click="handleServiceRecord(item)">
                              <span style="color:#333">售后编号：</span>{{item}}
                            </el-button>
                          </el-popover>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>售后处理：</td>
                    <td v-if="refundStatus">
                      <el-popover placement="top" width="500" trigger="click" title="驳回退款申请" v-model="visible">
                        <table class="form-table">
                          <tr>
                            <td><i class="red-star">*</i>操作备注：</td>
                            <td>
                              <el-input type="textarea" height="150px" placeholder="输入操作备注" v-model="platformRemarks">
                              </el-input>
                            </td>
                          </tr>
                          <tr>
                            <td>操作：</td>
                            <td>
                              <el-button class="refund-btn" slot="reference" @click="visible = false">取消</el-button>
                              <el-button class="refund-btn" slot="reference" type="primary" @click="handleRefuse(dialog.serviceOrderId)">确认驳回</el-button>
                            </td>
                          </tr>
                        </table>
                        <el-button class="refund-btn" slot="reference" type="danger">驳回申请</el-button>
                      </el-popover>
                      <el-popover placement="top" width="500" trigger="click" title="强制退款" v-model="visible2">
                        <table class="form-table">
                          <tr>
                            <td>退款金额：</td>
                            <td>
                              ¥{{(serviceRecordList.moneyOrderShouldRefund/100)|currency}}
                            </td>
                          </tr>
                          <tr>
                            <td><i class="red-star">*</i>操作备注：</td>
                            <td>
                              <el-input type="textarea" height="150px" placeholder="输入操作备注" v-model="platformRemarks">
                              </el-input>
                            </td>
                          </tr>
                          <tr>
                            <td>操作：</td>
                            <td>
                              <el-button class="refund-btn" slot="reference" @click="visible2 = false">取消</el-button>
                              <el-button class="refund-btn" slot="reference" type="primary" @click="handleRefund(dialog.serviceOrderId)">确认退款</el-button>
                            </td>
                          </tr>
                        </table>
                        <el-button class="refund-btn" slot="reference" type="primary">强制退款</el-button>
                      </el-popover>
                    </td>
                    <td v-else>
                      <span>已处理</span>
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
  <!-- <div class="wrapper-box">

    <el-row :gutter="20">
      <el-col :span="24">操作记录</el-col>
    </el-row>

    <el-table
      :data="source.onlineOrderSkuList"
      border
      style="width: 100%">
      <el-table-column
        label="操作人"
        width="">
      </el-table-column>
      <el-table-column
        prop="title"
        label="操作时间">
      </el-table-column>
      <el-table-column
        prop="title"
        label="订单状态">
      </el-table-column>
      <el-table-column
        prop="num"
        label="发货状态">
      </el-table-column>
      <el-table-column
        prop="title"
        label="状态">
      </el-table-column>
    </el-table>

  </div> -->
</template>

<script>
  import {format} from "../../utils";
  import TableSub from '@/components/TableSub'
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
        visible: false,
        visible2: false,
        visible3: false,
        dialogVisible: false,
        dialogType:1,
        logoVisible: false,
        source: {},
        serviceRecordList: {},
        activeName: 0,
        orderStatus: 0,
        platformRemarks: '',
        refund: 0,
        refundStatus: true,
        pic: [],
        items:[],
        courierData,
        express: {},
        logistics: true,
        stepClose: false,
        logisticsCode: '',
        logisticsNo: 0,
        closes: ''
      }
    },
    filters: {
      currency: currency
    },
    components: {
      TableSub
    },
    methods: {
      async getSource() {
        if(this.dialog.refundOrderNo != null){
          this.handleServiceRecord(this.dialog.refundOrderNo);
        }
        this.refund = this.dialog.refund;
        this.refundStatus = this.dialog.refundStatus;
        let res = await this.Api.getOnlineOrdeDetail({id: this.dialog.id});
        if (res.status == 1) {
          this.source = res.data || {};
        }
        
        if(this.source.status == 1){
          this.orderStatus = 1;
        }else if(this.source.status == 2){
          this.orderStatus = 2;
        }else if(this.source.status == 3){
          this.orderStatus = 3;
        }else{
          this.orderStatus = 4;
        }
        if(this.source.status == 7){
          this.stepClose = true;
          this.orderStatus = 2;
          this.closes = '已取消'
        }
        if(this.source.status == 5){
          this.stepClose = true;
          this.orderStatus = 2;
          this.closes = '已关闭'
        }
      },
      async handleExpress(row) {
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
      returnStatus(type) {
        switch (type) {
          case 1:
            return '待处理';
          case 2:
            return '已受理/处理中';
          case 3:
            return '待退货';
          case 4:
            return '退货中';
          case 5:
            return '已签收/待退款';
          case 6:
            return '已完成';
          case 7:
            return '已关闭';
          case 8:
            return '已拒绝';
        }
      },
      returnOrderType(type) {
        switch (type) {
          case 1:
            return '退货退款';
          case 2:
            return '仅退款';
          case 3:
            return '仅退货';
          case 4:
            return '其他';
        }
      },
      returnRefundType(type) {
        switch (type) {
          case 1:
            return '不喜欢/不想要';
          case 2:
            return '空包裹';
          case 3:
            return '未按约定时间发货';
          case 4:
            return '快递/物流一直未送到';
          case 5:
            return '快递/物流无跟踪记录';
          case 6:
            return '货物破损已签收';
        }
      },
      returnCustomerServiceType(type) {
        switch (type) {
          case 1:
            return '七天无理由退货';
          case 2:
            return '商品成分描述不符、生产日期/保质期和商品描述不符';
          case 3:
            return '图片/产地/批号/规格等描述不符';
          case 4:
            return '质量问题';
          case 5:
            return '少件';
          case 6:
            return '收到商品时有破损/污渍/变形';
          case 7:
            return '假冒品牌';
          case 8:
            return '未按约定时间发货';
          case 9:
            return '卖家发错货';
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
            return '已收货';
          case 5:
            return '已关闭';
          case 6:
            return '已完成';
          case 7:
            return '已取消';
        }
      },
      returnPayPlatformType(type) {
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
      async handleRefuse(row) {
        if(this.platformRemarks === ''){
          this.$message({
            message: '请输入操作备注！！！',
            type: 'warning'
          });
        }else{
          await this.Api.getServiceRefuse({
            onlineCustomerServiceOrderId: row,
            platformRemarks: this.platformRemarks
          });
          this.refundStatus = false;
        }
      },
      async handleRefund(row) {
        if(this.platformRemarks === ''){
          this.$message({
            message: '请输入操作备注！！！',
            type: 'warning'
          });
        }else{
          await this.Api.getServiceSuccess({
            onlineCustomerServiceOrderId: row,
            platformRemarks: this.platformRemarks
          });
          this.refundStatus = false;
        }
      },
      async handleServiceRecord(row) {
        let resData = await this.Api.findServiceRecord({
          refundOrderNo: row
        });
        if (resData.status == 1) {
          this.serviceRecordList = resData.data || {};
        }
        let str=resData.data.refundGoodsPic;
        console.log("resData1231231",str)
        this.pic=str.split(",");
        console.log("resData",this.pic)
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
  .el-table {
    margin-top: 10px;
  }
  .refund-btn {
    width: 48%;
  }
  .record-box {
    margin: 0;
    padding: 0 5px;
    width: 100%;
    height: 120px;
    overflow-y: auto;
    border: 1px solid #e4e4e4;
  }
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
  .go-back{
    position: absolute;
    top: 0;
    right: 10px;
  }
  h2{
    font-weight: 200;
  }
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
.form-table {
  width: 100%;
}
.pic {
  margin: 0 4px;
}
.img-item {
  float: left;
}
</style>

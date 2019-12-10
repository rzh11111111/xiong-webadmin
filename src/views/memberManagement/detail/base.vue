<template>
	<div>
    <div class="info-list">
      <h4 class="step-title-tag"><i class="icon-tag"></i>会员信息</h4>
      <table class="form-table">
        <tr>
          <td>头像：</td>
          <td>
            <img :src="source.headPicUrl" width="100" height="100"/>
          </td>
          <td>编号：</td>
          <td>
            <span>{{source.code}}</span>
          </td>
        </tr>
        <tr>
          <td>昵称：</td>
          <td>
            <span>{{source.nickname}}</span>
          </td>
          <td>性别：</td>
          <td>
            <span>{{source.sex == 1 ? '男' : '女'}}</span>
          </td>
        </tr>
        <tr>
          <td>生日：</td>
          <td>
            <span>{{source.birthday}}</span>
          </td>
          <td>最近登陆城市：</td>
          <td>
            <span></span>
          </td>
        </tr>
        <tr>
          <td>注册时间：</td>
          <td>
            <span>{{source.createTime}}</span>
          </td>
          <td>注册来源：</td>
          <td>
            <span></span>
          </td>
        </tr>
      </table>
    </div>
    <div class="info-list">
      <table class="form-table">
        <tr>
          <td>收藏线上店铺：</td>
          <td>
            <el-popover
              placement="top"
              width="427"
              trigger="click">
              <el-table :data="dialog.shopsList" border>
                <el-table-column width="200" property="code" label="店铺编码"></el-table-column>
                <el-table-column width="200" property="nickName" label="店铺名"></el-table-column>
              </el-table>
              <el-button slot="reference" size="medium" @click="handleShopRecord(source.id)" type="text">查看</el-button>
            </el-popover>
          </td>
          <td>收藏线下店铺：</td>
          <td>
            <el-popover
              placement="top"
              width="427"
              trigger="click">
              <el-table :data="dialog.storesList" border>
                <el-table-column width="200" property="code" label="店铺编码"></el-table-column>
                <el-table-column width="200" property="name" label="店铺名"></el-table-column>
              </el-table>
              <el-button slot="reference" size="medium" @click="handleStoreRecord(source.id)" type="text">查看</el-button>
            </el-popover>
          </td>
        </tr>
        <tr>
          <td>生产企业评论：</td>
          <td>
            <el-button type="text" @click="handleMsfrEvaluate(source.code)" size="medium">查看</el-button>
          </td>
          <td>同城企业评论：</td>
          <td>
            <el-button type="text" @click="handleCityEvaluate(source.code)" size="medium">查看</el-button>
          </td>
        </tr>
        <tr>
          <td>线下评论：</td>
          <td>
            <el-button type="text" @click="handleEvaluateDetail(source.code)" size="medium">查看</el-button>
          </td>
          <td>收货地址：</td>
          <td>
            <el-button type="text" @click="handleIntegralAddress(source.phone)" size="medium">查看</el-button>
          </td>
        </tr>
      </table>
    </div>
    <div class="info-list">
      <table class="form-table">
        <!-- <tr>
          <td>下单总金额：</td>
          <td>
            
          </td>
        </tr>
        <tr>
          <td>线上下单笔数：</td>
          <td>
            <el-button @click="handleOnlineOrderList(source.code)" size="mini" class="card-margin" type="text">6456</el-button>
          </td>
        </tr>
        <tr>
          <td>线下下单笔数：</td>
          <td>
            <el-button @click="handleOfflineOrderList(source.code)" size="mini" class="card-margin" type="text">88908</el-button>
          </td>
        </tr>
        <tr>
          <td>已退款总金额：</td>
          <td>
          </td>
        </tr>
        <tr>
          <td>已退款笔数：</td>
          <td>
            <el-button @click="dialogVisible = true,dialogType=6" size="mini" class="card-margin" type="text">68786</el-button>
          </td>
        </tr> -->
        <tr>
          <td>可用红包余额：</td>
          <td>
            {{source.memberLuckmoneyAccount!=null?source.memberLuckmoneyAccount.money/100:''}}
          </td>
        </tr>
        <tr>
          <td>不可用红包余额：</td>
          <td>
            {{source.memberLuckmoneyAccount!=null?source.memberLuckmoneyAccount.moneyDisable/100:''}}
          </td>
        </tr>
        <tr>
          <td>红包记录：</td>
          <td>
            <el-button @click="handleLuckmoneyAccountRecord(source)" type="text">查看</el-button>
          </td>
        </tr>
        <tr>
          <td>可用积分：</td>
          <td>
            <el-button @click="handleIntegralAccountRecord(source)" type="text">{{source.memberIntegralAccount!=null?source.memberIntegralAccount.integral/100:''}}</el-button>
          </td>
        </tr>
      </table>
    </div>
    <!-- <el-dialog :visible.sync="dialogVisible" title="" width="750px" center v-if="dialogType==6">
      <el-table :data="source.shops" border style="width: 100%">
        <el-table-column prop="code" label="订单编号"></el-table-column>
        <el-table-column prop="title" label="订单金额"></el-table-column>
        <el-table-column prop="code" label="订单时间"></el-table-column>
        <el-table-column prop="title" label="支付方式"></el-table-column>
        <el-table-column prop="code" label="订单所属店铺类型"></el-table-column>
        <el-table-column prop="title" label="订单所属店铺名称"></el-table-column>
        <el-table-column prop="code" label="订单所属店铺ID"></el-table-column>
        <el-table-column prop="title" label="退款原因"></el-table-column>
      </el-table>
      <span slot="footer">
        <el-button size="medium" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog> -->
	</div>
</template>

<script>
	import {openExternal} from '@/utils';
  export default {
    props: {
      source: {
        type: Object,
        default() {
          return {
          };
        }
      }
    },
  data() {
    let isEnable = [{
      value: 0,
      label: '启用'
    }, {
      value: 1,
      label: '停用'
    }];
    let status = [{
      value: 1,
      label: '正常'
    }, {
      value: 2,
      label: '关闭'
    }, {
      value: 3,
      label: '冻结'
    }]
    return {
      dialog: {
        shopsList: [],
        storesList: []
      },
      isEnable,
      status,
      dialogVisible: false,
      gridData: [],
      integralList: [],
      luckmoneyList: [],
      dialogType:1,
      form: {},
      currentPage4: 4,
      statusLabel: ''
    }
  },
  methods: {
    async handleLuckmoneyAccountRecord(row) {
      let routeData = this.$router.resolve({
        path: '/finance/balance/redpackets',
        query: {code: row.code}
      });
      openExternal(routeData.href);
      // this.$router.push({path: '/finance/balance/redpackets/', query: {code: row.code}});
    },
    async handleIntegralAccountRecord(row) {
      let routeData = this.$router.resolve({
        path: '/finance/balance/score',
        query: {code: row.code}
      });
      openExternal(routeData.href);
      // this.$router.push({path: '/finance/balance/score/', query: {code: row.code}});
    },
    async handleIntegralAddress(id) {
      let routeData = this.$router.resolve({
        path: '/member/memberAddress',
        query: {id: id}
      });
      openExternal(routeData.href);
      // this.$router.push({path: '/member/memberAddress', query: {id: id}});
    },
    handleEvaluateDetail(code) {
      let routeData = this.$router.resolve({
        path: '/afterSale/evaluate/orderEvaluate',
        query: {memberCode: code}
      });
      openExternal(routeData.href);
      // this.$router.push({path: '/afterSale/evaluate/orderEvaluate', query: {memberCode: code}});
    },
    handleMsfrEvaluate(code) {
      let routeData = this.$router.resolve({
        path: '/afterSale/evaluate/msfrEvaluate',
        query: {memberCode: code}
      });
      openExternal(routeData.href);
      // this.$router.push({path: '/afterSale/evaluate/msfrEvaluate', query: {memberCode: code}});
    },
    handleCityEvaluate(code) {
      let routeData = this.$router.resolve({
        path: '/afterSale/evaluate/cityEvaluate',
        query: {memberCode: code}
      });
      openExternal(routeData.href);
      // this.$router.push({path: '/afterSale/evaluate/cityEvaluate', query: {memberCode: code}});
    },
    handleOfflineOrderList(code) {
      let routeData = this.$router.resolve({
        path: '/order/offlineOrderList',
        query: {memberCode: code}
      });
      openExternal(routeData.href);
      // this.$router.push({path: '/order/offlineOrderList', query: {memberCode: code}});
    },
    handleOnlineOrderList(code) {
      let routeData = this.$router.resolve({
        path: '/order/onlineOrderList',
        query: {memberCode: code}
      });
      openExternal(routeData.href);
      // this.$router.push({path: '/order/onlineOrderList', query: {memberCode: code}});
    },
    handleOnlineOrderList(code) {
      let routeData = this.$router.resolve({
        path: '/order/onlineOrderList',
        query: {memberCode: code}
      });
      openExternal(routeData.href);
      // this.$router.push({path: '/order/onlineOrderList', query: {memberCode: code}});
    },
    async handleShopRecord(id) {
      this.dialogType = 1;
      this.dialogVisible = true;
      let resData = await this.Api.collectShopRecord({memberId: id})
      this.dialog.shopsList = resData.data.list
    },
    async handleStoreRecord(id) {
      this.dialogType = 1;
      this.dialogVisible = true;
      let resData = await this.Api.collectStoreRecord({memberId: id})
      this.dialog.storesList = resData.data.list
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .el-dialog {
    z-index: 9999;
  }
  .el-pagination {
    text-align: center;
    margin: 10px 0;
  }
	.overview-box{
		.clearfix {
			h2 {
				float: left;
			}
		}
    .half-card {
      overflow: hidden;
      border-top: 1px dashed #e4e4e4;
      padding-top: 10px;
      margin-top: 10px;
      .half-card-half {
        width: 100%;
        overflow: hidden;
        .card-padding {
          padding: 8px 10px;
        }
        .card-margin {
          margin-bottom: 10px;
        }
      }
      .el-row {
        float: left;
        width: 50%;
      }
    }
		h2{
			font-size: 20px;
			padding: 0;
			margin: 0;
		}
		h6{
			padding: 0;
			margin: 0;
		}
		.el-col{
			span{
				color: #999;
			}
			em{
				display: block;
				font-style: normal;
				font-size: 26px;
			}
			label{
				color: #67C23A;
				font-weight: 200;
				font-size: 12px;
				cursor: pointer;
				&.icon-down{
					color: #F56C6C;
					.el-icon-back{
						transform: rotate(-90deg);
					}
				}
				&.icon-up{
					.el-icon-back{
						transform: rotate(90deg);
					}
				}


			}
		}
		.quick-menu-box{
			margin-top: 20px;
			p{
				margin-bottom: 15px;
				&:last-child{
					margin-bottom: 0;
				}
				.el-button{
					margin-right: 5%;
				}
			}
		}
	}
</style>

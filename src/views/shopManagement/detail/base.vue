<template>
		<div class="overview-box">
			<el-card shadow="never">
			  <div slot="header" class="clearfix">
			    <h2>{{source.nickName}}</h2>
			  </div>
			  <el-row :gutter="20">
			    <el-col :span="6">
						<span class="link-text" @click.stop="handleDetail(1)">出售中商品</span>
						<!-- <em>999</em> -->
						<!-- <label @click.stop="handleDetail(1)">查看详情</label> -->
						<!-- <label class="icon-up"><i class="el-icon-back"></i>30%</label> -->
			    </el-col>
			    <el-col :span="6">
						<span class="link-text" @click.stop="handleDetail(0)">未出售商品</span>
						<!-- <em>999</em> -->
						<!-- <label @click.stop="handleDetail(0)">查看详情</label> -->
						<!-- <label class="icon-down"><i class="el-icon-back"></i>30%</label> -->
			    </el-col>
			   <!--  <el-col :span="6">
			    		<span>近30天订单数</span>
			    		<em>999</em>
						<label class="icon-down"><i class="el-icon-back"></i>30%</label>
			    </el-col>
			    <el-col :span="6">
						<span>近30天评价次数</span>
						<em>999</em>
			    </el-col> -->
			  </el-row>
			</el-card>
			<el-form style="margin-top: 20px;">
				<el-form-item label="店铺状态">
					<el-select v-model="source.isEnable" @change="changeShopEnable" style="width: 100px;" :disabled="source.delFlag == 2">
						<el-option v-for="i in isEnable" :key="i.value" :value="i.value" :label="i.label"></el-option>
					</el-select>
					<el-select v-model="source.status" @change="changeShopStatus" @visible-change="prevVal" style="width: 100px;" :disabled="source.delFlag == 2">
						<el-option v-for="s in status" :key="s.value" :value="s.value" :label="s.label"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<!-- <div class="quick-menu-box">
				<el-card shadow="never">
				  <el-table :data="gridData">
				    <el-table-column property="date" label="时间" width="150"></el-table-column>
				    <el-table-column property="name" label="操作人" width="200"></el-table-column>
				    <el-table-column property="address" label="操作"></el-table-column>
				    <el-table-column property="remarks" label="备注"></el-table-column>
				  </el-table>
				</el-card>
			</div> -->
			<!-- <el-dialog :visible.sync="dialogVisible" title="操作提示" width="450px" center>
					<el-form ref="form" :model="form" label-width="100px">
					  <el-form-item label="操作">
					  	<template v-if="form.operate === 'isEnable'">
					  		<span v-for="i in isEnable" v-if="form.isEnable === i.value">{{i.label}}</span>
					  	</template>
					  	<template v-if="form.operate === 'status'">
					  		<span v-for="i in status" v-if="form.status === i.value">{{i.label}}</span>
					  	</template>
					  </el-form-item>
					  <el-form-item label="操作备注">
					    <el-input type="textarea" v-model="form.remarks" size="medium" :autosize="{ minRows: 5, maxRows: 8}"></el-input>
					  </el-form-item>
					</el-form>
					<span slot="footer">
						<el-button size="medium" @click="dialogVisible = false">取消</el-button>
						<el-button size="medium" type="primary" @click="handleOperate">确定</el-button>
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
	  		},
	  		// 1生产企业 2同城企业
	  		shopType: {
	  		  type: Number,
	  		  default() {
	  		    return 1;
	  		  }
	  		},
	  		dialog: {
	  		  type: Object,
	  		  default() {
	  		    return {}
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
	    	isEnable,
	    	status,
	    	dialogVisible: false,
	    	gridData: [],
	    	form: {},
	    	statusLabel: ''
      }
    },
    methods: {
    	handleDetail(type) {
    		if (this.shopType === 1) {
    			if (type === 1) {
    				let routeData = this.$router.resolve({
    				  path: '/goods/productionGoods/proShelvesGoods',
    				  query: {shopNameOrCode: this.source.code}
    				});
    				openExternal(routeData.href);
    				return;
    			}
    			let routeData = this.$router.resolve({
    			  path: '/goods/productionGoods/proNoShelvesGoods',
    			  query: {shopNameOrCode: this.source.code}
    			});
    			openExternal(routeData.href);
    		} else {
    			if (type === 1) {
    				let routeData = this.$router.resolve({
    				  path: '/goods/sameCity/cityShelvesGoods',
    				  query: {shopNameOrCode: this.source.code}
    				});
    				openExternal(routeData.href);
    				return;
    			}
    			let routeData = this.$router.resolve({
    			  path: '/goods/sameCity/cityNoShelvesGoods',
    			  query: {shopNameOrCode: this.source.code}
    			});
    			openExternal(routeData.href);
    		}

    	},
    	changeShopEnable() {
    		let isEnable = '';
    		this.isEnable.forEach(item => {
    			if (item.value == this.source.isEnable) {
    				isEnable = item.label + '店铺';
    			}
    		})
    		this.$plug.prompt.del(this.handleOperateEnable, this.source, this.handleCancelEnable, isEnable);
    	},
    	async handleOperateEnable() {
    		let res = await this.Api.enableShop({id: this.source.id});
    		if (res.status === 1) {
    			this.$plug.prompt.saveTip('操作成功');
    			this.dialog.isChange = true;
    		} else {
    			this.handleCancelEnable();
    		}
    	},
    	handleCancelEnable() {
    		this.source.isEnable = this.source.isEnable === 1 ? 0 : 1;
    	},
    	prevVal(isVisible) {
    		if (isVisible) {
    			this.statusLabel = this.source.status;
    		}
    	},
    	changeShopStatus() {
    		let status = '';
    		this.status.forEach(item => {
    			if (item.value == this.source.status) {
    				status = item.label;
    			}
    		})
    		this.$plug.prompt.del(this.handleOperate, this.source, this.handleCancel, `更改店铺状态为${status}`);
    	},
    	handleCancel() {
    			this.source.status = this.statusLabel;
    	},
    	async handleOperate() {
    		let res = await this.Api.statusShop({
    				id: this.source.id,
    				status: this.source.status
    		});
    		if (res.status === 1) {
    			this.$plug.prompt.delTip('操作成功');
    			this.dialog.isChange = true;
    		} else {
    			this.handleCancel();
    		}
    	}
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
	.overview-box{
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

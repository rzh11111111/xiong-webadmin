<template>
		<div class="overview-box">
			<el-card shadow="never">
			  <div slot="header" class="clearfix">
			    <h2>
			    	<span style="vertical-align:top;margin-right:5px;">省区总：{{source.username}}</span>
			    	<img :src="source.headPicUrl" width="40" height="40" v-if="!!source.headPicUrl" />
			    </h2>
			  </div>
			  <el-row :gutter="20" style="margin-bottom: 20px;">
			  	<el-col :span="8">
			  		<span>下级合作商</span>
			  		<em class="link-text" @click="handleCooperation">{{sourceCount.countCooperation || 0}}</em>
			  	</el-col>
			  	<el-col :span="8">
			  		<span>下级推广员</span>
			  		<em class="link-text" @click="handleSpread">{{sourceCount.countSpread || 0}}</em>
			  	</el-col>
			    <el-col :span="8">
			    	<span>下辖种子店</span>
			    	<em class="link-text" @click="handleStore">{{sourceCount.countDutyAreaSeedStore || 0}}</em>
			    </el-col>
			  </el-row>
			  <el-row :gutter="20">
			    <el-col :span="8">
			    	<span>下辖特色店</span>
			    	<em class="link-text" @click="handleFeatureStore">{{sourceCount.countDutyAreaFeatureStore || 0}}</em>
			    </el-col>
			    <el-col :span="8">
			    	<span>下辖同城企业</span>
			    	<em class="link-text" @click="handleCityShop">{{sourceCount.countDutyAreaCityShop || 0}}</em>
			    </el-col>
			    <el-col :span="8">
			    	<span>推广的同城企业</span>
			    	<em class="link-text" @click="handleSpreadCityShop">{{sourceCount.countSpreadCityShop || 0}}</em>
			    </el-col>
			  </el-row>
			</el-card>
			<el-form style="margin-top: 20px;">
				<el-form-item label="账号状态">
					<el-select v-model="source.isEnable" @change="changeStoreEnable" style="width: 100px;" :disabled="source.delFlag == 2">
						<el-option v-for="i in isEnable" :key="i.value" :value="i.value" :label="i.label"></el-option>
					</el-select>
					<el-select v-model="source.status" @change="changeStoreStatus" @visible-change="prevVal" style="width: 100px;" :disabled="source.delFlag == 2">
						<el-option v-for="s in status" :key="s.value" :value="s.value" :label="s.label"></el-option>
					</el-select>
				</el-form-item>
			</el-form>

		<!-- 	<div class="quick-menu-box">
				<el-card shadow="never">
				  <el-table :data="gridData">
				    <el-table-column property="date" label="时间" width="150"></el-table-column>
				    <el-table-column property="name" label="操作人" width="200"></el-table-column>
				    <el-table-column property="address" label="操作"></el-table-column>
				    <el-table-column property="remarks" label="备注"></el-table-column>
				  </el-table>
				</el-card>
			</div> -->
			<store-dialog :dialog="subDialog"></store-dialog>
			<shop-dialog :dialog="shopDialog"></shop-dialog>
		</div>
</template>

<script>
	import {openExternal} from '@/utils';
	import StoreDialog from '../../storeManagement/storeListDialog';
	import ShopDialog from '../../shopManagement/shopListDialog';

	  export default {
	  	props: {
	  		source: {
	  			type: Object,
	  			default() {
	  				return {
	  					store: {
	  						rateConfig: {},
	  						managerSpread: {}
	  					},
	  					storeAccount: {}
	  				};
	  			}
	  		},
	  		sourceCount: {
	  			type: Object,
	  			default() {
	  				return {}
	  			}
	  		},
	  		dialog: {
	  			type: Object,
	  			default() {
	  				 return {};
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
	      	value5: 3.5,
	      	dialogVisible: false,
	      	gridData: [],
	      	form: {},
	      	statusLabel: '',
	      	subDialog: {
	      		titleText: '下辖特色店',
	      		width: '900px',
	      		saveFormVisible: false,
	      		appendToBody: true,
		    		btnBool: true,
	    			cancelBtnBool: true,
	    			closeBtnBool: true
	      	},
		    	shopDialog: {
		    		titleText: '推广的同城企业',
		    		width: '900px',
		    		saveFormVisible: false,
		    		appendToBody: true,
		    		btnBool: true,
		    		cancelBtnBool: true,
		    		closeBtnBool: true
		    	}
        }
      },
      components: {
      	StoreDialog,
      	ShopDialog
      },
    methods: {
    	changeStoreEnable() {
    		let isEnable = '';
    		this.isEnable.forEach(item => {
    			if (item.value == this.source.isEnable) {
    				isEnable = item.label;
    			}
    		})
    		this.$plug.prompt.del(this.handleOperateEnable, this.source, this.handleCancelEnable, isEnable);
    		// this.dialogVisible = true;
    		// this.form = Object.assign({operate: 'isEnable'}, this.source);
    	},
    	async handleOperateEnable() {
    		let res = await this.Api.enableMer({id: this.source.id});
    		if (res.status === 1) {
    			this.$plug.prompt.delTip('操作成功');
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
    	changeStoreStatus() {
    		let status = '';
    		this.status.forEach(item => {
    			if (item.value == this.source.status) {
    				status = item.label;
    			}
    		})
    		this.$plug.prompt.del(this.handleOperate, this.source, this.handleCancel, `更改状态为${status}`);
    	},
    	handleCancel() {
    			this.source.status = this.statusLabel;
    	},
    	async handleOperate() {
    		let res = await this.Api.statusMer({id: this.source.id, status: this.source.status});
    		if (res.status === 1) {
    			this.$plug.prompt.delTip('操作成功');
    			this.dialog.isChange = true;
    		} else {
    			this.handleCancel();
    		}
    	},
    	handleCooperation() {
    		let routeData = this.$router.resolve({
    		  path: '/user/partner',
    		  query: {merCode: this.source.code}
    		});
    		openExternal(routeData.href);
        // this.$router.push({path: '/user/partner', query: {merManagerType: 3, merCode: this.source.code}});
    	},
    	handleSpread(type) {
    		let routeData = this.$router.resolve({
    		  path: '/user/promoters',
    		  query: {merCode: this.source.code}
    		});
    		openExternal(routeData.href);
        // this.$router.push({path: '/user/promoters', query: {merManagerType: 3, merCode: this.source.code}});
    	},
    	handleStore() {
    		if (!this.source.managerDutyAreaConfigs) {
    			this.$message.error('没有下辖种子店');
    			return ;
    		}
    		let ids = this.source.managerDutyAreaConfigs.map(item => {
    			return item.areaConfig.id;
    		});
    		this.subDialog.areaIds = ids.join(',');
    		this.subDialog.type = 1;
    		this.subDialog.titleText = this.source.username + ' 下辖种子店';
    		this.subDialog.saveFormVisible = true;
    	  // this.$router.push({path: '/seller/storeList', query: {merManagerType: 3, merManagerLike: this.source.code, storeType: 1}});
    	},
    	handleFeatureStore() {
    		if (!this.source.managerDutyAreaConfigs) {
    			this.$message.error('没有下辖特色店');
    			return ;
    		}
    		let ids = this.source.managerDutyAreaConfigs.map(item => {
    			return item.areaConfig.id;
    		});
    		this.subDialog.areaIds = ids.join(',');
    		this.subDialog.type = 2;
    		this.subDialog.titleText = this.source.username + ' 下辖特色店';
    		this.subDialog.saveFormVisible = true;
        // this.$router.push({path: '/seller/storeList', query: {merManagerType: 3, merManagerLike: this.source.code, storeType: 2}});
    	},
    	handleCityShop() {
    		this.shopDialog.managerId = this.source.id;
    		this.shopDialog.titleText = this.source.username + ' 下辖同城企业';
    		this.shopDialog.saveFormVisible = true;
        // this.$router.push({path: '/seller/cityWide', query: {merManagerType: 3, merCode: this.source.code}});
    	},
    	handleSpreadCityShop() {
    		let routeData = this.$router.resolve({
    		  path: '/seller/cityWide',
    		  query: {spreadCode: this.source.code}
    		});
    		openExternal(routeData.href);
        // this.$router.push({path: '/seller/cityWide', query: {spreadCode: this.source.code}});
    	}
    },
    async mounted() {
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

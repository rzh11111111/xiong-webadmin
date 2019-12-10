<template>
		<div class="overview-box">
			<el-card shadow="never">
			  <div slot="header" class="clearfix" v-if="!!source.storeAccount">
			    <h2>
			    	<span style="vertical-align:top;margin-right:5px;">商户：{{source.storeAccount.userName}}</span>
			    	<!-- <img :src="source.headPicUrl" width="40" height="40" v-if="!!source.headPicUrl" /> -->
			    </h2>
			  </div>
			  <el-row :gutter="20">
			    <el-col :span="8">
			    	<span>推广的特色店</span>
			    	<em class="link-text" @click="handleSpread()">{{source.spreadSpecialCount}}</em>
			    </el-col>
			    <el-col :span="8">
			    	<span>推广的同城企业</span>
			    	<em class="link-text" @click="handleDetail">{{source.spreadShopCount}}</em>
			    </el-col>
			    <el-col :span="8">
			    	<span>管辖的门店</span>
			    	<em class="link-text" @click="handleMystore">{{source.myStoreCount}}</em>
			    </el-col>
			  </el-row>
			</el-card>
			<el-form style="margin-top: 20px;" v-if="!!source.storeAccount">
				<el-form-item label="账号状态">
					<el-select v-model="source.storeAccount.status" @change="changeStoreStatus" @visible-change="prevVal" style="width: 100px;" :disabled="source.storeAccount && source.storeAccount.delFlag == 2">
						<el-option v-for="s in status" :key="s.value" :value="s.value" :label="s.label"></el-option>
					</el-select>
					<el-select v-model="source.storeAccount.isEnable" @change="changeStoreEnable" style="width: 100px;" :disabled="source.storeAccount &&source.storeAccount.delFlag == 2">
						<el-option v-for="i in isEnable" :key="i.value" :value="i.value" :label="i.label"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<store-dialog :dialog="subDialog"></store-dialog>
		</div>
</template>

<script>
	import StoreDialog from '../../storeManagement/storeListDialog';
	import {openExternal} from '@/utils';
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
	    	value5: 3.5,
	    	dialogVisible: false,
	    	gridData: [],
	    	form: {},
	    	statusLabel: null,
	    	subDialog: {
	    		titleText: '推广的特色店',
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
    	StoreDialog
    },
    methods: {
    	changeStoreEnable() {
    		let isEnable = '';
    		this.isEnable.forEach(item => {
    			if (item.value == this.source.storeAccount.isEnable) {
    				isEnable = item.label + '当前商户的店铺';
    			}
    		})
    		this.$plug.prompt.del(this.handleOperateEnable, this.source, this.handleCancelEnable, isEnable);
    		// this.dialogVisible = true;
    		// this.form = Object.assign({operate: 'isEnable'}, this.source);
    	},
    	async handleOperateEnable() {
    		let res = await this.Api.enableSeller({id: this.source.storeAccount.id, isEnable: this.source.storeAccount.isEnable});
    		if (res.status === 1) {
    			this.$plug.prompt.delTip('操作成功');
    			this.dialog.isChange = true;
    		} else {
    			this.handleCancelEnable();
    		}
    	},
    	handleCancelEnable() {
    		this.source.isEnable = this.source.isEnable === '1' ? '0' : '1';
    	},
    	prevVal(isVisible) {
    		if (isVisible) {
    			this.statusLabel = this.source.storeAccount.status;
    		}
    	},
    	changeStoreStatus() {
    		let status = '';
    		this.status.forEach(item => {
    			if (item.value == this.source.storeAccount.status) {
    				status = item.label;
    			}
    		})
    		this.$plug.prompt.del(this.handleOperate, this.source, this.handleCancel, `更改账号状态为${status}`);
    		// this.dialogVisible = true;
    		// this.form = Object.assign({operate: 'status'}, this.source);
    	},
    	handleCancel() {
    			this.source.storeAccount.status = this.statusLabel;
    	},
    	async handleOperate() {
    		let res = await this.Api.enableSeller({id: this.source.storeAccount.id, status: this.source.storeAccount.status});
    		if (res.status === 1) {
    			this.$plug.prompt.delTip('操作成功');
    			this.statusLabel = this.source.storeAccount.status;
    			this.dialog.isChange = true;
    		} else {
    			this.handleCancel();
    		}
    	},
    	handleSpread() {
    		if (!this.source.storeAccount) {
    			this.$message.error('没有对应特色店');
    			return ;
    		}
    		this.subDialog.spreadId = this.source.storeAccount.id;
    		this.subDialog.type = 2;
    		this.subDialog.titleText = this.source.storeAccount.userName + ' 推广的特色店';
    		this.subDialog.saveFormVisible = true;
        // this.$router.push({path: '/seller/storeList', query: {spreadType: 4, storeType: '2', spreadLike: this.source.storeAccount.code}});
    	},
    	handleDetail() {
    		if (!this.source.storeAccount) {
    			this.$message.error('没有对应企业');
    			return ;
    		}
    		let routeData = this.$router.resolve({
    		  path: '/seller/cityWide',
    		  query: {spreadCode: this.source.storeAccount.code}
    		});
    		openExternal(routeData.href);
        // this.$router.push({path: '/seller/cityWide', query: {spreadCode: this.source.storeAccount.code}});
    	},
    	handleMystore() {
    		if (!this.source.storeAccount) {
    			this.$message.error('没有对应店铺');
    			return ;
    		}
    		let routeData = this.$router.resolve({
    		  path: '/seller/storeList',
    		  query: {sellerCode: this.source.storeAccount.code}
    		});
    		openExternal(routeData.href);
    	  // this.$router.push({path: '/seller/cityWide', query: {spreadCode: this.source.storeAccount.code}});
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

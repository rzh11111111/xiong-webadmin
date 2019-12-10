<template>
	<el-form v-if="!!source.store">
		<el-form-item label="店铺状态">
			<el-select v-model="source.store.isEnable" @change="changeStoreEnable" style="width: 100px;" :disabled="source.store &&source.store.delFlag == 2">
				<el-option v-for="i in isEnable" :key="i.value" :value="i.value" :label="i.label"></el-option>
			</el-select>
			<el-select v-model="source.store.platformStatus" @change="changeStoreStatus" @visible-change="prevVal" style="width: 100px;" :disabled="source.store && source.store.delFlag == 2">
				<el-option v-for="s in status" :key="s.value" :value="s.value" :label="s.label"></el-option>
			</el-select>
		</el-form-item>
	</el-form>
</template>

<script>
	import bus from '@/utils/bus';

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
	      	statusLabel: ''
        }
      },
    methods: {
    	changeStoreEnable() {
    		let isEnable = '';
    		this.isEnable.forEach(item => {
    			if (item.value == this.source.store.isEnable) {
    				isEnable = item.label + '当前店铺';
    			}
    		})
    		this.source.store.isEnable = this.source.store.isEnable == 1 ? 0 : 1;
    		this.$plug.prompt.del(this.handleOperateEnable, this.source, null, isEnable);
    	},
    	async handleOperateEnable() {
    		let isEnable = this.source.store.isEnable == 1 ? 0 : 1;
    		let res = await this.Api.enableStore({storeIds: this.source.store.id, isEnable});
    		if (res.status === 1) {
    			this.$plug.prompt.delTip('操作成功');
    			this.source.store.isEnable = isEnable;
          this.dialog.isChange = true;
    		}
    	},
    	prevVal(isVisible) {
    		if (isVisible) {
    			this.statusLabel = this.source.store.platformStatus;
    		}
    	},
    	changeStoreStatus() {
    		let status = '';
    		this.status.forEach(item => {
    			if (item.value == this.source.store.platformStatus) {
    				status = item.label;
    			}
    		})
    		let statusLabel = this.statusLabel;
    		this.statusLabel = this.source.store.platformStatus;
    		this.source.store.platformStatus = statusLabel;
    		this.$plug.prompt.del(this.handleOperate, this.source, null, `更改当前店铺的账号状态为${status}`);
    		// this.dialogVisible = true;
    		// this.form = Object.assign({operate: 'status'}, this.source);
    	},
    	async handleOperate() {
    		let res = await this.Api.statusStore({storeIds: this.source.store.id, status: this.statusLabel});
    		if (res.status === 1) {
    			this.$plug.prompt.delTip('操作成功');
    			this.source.store.platformStatus = this.statusLabel;
          this.dialog.isChange = true;
    		}
    	},
    	handleSpread(type) {
        this.$router.push({path: '/store/storeList', query: {spreadType: type, spreadId: this.source.id}});
    	},
    	handleDetail() {
        this.$router.push({path: '/seller/cityWide', query: {spreadType: type, spreadId: this.source.storeAccount.id}});
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

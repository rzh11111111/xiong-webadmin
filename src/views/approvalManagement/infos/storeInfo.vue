<template>
	<div>
		<store-info :isApproval="true" :source="source" :oldSource="oldSource" :delFlag="delFlag" :storeType="storeType" ></store-info>
		<agreement :isApproval="true" :source="source" :oldSource="oldSource" :delFlag="delFlag" :storeType="storeType" title="合同"></agreement>
	</div>
</template>

<script>
	import StoreInfo from '../../storeManagement/detail/account';
	import Agreement from '../../storeManagement/detail/agreement';
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
	  		oldSource: {
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
	  		storeType: {
	  			type: Number,
	  			default() {
	  				return 1;
	  			}
	  		},
	  		delFlag: {
	  			type: Number,
	  			default() {
	  				return null;
	  			}
	  		}
	  	},
    methods: {

    },
    components: {
    	StoreInfo,
    	Agreement
    },
    async mounted() {
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
.el-row{
  padding: 8px 0;
  .el-col{
    &:first-child{
      font-weight: 700;
    }
    .img-list{
      padding: 0;
      margin: 0;
      li{
        margin: 0 5px;
        float: left;
      }
    }
    .img-box{
      display: flex;
      width: 150px;
      height: 150px;
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

  }
}
 .list-border-box{
   padding-bottom: 10px;
   border-bottom: 1px dashed #e4e4e4;
 }
</style>

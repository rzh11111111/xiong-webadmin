<template>
	<div>
		  <shop-info :isApproval="true" :source="source" :oldSource="oldSource" :delFlag="delFlag" :shopType="shopType"></shop-info>
			<agreement :isApproval="true" :source="source" :oldSource="oldSource" :delFlag="delFlag" :shopType="shopType"></agreement>
	</div>
</template>

<script>
	import ShopInfo from '../../shopManagement/detail/account';
	import Agreement from '../../shopManagement/detail/agreement';
	  export default {
	  	props: {
	  		source: {
	  			type: Object,
	  			default() {
	  				return {
	  				};
	  			}
	  		},
	  		oldSource: {
	  			type: Object,
	  			default() {
	  				return {
	  				};
	  			}
	  		},
	  		shopType: {
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
    	Agreement,
    	ShopInfo
    },
    async mounted() {
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .list-border-box{
    padding-bottom: 10px;
    border-bottom: 1px dashed #e4e4e4;
  }
</style>

<template>
	<div>
		<!-- <div class="list-border-box">
			<el-row :gutter="20">
				<el-col :span="8" align="right">账户名称：</el-col>
				<el-col :span="16">
					<span>{{}}</span>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8" align="right">开户行及账号：</el-col>
				<el-col :span="16">
					<span>{{}}</span>
				</el-col>
			</el-row>
		</div> -->
    <div class="info-list">
      <h4 class="step-title-tag"><i class="icon-tag"></i>打款信息</h4>
      <table class="form-table">
        <tr>
          <td>账户名称：</td>
          <td>杭州三只松鼠股份有限公司</td>
        </tr>
        <tr>
          <td>开户行及账号：</td>
          <td>
            {{source.storeBankCard ? source.storeBankCard.bankBranch : ''}} {{source.storeBankCard ? source.storeBankCard.bankNo : ''}}
          </td>
        </tr>
      </table>
    </div>
	</div>
</template>

<script>
  import {format} from "../../../utils";
	  export default {
	  	props: {
	  		source: {
	  			type: Object,
	  			default() {
	  				return {
	  					shopInfo: {}
	  				};
	  			}
	  		},
	  		shopType: {
	  		  type: Number,
	  		  default() {
	  		    return 4;
	  		  }
	  		}
	  	},
	    data() {
	      return {
	      	format,
	      	bcPicUrls: [],
	      	spread: {}
        }
      },
    watch: {
    	'source.shopInfo.bcPicUrls'(val) {
    		if (val) {
    			this.bcPicUrls = val.split(',');
    		}
    	}
    },
    methods: {
    	// async getProvincesList() {
    	// 	let res = await this.Api.getProvincesList({id: this.source.spreadId});
    	// 	if (res.status === 1) {
    	// 		this.spread = res.data;
    	// 	}
    	// },
    	// async getCooperationList() {
    	// 	let res = await this.Api.getCooperationList({id: this.source.spreadId});
    	// 	if (res.status === 1) {
    	// 		this.spread = res.data;
    	// 	}
    	// }
    },
    created() {
    },
    mounted() {
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
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
   width: 100px;
   height: 100px;
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
  .form-table{
    td{
      &:nth-child(odd){
        width: 170px;
      }
      &:nth-child(even){
        width: 450px;
      }
    }
  }
</style>

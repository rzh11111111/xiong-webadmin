<template>
	<div>
		  <div class="info-list" v-if="shopType == 2">
		  	<h4 class="step-title-tag"><i class="icon-tag"></i>推广人及所属上级信息</h4>
		  	<table class="form-table" style="margin-bottom: 20px;">
		  		<tr>
		  			<td>推广人编码：</td>
		  			<td>
			  	  	<span v-if="!!source.shopInfo">{{source.spreadCode}}</span>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>推广人角色：</td>
		  			<td>
		  		  	<span v-if="!!source.spreadType">
		  		  		{{spreadType[source.spreadType * 1 - 1]}}
		  		  	</span>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>推广人姓名：</td>
		  			<td>{{source.spreadUsername}}</td>
		  		</tr>
		  	</table>
		  	<table class="form-table">
		  		<tr>
		  			<td>所属省区总：</td>
		  			<td>
		  				<el-popover
		  				  placement="top"
		  				  width="427"
		  				  trigger="click" v-if="source.areaConfig && source.areaConfig.id">
		  				  <el-table :data="provinceData.form" border>
		  				    <el-table-column width="200" property="merManager.code" label="所属省区总编码"></el-table-column>
		  				    <el-table-column width="200" property="merManager.name" label="所属省区总姓名"></el-table-column>
		  				  </el-table>
		  				  <el-button slot="reference" size="mini" @click="provinceDetail">查看所属省区总</el-button>
		  				</el-popover>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>所属合作商：</td>
		  			<td>
		  				<el-popover
		  				  placement="top"
		  				  width="427"
		  				  trigger="click" v-if="source.areaConfig && source.areaConfig.id">
		  				  <el-table :data="partnerData.form" border>
		  				    <el-table-column width="200" property="merManager.code" label="所属合作商编码"></el-table-column>
		  				    <el-table-column width="200" property="merManager.name" label="所属合作商公司名"></el-table-column>
		  				  </el-table>
		  				  <el-button slot="reference" size="mini" @click="partnerDetail">查看所属合作商</el-button>
		  				</el-popover>
		  			</td>
		  		</tr>
		  	</table>
			</div>
		  <div class="info-list">
		  	<h4 class="step-title-tag"><i class="icon-tag"></i>商户信息</h4>
		  	<table class="form-table">
		  		<tr>
		  			<td>商户编码：</td>
		  			<td>
		  				{{source.code}}
		  				<div v-if="isApproval && compareSource(['code'])" class="approval-before">
		  					<p class="color-red">变更前：</p>
			  				<span>{{oldSource.code}}</span>
			  			</div>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>商户手机号：</td>
		  			<td>
			  	  	{{source.phone}}
			  	  	<div v-if="isApproval && compareSource(['phone'])" class="approval-before">
			  	  		<p class="color-red">变更前：</p>
			  	  		<span v-if="!!oldSource">{{oldSource.phone}}</span>
			  	  	</div>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>账号：</td>
		  			<td>
		  				{{source.userName}}
		  				<div v-if="isApproval && compareSource(['userName'])" class="approval-before">
		  					<p class="color-red">变更前：</p>
		  					<span>{{oldSource.userName}}</span>
		  				</div>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>入驻时间：</td>
		  			<td>
			  	  	<span v-if="!!source.approvalTime">{{format(new Date(source.approvalTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
			  	  	<div v-if="isApproval && compareSource(['approvalTime'])" class="approval-before">
			  	  		<p class="color-red">变更前：</p>
			  	  		{{format(new Date(oldSource.approvalTime), 'yyyy-MM-dd hh:mm:ss')}}
			  	  	</div>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>创建时间：</td>
		  			<td>
		  		  	<span v-if="!!source.createTime">{{format(new Date(source.createTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
		  			</td>
		  		</tr>
		  	</table>
			</div>
			<div class="info-list">
		  	<h4 class="step-title-tag"><i class="icon-tag"></i>店铺信息</h4>
		  	<table class="form-table">
		  		<tr>
		  			<td>店铺名称：</td>
		  			<td>
		  				{{source.nickName}}
		  				<div v-if="isApproval && compareSource(['nickName'])" class="approval-before">
		  					<p class="color-red">变更前：</p>
		  					{{oldSource.nickName}}
		  				</div>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>经营品牌：</td>
		  			<td>
		  				<template v-if="!isApproval">
		  					<el-tag v-for="brand in source.brandIdList" :key="brand.id" v-if="!!source.brandIdList" color="#fff" style="margin: 5px 5px 5px 0;">{{brand.name}}</el-tag>
		  				</template>
							<template v-else>
								<template v-if="!!source.brandIdList">
									<template v-for="brand in source.brandIdList" v-if="!!brand">
										<el-tag v-for="b in brandList" :key="b.id" v-if="b.id === brand.id" color="#fff" style="margin: 5px 5px 5px 0;">{{b.name}}</el-tag>
									</template>
								</template>
								<div v-if="isApproval && compareSource(['brandIdList'])" class="approval-before">
									<p class="color-red">变更前：</p>
									<template v-if="!!oldSource.brandIdList">
										<template v-for="brand in oldSource.brandIdList" v-if="!!brand">
											<el-tag v-for="b in brandList" :key="b.id" v-if="b.id === brand.id" color="#fff" style="margin-right: 5px;">{{b.name}}</el-tag>
										</template>
									</template>
								</div>
							</template>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>店铺头像：</td>
		  			<td>
		  				<div class="img-box" v-if="!!source.logoUrl">
		  					<el-popover
		  							placement="top"
		  							popper-class="tootip-img-box"
		  							trigger="click">
		  							<img :src="source.logoUrl"/>
		  							<img slot="reference" :src="source.logoUrl"/>
		  					</el-popover>
		  				</div>
		  				<div v-if="isApproval && compareSource(['logoUrl'])" class="approval-before">
		  					<p class="color-red">变更前：</p>
		  					<el-popover
		  							placement="top"
		  							popper-class="tootip-img-box"
		  							trigger="click">
		  							<img :src="oldSource.logoUrl"/>
		  							<img slot="reference" :src="oldSource.logoUrl"/>
		  					</el-popover>
		  				</div>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>企业地址：</td>
		  			<td>
		  				{{source.province}} {{source.city}} {{source.region}}
		  				<template v-if="!!source.shopInfo">{{source.shopInfo.address}}</template>
		  				<div v-if="isApproval && (compareSource(['province']) || compareSource(['city']) || compareSource(['region']) || compareSource(['shopInfo', 'address']))" class="approval-before">
		  					<p class="color-red">变更前：</p>
		  					{{oldSource.province}} {{oldSource.city}} {{oldSource.region}}
		  					<template v-if="!!oldSource.shopInfo">{{oldSource.shopInfo.address}}</template>
		  				</div>
		  			</td>
		  		</tr>
		  	</table>
			</div>
		  <div class="info-list">
      	<h4 class="step-title-tag"><i class="icon-tag"></i>资质证件</h4>
      	<table class="form-table">
      		<tr>
      			<td>类别：</td>
      			<td>
      				<span v-if="!!source.shopInfo && !!source.shopInfo.companyType">{{source.shopInfo.companyType === 1 ? '企业' : '代理商'}}</span>
      				<div v-if="isApproval && compareSource(['shopInfo', 'companyType'])" class="approval-before">
      					<p class="color-red">变更前：</p>
      						<span v-if="!!oldSource.shopInfo && !!oldSource.shopInfo.companyType">{{oldSource.shopInfo.companyType === 1 ? '企业' : '代理商'}}</span>
      				</div>
      			</td>
      		</tr>
      		<tr>
      			<td>营业执照号：</td>
      			<td>
			      	<span v-if="!!source.shopInfo">{{source.shopInfo.bcCode}}</span>
			      	<div v-if="isApproval && compareSource(['shopInfo', 'bcCode'])" class="approval-before">
			      		<p class="color-red">变更前：</p>
			      		<span v-if="!!oldSource.shopInfo">{{oldSource.shopInfo.bcCode}}</span>
			      	</div>
      			</td>
      		</tr>
      		<tr>
      			<td>营业执照名称：</td>
      			<td>
			      	<span v-if="!!source.shopInfo">{{source.shopInfo.name}}</span>
			      	<div v-if="isApproval && compareSource(['shopInfo', 'name'])" class="approval-before">
			      		<p class="color-red">变更前：</p>
			      		<span v-if="!!oldSource.shopInfo">{{oldSource.shopInfo.name}}</span>
			      	</div>
      			</td>
      		</tr>
      		<tr>
      			<td>经营类型：</td>
      			<td>
      		  	<span v-if="!!source.shopInfo && !!source.shopInfo.bcRegisterType">{{registerType[source.shopInfo.bcRegisterType - 1]}}</span>
      		  	<div v-if="isApproval && compareSource(['shopInfo', 'bcRegisterType'])" class="approval-before">
      		  		<p class="color-red">变更前：</p>
      		  		<span v-if="!!oldSource.shopInfo && !!oldSource.shopInfo.bcRegisterType">{{registerType[oldSource.shopInfo.bcRegisterType - 1]}}</span>
      		  	</div>
      			</td>
      		</tr>
      		<tr>
      			<td>营业期限：</td>
      			<td>
      		  	<span v-if="source.shopInfo">{{source.shopInfo.bcEndtime}}</span>
      		  	<div v-if="isApproval && compareSource(['shopInfo', 'bcEndtime'])" class="approval-before">
      		  		<p class="color-red">变更前：</p>
      		  		<span v-if="!!oldSource.shopInfo">{{oldSource.shopInfo.bcEndtime}}</span>
      		  	</div>
      			</td>
      		</tr>
      		<tr>
      			<td>营业执照：</td>
      			<td>
      		  	<div class="img-box" v-if="!!source.shopInfo && !!source.shopInfo.bcPicUrl">
      		  		<el-popover
      		  				placement="top"
      		  				popper-class="tootip-img-box"
      		  				trigger="click">
      		  				<img :src="source.shopInfo.bcPicUrl"/>
      		  				<img slot="reference" :src="source.shopInfo.bcPicUrl"/>
      		  		</el-popover>
      		  	</div>
      		  	<div v-if="isApproval && compareSource(['shopInfo', 'bcPicUrl'])" class="approval-before">
      		  		<p class="color-red">变更前：</p>
      		  		<div class="img-box" v-if="!!oldSource.shopInfo && !!oldSource.shopInfo.bcPicUrl">
      		  			<el-popover
      		  					placement="top"
      		  					popper-class="tootip-img-box"
      		  					trigger="click">
      		  					<img :src="oldSource.shopInfo.bcPicUrl"/>
      		  					<img slot="reference" :src="oldSource.shopInfo.bcPicUrl"/>
      		  			</el-popover>
      		  		</div>
      		  	</div>
      			</td>
      		</tr>
      		<tr>
      			<td>法人姓名：</td>
      			<td>
			      	<span v-if="!!source.shopInfo">{{source.shopInfo.bcUserName}}</span>
			      	<div v-if="isApproval && compareSource(['shopInfo', 'bcUserName'])" class="approval-before">
			      		<p class="color-red">变更前：</p>
			      		<span v-if="!!oldSource.shopInfo">{{oldSource.shopInfo.bcUserName}}</span>
			      	</div>
      			</td>
      		</tr>
      		<tr>
      			<td>身份证号：</td>
      			<td>
					  	<span v-if="!!source.shopInfo">{{source.shopInfo.bcUserIdcard}}</span>
					  	<div v-if="isApproval && compareSource(['shopInfo', 'bcUserIdcard'])" class="approval-before">
					  		<p class="color-red">变更前：</p>
					  		<span v-if="!!oldSource.shopInfo">{{oldSource.shopInfo.bcUserIdcard}}</span>
					  	</div>
      			</td>
      		</tr>
      		<tr>
      			<td>法人身份证：</td>
      			<td>
					  	<ul class="img-list" v-if="!!source.shopInfo">
					  		<li class="img-box" v-if="!!source.shopInfo.idCardJustUrl">
					  			<el-popover
					  					placement="top"
					  					popper-class="tootip-img-box"
					  					trigger="click">
					  					<img :src="source.shopInfo.idCardJustUrl"/>
					  					<img slot="reference" :src="source.shopInfo.idCardJustUrl"/>
					  			</el-popover>
					  		</li>
					  		<li class="img-box" v-if="!!source.shopInfo.idCardBackUrl">
					  			<el-popover
					  					placement="top"
					  					popper-class="tootip-img-box"
					  					trigger="click">
					  					<img :src="source.shopInfo.idCardBackUrl"/>
					  					<img slot="reference" :src="source.shopInfo.idCardBackUrl"/>
					  			</el-popover>
					  		</li>
					  	</ul>
					  	<div v-if="isApproval && compareSource(['shopInfo', 'idCardJustUrl'])" class="approval-before">
					  		<p class="color-red">变更前：</p>
					  		<ul class="img-list" v-if="!!oldSource.shopInfo">
					  			<li class="img-box" v-if="!!oldSource.shopInfo.idCardJustUrl">
					  				<el-popover
					  						placement="top"
					  						popper-class="tootip-img-box"
					  						trigger="click">
					  						<img :src="oldSource.shopInfo.idCardJustUrl"/>
					  						<img slot="reference" :src="oldSource.shopInfo.idCardJustUrl"/>
					  				</el-popover>
					  			</li>
					  			<li class="img-box" v-if="!!oldSource.shopInfo.idCardBackUrl">
					  				<el-popover
					  						placement="top"
					  						popper-class="tootip-img-box"
					  						trigger="click">
					  						<img :src="oldSource.shopInfo.idCardBackUrl"/>
					  						<img slot="reference" :src="oldSource.shopInfo.idCardBackUrl"/>
					  				</el-popover>
					  			</li>
					  		</ul>
					  	</div>
      			</td>
      		</tr>
      		<tr>
      			<td>其他证件：</td>
      			<td>
      		  	<ul class="img-list" v-if="!!source.shopInfo && !!source.shopInfo.bcPicUrls">
					  		<li class="img-box" v-for="pic in source.shopInfo.bcPicUrls.split(',')" :key="pic">
					  			<el-popover
					  					placement="top"
					  					popper-class="tootip-img-box"
					  					trigger="click">
					  					<img :src="pic"/>
					  					<img slot="reference" :src="pic"/>
					  			</el-popover>
					  		</li>
					  	</ul>
					  	<div v-if="isApproval && compareSource(['shopInfo', 'bcPicUrls'])" class="approval-before">
					  		<p class="color-red">变更前：</p>
					  		<ul class="img-list" v-if="!!oldSource.shopInfo && !!oldSource.shopInfo.bcPicUrls">
					  			<li class="img-box" v-for="pic in oldSource.shopInfo.bcPicUrls.split(',')" :key="pic">
					  				<el-popover
					  						placement="top"
					  						popper-class="tootip-img-box"
					  						trigger="click">
					  						<img :src="pic"/>
					  						<img slot="reference" :src="pic"/>
					  				</el-popover>
					  			</li>
					  		</ul>
					  	</div>
      			</td>
      		</tr>
      	</table>
		  </div>
	</div>
</template>

<script>
  import {format} from "@/utils";
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
	  		oldSource: {
	  			type: Object,
	  			default() {
	  				return {
	  					shopInfo: {}
	  				};
	  			}
	  		},
	  		isApproval: {
	  			type: Boolean,
	  			default() {
	  				 return false;
	  			}
	  		},
	  		// 1生产企业 2同城企业
	  		shopType: {
	  		  type: Number,
	  		  default() {
	  		    return 1;
	  		  }
	  		}
	  	},
	    data() {
	      return {
	      	format,
	      	spreadType: ['省区总', '合作商', '推广员', '种子店'],
	      	registerType: ['个体商户', '企业'],
	      	spread: {},
	      	provinceData: {
	      		visible: false,
	      		form: []
	      	},
	      	partnerData: {
	      		visible: false,
	      		form: []
	      	},
	      	brandList: []
        }
      },
    methods: {
    	compareSource(vals) {
    		let newVal = Object.assign({}, this.source);
    		let oldVal = Object.assign({}, this.oldSource);
    		if (!oldVal || !newVal) {
    			return false;
    		}
    		for (var i = 0; i < vals.length; i++) {
    			newVal = newVal[vals[i]];
    			oldVal = oldVal[vals[i]];
    			if (!newVal) {
    				if (oldVal) {
    					return true;
    				}
    				return false;
    			}
    			if (!oldVal) {
    				return false;
    			}
    			if (i === vals.length - 1) {
    				if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
    					return true;
    				}
    			}
    		}
    	},
    	async provinceDetail() {
    		let res = await this.Api.getDutyAreaProvince({
    			areaConfig: {
    				id: this.source.areaConfig.id
    			}
    		});
    		if (res.status === 1) {
    			this.provinceData.form = res.data || [];
    		}
    	},
    	async partnerDetail() {
    		let res = await this.Api.getDutyAreaPartner({
    			areaConfig: {
    				id: this.source.areaConfig.id
    			}
    		});
    		if (res.status === 1) {
    			this.partnerData.form = res.data || [];
    		}
    	},
    	getBrands() {
    		this.Api.getGoodsBrandlist({}).then(res => {
    			if (res.status === 1 && res.data) {
    				this.brandList = res.data.list || [];
    			}
    		})
    	}
    },
    created() {
    },
    mounted() {
    	if (this.isApproval) {
    		this.getBrands();
    	}
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .img-list{
    padding: 0;
    margin: 0;
    li{
      margin: 0 5px 5px 0;
      float: left;
    }
  }
  .img-box{
    display: flex;
    width: 100px;
    height: 100px;
    padding: 3px;
    margin: 5px 5px 5px 0;
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
  .approval-before{
  	font-size: 12px;
  	.color-red{
  		color: #f00;
  	}
  }
  .form-table td:nth-child(even){
  	width: 470px;
  }
</style>

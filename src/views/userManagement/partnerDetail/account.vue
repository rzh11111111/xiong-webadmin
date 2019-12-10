<template>
	<div class="info-list">
    <h4 class="step-title-tag"><i class="icon-tag"></i>基本信息</h4>
		<table class="form-table" style="margin-bottom: 20px;">
			<tr>
			  <td>编码：</td>
			  <td>{{source.code}}</td>
			</tr>
			<tr>
			  <td>角色：</td>
			  <td>
		  	  <template v-if="!!source.accountType">
		  	  	{{accountType[source.accountType - 1]}}
		  	  </template>
		  	</td>
			</tr>
			<tr>
			  <td>登录名：</td>
			  <td>{{source.username}}</td>
		</tr>
	</table>
	<table class="form-table" style="margin-bottom: 20px;">
		<tr>
		  <td>所属省区总编码：</td>
		  <td>
		  	<span v-if="!!source.managerCooperation && !!source.managerCooperation.merManager">{{source.managerCooperation.merManager.code}}</span>
		  </td>
		</tr>
		<tr>
		  <td>所属省区总姓名：</td>
		  <td>
		  	<span v-if="!!source.managerCooperation && !!source.managerCooperation.merManager">{{source.managerCooperation.merManager.name}}</span>
			</td>
		</tr>
	</table>
	  <table class="form-table" style="margin-bottom: 20px;">
	  	<tr>
	  	  <td>辖区：</td>
	  	  <td>
	  	    <template v-if="!!source.managerDutyAreaConfigs">
	  	    	<el-tree
	  	    	  :default-expanded-keys="expandKeys"
	  	    	  :data="dutyAreaList"
	  	    	  node-key="code"
	  	    	  empty-text="辖区未修改">
	  	    	</el-tree>
	  	    </template>
	  	    <div class="approval-before" v-if="isApproval && compareSource(['managerDutyAreaConfigs'])">
	  	    	<p class="color-red">变更前：</p>
	  	    	<template v-if="!!oldSource.managerDutyAreaConfigs">
	  	    		<el-tree
	  	    		  :default-expanded-keys="expandKeysOld"
	  	    		  :data="dutyAreaListOld"
	  	    		  node-key="code"
	  	    		  empty-text="辖区未修改">
	  	    		</el-tree>
	  	    	</template>
	  	    </div>
	  	  </td>
	  	</tr>
	  	<tr>
	  	  <td>手机号</td>
	  	  <td>
	  	  	{{source.phone}}
	  	  	<div class="approval-before" v-if="isApproval && compareSource(['phone'])">
	  	  		<p class="color-red">变更前：</p>
	  	  		{{oldSource.phone}}
	  	  	</div>
	  	  </td>
	  	</tr>
	  	<tr>
	  	  <td>邮箱</td>
	  	  <td>
	  	  	{{source.email}}
	  	  	<div class="approval-before" v-if="isApproval && compareSource(['email'])">
	  	  		<p class="color-red">变更前：</p>
	  	  		{{oldSource.email}}
	  	  	</div>
	  	  </td>
	  	</tr>
	  	<tr>
	  	  <td>办公地址</td>
	  	  <td>
	  	  	<span v-if="!!source.managerCooperation">{{source.managerCooperation.officeAddress}}</span>
	  	  	<div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'officeAddress'])">
	  	  		<p class="color-red">变更前：</p>
		  	  	<span v-if="!!oldSource.managerCooperation">{{oldSource.managerCooperation.officeAddress}}</span>
	  	  	</div>
	  	  </td>
	  	</tr>
	  	<tr>
	  	  <td>仓库地址</td>
	  	  <td>
	  	  	<span v-if="!!source.managerCooperation">
	  	  		{{source.managerCooperation.warehouseAddress}}
	  	  	</span>
	  	  	<div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'warehouseAddress'])">
	  	  		<p class="color-red">变更前：</p>
	  	  		<span v-if="!!oldSource.managerCooperation">{{oldSource.managerCooperation.warehouseAddress}}</span>
	  	  	</div>
	  	  </td>
	  	</tr>
	  	<tr>
	  	  <td>备注</td>
	  	  <td>
	  	  	<span v-if="!!source.managerCooperation">{{source.managerCooperation.remarks}}</span>
	  	  	<div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'remarks'])">
	  	  		<p class="color-red">变更前：</p>
	  	  		<span v-if="!!oldSource.managerCooperation">{{oldSource.managerCooperation.remarks}}</span>
	  	  	</div>
	  	  </td>
	  	</tr>
	  </table>
	  <table class="form-table">
	    <tr>
	      <td>营业执照号</td>
	      <td>
	      	<span v-if="!!source.managerCooperation">{{source.managerCooperation.bcCode}}</span>
	      	<div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'bcCode'])">
	      		<p class="color-red">变更前：</p>
	      		<span v-if="!!oldSource.managerCooperation">{{oldSource.managerCooperation.bcCode}}</span>
	      	</div>
	      </td>
	    </tr>
	    <tr>
	      <td>名称</td>
	      <td>
	      	{{source.name}}
	      	<div class="approval-before" v-if="isApproval && compareSource(['name'])">
	      		<p class="color-red">变更前：</p>
	      		{{oldSource.name}}
	      	</div>
	      </td>
	    </tr>
	    <tr>
	      <td>类型</td>
	      <td>
	      	<span v-if="!!source.managerCooperation">{{registerType[source.managerCooperation.bcRegisterType - 1]}}</span>
	      	<div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'bcRegisterType'])">
	      		<p class="color-red">变更前：</p>
		      	<span v-if="!!oldSource.managerCooperation">{{registerType[oldSource.managerCooperation.bcRegisterType - 1]}}</span>
	      	</div>
	      </td>
	    </tr>
	  	<tr>
	  	  <td>营业期限</td>
	  	  <td>
	  	  	<span v-if="!!source.managerCooperation">
	  	  		{{source.managerCooperation.bcEndtime}}
	  	  	</span>
	  	  	<div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'bcEndtime'])">
	  	  		<p class="color-red">变更前：</p>
	  	  		<span v-if="!!oldSource.managerCooperation">
	  	  			{{oldSource.managerCooperation.bcEndtime}}
	  	  		</span>
	  	  	</div>
	  	  </td>
	  	</tr>
	  	<tr>
	  	  <td>营业执照</td>
	  	  <td>
	  	    <div class="img-box" v-if="!!source.managerCooperation && source.managerCooperation.bcPicUrl">
	  	    	<el-popover
	  	    			placement="top"
	  	    			popper-class="tootip-img-box"
	  	    			trigger="click">
	  	    			<img :src="source.managerCooperation.bcPicUrl"/>
	  	    			<img slot="reference" :src="source.managerCooperation.bcPicUrl"/>
	  	    	</el-popover>
	  	    </div>
	  	    <div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'bcPicUrl'])">
	  	    	<p class="color-red">变更前：</p>
	  	    	<div class="img-box" v-if="!!oldSource.managerCooperation && oldSource.managerCooperation.bcPicUrl">
	  	    		<el-popover
	  	    				placement="top"
	  	    				popper-class="tootip-img-box"
	  	    				trigger="click">
	  	    				<img :src="oldSource.managerCooperation.bcPicUrl"/>
	  	    				<img slot="reference" :src="oldSource.managerCooperation.bcPicUrl"/>
	  	    		</el-popover>
	  	    	</div>
	  	    </div>
	  	  </td>
	  	</tr>
	  	<tr>
	  	  <td>法人姓名</td>
	  	  <td>
	  	  	<span v-if="!!source.managerCooperation">{{source.managerCooperation.bcUserName}}</span>
	  	  	<div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'bcUserName'])">
	  	  		<p class="color-red">变更前：</p>
		  	  	<span v-if="!!oldSource.managerCooperation">{{oldSource.managerCooperation.bcUserName}}</span>
	  	  	</div>
	  	  </td>
	  	</tr>
	    <tr>
	      <td>身份证号</td>
	      <td>
	        <span v-if="!!source.managerCooperation">{{source.managerCooperation.bcUserIdcard}}</span>
	        <div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'bcUserIdcard'])">
	        	<p class="color-red">变更前：</p>
	         	<span v-if="!!oldSource.managerCooperation">{{oldSource.managerCooperation.bcUserIdcard}}</span>
	        </div>
	      </td>
	    </tr>
	   <tr>
	     <td>法人身份证</td>
	     <td>
		     	<ul class="img-list">
		     		<li class="img-box" v-if="!!source.managerCooperation && source.managerCooperation.idCardJustUrl">
		     			<el-popover
		     					placement="top"
		     					popper-class="tootip-img-box"
		     					trigger="click">
		     					<img :src="source.managerCooperation.idCardJustUrl"/>
		     					<img slot="reference" :src="source.managerCooperation.idCardJustUrl"/>
		     			</el-popover>
		     		</li>
		     		<li class="img-box" v-if="!!source.managerCooperation && source.managerCooperation.idCardBackUrl">
		     			<el-popover
		     					placement="top"
		     					popper-class="tootip-img-box"
		     					trigger="click">
		     					<img :src="source.managerCooperation.idCardBackUrl"/>
		     					<img slot="reference" :src="source.managerCooperation.idCardBackUrl"/>
		     			</el-popover>
		     		</li>
		     	</ul>
		     	<div class="approval-before" v-if="isApproval && (compareSource(['managerCooperation', 'idCardJustUrl']) || compareSource(['managerCooperation', 'idCardBackUrl']))">
		     		<p class="color-red">变更前：</p>
		     	 	<ul class="img-list">
		     	 		<li class="img-box" v-if="!!oldSource.managerCooperation && oldSource.managerCooperation.idCardJustUrl">
		     	 			<el-popover
		     	 					placement="top"
		     	 					popper-class="tootip-img-box"
		     	 					trigger="click">
		     	 					<img :src="oldSource.managerCooperation.idCardJustUrl"/>
		     	 					<img slot="reference" :src="oldSource.managerCooperation.idCardJustUrl"/>
		     	 			</el-popover>
		     	 		</li>
		     	 		<li class="img-box" v-if="!!oldSource.managerCooperation && oldSource.managerCooperation.idCardBackUrl">
		     	 			<el-popover
		     	 					placement="top"
		     	 					popper-class="tootip-img-box"
		     	 					trigger="click">
		     	 					<img :src="oldSource.managerCooperation.idCardBackUrl"/>
		     	 					<img slot="reference" :src="oldSource.managerCooperation.idCardBackUrl"/>
		     	 			</el-popover>
		     	 		  <img :src="oldSource.managerCooperation.idCardBackUrl"/>
		     	 		</li>
		     	 	</ul>
		     	</div>
	     </td>
	   </tr>
	    <tr>
	      <td>其他证件</td>
	      <td>
	      	<ul class="img-list" v-if="!!source.managerCooperation && !!source.managerCooperation.idOthrCerUrl">
	      		<li class="img-box" v-for="pic in source.managerCooperation.idOthrCerUrl.split(',')">
	      			<el-popover
	      					placement="top"
	      					popper-class="tootip-img-box"
	      					trigger="click">
	      					<img :src="source.managerCooperation.idOthrCerUrl"/>
	      					<img slot="reference" :src="source.managerCooperation.idOthrCerUrl"/>
	      			</el-popover>
	      		</li>
	      	</ul>
	      	<div class="approval-before" v-if="isApproval && compareSource(['managerCooperation', 'idOthrCerUrl'])">
	      		<p class="color-red">变更前：</p>
		      	 <ul class="img-list" v-if="!!oldSource.managerCooperation && !!oldSource.managerCooperation.idOthrCerUrl">
		      	 	<li class="img-box" v-for="pic in oldSource.managerCooperation.idOthrCerUrl.split(',')">
		      	 		<el-popover
		      	 				placement="top"
		      	 				popper-class="tootip-img-box"
		      	 				trigger="click">
		      	 				<img :src="oldSource.managerCooperation.idOthrCerUrl"/>
		      	 				<img slot="reference" :src="oldSource.managerCooperation.idOthrCerUrl"/>
		      	 		</el-popover>
		      	 	</li>
		      	 </ul>
	      	</div>
	      </td>
	    </tr>
	</table>
</div>
</template>

<script>
  import {format, parseQueryString} from "@/utils";

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
			// 查看审批详情
			isApproval: {
				type: Boolean,
				default() {
					return false;
				}
			},
			//之前的审批内容
			oldSource: {
				type: Object,
				default() {
					return {}
				}
			}
		},
	  data() {
	    return {
	    	format,
	    	dutyAreaList: [],
	    	expandKeys: [],
	    	dutyAreaListOld: [],
	    	expandKeysOld: [],
	    	accountType: ['推广员', '合作商', '省区总'],
	    	peopleType: ['省区总', '合作商', '推广员', '种子店', '特色店'],
	    	storeType: ['种子商户', '特色商户'],
	    	registerType: ['个体店铺', '企业'],
        }
      },
    watch: {
    	'source.managerDutyAreaConfigs': {
    	  deep: true,
    	  immediate: true,
    	  handler(area) {
    	    if (area && area.length) {
    	      this.getDutyArea();
    	    }
    	  }
    	},
    	'oldSource.managerDutyAreaConfigs': {
    	  deep: true,
    	  immediate: true,
    	  handler(area) {
    	    if (area && area.length) {
    	      this.getDutyAreaOld();
    	    }
    	  }
    	}
    },
    methods: {
    	compareSource(vals) {
    		let newVal = Object.assign({}, this.source);
    		let oldVal = Object.assign({}, this.oldSource);
    		if (!oldVal || !newVal) {
    			return false;
    		}
    		for (let i = 0; i < vals.length; i++) {
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
    	getCatrgory() {
    		let cate = this.source.storeCategoryList || [];
    		let list = cate.map(category => {
    			return category.name;
    		});
    		return list.join(' > ');
    	},
    	getDutyArea() {
    		let arr = [];
    		if (this.isApproval) {
    			this.source.managerDutyAreaConfigs.map(item => {
    				if (item.areaConfig) {
    			  	this.formatDutyAreaApproval(arr, item.areaConfig, [], ['province', 'city', 'region'], 1);
    				}
    			});
    		} else {
    			this.source.managerDutyAreaConfigs.map(item => {
    			  this.formatDutyArea(arr, item, [], ['province', 'city', 'region'], 0, item);
    			});
    		}
    	   this.dutyAreaList = arr;
    		if (arr.length > 0) {
    		  this.expandKeys = [arr[0].code];
    		} else {
    		  this.expandKeys = [];
    		}
    	},
    	getDutyAreaOld() {
    		let arr = [];
    		this.oldSource.managerDutyAreaConfigs.map(item => {
    			if (item.areaConfig) {
	    	  	this.formatDutyAreaApproval(arr, item.areaConfig, [], ['province', 'city', 'region'], 1);
	    	  }
    		});
    	   this.dutyAreaListOld = arr;
    		if (arr.length > 0) {
    		  this.expandKeysOld = [arr[0].code];
    		} else {
    		  this.expandKeysOld = [];
    		}
    	},
    	formatDutyAreaApproval(arr, area, inxList, levelArea, level) {
    	  let parents = area.parents;
    		if (!parents) {
    			return ;
    		}
    	  let hasArea = false;
    	  let arry = arr;
    	  for (let j = 0; j < inxList.length; j++) {
    	    arry = arry[inxList[j]].children;
    	  }

    	  for (let i = 0; i < arry.length; i++) {
    		  for (let k = 0; k < parents.length; k++) {
    		  	if (arry[i].label === parents[k].name) {
    		  	  hasArea = true;
    		  	  if (level < levelArea.length) {
    		  	    if (!arry[i].children) {
    		  	      arry[i].children = [];
    		  	    }
    		  	    inxList.push(i);
    		  	    this.formatDutyAreaApproval(arr, area, inxList, levelArea, level + 1);
    		  	  }
    		  	  break;
    		  	}
    		  }
    	  }
    	  if (!hasArea) {
    		    if (level === levelArea.length) {
    		      arry.push({
    		        label: area.name,
    		        code: area.code
    		      });
    		    } else if (level < levelArea.length) {
    		    	for (let i = 0; i < parents.length; i++) {
    		    		if (parents[i].areaLevel === level) {
    		    			arry.push({
    		    			  label: parents[i].name,
    		    			  code: parents[i].code,
    		    			  children: []
    		    			});
    		    			inxList.push(arry.length - 1);
    		    			this.formatDutyAreaApproval(arr, area, inxList, levelArea, level + 1);
    		    			break;
    		    		}
    		    	}
    		      
    		    }
    	  }
    	},
    	formatDutyArea(arr, area, inxList, levelArea, level, item) {
    	  let hasArea = false;
    	  let arry = arr;
    	  for (var j = 0; j < inxList.length; j++) {
    	    arry = arry[inxList[j]].children;
    	  }
    	  for (var i = 0; i < arry.length; i++) {
    	    if (arry[i].label === area[levelArea[level]]) {
    	      hasArea = true;
    	      if (level < levelArea.length - 1) {
    	        if (!arry[i].children) {
    	          arry[i].children = [];
    	        }
    	        inxList.push(i);
    	        this.formatDutyArea(arr, area, inxList, levelArea, level + 1, item);
    	      }
    	      break;
    	    }
    	  }
    	  if (!hasArea) {
    	  	let areaCode = area.areaConfig.code || area.areaConfig.id + level + 9999;
    	    if (level == levelArea.length - 1) {
    	      arry.push({
    	        label: area[levelArea[level]],
    	        code: areaCode.substring(0, (level　+ 1) * 2) + '0'.repeat(areaCode.length - (level　+ 1) * 2)
    	      });
    	    } else if (level < levelArea.length - 1) {
    	      arry.push({
    	        label: area[levelArea[level]],
    	        code: areaCode.substring(0, (level　+ 1) * 2) + '0'.repeat(areaCode.length - (level　+ 1) * 2),
    	        children: []
    	      });
    	      inxList.push(arry.length - 1);
    	      this.formatDutyArea(arr, area, inxList, levelArea, level + 1);
    	    }
    	  }
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
    align-items: center;
    justify-content: center;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
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
  .link{
    padding: 0 4px;
    color: #409eff;
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

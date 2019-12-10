<template>
	<div class="info-list">
    <h4 class="step-title-tag"><i class="icon-tag"></i>基本信息</h4>
		  <table class="form-table" style="margin-bottom: 20px;">
		  	<tr>
		  	  <td>用户编码：</td>
		  	  <td>
		  	  	{{source.code}}
		  	  	<div class="approval-before" v-if="isApproval && compareSource(['code'])">
		  	  		<p class="color-red">变更前：</p>
		  	  		{{oldSource.code}}
		  	  	</div>
		  	  </td>
		  	</tr>
		  	<tr>
		  	  <td>登录名：</td>
		  	  <td>
		  	  	{{source.username}}
		  	  	<div class="approval-before" v-if="isApproval && compareSource(['username'])">
		  	  		<p class="color-red">变更前：</p>
		  	  		{{oldSource.username}}
		  	  	</div>
		  	  </td>
		  </tr>
		</table>
		<table class="form-table" style="margin-bottom: 20px;">
			<tr>
			  <td>姓名：</td>
			  <td>
			  	{{source.name}}
			  	<div class="approval-before" v-if="isApproval && compareSource(['name'])">
			  		<p class="color-red">变更前：</p>
			  		{{oldSource.name}}
			  	</div>
			  </td>
			</tr>
			<tr>
			  <td>身份证号：</td>
			  <td>
			    <span v-if="!!source.managerRegionBoss">{{source.managerRegionBoss.idCard}}</span>
			    <div class="approval-before" v-if="isApproval && compareSource(['managerRegionBoss', 'idCard'])">
			    	<p class="color-red">变更前：</p>
				    <span v-if="!!oldSource.managerRegionBoss">{{oldSource.managerRegionBoss.idCard}}</span>
			    </div>
			  </td>
			</tr>
			<tr>
			  <td>辖区：</td>
			  <td>
			  	<!-- <template v-if="isApproval">
			  		<el-popover
			  		  placement="top"
			  		  width="427"
			  		  trigger="click" v-if="!!source.managerDutyAreaConfigs">
			  		  <el-tree
			  		    :default-expanded-keys="expandKeys"
			  		    :data="dutyAreaList"
			  		    node-key="code"
			  		    empty-text="暂无辖区数据">
			  		  </el-tree>
			  		  <el-button slot="reference" size="mini" @click="areaDetail">查看辖区</el-button>
			  		</el-popover>
			  	</template>
			  	<template v-else> -->
			  		<template v-if="!!source.managerDutyAreaConfigs">
			  			<el-tree
			  			  :default-expanded-keys="expandKeys"
			  			  :data="dutyAreaList"
			  			  node-key="code"
			  			  empty-text="暂无辖区数据">
			  			</el-tree>
			  		</template>
			  	<!-- </template> -->
			  	<div class="approval-before" v-if="isApproval && compareSource(['managerDutyAreaConfigs'])">
			  		<p class="color-red">变更前：</p>
			  	  <template v-if="!!oldSource.managerDutyAreaConfigs">
			  	  	<el-tree
			  	  	  :default-expanded-keys="expandKeysOld"
			  	  	  :data="dutyAreaListOld"
			  	  	  node-key="code"
			  	  	  empty-text="暂无辖区数据">
			  	  	</el-tree>
			  	  </template>
			  	</div>
			  </td>
			</tr>
			<tr>
			  <td>电子邮箱：</td>
			  <td>
			  	{{source.email}}
			  	<div class="approval-before" v-if="isApproval && compareSource(['email'])">
			  		<p class="color-red">变更前：</p>
			  	  {{oldSource.email}}
			  	</div>
			  </td>
			</tr>
			<tr>
			  <td>联系方式：</td>
			  <td>
			  	{{source.phone}}
			  	<div class="approval-before" v-if="isApproval && compareSource(['phone'])">
			  		<p class="color-red">变更前：</p>
			  	  {{oldSource.phone}}
			  	</div>
			  </td>
			</tr>
			<tr>
			  <td>详细地址：</td>
			  <td>
			  	<span v-if="!!source.managerRegionBoss">{{source.managerRegionBoss.address}}</span>
			  	<div class="approval-before" v-if="isApproval && compareSource(['managerRegionBoss', 'address'])">
			  		<p class="color-red">变更前：</p>
				  	<span v-if="!!oldSource.managerRegionBoss">{{oldSource.managerRegionBoss.address}}</span>
			  	</div>
			  </td>
			</tr>
		</table>
		<table class="form-table" >
			<tr>
			  <td>创建人：</td>
			  <td>
			  	<span v-if="!!source.createBy">
			  		<template v-for="(p, inx) in source.createBy.split('/')" v-if="inx <= 1">{{p}} </template>
			  	</span>
			  </td>
			</tr>
			<tr>
			  <td>创建时间：</td>
			  <td>
			    <span v-if="!!source.managerRegionBoss">{{source.managerRegionBoss.createTime}}</span>
			  </td>
			</tr>
			<tr>
			  <td>备注：</td>
			  <td>
			  	{{source.remarks}}
			  	<div class="approval-before" v-if="isApproval && compareSource(['remarks'])">
			  		<p class="color-red">变更前：</p>
			  		{{oldSource.remarks}}
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
	      	createType: ['钱兔平台注册', '店铺入驻创建', '合作商添加'],
	      	accountType: ['推广员', '合作商', '省区总'],
	      	// peopleType: ['省区总', '合作商', '推广员', '种子店', '特色店'],
	      	// storeType: ['种子商户', '特色商户'],
	      	// registerType: ['个体店铺', '企业'],
	      	dutyAreaList: [],
	      	expandKeys: [],
	      	dutyAreaListOld: [],
	      	expandKeysOld: []
          }
        },
    watch: {
    	'source.managerDutyAreaConfigs': {
        deep: true,
        immediate: true,
        handler(area) {
          if (area && area.length) {
            this.getDutyArea(area);
          }
        }
      },
      'oldSource.managerDutyAreaConfigs': {
        deep: true,
        immediate: true,
        handler(area) {
          if (area && area.length) {
            this.getDutyAreaOld(area);
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
    	getDutyArea(area) {
    		let arr = [];
    		if (this.isApproval) {
    			this.source.managerDutyAreaConfigs.map(item => {
    				if (item.areaConfig) {
    			  	this.formatDutyAreaApproval(arr, item.areaConfig, [], ['province', 'city', 'region'], 1, item);
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
    	getDutyAreaOld(area) {
    		let arr = [];
    		area.map(item => {
    			if (item.areaConfig) {
	    	  	this.formatDutyAreaApproval(arr, item.areaConfig, [], ['province', 'city', 'region'], 1, item);
	    	  }
    		});
    	   this.dutyAreaListOld = arr;
    		if (arr.length > 0) {
    		  this.expandKeysOld = [arr[0].code];
    		} else {
    		  this.expandKeysOld = [];
    		}
    	},
    	formatDutyAreaApproval(arr, area, inxList, levelArea, level, item) {
    		if (!area.parents) {
    			return ;
    		}
    	  let hasArea = false;
    	  let arry = arr;
    	  for (let j = 0; j < inxList.length; j++) {
    	    arry = arry[inxList[j]].children;
    	  }
    	  let parents = area.parents;

    	  for (let i = 0; i < arry.length; i++) {
    		    for (let k = 0; k < parents.length; k++) {
    		    	if (arry[i].label === parents[k].name) {
    		    	  hasArea = true;
    		    	  if (level < levelArea.length) {
    		    	    if (!arry[i].children) {
    		    	      arry[i].children = [];
    		    	    }
    		    	    inxList.push(i);
    		    	    this.formatDutyAreaApproval(arr, area, inxList, levelArea, level + 1, item);
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
    	  for (let j = 0; j < inxList.length; j++) {
    	    arry = arry[inxList[j]].children;
    	  }
    	  for (let i = 0; i < arry.length; i++) {
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
    	// async areaDetail() {
    	// 	let dutyArea = this.source.managerDutyAreaConfigs;
    	// 	let arr = [];
    	// 	if (dutyArea) {
    	// 		arr = dutyArea.map(item => {
    	// 			return item.areaConfig.id;
    	// 		})
    	// 	}
    	// 	let res = await this.Api.getDutyById({merManagerId: this.source.id, areaIds: arr.join(',')});
    	// 	if (res.status === 1) {
    	// 		// this.getDutyArea();
    	// 	}
    	// 	// this.dutyAreaList
    	// }
    },
    async mounted() {

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

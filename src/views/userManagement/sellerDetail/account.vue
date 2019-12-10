<template>
	<div class="info-list">
			<h4 class="step-title-tag"><i class="icon-tag"></i>基本信息</h4>
			<table class="form-table" style="margin-bottom: 20px;">
				<tr>
					<td>编码：</td>
					<td>
				  	<span v-if="!!source.storeAccount">{{source.storeAccount.code}}</span>
					</td>
				</tr>
				<tr>
					<td>登录名：</td>
					<td>
				  	<span v-if="!!source.storeAccount">{{source.storeAccount.userName}}</span>
					</td>
				</tr>
				<tr>
					<td>可推广区域：</td>
					<td>
						<template v-if="!!source.managerDutyAreaConfigList">
							<el-tree
							  :default-expanded-keys="expandKeys"
							  :data="dutyAreaList"
							  node-key="code"
							  empty-text="暂无辖区数据">
							</el-tree>
						</template>
						<!-- <span v-if="!!source.managerDutyAreaConfigList" v-for="(area, inx) in source.managerDutyAreaConfigList" :key="area.id">
							{{area.province}} {{area.city}} {{area.region}} {{inx === (source.managerDutyAreaConfigList.length - 1) ? '' : ' 、 '}}
						</span> -->
					</td>
				</tr>
			</table>
		  <table class="form-table">
		  	<tr>
		  	  <td>姓名：</td>
		  	  <td>
		  	  	<span v-if="!!source.storeAccount">{{source.storeAccount.name}}</span>
		  	  </td>
		  	</tr>
		    <tr>
		      <td>身份证号：</td>
		      <td>
		        <span v-if="!!source.storeAccount">{{source.storeAccount.idCard}}</span>
		      </td>
		    </tr>
		   <tr>
		     <td>身份证：</td>
		     <td>
			     	<ul class="img-list">
			     		<li class="img-box" v-if="!!source.storeAccount && source.storeAccount.idCardBackUrl">
			     		  <img :src="source.storeAccount.idCardBackUrl"/>
			     		</li>
			     		<li class="img-box" v-if="!!source.storeAccount && source.storeAccount.idCardJustUrl">
			     		  <img :src="source.storeAccount.idCardJustUrl"/>
			     		</li>
			     	</ul>
		     </td>
		   </tr>
		    <tr>
		      <td>手机号：</td>
		      <td>
		      	<span v-if="!!source.storeAccount">{{source.storeAccount.phone}}</span>
		      </td>
		    </tr>
		    <tr>
		      <td>邮箱：</td>
		      <td>
		      	<span v-if="!!source.storeAccount">{{source.storeAccount.email}}</span>
		      </td>
		    </tr>
		    <tr>
		      <td>备注：</td>
		      <td>
		      	<span v-if="!!source.storeAccount">{{source.storeAccount.remarks}}</span>
		      </td>
		    </tr>
		  </table>
	</div>
</template>

<script>
	  export default {
	  	props: {
	  		source: {
	  			type: Object,
	  			default() {
	  				return {
	  					merManager: {},
	  					storeAccount: {}
	  				};
	  			}
	  		},
	  		// 查看审批详情
	  		// isApproval: {
	  		// 	type: Boolean,
	  		// 	default() {
	  		// 		return false;
	  		// 	}
	  		// },
	  		// //之前的审批内容
	  		// oldSource: {
	  		// 	type: Object,
	  		// 	default() {
	  		// 		return {}
	  		// 	}
	  		// }
	  	},
	  	data() {
	  		return {
	  			dutyAreaList: [],
	      	expandKeys: [],
	      	// dutyAreaListOld: [],
	      	// expandKeysOld: []
	  		}
	  	},
	  watch: {
	  	'source.managerDutyAreaConfigList': {
	  	  deep: true,
	  	  immediate: true,
	  	  handler(area) {
	  	    if (area && area.length) {
	  	      this.getDutyArea(area);
	  	    }
	  	  }
	  	},
	  	// 'oldSource.managerDutyAreaConfigs': {
	  	//   deep: true,
	  	//   immediate: true,
	  	//   handler(area) {
	  	//     if (area && area.length) {
	  	//       this.getDutyAreaOld(area);
	  	//     }
	  	//   }
	  	// }
	  },
    methods: {
    	// compareSource(vals) {
     //    let newVal = Object.assign({}, this.source);
     //    let oldVal = Object.assign({}, this.oldSource);
     //    if (!oldVal || !newVal) {
     //      return false;
     //    }
     //    for (var i = 0; i < vals.length; i++) {
     //      newVal = newVal[vals[i]];
     //      oldVal = oldVal[vals[i]];
     //      if (!newVal) {
     //        if (oldVal) {
     //          return true;
     //        }
     //        return false;
     //      }
     //      if (!oldVal) {
     //        return false;
     //      }
     //      if (i === vals.length - 1) {
     //        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
     //          return true;
     //        }
     //      }
     //    }
     //  },
    	getDutyArea(area) {
    		let arr = [];
    		area.map(item => {
    	  	this.formatDutyArea(arr, item, [], ['province', 'city', 'region'], 0, item);
    		});
    	   this.dutyAreaList = arr;
    		if (arr.length > 0) {
    		  this.expandKeys = [arr[0].code];
    		} else {
    		  this.expandKeys = [];
    		}
    		this.$forceUpdate();
    	},
    	// getDutyAreaOld(area) {
    	// 	let arr = [];
    	// 	area.map(item => {
    	//   	this.formatDutyArea(arr, item, [], ['province', 'city', 'region'], 0, item);
    	// 	});
    	//    this.dutyAreaListOld = arr;
    	// 	if (arr.length > 0) {
    	// 	  this.expandKeysOld = [arr[0].code];
    	// 	} else {
    	// 	  this.expandKeysOld = [];
    	// 	}
    	// },
    	formatDutyArea(arr, area, inxList, levelArea, level) {
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
    	        this.formatDutyArea(arr, area, inxList, levelArea, level + 1);
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
    	},
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
    margin: 5px 5px 5px 0;
    align-items: center;
    justify-content: center;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    overflow: hidden;
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

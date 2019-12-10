<template>
	<div>
		<div class="info-list">
		  <h4 class="step-title-tag"><i class="icon-tag"></i>推广人及所属上级信息</h4>
		  <div style="margin-bottom: 20px;">
		  	<table class="form-table">
		  		<tr>
		  			<td>推广人编码：</td>
		  			<td>
		  				<template v-if="!!source.store">{{source.store.spreadCode}}</template>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>推广人角色：</td>
		  			<td>
		  				<template v-if="!!source.store">{{spreadType[source.store.spreadType - 1]}}</template>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>推广人姓名：</td>
		  			<td>
		  				<template v-if="!!source.store">{{source.store.spreadUsername}}</template>
		  			</td>
		  		</tr>
		  	</table>
		</div>
		  <div>
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
		  <!-- <div style="margin-bottom: 20px;">
		  	<table class="form-table">
		  		<tr>
		  			<td>所属省区总编号：</td>
		  			<td>{{source.bossCode}}</td>
		  		</tr>
		  		<tr>
		  			<td>所属省区总名：</td>
		  			<td>{{source.bossName}}</td>
		  		</tr>
		  	</table>
		  </div>
		  <div style="margin-bottom: 20px;">
		  	<table class="form-table">
		  		<tr>
		  			<td>所属合作商编号：</td>
		  			<td>{{source.cooperationCode}}</td>
		  		</tr>
		  		<tr>
		  			<td>所属合作商公司名：</td>
		  			<td>{{source.cooperationName}}</td>
		  		</tr>
		  	</table>
		  </div> -->
		</div>
		<div class="info-list">
		  <h4 class="step-title-tag"><i class="icon-tag"></i>商户信息</h4>
		  <table class="form-table">
		  	<tr>
		  		<td>商户编码：</td>
		  		<td>
						<span v-if="!!source.storeAccount">{{source.storeAccount.code}}</span>
						<div class="approval-before" v-if="isApproval && compareSource(['storeAccount', 'code'])">
							<p class="color-red">变更前：</p>
							<span v-if="!!oldSource.storeAccount">{{oldSource.storeAccount.code}}</span>
						</div>
		  		</td>
		  	</tr>
		  	<tr>
		  		<td>商户姓名：</td>
		  		<td>
		  	  	<span v-if="!!source.storeAccount">{{source.storeAccount.name}}</span>
		  	  	<div class="approval-before" v-if="isApproval && compareSource(['storeAccount', 'name'])">
		  	  		<p class="color-red">变更前：</p>
		  	  		<span v-if="!!oldSource.storeAccount">{{oldSource.storeAccount.name}}</span>
		  	  	</div>
		  		</td>
		  	</tr>
		  	<tr>
		  		<td>商户手机号：</td>
		  		<td>
		  	  	<span v-if="!!source.storeAccount">{{source.storeAccount.phone}}</span>
		  	  	<div class="approval-before" v-if="isApproval && compareSource(['storeAccount', 'phone'])">
		  	  	  <p class="color-red">变更前：</p>
		  	  	  <span v-if="!!oldSource.storeAccount">{{oldSource.storeAccount.phone}}</span>
		  	  	</div>
		  		</td>
		  	</tr>
		  	<tr>
		  		<td>商户邮箱：</td>
		  		<td>
		  	  	<span v-if="!!source.storeAccount">{{source.storeAccount.email}}</span>
		  	  	<div class="approval-before" v-if="isApproval && compareSource(['storeAccount', 'email'])">
		  	  	  <p class="color-red">变更前：</p>
		  	  	  <span v-if="!!oldSource.storeAccount">{{oldSource.storeAccount.email}}</span>
		  	  	</div>
		  		</td>
		  	</tr>
		  	<tr>
		  		<td>身份证号：</td>
		  		<td>
		  	  	<span v-if="!!source.storeAccount">{{source.storeAccount.idCard}}</span>
		  	  	<div class="approval-before" v-if="isApproval && compareSource(['storeAccount', 'idCard'])">
		  	  	  <p class="color-red">变更前：</p>
		  	  	  <span v-if="!!oldSource.storeAccount">{{oldSource.storeAccount.idCard}}</span>
		  	  	</div>
		  		</td>
		  	</tr>
		  	<tr>
		  		<td>身份证：</td>
		  		<td>
		  	    <ul class="img-list">
		  	    	<li class="img-box" v-if="!!source.storeAccount && source.storeAccount.idCardJustUrl">
		  	    		<el-popover
		  	    				placement="top"
		  	    				popper-class="tootip-img-box"
		  	    				trigger="click">
		  	    				<img :src="source.storeAccount.idCardJustUrl"/>
		  	    				<img slot="reference" :src="source.storeAccount.idCardJustUrl"/>
		  	    		</el-popover>
		  	    	</li>
		  	    	<li class="img-box" v-if="!!source.storeAccount && source.storeAccount.idCardBackUrl">
		  	    		<el-popover
		  	    				placement="top"
		  	    				popper-class="tootip-img-box"
		  	    				trigger="click">
		  	    				<img :src="source.storeAccount.idCardBackUrl"/>
		  	    				<img slot="reference" :src="source.storeAccount.idCardBackUrl"/>
		  	    		</el-popover>
		  	    	</li>
		  	    </ul>
		  	    <div v-if="isApproval && (compareSource(['storeAccount', 'idCardBackUrl']) || compareSource(['storeAccount', 'idCardJustUrl']))" class="approval-before">
		  	      <p class="color-red">变更前：</p>
		  	      <ul class="img-list">
		  	      	<li class="img-box" v-if="!!oldSource.storeAccount && oldSource.storeAccount.idCardJustUrl">
		  	      		<el-popover
		  	      				placement="top"
		  	      				popper-class="tootip-img-box"
		  	      				trigger="click">
		  	      				<img :src="oldSource.storeAccount.idCardJustUrl"/>
		  	      				<img slot="reference" :src="oldSource.storeAccount.idCardJustUrl"/>
		  	      		</el-popover>
		  	      	</li>
		  	      	<li class="img-box" v-if="!!oldSource.storeAccount && oldSource.storeAccount.idCardBackUrl">
		  	      	  <el-popover
		  	      	  		placement="top"
		  	      	  		popper-class="tootip-img-box"
		  	      	  		trigger="click">
		  	      	  		<img :src="oldSource.storeAccount.idCardBackUrl"/>
		  	      	  		<img slot="reference" :src="oldSource.storeAccount.idCardBackUrl"/>
		  	      	  </el-popover>
		  	      	</li>
		  	      </ul>
		  	    </div>
		  		</td>
		  	</tr>
		  	<tr>
		  		<td>账号：</td>
		  		<td>
		  	  	<span v-if="!!source.storeAccount">{{source.storeAccount.userName}}</span>
		  	  	<div class="approval-before" v-if="isApproval && compareSource(['storeAccount', 'userName'])">
		  	  	  <p class="color-red">变更前：</p>
		  	  	  <span v-if="!!oldSource.storeAccount">{{oldSource.storeAccount.userName}}</span>
		  	  	</div>
		  		</td>
		  	</tr>
		  	<tr v-if="isApproval">
		  	  <td>账号状态：</td>
		  	  <td>
		  	  	<span v-if="!!source.storeAccount">{{accountStatus[source.storeAccount.status * 1 - 1]}}</span>
		  	  	<div v-if="isApproval && compareSource(['storeAccount', 'status'])" class="approval-before">
		  	  	  <p class="color-red">变更前：</p>
		  	  	  <span v-if="!!oldSource.storeAccount">{{accountStatus[oldSource.storeAccount.status * 1 - 1]}}</span>
		  	  	</div>
		  	  </td>
		  	</tr>
		  	<tr v-if="isApproval">
		  	  <td>开启状态：</td>
		  	  <td>
		  	  	<span v-if="!!source.storeAccount">
		  	  		{{source.storeAccount.isEnable === 1 ? '停用' : '启用'}}
		  	  	</span>
		  	  	<div v-if="isApproval && compareSource(['storeAccount', 'isEnable'])" class="approval-before">
		  	  	  <p class="color-red">变更前：</p>
		  	  	  <span v-if="!!oldSource.storeAccount">{{oldSource.storeAccount.isEnable === 1 ? '停用' : '启用'}}</span>
		  	  	</div>
		  	  </td>
		  	</tr>
		  	<tr>
		  	  <td>备注：</td>
		  	  <td>
		  	  	<span v-if="!!source.storeAccount">{{source.storeAccount.remarks}}</span>
		  	  	<div v-if="isApproval && compareSource(['storeAccount', 'remarks'])" class="approval-before">
		  	  	  <p class="color-red">变更前：</p>
		  	  	  <span v-if="!!oldSource.storeAccount">{{oldSource.storeAccount.remarks}}</span>
		  	  	</div>
		  	  </td>
		  	</tr>
		  	<tr>
		  	  <td>入驻时间：</td>
		  	  <td>
		  	  	<span v-if="!!source.store">{{source.store.approvalTime}}</span>
		  	  	<div v-if="isApproval && compareSource(['store', 'approvalTime'])" class="approval-before">
		  	  	  <p class="color-red">变更前：</p>
		  	  	  <span v-if="!!oldSource.store">{{oldSource.store.approvalTime}}</span>
		  	  	</div>
		  	  </td>
		  	</tr>
		  </table>
			</div>
			<div class="info-list">
			  <h4 class="step-title-tag"><i class="icon-tag"></i>店铺信息</h4>
			  <table class="form-table">
			  	<tr>
			  		<td>店铺编号：</td>
			  		<td>
			      	<span v-if="!!source.store">{{source.store.code}}</span>
			      	<div v-if="isApproval && compareSource(['store', 'code'])" class="approval-before">
			      	  <p class="color-red">变更前：</p>
			      	  <span v-if="!!oldSource.store">{{oldSource.store.code}}</span>
			      	</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>店铺名称：</td>
			  		<td>
			      	<span v-if="!!source.store">{{source.store.nickName}}</span>
			      	<div v-if="isApproval && compareSource(['store', 'nickName'])" class="approval-before">
			      	  <p class="color-red">变更前：</p>
			      	  <span v-if="!!oldSource.store">{{oldSource.store.nickName}}</span>
			      	</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>店铺角色：</td>
			  		<td>
			      	<span v-if="!!source.store">{{source.store.type ? storeType[source.store.type * 1 - 1] : ''}}</span>
			      	<div v-if="isApproval && compareSource(['store', 'type'])" class="approval-before">
			      	  <p class="color-red">变更前：</p>
				      	<span v-if="!!oldSource.store">{{oldSource.store.type ? storeType[oldSource.store.type * 1 - 1] : ''}}</span>
			      	</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>店铺分类：</td>
			  		<td>
			      	<span v-if="!!source.storeCategoryInside">{{getStoreCategory(source.storeCategoryInside)}}</span>
			      	<div v-if="isApproval && compareSource(['storeCategoryInside'])" class="approval-before">
			      	  <p class="color-red">变更前：</p>
			      		<span v-if="!!oldSource.storeCategoryInside">{{getStoreCategory(oldSource.storeCategoryInside)}}</span>
			      	</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>店铺折扣：</td>
			  		<td>
			      	<span v-if="!!source.store">{{source.store.rateConfig ? (source.store.rateConfig.storeRateBase * 10).toFixed(2) : '无折扣'}}</span>
			      	<div v-if="isApproval && compareSource(['store', 'rateConfig', 'storeRateBase'])" class="approval-before">
			      	  <p class="color-red">变更前：</p>
			      		<span v-if="!!oldSource.store">{{oldSource.store.rateConfig ? (oldSource.store.rateConfig.storeRateBase * 10).toFixed(2) : '无折扣'}}</span>
			      	</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>所在区域：</td>
			  		<td>
			      	<span v-if="!!source.store">{{source.store.province}} {{source.store.city}} {{source.store.region}}</span>
			      	<div v-if="isApproval && (compareSource(['store', 'province']) || compareSource(['store', 'city']) || compareSource(['store', 'region']))" class="approval-before">
			      	  <p class="color-red">变更前：</p>
				      	<span v-if="!!oldSource.store">{{oldSource.store.province}} {{oldSource.store.city}} {{oldSource.store.region}}</span>
			      	</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>详细地址：</td>
			  		<td>
			      	<span v-if="!!source.store">{{source.store.address}}</span>
			      	<div v-if="isApproval && compareSource(['store', 'address'])" class="approval-before">
			      	  <p class="color-red">变更前：</p>
				      	<span v-if="!!oldSource.store">{{oldSource.store.address}}</span>
			      	</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>店铺定位：</td>
			  		<td>
			  			<span v-if="!!source.store">（{{source.store.longitude}}, {{source.store.latitude}}）</span>
			  			<div v-if="isApproval && (compareSource(['store', 'longitude']) || compareSource(['store', 'latitude']))" class="approval-before">
			  			  <p class="color-red">变更前：</p>
			  				<span v-if="!!oldSource.store">（{{oldSource.store.longitude}}, {{oldSource.store.latitude}}）</span>
			  			</div>

			  			<p v-if="!!source.nearestStore">距离最近的种子店 <em style="font-style: normal;font-weight: 700;">{{source.nearestStore.name}}</em> <span class="link">{{fixedNum(source.nearestStore.distanceNum / 1000, 2)}}千米</span></p>
			  			<div v-if="isApproval && compareSource(['nearestStore'])" class="approval-before">
			  			  <p class="color-red">变更前：</p>
				  			<p v-if="!!oldSource.nearestStore">距离最近的种子店 <em style="font-style: normal;font-weight: 700;">{{oldSource.nearestStore.name}}</em> <span class="link">{{fixedNum(oldSource.nearestStore.distanceNum / 1000, 2)}}千米</span></p>
			  			</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>店铺头像：</td>
			  		<td>
			  			<div class="img-box" v-if="!!source.store && !!source.store.logo">
			  				<el-popover
			  				  placement="top"
			  				  popper-class="tootip-img-box"
			  				  trigger="click">
			  					<img :src="source.store.logo"/>
			  					<img slot="reference" :src="source.store.logo"/>
			  				</el-popover>
			  			</div>
			  			<div v-if="isApproval && compareSource(['store', 'logo'])" class="approval-before">
			  			  <p class="color-red">变更前：</p>
			  				<div class="img-box" v-if="!!oldSource.store && !!oldSource.store.logo">
			  				  <el-popover
			  				    placement="top"
			  				    popper-class="tootip-img-box"
			  				    trigger="click">
			  				  	<img :src="oldSource.store.logo"/>
			  				  	<img slot="reference" :src="oldSource.store.logo"/>
			  				  </el-popover>
			  				</div>
			  			</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>店铺环境：</td>
			  		<td>
			  			<ul class="img-list" v-if="!!source.store && !!source.store.albums">
			  				<li class="img-box" v-for="src in source.store.albums.split(',')">
			  					<el-popover
			  					  placement="top"
			  					  popper-class="tootip-img-box"
			  					  trigger="click">
			  						<img :src="src"/>
			  						<img slot="reference" :src="src"/>
			  					</el-popover>
			  				</li>
			  			</ul>
			  			<div v-if="isApproval && compareSource(['store', 'albums'])" class="approval-before">
			  			  <p class="color-red">变更前：</p>
			  				<ul class="img-list" v-if="!!oldSource.store && !!oldSource.store.albums">
			  					<li class="img-box" v-for="src in oldSource.store.albums.split(',')">
			  					  <el-popover
			  					    placement="top"
			  					    popper-class="tootip-img-box"
			  					    trigger="click">
			  					  	<img :src="src"/>
			  					  	<img slot="reference" :src="src"/>
			  					  </el-popover>
			  					</li>
			  				</ul>
			  			</div>
			  		</td>
			  	</tr>
			  	<tr>
			  		<td>商家电话：</td>
			  		<td>
		      		<span v-if="!!source.store">{{source.store.phone}}</span>
		      		<div v-if="isApproval && compareSource(['store', 'phone'])" class="approval-before">
		      		  <p class="color-red">变更前：</p>
		      			<span v-if="!!oldSource.store">{{oldSource.store.phone}}</span>
		      		</div>
			  		</td>
			  	</tr>
				  <tr>
				  	<td>营业时间：</td>
				  	<td>
			      	<span v-if="!!source.store">{{source.store.startTime}} - {{source.store.endTime}}</span>
			      	<div v-if="isApproval && (compareSource(['store', 'startTime']) || compareSource(['store', 'endTime']))" class="approval-before">
			      	  <p class="color-red">变更前：</p>
				      	<span v-if="!!oldSource.store">{{oldSource.store.startTime}} - {{oldSource.store.endTime}}</span>
			      	</div>
				  	</td>
				  </tr>
				  <tr>
				  	<td>店铺简介：</td>
				  	<td>
			      	<span v-if="!!source.store">{{source.store.info}}</span>
			      	<div v-if="isApproval && compareSource(['store', 'info'])" class="approval-before">
			      	  <p class="color-red">变更前：</p>
				      	<span v-if="!!oldSource.store">{{oldSource.store.info}}</span>
			      	</div>
				  	</td>
				  </tr>
			  </table>
		</div>
		<div class="info-list">
      <h4 class="step-title-tag"><i class="icon-tag"></i>资质证件</h4>
      <table class="form-table">
      	<tr>
      		<td>营业执照号：</td>
      		<td>
			    	<span v-if="!!source.store">{{source.store.bcCode}}</span>
			    	<div v-if="isApproval && compareSource(['store', 'bcCode'])" class="approval-before">
			    	  <p class="color-red">变更前：</p>
				    	<span v-if="!!oldSource.store">{{oldSource.store.bcCode}}</span>
			    	</div>
      		</td>
      	</tr>
      	<tr>
      		<td>名称：</td>
      		<td>
			    	<span v-if="!!source.store">{{source.store.name}}</span>
			    	<div v-if="isApproval && compareSource(['store', 'name'])" class="approval-before">
			    	  <p class="color-red">变更前：</p>
			    		<span v-if="!!oldSource.store">{{oldSource.store.name}}</span>
			    	</div>
      		</td>
      	</tr>
      	<tr>
      		<td>类型：</td>
      		<td>
			    	<span v-if="!!source.store && source.store.bcRegisterType">{{registerType[source.store.bcRegisterType * 1 - 1]}}</span>
			    	<div v-if="isApproval && compareSource(['store', 'bcRegisterType'])" class="approval-before">
			    	  <p class="color-red">变更前：</p>
				    	<span v-if="oldSource.store && oldSource.store.bcRegisterType">{{registerType[oldSource.store.bcRegisterType * 1 - 1]}}</span>
			    	</div>
      		</td>
      	</tr>
      	<tr>
      		<td>营业期限：</td>
      		<td>
      			<span v-if="!!source.store">{{source.store.bcEndtime}}</span>
      			<div v-if="isApproval && compareSource(['store', 'bcEndtime'])" class="approval-before">
      			  <p class="color-red">变更前：</p>
	      			<span v-if="!!oldSource.store">{{oldSource.store.bcEndtime}}</span>
      			</div>
      		</td>
      	</tr>
      	<tr>
      		<td>营业执照：</td>
      		<td>
      			<div class="img-box" v-if="!!source.store && source.store.bcPicUrl">
      				<el-popover
      				  placement="top"
      				  popper-class="tootip-img-box"
      				  trigger="click">
      					<img :src="source.store.bcPicUrl"/>
      					<img slot="reference" :src="source.store.bcPicUrl"/>
      				</el-popover>
      			</div>
      			<div v-if="isApproval && compareSource(['store', 'bcPicUrl'])" class="approval-before">
      			  <p class="color-red">变更前：</p>
      				<div class="img-box" v-if="!!oldSource.store && oldSource.store.bcPicUrl">
      				  <el-popover
      				 	  placement="top"
      				 	  popper-class="tootip-img-box"
      				 	  trigger="click">
      				  	<img :src="oldSource.store.bcPicUrl"/>
      				  	<img slot="reference" :src="oldSource.store.bcPicUrl"/>
      				 	</el-popover>
      				</div>
      			</div>
      		</td>
      	</tr>
      	<tr>
      		<td>法人姓名：</td>
      		<td>
			    	<span v-if="!!source.store">{{source.store.bcUserName}}</span>
			    	<div v-if="isApproval && compareSource(['store', 'bcUserName'])" class="approval-before">
			    	  <p class="color-red">变更前：</p>
				    	<span v-if="!!oldSource.store">{{oldSource.store.bcUserName}}</span>
			    	</div>
      		</td>
      	</tr>
      	<tr>
      		<td>法人身份证号：</td>
      		<td>
			      <span v-if="!!source.store">{{source.store.bcUserIdCard}}</span>
			      <div v-if="isApproval && compareSource(['store', 'bcUserIdCard'])" class="approval-before">
			        <p class="color-red">变更前：</p>
				      <span v-if="!!oldSource.store">{{oldSource.store.bcUserIdCard}}</span>
			      </div>
      		</td>
      	</tr>
      	<tr>
      		<td>法人身份证：</td>
      		<td>
      	    <ul class="img-list">
      	    	<li class="img-box" v-if="!!source.store && source.store.idCardJustUrl">
      	    		<el-popover
      	    				placement="top"
      	    				popper-class="tootip-img-box"
      	    				trigger="click">
      	    				<img :src="source.store.idCardJustUrl"/>
      	    				<img slot="reference" :src="source.store.idCardJustUrl"/>
      	    		</el-popover>
      	    	</li>
      	    	<li class="img-box" v-if="!!source.store && source.store.idCardBackUrl">
      	    		<el-popover
      	    				placement="top"
      	    				popper-class="tootip-img-box"
      	    				trigger="click">
      	    				<img :src="source.store.idCardBackUrl"/>
      	    				<img slot="reference" :src="source.store.idCardBackUrl"/>
      	    		</el-popover>
      	    	</li>
      	    </ul>
      	    <div v-if="isApproval && (compareSource(['store', 'idCardBackUrl']) || compareSource(['store', 'idCardJustUrl']))" class="approval-before">
      	      <p class="color-red">变更前：</p>
      	      <ul class="img-list">
      	      	<li class="img-box" v-if="!!oldSource.store && oldSource.store.idCardJustUrl">
      	      		<el-popover
      	      				placement="top"
      	      				popper-class="tootip-img-box"
      	      				trigger="click">
      	      				<img :src="oldSource.store.idCardJustUrl"/>
      	      				<img slot="reference" :src="oldSource.store.idCardJustUrl"/>
      	      		</el-popover>
      	      	</li>
      	      	<li class="img-box" v-if="!!oldSource.store && oldSource.store.idCardBackUrl">
      	      	  <el-popover
      	      	  		placement="top"
      	      	  		popper-class="tootip-img-box"
      	      	  		trigger="click">
      	      	  		<img :src="oldSource.store.idCardBackUrl"/>
      	      	  		<img slot="reference" :src="oldSource.store.idCardBackUrl"/>
      	      	  </el-popover>
      	      	</li>
      	      </ul>
      	    </div>
      		</td>
      	</tr>
      	<tr>
      		<td>其他证件：</td>
      		<td>
      	    <ul class="img-list" v-if="!!source.store && !!source.store.idOthrCerUrl">
      	    	<li class="img-box" v-for="pic in source.store.idOthrCerUrl.split(',')">
      	    		<el-popover
      	    				placement="top"
      	    				popper-class="tootip-img-box"
      	    				trigger="click">
      	    				<img :src="pic"/>
      	    				<img slot="reference" :src="pic"/>
      	    		</el-popover>
      	    	</li>
      	    </ul>
      	    <div v-if="isApproval && compareSource(['store', 'idOthrCerUrl'])" class="approval-before">
      	      <p class="color-red">变更前：</p>
      	      <ul class="img-list" v-if="!!oldSource.store && !!oldSource.store.idOthrCerUrl">
      	      	<li class="img-box" v-for="pic in oldSource.store.idOthrCerUrl.split(',')">
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
		<!--   <el-dialog title="店铺定位"
			  :visible.sync="mapDialog.visible"
			  width="750px">
		  	<div id="allmap"></div>
		  </el-dialog> -->
	</div>
</template>

<script>
  import {format, parseQueryString, fixedNum, arrToString} from "@/utils";
  // import BMap from 'BMap';

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
	  		},
	  		delFlag: {
	  			type: Number,
	  			default() {
	  				return null;
	  			}
	  		}
	  	},
	    data() {
	      return {
	      	format,
	      	fixedNum,
	      	spreadType: ['省区总', '合作商', '推广员', '种子店', '特色店'],
	      	storeType: ['种子店', '特色店'],
	      	registerType: ['个体店铺', '企业'],
	      	accountStatus: ['正常', '关闭', '冻结'],
	      	provinceData: {
	      		visible: false,
	      		form: []
	      	},
	      	partnerData: {
	      		visible: false,
	      		form: []
	      	},
	      	mapDialog: {
	      		visible: false
	      	}
        }
      },
    watch: {
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
    	getStoreCategory(obj) {
    		if (!obj) {
    			return ;
    		}
    		let str = '';
    		if (obj.parents && obj.parents.length) {
    			str += arrToString(obj.parents, obj.parentId);
    		}
    		if (str && obj.name) {
    			str += '>'
    		}
    		return str + obj.name
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
    	// showMap: function() {
    	// 	this.mapDialog.visible = true;
	    //   this.$nextTick(() => {
	    //   	var map = new BMap.Map('allmap')
	    //   	var point = new BMap.Point(Number(this.source.store.longitude), Number(this.source.store.latitude)) // 创建点坐标
	    //   	var marker = new BMap.Marker(point);  // 创建标注
	    //   	map.addOverlay(marker);               // 将标注添加到地图中
	    //   	map.centerAndZoom(point, 15);
	    //   	map.enableScrollWheelZoom(true);   // 启用滚轮放大缩小，默认禁用
	    //   	map.enableContinuousZoom();    // 启用地图惯性拖拽，默认禁用
	    //   	// 初始化地图， 设置中心点坐标和地图级别(比例尺)
	    //   	var scaleCtrl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
	    //   	map.addControl(scaleCtrl);
	    //   	// var opts = {
	    //   	// 	  width : 200,     // 信息窗口宽度
	    //   	// 	  height: 100,     // 信息窗口高度
	    //   	// 	  title : this.source.store.name , // 信息窗口标题
	    //   	// 	  enableMessage: false//设置允许信息窗发送短息
	    //   	// 	}
	    //   	// 	var infoWindow = new BMap.InfoWindow("地址：" + this.source.store.address, opts);  // 创建信息窗口对象
	    //   	// 	marker.addEventListener("click", function(){
	    //   	// 		map.openInfoWindow(infoWindow,point); //开启信息窗口
	    //   	// 	});
	    //   })
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
    overflow:hidden;
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
  .link{
    padding: 0 4px;
    color: #409eff;
  }
  .approval-before{
  	font-size: 12px;
  	.color-red{
  		color: #f00;
  		margin: 6px 0 0;
  	}
  }
  .form-table td:nth-child(even){
  	width: 470px;
  }
</style>

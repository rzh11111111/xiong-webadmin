<template>
	<div class="goods-info-box">
		<el-container>
		  <el-aside width="400px">
				<div class="big-pic" v-if="!!source.picList">
					<img :src="source.picList[mainPic]" alt="" width="400" height="400">
				</div>
				<ul class="goods-img-list" v-if="!!source.picList">
					<li v-for="(url, inx) in source.picList" :style="(mainPic == inx ? 'border-color: ' + theme.color + ';' : '') " @click="changeMainPic(url, inx)">
						<img :src="url" alt="" width="70" height="70">
					</li>
				</ul>
		  </el-aside>
		  <el-container>
		    <el-main>
		    	<h4 class="goods-title">{{source.title}}</h4>
		    	<ul class="goods-price">
		    		<li>
		    			市场价：<i>¥ {{(source.goodsSkus[skuPrice].price / 100)|currency}}</i>
		    		</li>
		    		<li>
		    			会员价：<i>¥ {{(source.goodsSkus[skuPrice].priceSell / 100)|currency}}</i>
		    		</li>
		    		<li>
		    			抵扣积分：<i>{{(source.goodsSkus[skuPrice].price / 100 - source.goodsSkus[skuPrice].priceSell / 100)|currency}}</i>
		    		</li>
		    	</ul>
		    	<div class="goods-seller-info">
		    		<p>
		    			<label>运费</label>
		    			<span>全国包邮</span>
		    		</p>
		    		<div class="goods-seller-attrs">
		    			<label>规格</label>
		    			<ul>
		    				<li v-for="(sku, inx) in source.goodsSkus" :style="(skuPrice == inx ? 'border-color: ' + theme.color + ';color: ' + theme.color : '')" @click="changeSku(sku, inx)">{{getSkusName(sku)}}</li>
		    			</ul>
		    		</div>
		    		<p>
		    			<label>服务保障</label>
		    			<span>
		    				<em>正品保障</em>
		    				<em>售后无忧</em>
		    			</span>
		    		</p>
		    	</div>
		    </el-main>
		  </el-container>
		</el-container>
		<div class="goods-attrs">
			<p>
				品牌：{{source.brand.name}}
			</p>
			<h6 v-if="!!source.goodsAttributes.length">商品属性：</h6>
			<ul>
				<li v-for="attrs in source.goodsAttributes" :key="attrs.id">
					<span>{{attrs.attributeName}}：</span>
					<em>{{attrs.attributeVal}}</em>
				</li>
			</ul>
		</div>
		<div v-html="source.info" class="goods-infos"></div>
	</div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {currency} from "@/filters"

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
					};
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
				mainPic: 0,
				skuPrice: 0
			}
		},
		watch: {
			'source.picsUrls'(urls) {
				if (!this.source.picList && urls) {
					this.source.picList = urls.split(',');
				}
			}
		},
    filters: {
      currency: currency
    },
		computed: {
		  ...mapGetters([
		    'theme'
		  ])
		},
    methods: {
    	changeMainPic(url, inx) {
    		this.mainPic = inx;
    	},
    	changeSku(sku, inx) {
    		this.skuPrice = inx;
    	},
    	getSkusName(sku) {
    		if (sku.goodsSkuAttributes) {
    			if (sku.goodsSkuAttributes.length == 1) {
    				if (!sku.goodsSkuAttributes.goodsAttributeName || !sku.goodsSkuAttributes.goodsAttributeName.id) {
    					return this.source.name || '常规';
    				}
    			} else if(sku.goodsSkuAttributes.length == 0) {
            return this.source.name || '常规';
          }
    			let str = '';
    			sku.goodsSkuAttributes.map(item => {
    				str += item.attributeVal + ' ';
    			})
    			return str;
    		} else {
          return this.source.name || '常规';
        }

    	}
    },
    components: {
    },
    created() {
    	if (!this.source.picList && this.source.picsUrls) {
    		this.source.picList = this.source.picsUrls.split(',');
    	}
    },
    async mounted() {
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
@import '../../../styles/mixin.scss';

  .goods-info-box{
    max-width: 698px;
  	padding: 20px;
    border-top: 1px solid #dfdfdf;
  	.el-aside{
  		margin-right: 20px;
  		overflow: hidden;
      border-right-width: 0;
      background-color: #fff;
  	}
  	.big-pic{
  		width: 100%;
  		height: 400px;
  		margin-bottom: 20px;
  	}
  	.goods-img-list{
  		list-style-type: none;
  		height: 72px;
  		width: 100%;
  		margin: 0;
  		padding: 0;
  		li{
  			display: inline-block;
  			width: 72px;
  			height: 72px;
  			border: 1px solid #ddd;
  			box-sizing: border-box;
  			margin-right: 10px;
  			cursor: pointer;
  			&:last-child{
  				margin-right: 0;
  			}
  			&.active{
  				border-color: #409EFF;
  			}
  		}
  	}
  	.goods-title{
  		font-size: 14px;
  		margin-top: 0;
  	}
  	.goods-price{
  		list-style-type: none;
  		background-color: #f3f3f3;
  		padding: 10px 15px;
  		margin: 0;
  		i{
  			font-style: normal;
  			margin-left: 10px;
  			color: red;
  		}
  	}
  	.goods-seller-info{
  		label{
  			padding-right: 20px;
  		}
  		i, em{
  			font-style: normal;
  		}
  		.goods-seller-attrs{
  			display: flex;
  			ul{
  				list-style-type: none;
  				margin: 0;
  				flex: 1;
  				padding: 0;
  				li{
  					display: inline-block;
  					border: 1px solid #999;
  					padding: 5px 8px;
  					margin-right: 5px;
  					margin-bottom: 8px;
  					cursor: pointer;
  					&:last-child{
  						margin-right: 0;
  					}
  					&.active{
  						border-color: #409EFF;
  					}
  				}
  			}

  		}
  	}
  	.goods-attrs{
  		padding: 10px;
  		margin-top: 30px;
  		border: 1px solid #ddd;
  		h6{
  			margin: 20px 0 10px 0;
  			font-size: 14px;
  		}
  		p{
  			margin: 0;
  		}
  		ul{
  			list-style-type: none;
  			margin: 0;
  			padding: 0 0 0 10px;
  			font-size: 12px;
  			span{
  				font-weight: 400;
  			}
  			em{
  				margin-left: 10px;
  				font-style: normal;
  			}
  		}
  	}
  	.goods-infos{
      position: relative;
  		margin-top: 20px;
  		padding: 20px;
  		border: 1px solid #ddd;
  	}
  }
  .approval-before{
    font-size: 12px;
    .color-red{
      color: #f00;
    }
  }
</style>

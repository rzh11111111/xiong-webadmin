<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog">

      </search-sub>
      <!--树列表-->
      <tree-sidebar-table ref="tableSub" @del="handleDel"
                :getTreeList="getTreeList"
                :treeConfig="treeConfig"
                :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="skuPriceSellMin" slot-scope="{ index,row }">
          <span>{{(row.skuPriceSellMin/100)|currency}}</span>
        </template>
        <template slot="skuPriceMin" slot-scope="{ index,row }">
          <span>{{(row.skuPriceMin/100)|currency}}</span>
        </template>
        <template slot="table" slot-scope="{ index,row }">
          <el-button @click="handleIllegal(row)" type="text" size="small" v-if="violation">操作</el-button>
          <el-button @click="handleDetail(row)" type="text" size="small">查看详情</el-button>
        </template>
        <template slot="picUrl" slot-scope="{index,row }">
            <img :src="row.picUrl" width="40"/>
        </template>
        <template slot="title" slot-scope="{ index,row }">
            <p class="ellipsiss">{{row.title}}</p>
        </template>
      </tree-sidebar-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSoldOut">
        <template slot="dialog">
          <tr>
            <td>操作记录：</td>
            <td>
              <div>{{dialog.ruleForm2.updateTime}}</div>
              <div>操作员：{{dialog.ruleForm2.createBy}}</div>
              <div>备注：{{dialog.ruleForm2.remarkss}}</div>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入审核意见" data-name="remarks">*</i>审核意见：</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
            </td>
          </tr>
        </template>
      </dialog-sub>
      <el-dialog
        :visible.sync="infoDialog.visible"
        width="800px"
        :dialog="infoDialog">
        <goods-info :source="infoDialog.source" style="margin-top: -20px;"></goods-info>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {getToken} from '@/utils/auth'
  import {format} from "@/utils";
  import {currency} from "@/filters"
  import bus from '@/utils/bus.js'
  import GoodsInfo from '../../goodsInfo';

  export default {
    data() {
      let query = this.$route.query || {};
      let recommendType = [{
        label: '全部',
        value: 1
      }, {
        label: '首页',
        value: 2
      }, {
        label: '购物车',
        value: 3
      }, {
        label: '个人中心',
        value: 4
      }, {
        label: '商品详情',
        value: 5
      }];
      return {
        violation: true,
        quickSearch: {
          hideTime: true,
          isShow: true,
          isHideAll: true,
          group: [{
            value: 'sellDownType',
            label: 1,
            selected: 1,
            defaultChecked: 1,
            list: [{
              label: '企业下架',
              value: 1
            }, {
              label: '售完下架',
              value: 2
            }, {
              label: '违规下架',
              value: 3
            }]
          }]
        },
        treeConfig: {
          tabs: ['内部分类', '区域分类'],
          currentTab: 0,
          list: [{
            expandedKeys: ['000000'],
          }, {
            treeProps: {
              label: 'name'
            },
            nodeKey: 'code',
            lazy: true,
            expandedKeys: ['0']
          }]
        },
        activeName: 'first',
        recommendType,
        groupList: [],
        apiUrl: process.env.BASE_API + '/api/sys/fileConfig/upload',
        myHeaders: {
          tokenId: getToken()
        }, // 要保证取到
        format: format,
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '商品名称/编号',
          placeholder: '名称/编号',
          isText: true
        }, {
          value: 'shopNameOrCode',
          label: query.shopNameOrCode || '',
          name: '企业名称/编号',
          placeholder: '名称/编号',
          isText: true
        }, {
          value: 'brandNameOrCode',
          label: '',
          name: '品牌名称/编号',
          placeholder: '名称/编号',
          isText: true
        }, {
          value: 'priceRange',
          label: [],
          name: '会员价',
          isRangeInput: true
        }, {
          value: 'sellNumRange',
          label: [],
          name: '销量',
          isRangeInput: true
        }],
        treeList: {
          expandedKeys: ['000000']
        },
        treeDataList: [],
        table: {
          addBool: true,
          width: '180px',
          editBool: true,
          emitEditBool: true,
          delBool: true,
          // type: 'selection',
          columns: [
            {
            //   value: 'areaConfigIds',
            //   label: '同城',
            //   width: '100'
            // },{
              value: 'picUrl',
              label: '商品图片',
              width: '100',
              slotBool: true
            },{
              value: 'code',
              label: '编号',
              width: '100'
            },{
              value: 'title',
              label: '商品名称',
              width: '210',
              slotBool: true
            }, {
              value: 'brandName',
              label: '品牌',
              width: '120'
            }, {
              value: 'shopName',
              label: '企业名称',
              width: '120'
            }, {
              value: 'shopCode',
              label: '企业编号',
              width: '120'
            }, {
              value: 'CategoryInside',
              label: '内部分类',
              width: '120'
            }, {
              value: 'skuPriceMin',
              label: '市场价',
              width: '120',
              slotBool: true,
              sortable: true
            }, {
              value: 'skuPriceSellMin',
              label: '会员价',
              width: '120',
              slotBool: true,
              sortable: true
            }, {
              value: 'stock',
              label: '库存',
              width: '120'
            }, {
              value: 'sellNum',
              label: '销量',
              width: '120',
              sortable: true
            }, {
              value: 'approvalTime',
              label: '上架时间',
              width: '140',
              sortable: true
            }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        dialog: {
          addBool: true,
          titleText: '',
          saveFormVisible: false,
          type: 'permission',
          isTable: true,
          ruleForm2: {
            remarks: ''
          },
          rules2: {
            remarks: this.$plug.valid.isNull()
          }
        },
        infoDialog: {
          visible: false,
          source: {}
        }
      }
    },
    filters: {
      currency: currency
    },
    components: {
      TreeSidebarTable,
      TableSub,
      DialogSub,
      SearchSub,
      GoodsInfo
    },
    methods: {
      async getTreeLists(node) {
        let res = await this.Api.getAreaConfig({parentCode: node && node.key ? node.key : '000000'});
        if (res.status === 1 && res.data) {
          let list = res.data.list || [];
          return list;
        }
      },
      async getTreeList(node) {
        if (this.treeConfig.currentTab === 1) {
          return this.getTreeLists(node);
        }
        return this.getGoodsTreeList();
      },
      async getGoodsTreeList() {
        let top = [{
            value: '000000',
            label: '全部',
            id: '000000'
          }];
        let res = await this.Api.getGoodsClassificationList({});
        if (res.status === 1) {
          top[0].children = this.$plug.recursion.treeData(res.data, 'parentId', [null, ''], 'id', 'name');;
        }
        return top;
      },
      async enableGoods(row) {
        this.$plug.prompt.failTip();
      },
      async handleIllegal(row) {
        this.dialog.titleText="启用商品"
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2 = Object.assign({}, row);
        this.dialog.ruleForm2.remarkss = this.dialog.ruleForm2.remarks;
        this.dialog.ruleForm2.remarks = '';

      },
      async handleSoldOut(row, delPrompt) {
        delPrompt(this.Api.goodsEnable, {
          "id": row.id
        });
        bus.$emit("loadDialogData");
      },
      async getDataList(params, areaList, sortObj) { //获取用户列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            quick[item.value] = item.selected;
          })
        }
        if (queryPo && queryPo.time1) {
          searchParameter.starTime = format(new Date(queryPo.time1), 'yyyy-MM-dd hh:mm:ss')
        }
        if (queryPo && queryPo.time2) {
          searchParameter.endTime = format(new Date(queryPo.time2), 'yyyy-MM-dd hh:mm:ss')
        }
        let sorts;
        if(sortObj.isSort === true) {
          console.log("param",sortObj);
          if(sortObj.order == 'ascending'){
            if(sortObj.prop == 'skuPriceSellMin'){
              sorts = 'priceSellAsc';
            }else if(sortObj.prop == 'sellNum'){
              sorts = 'sellNumAsc';
            }else if(sortObj.prop == 'skuPriceMin'){
              sorts = 'priceAsc';
            }else if(sortObj.prop == 'approvalTime'){
              sorts = 'approvalTimeAsc';
            }
          }else{
            if(sortObj.prop == 'skuPriceSellMin'){
              sorts = 'priceSellDesc';
            }else if(sortObj.prop == 'sellNum'){
              sorts = 'sellNumDesc';
            }else if(sortObj.prop == 'skuPriceMin'){
              sorts = 'priceDesc';
            }else if(sortObj.prop == 'approvalTime'){
              sorts = 'approvalTimeDesc';
            }
          }
        }
        let para = Object.assign({}, queryPo, quick, {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count,
            orderBy: sorts
          },
          searchParameter,
          priceMin: queryPo.priceRange[0]==''?null:queryPo.priceRange[0]*100,
          priceMax: queryPo.priceRange[1]==''?null:queryPo.priceRange[1]*100,
          sellNumMin: queryPo.sellNumRange[0],
          sellNumMax: queryPo.sellNumRange[1],
          sellDownType: quick.sellDownType
        })
        if(quick.sellDownType != 3){
          this.violation = false;
        }else {
          this.violation = true;
        }
        if (params && params.id && params.id !== '000000') {
          if(this.treeConfig.currentTab === 1){
            para.areaConfigIds = params.id
          }else{
            para.goodsCategoryInsideId = params.id
          }
        }
        let resData = await this.Api.getGoodsCityDownsaleList(para);
        resData.data.list.map(item => {
          if (item.brand == null) {
            item.brand = { id: "" };
          }
          item.brandName = item.brand.name;
          if (item.shop == null) {
            item.shop = { id: "" };
          }
          item.shopName = item.shop.nickName;
          item.shopCode = item.shop.code;
          item.CategoryInside = item.goodsCategoryInside.name;
        });
        return resData;
      },
      async handleDel(row, delPrompt) { //删除
        delPrompt(this.Api.deleteGoods, {
          "id": row.id
        });
      },
      async handleDetail(params) {
        let res = await this.Api.getGoodsDetailsFind({id: params.id});
        if (res.status === 1) {
          this.infoDialog.source = res.data;
        }
        this.infoDialog.visible = true;
      },
      handleThrough() {
        this.$confirm('此操作将审核通过, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '审核成功!'
          });
          console.log('通过！')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      returnTypeValue(type) {
        switch (type) {
          case 1:
            return '待审核';
          case 2:
            return '已通过';
          case 3:
            return '已驳回';
          default:
            return '无'
        }
      },
      returnTagValue(type) {
        switch (type) {
          case 1:
            return 'info';
          case 2:
            return 'success';
          case 3:
            return 'danger';
          default:
            return '无'
        }
      }
    },
    computed: {},
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>

.ellipsiss {
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
  height: 40px;
}
</style>

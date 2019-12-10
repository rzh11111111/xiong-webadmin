<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :searchObj="searchObj" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
        <template slot="arrDel">
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="arrRecommend">取消推荐
          </el-button>
        </template>
      </search-sub>
      <!--表格-->
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="skuPriceSellMin" slot-scope="{ index,row }">
          <span>{{row.skuPriceSellMin|currency}}</span>
        </template>
        <template slot="picUrl" slot-scope="{index,row }">
          <img :src="row.goods.picUrl" width="40" height="40"/>
        </template>
        <template slot="goodName" slot-scope="{index,row }">
          <p class="ellipsiss">{{row.goods.title}}</p>
        </template>
        <template slot="goodCode" slot-scope="{index,row }">
          <span>{{row.goods.code}}</span>
        </template>
        <template slot="skuPriceSellMin" slot-scope="{ index,row }">
          <span>{{(row.goods.skuPriceSellMin/100)|currency}}</span>
        </template>
        <template slot="skuPriceMin" slot-scope="{ index,row }">
          <span>{{(row.goods.skuPriceMin/100)|currency}}</span>
        </template>
        <template slot="stock" slot-scope="{index,row }">
          <span>{{row.goods.stock}}</span>
        </template>
        <template slot="recommendType" slot-scope="{ index,row }">
          <span>{{returnRecommendTypeValue(row.recommendType)}}</span>
        </template>
        <template slot="table" slot-scope="{ index,row }">
          <el-button @click="handleEdit(row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleDetail(row)" type="text" size="small">查看</el-button>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td>选中商品：</td>
            <td>
              <span>{{dialog.ruleForm2.name}}</span>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择推荐位置" data-name="recommendType">*</i>推荐位置：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.recommendType" placeholder="请选择" :disabled="dialog.readBool">
                <el-option
                  v-for="item in recommendType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-isdate="true" data-message="请选择生效时间" data-name="activeTime">*</i>生效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.activeTime"
                type="date"
                placeholder="选择时间">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-isdate="true" data-message="请选择失效时间" data-name="invalidTime">*</i>失效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.invalidTime"
                type="date"
                placeholder="选择时间">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入排序值" data-name="sortNo">*</i>排序值：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
        </template>
      </dialog-sub>
      <!--dialog弹窗4-->
      <dialog-sub :dialog="dialog4" :getDataList="getDataList" @submit="handleRecommend">
        <template slot="dialog">
          <el-form-item label="选中商品：" prop="title">
            <span>{{dialog4.ruleForm2.title}} 等{{dialog4.ruleForm2.num}}件商品</span>
          </el-form-item>
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
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {getToken} from '@/utils/auth'
  import {format} from "@/utils";
  import {currency} from "@/filters"
  import bus from '@/utils/bus.js'
  import GoodsInfo from '../../goodsManagement/goodsInfo';

  export default {
    data() {
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
          name: '关键字搜索',
          placeholder: '商品编码、名称',
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
        table: {
          addBool: true,
          width: '180px',
          editBool: true,
          emitEditBool: true,
          delBool: true,
          type: 'selection',
          columns: [
            {
              value: 'picUrl',
              label: '商品图片',
              width: '100',
              slotBool: true
            },{
              value: 'goodCode',
              label: '编号',
              width: '100',
              slotBool: true
            },{
              value: 'goodName',
              label: '商品名称',
              width: '210',
              slotBool: true
            }, {
              value: 'recommendType',
              label: '显示位置',
              width: '100',
              slotBool: true
            }, {
              value: 'sortNo',
              label: '排序值',
              width: '100',
              sortable: true
            }, {
              value: 'skuPriceMin',
              label: '市场价',
              width: '100',
              slotBool: true
            }, {
              value: 'skuPriceSellMin',
              label: '会员价',
              width: '100',
              slotBool: true
            }, {
              value: 'stock',
              label: '库存',
              width: '100',
              slotBool: true
            }, {
              value: 'sellNum',
              label: '销量',
              width: '100',
              sortable: true
            }, {
            //   value: '',
            //   label: '审批状态',
            //   width: '100',
            //   slotBool: true
            // }, {
            //   value: '',
            //   label: '审批通过时间',
            //   width: '120',
            //   slotBool: true
            // }, {
              value: 'activeTime',
              label: '生效时间',
              width: '140'
            }, {
              value: 'invalidTime',
              label: '失效时间',
              width: '140'
            }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        dialog: {
          addBool: true,
          tableBool:true,
          width: '500px',
          titleText: '推荐编辑',
          saveFormVisible: false,
          type: 'permission',
          isTable: true,
          ruleForm2: {
            name:''
          },
          rules2: {
            remarks: this.$plug.valid.isNull()
          }
        },
        dialog4: {
          addBool: true,
          titleText: '取消推荐',
          saveFormVisible: false,
          type: 'permission',
          ruleForm2: {
            name: '',
            num: 0,
            ids: []
          },
          rules2: {
            ids: this.$plug.valid.isNull()
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
      TableSub,
      DialogSub,
      SearchSub,
      GoodsInfo
    },
    methods: {
      async handleEdit(params){
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2 = Object.assign({}, params);
        this.dialog.ruleForm2.name = this.dialog.ruleForm2.goods.title;
      },
      async handleSave(row, savePrompt) {
        let params = Object.assign({}, row);
        if (row.activeTime) {
          params.activeTime = format(new Date(row.activeTime), 'yyyy-MM-dd hh:mm:ss')
        }
        if (row.invalidTime) {
          params.invalidTime = format(new Date(row.invalidTime), 'yyyy-MM-dd hh:mm:ss')
        }
        savePrompt(this.Api.updateGoodsRecommend, params);
      },
      async handleDetail(params) {
        let res = await this.Api.getGoodsDetailsFind({id: params.goods.id});
        if (res.status === 1) {
          this.infoDialog.source = res.data;
          this.infoDialog.source.picList = res.data.picsUrls ? res.data.picsUrls.split(',') : [];
        }
        this.infoDialog.visible = true;
      },
      arrRecommend() {
        this.handleBatchOperates();
      },
      handleBatchOperates() {
        if (this.$refs.tableSub.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }else {
          this.dialog4.saveFormVisible = true;
          this.dialog4.ruleForm2.title = this.$refs.tableSub.multipleSelection[0].goods.title;
          this.dialog4.ruleForm2.num = this.$refs.tableSub.multipleSelection.length;
        }
      },
      async handleRecommend(row) {
        let ids = "";
        for (let i = 0; i < this.$refs.tableSub.multipleSelection.length; i++) {
          if(i == this.$refs.tableSub.multipleSelection.length-1){
            ids = ids + this.$refs.tableSub.multipleSelection[i].id;
          }else {
            ids = ids + this.$refs.tableSub.multipleSelection[i].id + ',';
          }
        }
        let res = await this.Api.deleteGoodsRecommendBatch({
          "ids": ids
        });

        this.dialog4.saveFormVisible = false;

        bus.$emit("loadDialogData");
      },
      async getDataList(sortObj) { //获取用户列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        let sorts;
        if(sortObj.isSort === true) {   
          console.log("param",sortObj.order);
          if(sortObj.order == 'ascending'){
            if(sortObj.prop == 'sortNo'){
              sorts = 'sortNoAsc';
            }else if(sortObj.prop == 'sellNum'){
              sorts = 'sellNumAsc';
            }else if(sortObj.prop == 'skuPriceMin'){
              sorts = 'priceAsc';
            }else if(sortObj.prop == 'approvalTime'){
              sorts = 'approvalTimeAsc';
            }
          }else{
            if(sortObj.prop == 'sortNo'){
              sorts = 'sortNoDesc';
            }else if(sortObj.prop == 'sellNum'){
              sorts = 'sellNumDesc';
            }else if(sortObj.prop == 'skuPriceMin'){
              sorts = 'priceDesc';
            }else if(sortObj.prop == 'approvalTime'){
              sorts = 'approvalTimeDesc';
            }
          }
        }
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count,
            orderBy: sorts
          },
          searchParameter,
          skuPriceSellMin: queryPo.priceRange[0]==''?null:queryPo.priceRange[0]*100,
          skuPriceSellMax: queryPo.priceRange[1]==''?null:queryPo.priceRange[1]*100,
          sellNumMin: queryPo.sellNumRange[0],
          sellNumMax: queryPo.sellNumRange[1],
          ...queryPo
        }
        let resData = await this.Api.getGoodsRecommendList(para);
        resData.data.list.map(item => {
          item.sellNum = item.goods.sellNum;
        });
        return resData;
      },
      returnRecommendTypeValue(type) {
        switch (type) {
          case 1:
            return '全部';
          case 2:
            return '首页';
          case 3:
            return '购物车';
          case 4:
            return '个人中心';
          case 5:
            return '商品详情';
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
  height: 40px;
}
</style>

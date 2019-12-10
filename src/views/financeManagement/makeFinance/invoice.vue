<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog">
        <template slot="arrDel">
          <el-button size="mini" type="danger" @click="arrRecommend">批量开票
          </el-button>
        </template>
      </search-sub>
      <!--表格-->
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
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
          <el-button @click="handleIllegal(row)" type="text" size="small">开票信息</el-button>
          <el-button @click="handleDetail(row)" type="text" size="small">开票</el-button>
        </template>
        <template slot="picUrl" slot-scope="{index,row }">
            <img :src="row.picUrl" width="40" height="40"/>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSoldOut">
        <template slot="dialog" v-if="false">
          <tr>
            <td>是否为一般纳税人：</td>
            <td>
               <span>是</span>
            </td>
            <td>发票类型：</td>
            <td>
               <span>专票 纸质发票</span>
            </td>
          </tr>
          <tr>
            <td>增值税专用发票复印件：</td>
            <td>
               <span>pic</span>
            </td>
            <td>名称：</td>
            <td>
               <span>杭州三只松鼠股份有限公司</span>
            </td>
          </tr>
          <tr>
            <td>纳税人识别号：</td>
            <td>
               <span>373N7393933030300303030</span>
            </td>
            <td>开户行及账号：</td>
            <td>
               <span>中国工商银行股份有限公司望京支行 </span><br>
               <span>20202020200202020202 </span>
            </td>
          </tr>
          <tr>
            <td>营业地址与电话：</td>
            <td>
               <span>杭州市萧山区萧山大街葫芦街1666号好美味广场C3座1003号18812341234 </span>
            </td>
            <td>收票地址：</td>
            <td>
               <span>杭州市萧山区萧山大街葫芦街1666号好美味广场C3座1003号  张三 18812341234</span>
            </td>
          </tr>
        </template>
        <template slot="dialog" v-else>
          <tr>
            <td>是否为一般纳税人：</td>
            <td>
               <span>是</span>
            </td>
            <td>发票类型：</td>
            <td>
               <span>普票 电子发票</span>
            </td>
          </tr>
          <tr>
            <td>名称：</td>
            <td>
               <span>杭州三只松鼠股份有限公司</span>
            </td>
            <td>纳税人识别号：</td>
            <td>
               <span>373N7393933030300303030</span>
            </td>
          </tr>
          <tr>
            <td>开户行及账号：</td>
            <td>
               <span>中国工商银行股份有限公司望京支行 </span><br>
               <span>20202020200202020202 </span>
            </td>
            <td>纳税人识别号：</td>
            <td>
               <span>373N7393933030300303030</span>
            </td>
          </tr>
          <tr>
            <td>收票邮箱：</td>
            <td colspan="3">
               <span>杭州市萧山区萧山大街葫芦街1666号好美味广场C3座1003号  张三 18812341234</span>
            </td>
          </tr>
        </template>
      </dialog-sub>
      <!--dialog弹窗4-->
      <dialog-sub :dialog="dialog4" :getDataList="getDataList" @submit="handleRecommend">
        <template slot="dialog">
          <h2>确定开票？</h2>
        </template>
      </dialog-sub>
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
        apiUrl: process.env.BASE_API + '/api/sys/fileConfig/upload',
        myHeaders: {
          tokenId: getToken()
        }, // 要保证取到
        format: format,
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '年月',
          isText: true
        }, {
          value: 'shopNameOrCode',
          label: '',
          name: '店铺名称',
          isText: true
        }, {
          value: '',
          label: '',
          name: '店铺角色',
          isText: true
        }, {
          value: '',
          label: '',
          name: '发票类型',
          isText: true
        }, {
          value: 'brandNameOrCode',
          label: '',
          name: '开票状态',
          isText: true
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
              label: '年月',
              width: '100',
              slotBool: true
            },{
              value: 'code',
              label: '店铺编码',
              width: '100'
            },{
              value: 'title',
              label: '店铺名称',
              width: '100'
            }, {
              value: 'brandName',
              label: '店铺角色',
              width: '120'
            }, {
              value: 'shopName',
              label: '开票类型',
              width: '120'
            }, {
              value: 'shopCode',
              label: '发票金额',
              width: '120'
            }, {
              value: 'CategoryInside',
              label: '发票类型',
              width: '120'
            }, {
              value: 'skuPriceMin',
              label: '开票状态',
              width: '120',
              slotBool: true,
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
          titleText: '开票信息',
          saveFormVisible: false,
          type: 'permission',
          isTable: true,
          width: '815px',
          ruleForm2: {
            remarks: ''
          },
          rules2: {
            remarks: this.$plug.valid.isNull()
          }
        },
        dialog4: {
          addBool: true,
          titleText: '确定开票',
          saveFormVisible: false,
          type: 'permission',
          width: '400px',
          ruleForm2: {},
          rules2: {}
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
      SearchSub
    },
    methods: {
      async enableGoods(row) {
        this.$plug.prompt.failTip();
      },
      async handleIllegal(row) {
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2 = Object.assign({}, row);
        this.dialog.ruleForm2.remarks = '';
      },
      async handleSoldOut(row, delPrompt) {
        delPrompt(this.Api.goodsEnable, {
          "id": row.id,
          "remarks": row.remarks
        });
        bus.$emit("loadDialogData");
      },
      async handleDetail(params) {
        // this.dialog4.saveFormVisible = true;
        // // let res = await this.Api.getGoodsDetailsFind({id: params.id});
        // // if (res.status === 1) {
        // //   this.infoDialog.source = res.data;
        // //   this.infoDialog.source.picList = res.data.picsUrls ? res.data.picsUrls.split(',') : [];
        this.$confirm('确定开票?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '开票成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
        // }
      },
      arrRecommend() {
        if (this.$refs.tableSub.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }else {
          this.dialog4.saveFormVisible = true;
          this.dialog4.ruleForm2.name = this.$refs.tableSub.multipleSelection[0].title;
          this.dialog4.ruleForm2.num = this.$refs.tableSub.multipleSelection.length;
        }
      },
      async handleRecommend(row) {
        let ids = [];
        for (let i = 0; i < this.$refs.tableSub.multipleSelection.length; i++) {
          ids.push(this.$refs.tableSub.multipleSelection[i].id);
        }
        row.activeTime = Date.parse(new Date(row.activeTime));
        row.invalidTime = Date.parse(new Date(row.invalidTime));
        let res = await this.Api.saveGoodsRecommendBatch({
          "goodsIds": ids,
          "sortNo": row.sortNo,
          "recommendType": row.recommendType,
          "activeTime": row.activeTime,
          "invalidTime": row.invalidTime
        });

        this.dialog4.saveFormVisible = false;

        this.$message({
          message: '设置推荐成功',
          type: 'success'
        });
      },
      async getDataList(params) { //获取用户列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter,
          ...queryPo
        }
        let resData = await this.Api.getGoodsProductionOnsaleList(para);
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
</style>

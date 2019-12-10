<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd">
        <!--<template slot="arrDel">-->
        <!--<el-button size="mini" icon="el-icon-delete" type="danger" @click="arrDel">批量删除-->
        <!--</el-button>-->
        <!--</template>-->
      </search-sub>
      <!--表格-->
      <table-sub ref="tableSub" @submit="handleSave" @arrDel="handleDelArr" @del="handleDel"
                 @edit="handleEdit"
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
        <template slot="sourceType" slot-scope="{ index,row }">
          <el-tag :type="returnTagValue(row.sourceType)">{{returnTypeValue(row.sourceType)}}</el-tag>
        </template>
        <template slot="sellStatus" slot-scope="{ index,row }">
          <el-switch
            @change="handleShowStatusChange(index, row)"
            :active-value="0"
            :inactive-value="1"
            v-model="row.sellStatus">
          </el-switch>
        </template>
        <!--<template slot="isEnable" slot-scope="{ index,row }">-->
        <!--<el-switch-->
        <!--@change="handleShowStatusChange(index, row)"-->
        <!--:active-value="0"-->
        <!--:inactive-value="1"-->
        <!--v-model="row.isEnable">-->
        <!--</el-switch>-->
        <!--</template>-->
        <!--<template slot="search">-->
        <!--<el-form-item>-->
        <!--<el-button type="primary" @click="handleAddGgoods">添加商品</el-button>-->
        <!--</el-form-item>-->
        <!--</template>-->
        <!--<template slot="table" slot-scope="{ index,row }">-->
        <!--<el-button @click="handleAudit(index,row)" type="text" size="small">商品审核</el-button>-->
        <!--</template>-->
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">

      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {getToken} from '@/utils/auth'
  import {format} from "../../utils";
  import {currency} from "@/filters"

  export default {
    data() {
      return {
        apiUrl: process.env.BASE_API + '/api/sys/fileConfig/upload',
        myHeaders: {
          tokenId: getToken()
        }, // 要保证取到
        format: format,
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true
        }, {
          isDate: true,
          value: 'time1',
          label: '',
          name: '开始时间'
        }, {
          isDate: true,
          value: 'time2',
          label: '',
          name: '结束时间'
        }],
        table: {
          addBool: true,
          width: '200px',
          editBool: true,
          emitEditBool: true,
          // type: 'selection',
          columns: [
            {
              value: 'code',
              label: '商品编号',
              width: '100'
            },
            {
              value: 'name',
              label: '商品名称',
              width: '100'
            }, {
              value: 'picUrl',
              label: '商品图片',
              width: '100'
            }, {
              value: 'skuPriceSellMin',
              label: '最低市场价',
              width: '120',
              slotBool: true
            }, {
              value: 'skuPriceMin',
              label: '会员价',
              width: '120',
              slotBool: true
            }, {
              value: 'sellStatus',
              label: '是否上架',
              width: '120',
              slotBool: true
            }, {
              value: 'brandName',
              label: '所属品牌',
              width: '120'
            }, {
              value: 'shopName',
              label: '所属店铺',
              width: '120'
            }, {
              value: 'sourceType',
              label: '审核状态',
              width: '120',
              slotBool: true
            }, {
              value: 'createTime',
              label: '创建时间',
              width: '140',
              slotBool: true
            }]
        },

        pagination: {
          page: 1,
          count: 8,
          total: 0
        },
        dialog: {
          addBool: true,
          titleText: '商品审核',
          btnBool: true,
          saveFormVisible: false,
          type: 'permission',
          ruleForm2: {
            remarks: ''
          },
          rules2: {}
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
      async getDataList() { //获取用户列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1) {
          searchParameter.starTime = format(new Date(queryPo.time1), 'yyyy-MM-dd hh:mm:ss')
        }
        if (queryPo && queryPo.time2) {
          searchParameter.endTime = format(new Date(queryPo.time2), 'yyyy-MM-dd hh:mm:ss')
        }
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter: searchParameter
        }
        let resData = await this.Api.getGoodsList(para);
        return resData;
      },
      async handleEdit(row) {
        this.$router.push({path: '/goods/addGoods', query: {id: row.id}});
      },
      async handleSave(row, savePrompt, type) {
        if (!row.id) {
          savePrompt(this.Api.saveGoodsBrand, row);
        } else {
          savePrompt(this.Api.updateGoodsBrand, row);
        }
      },
      // 批量删除
      arrDel() {
        this.$refs.tableSub.handleBatchOperate() //调用子组件方法
      },
      async handleDelArr(row, delPrompt) {
        delPrompt(this.Api.deleteArrStaff, row);
      },
      async handleDel(row, delPrompt) { //删除
        delPrompt(this.Api.deleteGoods, {
          "id": row.id
        });
      },
      handleAdd() { //显示新增界面
        this.$router.push({path: '/goods/addGoods'});
      },
      handleShowStatusChange(index, row) {
        let para = {
          id: row.id,
          sellStatus: row.sellStatus
        }
        this.Api.isSellStatusGoods(para).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          }
        });
      },

      handleAudit(index, row) {
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2.id = row.id;

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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      haneleRefused() {
        this.$confirm('此操作将审核拒绝, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '审核成功!'
          });
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
      // let res = await this.Api.getStaff({});
      // this.optionsSupplier = this.$plug.public.transformList(res.list, 'id', 'name');
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>

</style>

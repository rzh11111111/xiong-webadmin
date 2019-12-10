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
          <span>{{row.createTime}}</span>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <el-form-item label="选择品牌" prop="employee">
            <el-select v-model="dialog.ruleForm2.brand.id" filterable placeholder="请选择">
              <el-option
                v-for="item in optionsGoodsBrand"
                :key="item.value"
                :label="item.label"
                :disabled="dialog.readBool"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌系列名称：" prop="sortNo">
            <el-input v-model.number="dialog.ruleForm2.name"></el-input>
          </el-form-item>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import {format} from "@/utils";
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {getToken} from '@/utils/auth'

  export default {
    data() {
      return {
        apiUrl: process.env.BASE_API + '/api/sys/fileConfig/upload',
        myHeaders: {
          tokenId: getToken()
        }, // 要保证取到
        searchBool: false,
        optionsGoodsBrand: [],
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
          width: '200px',
          emitEditBool: true,
          columns: [
            {
              value: 'code',
              label: '品牌系列编号',
              width: '100'
            },
            {
              value: 'name',
              label: '品牌系列名称',
              width: '100'
            }, {
              value: 'createTime',
              label: '创建时间',
              width: '140',
              slotBool: true
            }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          btnText: '创建',
          titleText: '创建',
          width: '750px',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          ruleForm2: {
            id: null, // 新增不必传，修改必传	string	商品属性ID	否
            name: '',	//是	string	品牌系列名称
            code: '',	//是	string	品牌系列编码
            brand: {id: ''} //	是	string	对应品牌
          },
          rules2: {}
        },
        isExpand: true,
        visible: false,
      }
    },
    components: {
      TableSub,
      DialogSub,
      SearchSub
    },
    methods: {
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter: queryPo
        }
        let resData = await this.Api.getBrandSeriesList(para);
        // getCateNameById
        resData.page.list.map(item => {
          item.brand.name = this.getCateNameById(item.brand.id)
          // console.log(' item.brand.name', item.brand.name)
        })
        return resData;
      },
      // 编辑
      async handleEdit(row) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        console.log('row', row)
        this.dialog.ruleForm2 = Object.assign({}, row);
      },
      // 提交新增编辑
      async handleSave(row, savePrompt, type) {
        if (!row.id) {
          savePrompt(this.Api.saveBrandSeries, row);
        } else {
          savePrompt(this.Api.saveBrandSeries, row);
        }
      },
      // 批量删除
      arrDel() {
        this.$refs.tableSub.handleBatchOperate() //调用子组件方法
      },
      async handleDelArr(row, delPrompt) {
        delPrompt(this.Api.delBrandSeries, row);
      },
      // 删除
      async handleDel(row, delPrompt) {
        delPrompt(this.Api.delBrandSeries, {
          "id": row.id
        });
      },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
      },
      getCateNameById(id) {
        // console.log(id)
        let name = null;
        for (let i = 0; i < this.optionsGoodsBrand.length; i++) {
          if (this.productCateOptions[i].id === id) {
            name = this.productCateOptions[i].label;
            return name;
          }
        }
        // console.log(name)
        return name;
      },
    },
    computed: {},
    async mounted() {
      let res = await this.Api.getGoodsBrand({});
      this.optionsGoodsBrand = this.$plug.public.transformList(res.list, 'id', 'name');
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
  }

  /*图片上传*/
  .el-upload--picture-card img {
    width: 100%;
    height: 100%;
  }

  .uploadingImg {
    display: flex;
  }

  table > tr {
    vertical-align: middle;
  }

  .prop table th {
    white-space: nowrap;
    overflow: hidden;
    background-color: #eef1f6;
    text-align: center;
    padding: 2px 15px;
    box-sizing: border-box;
  }

  .prop table {
    background-color: #ffffff;
    border: 1px solid #dfe6ec;
    width: 100%;
  }

  .prop table td {
    padding: 5px 15px;
    box-sizing: border-box;
    background-color: #ffffff;
  }

  .select-tree {
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 10px;
  }

  .input-tree {
    display: flex;
  }

  .refresh {
    font-size: 12px;
    margin-left: 10px;
  }
</style>

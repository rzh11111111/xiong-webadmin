<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :timeRangeVal="['time1']" :searchObj="searchObj" :quickSearch="quickSearch" :pagination="pagination" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog" @add="handleAdd" >
      </search-sub>
      <table-sub @del="handleDel" @add="handleAdd" @detail="handleDetail" @edit="handleEdit"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="shopCode" slot-scope="{ index,row }">
          <span v-if="!!row.shop">{{row.shop.code}}</span>
        </template>
        <template slot="shopName" slot-scope="{ index,row }">
          <span v-if="!!row.shop">{{row.shop.nickName}}</span>
        </template>
        <template slot="picUrl" slot-scope="{index,row }">
            <img :src="row.picUrl" width="40"/>
        </template>
        <template slot="recommendType" slot-scope="{index,row }">
          <template v-for="type in recommendType" v-if="type.value == row.recommendType">
            {{type.label}}
          </template>
        </template>
      </table-sub>
      <dialog-sub :dialog="dialog" :customValidate="customValidate" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="序号" data-name="sortNo">*</i>序号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
            </td>
            <td>推荐板块：</td>
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
                placeholder="选择生效时间"
                :disabled="dialog.readBool">
              </el-date-picker>
            </td>
            <td><i class="red-star" data-isdate="true" data-message="请选择失效时间" data-name="invalidTime">*</i>失效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.invalidTime"
                type="date"
                placeholder="选择失效时间"
                :disabled="dialog.readBool">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择商户" data-name="shop" data-subname="id">*</i>商户选择：</td>
            <td>
              <check-module ref="checkmodule" :dialog="subDialog" :disabled="dialog.readBool" @submit="handleSelect"></check-module>
              <!-- <el-select v-model="dialog.ruleForm2.shop.id" :disabled="dialog.readBool" filterable>
                <el-option v-for="shop in shopList" :key="shop.id" :value="shop.id" :label="shop.nickName"></el-option>
              </el-select> -->
            </td>
            <td><i class="red-star" data-message="请选择广告展示图" data-name="files">*</i>广告展示图：</td>
            <td>
              <span v-if="dialog.readBool">
                <el-popover
                  placement="top"
                  trigger="hover"
                  popper-class="tootip-img-box"
                  v-model="adPicUrlVisible">
                  <img :src="dialog.ruleForm2.picUrl"/>
                  <span slot="reference">
                    <img class="images-small" :src="dialog.ruleForm2.picUrl"/>
                  </span>
                </el-popover>
              </span>
              <selector ref='selector' :dialog="subDialogImg" @submit="handleSelectFiles" v-else></selector>
            </td>
          </tr>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TableSub from '@/components/TableSub';
  import DialogSub from '@/components/DialogSub';
  import SearchSub from '@/components/SearchSub';
  import MultiUpload from '@/components/Upload/multiUpload';
  import {format} from "@/utils";
  import CheckModule from '../../checkModule';
  import selector from '@/components/Selector/filesEntry';
  let subDialog = {
          innerVisible: false,
          addBool: true,
          type: 2,
          nameVal: ['title', 'nickName', 'nickName', 'name', 'name', 'name', 'name'],
          tableType: 'radio',
          store: {},
          shopType: 1
        };
  export default {
    data() {
      let recommendType = [{
        label: '品牌商城首页',
        value: 2
      }];
      return {
        adPicUrlVisible: false,
        shopList: [],
        recommendType,
        quickSearch: {
          isTimeRange: true,
          isShow: true
        },
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '商家',
          isText: true,
          placeholder: '名称/编号'
        }, {
          value: 'time1',
          label: '',
          name: '生效时间',
          isTimeRange: true
        }],

        table: {
          width: '200px',
          emitEditBool: true,
          emitDetailBool: true,
          arrDelBool: true,
          detailBool: false,
          // delBool: true,
          columns: [{
            value: 'shopCode',
            label: '商家编号',
            slotBool: true,
            width: '100'
          }, {
            value: 'shopName',
            label: '商家名称',
            slotBool: true,
            width: '150'
          }, {
            value: 'picUrl',
            label: '图片',
            width: '120',
            isShow:true
          }, {
            value: 'sortNo',
            label: '排序值',
            width: '100'
          }, {
            value: 'activeTime',
            label: '生效时间',
            width: '140'
          }, {
            value: 'invalidTime',
            label: '失效时间',
            width: '140'
          }, {
            value: 'updateBy',
            label: '创建人',
            width: '140'
          }, {
            value: 'createTime',
            label: '创建时间',
            width: '140'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        subDialogImg: {
          innerVisible: false,
          addBool: true,
          tableType: 'radio',
          type: 5,
          nameVal: 'name',
          files: {}
        },
        dialog: {
          isTable: true,
          width: '750px',
          btnText: '创建',
          titleText: '创建',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          readBool: false,
          tableBool: true,
          ruleForm2: {
            shop: {
              id: ''
            },
            recommendType: 2,
            picUrl: '',
            activeTime: '',
            invalidTime: '',
            sortNo: '',
            files: {}
          },
          rules2: {
            shop: this.$plug.valid.isNull(),
            recommendType: this.$plug.valid.isNull(),
            files: this.$plug.valid.isNull(),
            activeTime: this.$plug.valid.isNull(),
            invalidTime: this.$plug.valid.isNull(),
            sortNo: this.$plug.valid.isNull()
          }
        },
        subDialog: Object.assign({}, subDialog)
      }
    },
    components: {
      DialogSub,
      SearchSub,
      TableSub,
      MultiUpload,
      CheckModule,
      selector
    },
    methods: {
      handleSelectImg(row, type) {
        switch(type) {
          case 5:
            this.dialog.ruleForm2.files = Object.assign({}, this.dialog.ruleForm2.files, row);
          break;
        }
      },
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo.time1) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected || item.selected === 0) {
              quick[item.value] = item.selected;
            }
          })
        }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter,
          isTop: queryPo.isTop
        }, quick);

        let resData = await this.Api.getShopRecommend(para);
        resData.data.list.map(item => {
          if (item.shop == null) {
            item.shop = { id: "" };
          }
          item.shopId = item.shop.name;
        });
        return resData;
      },
      handleSelect(row, type) {
        this.dialog.ruleForm2.shop = Object.assign({}, row);
      },
      // handleSelect(row, type) {
      //   switch(type) {
      //     case 1:
      //       this.dialog.ruleForm2.goods = Object.assign({}, this.dialog.ruleForm2.goods, row);
      //     break;
      //     case 2:
      //       this.dialog.ruleForm2.shop = Object.assign({}, this.dialog.ruleForm2.shop, row);
      //     break;
      //     case 3:
      //       this.dialog.ruleForm2.store = Object.assign({}, this.dialog.ruleForm2.store, row);
      //     break;
      //     case 6:
      //       this.dialog.ruleForm2.activity = Object.assign({}, this.dialog.ruleForm2.activity, row);
      //     break;
      //   }
      // },
      handleSelectFiles(row) {
        this.dialog.ruleForm2.files = Object.assign({}, this.dialog.ruleForm2.files, row);
      },
      async getFilesData(param) {
        let resData = await this.Api.getResourceList({});
        if (resData.status === 1 && resData.data) {
          let files = resData.data || [];
          files.map(item => {
            if (item.url === param) {
              this.dialog.ruleForm2.files = item;
              this.subDialogImg.files = item;
            }
          })
        }
      },
      handleDetail(params) {
        this.dialog.titleText = '查看广告';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
        this.getInfo(params.id);
      },
      handleEdit(params) {
        this.dialog.titleText = '编辑广告';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.getInfo(params.id);
      },
      // uploadImg(fileList) {
      //   if (!fileList || !fileList[0]) return ;
      //   this.dialog.ruleForm2.files = fileList;
      // },
      async getInfo(id) {
        let res = await this.Api.findShopRecommend({id});
        if (res.status == 1) {
          this.dialog.ruleForm2 = res.data;
          this.getFilesData(res.data.picUrl);
          this.dialog.ruleForm2.files = {url: res.data.picUrl};
          this.subDialogImg.files = {url: res.data.picUrl};
          this.subDialog = Object.assign({}, subDialog);
          this.subDialog.shop = res.data.shop;
        }
      },
      async getFilesData(param) {
        let resData = await this.Api.getResourceList({});
        if (resData.status === 1 && resData.data) {
          let files = resData.data || [];
          files.map(item => {
            if (item.url === param) {
              this.dialog.ruleForm2.files = item;
              this.subDialogImg.files = item;
            }
          })
        }
      },
      customValidate() {
        if (new Date(this.dialog.ruleForm2.invalidTime).valueOf() < new Date(this.dialog.ruleForm2.activeTime).valueOf()) {
          this.$plug.prompt.failTip('生效时间必须大于失效时间');
          return;
        }
        return true;
      },
      handleSave(row, savePrompt, type) {
        let params = Object.assign({}, row);
        if (this.subDialogImg.files) {
          params.picUrl = this.subDialogImg.files.url;
        }
        if (row.activeTime) {
          params.activeTime = format(new Date(row.activeTime), 'yyyy-MM-dd hh:mm:ss')
        }
        if (row.invalidTime) {
          params.invalidTime = format(new Date(row.invalidTime), 'yyyy-MM-dd hh:mm:ss')
        }
        if (!row.id) {
          savePrompt(this.Api.addShopRecommend, params);
        } else {
          savePrompt(this.Api.editShopRecommend, params);
        }
      },
      handleDel(row, delPrompt) { //删除
        delPrompt(this.Api.delShopRecommend, {
          "id": row.id
        });
      },
      handleAdd() {
        this.dialog.saveFormVisible = true;
        this.dialog.titleText = '创建';
        this.dialog.readBool = false;
        this.dialog.ruleForm2.shop.id = '';
        this.subDialog = Object.assign({}, subDialog);
        this.dialog.ruleForm2.files = {};
        this.$nextTick(()=>{
          this.$refs.selector.selectRemove();
          // this.$refs.popover.$refs.tree.setCheckedKeys([]);
        })
      }
    },
    computed: {},
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
  }
</style>

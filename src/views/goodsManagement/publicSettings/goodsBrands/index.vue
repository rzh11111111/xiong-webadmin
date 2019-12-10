<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :timeRangeVal="['time1']" :pagination="pagination" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool"
                  :dialog="dialog"
                  @add="handleAdd">
      </search-sub>

      <tree-sidebar-table ref="tableSub" @submit="handleSave" @del="handleDel"
                @edit="handleEdit"
                :getTreeList="getTreeList"
                :treeConfig="treeConfig"
                :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="isCategoryTop" slot-scope="{ index,row }">
          <el-switch
            @change="handleTopStatusChange(index, row)"
            :active-value="1"
            :inactive-value="0"
            v-model="row.isCategoryTop">
          </el-switch>
        </template>
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-switch
            @change="handleShowStatusChange(index, row)"
            :active-value="0"
            :inactive-value="1"
            v-model="row.isEnable">
          </el-switch>
        </template>
        <template slot="icoUrl" slot-scope="{index,row }">
            <img :src="row.icoUrl" width="40"/>
        </template>
        <template slot="brandStory" slot-scope="{ index,row }">
          <el-popover
            placement="right-start"
            width="200"
            trigger="hover"
            :content="row.brandStory">
            <p class="ellipsis" slot="reference">{{row.brandStory}}</p>
          </el-popover>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="categoryVal" slot-scope="{ index,row }">
          <el-popover
            placement="right-start"
            width="200"
            trigger="hover"
            :content="row.categoryVal">
            <p class="ellipsis" slot="reference">{{row.categoryVal}}</p>
          </el-popover>
        </template>
        <template slot="attributeVal" slot-scope="{ index,row }">
          <el-popover
            placement="right-start"
            width="200"
            trigger="hover"
            :content="row.attributeVal">
            <p class="ellipsis" slot="reference">{{row.attributeVal}}</p>
          </el-popover>
        </template>
        <template slot="saleType" slot-scope="{ index,row }">
          <span>{{row.saleType==1?'基础属性':'销售属性'}}</span>
        </template>
        <template slot="isMust" slot-scope="{ index,row }">
          <span>{{row.isMust==0?'是':'否'}}</span>
        </template>
        <template slot="isSearch" slot-scope="{ index,row }">
          <span>{{row.isSearch==0?'是':'否'}}</span>
        </template>
      </tree-sidebar-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入品牌名称" data-name="name">*</i>品牌名称：</td>
            <td>
              <el-input hide-required-asterisk show-message v-model="dialog.ruleForm2.name" :readonly="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入品牌首字母" data-name="nameLetter">*</i>品牌首字母：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.nameLetter" :readonly="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入排序" data-name="sortNo">*</i>排序：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.sortNo" :readonly="dialog.readBool"></el-input>
            </td>
            <td>简介：</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.shortInfo" :readonly="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>品牌故事：</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.brandStory" :readonly="dialog.readBool"></el-input>
            </td>
            <td>内部类目：</td>
            <td>
              <Popover ref="popover" :treeDataList="treeDataList" :popoverData="popoverData"></Popover>
              <span v-if="dialog.ruleForm2.categoryName!=null">{{dialog.ruleForm2.categoryName}}</span>
            </td>
          </tr>
          <tr>
            <td>外部类目(生产企业)：</td>
            <td>
              <Popover ref="popovers" :treeDataList="treeDataListCategory" :popoverData="openData"></Popover>
              <span v-if="dialog.ruleForm2.categoryNames!=null">{{dialog.ruleForm2.categoryNames}}</span>
            </td>
            <td>图标：</td>
            <td>
              <selector ref='selector' key="icoUrl" :dialog="subDialogIco" :disabled="dialog.readBool" @submit="handleSelectIco"></selector>
            </td>
          </tr>
          <tr>
            <td>品牌广告图：</td>
            <td>
              <selector ref='selectors' key="picUrl" :dialog="subDialogPic" :disabled="dialog.readBool" @submit="handleSelectPic"></selector>
            </td>
            <td>展示图：</td>
            <td>
              <selector ref='selectorss' key="adUrl" :dialog="subDialogAdUrl" :disabled="dialog.readBool" @submit="handleSelectAdUrl"></selector>
            </td>
          </tr>
          <tr>
            <td>是否启用：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isEnable">
                <el-radio border :label="0">启用</el-radio>
                <el-radio border :label="1">禁用</el-radio>
              </el-radio-group>
            </td>
            <td>是否推荐：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isCategoryTop">
                <el-radio border :label="1">是</el-radio>
                <el-radio border :label="0">否</el-radio>
              </el-radio-group>
            </td>
          </tr>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {getToken} from '@/utils/auth'
  import {format} from "@/utils"
  import config from '@/utils/config'
  import Popover from '@/components/Popover'
  import bus from '@/utils/bus.js'
  import MultiUpload from '@/components/Upload/multiUpload';
  import CheckModule from '../../../checkModule';
  import selector from '@/components/Selector/filesEntry';

  export default {
    components: {
      TreeSidebarTable,
      DialogSub,
      SearchSub,
      MultiUpload,
      Popover,
      CheckModule,
      selector
    },
    data() {
      // const validatePassword = (rule, value, callback) => {
      //   if (value.length < 6) {
      //     callback(new Error('密码不能低于6位!'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        adPicUrlVisible: false,
        n:0,
        quickSearch: {
          isTimeRange: true,
          isShow: true
        },
        activeName: 'first',
        apiUrl: config.host + '/admin/api/sys/fileconfig/upload',
        myHeaders: {
          tokenId: getToken()
        }, // 要保证取到
        format: format,
        searchBool: false,
        // optionsSupplier: [],
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          placeholder: '按品牌名称、编码模糊查询',
          isText: true
        }, {
          value: 'nameLetter',
          label: '',
          name: '品牌首字母',
          placeholder: '按品牌首字母模糊查询',
          isText: true
        }, {
          value: 'time1',
          label: '',
          name: '创建时间',
          isTimeRange: true
        }],
        // 树表格

        columns: [{
          value: 'name',
          label: '品牌名称',
          width: '200'
        }, {
          value: 'code',
          label: '品牌编号',
          width: '100'
        }, {
          value: 'icoUrl',
          label: '品牌图片',
          isShow: true,
          slotBool: true,
          width: '100'
        }, {
          value: 'sortNo',
          label: '排序',
          width: '100'
        }],

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        table: {
          addBool: true,
          width: '200px',
          emitEditBool: true,
          columns: [
            {
              value: 'name',
              label: '品牌名称',
              width: '100'
            },{
              value: 'nameLetter',
              label: '首字母',
              width: '100'
            },{
              value: 'code',
              label: '品牌编码',
              width: '100'
            }, {
              value: 'picUrl',
              label: '品牌图片',
              width: '100'
            }, {
              value: 'sortNo',
              label: '排序',
              width: '110'
            }, {
              value: 'categoryInside',
              label: '内部分类',
              width: '150'
            },{
              value: 'categorys',
              label: '外部分类',
              width: '150'
            }, {
              value: 'isEnable',
              label: '是否启用',
              width: '120',
              slotBool: true
            }, {
              value: 'isCategoryTop',
              label: '是否推荐',
              width: '120',
              slotBool: true
            }, {
              value: 'brandStory',
              label: '介绍',
              width: '140',
              slotBool: true
            },{
              value: 'createTime',
              label: '创建时间',
              width: '100'
            }]
        },
        treeConfig: {
          tabs: ['内部分类', '外部分类'],
          currentTab: 0,
          list: [{
            expandedKeys: ['000000'],
          }, {
            expandedKeys: ['000000'],
          }]
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
          btnText: '创建品牌',
          titleText: '创建品牌',
          width: '750px',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          isTable: true,
          ruleForm2: {
            name: '', // 是	string	品牌名称
            shortInfo: '', // 否	string	简介
            sortNo: '', // 否	string排序
            icoUrl: '', // 否	string	图标
            brandStory: '', // 否	string	品牌故事
            nameLetter: '', // 否	string	品牌首字母
            picUrl: '', // 否	string	展示图
            adUrl: '', // 否	string	展示图
            goodsCategoryInsides: [], // 所属内部类目
            goodsCategorys:[],
            files: {},
            isCategoryTop: 1,
            picUrlObj: {},
            icoUrlObj: {},
            adUrlObj: {},
            categoryName: [],
            categoryNames: [],
            // supplier: {
            //   id: '',
            //   name: ''
            // }, // 否	string	所属供应商
            // supplierName: '', // 否	string	厂商名称
            isEnable: 0// 是	int	是否停用
          },
          rules2: {
            // name: [{
            //   required: true,
            //   trigger: 'blur',
            //   validator: validatePassword
            // }],
            name: this.$plug.valid.isNull(),
            nameLetter: this.$plug.valid.isNull(),
            sortNo: this.$plug.valid.isNull(),
            isEnable: this.$plug.valid.isNull()
          }
        },
        subDialogIco: {
          innerVisible: false,
          addBool: true,
          type: 5,
          tableType: 'radio',
          files: {}
        },
        subDialogPic: {
          innerVisible: false,
          addBool: true,
          type: 5,
          tableType: 'radio',
          files: {}
        },
        subDialogAdUrl: {
          innerVisible: false,
          addBool: true,
          type: 5,
          tableType: 'radio',
          files: {}
        },
        popoverData: {
          btnText: '内部分类'
        },
        openData: {
          btnText: '外部分类'
        },
        treeDataList: [],
        treeDataListCategory: []
      }
    },
    methods: {
      handleSelectIco(row) {
        this.dialog.ruleForm2.icoUrlObj = Object.assign({}, this.dialog.ruleForm2.icoUrlObj, row);
        this.dialog.ruleForm2.icoUrl = row.url;
      },
      handleSelectPic(row) {
        this.dialog.ruleForm2.picUrlObj = Object.assign({}, this.dialog.ruleForm2.picUrlObj, row);
        this.dialog.ruleForm2.picUrl = row.url;
      },
      handleSelectAdUrl(row) {
        this.dialog.ruleForm2.adUrlObj = Object.assign({}, this.dialog.ruleForm2.adUrlObj, row);
        this.dialog.ruleForm2.adUrl = row.url;
      },
      async getTreeInsideList() {
        let top = [{
          value: '000000',
          label: '全部',
          id: '000000'
        }];
        var res = await this.Api.getGoodsClassificationList({});

        if (res.status === 1) {
          top[0].children = this.$plug.recursion.treeData(res.data, 'parentId', [null, ''], 'id', 'name');;
        }
        return top;
      },
      async getTreeList() {
        if (this.treeConfig.currentTab === 1) {
          return this.getTreeLists();
        }
        return this.getTreeInsideList();
      },
      async getTreeLists() {
        let top = [{
          value: '000000',
          label: '全部',
          id: '000000'
        }];
        var res = await this.Api.getProductionGoodsClassificationLists({});

        if (res.status === 1) {
          top[0].children = this.$plug.recursion.treeData(res.data, 'parentId', [null, ''], 'id', 'name');;
        }
        return top;
      },

      async getDataList(params) { //获取用户列表
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
          nameLetter:queryPo.nameLetter
        }, quick);
        if (params && params.id && params.id !== '000000') {
          if(this.treeConfig.currentTab === 1){
            para.goodsCategoryId = params.id
          }else{
            para.goodsCategoryInsideId = params.id
          }
        }
        let resData = await this.Api.getGoodsBrandlist(para);

        resData.data.list.map(item => {
          if (item.goodsCategoryInsides == null) {
            item.goodsCategoryInsides = []
          }
          item.goodsCategoryName = ''
          let categoryInside = []
          item.goodsCategoryInsides.map(v => {
            if (v.name) {
              categoryInside.push(v.name)
            }
          })
          item.categoryInside = categoryInside.length ? categoryInside.join() : ''

          if (item.goodsCategorys == null) {
            item.goodsCategorys = []
          }
          let categorys = []
          item.goodsCategorys.map(v => {
            if (v.name) {
              categorys.push(v.name)
            }
          })
          item.categorys = categorys.length ? categorys.join() : ''
        // item.optionsBrand = this.$plug.public.transformList(resData.data, 'id', 'name');
        });
        // this.treeTableList = this.$plug.recursion.treeData(resData.data, 'parentId', ['', null], 'id', 'name');
        return resData
      },
      // 编辑
      async handleEdit(row) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2 = Object.assign({}, row);
        this.getInfo(row.id);
        this.subDialogPic.files = {url: row.picUrl};
        this.subDialogIco.files = {url: row.icoUrl};
        this.subDialogAdUrl.files = {url: row.adUrl};
      },
      async getInfo(id) {
        let res = await this.Api.getGoodsBrandFind({id});
        if (res.status == 1) {
          this.dialog.ruleForm2 = res.data;
          this.getFilesData(res.data.icoUrl);
          this.dialog.ruleForm2.files = {url: res.data.icoUrl};
          this.subDialogImg.files = {url: res.data.icoUrl};
        }
        let data = res.data ? res.data.goodsCategoryInsides : [];
        let idArr = [];
        let categoryName = [];
        data.forEach((item) => {
          idArr.push(item.id);
          categoryName.push(item.name)
        })
        let datas = res.data ? res.data.goodsCategorys : [];
        let idArrs = [];
        let categoryNames = [];
        datas.forEach((item) => {
          idArrs.push(item.id);
          categoryNames.push(item.name)
        })
        this.$nextTick(function () {
          this.$refs.popover.$refs.tree.setCheckedKeys(idArr);
          this.$refs.popovers.$refs.tree.setCheckedKeys(idArrs);
        })
        this.dialog.ruleForm2.categoryName = categoryName;
        this.dialog.ruleForm2.categoryNames = categoryNames;
        // console.log('name',categoryName)
        // console.log('names',categoryNames)

        // this.dialog.ruleForm2 = Object.assign({}, row);
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
      handleAdd() { //显示新增界面
        this.dialog.titleText = '创建品牌';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.ruleForm2.files = {};
        this.dialog.ruleForm2.categoryName = null;
        this.dialog.ruleForm2.categoryNames = null;
        this.$nextTick(()=>{
          this.$refs.selector.selectRemove();
          this.$refs.selectors.selectRemove();
          this.$refs.selectorss.selectRemove();
          this.$refs.popover.$refs.tree.setCheckedKeys([]);
        })
      },
      handleShowStatusChange(index, row) {
        let para = {
          id: row.id
        }
        this.$confirm('是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.Api.isEnableGoodsBrand(para).then(res => {
            if (res.status == 1) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
            } else {
              if (row.isEnable == 0) {
                row.isEnable = 1;
              } else {
                row.isEnable = 0;
              }
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          if (row.isEnable == 0) {
            row.isEnable = 1;
          } else {
            row.isEnable = 0;
          }
        });
      },
      handleTopStatusChange(index, row) {
        row.isCategoryTop = row.isCategoryTop === 1 ? 0 : 1;
        this.$plug.prompt.del(() => {
          this.Api.isTopGoodsBrand({
            id: row.id
          }).then((res) => {
            if (res.status === 1) {
              row.isCategoryTop = row.isCategoryTop === 1 ? 0 : 1;
              return this.$plug.prompt.saveTip();
            }
          });
        }, row, null, row.isCategoryTop === 1 ? '启用该数据' : '禁用该数据');
      },
      async update(row) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        let res = await this.Api.getGoodsBrandFind({
          id: row.id
        });
        let data = res.data ? res.data.goodsCategoryInsides : [];
        let idArr = [];
        data.forEach((item) => {
          idArr.push(item.id);
        })
        this.$nextTick(function () {
          this.$refs.popover.$refs.tree.setCheckedKeys(idArr);
        })

        this.dialog.ruleForm2 = Object.assign({}, row);
        if (this.dialog.ruleForm2 && this.dialog.ruleForm2.parent || this.dialog.ruleForm2 && this.dialog.ruleForm2.children) {
          delete this.dialog.ruleForm2.parent
          delete this.dialog.ruleForm2.children
        }
      },
      async handleSave(row, savePrompt, type) {
        let params = Object.assign({}, row);
        if (this.subDialogImg.files) {
          params.icoUrl = this.subDialogImg.files.url;
          params.adUrl = this.subDialogImg.files.url;
          params.picUrl = this.subDialogImg.files.url;
        }
        let checkAllData = this.$refs.popover.$refs.tree.getCheckedNodes();
        let checkHalfData = this.$refs.popovers.$refs.tree.getCheckedNodes();
        let data = checkAllData;
        let idArr = [];
        if (data && data.length) {
          data.forEach((item) => {
            idArr.push({id: item.id});
          })
        }
        params.goodsCategoryInsides = idArr;

        let datas = checkHalfData;
        let idArrs = [];
        if (datas && datas.length) {
          datas.forEach((item) => {
            idArrs.push({id: item.id});
          })
        }
        params.goodsCategorys = idArrs;
        
        if (this.subDialogPic.files && this.subDialogPic.files.url) {
          params.picUrl = this.subDialogPic.files.url;
        }
        if (this.subDialogIco.files && this.subDialogIco.files.url) {
          params.icoUrl = this.subDialogIco.files.url;
        }
        if (this.subDialogAdUrl.files && this.subDialogAdUrl.files.url) {
          params.adUrl = this.subDialogAdUrl.files.url;
        }
        if (!row.id) {
          savePrompt(this.Api.saveGoodsBrand, params);
        } else {
          savePrompt(this.Api.updateGoodsBrand, params);
        }
        bus.$emit("loadDialogData");
        bus.$emit("loadDialogData");
      },
      remove(data) {
        this.$plug.prompt.del(this.handleDel, data);
      },
      async handleDel(row) { // 删除
        await this.Api.delGoodsBrand({
          'id': row.id
        });
        bus.$emit("loadDialogData");
      },
      // handleShowStatusChange(index, row) {
      //   let para = {
      //     id: row.id
      //   }
      //   this.Api.isEnableGoodsBrand(para).then(res => {
      //     if (res.status == 1) {
      //       this.$message({
      //         message: '修改成功',
      //         type: 'success',
      //         duration: 1000
      //       });
      //     }else{
      //       if(row.isEnable == 0){
      //         row.isEnable=1;
      //       }else{
      //         row.isEnable=0;
      //       }
      //     }
      //   });
      // },
      append() {
        this.$router.push({path: '/goods/brandSeries'});
      },
      // 图片上传
      uploadPicUrl(response) {
        this.dialog.ruleForm2.icoUrl = response.fileUrl
      },
      async handleClick(tab, event) {
        // bus.$emit("loadDialogData");
        if(tab.index == 0){
          this.n = 0;
        }else{
          this.n = 1;
        }
      },
      handleSelectImg(row, type) {
        switch(type) {
          case 5:
            this.dialog.ruleForm2.files = Object.assign({}, this.dialog.ruleForm2.files, row);
          break;
        }
      }
    },
    computed: {
    },
    async mounted() {
      this.getDataList();
      let res = await this.Api.getGoodsClassificationList({
        queryPo: {}
      });
      this.treeDataList = this.$plug.recursion.treeData(res.data, 'parentId', ['', null], 'id', 'name');
      let resCategory = await this.Api.getProductionGoodsClassificationLists({
        queryPo: {}
      });
      this.treeDataListCategory = this.$plug.recursion.treeData(resCategory.data, 'parentId', ['', null], 'id', 'name');
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>

 .filter-container .el-tabs{

    min-height: calc(100% - 125px);
  }
 .tree-sidebar-table {
    min-height: calc(100% - 100px);
  }
  .el-tab-pane {
    min-height: calc(100% - 100px);
  }
  .el-tabs__content {
    min-height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .tabs-cate-box{
    display: flex;
    flex-direction: column;
    flex: 1;
    .el-tabs__content{
      display: flex !important;
      flex-direction: column !important;
      flex: 1 !important;
    }
  }
</style>

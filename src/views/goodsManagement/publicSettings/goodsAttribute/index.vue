<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :timeRangeVal="['time1']" :pagination="pagination" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd">
        <!-- <template slot="arrDel">
        <el-button size="mini" icon="el-icon-delete" type="danger" @click="arrDel">批量删除
        </el-button>
        </template> -->
      </search-sub>
      <!--表格-->
      <tree-sidebar-table ref="tableSub" @submit="handleSave" @arrDel="handleDelArr" @del="handleDel"
                 @edit="handleEdit"
                 :getTreeList="getTreeList"
                 :treeConfig="treeList"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
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
          <span>{{row.isMust==1?'是':'否'}}</span>
        </template>
        <template slot="isSearch" slot-scope="{ index,row }">
          <span>{{row.isSearch==1?'是':'否'}}</span>
        </template>
      </tree-sidebar-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入属性名称" data-name="name">*</i>属性名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入排序" data-name="sortNo">*</i>排序：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.sortNo"></el-input>
            </td>
          </tr>
          <tr>
            <td>选择/查看类目：</td>
            <td>
              <Popover ref="popover" :treeDataList="treeDataList" :popoverData="popoverData"></Popover>
            </td>
            <td>属性类型：</td>
            <td>
              <el-radio-group size="mini" @change="handleSaleType" v-model="dialog.ruleForm2.saleType">
                <el-radio :label="1">基础属性</el-radio>
                <el-radio :label="2">销售属性</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>商品必备属性：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isMust">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </td>
            <td>是否筛选可用：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isSearch">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>表单类型：</td>
            <td>
              <el-radio-group size="mini" @change="handleRadio" v-model="dialog.ruleForm2.formType">
                <el-radio :label="1" v-if="dialog.ruleForm2.saleType!=2">输入</el-radio>
                <el-radio :label="2">多选</el-radio>
                <el-radio :label="3" v-if="dialog.ruleForm2.saleType!=2">单选</el-radio>
              </el-radio-group>
            </td>
            <td>备注：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.remarks"></el-input>
            </td>
          </tr>
          <tr>
            <td v-if="dialog.ruleForm2.saleType==2">支持手动新增：</td>
            <td v-if="dialog.ruleForm2.saleType==2" colspan="3">
              <el-radio-group size="mini" v-model="dialog.ruleForm2.manualAdd">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr v-if="dialog.ruleForm2.formType!=1">
            <td>规格值：</td>
            <td colspan="3">
              <table>
                <tr>
                  <th>属性值别名</th>
                  <th>排序</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in dialog.ruleForm2.goodsAttributeVals" :key="index">
                  <td class="sele-s">
                    <el-input v-model="item.name" placeholder="请输入属性值别名"></el-input>
                  </td>
                  <td class="sele-s">
                    <el-input v-model.number="item.sortNo" placeholder="排序"></el-input>
                  </td>
                  <td class="sele-s">
                    <el-button type="danger" @click="del_spec_value(item.id,index)" icon="el-icon-delete"
                              circle></el-button>
                  </td>
                </tr>
              </table>
              <el-button style="margin-top: 15px;" @click="add_spec_value">新增属性</el-button>
            </td>
          </tr>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import { format } from "@/utils"
  import {getToken} from '@/utils/auth'
  import Popover from '@/components/Popover'

  export default {
    data() {
      return {
        quickSearch: {
          isTimeRange: true,
          isShow: true,
          group: [{
            value: 'isMust',
            label: '',
            selected: '',
            list: [{
              label: '必须属性',
              value: 1
            }, {
              label: '非必须',
              value: 0
            }]
          },{
            value: 'isSearch',
            label: '',
            selected: '',
            list: [{
              label: '检索字段',
              value: 1
            }, {
              label: '非检索',
              value: 0
            }]
          },{
            value: 'saleType',
            label: '',
            selected: '',
            list: [{
              label: '基础属性',
              value: 1
            }, {
              label: '销售属性',
              value: 2
            }]
          }]
        },
        apiUrl: process.env.BASE_API + '/api/sys/fileConfig/upload',
        myHeaders: {
          tokenId: getToken()
        }, // 要保证取到
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          placeholder: '按属性名称、编码模糊查询',
          isText: true
        },{
          value: 'time1',
          label: '',
          name: '创建时间',
          isTimeRange: true
        }],
        treeList: {
          expandedKeys: ['000000']
        },
        table: {
          addBool: true,
          width: '200px',
          emitEditBool: true,
          editBool: false,
          columns: [
            {
              value: 'code',
              label: '属性编号',
              width: '100'
            },{
              value: 'name',
              label: '属性名称',
              width: '100'
            },{
              value: 'sortNo',
              label: '序号',
              width: '100'
            },{
              value: 'categoryVal',
              label: '所属分类',
              width: '100',
              slotBool: true
            }, {
              value: 'attributeVal',
              label: '可选属性值',
              width: '110',
              slotBool: true
            }, {
              value: 'saleType',
              label: '属性类型',
              width: '110',
              slotBool: true
            },{
              value: 'isMust',
              label: '必备属性',
              width: '100',
              slotBool: true
            },{
              value: 'isSearch',
              label: '检索字段',
              width: '100',
              slotBool: true
            },{
              value: 'remarks',
              label: '备注',
              width: '100'
            },{
              value: 'createTime',
              label: '创建时间',
              width: '100',
              sortable: true
            }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          btnText: '创建属性',
          titleText: '创建属性',
          width: '860px',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          isTable: true,
          ruleForm2: {
            id: null, // 新增不必传，修改必传	string	商品属性ID	否
            name: '', // 是	string	属性名称	是
            saleType: 1, // 是	string	属性类型（1 基础属性 2 销售属性）	是
            goodsCategoryInsides: [],
            sortNo: null, // 排序
            formType: 1, // 是	string	表单类型（1 输入 2 多选 3 单选 4 多行输入）	是
            isMust: 1, // 1是	int	是否必须	是
            // isEnable: 0, // 是	int	是否必须	是否启用
            isSearch: 1, //	是	int	是否检索
            goodsAttributeVals: [{
              name: '',
              // id: '',
              sortNo: ''
            }] // 属性值名称
          },
          rules2: {
            name: this.$plug.valid.isNull(),
            saleType: this.$plug.valid.isNull(),
            formType: this.$plug.valid.isNull(),
            isMust: this.$plug.valid.isNull(),
            isSearch: this.$plug.valid.isNull(),
            sortNo: this.$plug.valid.isNull(),
            goodsCategoryInsides: this.$plug.valid.isNull()
          }
        },
        treeDataList: [],
        popoverData: {
          btnText: '内部分类'
        },
      }
    },
    components: {
      TreeSidebarTable,
      TableSub,
      DialogSub,
      SearchSub,
      Popover
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      async getTreeList() {
        let top = [{
            value: '000000',
            label: '全部',
            id: '000000'
          }];
        let res = await this.Api.getGoodsClassificationList({isEnable:0});
        if (res.status === 1) {
          top[0].children = this.$plug.recursion.treeData(res.data, 'parentId', [null, ''], 'id', 'name');;
        }
        return top;
      },
      async getDataList(params) { //获取用户列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {keyWord: queryPo.keyWord}
        if (queryPo.time1) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            quick[item.value] = item.selected;
          })
        }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter,
          ...queryPo
        }, quick);
        if (params && params.id && params.id !== '000000') {
          para.goodsCategoryInsideId = params.id
        }
        let resData = await this.Api.getGoodsattribute(para);
        resData.data.list.map(item => {
          if (item.goodsCategoryInsides == null) {
            item.goodsCategoryInsides = []
          }
          if (item.goodsAttributeVals == null) {
            item.goodsAttributeVals = []
          }
          item.goodsCategoryName = ''
          let attributeVal = []
          item.goodsAttributeVals.map(v => {
            if (v.name) {
              attributeVal.push(v.name)
            }
          })
          item.attributeVal = attributeVal.length ? attributeVal.join() : ''
          let categoryVal = []
          item.goodsCategoryInsides.map(v => {
            if (v.name) {
              categoryVal.push(v.name)
            }
          })
          item.categoryVal = categoryVal.length ? categoryVal.join() : ''
        })
        return resData;
      },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建属性';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.$nextTick(() => {
          this.$refs.popover.$refs.tree.setCheckedKeys([]);
        }) // 清空tree
        this.dialog.ruleForm2.goodsAttributeVals = [{
          name: '',
          // id: '',
          sortNo: ''
        }];
      },
      // 编辑
      async handleEdit(row) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2 = Object.assign({}, row);
        this.getInfo(row.id);
      },
      async getInfo(id) {
        let res = await this.Api.findGoodsattribute({id});
        if (res.status == 1) {
          this.dialog.ruleForm2 = res.data;
        }
        let data = res.data ? res.data.goodsCategoryInsides : [];
        let idArr = [];
        data.forEach((item) => {
          idArr.push(item.id);
        })
        this.$nextTick(function () {
          this.$refs.popover.$refs.tree.setCheckedKeys(idArr);
        })
      },
      // 提交新增编辑
      async handleSave(row, savePrompt, type) {
        let checkAllData = this.$refs.popover.$refs.tree.getCheckedNodes();
        // console.log('aaaaa',checkAllData)
        // let checkHalfData = this.$refs.tree.getHalfCheckedNodes();
        // console.log('bbbbb',checkHalfData)
        // let data = checkAllData.concat(checkHalfData);
        let data = checkAllData;
        let idArr = [];
        if (data && data.length) {
          data.forEach((item) => {
            idArr.push({id: item.id});
          })
        }
        row.goodsCategoryInsides = idArr
        if (!row.id) {
          savePrompt(this.Api.saveGoodsattribute, row);
        } else {
          delete row.attributeVal
          savePrompt(this.Api.updateGoodsattribute, row);
        }
      },
      // 批量删除
      arrDel() {
        this.$refs.tableSub.handleBatchOperate() //调用子组件方法
      },
      async handleDelArr(row, delPrompt) {
        delPrompt(this.Api.deleteArrStaff, row);
      },
      // 删除
      async handleDel(row, delPrompt) {
        delPrompt(this.Api.delGoodsattribute, {
          "id": row.id
        });
      },
      // 图片上传
      uploadPicUrl(response) {
        this.dialog.ruleForm2.brandImg = response.data
      },
      handleProperty(index, row) {
        this.$router.push({path: '/goods/goodsAttribute', query: {id: row.id}});
      },
      // 添加规格值
      add_spec_value() {
        this.dialog.ruleForm2.goodsAttributeVals.push({
          name: '',
          // id: '',
          sortNo: ''
        })
      },
      // 删除规格值
      del_spec_value(id, key) {
        let arr = [];
        if (id) {
          this.Api.delGoodsattributeVal({id: id}).then(res => {
            this.dialog.ruleForm2.goodsAttributeVals.forEach((item, index) => {
              if (index != key) {
                arr.push(item);
              }
            })
            this.dialog.ruleForm2.goodsAttributeVals = arr;
            this.getDataList()
          })

        } else {
          this.dialog.ruleForm2.goodsAttributeVals.forEach((item, index) => {
            if (index != key) {
              arr.push(item);
            }
          });
          this.dialog.ruleForm2.goodsAttributeVals = arr;
        }
      },
      returnTypeValue(type) {
        switch (type) {
          case 0:
            return '是';
          case 1:
            return '否';
          default:
            return '无'
        }
      },
      handleRadio(val) {
        console.log('aa', val)
      },
      handleSaleType(val) {
        this.dialog.ruleForm2.formType = val;
      }
    },
    computed: {},
    async mounted() {
      let res = await this.Api.getGoodsClassificationList({isEnable:0});
      this.treeDataList = this.$plug.recursion.treeData(res.data, 'parentId', ['', null], 'id', 'name');
      if (this.$route.query && this.$route.query.id) {
        let para = {
          id: this.$route.query.id
        }
        let attrArr = this.Api.findGoodsClassification(para)
        console.log('attrArr', attrArr)
      }
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

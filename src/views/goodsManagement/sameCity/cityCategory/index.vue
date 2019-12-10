<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :searchObj="searchObj" :tableTree="tableTree" :getDataList="getDataList" :searchBool="searchBool"
                  :dialog="dialog"
                  @add="handleAdd"></search-sub>
      <!--树列表-->
      <tree-table :data="treeTableList" :columns="columns" border v-loading="listLoading" ref="tree">
        <!-- <el-table-column align="center" label="图标">
          <template slot="icoUrl" slot-scope="{index,row }">
              <img :src="row.icoUrl" width="40"/>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="是否推荐" width="120">
          <template slot-scope="{ index,row }">
            <el-switch
              @change="handleTopStatusChange(index, row)"
              :active-value="1"
              :inactive-value="0"
              v-model="row.isTop">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签">
          <template slot-scope="{ index,row }">
            <el-tag :type="row.tagType==1||row.tagType==2||row.tagType==3?'success':''">
              {{returnTypeValue(row.tagType)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否启用" width="120">
          <template slot-scope="{ index,row }">
            <el-switch
              @change="handleShowStatusChange(index, row)"
              :active-value="0"
              :inactive-value="1"
              v-model="row.isEnable">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150"
                         class-name="small-padding fixed-width">
          <div class="custom-tree-node" slot-scope="props">

            <el-dropdown size="mini" split-button @click="append(props.row)">

              <span class="el-dropdown-link">创建子类目</span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item>
                  <el-button class="width100" type="text"
                             size="mini"
                             @click="() => handleAttrbute(props.row)">查看属性
                  </el-button>
                </el-dropdown-item> -->
                <el-dropdown-item>
                  <el-button class="width100" type="text"
                             size="mini"
                             @click="() => update(props.row)">编辑
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button class="width100" type="text"
                             size="mini"
                             @click="() => remove(props.row)">删除
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-table-column>
      </tree-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td>关联区域：</td>
            <td>
              <ele-multi-cascader
                size="small"
                ref="cascader"
                :options="areaList"
                v-model="form.areaConfigs"
                placeholder="选择区域"
                @change="ispChange"
                :selectChildren="BooleanVal"
                :show-all-levels="BooleanVal"
                :collapse-tags="BooleanVal"
                :isNational="BooleanVals"
              >
              </ele-multi-cascader>
            </td>
            <td>分类名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>分类编码：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
            </td>
            <td>排序：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>关联：</td>
            <td>
              <el-radio-group size="mini" v-model="associated">
                <el-radio border :label="0">关联类目</el-radio>
              </el-radio-group>
            </td>
            <td>关联内部类目：</td>
            <td>
              <Popover ref="popover" :treeDataList="treeDataList" :popoverData="popoverData"></Popover>
            </td>
          </tr>
          <tr>
            <td>图标：</td>
            <td>
              <span v-if="dialog.readBool">
                <el-popover
                  placement="top"
                  trigger="hover"
                  popper-class="tootip-img-box"
                  v-model="adPicUrlVisible">
                  <img :src="dialog.ruleForm2.icoUrl"/>
                  <span slot="reference">
                    <img class="images-small" :src="dialog.ruleForm2.icoUrl"/>
                  </span>
                </el-popover>
              </span>
              <selector ref='selector' :dialog="subDialogImg" @submit="handleSelectFiles" v-else></selector>
            </td>
            <td>标签：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.tagType" clearable placeholder="请选择">
                <el-option
                  v-for="item in platformName"
                  :key="item.value"
                  :label="item.label"
                  :disabled="dialog.readBool"
                  :value="item.value">
                </el-option>
              </el-select>
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
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isTop">
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
  import treeTable from '@/components/TreeTable'
  import Popover from '@/components/Popover'
  import SearchSub from '@/components/SearchSub'
  import DialogSub from '@/components/DialogSub'
  import config from '@/utils/config'
  import {arrItemSort} from '@/utils'
  import areaConfigList from '@/utils/sys_area_config.json'
  import MultiUpload from '@/components/Upload/multiUpload';
  import CheckModule from '../../../checkModule';
  import selector from '@/components/Selector/filesEntry';
  import EleMultiCascader from '@/components/EleMultiCascader'

  const platformName = [
    {value: 1, label: "活动"},
    {value: 2, label: "促销"},
    {value: 3, label: "热卖"}
  ];

  // arr to obj
  const platformNameKeyValue = platformName.reduce((acc, cur) => {
    acc[cur.value] = cur.label;
    return acc;
  }, {});
  export default {
    data() {
      return {
        adPicUrlVisible: false,
        apiUrl: config.host + '/admin/api/sys/fileconfig/upload',
        searchBool: true,
        brandDataList: [],
        associated: 0,
        platformName,
        // 多选级联选择器
        areaList: [],
        outputs: {
          values: [],
          items: []
        },
        form: {
          areaConfigs: []
        },
        BooleanVal: true,
        BooleanVals: true,
        rules: {
          areaConfigs: [
            {
              required: true,
              trigger: "change",
              validator(rule, val, cb) {
                if (val.length === 0) {
                  cb(new Error("请选择区域"));
                } else {
                  cb();
                }
              }
            }
          ]
        },
        // 多选级联选择器结束
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          placeholder: '按分类名称、编码模糊查询',
          isText: true
        }, {
          value: 'time1',
          label: '',
          name: '开始时间',
          isDate: true
        }, {
          value: 'time2',
          label: '',
          name: '结束时间',
          isDate: true
        }],
        // 树表格
        tableTree: true,
        columns: [
          {
            label: '分类名称',
            value: 'name',
            width: '200'
          }, {
            label: '分类编码',
            value: 'code',
            width: '150'
          }, {
            label: '图标',
            value: 'icoUrl',
            slotBool: true,
            width: '120'
          }, {
            label: '排序',
            value: 'sortNo'
          }
        ],
        listLoading: false,
        optionsStaff: [],
        staffObj: {},
        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        areaData: {
          btnText: '地区'
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
          titleText: '创建一级类目',
          btnText: '创建一级类目',
          titleText: '创建一级类目',
          width: '750px',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          isTable: true,
          ruleForm2: {
            name: '',	// 是	string	名称	是
            code: '',	// 是	string	编码	否
            icoUrl: '',	// 否	string	图标	是
            // type: '1',	// 是	string	分类类型（1 内部 2 外部）	否
            tagType: null,	// 否	int	标签(0无 1 活动 2 促销 3 热卖)	是
            parentId: null,	// 否	string	父级分类	否
            sortNo: null, // 排序
            isEnable: 0, // 否	int	是否禁用（否0，是1）（默认否）	是
            isTop: 0, // 是否推荐到品牌商城首页
            brand: {id: ''},
            files: {},
            goodsCategoryInsides: [{id: ''}], // 内部分类
            areaConfigs: []
          }
        },
        dialog2: {
          titleText: '查看属性',
          btnText: '查看属性',
          titleText: '查看属性',
          width: '750px',
          saveFormVisible: false,
          type: 'permission',
          attrbuteList: [],
          ruleForm2: {
            name: '',	// 是	string	名称	是
            code: '',	// 是	string	编码	否
            icoUrl: '',	// 否	string	图标	是
            // type: '1',	// 是	string	分类类型（1 内部 2 外部）	否
            tagType: null,	// 否	int	标签(0无 1 活动 2 促销 3 热卖)	是
            parentId: null,	// 否	string	父级分类	否
            sortNo: null, // 排序
            isEnable: 0, // 否	int	是否禁用（否0，是1）（默认否）	是
            isTop: 0, // 是否推荐到品牌商城首页
            brand: {id: ''},
            goodsCategoryInsides: [{id: ''}] // 内部分类
          }
        },
        popoverData: {
          btnText: '内部分类'
        },
        treeDataList: [],
        treeTableList: [],
      }
    },
    components: {
      treeTable,
      SearchSub,
      DialogSub,
      Popover,
      MultiUpload,
      CheckModule,
      selector,
      EleMultiCascader
    },
    methods: {
      ispChange(values, items) {
        this.dialog.ruleForm2.areaConfigs = [];
        this.outputs.values = values;
        this.outputs.items = items;
        let arr = [];
        arr = Object.assign([], this.outputs.items);
        arr.map(item => {
          this.dialog.ruleForm2.areaConfigs.push({id: item.ids})
        })
      },
      async getDataList() { // 获取列表
        try {
          this.listLoading = true;
          let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
          let para = {
            // page: {
            //   pageNo: this.pagination.page,
            //   pageSize: this.pagination.count
            // },
            searchParameter: queryPo
          }
          let resData = await this.Api.getCityGoodsClassificationLists(para);

          this.treeTableList = this.$plug.recursion.treeData(resData.data, 'parentId', ['', null], 'id', 'name');
          // this.treeTableList = arrItemSort(this.treeTableList, 'sortNo', 1);
          this.listLoading = false;
          return resData
        } catch (error) {
          console.log(error);
        }
      },
      handleSelectImg(row, type) {
        switch (type) {
          case 5:
            this.dialog.ruleForm2.files = Object.assign({}, this.dialog.ruleForm2.files, row);

          break;
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
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建外部分类';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.ruleForm2.files = {};
        this.form.areaConfigs = [];
        this.outputs.items = [];
        this.outputs.values = [];
        this.$nextTick(() => {
          this.$refs.selector.selectRemove();
          this.$refs.popover.$refs.tree.setCheckedKeys([]);
        })
      },
      append(row) {
        this.dialog.titleText = '创建子分类';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.ruleForm2.parentId = row.id;
        this.dialog.readBool = false;
        this.dialog.ruleForm2.files = {};
        this.form.areaConfigs = [];
        this.outputs.items = [];
        this.outputs.values = [];
        this.$nextTick(() => {
          this.$refs.selector.selectRemove();
          this.$refs.popover.$refs.tree.setCheckedKeys([]);
        })
      },
      async update(row) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;

        let res = await this.Api.findGoodsClassifications({
          id: row.id
        });
        let categoryData = res.data ? res.data.goodsCategoryInsides : [];
        let idArr = [];
        categoryData.forEach((item) => {
          idArr.push(item.id);
        })
        let areaData = res.data ? res.data.areaConfigs : [];
        console.log('arr',areaData)
        let idArea = [];

        setTimeout(_ => {
          areaData.forEach((item) => {
            idArea.push(item.code)
          })
          this.form.areaConfigs = idArea;
        }, 0)
        this.$nextTick(function () {
          this.$refs.popover.$refs.tree.setCheckedKeys(idArr);
        })

        row.brand = res.data.brand;
        if (row.brand == null) {
          row.brand = {id: ''}
        }
        this.dialog.ruleForm2 = Object.assign({}, row);
        if (this.dialog.ruleForm2 && this.dialog.ruleForm2.parent || this.dialog.ruleForm2 && this.dialog.ruleForm2.children) {
          delete this.dialog.ruleForm2.parent
          delete this.dialog.ruleForm2.children
        }
        if (res.status == 1) {
          this.dialog.ruleForm2 = res.data;
          this.getFilesData(res.data.icoUrl);
          this.dialog.ruleForm2.files = {url: res.data.icoUrl};
          this.subDialogImg.files = {url: res.data.icoUrl};
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
      handleSave(row, savePrompt) {
        let params = Object.assign({}, row);
        if (this.subDialogImg.files) {
          params.icoUrl = this.subDialogImg.files.url;
        }
        let checkAllData = this.$refs.popover.$refs.tree.getCheckedNodes();
        // let checkHalfData = this.$refs.popover.$refs.tree.getHalfCheckedNodes();
        // let data = checkAllData.concat(checkHalfData);
        let data = checkAllData;
        let idArr = [];
        if (data && data.length) {
          data.forEach((item) => {
            idArr.push({id: item.id});
          })
        }
        params.goodsCategoryInsides = idArr
        if (params.brand != null) {
          if (params.goodsCategoryInsides.length && params.brand.id) {
            this.$message.warning("请不要同时选择内部分类和品牌!");
            return
          }
        }
        if (!row.id) {
          savePrompt(this.Api.saveCityGoodsClassifications, params);
        } else {
          savePrompt(this.Api.saveCityGoodsClassifications, params);
        }
      },
      remove(data) {
        this.$plug.prompt.del(this.handleDel, data);
      },
      async handleAttrbute(row) {
        this.dialog2.saveFormVisible = true;
        this.dialog2.readBool = false;
        // this.getInfo(params.id);
        let {data} = await this.Api.findGoodsClassifications({
          id: row.id
        });

        row.goodsCategoryInsides = []
        data.goodsCategoryInsides.forEach((item) => {
          row.goodsCategoryInsides.push(item.name);
        })
        this.dialog2.ruleForm2 = Object.assign({}, row);
      },
      async getInfo(id) {
        let res = await this.Api.findGoodsClassifications({id});
        if (res.status == 1) {
          this.dialog2.ruleForm2 = res.data;
        }

        console.log(res.data)
        res.data.list.forEach(item => {
          if (item.goodsCategoryInsides == null) {
            item.goodsCategoryInsides = []
          }
          item.goodsCategoryName = ''
          let categoryInside = []
          item.goodsCategoryInsides.forEach(v => {
            if (v.name) {
              categoryInside.push(v.name)
            }
          })
          item.categoryInside = categoryInside.length ? categoryInside.join() : ''
        });
      },
      async handleDel(row) { // 删除
        await this.Api.delGoodsClassifications({
          'id': row.id
        });
        this.getDataList();
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
          this.Api.isEnableGoodsClassifications(para).then(res => {
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
        let para = {
          id: row.id
        }
        this.$confirm('是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.Api.isTopGoodsClassifications(para).then(res => {
            if (res.status == 1) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
            } else {
              if (row.isTop == 0) {
                row.isTop = 1;
              } else {
                row.isTop = 0;
              }
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          if (row.isTop == 0) {
            row.isTop = 1;
          } else {
            row.isTop = 0;
          }
        });
      },
      handleProperty(row) {
        this.$router.push({path: '/goods/goodsAttribute', query: {id: row.id}});
      },
      returnTypeValue(type) {
        switch (type) {
          case 1:
            return '活动';
          case 2:
            return '促销';
          case 3:
            return '热卖';
          default:
            return '无'
        }
      }
    },
    async mounted() {
      this.getDataList();
      let res = await this.Api.getGoodsClassificationList({isEnable:0});
      this.treeDataList = this.$plug.recursion.treeData(res.data, 'parentId', ['', null], 'id', 'name');
      let resBrand = await this.Api.getGoodsBrand({});
      this.brandDataList = this.$plug.public.transformList(resBrand.data, 'id', 'name');
      // let resArea = await this.Api.getAreaConfig({});
      // this.areaList = this.$plug.recursion.treeData(resArea.data.list, 'parentCode', ['', null, '000000'], 'code', 'name');
      this.areaList = this.$plug.recursion.treeData(areaConfigList.RECORDS, 'parent_code', ['', null, '000000'], 'code', 'name');
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
    margin-bottom: 20px;
  }
</style>

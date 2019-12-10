<template>
  <div class="app-container calendar-list-container">
    <search-sub :searchObj="searchObj" :searchBool="searchBool" :tableTree="tableTree" :dialog="dialog" @add="handleAdd"
                  :getDataList="getDataList">
    </search-sub>
    <tree-table :data="treeDataList" :columns="columns" border v-loading="listLoading" ref="tree"
                :default-expanded-keys="expand">
       <!-- <el-table-column align="center" label="分类图标">
         <template slot-scope="{ index,row }">
            <img v-for="item in row.icoUrl" :key="index" :src="item" alt=""/>
         </template>
       </el-table-column>
       <el-table-column align="center" label="是否推荐到本地生活首页" width="155">
         <template slot-scope="{ index,row }">
           {{row.isTop === 1 ? '是' : '否'}}
         </template>
       </el-table-column>-->
      <el-table-column align="center" label="是否启用">
        <template slot-scope="{ index,row }">
          <el-switch
            @change="handleShowStatusChange(index, row)"
            :active-value="0"
            :inactive-value="1"
            v-model="row.isEnable">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序值">
        <template slot-scope="{ index,row }">
          {{row.sortNo}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="{ index,row }">
          <el-popover
            placement="top"
            trigger="hover"
            popper-class="tootip-box"
            :content="row.remarks">
            <p class="ellipsis" slot="reference">{{row.remarks}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="{ index,row }" v-if="!!row.createTime">
          {{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="150">
        <template slot-scope="{ index,row }" v-if="!!row.updateTime">
          {{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150" class-name="small-padding fixed-width">
        <span class="custom-tree-node" slot-scope="props">
          <el-dropdown size="mini" split-button @click.stop="detail(props.row)">
            <span class="el-dropdown-link">
              查看详情
            </span>
             <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button class="width100" type="text" :readonly="props.row.isEnable===0"
                           size="mini"
                           @click.native="() => append(props.row)">创建子分类</el-button>
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                 <el-button class="width100" type="text" :readonly="props.row.isEnable===0"
                            size="mini"
                            @click.native="() => detail(props.row)">查看</el-button>
              </el-dropdown-item> -->
              <el-dropdown-item>
                 <el-button class="width100" type="text" :readonly="props.row.isEnable===0"
                            size="mini"
                            @click.native="() => update(props.row)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                 <el-button class="width100" type="text" :readonly="props.row.isEnable===0"
                            size="mini"
                            @click.native="() => remove(props.row)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </el-table-column>
    </tree-table>
    <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave" @reset="handleCancel">
      <template slot="dialog">
        <tr>
          <td><i class="red-star" data-message="请输入分类名称" data-name="name">*</i>分类名称：</td>
          <td>
            <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
          </td>
          <td>分类编码：</td>
          <td>
            <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
          </td>
        </tr>
        <tr>
          <td>父级：</td>
          <td>
            <el-select v-model="dialog.ruleForm2.parentId" clearable filterable placeholder="请选择"
              :disabled="dialog.readBool || !dialog.changeParent || !!dialog.ruleForm2.id">
              <!-- :disabled="dialog.readBool || !dialog.changeParent" -->
              <el-option
                v-for="item in subOptionsStaff"
                :key="item.value"
                :label="item.label"
                :value="item.value" v-if="item.value !== dialog.ruleForm2.id">
              </el-option>
            </el-select>
          </td>
          <!-- <td>外部分类：</td>
          <td>
            <Popover ref="popover" :key="dialog.ruleForm2.id || 1" :treeDataList="dialog.readBool ? outsideDisabled : outsideOptionsStaff" :popoverData="popoverData"></Popover>
          </td> -->
          <td>分类图标：</td>
          <td>
            <span v-if="dialog.readBool">
              <el-popover
                placement="top"
                trigger="hover"
                popper-class="tootip-img-box">
                <img :src="dialog.ruleForm2.icoUrl"/>
                <span slot="reference">
                  <img class="images-small" :src="dialog.ruleForm2.icoUrl"/>
                </span>
              </el-popover>
            </span>
            <check-files ref="selector" :dialog="subDialogImg" v-else></check-files>
          </td>
        </tr>
        <tr>
          <td><i class="red-star" data-message="请输入排序值" data-name="sortNo">*</i>排序值：</td>
          <td>
            <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
          </td>
          <td>是否启用：</td>
          <td>
            <el-radio-group v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
              <el-radio :label="0" border>是</el-radio>
              <el-radio :label="1" border>否</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td>备注：</td>
          <td colspan="3">
            <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
          </td>
        </tr>
      </template>
    </dialog-sub>
  </div>
</template>
<script>
  import treeTable from '@/components/TreeTable'
  import SearchSub from '@/components/SearchSub'
  import DialogSub from '@/components/DialogSub'
  import Popover from '@/components/Popover'
  import {format} from "../../utils";
  import checkFiles from '@/components/Selector/filesEntry'

  export default {
    data() {
      return {
        format,
        searchBool: true,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true
        }, {
          value: 'starTime',
          label: '',
          name: '开始时间',
          isDate: true
        }, {
          value: 'endTime',
          label: '',
          name: '结束时间',
          isDate: true
        }],
        popoverData: {
          btnText: '外部分类',
          checkedType: true,
          isExpand: true
        },
        optionsStaff: [],
        outsideOptionsStaff: [],
        outsideDisabled: [],
        outsideData: [],
        subOptionsStaff: [],
        columns: [
          {
            label: '编号',
            value: 'code',
            width: 230
          }, {
            label: '分类名称',
            value: 'name',
            width: 150
          }, {
            label: '分类图标',
            value: 'icoUrl',
            width: 150
          }
        ],
        tableTree: true,
        listLoading: false,
        treeDataList: [],
        expand: [],
        currentData: {},
        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          btnText: '创建分类',
          titleText: '创建分类',
          isTable: true,
          changeParent: false,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          ruleForm2: {
            name: '',
            sortNo: '',
            parentId: null,
            isEnable: 0,
            icoUrl: [],
            type: 1
          },
          rules2: {
            name: this.$plug.valid.isNull()
          }
        },
        subDialogImg: {
          innerVisible: false,
          addBool: true,
          tableType: 'radio',
          nameVal: 'name',
          files: {}
        },
      }
    },
    components: {
      treeTable,
      SearchSub,
      DialogSub,
      Popover,
      checkFiles
    },
    methods: {
      // 获取用户列表
      async getDataList() {
        try {
          this.listLoading = true;
          let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);

          let searchParameter = {
            keyWord: queryPo.keyWord
          }
          if (queryPo && queryPo.starTime) {
            searchParameter.starTime = queryPo.starTime;
          }
          if (queryPo && queryPo.endTime) {
            searchParameter.endTime = queryPo.endTime;
          }
          let resData = await this.Api.getStoreCateInside({
            searchParameter
          });
          if (resData.status === 1 && resData.data) {
            this.optionsStaff = this.$plug.public.transformList(resData.data, 'id', 'name');
            this.treeDataList = this.$plug.recursion.treeData(resData.data, 'parentId', ['', null], 'id', 'name');
            if (this.currentData) {
              this.expand = [this.currentData.id];
            }
          }
          this.listLoading = false;
          return resData;
        } catch (error) {
          console.log(error);
        }
        this.listLoading = false;
      },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建分类';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.changeParent = true;
        this.subDialogImg.files = {};
        this.subOptionsStaff = Object.assign([], this.optionsStaff);
        // if (!this.outsideOptionsStaff.length) {
        //   this.getOutside();
        // }
      },
      // 显示创建子分类
      append(data) {
        this.dialog.titleText = '创建子分类';
        this.dialog.saveFormVisible = true;
        this.currentData = data;
        this.dialog.readBool = false;
        this.dialog.changeParent = false;
        this.dialog.ruleForm2.parentId = data.id;
        this.subDialogImg.files = {};
        this.subOptionsStaff = Object.assign([], this.optionsStaff);

        // if (!this.outsideOptionsStaff.length) {
        //   this.getOutside();
        // }
      },
      async detail(data) {
        this.dialog.titleText = '查看分类';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
        this.currentData = data;
        this.dialog.ruleForm2 = Object.assign({}, data);
        // this.updatePopover(this.dialog.ruleForm2);

        // if (!this.outsideDisabled.length) {
        //   if (!this.outsideOptionsStaff.length) {
        //     await this.getOutside();
        //   }
        //   let outsideDisabled = this.outsideData.map(item => {
        //     item.disabled = true;
        //     return item;
        //   });
        //   this.outsideDisabled = this.$plug.recursion.treeData(outsideDisabled, 'parentId', ['', null], 'id', 'name');
        // }
      },
      findParent(parentId) {
        for (let i = 0; i < this.subOptionsStaff.length; i++) {
          if (this.subOptionsStaff[i].parentId == parentId) {
            let id = this.subOptionsStaff[i].id;
            this.subOptionsStaff.splice(i, 1);
            this.findParent(id);
          }
        }
      },
      update(data) {
        this.dialog.titleText = '编辑分类';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.currentData = data;
        this.dialog.changeParent = true;
        this.dialog.ruleForm2 = Object.assign({}, data);
        this.subOptionsStaff = Object.assign([], this.optionsStaff);
        this.subDialogImg.files = {url: data.icoUrl};
        // this.updatePopover(this.dialog.ruleForm2);
        this.findParent(data.id);

        if (this.dialog.ruleForm2 && this.dialog.ruleForm2.parent || this.dialog.ruleForm2 && this.dialog.ruleForm2.children) {
          delete this.dialog.ruleForm2.parent
          delete this.dialog.ruleForm2.children
        }
        // if (!this.outsideOptionsStaff.length) {
        //   this.getOutside();
        // }
      },
      // updatePopover(data) {
      //   let d = data.storeCategorys || [];
      //   let idArr = [];
      //   d.forEach((item) => {
      //      idArr.push(item.id);
      //   });
      //   this.$nextTick(function () {
      //     this.$refs.popover.$refs.tree.setCheckedKeys(idArr);
      //   })
      // },
      // savePopover(params) {
      //   let checkAllData = this.$refs.popover.$refs.tree.getCheckedNodes();
      //   let checkHalfData = this.$refs.popover.$refs.tree.getHalfCheckedNodes();
      //   let data = checkAllData.concat(checkHalfData);
      //   let idArr = [];
      //   if (data && data.length) {
      //     data.forEach((item) => {
      //       idArr.push({id: item.id});
      //     })
      //   }
      //   params.storeCategorys = idArr;
      // },
      async handleSave(row, savePrompt) {
        let params = Object.assign({}, row, {
          icoUrl: this.subDialogImg.files.url
        });
        // this.savePopover(params);
        savePrompt(this.Api.saveStoreCateInside, params);
      },
      remove(data) {
        this.$plug.prompt.del(this.handleDel, data);
      },
      async handleDel(row) { // 删除
        let res = await this.Api.delStoreCateInside({
          'id': row.id
        });
        if (res.status === 1) {
          this.$plug.prompt.saveTip('删除成功!');
        } else {
          this.$plug.prompt.failTip('删除失败!');
        }
        this.getDataList();
      },
      handleShowStatusChange(index, row) {
        row.isEnable = row.isEnable === 1 ? 0 : 1;
        this.$plug.prompt.del(() => {
          this.Api.enableStoreCateInside({
            id: row.id
          }).then((res) => {
            if (res.status === 1) {
              row.isEnable = row.isEnable === 1 ? 0 : 1;
              return this.$plug.prompt.saveTip();
            }
          });
        }, row, null, row.isEnable === 1 ? '启用该数据' : '禁用该数据');
      },
      uploadImg(fileList) {
        if (!fileList || !fileList[0]) return ;
        this.dialog.ruleForm2.icoUrl = fileList;
      },
      async getOutside() {
        let res = await this.Api.getStoreCate({});
        if (res.status == 1) {
          let data = [];
          data = res.data.map(item => {
            return Object.assign({}, item, {disabled: item.isEnable === 1})
          })
          this.outsideData = data;
          this.outsideOptionsStaff = this.$plug.recursion.treeData(data, 'parentId', ['', null], 'id', 'name');
        }
      },
      handleCancel() {
        this.$nextTick(()=>{
          this.$refs.selector && this.$refs.selector.selectRemove();
        });
      }
    },
    // computed: {
    //   subOptionsStaff: {
    //     set() {
    //       if (this.dialog.ruleForm2.id) {
    //         this.findParent(this.dialog.ruleForm2.id);
    //       }
    //     }
    //   }
    // },
    async mounted() {
      this.getDataList();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
    margin-bottom: 20px;
  }

  /*.el-tree {*/
  /*width: 500px;*/
  /*}*/

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding-right: 8px;
  }
</style>

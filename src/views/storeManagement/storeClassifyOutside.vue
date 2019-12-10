<template>
  <div class="app-container calendar-list-container">
    <search-sub :searchBool="searchBool" :tableTree="tableTree" :dialog="dialog" @add="handleAdd"
                  :getDataList="getDataList">
    </search-sub>
    <tree-table :data="treeDataList" :columns="columns" border v-loading="listLoading" ref="tree"
                :default-expanded-keys="expand">
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
      <el-table-column align="center" label="推荐到本地生活首页" width="155">
        <template slot-scope="{ index,row }">
          <el-tag :type="row.isTop === 1? 'success' : 'danger'">{{row.isTop === 1 ? '推荐' : '不推荐'}}</el-tag>
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
          <el-button class="width100" type="text" :readonly="props.row.isEnable===0"
              size="mini"
              @click.native="() => append(props.row)">增加子分类</el-button>
           <el-button class="width100" type="text" :readonly="props.row.isEnable===0"
              size="mini"
              @click.native="() => update(props.row)">编辑</el-button>
           <el-button class="width100" type="text" :readonly="props.row.isEnable===0"
              size="mini"
              @click.native="() => remove(props.row)">删除</el-button>
        </span>
      </el-table-column>
    </tree-table>
    <dialog-sub ref="dialog" :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
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
          <td><i class="red-star" data-message="请至少关联一个内部分类" data-name="storeCategoryInsides">*</i>内部分类：</td>
          <td>
            <Popover ref="popover" :key="dialog.ruleForm2.id || 1" :treeDataList="insideOptionsStaff" :popoverData="popoverData" @change="changePopover"></Popover>
          </td>
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
        </tr>
        <tr>
          <td><i class="red-star" data-message="请至少关联一个区域" data-name="isp">*</i>关联区域：</td>
          <td>
            <ele-multi-cascader
              size="small"
              ref="cascader"
              :options="areaDataList"
              v-model="form.areaConfigs"
              placeholder="选择区域"
              @change="ispChange"
              :selectChildren="BooleanVal"
              :show-all-levels="BooleanVal"
              :collapse-tags="BooleanVal"
              :select-all="selectAll"
            >
            </ele-multi-cascader>
          </td>
          <td><i class="red-star" data-message="请输入排序值" data-name="sortNo">*</i>排序值：</td>
          <td>
            <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
          </td>
        </tr>
        <tr>
          <td>是否启用：</td>
          <td>
            <el-radio-group v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool || !!dialog.ruleForm2.id">
              <el-radio :label="0" border>启用</el-radio>
              <el-radio :label="1" border>禁用</el-radio>
            </el-radio-group>
          </td>
          <td>推荐到本地生活首页：</td>
          <td>
            <el-radio-group v-model="dialog.ruleForm2.isTop" :disabled="dialog.readBool">
              <el-radio :label="1" border>是</el-radio>
              <el-radio :label="0" border>否</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td>分类图标：</td>
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
            <check-files :dialog="subDialogImg" v-else></check-files>
          </td>
          <td>备注：</td>
          <td>
            <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
          </td>
        </tr>
      </template>
    </dialog-sub>
  </div>
</template>
<script>
  import treeTable from '@/components/TreeTable';
  import SearchSub from '@/components/SearchSub';
  import DialogSub from '@/components/DialogSub';
  import Popover from '@/components/Popover';
  import EleMultiCascader from '@/components/EleMultiCascader';
  import {format} from "@/utils";
  import checkFiles from '@/components/Selector/filesEntry';

  import areaConfig from '@/utils/sys_area_config.json';
  let ruleForm = {
            name: '',
            sortNo: '',
            parentId: null,
            storeCategoryInsides: [],
            isp: [],
            isEnable: 0,
            icoUrl: '',
            isTop: 0,
            type: 1,
            area: []
          };
  export default {
    data() {
      return {
        areaConfig,
        format,
        popoverData: {
          btnText: '内部分类',
          checkedType: true,
          isExpand: true
        },
        // 多选级联选择器
        areaList: [],
        form: {
          areaConfigs: []
        },
        selectAll: false,
        BooleanVal: true,
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
        subSearch: {
          isShow: true,
          placeholder: '搜索'
        },
        searchBool: true,
        optionsStaff: [],
        insideOptionsStaff: [],
        subOptionsStaff: [],
        areaDataList: [],
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
          ruleForm2: Object.assign({}, ruleForm)
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
      checkFiles,
      Popover,
      EleMultiCascader
    },
    methods: {
      // 获取用户列表
      async getDataList() {
        try {
          this.listLoading = true;
          let resData = await this.Api.getStoreCate({});
          this.optionsStaff = this.$plug.public.transformList(resData.data, 'id', 'name');
          this.treeDataList = this.$plug.recursion.treeData(resData.data, 'parentId', ['', null], 'id', 'name');
          if (this.currentData) {
            this.expand = [this.currentData.id];
          }
          this.listLoading = false;
          return resData;
        } catch (error) {
          console.log(error);
        }
        this.listLoading = false;
      },
      ispChange(values, items, isCheckAll) {
        this.dialog.ruleForm2.isp = [];

        if (isCheckAll) {
          this.dialog.ruleForm2.isp.push({
            id: isCheckAll.ids
          })
        } else {
          let arr = [];
          arr = Object.assign([], items);
          arr.map(item => {
            this.dialog.ruleForm2.isp.push({
              id: item.ids
            })
          })
        }
        // if (this.dialog.ruleForm2.isp.length) {
        //   this.$refs.isp.clearValidate();
        // } else {
        //  this.$refs.dialog.$refs.ruleForm2.validateField('isp');
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
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建分类';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.changeParent = true;
        this.subDialogImg.files = {};
        this.form.areaConfigs = [];
        this.subOptionsStaff = Object.assign([], this.optionsStaff);

        if (!this.insideOptionsStaff.length) {
          this.getInside();
        }
        if (!this.areaDataList.length) {
          this.getArea();
        }
        this.dialog.ruleForm2 = Object.assign({}, ruleForm);
        // this.updatePopover(this.dialog.ruleForm2);

      },
      // 显示增加子分类
      append(data) {
        this.dialog.titleText = '增加子分类';
        this.dialog.saveFormVisible = true;
        this.currentData = data;
        this.dialog.readBool = false;
        this.dialog.changeParent = false;
        this.subDialogImg.files = {};
        this.form.areaConfigs = [];
        this.dialog.ruleForm2.storeCategoryInsides = [];
        this.dialog.ruleForm2.parentId = data.id;
        this.dialog.ruleForm2.isp = [];
        this.updatePopover(this.dialog.ruleForm2);
        this.subOptionsStaff = Object.assign([], this.optionsStaff);
        if (!this.insideOptionsStaff.length) {
          this.getInside();
        }
        if (!this.areaDataList.length) {
          this.getArea();
        }
      },
      updatePopover(data) {
        let d = data.storeCategoryInsides || [];
        let idArr = d.map((item) => {
           return item.id;
        });
        this.popoverData.checkedKeys = idArr;
        this.$nextTick(function () {
          this.$refs.popover.$refs.tree.setCheckedKeys(idArr);
        })
      },
      update(data) {
        this.dialog.titleText = '编辑分类';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.currentData = data;
        this.dialog.changeParent = true;
        this.subDialogImg.files = {};
        this.form.areaConfigs = [];
        this.getInfo(data.id);
        this.subOptionsStaff = Object.assign([], this.optionsStaff);
        this.findParent(data.id);
      },
      async getInfo(id) {
        let res = await this.Api.getStoreCateInfo({id});
        if (res.status === 1) {
          let data = res.data || {};
          if (data.parent || data.children) {
            delete data.parent;
            delete data.children;
          }
          this.updatePopover(data);
          this.subOptionsStaff = Object.assign([], this.optionsStaff);
          if (!this.insideOptionsStaff.length) {
            await this.getInside();
          }
          if (!this.areaDataList.length) {
            await this.getArea();
          }
          if (!data.areaConfigs) {
            data.areaConfigs = [];
          }

          data.isp = [];
          if(data.areaConfigs.length === 1 && res.data.areaConfigs[0].code === '0') {
            this.selectAll = true;
          }
          this.form.areaConfigs = data.areaConfigs.map(item => {
            data.isp.push({id: item.id})
            return item.code;
          });
          this.subDialogImg.files = {url: data.icoUrl};
          this.dialog.ruleForm2 = data;

          // if (this.form.areaConfigs.length === 1 && this.form.areaConfigs[0] === '0') {
          //   this.$refs.cascader.initOpts()
          // }
        }

      },
      changePopover() {
        let checkAllData = this.$refs.popover.$refs.tree.getCheckedNodes();
        let checkHalfData = this.$refs.popover.$refs.tree.getHalfCheckedNodes();
        let data = checkAllData.concat(checkHalfData);
        let idArr = [];
        if (data && data.length) {
          data.forEach((item) => {
            idArr.push({id: item.id});
          })
        }
        this.dialog.ruleForm2.storeCategoryInsides = idArr;
      },
      async handleSave(row, savePrompt) {
        let obj = Object.assign({}, row, this.dialog.ruleForm2, {
          areaConfigs: row.isp
        });
        delete obj.isp;
        let params = Object.assign({}, obj, {
          icoUrl: this.subDialogImg.files.url
        });
        savePrompt(this.Api.saveStoreCate, params);
      },
      remove(data) {
        this.$plug.prompt.del(this.handleDel, data);
      },
      async handleDel(row) { // 删除
        let res = await this.Api.deleteStoreCate({
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
          this.Api.enableStoreCate({
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
      formatData(data, parentId) {
        let area = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].parentId == parentId) {
            let item = {
              value: data[i].id,
              label: data[i].name
            };
            let children = this.formatData(data, data[i].id);
            if (children.length) {
              item.children = children;
            }
            area.push(item);
          }
        }
        return area;
      },
      async getArea() {

        // this.areaDataList = areaConfig.RECORDS
        this.areaDataList = this.$plug.recursion.treeData(areaConfig.RECORDS, 'parent_code', ['', null, '000000'], 'code', 'name');

      },
      async getInside() {
        let res = await this.Api.getStoreCateInside({});
        if (res.status == 1) {
          let data = [];
          data = res.data.map(item => {
            return Object.assign({}, item, {disabled: item.isEnable === 1})
          })
          this.insideOptionsStaff = this.$plug.recursion.treeData(data, 'parentId', ['', null], 'id', 'name');
        }
      }
    },
    async mounted() {
      this.getDataList();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding-right: 8px;
  }
</style>

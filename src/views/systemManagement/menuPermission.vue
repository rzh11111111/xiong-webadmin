<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :searchObj="searchObj" :getDataList="getDataList" :timeRangeVal="['time1']" :quickSearch="quickSearch" :tableTree="tableTree" :searchBool="searchBool"
                  :dialog="dialog"
                  @add="handleAdd"></search-sub>
      <!--树列表-->
      <tree-table :expandAll="false" :data="treeTableList" :columns="columns" border v-loading="listLoading" ref="tree">
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
        <el-table-column label="创建时间" align="center" width="135">
          <template slot-scope="{ index,row }">
            <span>{{row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150"
                         class-name="small-padding fixed-width">
          <div class="custom-tree-node" slot-scope="props">
            <el-button type="text"
                       size="mini"
                       @click.stop="() => append(props.row)">创建子菜单
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click.stop="() => update(props.row)">编辑
            </el-button>

            <el-button type="text"
                       size="mini"
                       :disabled="!!props.row.children && !!props.row.children.length"
                       @click.stop="() => remove(props.row)">删除
            </el-button>
          </div>
        </el-table-column>

      </tree-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入菜单名称" data-name="name">*</i>菜单名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :readonly="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入菜单编码" data-name="permissionCode">*</i>菜单编码：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.permissionCode" :disabled="!!dialog.ruleForm2.id"
                        :readonly="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>接口地址：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.url" :readonly="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请选择适用平台用户" data-name="platformType">*</i>适用平台用户：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.platformType" filterable placeholder="请选择">
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
            <td>序号：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.sortNo" :readonly="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请选择是否启用" data-name="isEnable">*</i>是否启用：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isEnable">
                <el-radio border :label="0">启用</el-radio>
                <el-radio border :label="1">禁用</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>类型：</td>
            <td colspan="3">
              <el-radio-group size="mini" v-model="dialog.ruleForm2.type">
                <el-radio border :label="1">菜单</el-radio>
                <el-radio border :label="2">权限</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <!-- <el-form-item label="菜单名称" prop="name">
            <el-input v-model="dialog.ruleForm2.name" :readonly="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="菜单编码" prop="permissionCode">
            <el-input v-model="dialog.ruleForm2.permissionCode" :disabled="!!dialog.ruleForm2.id"
                      :readonly="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="接口地址" prop="url">
            <el-input v-model="dialog.ruleForm2.url" :readonly="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="适用平台用户" prop="platformType">
            <el-select v-model="dialog.ruleForm2.platformType" filterable placeholder="请选择">
              <el-option
                v-for="item in platformName"
                :key="item.value"
                :label="item.label"
                :disabled="dialog.readBool"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sortNo">
            <el-input v-model.number="dialog.ruleForm2.sortNo" :readonly="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-radio-group size="mini" v-model="dialog.ruleForm2.isEnable">
              <el-radio border :label="0">启用</el-radio>
              <el-radio border :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group size="mini" v-model="dialog.ruleForm2.type">
              <el-radio border :label="1">菜单</el-radio>
              <el-radio border :label="2">权限</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import treeTable from '@/components/TreeTable'
  import SearchSub from '@/components/SearchSub'
  import DialogSub from '@/components/DialogSub'
  import {format} from "../../utils";

  const platformName = [
    {value: 1, label: "通用"},
    {value: 2, label: "员工"},
    {value: 3, label: "商户"},
    {value: 4, label: "生产企业同城企业"},
    {value: 5, label: "推广员"},
    {value: 6, label: "合作商"},
    {value: 7, label: "省区总"},
  ];

  // arr to obj
  const platformNameKeyValue = platformName.reduce((acc, cur) => {
    acc[cur.value] = cur.label;
    return acc;
  }, {});

  export default {
    data() {
      return {
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        platformName,
        // 搜索
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '名称/编码/接口地址'
        }, {
          value: 'time1',
          label: '',
          name: '创建时间',
          isTimeRange: true
        }],
        // 树表格
        tableTree: true,
        columns: [
          {
            label: '菜单名称',
            value: 'name',
            width: 230
          }, {
            label: '菜单编码',
            value: 'permissionCode',
            width: 120
          }, {
            label: '接口地址',
            value: 'url',
            width: 120
          }
        ],
        listLoading: false,
        treeTableList: [],
        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        // 弹框
        dialog: {
          btnText: '创建菜单',
          titleText: '创建菜单',
          width: '800px',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          // readBool: true,
          ruleForm2: {
            permissionCode: '',
            name: '',
            sortNo: '',
            parentId: null,
            url: '',
            platformType: 1, // 适用平台用户（1 通用 2 员工 3 商户 4 生产企业同城企业 5 推广员 6 合作商 7 省区总 ）
            isEnable: 0,
            type: 1
          },
          rules2: {
            name: this.$plug.valid.isNull(),
            permissionCode: this.$plug.valid.isNull(),
            // url: this.$plug.valid.isNull(),
            // permissionCode: this.$plug.valid.isNull(),
            platformType: this.$plug.valid.isNull(),
          }
        }
      }
    },
    components: {
      treeTable,
      SearchSub,
      DialogSub
    },
    filters: {
      typeFilter(type) {
        return platformNameKeyValue[type];
      }
    },
    methods: {
      // 获取部门列表
      async getDataList() {
        try {
          this.listLoading = true;
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
            // page: {
            //   pageNo: this.pagination.page,
            //   pageSize: this.pagination.count
            // },
            searchParameter: searchParameter
          }, quick);
          let resData = await this.Api.getMenuList(para);
          this.treeTableList = this.$plug.recursion.treeData(resData.data, 'parentId', ['', null], 'id', 'name');
          this.listLoading = false;
          return resData
        } catch (error) {
          console.log(error);
        }
      },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建菜单';
        this.dialog.saveFormVisible = true;
      },
      // 显示增加子部门
      append(data) {
        this.dialog.titleText = '创建子菜单';
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2.parentId = data.id;
      },
      update(data) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2 = Object.assign({}, data);
        if (this.dialog.ruleForm2 && this.dialog.ruleForm2.parent || this.dialog.ruleForm2 && this.dialog.ruleForm2.children) {
          delete this.dialog.ruleForm2.parent
          delete this.dialog.ruleForm2.children
        }
      },
      async handleSave(row, savePrompt) {
        if (!row.id) {
          savePrompt(this.Api.saveMenu, row);
        } else {
          savePrompt(this.Api.updateMenu, row);
        }
      },
      remove(data) {
        this.$plug.prompt.del(this.handleDel, data);
      },
      async handleDel(row) { // 删除
        await this.Api.deleteMenu({
          'id': row.id
        });
        this.getDataList();
      },
      handleShowStatusChange(index, row) {
        row.isEnable = row.isEnable === 1 ? 0 : 1;
        this.$plug.prompt.del(() => {
          this.Api.isEnableMenu({
            id: row.id
          }).then(res => {
            if (res.status == 1) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
              row.isEnable = row.isEnable === 1 ? 0 : 1;
            }
          });
        }, row, null, row.isEnable === 1 ? '启用该数据' : '禁用该数据');
      }
    },
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

  .platformType {
    display: flex;
    flex-direction: column;
    flex-flow: wrap;
  }
</style>

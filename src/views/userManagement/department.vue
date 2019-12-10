<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :tableTree="tableTree" :getDataList="getDataList" :searchBool="searchBool"
                  :dialog="dialog"
                  @add="handleAdd"></search-sub>
      <!--树列表-->
      <tree-table :data="treeTableList" :columns="columns" border v-loading="listLoading" ref="tree">
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
                       @click.stop="() => append(props.row)">创建子部门
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click.stop="() => update(props.row)">编辑
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click.stop="() => remove(props.row)">删除
            </el-button>
          </div>
        </el-table-column>

      </tree-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入部门名称" data-name="name">*</i>部门名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
            <td>部门编码：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td>部门负责人：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.employee.id" clearable placeholder="请选择">
                <el-option
                  v-for="item in optionsStaff"
                  :key="item.value"
                  :label="item.label"
                  :disabled="dialog.readBool || item.isEnable === 1"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td>部门地址：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.address" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>父级部门：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.parentId" clearable placeholder="请选择" :disabled="dialog.readBool || !dialog.create">
                <el-option
                v-for="item in depParent"
                :key="item.value"
                :label="item.label"
                :disabled="item.isEnable === 1"
                :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td>是否启用：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
                <el-radio border :label="0">启用</el-radio>
                <el-radio border :label="1">禁用</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>序号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
            </td>
            <td>备注：</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <!-- <el-form-item label="部门名称" prop="name">
            <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="部门编码" v-if="!!dialog.ruleForm2.id">
            <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="部门负责人">
            <el-select v-model="dialog.ruleForm2.employee.id" clearable placeholder="请选择">
              <el-option
                v-for="item in optionsStaff"
                :key="item.value"
                :label="item.label"
                :disabled="dialog.readBool || item.isEnable === 1"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门地址">
            <el-input v-model="dialog.ruleForm2.address" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sortNo">
            <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="是否启用：">
            <el-radio-group size="mini" v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
              <el-radio border :label="0">启用</el-radio>
              <el-radio border :label="1">禁用</el-radio>
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

  export default {
    data() {
      return {
        searchBool: true,
        // 树表格
        tableTree: true,
        departmentParent: [],
        depParent: [],
        columns: [
          {
            label: '部门名称',
            value: 'name',
            width: 230
          }, {
            label: '部门编码',
            value: 'code',
            width: 120
          }, {
            label: '部门负责人',
            width: 120,
            value: 'employeeName'
          }
        ],
        listLoading: false,
        treeTableList: [],
        optionsStaff: [], // 部门负责人
        staffObj: {},
        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        // 弹框
        dialog: {
          btnText: '创建部门',
          titleText: '创建部门',
          width: '750px',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          create: false,
          ruleForm2: {
            name: '',
            sortNo: '',
            parentId: null,
            address: '',
            employee: {
              id: ''
            },
            isEnable: 0,
          }
        }
      }
    },
    components: {
      treeTable,
      SearchSub,
      DialogSub
    },
    methods: {
      // 获取部门列表
      async getDataList(row) {
        try {
          this.listLoading = true;
          let resData = await this.Api.getDepartment({});
          resData.data.map(item => {
            if (item.employee == null) {
              item.employee = {id: '', name: ''}
            }
            item.employeeName = item.employee.name
          });

          this.departmentParent = this.$plug.public.transformList(resData.data, 'id', 'name');
          this.treeTableList = this.$plug.recursion.treeData(resData.data, 'parentId', [null, ''], 'id', 'name');
          this.listLoading = false;
          return resData
        } catch (error) {
          console.log(error);
        }
      },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建部门';
        this.dialog.saveFormVisible = true;
        this.dialog.create = true;
        this.depParent = Array.from(this.departmentParent);
      },
      // 显示增加子部门
      append(data) {
        this.dialog.titleText = '创建子部门';
        this.dialog.saveFormVisible = true;
        this.dialog.create = false;
        this.dialog.ruleForm2.employee.id = '';
        this.depParent = Array.from(this.departmentParent);
        this.dialog.ruleForm2.parentId = data.id;
      },
      update(data) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        this.dialog.create = false;
        this.dialog.ruleForm2 = Object.assign({}, data);
        if (this.dialog.ruleForm2 && this.dialog.ruleForm2.parent || this.dialog.ruleForm2 && this.dialog.ruleForm2.children) {
          delete this.dialog.ruleForm2.parent
          delete this.dialog.ruleForm2.children
        }
        this.depParent = this.departmentParent.filter(item => {
          if ((!item.parentIds || item.parentIds.indexOf(data.id) === -1) && data.id !== item.id) {
            return true;
          }
          return false;
        })
      },
      async handleSave(row, savePrompt) {
        if (!row.id) {
          savePrompt(this.Api.saveDepartment, row);
        } else {
          savePrompt(this.Api.saveDepartment, row);
        }
      },
      remove(data) {
        this.$plug.prompt.del(this.handleDel, data);
      },
      async handleDel(row) { // 删除
        await this.Api.deleteDepartment({
          'id': row.id
        });
        this.getDataList();
      },
      handleShowStatusChange(index, row) {
        row.isEnable = row.isEnable === 1 ? 0 : 1;
        this.$plug.prompt.del(() => {
          this.Api.isEnableDepartment({
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
      // 获取部门负责人
      let res = await this.Api.getStaff({});
      this.optionsStaff = this.$plug.public.transformList(res.data, 'id', 'name');
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
    margin-bottom: 20px;
  }
</style>

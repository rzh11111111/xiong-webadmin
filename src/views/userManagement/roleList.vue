<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']"  :getDataList="getDataList" :quickSearch="quickSearch" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd" :pagination="pagination">
        <!--<template slot="arrDel">-->
        <!--<el-button size="mini" icon="el-icon-delete" type="danger" @click="arrDel">批量删除-->
        <!--</el-button>-->
        <!--</template>-->
      </search-sub>
      <!--表格-->
      <table-sub ref="tableSub" @submit="handleSave" @arrDel="handleDelArr" @add="handleAdd"
                 @edit="handleEdit"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-switch
            @change="handleShowStatusChange(index, row)"
            :active-value="0"
            :inactive-value="1"
            v-model="row.isEnable"
            :disabled="row.isSys === 1">
          </el-switch>
        </template>
        <template slot="isSys" slot-scope="{index, row}">
          <el-tag :type="row.isSys === 1 ? 'info' : ''">{{row.isSys === 1 ? '是' : '否'}}</el-tag>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{index, row}">
          <el-button type="text"
                     size="mini"
                     @click.stop="handleEdit(index, row)">编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click.stop="handleDel(index, row)" :disabled="row.isSys === 1">删除
          </el-button>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub ref="dialog" :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入角色名称" data-name="name">*</i>角色名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
            <td>角色编码：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择权限" data-name="name">*</i>选择/查看权限：</td>
            <td>
              <Popover ref="popover" :treeDataList="treeDataList" :popoverData="popoverData" @change="changePopover"></Popover>
            </td>
            <td>备注：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>是否启用：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isEnable" :disabled="dialog.ruleForm2.id && dialog.ruleForm2.isSys === 1">
                <el-radio border :label="0">启用</el-radio>
                <el-radio border :label="1">禁用</el-radio>
              </el-radio-group>
            </td>
            <td>系统级角色：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isSys" :disabled="true">
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
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import Popover from '@/components/Popover'
  import bus from '../../utils/bus.js'
  import {format} from "../../utils";

  export default {
    components: {
      DialogSub,
      SearchSub,
      TableSub,
      Popover
    },
    data() {
      return {
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'isEnable',
            label: '',
            selected: '',
            list: [{
              label: '启用',
              value: 0
            }, {
              label: '停用',
              value: 1
            }]
          }]
        },
        popoverData: {
          btnText: '权限',
          checkedType: true
        },
        searchBool: false,
        format: format,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '角色名称、编码'
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '创建时间段'
        }],

        table: {
          btnText: '创建角色',
          width: '200px',
          // emitEditBool: true,
          delBool: true,
          editBool: true,
          // type: 'selection',
          columns: [{
            value: 'code',
            label: '角色编码',
            width: '150'
          }, {
            value: 'name',
            label: '角色名称',
            width: '100'
          }, {
            value: 'isEnable',
            label: '是否启用',
            width: '120',
            slotBool: true
          }, {
            value: 'isSys',
            label: '是否是系统角色',
            width: '140',
            slotBool: true
          }, {
            value: 'createBy',
            label: '创建人',
            width: '100'
          }, {
            value: 'createTime',
            label: '创建时间',
            width: '140',
            slotBool: true
          }, {
            value: 'updateBy',
            label: '更新人',
            width: '120'
          }, {
            value: 'updateTime',
            label: '更新时间',
            slotBool: true,
            width: '140'
          }, {
            value: 'remarks',
            label: '备注',
            width: '100'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        dialog: {
          btnText: '创建角色',
          titleText: '创建角色',
          width: '750px',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          ruleForm2: {
            name: '',
            // code: '',
            menuPermissions: [],
            isEnable: 0,
            remarks: '',
            isSys: 0
          },
          rules2: {
            name: this.$plug.valid.isNull(),
            // code: this.$plug.valid.isNull(),
            menuPermissions: [
              { type: 'array', required: true, message: '请至少选择一个权限', trigger: 'change' }
            ]
          }
        },
        filterText: '',
        treeDataList: [],
        isExpand: true,
        visible: false // 是否显示弹出框
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      getDataList() { //获取角色列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
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
          queryPo,
          searchParameter: searchParameter
        }, quick)
        return this.Api.getRoleList(para);
      },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建角色';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.$nextTick(() => {
          this.$refs.popover.$refs.tree.setCheckedKeys([]);
        }) // 清空tree
      },
      async handleEdit(index, row) {
        this.dialog.titleText = '编辑'
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        // this.dialog.ruleForm2 = Object.assign({}, row);
        let res = await this.Api.roleAccessFind({
          id: row.id
        });
        let data = res.data ? res.data.menuPermissions : [];
        let idArr = [];
        data.forEach((item) => {
          idArr.push(item.id);
        })
        this.$nextTick(function () {
          this.$refs.popover.$refs.tree.setCheckedKeys(idArr);
        })
        this.dialog.ruleForm2 = Object.assign({}, row, res.data);
      },
      // 新增修改menuPermissions
      async handleSave(row, savePrompt, type) {

        if (!row.id) {
          savePrompt(this.Api.saveRole, Object.assign({}, row));
        } else {
          savePrompt(this.Api.updateRole, Object.assign({}, row));
        }
      },
      // 批量删除
      arrDel() {
        this.$refs.tableSub.handleBatchOperate()
      },
      async handleDelArr(row, delPrompt) {
        delPrompt(this.Api.deleteArrRole, row);
      },
      // 单个删除
      async handleDel(index, row) { //删除
        this.$plug.prompt.del(this.handleDelPrompt, row);
      },
      handleDelPrompt(row) {
        this.$refs.tableSub.delPrompt(this.Api.deleteRole, {
          "id": row.id
        });
      },
      handleShowStatusChange(index, row) {
        row.isEnable = row.isEnable === 1 ? 0 : 1;
        this.$plug.prompt.del(() => {
          this.Api.isRoleAccessEnable({
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
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      on_refresh() {
        this.$refs.tree.setCheckedKeys([]);
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
        // if (idArr.length) {
        //   this.$nextTick(()=>{
        //     this.$refs.menuPermissions && this.$refs.menuPermissions.clearValidate();
        //   });
        // } else {
        //   this.$nextTick(()=>{
        //     this.$refs.dialog.$refs.ruleForm2.validateField('menuPermissions');
        //   });
        // }
        this.dialog.ruleForm2.menuPermissions = idArr
      },
    },
    computed: {},
    async mounted() {
      let res = await this.Api.getMenuList({
        queryPo: {}
      });
      this.treeDataList = this.$plug.recursion.treeData(res.data, 'parentId', ['', null], 'id', 'name');
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
  }
</style>

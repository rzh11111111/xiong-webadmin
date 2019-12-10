<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :timeRangeVal="['time1']" :searchObj="searchObj" :quickSearch="quickSearch" :getDataList="getDataList" :tableTree="tableTree" :searchBool="searchBool"
                  :dialog="dialog"
                  @add="handleAdd"></search-sub>
      <!--树列表-->
      <tree-table :data="treeTableList" :columns="columns" border v-loading="listLoading" ref="tree">
        <el-table-column label="目录类型" align="center" width="100">
          <template slot-scope="{ index,row }">
            <span>{{row.type === 1 ? '内部' : '外部'}}</span>
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
                       @click.stop="() => append(props.row)">创建子目录
            </el-button>
            <!-- <el-button type="text"
                       size="mini"
                       @click.stop="() => update(props.row)">编辑
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click.stop="() => remove(props.row)">删除
            </el-button> -->
          </div>
        </el-table-column>

      </tree-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入文件名称" data-name="name">*</i>文件名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :readonly="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>目录类型：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.type" :disabled="dialog.readBool">
                <el-radio border :label="1">内部</el-radio>
                <el-radio border :label="2">外部</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <!-- <el-form-item label="文件名称" prop="name">
            <el-input v-model="dialog.ruleForm2.name" :readonly="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="目录类型：">
            <el-radio-group size="mini" v-model="dialog.ruleForm2.type" :disabled="dialog.readBool">
              <el-radio border :label="1">内部</el-radio>
              <el-radio border :label="2">外部</el-radio>
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
  import {format} from "@/utils";

  export default {
    data() {
      return {
        // 搜索
        searchBool: false,
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '文件分类名称'
        }, {
          value: 'code',
          label: '',
          name: '文件分类编码',
          isText: true
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
            label: '文件名称',
            value: 'name',
            width: 230
          }, {
            label: '文件编码',
            value: 'code',
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
          width: '500px',
          btnText: '创建文件分类',
          titleText: '创建文件分类',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          // readBool: true,
          ruleForm2: {
            // code: '',
            name: '',//	是	string	文件分类名称(必须以”/“结尾)
            type: 1,//	是	int	目录类型
            parentId: null//	是	String	父级分类
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
    methods: {
      // 获取列表
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
          let para = Object.assign({
            // page: {
            //   pageNo: this.pagination.page,
            //   pageSize: this.pagination.count
            // },
            searchParameter
          }, queryPo);
          let resData = await this.Api.getFileDirectoryList(para);
          this.treeTableList = this.$plug.recursion.treeData(resData.data, 'parentId', ['', null], 'id', 'name');
          this.listLoading = false;
          return resData
        } catch (error) {
          console.log(error);
        }
      },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建文件分类';
        this.dialog.saveFormVisible = true;
      },
      // 显示增加子部门
      append(data) {
        this.dialog.titleText = '创建文件子分类';
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
          savePrompt(this.Api.saveFileDirectory, row);
        } else {
          savePrompt(this.Api.saveFileDirectory, row);
        }
      },
      remove(data) {
        this.$plug.prompt.del(this.handleDel, data);
      },
      async handleDel(row) { // 删除
        console.log(row.id)
        await this.Api.deleteMenu({
          'id': row.id
        });
        this.getDataList();
      },
      handleShowStatusChange(index, row) {
        let para = {
          id: row.id
        }
        this.Api.isEnableMenu(para).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          }
        });
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
  .form-table td:nth-child(even){
    width: 250px;
  }
</style>

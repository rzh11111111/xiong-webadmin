<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :searchObj="searchObj" :tableTree="tableTree" :getDataList="getDataList" :searchBool="searchBool"
                  :dialog="dialog"
                  @add="handleAdd"></search-sub>
      <!--树列表-->
      <tree-table :data="treeTableList" :columns="columns" border v-loading="listLoading" ref="tree">
        <!--<el-table-column align="center" label="分类类型">-->
        <!--<template slot-scope="{ index,row }">-->
        <!--<el-tag :type="row.type=='1'?'primary':'success'">{{row.type=='1'?'内部':'外部'}}</el-tag>-->
        <!--</template>-->
        <!--</el-table-column>-->
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
                <el-dropdown-item>
                  <el-button class="width100" type="text"
                             size="mini"
                             @click="() => handleAttrbute(props.row)">查看属性
                  </el-button>
                </el-dropdown-item>
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
            <td>分类名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :readonly="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>排序：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.sortNo" :readonly="dialog.readBool"></el-input>
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
          </tr>
        </template>
      </dialog-sub>
      <!--dialog弹窗2-->
      <dialog-sub :dialog="dialog2" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <el-table
            :data="dialog2.attrbuteList"
            border
            style="width: 100%">
            <el-table-column
              prop="code"
              label="属性编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="属性名称"
              width="120">
            </el-table-column>
            <el-table-column
              prop="saleTypeName"
              label="属性类型"
              width="100">
            </el-table-column>
            <el-table-column
              prop="isMustName"
              label="必备属性"
              width="80">
            </el-table-column>
            <el-table-column
              prop="formTypeName"
              label="表单类型"
              width="80">
            </el-table-column>
            <el-table-column
              prop="attributeVal"
              label="可选属性值"
              width="180">
              <template slot-scope="{ index,row }">
                <el-popover
                  placement="right-start"
                  width="200"
                  trigger="hover"
                  :content="row.attributeVal">
                  <p class="ellipsis" slot="reference">{{row.attributeVal}}</p>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import treeTable from '@/components/TreeTable'
  import SearchSub from '@/components/SearchSub'
  import DialogSub from '@/components/DialogSub'
  import config from '@/utils/config'

  export default {
    data() {
      return {
        apiUrl: config.host + '/admin/api/sys/fileconfig/upload',
        searchBool: true,
        searchObj: [],
        // 树表格
        tableTree: true,
        columns: [
          {
            label: '分类名称',
            value: 'name',
            width: 200
          }, {
            label: '分类编码',
            value: 'code',
            width: 120
          }, {
            label: '排序',
            value: 'sortNo',
            width: 100
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

        dialog: {
          titleText: '创建分类',
          btnText: '创建分类',
          titleText: '创建分类',
          width: '750px',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          isTable: true,
          ruleForm2: {
            name: '',	// 是	string	名称	是
            // type: '1',	// 是	string	分类类型（1 内部 2 外部）	否
            parentId: null,	// 否	string	父级分类	否
            sortNo: null,
            isEnable: 0, // 否	int	是否禁用（否0，是1）（默认否）	是
            goodsCategoryInsides: [{id: ''}] // 内部分类
          }
        },
        dialog2: {
          closeBtnBool: true,
          cancelBtnBool: true,
          btnBool: true,
          titleText: '查看属性',
          btnText: '查看属性',
          titleText: '查看属性',
          width: '750px',
          saveFormVisible: false,
          type: 'permission',
          attrbuteList: []
        },
        filterText: '',
        treeDataList: [],
        treeTableList: [],
        isExpand: true,
        visible: false // 是否显示弹出框
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    components: {
      treeTable,
      SearchSub,
      DialogSub
    },
    methods: {
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
          let resData = await this.Api.getGoodsClassificationList(para);
          this.treeTableList = this.$plug.recursion.treeData(resData.data, 'parentId', ['', null], 'id', 'name');
          this.listLoading = false;
          return resData
        } catch (error) {
          console.log(error);
        }
      },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建内部分类';
        this.dialog.saveFormVisible = true;
      },
      append(row) {
        this.dialog.titleText = '创建子分类';
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2.parentId = row.id;
      },
      async update(row) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2 = Object.assign({}, row);
        if (this.dialog.ruleForm2 && this.dialog.ruleForm2.parent || this.dialog.ruleForm2 && this.dialog.ruleForm2.children) {
          delete this.dialog.ruleForm2.parent
          delete this.dialog.ruleForm2.children
        }
      },
      async handleSave(row, savePrompt) {
        if (!row.id) {
          savePrompt(this.Api.saveGoodsClassification, row);
        } else {
          savePrompt(this.Api.saveGoodsClassification, row);
        }
      },
      remove(data) {
        this.$plug.prompt.del(this.handleDel, data);
      },
      async handleAttrbute(row) {
        console.log('aaaaaa')
        this.dialog2.saveFormVisible = true;
        let {data} = await this.Api.findGoodsClassification({id: row.id})
        data.goodsAttributeNames.map(i => {
          let attributeVal = []
          i.goodsAttributeVals.map(v => {
            if (v.name) {
              attributeVal.push(v.name)
            }
          })
          switch (i.saleType) {
            case 1:
              i.saleTypeName='基础属性';
              break;
            case 2:
              i.saleTypeName='销售属性';
              break;
          }
          switch (i.isMust) {
            case 0:
              i.isMustName='是';
              break;
            case 1:
              i.isMustName='否';
              break;
          }
          switch (i.formType) {
            case 1:
              i.formTypeName='输入';
              break;
            case 2:
              i.formTypeName='多选';
              break;
            case 3:
              i.formTypeName='单选';
              break;
            case 4:
              i.formTypeName='多行输入';
              break;
          }
          i.attributeVal = attributeVal.length ? attributeVal.join() : ''
        })
        this.dialog2.attrbuteList = data.goodsAttributeNames
      },
      async handleDel(row) { // 删除
        await this.Api.delGoodsClassification({
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
          this.Api.isEnableGoodsClassification(para).then(res => {
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
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      on_refresh() {
        this.$refs.tree.setCheckedKeys([]);
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
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
    margin-bottom: 20px;
  }
</style>

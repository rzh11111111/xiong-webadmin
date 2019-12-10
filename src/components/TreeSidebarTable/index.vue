<!--
  table.tableBool 默认为false时 table 组件显示，为true时隐藏
	table.searchBool 默认为false时 查询按钮 显示，为true时隐藏
	table.addBool 默认为false时 新增按钮 显示，为true时隐藏
	table.detailBool 默认为false时 查看按钮 隐藏，为true时显示
	table.editBool 默认为false时 编辑按钮 显示，为true时隐藏
	table.delBool 默认为false时 删除按钮 显示，为true时隐藏

	table.loadBool 默认为false，为true时 当value变化时 自动调用 loadData

	table.emitAddBool 默认为false时 父组件 默认不监听 子组件 的新增事件，为true时则监听
	table.emitDetailBool 默认为false时 父组件 默认不监听 子组件 的查看事件，为true时则监听
	table.emitEditBool 默认为false时 父组件 默认不监听 子组件 的编辑事件，为true时则监听
	table.arrBool 默认为false,为true时，table的数据可从外部传入
-->
<template>
  <div class="tree-sidebar-table">
    <el-card class="tree-sidebar box-card" shadow="never">
      <el-tabs tab-position="top" style="height: 100%;margin-top: -20px;" :stretch="treeConfig.tabs.length >= 2" v-if="treeConfig.tabs && treeConfig.tabs.length" @tab-click="tabClick">
        <el-tab-pane :label="tab" v-for="(tab, inx) in treeConfig.tabs" :key="inx">
          <el-tree ref="tree" :data="treeData" @node-click="handleNodeClick" :indent="10" :props="treeConfig.list[inx * 1].treeProps" :node-key="treeConfig.list[inx * 1].nodeKey || 'id'" :lazy="treeConfig.list[inx * 1].lazy || false" :load="loadTree" :highlight-current="true" :default-expanded-keys="treeConfig.list[inx * 1].expandedKeys" :expand-on-click-node="false" accordion></el-tree>
        </el-tab-pane>
      </el-tabs>
      <el-tree ref="tree" :data="treeData" @node-click="handleNodeClick" :indent="10" :props="treeConfig.treeProps" :node-key="treeConfig.nodeKey || 'id'" :lazy="treeConfig.lazy || false" :load="loadTree" :highlight-current="true" :default-expanded-keys="treeConfig.expandedKeys" :expand-on-click-node="false" accordion v-else></el-tree>
    </el-card>
    <div class="tree-table">
      <el-table ref="table" v-loading="listLoading" :height="table.height" :max-height="table.maxHeight" :data="tableDataList" border size="mini" :header-cell-style="headerStyle" style="width: 100%"
                v-if="!table.tableBool" @selection-change="handleSelectionChange" @sort-change="getSortable"  :row-class-name="tableRowClassName" :cell-class-name="table.isHeightAuto ? 'cell-height' : ''">
        <el-table-column fixed="left" width="55" align="center" v-if="table.type === 'radio'" label="">
          <template slot-scope="scope">
           <el-radio v-model="dialog.ruleForm2.id" :label="scope.row.id" @change="() => {singleSelect(scope.row, scope.$index);}">&nbsp</el-radio>
         </template>
        </el-table-column>
        <el-table-column fixed="left" :type="table.type" width="55" align="center" v-else-if="table.type">
        </el-table-column>
        <el-table-column :sortable="item.sortable" v-for="(item,index) in table.columns" :key="index" :prop="item.value"
                         :label="item.label"
                         :align="item.align?item.align : 'center'" :min-width="item.width">
          <template slot-scope="scope">
            <slot :name="item.value" :slotname="item.value" :index="scope.$index" :row="scope.row"
                  v-if="item.slotBool"></slot>
            <span v-else-if="item.value.indexOf('Img')>0||item.value.indexOf('Url')>0" class="table-img-box">
              <el-popover
                placement="top"
                trigger="click"
                popper-class="tootip-img-box"
                v-model="scope.row.visible" v-if="item.isShow">
                <img :src="scope.row[item.value]" :alt="item.alt || scope.row.name || 'logo'"/>
                <span slot="reference">
                  <img class="logo-img" :src="scope.row[item.value]" :alt="item.alt || scope.row.name || 'logo'"/>
                </span>
              </el-popover>
              <img v-else class="logo-img" :src="scope.row[item.value]" :alt="item.alt || scope.row.name || 'logo'">
            </span>
            <span v-else>{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" :width="table.width?table.width:150" align="center" v-if="!table.btn">
          <template slot-scope="scope">
            <slot name="table" :index="scope.$index" :row="scope.row"></slot>
            <el-button type="text"
                       size="mini"
                       v-if="table.detailBool"
                       @click.stop="handleDetail(scope.$index,scope.row)">查看
            </el-button>
            <el-button type="text"
                       size="mini"
                       v-if="!table.editBool"
                       @click.stop="handleEdit(scope.$index,scope.row)">编辑
            </el-button>
            <el-button
              v-if="!table.delBool"
              type="text"
              size="mini"
              @click.stop="handleDel(scope.$index,scope.row)">删除
            </el-button>
            <slot name="tableAfter" :index="scope.$index" :row="scope.row"></slot>
            <!--<el-button @click="handleDel(scope.$index,scope.row)" type="text" size="small" v-if="!table.delBool">{{ scope.row.state===true?'禁用':'启用' }}</el-button>-->

          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div class="batch-operate-container">

        </div>
        <el-pagination small background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="pagination.page" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.count"
                       layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
                       v-if="!table.tablePagBool">
        </el-pagination>

      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../../utils/bus.js'

  export default {
    props: {
      searchObj: {
        type: Object,
        default() {
          return {}
        }
      },
      table: {
        type: Object,
        default() {
          return {
          }
        }
      },
      pagination: {
        type: Object,
        default() {
          return {}
        }
      },
      getDataList: {
        type: Function
      },
      dialog: {
        type: Object,
        default() {
          return {}
        }
      },
      loadBool: {
        type: Boolean,
        default() {
          return false
        }
      },
      value: {
        type: Number,
        default() {
          return 0
        }
      },
      reloadTableList: {
        type: Boolean,
        default() {
          return false
        }
      },
      getTreeList: {
        type: Function
      },
      treeConfig: {
        type: Object,
        default() {
          return {
            lazy: false,
            nodeKey: 'id',
            expandedKeys: [],
            treeProps: {},
            currentKey: ''
          };
        }
      },
      sidebarSelectd: {
        type: Object,
        default() {
          return {
            current: {},
            list: []
          }
        }
      }
    },
    data() {
      return {
        currentTabs: 0,
        listLoading: false,
        tableDataList: [],
        treeData: [],
        multipleSelection: [],
        operateType: null,
        currentTrees: [],
        currentTree: {},
        sortVals: {}
      }
    },
    methods: {
      getSortable(param) {
        this.sortVals = Object.assign({isSort: true}, param);
        this.loadData();
      },
      headerStyle() {
        return {
          'padding': '12px 0',
          'font-size': '13px',
          'background-color': '#f9fafc'
        }
      },
      async tabClick(nodes) {
        this.treeConfig.currentTab = nodes.index * 1;
        this.$emit('changeTabs', ...arguments);
        this.treeData = [];
        this.currentTrees = [];
        this.currentTree = {};
        if (this.treeConfig[this.currentTabs] && this.treeConfig[this.currentTabs].lazy) {
          return ;
        }
        this.pagination.page = 1;
        await this.getTreeDataList();
        this.loadData();
      },
      async loadTree(node, resolve) {
        let res = await this.getTreeList(node);
        if (!res) {
          res = [];
        }
        if (this.treeConfig.currentKey) {
          this.$nextTick(()=>{
            this.$refs.tree && this.$refs.tree.setCurrentKey(node.key || this.treeConfig.currentKey);
          });
        }
        resolve(res);
      },
      async getTreeDataList() {
        let res = await this.getTreeList();
        if (res) {
          this.treeData = res;
          if (this.treeConfig.currentKey) {
            this.$nextTick(()=>{
              this.$refs.tree && this.$refs.tree.setCurrentKey(this.treeConfig.currentKey);
            });
          }
        }
        return res;
      },
      handleNodeClick(params, nodes) {
        let includeParents = [];
        let level = nodes.level;
        var node = Object.assign({}, nodes);
        for (var i = level; i > 0; i--) {
          if (node) {
            includeParents.unshift(node.data);
            node = node.parent;
          }
        }
        this.sidebarSelectd.current = Object.assign({}, params);
        this.sidebarSelectd.list = includeParents;
        this.currentTrees = includeParents;
        this.currentTree = Object.assign({}, params);
        this.pagination.page = 1;
        this.loadData();
      },
      handleSizeChange(val) {
        if (this.pagination.total) {
          this.pagination.count = val;
          if (!this.table.tableBool) {
            this.loadData();
          } else {
            this.getDataList(this.currentTree, this.currentTrees)
          }
        }
      },
      handleCurrentChange(val) {
        if (this.pagination.total) {
          this.pagination.page = val;
          if (!this.table.tableBool) {
            this.loadData();
          } else {
            this.getDataList(this.currentTree, this.currentTrees)
          }
        }
      },
      handleDetail(index, row) {
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
        this.dialog.ruleForm2 = Object.assign({}, this.dialog.ruleForm2, row);

        if (this.table.emitDetailBool) {
          this.$emit('detail', this.dialog.ruleForm2);
        }
      },
      async handleEdit(index, row) { //显示编辑界面
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.ruleForm2 = Object.assign({}, this.dialog.ruleForm2, row);

        if (this.table.emitEditBool) {
          this.$emit('edit', this.dialog.ruleForm2);
        }
      },
      handleDel(index, row) { //删除
        this.$plug.prompt.del(this.emitDel, row);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.$emit("select", this.multipleSelection);
      },
      singleSelect(row, index) {
        this.dialog.ruleForm2 = Object.assign({}, row);
        this.$emit("select", row);
        return true;
      },
      handleBatchOperate() {
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.$plug.prompt.del(this.arrDel, ids, null);
      },

      emitDel(row) {
        this.$emit("del", row, this.delPrompt, this.dialog.type);
      },
      arrDel(row) {
        this.$emit("arrDel", row, this.delPrompt, this.dialog.type);
      },
      async delPrompt(delPromiss, param, otherPromiss) {
        try {
          let res = await delPromiss(param);
          if (res.status != 1) return
          this.$plug.prompt.delTip();
          if (!this.table.tableBool) {
            if (!this.table.noDataLoad) {
              this.loadData();
            }
          } else {
            this.getDataList(this.currentTree, this.currentTrees);
          }
          if (otherPromiss) {
            otherPromiss(res);
          }
        } catch (error) {
          console.log(error);
        }
      },
      async loadData() {
        this.listLoading = true;
        if (this.table.noDataLoad) { // 不需要再加载数据的情况
          this.listLoading = false;
          return;
        }
        try {
          let _res = await this.getDataList(this.currentTree, this.currentTrees, this.sortVals);
          if (_res && _res.data) {
            this.pagination.total = _res.data.count;
            if (_res.data.list) {
              this.tableDataList = _res.data.list;
            } else {
              this.tableDataList = [];
            }
          } else {
            this.tableDataList = [];
          }
        } catch (err) {
          console.log('err', err);
        }
        this.listLoading = false;
      },
      bus() {
        bus.$on("loadDialogData", () => {
          this.loadData();
        })
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 1) {
          return 'warning-row';
        } else {
          return '';
        }
      },
      clearSelection() {
        this.$nextTick(()=>{
          this.$refs.table.clearSelection();
        });
      }
    },
    watch: {
      value(val) {
        if (this.loadBool) {
          this.loadData();
        }
      },
      'table.tableDataList'(val) {
        if (this.table.arrBool) {
          this.tableDataList = val;
        }
      },
      reloadTableList() {
        this.loadData();
      },
      'table.list'(val) {
        // 监听table.list值，给table data赋值. review.vue页面有用到
        this.tableDataList = val;
      }
    },
    mounted() {
      this.bus();
      if (!this.table.tableBool) {
        this.loadData();
      }
      if (this.treeConfig.tabs && this.treeConfig.tabs.length) {
        if (!this.treeConfig.list[this.treeConfig.currentTab || 0].lazy) {
          this.getTreeDataList();
        }
      } else if (!this.treeConfig.lazy) {
        this.getTreeDataList();
      }
    },
    destroyed() {
      bus.$off("loadDialogData");
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .el-pagination /deep/ .el-select {
    bottom: 3px;
  }
  .tree-sidebar-table{
    position: relative;
    padding-left: 198px;
    flex: 1;
    background-color: #f3f3f3;
    border: 1px solid #dfdfdf;
    border-top-width: 0;
    .tree-sidebar.el-card{
      position: absolute;
      top: 0;
      left: -1px;
      bottom: -1px;
      width: 200px;
      border-radius: 0 !important;
      overflow: auto;
      @include scrollBar;
    }
    .tree-table{
      margin-right: -1px;
    }
    .table-footer{
      display: flex;
      justify-content: space-between;
      padding-top: 7px;
      padding-right: 7px;
      padding-bottom: 7px;

    }
  }

  .table-img-box{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    span{
      cursor: pointer;
    }
    .logo-img{
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>

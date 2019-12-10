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
  <div class="tablesub-box">
      <el-table ref="multipleTable" :height="table.height" :max-height="table.maxHeight" v-loading="listLoading" :data="tableDataList" :header-cell-style="headerStyle" border size="mini" style="width: 100%"
                v-if="!table.tableBool" @selection-change="handleSelectionChange" @sort-change="getSortable" :row-class-name="tableRowClassName" :cell-class-name="table.isHeightAuto ? 'cell-height' : ''">
        <el-table-column fixed="left" :type="table.type" width="55" align="center" :selectable="selectable" v-if="table.type">
        </el-table-column>
        <el-table-column :sortable="item.sortable" v-for="(item,index) in table.columns" :key="index" :prop="item.value"
                         :label="item.label"
                         :align="item.align?item.align : 'center'" :min-width="item.width">
          <template slot-scope="scope">
            <slot :name="item.value" :slotname="item.value" :index="scope.$index" :row="scope.row"
                  v-if="item.slotBool"></slot>
            <template v-else-if="item.value.indexOf('Img')>0||item.value.indexOf('Url')>0 || item.isImg">
              <span class="table-img-box" v-if="!!scope.row[item.value]">
                <el-popover
                  placement="top"
                  trigger="click"
                  popper-class="tootip-img-box" v-if="item.isShow">
                  <img :src="scope.row[item.value]" :alt="item.alt || scope.row.name || 'logo'"/>
                  <span slot="reference">
                    <img class="logo-img" :src="scope.row[item.value]" :alt="item.alt || scope.row.name || 'logo'"/>
                  </span>
                </el-popover>
                <img v-else class="logo-img" :src="scope.row[item.value]" :alt="item.alt || scope.row.name || 'logo'">
              </span>
            </template>
            <span v-else>
              <template v-if="item.isOverflow">
                <el-popover
                  placement="top"
                  trigger="click"
                  popper-class="tootip-img-box"
                  :content="scope.row[item.value]">
                  <p class="ellipsis" slot="reference">{{scope.row[item.value]}}</p>
                </el-popover>
              </template>
              <template v-else>
                {{scope.row[item.value]}}
              </template>
            </span>
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
            <!--<el-button @click="handleDel(scope.$index,scope.row)" type="text" size="small" v-if="!table.delBool">{{ scope.row.state===true?'禁用':'启用' }}</el-button>-->
            <slot name="tableRight" :index="scope.$index" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div class="batch-operate-container">

        </div>
        <el-pagination small background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="pagination.page" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.count"
                       layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" v-if="!table.tablePagBool">
        </el-pagination>
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
            multipleSelection: [],
            disabledName: '', //禁用字段名
            disabledVals: [] //禁用字段值
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
          return {
          }
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
      }
    },
    data() {
      return {
        listLoading: false,
        tableDataList: [],
        operateType: null,
        multipleSelection: [],
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
      selectable(row) {
        if (this.table.disabledName) {
          if(this.table.disabledVals && this.table.disabledVals.length) {
            let vals = this.table.disabledVals;
            for (var i = 0; i < vals.length; i++) {
              if (vals[i] === row[this.table.disabledName]) {
                return false;
              }
            }
          }
          return true;
        }
        if (row.disabled === true) {
          return false;
        }
        return true;
      },
      handleSizeChange(val) {
        if (this.pagination.total) {
          this.pagination.count = val;
          if (!this.table.tableBool) {
            this.loadData();
          } else {
            this.getDataList()
          }
        }
      },
      handleCurrentChange(val) {
        if (this.pagination.total) {
          this.pagination.page = val;
          if (!this.table.tableBool) {
            this.loadData();
          } else {
            this.getDataList()
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
      handleBatchOperate(msg) {
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
        this.$plug.prompt.del(this.arrDel, ids, null, msg);
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
            this.getDataList();
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
          let _res = await this.getDataList(this.sortVals);
          if (_res === false) {
            this.listLoading = false;
            return false;
          }
          if (_res && _res.data) {
            if (_res.data.list) {
              this.tableDataList = _res.data.list;
              this.pagination.total = _res.data.count;
            } else if(_res.data.list + '' === 'null') {
              this.tableDataList = [];
            } else {
              this.tableDataList = [_res.data];
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
        this.$refs.multipleTable.clearSelection();
      }
    },
    watch: {
      'table.multipleSelection'(rows) {
        this.multipleSelection = rows;
      },
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
      },
      'table.disabledVals'(arr) {

      }
    },
    mounted() {
      this.bus();
      if (!this.table.tableBool) {
        this.loadData();
      }
    },
    destroyed() {
      bus.$off("loadDialogData");
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .el-pagination /deep/ .el-select {
    bottom: 3px;
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
  .tablesub-box{
    border-bottom: 1px solid #dfdfdf;
    background-color: #f3f3f3;
    .table-footer{
      display: flex;
      padding-top: 10px;
      padding-bottom: 7px;
      padding-right: 12px;
      justify-content: space-between;
      border-left: 1px solid #dfdfdf;
      border-right: 1px solid #dfdfdf;
    }
  }
</style>

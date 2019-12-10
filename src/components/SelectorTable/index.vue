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
  <el-row>
    <el-col :span="24">
      <el-table ref="multipleTable" :row-key="tableKeyFn" v-loading="listLoading" :header-cell-style="headerStyle" :data="tableDataList" border size="mini" style="width: 100%" :height="table.height" :max-height="table.maxHeight" 
                v-if="!table.tableBool" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" :cell-class-name="table.isHeightAuto ? 'cell-height' : ''">
        <el-table-column fixed="left" width="55" align="center" v-if="table.type === 'radio'" label="">
          <template slot-scope="scope">
           <el-radio v-model="singleSelected" :key="scope.row.id" :disabled="scope.row.disabled" :label="scope.row.id" @change="() => {singleSelect(scope.row, scope.$index);}">&nbsp</el-radio>
         </template>
        </el-table-column>
        <el-table-column :reserve-selection="table.reserveSelection || false" fixed="left" :type="table.type" width="55" align="center" v-else-if="table.type">
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
            <!--<el-button @click="handleDel(scope.$index,scope.row)" type="text" size="small" v-if="!table.delBool">{{ scope.row.state===true?'禁用':'启用' }}</el-button>-->

          </template>
        </el-table-column>
      </el-table>
      <el-pagination small background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.page" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.count"
                     layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
                     style="float:right;margin-top: 10px;" v-if="!table.tablePagBool">
      </el-pagination>
      <div class="batch-operate-container">

      </div>
    </el-col>
  </el-row>
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
            singleSelection: {}
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
      },
      disabledCheck: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        listLoading: false,
        tableDataList: [],
        operateType: null,
        multipleSelection: [],
        multipleSlected: [],
        singleSelection: {},
        singleSelected: ''
      }
    },
    methods: {
      headerStyle() {
        return {
          'padding': '12px 0',
          'font-size': '13px',
          'background-color': '#f9fafc'
        }
      },
      tableKeyFn(row) {
        return row.id;
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
      async handleCurrentChange(val) {
        let arr = this.multipleSlected.concat(this.multipleSelection);
        for (var i = 0; i < arr.length; i++) {
          for (var j = 0; j < arr.length; j++) {
            if (i !== j && JSON.stringify(arr[j]) == JSON.stringify(arr[i])) {
              arr.splice(i, 1);
              i --;
              break;
            }
          }
        }
        this.multipleSlected = arr;
        if (this.pagination.total) {
          this.pagination.page = val;
          if (!this.table.tableBool) {
            await this.loadData();
          } else {
            await this.getDataList()
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
        this.singleSelection = row;
        this.$emit("select", row);
        return true;
      },
      handleBatchOperate() {
        if (this.multipleSelection < 1 || !this.singleSelection.id) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (table.type === 'radio') {
          this.$plug.prompt.del(this.arrDel, this.singleSelection.id, null);
        } else {
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
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
          let _res = await this.getDataList();
          if (_res && _res.data) {
            if (_res.data.list) {

              let list = _res.data.list;
              this.pagination.total = _res.data.count;
              this.disabledCheck.forEach(item => {
                list.forEach((i, inx) => {
                  if (item.id == i.id) {
                    list[inx].disabeld = true;
                  }
                })
              });
              this.tableDataList = list;
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
        if (this.table.type === 'selection') {
          this.$refs.table && this.$refs.table.clearSelection();
          this.multipleSelection = [];
        } else {
          this.singleSelected = '';
          this.singleSelection = {};
        }
      }
    },
    watch: {
      'table.multipleSelection'(rows) {
        this.multipleSelection = JSON.parse(JSON.stringify(rows));
      },
      'table.singleSelection'(rows) {
        this.singleSelection = rows;
      },
      'dialog.ruleForm2'(row) {
        if (this.table.type === 'selection') {
          if (!(row instanceof Array)) {
            row = [];
          }
          row.forEach(item => {
            this.multipleSelection.push(item.id);
          })
        } else {
          this.singleSelected = row.id;
        }
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
      }
    },
    created() {
      this.bus();
      if (!this.table.tableBool) {
        this.loadData();
      }
    },
    mounted() {
      if (this.table.type) {
        this.singleSelected = this.dialog.ruleForm2.id;
      }
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
</style>

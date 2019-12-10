<template>
  <el-dialog
      width="1100px"
      maxHeight="600px"
      :title="dialog.titleText"
      :close-on-click-modal="true"
      :append-to-body="dialog.appendToBody===true"
      :visible.sync="dialog.innerVisible"
      append-to-body>
      <div class="check-module-box">
        <div class="filter-container">
          <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :pagination="pagination" :quickSearch="quickSearch" :searchBool="searchBool" :table="table" :dialog="dialog" :getDataList="getDataList" v-if="!searchBool">
          </search-sub>
          <selector-table ref="tableSub" :getDataList="getDataList" :disabledCheck="disabledCheck" :dialog="dialog" :table="table" @select="handleDelArr" :pagination="pagination">
             <template :slot="item.value" slot-scope="{index,row }" v-for="(item,index) in table.columns"
                      v-if="item.slotBool">
              <slot :name="item.value" :index="index" :row="row"></slot>
            </template>
            <template slot="isEnable" slot-scope="{index,row }">
              <el-tag :type="row.isEnable == 1 ? 'danger' : 'success'">
                {{row.isEnable == 1 ? '停用' : '启用'}}
              </el-tag>
            </template>
            <template slot="platformStatus" slot-scope="{index,row }">
              <el-tag :type="statusColor[row.platformStatus * 1 - 1]">
                {{storeStatus[row.platformStatus * 1 - 1]}}
              </el-tag>
            </template>
            <template slot="type" slot-scope="{index,row }">
                {{storeType[row.type - 1]}}
            </template>
            <template slot="bcRegisterType" slot-scope="{index,row }">
              {{registerType[row.bcRegisterType - 1]}}
            </template>
            <template slot="startTime" slot-scope="{index, row}">
              {{row.startTime}} - {{row.endTime}}
            </template>
          </selector-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelSave">取消</el-button>
        <el-button type="primary" size="small" @click="emitSave">确定</el-button>
      </div>
  </el-dialog>
</template>
<script>
  import SelectorTable from '@/components/SelectorTable'
  import SearchSub from '@/components/SearchSub'
  import {format} from "@/utils";

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {}
        }
      },
      tableType: {
        type: String,
        default() {
          return '';
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false;
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
        selection: [],
        innerVisible: false,
        sex: [{
          label: '男',
          value: '0'
        }, {
          label: '女',
          value: '1'
        }, {
          label: '未知',
          value: '2'
        }],
        storeParentCategory: [],
        storeCategory: [],
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'type',
            label: '',
            selected: this.$route.query.storeType || '',
            list: [{
              value: '1',
              label: '种子店'
            }, {
              value: '2',
              label: '特色店'
            }]
          }]
        },
        // storeCategory: [],
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: "名称/编码/账号"
        }, {
        //   value: 'merManagerSpreadId',
        //   label: '',
        //   name: '推广人',
        //   isText: true
        // }, {
        //   value: 'platformStatus',
        //   label: '',
        //   name: '店铺状态',
        //   isSelect: true,
        //   list: [{
        //       value: '1',
        //       label: '正常'
        //     }, {
        //       value: '2',
        //       label: '关闭'
        //     }, {
        //       value: '3',
        //       label: '冻结'
        //     }]
        // }, {
          value: 'time1',
          label: '',
          name: '创建时间',
          isTimeRange: true
        }],
        registerType: [
          '个体店铺',
          '企业'
        ],
        storeStatus: [
          '正常',
          '关闭',
          '冻结'
        ],
        statusColor: ['success', '', 'danger'],
        storeType: [
          '种子店',
          '特色店'
        ],
        table: {
          width: '200px',
          reserveSelection: true,
          btn: true,
          addBool: true,
          delBool: true,
          type: 'radio',
          emitDetailBool: true,
          multipleSelection: [],
          singleSelection: {},
          columns: [{
            value: 'code',
            label: '店铺编号',
            width: '150'
          }, {
            value: 'nickName',
            label: '店铺名称',
            width: '140'
          }, {
            value: 'name',
            label: '工商注册名称',
            width: '140'
          }, {
            value: 'phone',
            label: '联系电话',
            width: '140',
          }, {
            value: 'startTime',
            label: '营业时间',
            slotBool: true,
            width: '100'
          }, {
            value: 'isEnable',
            label: '是否启用',
            slotBool: true,
            width: '140'
          }, {
            value: 'platformStatus',
            label: '店铺状态',
            slotBool: true,
            width: '140'
          }, {
            value: 'type',
            label: '店铺类型',
            slotBool: true,
            width: '120'
          }, {
            value: 'bcRegisterType',
            label: '工商注册类型',
            slotBool: true,
            width: '120'
          }, {
            value: 'address',
            label: '地址',
            width: '100'
          }, {
            value: 'createTime',
            label: '创建时间',
            width: '100'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
      }
    },
    watch: {
      'tableType': function(type) {
        this.table.type = type;
      }
    },
    components: {
      SearchSub,
      SelectorTable
    },
    methods: {
      // getParentId(categoryId, source) {
      //   let category = [];
      //   let parentId = '';
      //   for (var i = 0; i < source.length; i++) {
      //     if (source[i].id === categoryId) {
      //       category.push(source[i].id);
      //       if (source[i].parentId) {
      //         parentId = source[i].parentId;
      //       }
      //       break;
      //     }
      //   }
      //   if (parentId) {
      //     let c2 =  this.getParentId(parentId, source);
      //     category = c2.concat(category);
      //   }
      //   return category;
      // },
      async getDataList() { //获取店铺列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected || item.selected === 0) {
              quick[item.value] = item.selected;
            }
          })
        }
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          queryPo.createStartTime = queryPo.time1[0];
          queryPo.createEndTime = queryPo.time1[1];
        }
        return await this.Api.getStoreList(Object.assign({
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          searchParameter,
          isEnable: 0,
          platformStatus: '1'
        }, quick, queryPo));
      },
      cancelSave() {
        this.dialog.innerVisible = false;
      },
      emitSave() {
        if (this.table.type === 'selection') {
          if (!this.table.multipleSelection || !this.table.multipleSelection.length) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          let names = this.table.multipleSelection.forEach(item => {
            return item.name;
          })
          // this.dialog.names = names.join(',');
          this.$emit("submit", this.table.multipleSelection, 3);
        } else {
          if (!this.table.singleSelection || !this.table.singleSelection.id) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          // this.dialog.names = this.table.singleSelection.name;
          this.$emit("submit", this.table.singleSelection, 3);
        }
        this.dialog.innerVisible = false;
      },
      async handleDelArr(row) {
        if (this.table.type === 'selection') {
          this.table.multipleSelection = Object.assign([], this.dialog.ruleForm2, row);
        } else {
          this.table.singleSelection = Object.assign({}, this.dialog.ruleForm2, row);
        }
        // this.$emit("submit", row, 3);
      },
      clearSelect() {
        this.dialog.ruleForm2 = {};
        this.dialog.names = '';
        this.table.multipleSelection = [];
        this.table.multipleSelected = [];
        this.table.singleSelection = {};
        this.table.singleSelected = '';
        // this.$refs.tableSub.clearSelection();
        if (this.$refs.tableSub && this.$refs.tableSub.$refs.multipleTable) {
          this.$refs.tableSub.$refs.multipleTable.clearSelection();
        }
      }

    },
    created() {
      this.table.type = this.tableType;
    },
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.check-module-box{
  width: 100%;
}
</style>

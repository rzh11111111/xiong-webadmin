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
          <!--搜索-->
      <search-sub :timeRangeVal="['time1', 'time2']" :quickSearch="quickSearch"
        :searchObj="searchObj"
        :getDataList="getDataList"
        :searchBool="searchBool"
        :dialog="dialog"
        :pagination="pagination"
      ></search-sub>
      <!--表格-->
      <selector-table ref="tableSub" :getDataList="getDataList" :disabledCheck="disabledCheck" :dialog="dialog" :table="table" @select="handleDelArr" :pagination="pagination">
        <template v-for="item in fixedData" :slot="item.value" slot-scope="{index,row }">
          <span v-for="type in item.list" :key="type.label" v-if="type.value === row[item.value]">
            {{type.label}}
          </span>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="content" slot-scope="{ index,row }">
          <el-popover
            placement="top"
            trigger="hover"
            popper-class="tootip-box"
            :content="row.content">
            <p class="ellipsis" slot="reference">{{row.content}}</p>
          </el-popover>
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
import SearchSub from "@/components/SearchSub";
import { format } from "@/utils";

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
      quickSearch: {
        isShow: true
      },
      fixedData: [
        {
          label: "发送平台",
          value: "platformType",
          list: [
            {
              label: "全部",
              value: 1
            },
            {
              label: "消费者端",
              value: 2
            },
            {
              label: "商户端",
              value: 3
            },
            {
              label: "企业端",
              value: 4
            },
            {
              label: "管理端",
              value: 5
            }
          ]
        },
        {
          label: "消息类型",
          value: "type",
          list: [
            {
              label: "站内通知",
              value: 1
            },
            {
              label: "消息推送",
              value: 2
            },
            {
              label: "时效消息",
              value: 3
            }
          ]
        }, {
          label: '内容类型',
          value: 'contentType',
          list: [{
            label: '活动通知',
            value: 1
          }, {
            label: '平台公告',
            value: 2
          }, {
            label: '账户通知',
            value: 3
          }]
        }
      ],
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: "",
          name: "关键字",
          isText: true,
          placeholder: '编码/发送平台/消息类型/消息标题'
        },
        {
          isDate: true,
          value: "time1",
          label: "",
          name: "创建开始时间"
        },
        {
          isDate: true,
          value: "time2",
          label: "",
          name: "创建结束时间"
        }
      ],

      table: {
        width: "200px",
        reserveSelection: true,
        emitEditBool: true,
        arrDelBool: true,
        editBool: true,
        btn: true,
        multipleSelection: [],
        singleSelection: {},
        columns: [
          {
            value: "code",
            label: "消息编码",
            width: "150"
          },
          {
            value: "platformType",
            label: "发送平台",
            slotBool: true,
            width: "120"
          },
          {
            value: "type",
            label: "消息类型",
            slotBool: true,
            width: "120"
          },
          {
            value: "title",
            label: "消息标题",
            width: "120"
          },
          {
            value: "contentType",
            label: "内容类型",
            slotBool: true,
            width: "120"
          },
          {
            value: "content",
            label: "消息内容",
            slotBool: true,
            width: "120"
          }
        ]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      }
    };
  },
  components: {
    SearchSub,
    SelectorTable
  },
  watch: {
    'tableType': function(type) {
      this.table.type = type;
    }
  },
  methods: {
    async getDataList() {
      //获取列表
      let queryPo = this.$plug.public.transformSearchData.call(
        this,
        this.searchObj
      );
      let searchParameter = {
        keyWord: queryPo.keyWord
      };
      if (queryPo && queryPo.time1) {
        searchParameter.starTime = queryPo.time1;
      }
      if (queryPo && queryPo.time2) {
        searchParameter.endTime = queryPo.time2;
      }
      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter: searchParameter
      };
      return await this.Api.getMessage(para);
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
        let names = this.table.multipleSelection.map(item => {
          return item.name;
        })
        // this.dialog.names = names.join(',');
        this.$emit("submit", this.table.multipleSelection, 8);
      } else {
        if (!this.table.singleSelection || !this.table.singleSelection.id) {
          this.$message.error('请至少选择一条数据');
          return ;
        }
        // this.dialog.names = this.table.singleSelection.name;
        this.$emit("submit", this.table.singleSelection, 8);
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
      if (this.$refs.tableSub && this.$refs.tableSub.$refs.multipleTable) {
        this.$refs.tableSub.$refs.multipleTable.clearSelection();
      }
    }

  },
  created() {
    this.table.type = this.tableType;
  },
  computed: {},
  async mounted() {}
};
</script>
<style type="text/scss" lang="scss" scoped>
.check-module-box{
  width: 100%;
}
</style>

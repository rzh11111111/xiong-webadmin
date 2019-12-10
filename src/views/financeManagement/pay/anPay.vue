<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <!-- <search-sub :tableTree="tableTree" :getDataList="getDataList" :searchBool="searchBool"></search-sub> -->
      <!--树列表-->
      <tree-table
        :data="treeTableList"
        :columns="columns"
        border
        v-loading="listLoading"
        ref="tree"
      >
        <el-table-column label="子账户属性" align="center" width="135">
          <template slot-scope="{ index,row }">
            <span>{{returnType(row.SubAcctProperty)}}</span>
          </template>
        </el-table-column>
      </tree-table>
    </div>
  </div>
</template>
<script>
import treeTable from "@/components/TreeTable";
import SearchSub from "@/components/SearchSub";
import { format } from "../../../utils";

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
          label: "子账户名",
          value: "SubAcctName",
          width: 140
        },
        {
          label: "子账号",
          width: 140,
          value: "SubAcctNo"
        },
        {
          label: "账户可用余额",
          width: 110,
          value: "AcctAvailBal"
        },
        {
          label: "可提现金额",
          width: 100,
          value: "CashAmt"
        },
        {
          label: "维护日期",
          width: 100,
          value: "MaintenanceDate"
        },
        {
          label: "交易网会员代码",
          width: 140,
          value: "TranNetMemberCode"
        }
      ],
      listLoading: false,
      treeTableList: [],
      optionsStaff: [],
      staffObj: {},
      pagination: {
        page: 1,
        count: 10,
        total: 0
      }
    };
  },
  components: {
    treeTable,
    SearchSub
  },
  methods: {
    async getDataList(row) {
      let resData = await this.Api.payStoreSonmoney({
        type: 3,
        pageNumber: 1
      });

      this.treeTableList = resData.data.returnList;
      return resData;
    },
    returnType(type) {
      switch (type) {
        case '1':
          return '普通会员子账号';
        case '2':
          return '挂账子账号';
        case '3':
          return '手续费子账号';
        case '4':
          return '利息子账号';
        case '5':
          return '平台担保子账号';
        default:
          return '无'
      }
    },
  },
  async mounted() {
    this.getDataList();
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.box-card {
  padding-top: 20px;
  margin-bottom: 20px;
}
</style>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div>
        <h3 class="title">会员红包账户明细</h3>
        <el-button class="go-back" size="mini" @click="goBack">返回</el-button>
      </div>
      <!--表格-->
      <table-sub
        ref="tableSub"
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination"
      >
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
        <template slot="money" slot-scope="{ index,row }">
          <span v-if="!!row.memberLuckmoneyAccount">{{row.memberLuckmoneyAccount.money}}</span>
        </template>
      </table-sub>
    </div>
  </div>
</template>
<script>
import TableSub from "@/components/TableSub";
import SearchSub from "@/components/SearchSub";
import DialogSub from "@/components/DialogSub";
// import { format } from "../../utils";
import {format, parseQueryString} from "../../../utils";

export default {
  data() {
    return {
      fixedData: [
        {
          label: "增减类型",
          value: "type",
          list: [
            {
              label: "增加",
              value: 1
            },
            {
              label: "减少",
              value: 2
            }
          ]
        },
        {
          label: "账户类型",
          value: "accountType",
          list: [
            {
              label: "可用账户",
              value: 1
            },
            {
              label: "冻结账户",
              value: 2
            },
            {
              label: "提现中账户",
              value: 3
            },
            {
              label: "不可用账",
              value: 4
            }
          ]
        },
        {
          label: "变更业务类型",
          value: "serviceType",
          list: [
            {
              label: "注册",
              value: 1
            },
            {
              label: "消费",
              value: 2
            }
          ]
        }
      ],
      quickSearch: {
        isShow: true
      },
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: "",
          name: "关键字",
          isText: true
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
        btn: true,
        arrDelBool: true,
        delBool: true,
        editBool: true,
        detailBool: false,
        columns: [{
          value: 'code',
          label: '编号',
          width: '100'
        }, {
          value: 'code',
          label: '订单编号',
          width: '100'
        }, {
          value: 'num',
          label: '资金变更',
          width: '80',
          // slotBool: true
        }, {
          value: 'money',
          label: '变更前资金',
          width: '100',
          slotBool: true
        }, {
          value: 'numAfter',
          label: '变更后资金',
          width: '100'
        }, {
          value: 'createTime',
          label: '变更时间',
          width: '140'
        }, {
          value: 'summary',
          label: '备注',
          width: '150'
        }]
      },

      dialog: {
        btnText: "",
        titleText: "",
        readBool:false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        addBool:true,
        ruleForm2: {
        },
        rules2: {
        }
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      }
    }
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getDataList() {
      //获取列表
      let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
      let searchParameter = {
        keyWord: queryPo.keyWord
      }
      let memberLuckmoneyAccount = {
        id: this.query.id
      }
      if (queryPo && queryPo.time1) {
        searchParameter.starTime = format(
          new Date(queryPo.time1),
          "yyyy-MM-dd hh:mm:ss"
        )
      }
      if (queryPo && queryPo.time2) {
        searchParameter.endTime = format(
          new Date(queryPo.time2),
          "yyyy-MM-dd hh:mm:ss"
        )
      }
      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter,
        memberLuckmoneyAccount,
        ...queryPo
      };
      let resData = await this.Api.getMemberLuckmoneyAccountRecord(para);

      return resData;
    }
  },
  created() {
    let obj = parseQueryString(location.hash.split('?')[1]);
    this.query = obj || {};
  },
  computed: {},
  mounted() {
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.box-card {
  padding-top: 20px;
}
.filter-container {
  position: relative;
  .title {
    float: left;
    margin-left: 10px;
  }
  .go-back{
    float: right;
    margin: 10px;
    width: 100px;
    height: 40px;
  }
}
</style>

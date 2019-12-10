<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  ></search-sub>
      <!--表格-->
      <table-sub
        ref="tableSub"
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination">
        <template slot="memberCode" slot-scope="{ index,row }">
          <span v-if="!!row.member">{{row.member.code}}</span>
        </template>
        <template slot="memberNickName" slot-scope="{ index,row }">
          <span v-if="!!row.member">{{row.member.nickname}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <el-switch
            :value="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="handleStatus(row)">
          </el-switch>
        </template>
        <template slot="money" slot-scope="{ index,row }">
          <span>{{(row.money/100)|currency}}</span>
        </template>
        <template slot="moneyFreeze" slot-scope="{ index,row }">
          <span>{{(row.moneyFreeze/100)|currency}}</span>
        </template>
        <template slot="moneyExtract" slot-scope="{ index,row }">
          <span>{{(row.moneyExtract/100)|currency}}</span>
        </template>
        <template slot="moneyDisable" slot-scope="{ index,row }">
          <span>{{(row.moneyDisable/100)|currency}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{index, row}">
          <el-dropdown size="mini" split-button @click.stop="handleDetail(row)">
            <span class="el-dropdown-link">
              详细信息
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleSettlement(row)">结算单</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleBalance(row)">收支明细</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleWithdraws(row)">提现记录</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <!-- <dialog-sub :dialog="dialog" :getDataList="getDataList">
        <template slot="dialog">
          <el-form-item label="会员账号" prop="username">
            <el-input v-model="dialog.ruleForm2.username" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="可用红包余额" prop="money">
            <el-input v-model="dialog.ruleForm2.money" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="冻结红包金额" prop="moneyFreeze">
            <el-input v-model="dialog.ruleForm2.moneyFreeze" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="提现中红包金额" prop="moneyExtract">
            <el-input v-model="dialog.ruleForm2.moneyExtract" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="不可用红包金额" prop="moneyDisable">
            <el-input v-model="dialog.ruleForm2.moneyDisable" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="会员" prop="createTime">
            <el-input v-model="dialog.ruleForm2.createTime" :disabled="dialog.readBool"></el-input>
          </el-form-item>
        </template>
      </dialog-sub> -->
      <!-- 会员详情 -->
      <dialog-sub :dialog="memberDialog">
        <template slot="dialog">
          <member-info :dialog="memberDialog" v-if="memberDialog.saveFormVisible"></member-info>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
import TableSub from "@/components/TableSub";
import DialogSub from "@/components/DialogSub";
import SearchSub from "@/components/SearchSub";
import { format } from "../../../utils";
import bus from '@/utils/bus.js';
import {currency} from "@/filters";
import memberInfo from '../../memberManagement/memberInfo';

export default {
  data() {
    let status = [{
      value: 1,
      label: '正常'
    }, {
      value: 2,
      label: '冻结'
    }];
    return {
      status,
      query: {},
      fixedData: [
        {
          label: " 状态",
          value: "status",
          list: [
            {
              label: "正常",
              value: 1
            },
            {
              label: "冻结",
              value: 2
            }
          ]
        }
      ],
      quickSearch: {
        isShow: true,
        hideTime: true,
        group: [{
          value: 'status',
          label: null,
          selected: null,
          list: status
        }]
      },
      searchBool: false,
      searchObj: [{
        value: "keyWord",
        label: "",
        name: "关键词搜索",
        placeholder: "登录名/会员编码/会员昵称",
        isText: true
      }],

      table: {
        arrDelBool: true,
        delBool: true,
        editBool: true,
        detailBool: false,
        columns: [{
          value: 'memberCode',
          label: '会员编码',
          width: '140',
          slotBool: true
        }, {
          value: 'username',
          label: '登录名',
          width: '100'
        }, {
          value: 'memberNickName',
          label: '会员昵称',
          width: '120',
          slotBool: true
        }, {
          value: 'moneyDisable',
          label: '入帐中',
          width: '100',
          slotBool: true
        }, {
          value: 'moneyFreeze',
          label: '冻结',
          width: '100',
          slotBool: true
        }, {
          value: 'moneyExtract',
          label: '提现中',
          width: '120',
          slotBool: true
        }, {
          value: 'money',
          label: '可提现',
          width: '120',
          slotBool: true
        }, {
          value: 'status',
          label: '状态',
          width: '100',
          slotBool: true
        }, {
          value: 'createTime',
          label: '创建时间',
          width: '140'
        }]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
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
      memberDialog: {
        saveFormVisible: false,
        width: '1000px',
        shopType: 2,
        btnBool: true,
        cancelBtnBool: true,
        closeBtnBool: true
      }
    }
  },
  filters: {
    currency: currency
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub,
    memberInfo
  },
  methods: {
    async getDataList() {
      //获取列表
      let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
      let searchParameter = {
        keyWord: queryPo.keyWord
      }
      let quick = {};
      if (this.quickSearch && this.quickSearch.group) {
        this.quickSearch.group.map(item => {
          if (item.selected || item.selected === 0) {
            quick[item.value] = item.selected;
          }
        })
      }
      if(this.$route.query.username){
        searchParameter.keyWord = this.$route.query.username;
      }
      let para = Object.assign({
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter
      }, queryPo,quick);

      let resData = await this.Api.getMemberLuckmoneyAccount(para);
      return resData;
    },
    handleDetail(row) {
      this.memberDialog.id = row.member.id;
      this.memberDialog.saveFormVisible = true;
      // this.$router.push({path: '/member/memberDetails', query: {id: params.id}});
    },
    handleAccountRecord(row) {
      this.$router.push({path: '/finance/account/memberLuckmoneyRecord', query: {id: row.id}});
    },
    handleBalance(row) {
      this.$router.push({path: '/finance/balance/redpackets', query: {code: row.member ? row.member.code : ''}});
    },
    handleSettlement(row) {
      this.$router.push({path: '/finance/settlement/redpackets', query: {code: row.member ? row.member.code : ''}});
    },
    handleWithdraws(row) {
      this.$router.push({path: '/finance/withdraws/member', query: {code: row.member ? row.member.code : ''}});
    },
    handleStatus(row) {
      this.$plug.prompt.del(this.changeStatus, {id: row.id}, null, row.status == 2 ? '解冻账户' : '冻结账户');
    },
    async changeStatus(params) {
      let res = await this.Api.findMemberLuckmoneyAccountStatus(params);
      if (res.status === 1) {
        bus.$emit('loadDialogData');
      }
    },
    created() {
      this.query = this.$route.query || {};
    }
  },
  computed: {},
  async mounted() {}
};
</script>
<style type="text/scss" lang="scss" scoped>
.box-card {
  padding-top: 20px;
}
</style>

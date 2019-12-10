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
        :pagination="pagination"
      >
        <template slot="phone" slot-scope="{ index,row }">
          <span>{{row.member==null?'':row.member.phone}}</span>
        </template>
        <template slot="integralFreeze" slot-scope="{ index,row }">
          <span>{{(row.integralFreeze/100)|currency}}</span>
        </template>
        <template slot="integral" slot-scope="{ index,row }">
          <span>{{(row.integral/100)|currency}}</span>
        </template>
        <template slot="integralMax" slot-scope="{ index,row }">
          <span>{{(row.integralMax/100)|currency}}</span>
        </template>
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
        <template slot="status" slot-scope="{ index,row }">
          <el-switch
            :value="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="handleStatus(row)">
          </el-switch>
        </template>
        <!-- <template slot="table" slot-scope="{index, row}">
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
            </el-dropdown-menu>
          </el-dropdown>
        </template> -->
        <template slot="table" slot-scope="{ index,row }">
          <el-button @click="handleDetail(row)" type="text" size="small">详细信息</el-button>
          <el-button @click="handleBalance(row)" type="text" size="small">收支明细</el-button>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <!-- <dialog-sub :dialog="dialog" :getDataList="getDataList">
        <template slot="dialog">
          <el-form-item label="会员账号" prop="username" v-if="dialog.readBool">
            <el-input v-model="dialog.ruleForm2.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="积分余额" prop="integral">
            <el-input v-model="dialog.ruleForm2.integral" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="冻结积分账户余额" prop="integralFreeze">
            <el-input v-model="dialog.ruleForm2.integralFreeze" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="历史积分总额" prop="integralMax">
            <el-input v-model="dialog.ruleForm2.integralMax" :disabled="dialog.readBool"></el-input>
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
    return {
      query: {},
      fixedData: [
        {
          label: "状态",
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
        hideTime: true
      },
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: "",
          name: "关键字",
          isText: true
        }
      ],

      table: {
        arrDelBool: true,
        delBool: true,
        editBool: true,
        detailBool: false,
        columns: [{
          value: 'memberCode',
          label: '会员编码',
          width: '120'
        }, {
          value: 'phone',
          label: '手机号',
          width: '100',
          slotBool: true
        }, {
          value: 'integralFreeze',
          label: '冻结积分余额',
          width: '120',
          slotBool: true
        }, {
          value: 'integral',
          label: '可用积分余额',
          width: '120',
          slotBool: true
        }, {
          value: 'integralMax',
          label: '累计积分总额',
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
      // if (queryPo && queryPo.time1) {
      //   searchParameter.starTime = format(
      //     new Date(queryPo.time1),
      //     "yyyy-MM-dd hh:mm:ss"
      //   )
      // }
      // if (queryPo && queryPo.time2) {
      //   searchParameter.endTime = format(
      //     new Date(queryPo.time2),
      //     "yyyy-MM-dd hh:mm:ss"
      //   )
      // }
      if(this.$route.query.username){
        searchParameter.keyWord = this.$route.query.username;
      }
      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter,
        ...queryPo
      };

      let resData = await this.Api.getMemberIntegral(para);
      resData.data.list.map(item => {
        item.memberCode = item.member.code;
        item.memberNickName = item.member.nickName;
      });
      return resData;
    },
    handleDetail(row) {
      this.memberDialog.id = row.member.id;
      this.memberDialog.saveFormVisible = true;
      // this.$router.push({path: '/member/memberDetails', query: {id: params.id}});
    },
    handleAccountRecord(row) {
      this.$router.push({path: '/member/memberIntegralRecord', query: {id: row.id}});
    },
    // handleSettlement(row) {
    //   this.$router.push({path: '/finance/settlement/score/', query: {code: row.member ? row.member.code : ''}});
    // },
    handleBalance(row) {
      this.$router.push({path: '/finance/balance/score', query: {code: row.member ? row.member.code : ''}});
    },
    handleStatus(row) {
      this.$plug.prompt.del(this.changeStatus, {id: row.id}, null, row.status == 2 ? '解冻账户' : '冻结账户');
    },
    async changeStatus(params) {
      let res = await this.Api.findMemberIntegralStatus(params);
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

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :timeRangeVal="['time1']" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  ></search-sub>
      <!--表格-->
      <table-sub
        ref="tableSub"
        @detail="handleDetail"
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination"
      >
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{ index,row }">
          <el-button @click="handleDetail(row)" type="text" size="small">查看详情</el-button>
          <el-button @click="handleLowerLevel(row)" type="text" size="small">下级用户</el-button>
        </template>
        <template slot="money" slot-scope="{ index,row }">
          <span v-if="!!row.memberLuckmoneyAccount">{{row.memberLuckmoneyAccount.money/100}}</span>
        </template>
        <template slot="integral" slot-scope="{ index,row }">
          <span v-if="!!row.memberIntegralAccount">{{row.memberIntegralAccount.integral/100}}</span>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList">
        <template slot="dialog">
          <el-table
            :data="dialog.membersList"
            border
            style="width: 100%">
            <el-table-column
              prop="code"
              label="会员编码"
              width="150">
            </el-table-column>
            <el-table-column
              prop="username"
              label="会员帐号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="会员昵称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="注册时间"
              width="180">
            </el-table-column>
          </el-table>
          <el-pagination small background :current-page="pagination2.page" :page-sizes="[10, 20, 30, 40]" :page-size="pagination2.count"
                        layout="total, sizes, prev, pager, next, jumper" :total="pagination2.total"
                        style="float:right;margin-top: 10px;">
          </el-pagination>
        </template>
      </dialog-sub>
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
import { format } from "../../utils";
import memberInfo from './memberInfo';

export default {
  data() {
    return {
      quickSearch: {
        isTimeRange: true,
        isShow: true
      },
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: "",
          name: "关键字",
          isText: true,
          placeholder: "编码/手机号"
        },
        {
          value: 'time1',
          label: '',
          name: '创建时间',
          isTimeRange: true
        }
      ],

      table: {
        arrDelBool: true,
        delBool: true,
        editBool: true,
        detailBool: false,
        columns: [{
          value: 'code',
          label: '会员编码',
          width: '140'
        }, {
          value: 'nickname',
          label: '会员昵称',
          width: '120'
        }, {
          value: 'phone',
          label: '会员手机号码',
          width: '140'
        }, {
          value: 'createTime',
          label: '注册时间',
          width: '140',
          sortable: true
        }, {
          value: 'money',
          label: '可用红包',
          width: '120',
          slotBool: true
        }, {
          value: 'integral',
          label: '可用积分',
          width: '120',
          slotBool: true
        }]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      },
      pagination2: {
        page: 1,
        count: 10,
        total: 0
      },
      dialog: {
        addBool: true,
        btnBool: true,
        width: '750px',
        saveFormVisible: false,
        type: 'permission',
        membersList: [],
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
  components: {
    DialogSub,
    SearchSub,
    TableSub,
    memberInfo
  },
  methods: {
    async getDataList(sortObj) {
      //获取列表
      let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
      let searchParameter = {
        keyWord: queryPo.keyWord
      }
      if (queryPo.time1) {
        searchParameter.starTime = queryPo.time1[0];
        searchParameter.endTime = queryPo.time1[1];
        delete queryPo.time1;
      }
      let sorts;
      if(sortObj.isSort === true) {
        console.log("param",sortObj);
        if(sortObj.order == 'ascending'){
          if(sortObj.prop == 'createTime'){
            sorts = 'createTimeAsc';
          }
        }else{
          if(sortObj.prop == 'createTime'){
            sorts = 'createTimeDesc';
          }
        }
      }
      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          orderBy: sorts
        },
        searchParameter,
        ...queryPo
      };
      return await this.Api.getMember(para);
    },
    handleDetail(row) {
      this.memberDialog.id = row.id;
      this.memberDialog.saveFormVisible = true;
      // this.$router.push({path: '/member/memberDetails', query: {id: params.id}});
    },
    async handleLowerLevel(row) {
      this.dialog.saveFormVisible = true;
      let resData = await this.Api.getMemberInviteRecord({inviteMember: {
        code: row.code
      }})
      this.dialog.membersList = resData.data.list
      resData.data.list.map(item => {
        item.code = item.member.code;
        item.username = item.member.username;
        item.nickname = item.member.nickname;
        item.createTime = item.member.createTime;
      });
      this.pagination2.total = this.dialog.membersList.length
    },
    async getInfo(id) {
      let res = await this.Api.findMember({id});
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
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

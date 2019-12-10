<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool"
                  :dialog="dialog">
      </search-sub>
      <!--表格-->
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="code" slot-scope="{ index,row }">
          <span v-if="!!row.member">{{row.member.code}}</span>
        </template>
        <template slot="username" slot-scope="{ index,row }">
          <span v-if="!!row.member">{{row.member.username}}</span>
        </template>
        <template slot="nickname" slot-scope="{ index,row }">
          <span v-if="!!row.member">{{row.member.nickname}}</span>
        </template>
        <template slot="inviteMember" slot-scope="{ index,row }">
          <span v-if="!!row.inviteMember">{{row.inviteMember.code}}/{{row.inviteMember.nickname}}</span>
        </template>
        <!-- <template slot="lowerLevel" slot-scope="{ index,row }">
          <el-button @click="handleLowerLevel(row)" type="text" size="small">查看</el-button>
        </template> -->
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
          <el-pagination small background :current-page="pagination.page" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.count"
                        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
                        style="float:right;margin-top: 10px;">
          </el-pagination>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
import TableSub from "@/components/TableSub";
import DialogSub from "@/components/DialogSub";
import SearchSub from "@/components/SearchSub";
import { format } from "@/utils";
import bus from '@/utils/bus.js'

export default {
  data() {
    return {
      // memberUsername,
      // memberCode,
      quickSearch: {
        isShow: false
      },
      searchBool: false,
      searchObj: [
        {
          value: "memberUsername",
          label: "",
          name: "被邀请人用户名",
          isText: true
        },
        {
          value: "memberCode",
          label: "",
          name: "被邀请人编码",
          isText: true
        }
      ],

      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: true,
        detailBool: false,
        arrDelBool: true,
        btn: true,
        columns: [
          {
            value: "code",
            label: "会员编码",
            width: "140",
            slotBool: true
          },
          {
            value: "username",
            label: "会员帐号",
            width: "120",
            slotBool: true
          },
          {
            value: "nickname",
            label: "会员昵称",
            width: "100",
            slotBool: true
          },
          {
            value: "inviteMember",
            label: "上级用户",
            width: "120",
            slotBool: true
          },
          // {
          //   value: "lowerLevel",
          //   label: "下级用户",
          //   width: "100",
          //   slotBool: true
          // }
        ]
      },

      pagination: {
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
    }
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub
  },
  methods: {
    async getDataList() {
      //获取列表
      let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
      let searchParameter = {
        keyWord: queryPo.keyWord
      }
      let member = {
        username: queryPo.memberUsername,
        code: queryPo.memberCode
      }
      let quick = {};
      if (this.quickSearch && this.quickSearch.group) {
        this.quickSearch.group.map(item => {
          if (item.selected || item.selected === 0) {
            quick[item.value] = item.selected;
          }
        })
      }
      let para = Object.assign({
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter,
        member
      }, quick);
      let resData = await this.Api.getMemberInviteRecord(para);
      return resData;
    },
    // async handleLowerLevel(row) {
    //   this.dialog.saveFormVisible = true;
    //   let resData = await this.Api.getMemberInviteRecord({inviteMember: {
    //     code: row.inviteMember.code
    //   }})
    //   this.dialog.membersList = resData.data.list
    //   resData.data.list.map(item => {
    //     item.code = item.member.code;
    //     item.username = item.member.username;
    //     item.nickname = item.member.nickname;
    //     item.createTime = item.member.createTime;
    //   });
    // },
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

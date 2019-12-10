<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd"></search-sub>
      <!--表格-->
      <table-sub
        ref="tableSub"
        @detail="handleDetail"
        @submit="handleSave"
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination"
      >
        <template slot="isRead" slot-scope="{ index,row }">
          <el-tag :type="returnTagValue(row.isRead)">{{returnTypeValue(row.isRead)}}</el-tag>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td>会员：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.member.id" filterable placeholder="请选择" :disabled="dialog.readBool">
                <el-option v-for="item in optionsService" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>消息：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.message.id" filterable placeholder="请选择" :disabled="dialog.readBool">
                <el-option v-for="item in optionsMessage" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>是否已读：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isRead" :disabled="dialog.readBool">
                <el-radio border :label="0">未读</el-radio>
                <el-radio border :label="1">已读</el-radio>
              </el-radio-group>
            </td>
          </tr>
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
import bus from '../../utils/bus.js'
export default {
  data() {
    return {
      quickSearch: {
        hideTime: true,
        isShow: true,
        group: [{
          value: 'isRead',
          label: '',
          selected: '',
          list: [{
            label: '未读',
            value: 0
          }, {
            label: '已读',
            value: 1
          }]
        }]
      },
      searchBool: true,
      searchObj: [{}],

      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: true,
        detailBool: true,
        arrDelBool: true,
        editBool: true,
        delBool: true,
        columns: [
          {
            value: "memberName",
            label: "会员",
            width: "100"
          },
          {
            value: "messageTitle",
            label: "消息标题",
            width: "150"
          },
          {
            value: "isRead",
            label: "是否已读",
            width: "140",
            slotBool: true
          },
          {
            value: "readTime",
            label: "阅读时间",
            width: "100"
          }
        ]
      },

      optionsService:[],
      optionsMessage:[],
      pagination: {
        page: 1,
        count: 10,
        total: 0
      },

      dialog: {
        btnText: "创建消息",
        titleText: "新增消息",
        readBool:false,
        width: "500px",
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        isTable: true,

        ruleForm2: {
          member: {
            id: ''
          },
          message: {
            id: ''
          },
          isRead: 0,
          readTime: ""
        },
        rules2: {
          member: this.$plug.valid.isNull(),
          message: this.$plug.valid.isNull()
        }
      }
    }
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub
  },
  methods: {
    async getDataList() {
      let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
      let searchParameter = {keyWord: queryPo.keyWord};
      let quick = {};
      if (this.quickSearch && this.quickSearch.group) {
        this.quickSearch.group.map(item => {
          quick[item.value] = item.selected;
        })
      }
      let para = Object.assign({}, queryPo, quick, {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter
      })
      let resData = await this.Api.getMemberMessage(para);
      resData.data.list.map(item => {
        if (item.member == null) {
          item.member = { id: "" };
        }
        item.memberName = item.member.username;
        if (item.message == null) {
          item.message = { id: "" };
        }
        item.messageTitle = item.message.title;
      });

      return resData;
    },
    // 显示新增界面
    handleAdd() {
      this.dialog.titleText = "新增消息";
      this.dialog.saveFormVisible = true;
      this.dialog.ruleForm2.member.id = '';
      this.dialog.ruleForm2.message.id = '';
      if (!this.memberList || !this.memberList.length) {
        this.getMemberList();
      }
      if (!this.msgList || !this.msgList.length) {
        this.getMessageList();
      }
    },
    handleDetail(params) {
      this.dialog.titleText = "查看消息";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
      this.getInfo(params.id);
      if (!this.memberList || !this.memberList.length) {
        this.getMemberList();
      }
      if (!this.msgList || !this.msgList.length) {
        this.getMessageList();
      }
    },
    async getInfo(id) {
      let res = await this.Api.getMemberMessageDetail({id});
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    async getMemberList() {
      let res = await this.Api.getMember({});
      if (res.status == 1 && res.data) {
        this.memberList = res.data.list || [];
      }
    },
    async getMessageList() {
      let res = await this.Api.getMessageTemplate({});
      if (res.status == 1 && res.data) {
        this.msgList = res.data || [];
      }
    },
    // 新增修改
    async handleSave(row, savePrompt) {
      if(row.isRead){
        row.readTime = format(
          new Date(row.readTime),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      if (!row.id) {
        savePrompt(this.Api.saveMemberMessage, row);
      } else {
        //savePrompt(this.Api.updateServiceConfig, row);
      }
    },
    // 标记已读
    async handleIsRead(row) {
      this.$plug.prompt.del(this.saveIsRead, row, null, '将消息标为已读');
    },
    async saveIsRead(row) {
      let res = await this.Api.readMemberMessage({
        'id': row.id
      });
      if (res.status == 1) {
        this.$message({
          type: 'success',
          message: '操作成功'
        });
        bus.$emit("loadDialogData");
      } else {
        this.$message({
          type: 'error',
          message: '操作失败'
        });
      }
    },
    returnTypeValue(type) {
      switch (type) {
        case 0:
          return '未读';
        case 1:
          return '已读';
        default:
          return '无'
      }
    },
    returnTagValue(type) {
      switch (type) {
        case 0:
          return 'success';
        case 1:
          return 'info';
        default:
          return '无'
      }
    }
  },
  async created() {
    var resMessage = await this.Api.getMessageTemplate({});
    this.optionsMessage = this.$plug.public.transformList(resMessage.data.list, 'id', 'name');
    var resService = await this.Api.getMember({});
    this.optionsService = this.$plug.public.transformList(resService.data.list, 'id', 'username');
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

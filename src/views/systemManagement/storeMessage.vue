<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :quickSearch="quickSearch" :pagination="pagination" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd"></search-sub>
      <!--表格-->
      <table-sub
        ref="tableSub"
        @submit="handleSave"
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination"
      >
        <template slot="storeId" slot-scope="{ index,row }">
          <span v-if="!!row.store">{{row.store.name}}</span>
        </template>
        <template slot="messageId" slot-scope="{ index,row }">
          <span v-if="!!row.message">{{row.message.title}}</span>
        </template>
        <template slot="readTime" slot-scope="{ index,row }">
          <span v-if="!!row.readTime">{{format(new Date(row.readTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>

        <template slot="isRead" slot-scope="{ index,row }">
          <el-tag :type="returnTagValue(row.isRead)">{{returnTypeValue(row.isRead)}}</el-tag>
        </template>

        <!-- <template slot="table" slot-scope="{index, row}">
          <el-button  type="text"
                      size="mini"
                      @click.stop="() => handleIsRead(row)" v-if="row.isRead !== 1">标为已读
          </el-button>
        </template> -->
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请选择线下店铺" data-name="storeIds">*</i>线下店铺：</td>
            <td>
              <check-module ref="checkmodule" :dialog="subDialog" @submit="handleSelect"></check-module>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择消息" data-name="message">*</i>消息：</td>
            <td>
              <check-module ref="checkmoduleMsg" :disabled="dialog.readBool" :dialog="subDialogMsg" @submit="handleSelectMsg"></check-module>
            </td>
          </tr>
          <!-- <el-form-item label="线下店铺" prop="storeIds">
            <check-module ref="checkmodule" :dialog="subDialog" @submit="handleSelect"></check-module>
          </el-form-item>
          <el-form-item label="消息" prop="message">
            <check-module ref="checkmoduleMsg" :disabled="dialog.readBool" :dialog="subDialogMsg" @submit="handleSelectMsg"></check-module>
          </el-form-item>
          <el-form-item label="是否已读：" v-if="dialog.readBool">
            <el-radio-group size="mini" v-model="dialog.ruleForm2.isRead" :disabled="dialog.readBool">
              <el-radio border :label="0">未读</el-radio>
              <el-radio border :label="1">已读</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="阅读时间" prop="readTime" v-if="dialog.readBool">
            <el-date-picker
              v-model="dialog.ruleForm2.readTime"
              type="datetime"
              placeholder="选择时间" :disabled="dialog.readBool">
            </el-date-picker>
          </el-form-item> -->
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
// import prompt from '../../utils/plug.js'
import CheckModule from '../checkModule';

let subDialog = {
  innerVisible: false,
  addBool: true,
  type: 3,
  nameVal: 'name',
  tableType: 'selection',
  store: {}
}
export default {
  data() {
    let form = {
            storeIds: '',
            message: {
              id: ''
            },
            isRead: 0,
            readTime: ""
          };
    return {
      form,
      searchBool: true,
      format: format,
      storeList: [],
      msgList: [],
      quickSearch: {
        isShow: true,
        hideTime: true,
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

      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: false,
        detailBool: false,
        arrDelBool: true,
        editBool: true,
        delBool: true,
        btn: true,
        columns: [
          {
            value: "storeId",
            label: "线下店铺",
            slotBool: true
          },
          {
            value: "messageId",
            label: "消息",
            slotBool: true
          },
          {
            value: "isRead",
            label: "是否已读",
            width: "80",
            slotBool: true
          },
          {
            value: "readTime",
            label: "阅读时间",
            slotBool: true,
            width: "140"
          },
          {
            value: "createTime",
            label: "创建时间",
            width: "100"
          }
        ]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      },

      dialog: {
        btnText: "创建消息",
        titleText: "新增消息",
        isTable: true,
        readBool:false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,

        ruleForm2: Object.assign({}, form),
        rules2: {
          storeIds: this.$plug.valid.isNull(),
          message: this.$plug.valid.isNull()
        }
      },
      subDialog: Object.assign({}, subDialog),
      subDialogMsg: {
        innerVisible: false,
        addBool: true,
        type: 8,
        nameVal: 'title',
        tableType: 'radio',
        systemMessage: {}
      }
    }
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub,
    CheckModule
  },
  methods: {
    async getDataList() {
      let quick = {};
      if (this.quickSearch && this.quickSearch.group) {
        this.quickSearch.group.map(item => {
          quick[item.value] = item.selected;
        })
      }
      let para = Object.assign({
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        }
      }, quick);
      let resData = await this.Api.getStoreMessage(para);
      resData.data.list.map(item => {
        if (item.store == null) {
          item.store = { id: "" };
        }
        item.storeIds = item.store.id;
        if (item.message == null) {
          item.message = { id: "" };
        }
        item.messageId = item.message.id;
      });

      return resData;
    },
    // 显示新增界面
    handleAdd() {
      this.dialog.titleText = "新增消息";
      this.dialog.saveFormVisible = true;
      this.dialog.ruleForm2.storeIds = '';
      this.dialog.ruleForm2.message.id = '';
      if (!this.msgList || !this.msgList.length) {
        this.getMessageList();
      }
    },
    // handleDetail(params) {
    //   this.dialog.titleText = "查看消息";
    //   this.dialog.saveFormVisible = true;
    //   this.dialog.readBool = true;
    //   this.getInfo(params.id);
    //   if (!this.msgList || !this.msgList.length) {
    //     this.getMessageList();
    //   }
    // },
    // async getInfo(id) {
    //   let res = await this.Api.getStoreMessageDetail({id});
    //   if (res.status == 1) {
    //     this.dialog.ruleForm2 = res.data;
    //     this.dialog.ruleForm2.storeIds = res.data.store.id;
    //   }
    // },
    async getMessageList() {
      let res = await this.Api.getMessageList({});
      if (res.status == 1 && res.data) {
        this.msgList = res.data || [];
      }
    },
    handleSelect(row, type) {
      let storeIds = row.map(item => {
        return item.id;
      });
      this.dialog.ruleForm2.storeIds = storeIds.join(',');
    },
    handleSelectMsg(row, type) {
      this.dialog.ruleForm2.message = {
        id: row.id
      };
    },
    // 新增修改
    async handleSave(row, savePrompt) {
      // if(row.isRead){
      //   row.readTime = format(
      //     new Date(row.readTime),
      //     "yyyy-MM-dd hh:mm:ss"
      //   );
      // }
      row.isRead = 0;
      // if (!row.id) {
        savePrompt(this.Api.saveBatchStoreMessage, row, () => {
          this.subDialog = Object.assign({}, subDialog);
          this.$refs.checkmodule.clearSelect();
          this.$refs.checkmoduleMsg.clearSelect();
        });
      // } else {
        //savePrompt(this.Api.updateServiceConfig, row);
      // }
    },
    // 标记已读
    async handleIsRead(row) {
      this.$plug.prompt.del(this.saveIsRead, row, null, '将消息标为已读');
    },
    async saveIsRead(row) {
      let res = await this.Api.readStoreMessage({
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
  computed: {},
  async mounted() {}
};
</script>
<style type="text/scss" lang="scss" scoped>
.box-card {
  padding-top: 20px;
}
</style>

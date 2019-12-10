<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <!-- <search-sub
        :searchObj="searchObj"
        :getDataList="getDataList"
        :searchBool="searchBool"
        :dialog="dialog"
        @add="handleAdd"
      ></search-sub> -->
      <!--表格-->
      <table-sub
        ref="tableSub"
        @del="handleDel"
        @detail="handleDetail"
        @edit="handleEdit"
        @submit="handleSave"
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination"
      >
        <template slot="memberCode" slot-scope="{ index,row }">
          <span v-if="!!row.member">{{row.member.code}}</span>
        </template>
        <template slot="memberNickname" slot-scope="{ index,row }">
          <span v-if="!!row.member">{{row.member.nickname}}</span>
        </template>
        <!-- <template v-for="item in fixedData" :slot="item.value" slot-scope="{index,row }">
          <span v-for="type in item.list" :key="type.label" v-if="type.value === row[item.value]">
            {{type.label}}
          </span>
        </template> -->
        <template slot="type" slot-scope="{ index,row }">
          <span>{{returnTypeValue(row.type)}}</span>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{ index,row }">
          <el-button @click="handleDispose(row)" type="text" size="small" v-if="row.status==1">处理</el-button>
          <span v-if="row.status==2">不可操作</span>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleManage">
        <template slot="dialog">
          <tr>
            <td>备注：</td>
            <td>
            <el-input type="textarea" v-model="dialog.ruleForm2.disposeRemarks" :disabled="dialog.readBool" :autosize="{ minRows: 4, maxRows: 4}" size="large"></el-input>
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
import { format } from "../../../utils";

export default {
  data() {
    return {
      // fixedData: [
      //   {
      //     label: "申请类型",
      //     value: "type",
      //     list: [
      //       {
      //         label: "同城企业",
      //         value: 1
      //       },
      //       {
      //         label: "生产企业",
      //         value: 2
      //       },
      //       {
      //         label: "合作商",
      //         value: 3
      //       },
      //       {
      //         label: "推广员",
      //         value: 4
      //       },
      //       {
      //         label: "其他",
      //         value: 5
      //       }
      //     ]
      //   }
      // ],
      searchBool: false,
      searchObj: [],

      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: true,
        arrDelBool: true,
        editBool: true,
        detailBool: false,
        delBool: true,
        columns: [
          {
          //   value: "code",
          //   label: "编码",
          //   width: "150"
          // },
          // {
            value: "memberCode",
            label: "会员编码",
            width: "150",
            slotBool: true
          },
          {
            value: "name",
            label: "姓名",
            width: "100"
          },
          {
            value: "phone",
            label: "电话",
            width: "120"
          },
          {
            value: "type",
            label: "申请类型",
            width: "100",
            slotBool: true
          },
          {
            value: "address",
            label: "所在地区",
            width: "150"
          },
          {
            value: "remarks",
            label: "备注",
            width: "120"
          },
          {
            value: "createTime",
            label: "上传时间",
            width: "140"
          },
          {
            value: "updateBy",
            label: "处理人",
            width: "120"
          },
          {
            value: "disposeRemarks",
            label: "处理备注",
            width: "120"
          },
          {
            value: "updateTime",
            label: "处理时间",
            width: "140"
          }
        ]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      },

      dialog: {
        titleText: "处理",
        width: "420px",
        readBool: false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        isTable: true,

        ruleForm2: {
          platformType: 1,
          remarks: ""
        },
        rules2: {
          remarks: this.$plug.valid.isNull()
        }
      }
    };
  },
  components: {
    DialogSub,
    TableSub
  },
  methods: {
    async getDataList() {
      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        }
      };
    
      return await this.Api.getBusinessCooperate(para);
    },
    handleDetail(params) {
      this.dialog.titleText = "查看消息";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
      this.getInfo(params.id);
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑消息";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = false;
      this.getInfo(params.id);
    },
    async getInfo(id) {
      let res = await this.Api.getBusinessCooperateDetail({ id });
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    // 创建修改
    async handleSave(row, savePrompt) {
      if (row.id) {
        savePrompt(this.Api.updateBusinessCooperate, row);
      }
    },
    async handleDel(row, delPrompt) {
      //删除
      delPrompt(this.Api.deleteMessage, {
        id: row.id
      });
    },
    async handleDispose(row) {
      this.dialog.saveFormVisible = true;
      this.dialog.ruleForm2 = Object.assign({}, row);
      this.dialog.ruleForm2.remarks = '';
    },
    async handleManage(row, delPrompt) {
      delPrompt(this.Api.updateBusinessCooperate, {
        "id": row.id,
        "status": 2,
        "disposeRemarks": row.disposeRemarks
      });
      bus.$emit("loadDialogData");
    },
    returnTypeValue(type) {
      switch (type) {
        case 1:
          return '同城企业';
        case 2:
          return '生产企业';
        case 3:
          return '合作商';
        case 4:
          return '推广员';
        case 5:
          return '线下店铺';
        case 6:
          return '供应商';
      }
    }
  },
  computed: {},
  async mounted() {}
};
</script>
<style type="text/scss" lang="scss" scoped>
.app-container {
  margin-top: 20px;
}
.box-card {
  padding-top: 20px;
}
.hint {
  font-size: 12px;
}
</style>

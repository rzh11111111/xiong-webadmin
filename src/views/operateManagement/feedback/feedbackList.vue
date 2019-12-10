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
        <template slot="type" slot-scope="{ index,row }">
          <span>{{returnTypeValue(row.type)}}</span>
        </template>
        <template slot="picUrl" slot-scope="{index,row }">
          <div class="pic" v-for="(item,index) in row.pic" :key="index">
            <el-popover placement="top" width="400" trigger="click">
              <img :src="item" width="400" height="400" class="pic"/>
              <img class="refund-btn " slot="reference" :src="item" width="40" height="40"/>
            </el-popover>
          </div>
        </template>
        <!-- <template v-for="item in fixedData" :slot="item.value" slot-scope="{index,row }">
          <span v-for="type in item.list" :key="type.label" v-if="type.value === row[item.value]">
            {{type.label}}
          </span>
        </template> -->
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{ index,row }">
          <el-button @click="handleDispose(row)" type="text" size="small" v-if="row.status==0">处理</el-button>
          <span v-else>不可操作</span>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleManage">
        <template slot="dialog">
          <tr>
            <td>备注：</td>
            <td>
            <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool" :autosize="{ minRows: 4, maxRows: 4}" size="large"></el-input>
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
import bus from '@/utils/bus.js'

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
            value: "code",
            label: "编码",
            width: "150"
          },{
            value: "memberCode",
            label: "会员编码",
            width: "150",
            slotBool: true
          },{
            value: "memberNickname",
            label: "会员姓名",
            width: "100",
            slotBool: true
          },{
            value: "type",
            label: "意见类型",
            width: "100",
            slotBool: true
          },{
            value: "opinion",
            label: "意见描述",
            width: "120"
          },{
            value: "picUrl",
            label: "图片",
            width: "250",
            slotBool: true,
            isShow: true
          },{
            value: "createTime",
            label: "上传时间",
            width: "140"
          },{
            value: "updateBy",
            label: "处理人",
            width: "120"
          },{
            value: "remarks",
            label: "处理备注",
            width: "120"
          },{
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
          remarks: ""
        },
        rules2: {
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
      let res = await this.Api.getFeedBack(para);
      res.data.list.map(item => {
        
        // item.str = item.picUrl;
        if(item.picUrl !=null){
          item.pic = item.picUrl.split(",");
        }
        // item.pic = item.picUrl;
        console.log("resData",item.pic)
        
      });
      return res;
    },
    async handleDispose(row) {
      this.dialog.saveFormVisible = true;
      this.dialog.ruleForm2 = Object.assign({}, row);
      this.dialog.ruleForm2.remarks = '';
    },
    async handleManage(row, delPrompt) {
      delPrompt(this.Api.updateFeedBack, {
        "id": row.id,
        "remarks": row.remarks
      });
      // bus.$emit("loadDialogData");
    },
    returnTypeValue(type) {
      switch (type) {
        case 1:
          return '商品相关';
        case 2:
          return '物流状况';
        case 3:
          return '客户服务';
        case 4:
          return '优惠活动';
        case 5:
          return '产品体验';
        case 6:
          return '产品功能';
        case 7:
          return '其它';
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
.pic {
  display: inline-block;
  margin: 0 2px;
}
</style>

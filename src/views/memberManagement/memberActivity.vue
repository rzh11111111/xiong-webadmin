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
        <template slot="table" slot-scope="{ index,row }">
          <el-button @click="handleDetail(row)" type="text" size="small">查看详情</el-button>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList">
        <template slot="dialog">
          <tr v-if="dialog.readBool">
            <td>记录流水号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.recordNo" :disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td>会员账号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.username" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>活动名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.activityName" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>活动类型：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.type" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>记录摘要：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.summary" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>参与次数：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.partakeNum" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>参与业务类型：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.serviceType" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>业务类型ID：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.serviceId" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>会员：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.createTime" :disabled="dialog.readBool"></el-input>
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

export default {
  data() {
    return {
      fixedData: [
        {
          label: "活动类型",
          value: "type",
          list: [
            {
              label: "注册活动",
              value: 1
            },
            {
              label: "邀请活动",
              value: 2
            }
          ]
        },
        {
          label: "参与业务类型",
          value: "serviceType",
          list: [
            {
              label: "注册",
              value: 1
            },
            {
              label: "邀请活动",
              value: 2
            }
          ]
        }
      ],
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
          isText: true
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
          value: 'recordNo',
          label: '记录流水号',
          width: '150'
        }, {
          value: 'username',
          label: '会员账号',
          width: '120'
        }, {
          value: 'activityName',
          label: '活动名称',
          width: '120'
        }, {
          value: 'type',
          label: '活动类型',
          width: '140',
          slotBool: true
        }, {
          value: 'summary',
          label: '记录摘要',
          width: '140'
        }, {
          value: 'partakeNum',
          label: '参与次数',
          width: '140'
        }, {
          value: 'serviceType',
          label: '参与业务类型',
          width: '140',
          slotBool: true
        }, {
          value: '',
          label: '会员',
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
        titleText: "查看详情",
        width: "450px",
        readBool:false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        addBool:true,
        isTable: true,
        ruleForm2: {
        },
        rules2: {
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
      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter,
        ...queryPo
      };
      return await this.Api.getMemberActivity(para);
    },
    handleDetail(params) {
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
      this.getInfo(params.id);
    },
    async getInfo(id) {
      let res = await this.Api.findMemberActivity({id});
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

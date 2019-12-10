<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"></search-sub>
      <!--表格-->
      <table-sub
        ref="tableSub"
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination"
      >
        <template slot="code" slot-scope="{ index,row }">
          <span>{{row.member.code}}</span>
        </template>
      </table-sub>
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
    let query = this.$route.query || {};
    return {
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: query.id || "",
          name: "关键字",
          isText: true,
          placeholder: '会员编号/收货人姓名/收货人手机号'
        }
      ],

      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: true,
        detailBool: true,
        arrDelBool: true,
        btn: true,
        columns: [
          {
            value: "code",
            label: "会员编号",
            width: "100",
            slotBool: true
          },
          {
            value: "name",
            label: "收货人姓名",
            width: "100"
          },
          {
            value: "phone",
            label: "收货人手机号",
            width: "150"
          },
          {
            value: "province",
            label: "省(直辖市)",
            width: "150"
          },
          {
            value: "city",
            label: "市",
            width: "150"
          },
          {
            value: "region",
            label: "区",
            width: "150"
          },
          {
            value: "address",
            label: "详细地址",
            width: "150"
          }
        ]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      },

      dialog: {
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
      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter: searchParameter
      };
      return await this.Api.getmemberAddress(para);
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

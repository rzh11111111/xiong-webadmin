<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub
        :searchObj="searchObj"
        :getDataList="getDataList"
        :searchBool="searchBool"
        :dialog="dialog"
        :pagination="pagination"
      >
      </search-sub>
      <!--表格-->
      <table-sub
        ref="tableSub"
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
      </table-sub>
    </div>
  </div>
</template>
<script>
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import { format } from "../../utils";

export default {
  data() {
    return {
      searchBool: false,
      format: format,
      searchObj: [{
        value: 'keyWord',
        label: '',
        name: '关键字',
        isText: true,
        placeholder: ''
      }],

      table: {
        width: "200px",
        arrDelBool: true,
        addBool: true,
        btn: true,
        columns: [
          {
            label: "搜索关键字",
            value: "searchKeyword"
          },
          {
            label: "搜索时间",
            value: "createTime",
            width: 200
          },
          {
            label: "搜索人ID",
            value: "memberId"
          }
        ]
      },

      dialog: {
        addBool: true,
        saveLoading: false
      },

      pagination: {
        page: 1,
        count: 8,
        total: 0
      },

      validForm: {},

      data2: [],
      expand: []
    };
  },
  components: {
      DialogSub,
      SearchSub,
      TableSub
  },
  methods: {
    async getDataList() {
      let queryPo = this.$plug.public.transformSearchData.call(
        this,
        this.searchObj
      );
      let searchParameter = {
        keyWord: queryPo.keyWord
      };
      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter: searchParameter
      };
      let resData = await this.Api.getSellerSearchRecord(para);
      resData.data.list.map(item => {
        if (item.member == null) {
          item.member = { id: "" };
        }
        item.memberId = item.member.id;
      });
      return resData;
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

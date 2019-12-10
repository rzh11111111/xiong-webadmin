<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :timeRangeVal="['time1']" :pagination="pagination" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd"></search-sub>
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
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="val" slot-scope="{ index,row }">
          <el-popover
            placement="right-start"
            width="200"
            trigger="hover"
            :content="row.val">
            <p class="ellipsis" slot="reference">{{row.val}}</p>
          </el-popover>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td>业务编码：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入业务值" data-name="val">*</i>业务值：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.val" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>参数配置说明：</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.description" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>备注：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
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
        width: "200px",
        emitEditBool: true,
        emitDetailBool: true,
        detailBool: true,
        arrDelBool: true,
        columns: [
          {
            value: "code",
            label: "业务编码",
            width: "100"
          },
          {
            value: "description",
            label: "参数配置说明",
            width: "150"
          },
          {
            value: "val",
            label: "业务值",
            width: "100",
            slotBool: true
          },
          {
            value: "unit",
            label: "单位",
            width: "100"
          },
          {
            value: "createTime",
            label: "创建时间",
            width: "140",
          },
          {
            value: "createBy",
            label: "创建人",
            width: "100"
          },
          {
            value: "updateTime",
            label: "最后修改时间",
            width: "140"
          },
          {
            value: "updateBy",
            label: "最后修改人",
            width: "120"
          },
          {
            value: "remarks",
            label: "备注",
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
        btnText: "创建参数",
        titleText: "新增参数",
        readBool:false,
        isTable: true,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        addBool:true,
        ruleForm2: {
          code: "",
          val: "",
          description: "",
          remarks: "",
          unit: ""
        },
        rules2: {
          val: this.$plug.valid.isNull()
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
      return await this.Api.getServiceConfig(para);
    },
    // 显示新增界面
    handleAdd() {
      this.dialog.titleText = "新增参数";
      this.dialog.saveFormVisible = true;
    },
    handleDetail(params) {
      this.dialog.titleText = "查看参数";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
      this.getInfo(params.id);
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑参数";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = false;
      this.getInfo(params.id);
    },
    async getInfo(id) {
      let res = await this.Api.getServiceConfigDetail({id});
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    // 新增修改
    async handleSave(row, savePrompt) {
      if (!row.id) {
        savePrompt(this.Api.saveServiceConfig, row);
      } else {
        savePrompt(this.Api.updateServiceConfig, row);
      }
    },
    async handleDel(row, delPrompt) {
      //删除
      delPrompt(this.Api.deleteServiceConfig, {
        id: row.id
      });
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

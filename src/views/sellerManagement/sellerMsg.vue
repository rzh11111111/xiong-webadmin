<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub
        :searchObj="searchObj"
        :getDataList="getDataList"
        :searchBool="searchBool"
        :dialog="dialog"
        @add="handleAdd"
        :pagination="pagination"
      ></search-sub>
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
        <template slot="isRead" slot-scope="{ index,row }">
          <el-tag :type="row.isRead == 1 ? 'success' : 'danger'">{{row.isRead == 1 ? '已读' : '未读'}}</el-tag>
        </template>
        <template slot="content" slot-scope="{ index,row }">
          <el-popover
            placement="top"
            trigger="hover"
            popper-class="tootip-box"
            :content="row.content">
            <p class="ellipsis" slot="reference">{{row.content}}</p>
          </el-popover>
        </template>
        <template slot="invalidTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.invalidTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <el-form-item label="标题" prop="title">
            <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="subTitle">
            <el-input v-model="dialog.ruleForm2.subTitle" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="正文" prop="content">
            <el-input type="textarea" v-model="dialog.ruleForm2.content" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item
            v-for="type in fixedData"
            :key="type.label"
            :label="type.label"
            :prop="type.value"
          >
            <el-select
              v-model="dialog.ruleForm2[type.value]"
              placeholder="请选择"
              :disabled="dialog.readBool"
            >
              <el-option
                v-for="item in type.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生效时间" prop="activeTime">
            <el-date-picker
              v-model="dialog.ruleForm2.activeTime"
              type="date"
              placeholder="选择生效时间"
              :disabled="dialog.readBool">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-radio-group v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
              <el-radio :label="0" border>启用</el-radio>
              <el-radio :label="1" border>禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否置顶">
            <el-radio-group v-model="dialog.ruleForm2.isTop" :disabled="dialog.readBool">
              <el-radio :label="1" border>是</el-radio>
              <el-radio :label="0" border>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
import TableSub from "@/components/TableSub";
import DialogSub from "@/components/DialogSub";
import SearchSub from "@/components/SearchSub";
import {format} from "../../utils";

export default {
  data() {
    return {
      format,
      searchBool: false,
      searchObj: [
        {
          value: "isRead",
          label: "",
          name: "是否已读",
          isText: true
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
            value: "title",
            label: "标题",
            width: "150"
          },
          {
            value: "content",
            label: "内容",
            width: "120"
          },
          {
            value: "linkUrl",
            label: "链接",
            width: "120"
          },
          {
            value: "isRead",
            label: "是否已读",
            slotBool: true,
            width: "120"
          },
          {
            value: "invalidTime",
            label: "失效时间",
            slotBool: true,
            width: "120"
          },
          {
            value: "platformType",
            label: "发送平台",
            slotBool: true,
            width: "120"
          },
          {
            value: "type",
            label: "消息类型",
            slotBool: true,
            width: "120"
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
        titleText: "创建消息",
        readBool: false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        ruleForm2: {
          title: "",
          content: "",
          tagType: 1,
          isEnable: 0,
          isTop: 0,
          type: 99
        },
        rules2: {
          title: this.$plug.valid.isNull(),
          content: this.$plug.valid.isNull(),
          activeTime: this.$plug.valid.isNull()
        }
      }
    };
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub
  },
  methods: {
    async getDataList() {
      //获取列表
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
      return await this.Api.getStoreMsg(para);
    },
    // 显示创建界面
    handleAdd() {
      this.dialog.titleText = "创建消息";
      this.dialog.saveFormVisible = true;
    },
    handleDetail(params) {
      this.dialog.titleText = "查看消息";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
        this.dialog.ruleForm2 = params;
      // this.getInfo(params.id);
    },
    async getInfo(id) {
      let res = await this.Api.getStoreMsgInfo({ id });
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    // 创建修改
    async handleSave(row, savePrompt) {
      let params = Object.assign({}, row);
      if (params.readTime) {
        params.readTime = format(
          new Date(params.readTime),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      savePrompt(this.Api.saveStoreMsg, params);
    },
    async handleDel(row, delPrompt) {
      //删除
      delPrompt(this.Api.delPlatformMsg, {
        id: row.id
      });
    },
    handleShowStatusChange(index, row) {
      this.Api.enablePlatformMsg({
        id: row.id,
        isEnable: row.isEnable === 0 ? 1 : 0
      }).then(res => {
        if (res.status == 1) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        }
      });
    }
  },
  computed: {},
  async mounted() {}
};
</script>
<style type="text/scss" lang="scss" scoped>

</style>

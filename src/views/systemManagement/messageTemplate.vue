<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :timeRangeVal="['time1']" :quickSearch="quickSearch"
        :searchObj="searchObj"
        :getDataList="getDataList"
        :searchBool="searchBool"
        :dialog="dialog"
        :pagination="pagination"
        @add="handleAdd"
      ></search-sub>
      <!--表格-->
      <table-sub
        ref="tableSub"
        @detail="handleDetail"
        @edit="handleEdit"
        @submit="handleSave"
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
        <template slot="tableRight" slot-scope="{index, row}">
          <el-button type="text" @click="handleDel(row)" :disabled="row.isSys !== 1">删除</el-button>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入模板名称" data-name="name">*</i>模板名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
            <td>消息编码：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td>系统模板：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isSys" :disabled="dialog.readBool">
                <el-radio border :label="1">是</el-radio>
                <el-radio border :label="0">否</el-radio>
              </el-radio-group>
            </td>
            <td><i class="red-star" data-message="请输入消息标题" data-name="title">*</i>消息标题：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" :data-message="'请选择' + fixedData[0].label" :data-name="fixedData[0].value">*</i>{{fixedData[0].label}}：</td>
            <td>
              <el-select
                v-model="dialog.ruleForm2[fixedData[0].value]"
                placeholder="请选择"
                :disabled="dialog.readBool"
              >
                <el-option
                  v-for="item in fixedData[0].list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </td>
            <td><i class="red-star" :data-message="'请选择' + fixedData[1].label" :data-name="fixedData[1].value">*</i>{{fixedData[1].label}}：</td>
            <td>
              <el-select
                v-model="dialog.ruleForm2[fixedData[1].value]"
                placeholder="请选择"
                :disabled="dialog.readBool"
              >
                <el-option
                  v-for="item in fixedData[1].list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入消息内容" data-name="content">*</i>消息内容：</td>
            <td colspan="3">
              <el-input type="textarea" v-model="dialog.ruleForm2.content" :disabled="dialog.readBool"></el-input>
              <p class="tips-box">（%u 代表接收人账号, %n代表接收人昵称, %t代表当前时间）</p>
            </td>
          </tr>
          <!-- <el-form-item label="模板名称" prop="name">
            <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="消息编码" v-if="dialog.readBool">
            <el-input v-model="dialog.ruleForm2.code" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="是否系统模板">
            <el-radio-group v-model="dialog.ruleForm2.isSys" :disabled="dialog.readBool">
              <el-radio border :label="1">是</el-radio>
              <el-radio border :label="0">否</el-radio>
            </el-radio-group>
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
          <el-form-item label="消息标题" prop="title">
            <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="消息内容" prop="content">
            <el-input type="textarea" v-model="dialog.ruleForm2.content" :disabled="dialog.readBool"></el-input>
            <p class="tips-box">（%u 代表接收人账号, %n代表接收人昵称, %t代表当前时间）</p>
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

export default {
  data() {
    return {
      fixedData: [
        {
          label: "发送平台",
          value: "platformType",
          list: [
            {
              label: "全部",
              value: 1
            },
            {
              label: "消费者端",
              value: 2
            },
            {
              label: "商户端",
              value: 3
            },
            {
              label: "企业端",
              value: 4
            },
            {
              label: "管理端",
              value: 5
            }
          ]
        },
        {
          label: "消息类型",
          value: "type",
          list: [
            {
              label: "站内通知",
              value: 1
            },
            {
              label: "消息推送",
              value: 2
            },
            {
              label: "时效消息",
              value: 3
            }
          ]
        }
      ],
      quickSearch: {
        isShow: true,
        isTimeRange: true
      },
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: "",
          name: "关键字",
          isText: true,
          placeholder: '编码/名称/类型/标题/发送平台'
        }, {
          value: 'time1',
          label: '',
          name: '创建时间',
          isTimeRange: true
        }],

      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: true,
        detailBool: true,
        arrDelBool: true,
        delBool: true,
        columns: [
          {
            value: "code",
            label: "消息编码",
            width: "150"
          },
          {
            value: "name",
            label: "模板名称",
            width: "150"
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
          },
          {
            value: "title",
            label: "消息标题",
            width: "120"
          },
          {
            value: "content",
            label: "消息内容",
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
        width: '750px',
        btnText: "创建模板",
        titleText: "创建模板",
        isTable: true,
        readBool: false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,

        ruleForm2: {
          platformType: 1,
          type: 1,
          title: "",
          content: "",
          name:"",
          isSys: 1
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
        searchParameter: searchParameter
      };
      return await this.Api.getMessageTemplate(para);
    },
    // 显示创建界面
    handleAdd() {
      this.dialog.titleText = "创建模板";
      this.dialog.saveFormVisible = true;
    },
    handleDetail(params) {
      this.dialog.titleText = "查看模板";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
      this.getInfo(params.id);
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑模板";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = false;
      this.getInfo(params.id);
    },
    async getInfo(id) {
      let res = await this.Api.getMessageTemplateDetail({id});
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    // 新增修改
    async handleSave(row, savePrompt) {
      if (!row.id) {
        savePrompt(this.Api.addMessageTemplate, row);
      } else {
        savePrompt(this.Api.editMessageTemplate, row);
      }
    },
    async handleDel(row) {
      this.$plug.prompt.del(this.sureDel, row, null, '删除该消息模板');
    },
    sureDel(row) {
      this.$refs.tableSub.delPrompt(this.Api.deleteMessageTemplate, {
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

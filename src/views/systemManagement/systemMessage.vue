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
        @del="handleDel"
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
       <!--  <template slot="content" slot-scope="{ index,row }">
          <el-popover
            placement="top"
            trigger="hover"
            popper-class="tootip-box">
            <div v-html="row.content">

            </div>
            <div class="ellipsis" slot="reference">
              <div v-html="row.content"></div>
            </div>
          </el-popover>
        </template> -->
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td>消息编码：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
            </td>
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
          </tr>
          <tr v-for="(type, inx) in fixedData" :key="type.value" v-if="inx % 2 !== 0">
            <td><i class="red-star" :data-message="'请选择' + type.label" :data-name="type.value">*</i>{{type.label}}：</td>
            <td>
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
            </td>
            <template v-if="!!fixedData[inx + 1]">
              <td><i class="red-star" :data-message="'请选择' + fixedData[inx + 1].label" :data-name="fixedData[inx + 1].value">*</i>{{fixedData[inx + 1].label}}：</td>
              <td>
                <el-select
                  v-model="dialog.ruleForm2[fixedData[inx + 1].value]"
                  placeholder="请选择"
                  :disabled="dialog.readBool"
                >
                  <el-option
                    v-for="item in fixedData[inx + 1].list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </td>
            </template>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入消息标题" data-name="title">*</i>消息标题：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入跳转链接" data-name="linkUrl">*</i>跳转链接：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.linkUrl" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择失效时间" data-name="title">*</i>失效时间：</td>
            <td colspan="3">
              <el-date-picker
                v-model="dialog.ruleForm2.invalidTime"
                type="datetime"
                placeholder="选择失效时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="dialog.readBool">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入消息内容" data-name="content">*</i>消息内容：</td>
            <td colspan="3">
              <editor :disabled="dialog.readBool" :init="editorInit" v-model="dialog.ruleForm2.content"></editor>
              <span class="hint">%u代表接收人账号 %n代表接收人昵称 %t代表当前时间</span>
            </td>
          </tr>
          <!-- <el-form-item label="消息编码" v-if="dialog.readBool">
            <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
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
            <editor :disabled="dialog.readBool" :init="editorInit" v-model="dialog.ruleForm2.content"></editor>
            <span class="hint">%u代表接收人账号 %n代表接收人昵称 %t代表当前时间</span>
          </el-form-item>
          <el-form-item label="跳转链接" prop="linkUrl">
            <el-input v-model="dialog.ruleForm2.linkUrl" :disabled="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="失效时间" prop="invalidTime">
            <el-date-picker
              v-model="dialog.ruleForm2.invalidTime"
              type="datetime"
              placeholder="选择失效时间"
              :disabled="dialog.readBool">
            </el-date-picker>
          </el-form-item> -->

        </template>
      </dialog-sub>
      <el-dialog
          width="1100px"
          maxHeight="600px"
          :title="subDialogImgs.titleText"
          :close-on-click-modal="true"
          :append-to-body="subDialogImgs.appendToBody===true"
          :visible.sync="subDialogImgs.innerVisible"
          custom-class="files-wrapper"
          append-to-body>
        <files ref="filesSelector" :dialog="subDialogImgs" :tableType="subDialogImgs.tableType" @submit="editorInit.images_selector_handler"></files>
        <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelSelect">取消</el-button>
        <el-button type="primary" size="small" @click="selectFiles">确定</el-button>
      </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import TableSub from "@/components/TableSub";
import DialogSub from "@/components/DialogSub";
import SearchSub from "@/components/SearchSub";
import { format } from "../../utils";
  import Files from '@/components/Selector/files'

  import Editor from '@tinymce/tinymce-vue'

export default {
  data() {
    let _this = this;
    return {
      quickSearch: {
        isShow: true,
        isTimeRange: true
      },
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
        }, {
          label: '内容类型',
          value: 'contentType',
          list: [{
            label: '活动通知',
            value: 1
          }, {
            label: '平台公告',
            value: 2
          }, {
            label: '账户通知',
            value: 3
          }]
        }
      ],
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: "",
          name: "消息",
          isText: true,
          placeholder: '编码/类型/标题/发送平台'
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
        editBool: true,
        columns: [
          {
            value: "code",
            label: "消息编码",
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
            value: "contentType",
            label: "内容类型",
            slotBool: true,
            width: "120"
          },
          {
            value: "title",
            label: "消息标题",
            width: "120"
          }, {
            value: "createTime",
            label: "创建时间",
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
        width: '800px',
        btnText: "创建消息",
        titleText: "创建消息",
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
          content: ""
        },
        rules2: {
          title: this.$plug.valid.isNull(),
          content: this.$plug.valid.isNull(),
          type: this.$plug.valid.isNull(),
          platformType: this.$plug.valid.isNull()
        }
      },
      subDialogImgs: {
        innerVisible: false,
        tableType: 'selection',
        files: [],
        ruleForm2: null,
      },
      //商品富文本详情激活类型
      activeHtmlName: 'mobile',
      editorInit: {
        language: 'zh_CN',
        paste_data_images: true,
        content_style: `
          *                         { padding:0; margin:0; }
          html, body                { min-height:360px;}
          img                       { display:inline-block;max-width: 100%;height:auto; }
          a                         { text-decoration: none; }
          iframe                    { width: 100%; height:450px;}
          p                         { line-height:1.6; margin: 0px; }
          table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
          .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
          ul,ol                     { list-style-position:inside; }
        `,
        plugins: ['advlist anchor autolink autosave emoticons fullscreen hr imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table textcolor textpattern visualblocks visualchars wordcount uploadimage'],
        toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript ', 'hr bullist numlist link charmap anchor pagebreak table emoticons forecolor backcolor uploadimage media preview fullscreen'],
        images_selector(callback) {
          _this.subDialogImgs.innerVisible = true;
          _this.editorInit.selectorHandler = callback;
        },
        images_selector_handler(dataList) {
          _this.editorInit.selectorHandler(dataList);
          _this.$refs.filesSelector.cancelSelect(dataList);
          _this.subDialogImgs.ruleForm2 = [];
          _this.subDialogImgs.files = [];
        }
      }
    };
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub,
    Files,
    Editor
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
      return await this.Api.getMessage(para);
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
      this.getInfo(params.id);
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑消息";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = false;
      this.getInfo(params.id);
    },
    async getInfo(id) {
      let res = await this.Api.getMessageDetail({ id });
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    // 创建修改
    async handleSave(row, savePrompt) {
      if (!row.id) {
        savePrompt(this.Api.addMessage, row);
      } else {
        savePrompt(this.Api.editMessage, row);
      }
    },
    async handleDel(row, delPrompt) {
      //删除
      delPrompt(this.Api.deleteMessage, {
        id: row.id
      });
    },
    cancelSelect() {
      this.$refs.filesSelector.cancelSelect();
    },
    selectFiles() {
      this.$refs.filesSelector.emitSave();
    }
  },
  computed: {},
  async mounted() {}
};
</script>
<style type="text/scss" lang="scss">
.paramInput {
  width: 250px;
  .el-input__inner{
    max-width: 250px;
    width: 250px;
  }
}
.product-attrs-box{
  .el-input__inner{
    padding: 0 10px;
  }
}


</style>
<style type="text/scss" lang="scss" scoped>

.box-card {
  padding-top: 20px;
}
.hint {
  font-size: 12px;
}
</style>

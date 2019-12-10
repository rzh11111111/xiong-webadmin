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
        <template slot="tagType" slot-scope="{index, row}">
          <span v-for="tag in tagType" :key="tag.value" v-if="tag.value === row.tagType">{{tag.label}}</span>
        </template>
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-switch
            @change="handleShowStatusChange(index, row)"
            :active-value="0"
            :inactive-value="1"
            v-model="row.isEnable">
          </el-switch>
        </template>
        <template slot="isTop" slot-scope="{ index,row }">
          <el-switch
            @change="handleTopChange(index, row)"
            :active-value="1"
            :inactive-value="0"
            v-model="row.isTop">
          </el-switch>
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
        <template slot="activeTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.activeTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <template v-for="type in fixedData">
              <td>
                <i class="red-star" :data-message="'请选择' + type.label" :data-name="type.value">*</i>
                {{type.label}}：
              </td>
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
            </template>
            <td><i class="red-star" data-message="请输入标题" data-name="title">*</i>标题：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入副标题" data-name="subTitle">*</i>副标题：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.subTitle" :disabled="dialog.readBool"></el-input>
            </td>
            <td>是否推送：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isPush" :disabled="dialog.readBool">
                <el-radio :label="1" border>是</el-radio>
                <el-radio :label="0" border>否</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>是否启用：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
                <el-radio :label="0" border>启用</el-radio>
                <el-radio :label="1" border>禁用</el-radio>
              </el-radio-group>
            </td>
            <td>是否立即推送：</td>
            <td>
              <el-radio-group v-model="isImmediately" v-if="dialog.ruleForm2.isPush === 1 && !dialog.ruleForm2.id">
                <el-radio :label="1" border>是</el-radio>
                <el-radio :label="0" border>否</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>是否置顶：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isTop" :disabled="dialog.readBool">
                <el-radio :label="1" border>是</el-radio>
                <el-radio :label="0" border>否</el-radio>
              </el-radio-group>
            </td>
            <td><i class="red-star" data-isdate="true" data-message="请选择生效时间" data-name="activeTime" v-if="isImmediately !== 1">*</i>生效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.activeTime"
                type="datetime"
                placeholder="选择生效时间"
                value-format="yyyy-MM-dd hh:mm:ss"
                :picker-options="expireTimeOption"
                :disabled="dialog.readBool" v-if="isImmediately !== 1">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入正文" data-name="content">*</i>正文：</td>
            <td colspan="3">
              <editor :disabled="dialog.readBool" :init="editorInit" v-model="dialog.ruleForm2.content"></editor>
            </td>
          </tr>
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
import {format} from "@/utils";
import CheckModule from '../../checkModule';
import selector from '@/components/Selector/filesEntry';
import Files from '@/components/Selector/files';
import Editor from '@tinymce/tinymce-vue';


let ruleForm = {
          tagType: 1,
          title: "",
          content: "",
          isEnable: 0,
          isTop: 0,
          type: 5,
          isPush: 0,
          activeTime: ''
        };
export default {
  data() {
    let _this = this;
    return {
      expireTimeOption: {
        disabledDate(date) { //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() <= Date.now() - 8.64e7;
        }
      },
      format,
      tagType: [{
              label: "公告",
              value: 1
            }, {
              label: "通知",
              value: 2
            }, {
              label: "新闻",
              value: 3
            }],
      isImmediately: 0,
      fixedData: [
        {
          label: "类型",
          value: "type",
          list: [
            {
              label: "通用",
              value: 99
            },
            {
              label: "消费者端",
              value: 1
            },
            {
              label: "商户端",
              value: 2
            }, {
              label: "推广员端",
              value: 3
            },
            {
              label: "生产企业/同城企业端",
              value: 4
            },
            {
              label: "管理端",
              value: 5
            }
          ]
        },
        // {
        //   label: "公告类型",
        //   value: "tagType",
        //   list: [
        //     {
        //       label: "公告",
        //       value: 1
        //     },
        //     // {
        //     //   label: "新闻",
        //     //   value: 3
        //     // }
        //   ]
        // }
      ],
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: "",
          name: "关键字",
          isText: true,
          placeholder: '编码/标题/副标题'
        }
      ],

      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: true,
        detailBool: true,
        arrDelBool: true,
        columns: [{
            value: "code",
            label: "编码",
            width: "150"
          }, {
            value: "title",
            label: "标题",
            width: "120"
          }, {
            value: "type",
            label: "类型",
            slotBool: true,
            width: "120"
          }, {
            value: "isEnable",
            label: "是否启用",
            slotBool: true,
            width: "120"
          }, {
            value: "isTop",
            label: "是否置顶",
            slotBool: true,
            width: "120"
          }, {
            value: "tagType",
            label: "公告类型",
            slotBool: true,
            width: "120"
          }, {
            value: "subTitle",
            label: "副标题",
            width: "120"
          }, {
            value: "content",
            label: "内容",
            slotBool: true,
            width: "120"
          }, {
            value: "activeTime",
            label: "生效时间",
            slotBool: true,
            width: "140"
          }]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      },

      dialog: {
        width: '800px',
        btnText: "创建公告",
        titleText: "创建公告",
        isTable: true,
        readBool: false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        ruleForm2: Object.assign({}, ruleForm),
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
          _this.subDialogImgs.innerVisible = false;
        }
      }
    };
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub,
    CheckModule,
    selector,
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

      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter: searchParameter,
        tagType: 1
      };
      return await this.Api.getPlatformMsg(para);
    },
    // 显示创建界面
    handleAdd() {
      this.dialog.titleText = "创建公告";
      this.dialog.saveFormVisible = true;
    },
    handleDetail(params) {
      this.dialog.titleText = "查看公告";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
        // this.dialog.ruleForm2 = params;
      this.getInfo(params.id);
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑公告";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = false;
      // this.dialog.ruleForm2 = params;
      this.getInfo(params.id);
    },
    async getInfo(id) {
      let res = await this.Api.getPlatformMsgDetails({id});
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
        this.dialog.ruleForm2.activeTime = format(new Date(res.data.activeTime), 'yyyy-MM-dd hh:mm:ss');
      }
    },
    // 创建修改
    async handleSave(row, savePrompt) {
      let params = Object.assign({}, row, {
        noticeType: 5,
        tagType: 1
      });
      if (this.isImmediately === 1) {
        params.activeTime = format(new Date(), 'yyyy-MM-dd hh:mm:ss');
      } else {
        params.activeTime = format(new Date(params.activeTime), 'yyyy-MM-dd hh:mm:ss');
      }
      if (params.files) {
        params.picUrl = params.files.url;
      }
      if (!params.id) {
        savePrompt(this.Api.addPlatformMsg, params, () => {
          this.isImmediately = 0;
        });
      } else {
        savePrompt(this.Api.editPlatformMsg, params, () => {
          this.isImmediately = 0;
        });
      }
    },
    async handleDel(row, delPrompt) {
      //删除
      delPrompt(this.Api.delPlatformMsg, {
        id: row.id
      });
    },
    handleShowStatusChange(index, row) {
      row.isEnable = row.isEnable === 1 ? 0 : 1;
      this.$plug.prompt.del(() => {
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
            row.isEnable = row.isEnable === 1 ? 0 : 1;
          }
        });
      }, row, null, row.isEnable === 1 ? '启用该数据' : '禁用该数据');
    },
    handleTopChange(index, row) {
      row.isTop = row.isTop === 1 ? 0 : 1;
      this.$plug.prompt.del(() => {
        this.Api.topPlatformMsg({
          id: row.id,
          isTop: row.isTop
        }).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            row.isTop = row.isTop === 1 ? 0 : 1;
          }
        });
      }, row, null, row.isTop === 1 ? '置顶该条数据' : '取消置顶');
    },
    cancelSelect() {
      this.$refs.filesSelector && this.$refs.filesSelector.cancelSelect();
      this.subDialogImgs.innerVisible = false;
    },
    selectFiles() {
      this.$refs.filesSelector && this.$refs.filesSelector.emitSave();
    }
  },
  computed: {},
  async mounted() {}
};
</script>
<style type="text/scss" lang="scss" scoped>

</style>

<!-- 活动通知 -->
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
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination"
      >
        <template v-for="item in fixedData" :slot="item.value" slot-scope="{index,row }">
          <span v-for="type in item.list" :key="type.label" v-if="type.value === row[item.value]">
            {{type.label}}
          </span>
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
        <template slot="tagType" slot-scope="{index, row}">
          <span v-for="tag in tagType" :key="tag.value" v-if="tag.value === row.tagType">{{tag.label}}</span>
        </template>
        <template slot="goods" slot-scope="{index, row}">
          <span v-if="!!row.goods">{{row.goods.name}}</span>
        </template>
        <template slot="shop" slot-scope="{index, row}">
          <span v-if="!!row.shop">{{row.shop.name}}</span>
        </template>
        <template slot="activity" slot-scope="{index, row}">
          <span v-if="!!row.activity">{{row.activity.name}}</span>
        </template>
        <template slot="activeTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.activeTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave" @reset="handleCancel">
        <template slot="dialog">
          <tr>
            <template v-for="type in fixedData">
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
            </template>
            <td><i class="red-star" data-message="请输入标题" data-name="title">*</i>标题：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>副标题：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.subTitle" :disabled="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请选择通知内容" data-name="noticeType">*</i>通知内容：</td>
            <td>
              <el-select
                v-model="dialog.ruleForm2.noticeType"
                placeholder="请选择"
                :disabled="dialog.readBool"
                @change="changeNoticeType"
              >
                <el-option
                  v-for="item in noticeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>图片：</td>
            <td>
              <span v-if="dialog.readBool">
                <el-popover
                  placement="top"
                  trigger="hover"
                  popper-class="tootip-img-box"
                  v-model="adPicUrlVisible">
                  <img :src="dialog.ruleForm2.picUrl"/>
                  <span slot="reference">
                    <img class="images-small" :src="dialog.ruleForm2.picUrl"/>
                  </span>
                </el-popover>
              </span>
              <selector ref="selector" :dialog="subDialogImg" @submit="handleSelectFiles" v-else></selector>
            </td>
            <td><i class="red-star" data-message="请选择是否推送" data-name="isPush">*</i>是否推送：</td>
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
            <td>立即推送：</td>
            <td>
              <el-radio-group v-model="isImmediately" v-if="dialog.ruleForm2.isPush === 1 && !dialog.ruleForm2.id">
                <el-radio :label="1" border>是</el-radio>
                <el-radio :label="0" border>否</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择是否置顶" data-name="isTop">*</i>是否置顶：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isTop" :disabled="dialog.readBool">
                <el-radio :label="1" border>是</el-radio>
                <el-radio :label="0" border>否</el-radio>
              </el-radio-group>
            </td>
            <td><i class="red-star" data-message="请选择生效时间" data-name="activeTime" v-if="isImmediately !== 1">*</i>生效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.activeTime"
                type="datetime"
                placeholder="选择生效时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="expireTimeOption"
                :disabled="dialog.readBool" v-if="isImmediately !== 1">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" :data-message="dialog.ruleForm2.noticeType == 3 ? '请输入链接' : '请选择' + moduleLable" data-name="subTitle" :data-name="noticeType[dialog.ruleForm2.noticeType - 1].name">*</i>{{dialog.ruleForm2.noticeType == 3 ? '链接' : moduleLable}}：</td>
            <td colspan="3">
              <template v-if="dialog.ruleForm2.noticeType == 1 || dialog.ruleForm2.noticeType == 2 || dialog.ruleForm2.noticeType == 4">
                <check-module :key="dialog.ruleForm2.noticeType" ref="checkmodule" :dialog="subDialog" :disabled="dialog.readBool" @submit="handleSelect"></check-module>
              </template>
              <template label="链接" prop="linkUrl" v-else-if="dialog.ruleForm2.noticeType == 3">
                <el-input v-model="dialog.ruleForm2.linkUrl" :disabled="dialog.readBool"></el-input>
              </template>
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
import {format} from "@/utils";
import CheckModule from '../../checkModule';
import selector from '@/components/Selector/filesEntry';

let subDialog = {
        innerVisible: false,
        addBool: true,
        type: 1,
        nameVal: ['title', 'nickName', 'name', 'name', 'name', 'name', 'name'],
        tableType: 'radio',
        goods: {},
        shop: {},
        activity: {}
      };
let subDialogImg = {
          innerVisible: false,
          addBool: true,
          tableType: 'radio',
          type: 5,
          nameVal: 'name',
          files: {}
        };
let ruleForm = {
          title: "",
          tagType: 1,
          isEnable: 0,
          isTop: 0,
          type: 5,
          isPush: 0,
          noticeType: 1,
          goods: {
            id: ''
          },
          shop: {
            id: ''
          },
          activity: {
            id: ''
          },
          files: {
            id: ''
          }
        };
export default {
  data() {
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
      moduleLable: '商品',
      isImmediately: 0,
      noticeType: [{
        value: 1,
        label: '商品',
        name: 'goods'
      }, {
        value: 2,
        label: '商户',
        name: 'shop'
      }, {
        value: 3,
        label: '链接',
        name: 'linkUrl'
      }, {
        value: 4,
        label: '活动',
        name: 'activity'
      }],
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
        }
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
        columns: [
          {
            value: "code",
            label: "编码",
            width: "150"
          },
          {
            value: "title",
            label: "标题",
            width: "120"
          },
          {
            value: "type",
            label: "类型",
            slotBool: true,
            width: "120"
          },
          {
            value: "isEnable",
            label: "是否启用",
            slotBool: true,
            width: "120"
          },
          {
            value: "isTop",
            label: "是否置顶",
            slotBool: true,
            width: "120"
          },
          {
            value: "tagType",
            label: "公告类型",
            slotBool: true,
            width: "120"
          },
          {
            value: "subTitle",
            label: "副标题",
            width: "120"
          },
          {
            value: 'picUrl',
            label: '图片',
            width: '120',
            isImg: true
          },
          // {
          //   value: "linkUrl",
          //   label: "链接",
          //   width: "120"
          // },
          // {
          //   value: "goods",
          //   label: "商品",
          //   slotBool: true,
          //   width: "120"
          // },
          // {
          //   value: "shop",
          //   label: "店铺",
          //   slotBool: true,
          //   width: "120"
          // },
          // {
          //   value: "activity",
          //   label: "活动",
          //   slotBool: true,
          //   width: "120"
          // },
          {
            value: "activeTime",
            label: "生效时间",
            slotBool: true,
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
        btnText: "创建活动通知",
        titleText: "创建活动通知",
        isTable: true,
        readBool: false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        ruleForm2: Object.assign({}, ruleForm),
        rules2: {
          title: this.$plug.valid.isNull(),
          isPush: this.$plug.valid.isNull(),
          isTop: this.$plug.valid.isNull(),
          type: this.$plug.valid.isNull(),
          linkUrl: this.$plug.valid.isNull(),
          goods: {
            id: this.$plug.valid.isNull(),
          },
          shop: {
            id: this.$plug.valid.isNull(),
          },
          activity: {
            id: this.$plug.valid.isNull(),
          },
          noticeType: this.$plug.valid.isNull(),
          files: this.$plug.valid.isNull()
          // activeTime: this.$plug.valid.isNull()
        }
      },
      subDialog: Object.assign({}, subDialog),
      adPicUrlVisible: false,
      subDialogImg: Object.assign({}, subDialogImg),

    };
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub,
    CheckModule,
    selector
  },
  methods: {
    changeNoticeType(type) {
      switch(type) {
        case 4:
          this.moduleLable = '活动';
          this.subDialog.type = 6;
          this.subDialog.activity = Object.assign({}, this.dialog.ruleForm2.activity);
        break;
        case 1:
          this.moduleLable = '商品';
          this.subDialog.type = 1;
          this.subDialog.goods = Object.assign({}, this.dialog.ruleForm2.goods);
        break;
        case 2:
          this.moduleLable = '线上店铺';
          this.subDialog.type = 2;
          this.subDialog.shop = Object.assign({}, this.dialog.ruleForm2.shop);
        break;
      }
    },
    handleSelect(row, type) {
      switch(type) {
        case 1:
          this.dialog.ruleForm2.goods = Object.assign({}, this.dialog.ruleForm2.goods, row);
        break;
        case 2:
          this.dialog.ruleForm2.shop = Object.assign({}, this.dialog.ruleForm2.shop, row);
        break;
        case 6:
          this.dialog.ruleForm2.activity = Object.assign({}, this.dialog.ruleForm2.activity, row);
        break;
      }
    },
    handleSelectFiles(row) {
      this.dialog.ruleForm2.files = Object.assign({}, this.dialog.ruleForm2.files, row);
    },
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
        tagType: 2
      };
      return await this.Api.getPlatformMsg(para);
    },
    // 显示创建界面
    handleAdd() {
      this.dialog.titleText = "创建活动通知";
      this.dialog.saveFormVisible = true;
    },
    handleDetail(params) {
      this.dialog.titleText = "查看活动通知";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
        // this.dialog.ruleForm2 = params;
      this.getInfo(params.id);
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑活动通知";
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
        this.changeNoticeType(res.data.noticeType);
      }
    },
    // 创建修改
    async handleSave(row, savePrompt) {
      let params = Object.assign({}, row, {
        tagType: 2
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
          this.moduleInit();
        });
      } else {
        savePrompt(this.Api.editPlatformMsg, params, () => {
          this.isImmediately = 0;
          this.moduleInit();
        });
      }
    },
    moduleInit() {
      this.$nextTick(()=>{
        this.$refs.selector && this.$refs.selector.selectRemove();
        this.dialog.ruleForm2 = Object.assign({}, ruleForm);
        this.subDialog = Object.assign({}, subDialog);
        this.subDialogImg = Object.assign({}, subDialogImg);
        if (this.dialog.ruleForm2.noticeType == 2 || this.dialog.ruleForm2.noticeType == 1 || this.dialog.ruleForm2.noticeType == 4) {
          this.$refs.checkmodule && this.$refs.checkmodule.clearSelect();
        }
      })
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
    },
    selectFiles() {
      this.$refs.filesSelector && this.$refs.filesSelector.emitSave();
    },
    handleCancel() {
      this.moduleInit();
    }
  },
  computed: {},
  async mounted() {}
};
</script>
<style type="text/scss" lang="scss" scoped>
.form-table{
  td{
    &:nth-child(odd){
      width: 120px;
    }
  }
}
</style>

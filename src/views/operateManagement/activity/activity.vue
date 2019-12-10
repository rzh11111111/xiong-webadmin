<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog" @add="handleAdd" >
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :dialog="dialog" :pagination="pagination" @detail="handleDetail" @edit="handleEdit" @del="handleDel">
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
        <template slot="bgColor" slot-scope="{index, row}">
          {{row.bgColor}}
          <div :style="'height: 20px;border:1px solid #dfdfdf;background-color:' + row.bgColor" v-if="!!row.bgColor"></div>
        </template>
        <template slot="saleGoodsGroup" slot-scope="{ index,row }">
          <template v-if="!!row.saleGoodsGroup">
            <el-popover
              placement="top-start"
              width="250"
              trigger="hover"
              :content="row.saleGoodsGroup.name">
              <p class="ellipsis" slot="reference">{{row.saleGoodsGroup.name}}</p>
            </el-popover>
          </template>
        </template>
        <!-- <template slot="table" slot-scope="{index, row}">
          <el-button type="text"
                     size="mini"
                     v-if="row.status == 1"
                     @click.stop="handleRelease(index, row)">发布
          </el-button>
          <el-button type="text"
                     size="mini"
                     v-if="row.status == 1"
                     @click.stop="handleEdit(index, row)">编辑
          </el-button>
          <el-button type="text"
                     size="mini"
                     @click.stop="handleDetail(index, row)">详情
          </el-button>
        </template> -->
      </table-sub>
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave" @reset="handleCancel" :customValidate="handleValidate">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入活动名称" data-name="name">*</i>活动名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入活动展示标题" data-name="title">*</i>活动展示标题：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入序号" data-name="sortNo">*</i>序号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请选择生效时间" data-name="activeTime">*</i>生效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.activeTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择生效时间" :disabled="dialog.readBool">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择是否启用" data-name="isEnable">*</i>是否启用：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">停用</el-radio>
              </el-radio-group>
            </td>
            <td><i class="red-star" data-message="请选择失效时间" data-name="invalidTime">*</i>失效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.invalidTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择失效时间" :disabled="dialog.readBool">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择是否推荐到首页" data-name="isTop">*</i>推荐到首页：</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isTop" :disabled="dialog.readBool">
                <el-radio :label="1">推荐</el-radio>
                <el-radio :label="0">不推荐</el-radio>
              </el-radio-group>
            </td>
            <td>背景色：</td>
            <td>
              <el-color-picker v-model="dialog.ruleForm2.bgColor" :disabled="dialog.readBool"></el-color-picker>
            </td>
          </tr>
          <tr>
            <td>活动展示图标：</td>
            <td>
              <selector ref="icoUrl" key="icoUrl" :dialog="subDialogIco" :disabled="dialog.readBool" @submit="handleSelectIco"></selector>
            </td>
            <td>活动展示图：</td>
            <td>
              <selector ref="picUrl" key="picUrl" :dialog="subDialogPic" :disabled="dialog.readBool" @submit="handleSelectPic"></selector>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择关联到商品分组" data-name="saleGoodsGroup" data-subname="id">*</i>关联到商品分组：</td>
            <td colspan="3">
              <check-module ref="goodsGroup" :dialog="subDialogGoodsGroup" :disabled="dialog.readBool" @submit="handleSelect"></check-module>
            </td>
          </tr>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {format} from "@/utils";
  import bus from '@/utils/bus.js'
  import CheckModule from '../../checkModule';
  import selector from '@/components/Selector/filesEntry';
  let ruleForm = {
            name: '',
            title: '',
            icoUrl: '',
            picUrl: '',
            picUrlObj: {},
            icoUrlObj: {},
            bgColor: '',
            activeTime: null,
            invalidTime: null,
            sortNo: null,
            isEnable: 0,
            isTop: 0,
            saleGoodsGroup: {
              id: ''
            }
          };
  let subDialogIco = {
    innerVisible: false,
    addBool: true,
    type: 5,
    tableType: 'radio',
    files: {}
  };
  let subDialogPic = {
    innerVisible: false,
    addBool: true,
    type: 5,
    tableType: 'radio',
    files: {}
  };
  let subDialogGoodsGroup = {
    innerVisible: false,
    addBool: true,
    type: 7,
    tableType: 'radio',
    goodsGroup: {}
  };

  export default {

    data() {
      return {
        searchBool: false,
        format,
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'isEnable',
            label: '',
            selected: '',
            list: [{
              value: 0,
              label: '启用'
            }, {
              value: 1,
              label: '停用'
            }]
          }]
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '编码/名称/标题/商品分组名称'
        }, {
          value: 'isTop',
          label: '',
          name: '推荐到首页',
          isSelect: true,
          list: [{
            value: 1,
            label: '推荐'
          }, {
            value: 0,
            label: '不推荐'
          }]
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '生效时间段'
        }],

        table: {
          detailBool: true,
          // editBool: true,
          delBool: true,
          emitEditBool: true,
          emitDelBool: true,
          emitDetailBool: true,
          arrDelBool: true,
          columns: [{
            value: 'code',
            label: '编码',
            width: '100'
          }, {
            value: 'sortNo',
            label: '序号',
            width: '100',
            sortable: true
          }, {
            value: 'name',
            label: '活动名称',
            width: '100'
          }, {
            value: 'isEnable',
            label: '是否启用',
            width: '100',
            slotBool: true
          }, {
            value: 'isTop',
            label: '是否推荐到首页',
            width: '120',
            slotBool: true
          }, {
            value: 'title',
            label: '活动展示标题',
            width: '100'
          }, {
            value: 'icoUrl',
            label: '活动展示图标',
            width: '100',
            isShow: true
          }, {
            value: 'picUrl',
            label: '活动展示图',
            width: '120',
            isShow: true
          }, {
            value: 'bgColor',
            label: '活动背景色',
            width: '120',
            slotBool: true
          }, {
            value: 'saleGoodsGroup',
            label: '关联到商品分组',
            width: '120',
            slotBool: true
          }, {
            value: 'activeTime',
            label: '活动开启时间',
            width: '120'
          }, {
            value: 'invalidTime',
            label: '活动关闭时间',
            width: '120'
          }, {
            value: 'updateBy',
            label: '最近操作人',
            width: '100'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          width: '800px',
          btnText: '创建活动',
          titleText: '创建活动',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          readBool: false,
          ruleForm2: Object.assign({}, ruleForm)
        },
        subDialogIco,
        subDialogPic,
        subDialogGoodsGroup: Object.assign({}, subDialogGoodsGroup),
      }
    },
    components: {
      DialogSub,
      SearchSub,
      TableSub,
      CheckModule,
      selector
    },
    methods: {
      handleSelectIco(row) {
        this.dialog.ruleForm2.icoUrlObj = Object.assign({}, this.dialog.ruleForm2.icoUrlObj, row);
        this.dialog.ruleForm2.icoUrl = row.url;
      },
      handleSelectPic(row) {
        this.dialog.ruleForm2.picUrlObj = Object.assign({}, this.dialog.ruleForm2.picUrlObj, row);
        this.dialog.ruleForm2.picUrl = row.url;
      },
      handleSelect(row, type) {
        switch(type) {
          case 7:
            this.dialog.ruleForm2.saleGoodsGroup = Object.assign({}, this.dialog.ruleForm2.saleGoodsGroup, row);
            this.subDialogGoodsGroup.goodsGroup = Object.assign({}, row);
          break;
        }
      },
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected || item.selected === 0) {
              quick[item.value] = item.selected;
            }
          })
        }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter,
          isTop: queryPo.isTop
        }, quick);

        return await this.Api.getActivityList(para);
      },
      handleDetail(row) {
      	this.dialog.titleText = '查看活动详情';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
        this.dialog.ruleForm2 = Object.assign({}, ruleForm, row);
        this.subDialogGoodsGroup = Object.assign({}, subDialogGoodsGroup, {goodsGroup: row.saleGoodsGroup});
        this.subDialogPic.files = {url: row.picUrl};
        this.subDialogIco.files = {url: row.icoUrl};
      },
      handleEdit(row) {
      	this.dialog.titleText = '编辑活动';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.ruleForm2 = Object.assign({}, ruleForm, row);
        this.subDialogGoodsGroup.goodsGroup = Object.assign({}, row.saleGoodsGroup);
        this.subDialogPic.files = {url: row.picUrl};
        this.subDialogIco.files = {url: row.icoUrl};
      },
      handleShowStatusChange(index, row) {
        row.isEnable = row.isEnable === 1 ? 0 : 1;
        this.$plug.prompt.del(() => {
          this.Api.enableActivity({
            id: row.id
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
          this.Api.topActivity({
            id: row.id
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
        }, row, null, row.isTop === 1 ? '取消推荐' : '推荐到首页');
      },
      handleValidate() {
        let row = this.dialog.ruleForm2;
        let activeTime = new Date(row.activeTime).valueOf();
        if (new Date(row.invalidTime).valueOf() <= activeTime) {
          this.$message({
            type: 'error',
            message: '失效时间必须大于生效时间'
          });
          return false;
        }
        return true;
      },
      async handleSave(row, savePrompt, type) {

        let params = Object.assign({}, row);
        if (this.subDialogPic.files && this.subDialogPic.files.url) {
          params.picUrl = this.subDialogPic.files.url;
        }
        if (this.subDialogIco.files && this.subDialogIco.files.url) {
          params.icoUrl = this.subDialogIco.files.url;
        }
        if (!row.id) {
          savePrompt(this.Api.addActivity, params, this.clearSelect);
        } else {
          savePrompt(this.Api.editActivity, params, this.clearSelect);
        }
      },
      clearSelect() {
        this.subDialogPic = Object.assign({}, subDialogPic);
        this.subDialogIco = Object.assign({}, subDialogIco);
        this.subDialogGoodsGroup = Object.assign({}, subDialogGoodsGroup);
        this.$nextTick(() => {
          this.$refs.icoUrl && this.$refs.icoUrl.selectRemove();
          this.$refs.picUrl && this.$refs.picUrl.selectRemove();
          this.$refs.goodsGroup && this.$refs.goodsGroup.clearSelect();
        })
      },
      handleCancel() {
        this.clearSelect();
      },
      handleDel(row, delPrompt, type) { //删除
        delPrompt(this.Api.delActivity, {id: row.id});
      },
      handleAdd() {
        this.dialog.saveFormVisible = true;
        this.dialog.titleText = '创建活动';
        this.dialog.readBool = false;
        this.dialog.ruleForm2 = Object.assign({}, ruleForm);
        this.subDialogPic.files = {};
        this.subDialogIco.files = {};
      }
    },
    computed: {},
    async mounted() {
    }
  }
</script>


<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd">
       <!--  <template slot="arrDel">
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="arrDel">批量删除
          </el-button>
        </template> -->
      </search-sub>
      <table-sub @del="handleDel" @add="handleAdd" @detail="handleDetail" @edit="handleEdit"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="adPicUrl" slot-scope="{index,row }">
            <img :src="row.adPicUrl" width="40"/>
        </template>
        <template slot="positionType" slot-scope="{index,row }">
            <span v-for="item in positionType" :key="item.value" v-if="row.positionType === item.value">
              {{item.label}}
            </span>
        </template>
        <template slot="isEnable" slot-scope="{index, row}">
          <el-switch
            @change="handleShowStatusChange(index, row)"
            :active-value="0"
            :inactive-value="1"
            v-model="row.isEnable">
          </el-switch>
        </template>
        <template slot="appType" slot-scope="{index,row }">
          <template v-for="type in appType" v-if="type.value == row.appType">
            {{type.label}}
          </template>
        </template>
     <!--    <template slot="store" slot-scope="{index, row}">
          <span v-if="row.adType == 3 && !!row.store">code: {{row.store.code}} <br/>{{row.store.name}}</span>
          <span v-else-if="row.adType == 4 && !!row.shop">code: {{row.shop.code}} <br/>{{row.shop.nickname}}</span>
        </template>
        <template slot="goods" slot-scope="{index, row}">
          <span v-if="!!row.goods">
            code: {{row.goods.code}}<br/>
            {{row.goods.name}}
          </span>
        </template> -->
        <template slot="adType" slot-scope="{index,row }">
          <template v-for="type in adType" v-if="type.value == row.adType">
            {{type.label}}
          </template>
        </template>
        <!-- <template slot="linkUrl" slot-scope="{index, row}">
          <el-popover
            placement="top"
            trigger="hover"
            popper-class="tootip-box"
            :content="row.linkUrl">
            <span class="ellipsis" slot="reference">{{row.linkUrl}}</span>
          </el-popover>
        </template> -->
        <template slot="eventType" slot-scope="{index,row }">
          <template v-for="type in eventType" v-if="type.value == row.eventType">
            {{type.label}}
          </template>
        </template>
        <template slot="bgColor" slot-scope="{index,row }">
          <p :style="'margin: 0 auto;width: 20px;height: 20px;background-color: ' + row.bgColor"></p>
          <span>{{row.bgColor}}</span>
        </template>
      </table-sub>
      <dialog-sub ref="dialog" :dialog="dialog" :getDataList="getDataList" @submit="handleSave" @reset="handleCancel" :customValidate="handleValidate">
        <template slot="dialog">
            <tr>
              <td>编码:</td>
              <td width="320">
                <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
              </td>
              <td><i class="red-star" data-message="请输入广告标题" data-name="title">*</i>广告标题:</td>
              <td width="320">
                <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
              </td>
            </tr>
            <tr>
              <td><i class="red-star" data-message="请选择APP平台" data-name="appType">*</i>APP平台:</td>
              <td>
                <el-select v-model="dialog.ruleForm2.appType" placeholder="请选择" :disabled="dialog.readBool">
                  <el-option
                    v-for="item in appType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td><i class="red-star" data-message="请选择广告展示位" data-name="positionType">*</i>广告展示位:</td>
              <td>
                <el-select v-model="dialog.ruleForm2.positionType" placeholder="请选择" :disabled="dialog.readBool">
                  <el-option
                    v-for="item in positionType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td><i class="red-star" data-message="请选择广告类型" data-name="adType">*</i>广告类型:</td>
              <td>
                <el-select v-model="dialog.ruleForm2.adType" placeholder="请选择" :disabled="dialog.readBool" @change="changeAdType">
                  <el-option
                    v-for="item in adType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td><i class="red-star" data-message="请输入序号" data-name="sortNo">*</i>序号:</td>
              <td>
                <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
              </td>
            </tr>
            <tr>
              <td><i class="red-star" :data-message="dialog.ruleForm2.adType === 5 ? '请选择事件类型' : '请选择活动'" :data-name="dialog.ruleForm2.adType === 5 ? 'eventType' : 'activity'" v-if="dialog.ruleForm2.adType === 1 || dialog.ruleForm2.adType === 5">*</i>{{getAdTypeTitle()}}:</td>
              <td>
                <template v-if="dialog.ruleForm2.adType === 1">
                  <check-module ref="activity" key="activity" :dialog="subDialogActivity" :disabled="dialog.readBool" @submit="handleSelect"></check-module>
                </template>
                <template v-if="dialog.ruleForm2.adType === 5">
                  <el-select v-model="dialog.ruleForm2.eventType" placeholder="请选择" :disabled="dialog.readBool">
                    <el-option
                      v-for="item in eventType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </td>

              <td><i class="red-star" data-message="请选择广告展示图" data-name="adPicUrl">*</i>广告展示图:</td>
              <td>
                <span v-if="dialog.readBool">
                  <el-popover
                    placement="top"
                    trigger="hover"
                    popper-class="tootip-img-box"
                    v-model="adPicUrlVisible">
                    <img :src="dialog.ruleForm2.adPicUrl"/>
                    <span slot="reference">
                      <img class="images-small" :src="dialog.ruleForm2.adPicUrl"/>
                    </span>
                  </el-popover>
                </span>
                <selector ref="selector" :dialog="subDialogImg" @submit="handleSelectFiles" v-else></selector>
              </td>
            </tr>
            <tr>
              <td><i class="red-star" :data-message="dialog.ruleForm2.eventType === 2 ? '请选择模块标记' : '请输入链接'" :data-name="dialog.ruleForm2.eventType === 2 ? 'linkModuleType' : 'linkUrl'" v-if="dialog.ruleForm2.adType === 5 && showEventType()">*</i>{{dialog.ruleForm2.eventType === 2 ? '模块标记' : '链接'}}:</td>
              <td>
                <template v-if="dialog.ruleForm2.adType === 5">
                  <template v-if="dialog.ruleForm2.eventType === 1">
                    <el-input v-model="dialog.ruleForm2.linkUrl" :disabled="dialog.readBool"></el-input>
                  </template>
                  <template v-else-if="dialog.ruleForm2.eventType === 2">
                    <el-select v-model="dialog.ruleForm2.linkModuleType" placeholder="请选择" :disabled="dialog.readBool" @change="changelinkModuleType">
                        <el-option
                          v-for="item in linkModuleType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </template>
                </template>
              </td>
             <td>背景色:</td>
             <td>
               <el-color-picker v-model="dialog.ruleForm2.bgColor" :disabled="dialog.readBool"></el-color-picker>
             </td>
            </tr>
            <tr>
              <td><i class="red-star" :data-message="'请选择' + moduleLable" :data-name="moduleLables[subDialog.type - 1]" v-if="showModule()">*</i>{{moduleLable}}:</td>
              <td>
                <template v-if="showModule()">
                  <check-module ref="checkmodule" :dialog="subDialog" :disabled="dialog.readBool" @submit="handleSelect"></check-module>
                </template>
              </td>
              <td><i class="red-star" data-message="请选择生效时间" data-name="activeTime">*</i>生效时间:</td>
              <td>
                <el-date-picker
                  ref="activeTime"
                  v-model="dialog.ruleForm2.activeTime"
                  type="datetime"
                  popper-class="no-nowbtn"
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-value="new Date(Date.now().valueOf() + 1800000)"
                  placeholder="选择生效时间"
                  :disabled="dialog.readBool">
                </el-date-picker>
              </td>

            </tr>
            <tr>
              <td>是否启用:</td>
              <td>
                <el-radio-group v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
                  <el-radio :label="0" border>启用</el-radio>
                  <el-radio :label="1" border>禁用</el-radio>
                </el-radio-group>
              </td>
              <td><i class="red-star" data-message="请选择失效时间" data-name="invalidTime">*</i>失效时间:</td>
              <td>
                <el-date-picker
                  v-model="dialog.ruleForm2.invalidTime"
                  type="datetime"
                  popper-class="no-nowbtn"
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-value="new Date(Date.now().valueOf() + 1800000)"
                  placeholder="选择失效时间"
                  :disabled="dialog.readBool">
                </el-date-picker>
              </td>
            </tr>
          </table>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TableSub from '@/components/TableSub';
  import DialogSub from '@/components/DialogSub';
  import SearchSub from '@/components/SearchSub';
  import MultiUpload from '@/components/Upload/multiUpload';
  import {format} from "@/utils";
  import CheckModule from '../../checkModule';
  import selector from '@/components/Selector/filesEntry';
  let subDialog = {
          innerVisible: false,
          addBool: true,
          type: '',
          nameVal: ['title', 'nickName', 'name', 'name', 'name', 'name', 'name', 'name'],
          tableType: 'radio',
          goods: {},
          shop: {},
          store: {},
          activity: {},
          goodsGroup: {}
        };
  let subDialogImg = {
          innerVisible: false,
          addBool: true,
          tableType: 'radio',
          type: 5,
          nameVal: 'name',
          files: {}
        };
  let subDialogActivity = {
          innerVisible: false,
          addBool: true,
          type: 6,
          tableType: 'radio',
          activity: {}
        };
  export default {
    data() {
      let appType = [{
          label: '消费者APP',
          value: 1
        // }, {
        //   label: '商户APP',
        //   value: 2
        }];
      let adType = [{
          label: '活动广告',
          value: 1
        // }, {
        //   label: '商品广告',
        //   value: 2
        // }, {
        //   label: '线上店铺',
        //   value: 3
        // }, {
        //   label: '线下店铺',
        //   value: 4
        }, {
          label: '平台广告',
          value: 5
        }];
      let positionType = [{
          label: '消费者APP首页',
          value: 1
        }, {
          label: '消费者APP品牌商城首页',
          value: 2
        }, {
          label: '消费者APP本地优品首页',
          value: 3
        }, {
          label: '消费者APP商圈首页',
          value: 4
        }, {
          label: '消费者APP分类页',
          value: 5
        }, {
          label: '消费者APP搜索页',
          value: 6
        }, {
          label: '消费者APP个人中心',
          value: 7
        }, {
          label: '消费者APP启动广告',
          value: 8
        }];
      let eventType = [{
          label: '跳转链接',
          value: 1
        }, {
          label: '跳转APP模块',
          value: 2
        // }, {
        //   label: '跳转内容',
        //   value: 3
        }];
      let linkModuleType = [{
        //   label: 'web',
        //   value: 1
        // }, {
          label: '品牌商城',
          value: 1
        }, {
          label: '本地生活',
          value: 2
        }, {
          label: '本地优品',
          value: 3
        }, {
          label: '商品详情',
          value: 4
        }, {
          label: '线上商铺',
          value: 5
        }, {
          label: '线下店铺',
          value: 6
        // }, {
        //   label: '商品分组',
        //   value: 7
        }];
      let form = {
            title: '',
            appType: 1,
            adType: 1,
            positionType: 1,
            adPicUrl: '',
            files: {},
            eventType: 1,
            goods: {},
            shop: {},
            store: {},
            isEnable: 0
          };
      return {
        moduleLables: ['goods', 'shop', 'store'],
        moduleLable: '商品',
        appType,
        adType,
        positionType,
        eventType,
        linkModuleType,
        form,
        adPicUrlVisible: false,
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
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '编码/标题'
        }, {
          value: 'positionType',
          label: '',
          name: '广告展示位',
          isSelect: true,
          list: positionType
        }, {
          value: 'adType',
          label: '',
          name: '广告类型',
          isSelect: true,
          list: adType
        }, {
          value: 'appType',
          label: '',
          name: 'APP平台',
          isSelect: true,
          list: appType
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '创建时间段'
        }],

        table: {
          width: '200px',
          emitEditBool: true,
          emitDetailBool: true,
          detailBool: true,
          arrDelBool: true,
          columns: [{
            value: 'code',
            label: '编码',
            width: '100'
          }, {
            value: 'title',
            label: '广告标题',
            width: '150'
          }, {
            value: 'positionType',
            label: '广告展示位',
            slotBool: true,
            width: '150'
          }, {
            value: 'sortNo',
            label: '序号',
            width: '100'
          }, {
            value: 'adPicUrl',
            label: '广告展示图',
            // slotBool: true,
            isShow: true,
            width: '150'
          }, {
            value: 'isEnable',
            label: '是否启用',
            slotBool: true
          }, {
            value: 'adType',
            label: '广告类型',
            slotBool: true,
            width: '100'
          }, {
            value: 'eventType',
            label: '事件类型',
            slotBool: true,
            width: '100'
          }, {
            value: 'appType',
            label: 'APP平台',
            slotBool: true,
            width: '140'
          }, {
            value: 'bgColor',
            label: '背景色',
            slotBool: true,
            width: '100'
          }, {
            value: 'activeTime',
            label: '生效时间',
            width: '140'
          }, {
            value: 'invalidTime',
            label: '失效时间',
            width: '140'
          }, {
            value: 'createTime',
            label: '创建时间',
            width: '140'
          }, {
            value: 'updateTime',
            label: '更新时间',
            width: '140'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        subDialog: Object.assign({}, subDialog),
        subDialogActivity: Object.assign({}, subDialogActivity),
        subDialogImg: Object.assign({}, subDialogImg),
        dialog: {
          width: '1100px',
          btnText: '创建广告',
          titleText: '创建广告',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          readBool: false,
          tableBool: true,
          ruleForm2: Object.assign({}, form),
          rules2: {
            // title: this.$plug.valid.isNull(),
            // appType: this.$plug.valid.isNull(),
            // adType: this.$plug.valid.isNull(),
            // positionType: this.$plug.valid.isNull(),
            // files: this.$plug.valid.isNull(),
            // eventType: this.$plug.valid.isNull(),
            // moduleId: this.$plug.valid.isNull(),
            // linkUrl: this.$plug.valid.isNull(),
            // linkModuleType: this.$plug.valid.isNull(),
            // sortNo: this.$plug.valid.isNull(),
            // activeTime: this.$plug.valid.isNull()
          }
        }
      }
    },
    components: {
      DialogSub,
      SearchSub,
      TableSub,
      MultiUpload,
      CheckModule,
      selector
    },
    methods: {
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
      showEventType() {
        return this.dialog.ruleForm2.eventType === 1 || this.dialog.ruleForm2.eventType === 2;
      },
      showModule() {
        return this.dialog.ruleForm2.adType == 2 || this.dialog.ruleForm2.adType == 3 || this.dialog.ruleForm2.adType == 4 || (this.dialog.ruleForm2.eventType == 2 && this.dialog.ruleForm2.adType == 5 && (this.dialog.ruleForm2.linkModuleType == 4 || this.dialog.ruleForm2.linkModuleType == 5 || this.dialog.ruleForm2.linkModuleType == 6 || this.dialog.ruleForm2.linkModuleType == 7));
      },
      getAdTypeTitle() {
        switch(this.dialog.ruleForm2.adType * 1) {
          case 5:
            return '事件类型';
          default:
            return '活动';
        }
      },
      changeAdType(type) {
        switch(type) {
          case 1:
            this.moduleLable = '活动';
            this.subDialogActivity.type = 6;
            this.subDialogActivity.activity = Object.assign({}, this.dialog.ruleForm2.activity);
          break;
          case 2:
            this.moduleLable = '商品';
            this.subDialog.type = 1;
            this.subDialog.goods = Object.assign({}, this.dialog.ruleForm2.goods);
          break;
          case 3:
            this.moduleLable = '线上店铺';
            this.subDialog.type = 2;
            this.subDialog.shop = Object.assign({}, this.dialog.ruleForm2.shop);
          break;
          case 4:
            this.moduleLable = '线下店铺';
            this.subDialog.type = 3;
            this.subDialog.store = Object.assign({}, this.dialog.ruleForm2.store);
          break;
        }
        this.dialog.ruleForm2.eventType = 1;
      },
      changelinkModuleType(type) {
        switch(type) {
          case 4:
            this.moduleLable = '商品';
            this.subDialog.type = 1;
            this.subDialog.goods = Object.assign({}, this.dialog.ruleForm2.goods);
          break;
          case 5:
            this.moduleLable = '线上店铺';
            this.subDialog.type = 2;
            this.subDialog.shop = Object.assign({}, this.dialog.ruleForm2.shop);
          break;
          case 6:
            this.moduleLable = '线下店铺';
            this.subDialog.type = 3;
            this.subDialog.store = Object.assign({}, this.dialog.ruleForm2.store);
          break;
          case 7:
            this.moduleLable = '商品分组';
            this.subDialog.type = 7;
            this.subDialog.goodsGroup = Object.assign({}, this.dialog.ruleForm2.goodsGroup);
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
          case 3:
            this.dialog.ruleForm2.store = Object.assign({}, this.dialog.ruleForm2.store, row);
          break;
          case 6:
            this.dialog.ruleForm2.activity = Object.assign({}, this.dialog.ruleForm2.activity, row);
          break;
        }
      },
      handleSelectFiles(row) {
        this.dialog.ruleForm2.files = Object.assign({}, this.dialog.ruleForm2.files, row);
        this.dialog.ruleForm2.adPicUrl = this.dialog.ruleForm2.files.url;
      },
      handleShowStatusChange(index, row) {
        row.isEnable = row.isEnable === 1 ? 0 : 1;
        this.$plug.prompt.del(() => {
          this.Api.enableBanner({
            id: row.id
          }).then((res) => {
            if (res.status === 1) {
              row.isEnable = row.isEnable === 1 ? 0 : 1;
              return this.$plug.prompt.saveTip();
            }
          });
        }, row, null, row.isEnable === 1 ? '启用该数据' : '禁用该数据');
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
          searchParameter
        }, queryPo, quick);

        let res = await this.Api.getBannerList(para);
        return res;
      },
      handleDetail(params) {
        this.dialog.titleText = '查看广告';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
        // this.dialog.ruleForm2.files = this.dialog.ruleForm2.adPicUrl ? [this.dialog.ruleForm2.adPicUrl] : [];
        this.getInfo(params.id);
      },
      handleEdit(params) {
        this.dialog.titleText = '编辑广告';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        // this.dialog.ruleForm2.files = this.dialog.ruleForm2.adPicUrl ? [this.dialog.ruleForm2.adPicUrl] : [];

        this.getInfo(params.id);
      },
      // uploadImg(fileList) {
      //   if (!fileList || !fileList[0]) return ;
      //   this.dialog.ruleForm2.files = fileList;
      // },
      async getInfo(id) {
        let res = await this.Api.getBannerInfo({id});
        if (res.status == 1) {
          this.dialog.ruleForm2 = res.data;
          this.getFilesData(res.data.adPicUrl);
          let adType = this.dialog.ruleForm2.adType;
          if (adType == 1) {
            this.subDialogActivity.type = 6;
            this.subDialogActivity.activity = res.data.activity;
          } else if (adType == 2 || adType == 3 || adType == 4) {
            this.subDialog.type = adType - 1;
          } else if(this.dialog.ruleForm2.adType == 5) {
            this.changelinkModuleType(this.dialog.ruleForm2.linkModuleType)
            // if (this.dialog.ruleForm2.linkModuleType == 4) {
            //   this.subDialog.type = 1;
            // } else if(this.dialog.ruleForm2.linkModuleType == 5) {
            //   this.subDialog.type = 2;
            // } else if(this.dialog.ruleForm2.linkModuleType == 6) {
            //   this.subDialog.type = 3;
            // }
          }
          this.dialog.ruleForm2.files = {url: res.data.adPicUrl};
          this.subDialogImg.files = {url: res.data.adPicUrl};
          if (this.dialog.ruleForm2.adType !== 5) {
            this.changeAdType(this.dialog.ruleForm2.adType);
          }
        }
      },
      async getFilesData(param) {
        let resData = await this.Api.getResourceList({});
        if (resData.status === 1 && resData.data) {
          let files = resData.data || [];
          files.map(item => {
            if (item.url === param) {
              this.dialog.ruleForm2.files = item;
              this.subDialogImg.files = item;
            }
          })
        }
      },
      handleSave(row, savePrompt, type) {
        let params = Object.assign({}, row);
        switch(type) {
          case 1:
            delete params.shop;
            delete params.store;
          case 2:
            delete params.goods;
            delete params.store;
          break;
          case 3:
            delete params.shop;
            delete params.goods;
          break;
        }
        if (!row.id) {
          savePrompt(this.Api.addBanner, params, this.moduleInit);
        } else {
          savePrompt(this.Api.editBanner, params, this.moduleInit);
        }
      },
      moduleInit() {
        this.$nextTick(()=>{
          this.$refs.selector && this.$refs.selector.selectRemove();
          this.dialog.ruleForm2 = Object.assign({}, this.form);
          this.subDialog = Object.assign({}, subDialog);
          this.subDialogImg = Object.assign({}, subDialogImg);
          this.subDialogActivity = Object.assign({}, subDialogActivity);
          if (this.dialog.ruleForm2.adType == 2 || this.dialog.ruleForm2.adType == 3 || this.dialog.ruleForm2.adType == 4 || (this.dialog.ruleForm2.adType == 5 && (this.dialog.ruleForm2.linkModuleType == 4 || this.dialog.ruleForm2.linkModuleType == 5 || this.dialog.ruleForm2.linkModuleType == 6))) {
            this.$refs.checkmodule && this.$refs.checkmodule.clearSelect();
          }
          if (this.dialog.ruleForm2.adType === 1) {
            this.$refs.activity && this.$refs.activity.clearSelect();
          }
        })
      },
      // async handleBatchOperate(row,handleBatchOperate) {
      //  delPrompt(this.Api.deleteDict,row);
      // },
      handleDel(row, delPrompt) { //删除
        delPrompt(this.Api.delBanner, {
          "id": row.id
        });
      },
      handleAdd() {
        this.dialog.saveFormVisible = true;
        this.dialog.titleText = '新增广告';
        this.dialog.readBool = false;
        this.dialog.ruleForm2 = Object.assign({}, this.form);
        this.subDialogImg = Object.assign({}, subDialogImg);
        this.subDialog = Object.assign({}, subDialog);
        this.subDialogActivity = Object.assign({}, subDialogActivity);
      },
      handleCancel() {
        this.moduleInit();
      }
    },
    computed: {},
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>

</style>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :pagination="pagination" :dialog="dialog"
         @add="handleAdd">
       <!--  <template slot="arrDel">
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="arrDel">批量删除
          </el-button>
        </template> -->
      </search-sub>
      <table-sub ref="tableSub" :dialog="dialog" @del="handleDel" @detail="handleDetail"
                 @edit="handleEdit"  @add="handleAdd"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template v-for="item in fixedData" :slot="item.value" slot-scope="{index,row }">
          <span v-for="type in item.list" :key="type.label" v-if="type.value === row[item.value]">
            {{type.label}}
          </span>
        </template>
        <template slot="code" slot-scope="{ index,row }">
          <span>{{returnCode(row.code)}}</span>
        </template>
      </table-sub>

      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave" @reset="handleCancel">
        <template slot="dialog">
            <tr>
              <td><i class="red-star" data-message="请选择编码" data-name="code">*</i>编码：</td>
              <td>
                <el-select v-model="dialog.ruleForm2.code" placeholder="请选择" :disabled="dialog.readBool" @change="changeCode">
                    <el-option
                      v-for="item in codeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </td>
              <td><i class="red-star" :data-message="'请选择' + fixedData[0].label" data-name="code">*</i>{{fixedData[0].label}}：</td>
              <td>
                <el-select v-model="dialog.ruleForm2[fixedData[0].value]" placeholder="请选择" :disabled="dialog.readBool">
                  <el-option
                    v-for="item in fixedData[0].list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr v-for="(d, inx) in fixedData" :key="inx" v-if="inx !== 0 && inx % 2 !== 0">
              <td><i class="red-star" :data-message="'请选择' + d.label" :data-name="d.value">*</i>{{d.label}}：</td>
              <td>
                <el-select v-model="dialog.ruleForm2[d.value]" placeholder="请选择" :disabled="dialog.readBool">
                  <el-option
                    v-for="item in d.list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td v-if="!!fixedData[inx + 1]"><i class="red-star" :data-message="'请选择' + fixedData[inx + 1].label" :data-name="fixedData[inx + 1].value">*</i>{{fixedData[inx + 1].label}}：</td>
              <td v-if="!!fixedData[inx + 1]">
                <el-select v-model="dialog.ruleForm2[fixedData[inx + 1].value]" placeholder="请选择" :disabled="dialog.readBool">
                  <el-option
                    v-for="item in fixedData[inx + 1].list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>
                <i class="red-star" data-message="请选择事件类型" data-name="eventType">*</i>事件类型：</td>
              <td>
                <el-select v-model="dialog.ruleForm2.eventType" placeholder="请选择" @change="changeEventType" :disabled="dialog.readBool || dialog.ruleForm2.code === '7'">
                    <el-option
                      v-for="item in eventType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </td>
              <td>标题：</td>
              <td>
                <el-input v-model="dialog.ruleForm2.title" :disabled="dialog.readBool"></el-input>
              </td>
            </tr>
            <tr>
              <td><i class="red-star" data-message="请输入名称" data-name="name">*</i>名称：</td>
              <td>
                <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
              </td>
              <td>副标题：</td>
              <td>
                <el-input v-model="dialog.ruleForm2.subTitle" :disabled="dialog.readBool"></el-input>
              </td>
            </tr>
            <tr>
              <td>图标：</td>
              <td>
                <span v-if="dialog.readBool">
                  <el-popover
                    placement="top"
                    trigger="hover"
                    popper-class="tootip-img-box"
                    v-model="icoUrlVisible">
                    <img :src="dialog.ruleForm2.icoUrl"/>
                    <span slot="reference">
                      <img class="images-small" :src="dialog.ruleForm2.icoUrl"/>
                    </span>
                  </el-popover>
                </span>
                <selector ref="selector" :dialog="subDialogIco" @submit="handleSelectIco" v-else></selector>
              </td>
              <td>展示图：</td>
              <td>
                <span v-if="dialog.readBool">
                  <el-popover
                    placement="top"
                    trigger="hover"
                    popper-class="tootip-img-box"
                    v-model="picUrlVisible">
                    <img :src="dialog.ruleForm2.picUrl"/>
                    <span slot="reference">
                      <img class="images-small" :src="dialog.ruleForm2.picUrl"/>
                    </span>
                  </el-popover>
                </span>
                <selector ref="selectorImg" :dialog="subDialogImg" @submit="handleSelectImg" v-else></selector>
              </td>
            </tr>
            <tr>
              <td>主色：</td>
              <td>
                <el-color-picker v-model="dialog.ruleForm2.color" :disabled="dialog.readBool"></el-color-picker>
              </td>
              <td>辅色：</td>
              <td>
                <el-color-picker v-model="dialog.ruleForm2.subColor" :disabled="dialog.readBool"></el-color-picker>
              </td>
            </tr>
            <tr>
              <td>
                <i class="red-star" :data-message="'请选择' + eventTypeSub[getEventType() - 1]" :data-name=" eventTypeSubVal[getEventType() - 1]" v-if="!!getEventType()">*</i>{{eventTypeSub[(getEventType() || 1) - 1]}}：
              </td>
              <td colspan="3">
                <template label="链接" prop="href" v-if="dialog.ruleForm2.eventType == 4">
                  <el-input v-model="dialog.ruleForm2.href" :disabled="dialog.readBool"></el-input>
                </template>
                <template label="内容ID" prop="contentId" v-else-if="dialog.ruleForm2.eventType == 8 || dialog.ruleForm2.eventType == 9 || dialog.ruleForm2.eventType == 10">
                  <check-module :dialog="subDialog" @submit="handleSelect" :disabled="dialog.readBool"></check-module>
                </template>
                <template label="内容" prop="message" v-else-if="dialog.ruleForm2.eventType == 1 || dialog.ruleForm2.eventType == 2 || dialog.ruleForm2.eventType == 3">
                  <el-input v-model="dialog.ruleForm2.message" :disabled="dialog.readBool"></el-input>
                </template>
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
import MultiUpload from '@/components/Upload/multiUpload';
import selector from '@/components/Selector/filesEntry';
import CheckModule from '../../checkModule';

  export default {
    data() {
      let eventType = [{
            label: '弹出面板',
            value: 1
          }, {
            label: '弹出确定提示',
            value: 2
          }, {
            label: '弹出是否提示',
            value: 3
          }, {
            label: '跳转web',
            value: 4
          }, {
            label: '品牌商城',
            value: 5
          }, {
            label: '本地生活',
            value: 6
          }, {
            label: '本地优品',
            value: 7
          }, {
            label: '商品详情',
            value: 8
          }, {
            label: '线上商铺',
            value: 9
          }, {
            label: '线下店铺',
            value: 10
          // }, {
          //   label: '商品分组',
          //   value: 11
          }, {
            label: '显示',
            value: 12
          }, {
            label: '隐藏',
            value: 13
          }];
      let code = [{
        label: '品牌商城',
        value: '1'
      }, {
        label: '本地生活',
        value: '2'
      }, {
        label: '本地优品',
        value: '3'
      }, {
        label: '底部tab1',
        value: '4'
      }, {
        label: '底部tab2',
        value: '5'
      }, {
        label: '底部tab3',
        value: '6'
      }, {
        label: '首页GIF动画',
        value: '7'
      }, {
        label: '红包相关显示隐藏',
        value: '8'
      }]
      return {
        eventType,
        eventTypeSub: ['链接', '内容', '内容Id'],
        eventTypeSubVal: ['href', 'message', 'contentId'],
        icoUrlVisible: false,
        picUrlVisible: false,
        codeList: code,
      	fixedData: [{
        //   label: '编码',
        //   value: 'code',
        //   list: code
        // }, {
      		label: '适配平台',
      		value: 'appType',
      		list: [{
      			label: 'IOS',
      			value: 1
      		}, {
      			label: 'Android',
      			value: 2
      		}],
      	}, {
      		label: '业务模块',
      		value: 'serviceType',
      		list: [{
      			label: '首页',
      			value: 1
      		}, {
      			label: '商城',
      			value: 2
      		}, {
      			label: '本地生活',
      			value: 3
      		}, {
      			label: '本地优品',
      			value: 4
      		}, {
            label: '页面设置',
            value: 5
          }]
      	}, {
      			label: '所属页面',
      			value: 'pageType',
      			list: [{
	      			label: '列表',
	      			value: 1
	      		}, {
	      			label: '详情',
	      			value: 2
	      		}, {
	      			label: '分类导航',
	      			value: 3
	      		}, {
	      			label: '功能设置',
	      			value: 4
	      		}, {
              label: '分享红包相关',
              value: 5
            }]
      	}, {
      		label: '区域类型',
      		value: 'areaType',
      		list: [{
	      		label: '标题栏',
	      		value: 1
	      	}, {
	      		label: '头部',
	      		value: 2
	      	}, {
	      		label: '身体',
	      		value: 3
	      	}, {
	      		label: '底部',
	      		value: 7
	      	}]
	      }, {
      		label: '组件类型',
      		value: 'moduleType',
      		list: [{
	      		label: '按钮',
	      		value: 1
	      	}, {
	      		label: '区块',
	      		value: 2
	      	}, {
	      		label: '标签',
	      		value: 3
	      	}, {
	      		label: '列表',
	      		value: 4
	      	}]
        }],
        searchBool: false,
        searchObj: [{
        	value: 'keyWord',
        	label: '',
        	name: '关键字',
        	isText: true,
          placeholder: '名称/标题/副标题'
        }],

        table: {
          width: '200px',
          emitEditBool: true,
          emitDetailBool: true,
          detailBool: true,
          arrDelBool: true,
          columns: [{
            value: 'code',
            label: '编号',
            slotBool: true,
            width: '100'
          }, {
            value: 'name',
            label: '名称',
            width: '150'
          }, {
            value: 'appType',
            label: '适配平台',
            slotBool: true,
            width: '100'
          }, {
            value: 'serviceType',
            label: '业务模块',
            slotBool: true,
            width: '140'
          }, {
            value: 'pageType',
            label: '所属页面',
            slotBool: true,
            width: '100'
          }, {
            value: 'areaType',
            label: '区域类型',
            slotBool: true,
            width: '140'
          }, {
            value: 'moduleType',
            label: '组件类型',
            slotBool: true,
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
        subDialog: {
          innerVisible: false,
          addBool: true,
          type: '',
          tableType: 'radio',
          nameVal: ['title', 'nickName', 'name', 'name', 'name', 'name', 'name'],
          goods: {},
          shop: {},
          store: {}
        },
        subDialogIco: {
          innerVisible: false,
          addBool: true,
          tableType: 'radio',
          type: 5,
          nameVal: 'name',
          files: {}
        },
        subDialogImg: {
          innerVisible: false,
          addBool: true,
          tableType: 'radio',
          type: 5,
          nameVal: 'name',
          files: {}
        },
        dialog: {
          btnText: '创建配置',
          titleText: '创建配置',
          saveLoading: false,
          isTable: true,
          saveFormVisible: false,
          pavalBool: true,
          readBool: false,
          tableBool: true,
          ruleForm2: {
            code: '',
          	name: '',
          	appType: '',
          	serviceType: '',
          	pageType: '',
          	areaType: '',
          	moduleType: '',
            picUrl: '',
            icoUrl: '',
            color: '',
            subColor: ''
          }
        }
      }
    },
    components: {
      DialogSub,
      SearchSub,
      TableSub,
      MultiUpload,
      selector,
      CheckModule
    },
    methods: {
      getEventType() {
        switch(this.dialog.ruleForm2.eventType * 1) {
          case 1:
          case 2:
          case 3:
            return 2;
          case 4:
            return 1;
          case 8:
          case 9:
          case 10:
            return 3;
          default:
            return 0;
        }
      },
      handleSelect(row, type) {
        this.dialog.ruleForm2.contentId = row.id;
      },
      // uploadPic(fileList) {
      //   if (!fileList || !fileList[0]) return ;
      //   this.dialog.ruleForm2.picUrls = fileList;
      // },
      // uploadImg(fileList) {
      //   if (!fileList || !fileList[0]) return ;
      //   this.dialog.ruleForm2.icoUrl = fileList;
      // },
      async getDataList() { //获取列表
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
        }
        return await this.Api.getAppBaseConfig(para);
      },
      handleDetail(params) {
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
      	this.dialog.titleText = '查看配置';
        this.getInfo();
      },
      handleEdit(params) {
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
      	this.dialog.titleText = '编辑配置';
        this.getInfo();
      },
      changeCode(type) {
        switch(type) {
          case '7':
            this.dialog.ruleForm2.eventType = 4;
            // this.changeEventType(3);
          break;
        }
      },
      changeEventType(type) {
        this.dialog.ruleForm2.contentId = '';
        switch(type) {
          case 8:
            this.subDialog.type = 1;
            this.subDialog.goods = Object.assign({}, this.dialog.ruleForm2.goods);
          break;
          case 9:
            this.subDialog.type = 2;
            this.subDialog.shop = Object.assign({}, this.dialog.ruleForm2.shop);
          break;
          case 10:
            this.subDialog.type = 3;
            this.subDialog.store = Object.assign({}, this.dialog.ruleForm2.store);
          break;
        }
      },
      handleAdd() {
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.titleText = '创建配置';
      },
      handleSelectImg(row, type) {
        this.subDialogImg.files = Object.assign({}, this.subDialogImg.files, row);
        this.dialog.ruleForm2.picUrl = this.subDialogImg.files.url;
      },
      handleSelectIco(row, type) {
        this.subDialogIco.files = Object.assign({}, this.subDialogIco.files, row);
        this.dialog.ruleForm2.icoUrl = this.subDialogIco.files.url;
      },
      async getInfo() {
        let res = await this.Api.getAppBaseConfigInfo({id: this.dialog.ruleForm2.id});
        if (res.status === 1) {
          this.dialog.ruleForm2 = res.data;
          this.subDialogImg.files = {url: res.data.picUrl};
          this.subDialogIco.files = {url: res.data.icoUrl};
          this.changeEventType(res.data.eventType);
        }
      },
      async handleSave(row, savePrompt, type) {
        if (!row.id) {
          savePrompt(this.Api.addAppBaseConfig, row, this.selectInit);
        } else {
          savePrompt(this.Api.editAppBaseConfig, row, this.selectInit);
        }
      },
      selectInit() {
        this.$refs.selector && this.$refs.selector.selectRemove();
        this.$refs.selectorImg && this.$refs.selectorImg.selectRemove();
        this.subDialogImg.files = {};
        this.subDialogIco.files = {};
      },
      handleCancel() {
        this.selectInit();
      },
      async handleDel(row, delPrompt) { //删除
        delPrompt(this.Api.delAppBaseConfig, {
          "id": row.id
        });
      },
      returnCode(type) {
        switch (type) {
          case '1':
            return '品牌商城';
          case '2':
            return '本地生活';
          case '3':
            return '本地优品';
          case '4':
            return '底部tab1';
          case '5':
            return '底部tab2';
          case '6':
            return '底部tab3';
          case '7':
            return '首页gif动画';
        }
      }
    },
    computed: {},
    async mounted() {
    }
  }
</script>

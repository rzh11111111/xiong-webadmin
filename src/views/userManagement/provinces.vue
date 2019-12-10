<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :timeRangeVal="['time1']" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog" :pagination="pagination"
                  @add="handleAdd">
        <!--<template slot="arrDel">-->
        <!--<el-button size="mini" icon="el-icon-delete" type="danger" @click="arrDel">批量删除-->
        <!--</el-button>-->
        <!--</template>-->
      </search-sub>
      <!--表格-->
      <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :dialog="dialog"
          @submit="handleSave"
             :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="managerDutyAreaConfigs" slot-scope="{ index,row }">
          <el-button size="mini" @click="handleDutyArea(row, index)">查看辖区</el-button>
        </template>
        <template slot="managerRegionBoss" slot-scope="{ index,row }">
          <span v-if="!!row.managerRegionBoss">{{row.managerRegionBoss.name}}</span>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{row.createTime}}</span>
        </template>
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-tag :type="row.isEnable == '1' ? 'danger' : 'success'">
            {{row.isEnable == '1' ? '停用' : '启用'}}
          </el-tag>
        </template>
        <template v-for="item in fixedData" :slot="item.value" slot-scope="{index,row }">
          <span v-for="status in item.list" :key="status.label" v-if="status.value === row[item.value]">
            {{status.label}}
          </span>
        </template>
        <template slot="approvalTime" slot-scope="{ index,row }">
          <span v-if="!!row.approvalTime">{{format(new Date(row.approvalTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
        <template slot="tableAfter" slot-scope="{index, row}">
          <el-button type="text"
                     size="mini"
                     @click.stop="handleDetail(row, index)">查看
          </el-button>
          <el-button type="text"
                     size="mini"
                     @click.stop="handleEdit(row, index)" v-if="row.delFlag === 0">编辑
          </el-button>
        </template>
      </tree-sidebar-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave" @reset="handleCancel">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入登录名" data-name="username">*</i>登录名：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.username" :disabled="!!dialog.ruleForm2.id"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入绑定手机号" data-name="phone">*</i>绑定手机号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.phone"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入姓名" data-name="name">*</i>姓名：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name"></el-input>
            </td>
            <td>是否启用：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isEnable" :disabled="dialog.readBool">
                <el-radio border :label="0">启用</el-radio>
                <el-radio border :label="1">禁用</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>邮箱：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.email"></el-input>
            </td>
            <td>所管辖区：</td>
            <td>
              <ele-multi-cascader
                size="small"
                ref="cascader"
                :arrIsDisable="disabledArea"
                :options="areaConfigList"
                v-model="form.managerDutyAreaConfigs"
                placeholder="选择辖区"
                @change="ispChange"
                :selectChildren="BooleanVal"
                :show-all-levels="BooleanVal"
                :collapse-tags="BooleanVal"
              >
              </ele-multi-cascader>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入推广员抽成" data-name="rateConfig" data-subname="managerRateRegionBossSpread">*</i>推广员抽成(%)：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.rateConfig.managerRateRegionBossSpread" disabled></el-input>
            </td>
            <td><i class="red-star" data-message="请输入开发同城企业抽成" data-name="rateConfig" data-subname="managerRateRegionBossCity">*</i>开发同城企业抽成(%)：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.rateConfig.managerRateRegionBossCity" disabled></el-input>
            </td>
          </tr>
          <tr>
            <td>年龄：</td>
            <td>
              <el-input v-model.number="dialog.ruleForm2.managerRegionBoss.age"></el-input>
            </td>
            <td>性别：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.managerRegionBoss.sex" :disabled="dialog.readBool">
                <el-radio border :label="1">男</el-radio>
                <el-radio border :label="2">女</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>家庭地址：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.managerRegionBoss.address"></el-input>
            </td>
            <td>身份证：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.managerRegionBoss.idCard"></el-input>
            </td>
          </tr>
          <tr>
            <td>身份证正面：</td>
            <td>
              <span v-if="dialog.readBool">
                <el-popover
                  placement="top"
                  trigger="hover"
                  popper-class="tootip-img-box"
                  v-model="adPicUrlVisible">
                  <img :src="dialog.ruleForm2.managerRegionBoss.idCardJustUrl"/>
                  <span slot="reference">
                    <img class="images-small" :src="dialog.ruleForm2.managerRegionBoss.idCardJustUrl"/>
                  </span>
                </el-popover>
              </span>
              <selector ref='selector' :dialog="subDialogIdcard" @submit="handleSelectIdcard" v-else></selector>
            </td>
            <td>身份证反面：</td>
            <td>
              <span v-if="dialog.readBool">
                <el-popover
                  placement="top"
                  trigger="hover"
                  popper-class="tootip-img-box"
                  v-model="adPicUrlVisible">
                  <img :src="dialog.ruleForm2.managerRegionBoss.idCardBackUrl"/>
                  <span slot="reference">
                    <img class="images-small" :src="dialog.ruleForm2.managerRegionBoss.idCardBackUrl"/>
                  </span>
                </el-popover>
              </span>
              <selector ref='selector' :dialog="subDialogBack" @submit="handleSelectFiles" v-else></selector>
            </td>
          </tr>
          <tr>
            <td>备注：</td>
            <td colspan="3">
              <el-input type="textarea" v-model="dialog.ruleForm2.remarks"></el-input>
            </td>
          </tr>
        </template>
      </dialog-sub>
      <!-- 查看辖区 -->
      <el-dialog title="查看辖区"
        :visible.sync="dialogDutyArea.visible"
        width="400px">
        <div class="duty-area-tree-box">
          <el-tree
            :default-expanded-keys="dialogDutyArea.expandKeys"
            :data="dialogDutyArea.dutyAreaList"
            empty-text="暂无辖区数据"
            style="width: 100%;"
            accordion>
          </el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogDutyArea.visible = false">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 详情 -->
      <dialog-sub key="detail" :dialog="detailDialog" @close="handleClose" @reset="handleClose">
        <template slot="dialog">
          <province-info :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></province-info>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import {format, fixedNum} from "@/utils";
  import bus from '@/utils/bus.js'
  // import TableSub from '@/components/TableSub'
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {getToken} from '@/utils/auth'
  import areaConfig from '@/utils/sys_area_config.json';
  import selector from '@/components/Selector/filesEntry';
  import provinceInfo from './detail';
  import EleMultiCascader from '@/components/EleMultiCascader';
  let ruleForm = {
            username: '',  //是 string  账号
            phone: '', //是 string  绑定手机号
            status: 1, // 否 Interger  店铺状态（1营业中 2歇业中 3冻结）后台默认为1
            isEnable: 0, // 否 Interger  是否停用(后台设置默认)
            email: '', //否 String  邮箱
            isp: [],
            name: '',
            remarks: '',
            managerRegionBoss: {
              age: null,
              sex: 1,
              idCard: '',
              address: '',
              idCardJustUrl: '',
              idCardBackUrl: ''
            },
            rateConfig: {
              managerRateRegionBossCity: '',
              managerRateRegionBossSpread: ''
            }
          };
  export default {
    data() {
      let status = [
              {
                label: "正常",
                value: 1
              },
              {
                label: "关闭",
                value: 2
              }, {
                label: "冻结",
                value: 3
              }
            ];
      return {
        status,
        format,
        areaConfigList: [],
        // 多选级联选择器
        areaList: [],
        outputs: {
          values: [],
          items: []
        },
        disabledArea: [],
        form: {
          managerDutyAreaConfigs: []
        },
        BooleanVal: true,
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'status',
            label: '',
            selected: null,
            list: status
          },{
            value: 'isEnable',
            label: '',
            selected: null,
            list: [{
              label: '停用',
              value: 1
            }, {
              label: '启用',
              value: 0
            }]
          }]
        },
        fixedData: [
          {
            label: "状态",
            value: "status",
            list: status
          }
        ],
        apiUrl: process.env.BASE_API + '/api/sys/fileConfig/upload',
        myHeaders: {
          tokenId: getToken()
        }, // 要保证取到
        treeConfig: {
          treeProps: {
            label: 'name'
          },
          nodeKey: 'code',
          lazy: true,
          expandedKeys: ['0'],
          currentKey: '0'
        },
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '账户',
          isText: true,
          placeholder: '用户编码/登录名/姓名'
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '入驻时间段'
        }],
        table: {
          width: '200px',
          emitEditBool: false,
          detailBool: false,
          delBool: true,
          editBool: true,
          columns: [
            {
              value: 'code',
              label: '用户编码',
              width: '100'
            },
            {
              value: 'username',
              label: '登录名',
              width: '100'
            },
            {
              value: 'name',
              label: '姓名',
              width: '160'
            }, {
              value: 'phone',
              label: '联系方式',
              width: '130'
            }, {
              value: 'isEnable',
              label: '启用状态',
              width: '110',
              slotBool: true
            }, {
              value: 'status',
              label: '状态',
              width: '110',
              slotBool: true
            }, {
              value: 'managerDutyAreaConfigs',
              label: '所管辖区',
              width: '110',
              slotBool: true
            }, {
              value: 'approvalTime',
              label: '入驻时间',
              width: '140',
              slotBool: true
            }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          btnText: '创建',
          titleText: '创建',
          width: '900px',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          ruleForm2: Object.assign({}, ruleForm),
        },
        dialogDutyArea: {
          dutyAreaList: [],
          visible: false
        },
        subDialogIdcard: {
          innerVisible: false,
          addBool: true,
          tableType: 'radio',
          type: 5,
          nameVal: 'name',
          files: {}
        },
        subDialogBack: {
          innerVisible: false,
          addBool: true,
          tableType: 'radio',
          type: 5,
          nameVal: 'name',
          files: {}
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true,
          isChange: false
        }
      }
    },
    components: {
      TreeSidebarTable,
      DialogSub,
      SearchSub,
      selector,
      EleMultiCascader,
      provinceInfo
    },
    methods: {
      async getTreeList(node) {
        let res = await this.Api.getAreaConfig({parentCode: node && node.key ? node.key : '000000'});
        if (res.status === 1 && res.data) {
          let list = res.data.list || [];
          return list;
        }
      },
      async getDataList(area) { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo.time1) {
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
        let para = Object.assign({}, queryPo, quick, {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          searchParameter,
          accountType: 3
        })
        if (area && area.code !== '0') {
          para.sysAreaConfigCode = area.code;
        }
        let resData = await this.Api.getProvincesList(para);
        return resData;
      },
      // 编辑
      async handleEdit(row) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2 = Object.assign({}, ruleForm);
        this.getInfo(row.id);
        // this.getDisabledArea(row);
      },
      // 提交新增编辑
      async handleSave(row, savePrompt, type) {
        
        let obj = Object.assign({}, row, {
          rateConfig: {
            managerRateRegionBossCity: fixedNum(row.rateConfig.managerRateRegionBossCity / 100, 8),
            managerRateRegionBossSpread: fixedNum(row.rateConfig.managerRateRegionBossSpread / 100, 8)
          }
        });

        if (row.isp && row.isp.length) {
          let area = row.isp.map(item => {
            return {
              areaConfig: item
            }
          })
          obj.managerDutyAreaConfigs = area;
          delete obj.isp;
        } else {
          obj.managerDutyAreaConfigs = [];
        }

        if (!obj.id) {
          savePrompt(this.Api.saveProvinces, obj);
        } else {
          savePrompt(this.Api.updateProvinces, obj);
        }
      },
      handleCancel() {
        this.dialog.ruleForm2 = Object.assign({}, ruleForm);
        this.form.managerDutyAreaConfigs = [];
        this.$refs.cascader.initOpts();
        this.$refs.cascader.initDatas();
      },
      // 批量删除
      // arrDel() {
      //   this.$refs.tableSub.handleBatchOperate() //调用子组件方法
      // },
      // async handleDelArr(row, delPrompt) {
      //   delPrompt(this.Api.deleteArrStaff, row);
      // },
      // // 删除
      // async handleDel(row, delPrompt) {
      //   delPrompt(this.Api.deleteGoodsRecommend, {
      //     "id": row.id
      //   });
      // },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.subDialogBack.files = {};
        this.subDialogIdcard.files = {};
        this.form.managerDutyAreaConfigs = [];
        this.dialog.ruleForm2 = Object.assign({}, ruleForm);
        // this.getSeizedArea()
      },
      // async getSeizedArea() {
      //   let res = await this.Api.getSeizedArea({accountType: 3});
      //   if (res.status === 1) {
      //     let data = res.data || [];
      //     this.disabledArea = data.map(item => {
      //       return {code: item.areaConfig.code};
      //     })
      //   }
      // },
      // async getDisabledArea(row) {
      //   let res = await this.Api.getDisabledArea({id: row.id, accountType: 3});
      //   if (res.status === 1) {
      //     let data = res.data || [];
      //     this.disabledArea = data.map(item => {
      //       return {code: item.areaConfig.code};
      //     })
      //   }
      // },
      handleDetail(row) {
        this.detailDialog.id = row.id;
        this.detailDialog.storeType = row.type;
        this.detailDialog.accountId = row.accountId;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/user/provinces/' + row.id, query: {storeType: row.type, accountId: row.accountId}});
      },
      handleSelectFiles(row) {
        this.dialog.ruleForm2.managerRegionBoss.idCardBackUrl = row.url;
      },
      handleSelectIdcard(row) {
        this.dialog.ruleForm2.managerRegionBoss.idCardJustUrl = row.url;
      },
      ispChange(values, items) {
        this.dialog.ruleForm2.isp = [];
        this.outputs.values = values;
        this.outputs.items = items;
        let arr = [];
        arr = Object.assign([], this.outputs.items);
        arr.map(item => {
          if (item.area_level === 3) {
            this.dialog.ruleForm2.isp.push({id: item.ids})
          }
        })
        // if (arr.length) {
        //   this.$refs.isp && this.$refs.isp.clearValidate();
        // } else {
        //  this.$refs.dialog && this.$refs.dialog.$refs.ruleForm2 && this.$refs.dialog.$refs.ruleForm2.validateField('isp');
        // }
      },
      // changePopover() {
      //   let checkAllData = this.$refs.popover.$refs.tree.getCheckedNodes();
      //   let checkHalfData = this.$refs.popover.$refs.tree.getHalfCheckedNodes();
      //   let data = checkAllData.concat(checkHalfData);
      //   let idArr = [];
      //   if (data && data.length) {
      //     data.forEach((item) => {
      //       idArr.push({areaConfig: {id: item.id}});
      //     })
      //   }
      //   if (idArr.length) {
      //     this.$nextTick(()=>{
      //       this.$refs.managerDutyAreaConfigs && this.$refs.managerDutyAreaConfigs.clearValidate();
      //     });
      //   } else {
      //     this.$nextTick(()=>{
      //       this.$refs.dialog.$refs.ruleForm2.validateField('managerDutyAreaConfigs');
      //     });
      //   }
      //   this.dialog.ruleForm2.managerDutyAreaConfigs = idArr;
      // },
      getArea() {
        this.areaConfigList = this.$plug.recursion.treeData(areaConfig.RECORDS, 'parent_code', '0', 'code', 'name');
        return this.areaConfigList;
      },
      async handleDutyArea(row, inx) {
        let res = await this.Api.getDutyAreaList({
          merManagerId: row.id,
          managerDutyAreaConfig: {
            accountType: 3
          }
        });
        if (res.status === 1) {
          let arr = [];
          if (!res.data) {
            res.data = [];
          }
          res.data.forEach((item, inx) => {
            this.formatDutyArea(arr, item, [], ['province', 'city', 'region'], 0);
          })
          this.dialogDutyArea.dutyAreaList = arr;
          if (arr.length > 0) {
            this.dialogDutyArea.expandKeys = [arr[0].code];
          } else {
            this.dialogDutyArea.expandKeys = [];
          }
          this.dialogDutyArea.visible = true;
        }
      },
      formatDutyArea(arr, area, inxList, levelArea, level) {
        let hasArea = false;
        let arry = arr;
        for (var j = 0; j < inxList.length; j++) {
          arry = arry[inxList[j]].children;
        }

        for (var i = 0; i < arry.length; i++) {
          if (arry[i].label === area[levelArea[level]]) {
            hasArea = true;
            if (level < levelArea.length - 1) {
              if (!arry[i].children) {
                arry[i].children = [];
              }
              inxList.push(i);
              this.formatDutyArea(arr, area, inxList, levelArea, level + 1);
            }
            break;
          }
        }
        if (!hasArea) {
          if (level == levelArea.length - 1) {
            arry.push({
              label: area[levelArea[level]],
              code: area.areaConfig.code.substring(0, (level　+ 1) * 2) + '0'.repeat(levelArea.length * 2 - (level　+ 1) * 2)
            });
          } else if (level < levelArea.length - 1) {
            arry.push({
              label: area[levelArea[level]],
              code: area.areaConfig.code.substring(0, (level　+ 1) * 2) + '0'.repeat(levelArea.length * 2 - (level　+ 1) * 2),
              children: []
            });
            inxList.push(arry.length - 1);
            this.formatDutyArea(arr, area, inxList, levelArea, level + 1);
          }
        }
      },
      async getSpreadRate() {
        let res = await this.Api.findServiceRate({
          code: 'SYS19011431483290'
        });
        if (res.status === 1) {
          this.dialog.ruleForm2.rateConfig.managerRateRegionBossSpread = fixedNum(res.message * 100);
          ruleForm.rateConfig.managerRateRegionBossSpread = fixedNum(res.message * 100);
        }
      },
      async getCityRate() {
        let res = await this.Api.findServiceRate({
          code: 'SYS19011474680701'
        });
        if (res.status === 1) {
          this.dialog.ruleForm2.rateConfig.managerRateRegionBossCity = fixedNum(res.message * 100);
          ruleForm.rateConfig.managerRateRegionBossCity = fixedNum(res.message * 100);
        }
      },
      async getInfo(id) {
        let res = await this.Api.findProvinces({id});
        if (res.status == 1 && res.data) {
          let data = Object.assign({isp: res.data.managerDutyAreaConfigs || []}, res.data);
          let managerDutyAreaConfigs = (res.data.managerDutyAreaConfigs || []).map(item => {
            return item.areaConfig;
          });

          this.form.managerDutyAreaConfigs = managerDutyAreaConfigs.map(item => {
            return item.code;
          });


          if (!data.managerRegionBoss) {
            data.managerRegionBoss = {
              age: null,
              sex: 1,
              idCard: '',
              address: '',
              idCardJustUrl: '',
              idCardBackUrl: ''
            }
          }
          if (!data.rateConfig) {
            data.rateConfig = {
              managerRateRegionBossCity: ruleForm.rateConfig.managerRateRegionBossCity,
              managerRateRegionBossSpread: ruleForm.rateConfig.managerRateRegionBossSpread
            }
          }
          this.dialog.ruleForm2 = Object.assign({}, data, {
            isp: managerDutyAreaConfigs || []
          });
          this.subDialogBack.files = {url: data.managerRegionBoss.idCardBackUrl};
          this.subDialogIdcard.files = {url: data.managerRegionBoss.idCardJustUrl};
        } else {
          this.dialog.ruleForm2 = Object.assign({}, ruleForm);
        }
      },
      handleClose() {
        if (this.detailDialog.isChange) {
          bus.$emit('loadDialogData');
          this.detailDialog.isChange = false;
        }
      }
    },
    async mounted() {
      this.getArea();
      this.getSpreadRate();
      this.getCityRate();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .duty-area-tree-box{
    @include scrollBar;
    width: 100%;
    max-height: 340px;
    overflow:auto;
    margin-top: -10px;
    margin-bottom: -10px;
  }
</style>

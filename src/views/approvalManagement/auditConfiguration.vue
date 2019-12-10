<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :pagination="pagination" :quickSearch="quickSearch"　:getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd">
      </search-sub>
      <!--表格-->
      <table-sub ref="tableSub" @submit="handleSave"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="type" slot-scope="{ index,row }">
          <el-tag :type="row.type==1?'':'success'">{{row.type==1?'并且':'或者'}}</el-tag>
        </template>
        <template slot="codeName" slot-scope="{ index,row }">
          <span v-for="code in codeList" :key="code.value" v-if="code.value === row.code">{{code.label}}</span>
        </template>
        <template slot="table" slot-scope="{index, row}">
          <el-dropdown size="mini" split-button @click.stop="handleEdit(row)">
            <span class="el-dropdown-link">
              编辑
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleAdd(row)">创建下级审核</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleAddPeople(index, row)">编辑审核人</el-button>
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleEdit(row)">编辑</el-button>
              </el-dropdown-item> -->
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleDel(row)" :disabled="!!row.afterSysApprovalId || !row.beforeSysApprovalId">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave" @reset="handleClose">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请选择编码" data-name="code">*</i>编码：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.code" :disabled="!!dialog.ruleForm2.id || dialog.readBool">
                <el-option v-for="code in codeList" :key="code.value" :value="code.value" :label="code.label"></el-option>
              </el-select>
            </td>
            <td><i class="red-star" data-message="请输入审核业务名称" data-name="name">*</i>审核业务名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="!!dialog.ruleForm2.id || dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>上级审核：</td>
            <td>
              <el-select :value="dialog.ruleForm2.beforeSysApprovalId" clearable :disabled="!!dialog.ruleForm2.id || dialog.readBool || dialog.isNext" @change="changeBefore">
                <el-option :key="c.id" :value="c.id" :label="c.name" v-for="c in configList" v-if="c.id !== dialog.ruleForm2.afterSysApprovalId && dialog.ruleForm2.code === c.code"></el-option>
              </el-select>
            </td>
            <td><i class="red-star" data-message="请选择审核类型" data-name="type">*</i>审核类型：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.type" :disabled="dialog.readBool">
                <el-radio border :label="'1'">并且</el-radio>
                <el-radio border :label="'2'">或者</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>下级审核：</td>
            <td>
              <el-select :value="dialog.ruleForm2.afterSysApprovalId" clearable :disabled="!!dialog.ruleForm2.id || dialog.readBool" @change="changeAfter">
                <el-option :key="c.id" :value="c.id" :label="c.name" v-for="c in configList" v-if="c.id !== dialog.ruleForm2.beforeSysApprovalId && dialog.ruleForm2.code === c.code"></el-option>
              </el-select>
            </td>
            <td><i class="red-star" data-message="请选择是否免审" data-name="isAvoidApproval">*</i>是否免审：</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isAvoidApproval" :disabled="dialog.readBool">
                <el-radio border label="0">是</el-radio>
                <el-radio border label="1">否</el-radio>
              </el-radio-group>
            </td>
          </tr>
        </template>
      </dialog-sub>
      <!--dialog弹窗2-->
      <dialog-sub :dialog="dialog2" :getDataList="getDataList" @submit="handleSavePeople">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请选择审核人类型" data-name="peopleType">*</i>审核人类型：</td>
            <td>
              <el-select v-model="dialog2.ruleForm2.peopleType" @change="changeType">
                <el-option v-for="type in peopleType" :key="type.value" :value="type.value" :label="type.label"></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择审核人" data-name="approvalPeopleId">*</i>审核人：</td>
            <td>
              <check-people ref="checkpeople" :dialog="subDialog" :disabledPeople="disabledPeople" @submit="handleSelect"></check-people>
              <el-popover
                placement="right"
                width="306"
                trigger="click">
                <el-table :data="sysApprovalPeopleConfig" height="400px">
                  <el-table-column width="80" label="类型">
                    <template slot-scope="scope">
                      <span v-for="type in peopleType" :key="type.value" v-if="(scope.row.serviceType * 1) === type.value">{{type.label}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="100" property="name" label="姓名"></el-table-column>
                  <el-table-column width="100" property="name" label="操作">
                    <template slot-scope="{index, row}">
                      <el-button size="mini" type="text" @click="delPeople(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button type="text" slot="reference">查看已有审核人</el-button>
              </el-popover>
            </td>
          </tr>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import {format} from "../../utils";
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {getToken} from '@/utils/auth'
  import CheckPeople from '../checkPeople';
  let subDialog = {
    innerVisible: false,
    addBool: true,
    type: 1,
    nameVal: ['name', 'username', 'name'],
    tableType: 'radio',
    employee: {},
    partner: {},
    promoter: {}
  }
  export default {
    data() {

      let codeList = [{
        label: '审核种子商户',
        value: 'st_store_seed_code'
      }, {
        label: '审核种子商户更新',
        value: 'sys_manager_code_seed_update'
      }, {
        label: '审核特色商户',
        value: 'st_store_characteristic_code'
      }, {
        label: '审核特色商户更新',
        value: 'st_store_characteristic_code_update'
      }, {
        label: '审核商品',
        value: 'sys_goods_code'
      }, {
        label: '审核商品更新',
        value: 'sys_goods_code_update'
      }, {
        label: '审核生产企业',
        value: 'sys_pro_code'
      }, {
        label: '审核生产企业更新',
        value: 'sys_pro_code_update'
      }, {
        label: '审核同城企业',
        value: 'sys_city_code'
      }, {
        label: '审核同城企业更新',
        value: 'sys_city_code_update'
      }, {
        label: '审核合作商',
        value: 'sys_cooperation_code'
      }, {
        label: '审核合作商更新',
        value: 'sys_cooperation_code_update'
      }, {
        label: '审核推广员',
        value: 'sys_spread_code'
      }, {
        label: '审核推广员更新',
        value: 'sys_spread_code_update'
      }, {
        label: '审核省区总',
        value: 'sys_boss_code'
      }, {
        label: '审核省区总更新',
        value: 'sys_boss_code_update'
      }];
      return {
        peopleType: [{
          label: '员工',
          value: 1
        }, {
          label: '合作商',
          value: 2
        }, {
          label: '推广员',
          value: 3
        }, {
          label: '省区总',
          value: 4
        }],
        apiUrl: process.env.BASE_API + '/api/sys/fileConfig/upload',
        myHeaders: {
          tokenId: getToken()
        }, // 要保证取到
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        configList: [],
        codeList,
        searchBool: false,
        searchObj: [{
          value: 'code',
          label: '',
          name: '业务编码',
          isText: true,
          placeholder: '支持模糊查询'
        }, {
          value: 'name',
          label: '',
          name: '审核配置名称',
          isText: true,
          placeholder: '支持模糊查询'
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '创建时间段'
        }],
        table: {
          editBool: true,
          delBool: true,
          columns: [
            {
              value: 'code',
              label: '编码',
              width: '150'
            },
            {
              value: 'codeName',
              label: '编码别称',
              slotBool: true,
              width: '150'
            },
            {
              value: 'name',
              label: '审核业务名称',
              width: '100'
            }, {
              value: 'type',
              label: '审核类型',
              width: '80',
              slotBool: true
            }, {
              value: 'createTime',
              label: '创建时间',
              width: '140'
            }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          btnText: '创建审核配置',
          titleText: '创建审核配置',
          width: '800px',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          isNext: false,
          ruleForm2: {
            id: null, // 新增不必传，修改必传 string  商品属性ID  否
            code: '', //是 string  业务编码（自定义code，同一个审核流的业务编码必须保持一致）
            type: '1',  //是 string  审核类型（1 并且 2 或者）
            name: '', //是 string  审核业务名称
            isAvoidApproval: '1'
          },
          rules2: {
            isAvoidApproval: this.$plug.valid.isNull(),
            code: this.$plug.valid.isNull(),
            name: this.$plug.valid.isNull(),
            type: this.$plug.valid.isNull()
          }
        },
        sysApprovalPeopleConfig: [],
        dialog2: {
          btnText: '编辑审核人',
          titleText: '编辑审核人',
          width: '750px',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          ruleForm2: {
            peopleType: 1,
            type: '1',
            approvalPeopleId: '',
          },
          rules2: {
            approvalPeopleId: this.$plug.valid.isNull(),
            peopleType: this.$plug.valid.isNull()
          }
        },
        disabledPeople: [],
        subDialog: Object.assign({}, subDialog),
        isExpand: true,
        visible: false
      }
    },
    components: {
      TableSub,
      DialogSub,
      SearchSub,
      CheckPeople
    },
    watch: {
      'dialog2.saveFormVisible'(val) {
        if (val === false) {
          this.$refs.checkpeople.clearSelect();
        }
      },
      'dialog.ruleForm2.code'(val) {
        this.dialog.ruleForm2.beforeSysApprovalId = null;
        this.dialog.ruleForm2.afterSysApprovalId = null;
      }
    },
    methods: {
      changeBefore(val) {
        this.dialog.ruleForm2.beforeSysApprovalId = val;
        this.$forceUpdate();
      },
      changeAfter(val) {
        this.dialog.ruleForm2.afterSysApprovalId = val;
        this.$forceUpdate();
      },
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          queryPo.startTime = queryPo.time1[0];
          queryPo.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          ...queryPo
        }
        let resData = await this.Api.auditConfigList(para);
        return resData;
      },
      async getList() {
        let res = await this.Api.auditConfig({});
        if (res.status == 1) {
          this.configList = res.data || [];

        }
      },
      // 提交新增编辑
      async handleSave(row, savePrompt, type) {
        if (!row.id) {
          savePrompt(this.Api.saveAuditConfig, row);
        } else {
          savePrompt(this.Api.updateAuditConfig, row);
        }
      },
      // handlePeopleDetail(row) {
      //   this.peopleDialog.ruleForm2 = row.sysApprovalPeopleConfig;
      //   this.peopleDialog.visible = true;
      // },
      async handleAddPeople(index, row) {
        this.dialog2.titleText = '编辑审核人';
        this.dialog2.saveFormVisible = true;
        this.dialog2.ruleForm2 = {peopleType: 1, type: '1', sysApprovalId: row.id};
        await this.getPeople(this.dialog2.ruleForm2);
        this.changeType(1);
      },
      async getPeople(row) {
        let res = await this.Api.getApprovalPeople({sysApprovalId: row.sysApprovalId});
        if (res.status === 1) {
          let data = res.data;
           this.sysApprovalPeopleConfig = data.map(item => {
              if (item.serviceId) {
                item.id = item.serviceId;
              }
              return item;
           })
          this.disabledPeople = Object.assign([], this.sysApprovalPeopleConfig);
        }
      },
      changeType(type) {
        this.subDialog.type = type;
      },
      handleSelect(row, type) {
        this.dialog2.ruleForm2.approvalPeopleId = row.id;
      },
      async handleSavePeople(row, savePrompt, type) {
        let data = Object.assign({
          sysApprovalId: row.sysApprovalId,
          approvalPeopleId: row.approvalPeopleId,
          peopleType: row.peopleTyp,
          type: row.type
        })
        savePrompt(this.Api.addApprovalPeople, row, () => {
          this.subDialog = Object.assign({}, subDialog);
          this.$refs.checkpeople.clearSelect();
        });
      },
      // 删除
      handleDel(row) {
        this.$plug.prompt.del(this.sureDel, row, null, '删除当前审核配置');
      },
      async sureDel(row) {
        let res = await this.Api.delAuditConfig({id: row.id});
        if (res.status === 1) {
          this.$plug.prompt.saveTip('删除成功');
          return ;
        }
        // this.$plug.prompt.failTip();
      },
      // 显示新增界面
      handleAdd(row) {
        this.dialog.titleText = '创建审核配置';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.isNext = false;
        this.getList();
        if (row && row.id) {
          this.dialog.isNext = true;
          this.dialog.ruleForm2 = {
            beforeSysApprovalId: row.id,
            type: '1'
          };
        }
      },
      handleEdit(row) {
        this.dialog.titleText = '编辑审核配置';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = false;
        this.dialog.isNext = false;
        this.dialog.ruleForm2 = Object.assign({}, row);
        this.getList();
      },
      handleClose() {
        this.dialog.ruleForm2 = {};
      },
      delPeople(row) {
        this.$plug.prompt.del(this.deletePeople, row, null, '删除当前审核人');
      },
      async deletePeople(row) {
        let res = await this.Api.delApprovalPeople({
          approvalPeopleId: row.id,
          sysApprovalId: this.dialog2.ruleForm2.sysApprovalId
        });
        if (res.status === 1) {
          this.$plug.prompt.saveTip('删除成功');
          this.getPeople(this.dialog2.ruleForm2);
        }
      }
    },
    computed: {},
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
  }

  /*图片上传*/
  .el-upload--picture-card img {
    width: 100%;
    height: 100%;
  }

  .uploadingImg {
    display: flex;
  }

  table > tr {
    vertical-align: middle;
  }

  .prop table th {
    white-space: nowrap;
    overflow: hidden;
    background-color: #eef1f6;
    text-align: center;
    padding: 2px 15px;
    box-sizing: border-box;
  }

  .prop table {
    background-color: #ffffff;
    border: 1px solid #dfe6ec;
    width: 100%;
  }

  .prop table td {
    padding: 5px 15px;
    box-sizing: border-box;
    background-color: #ffffff;
  }

  .select-tree {
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 10px;
  }

  .input-tree {
    display: flex;
  }

  .refresh {
    font-size: 12px;
    margin-left: 10px;
  }
</style>

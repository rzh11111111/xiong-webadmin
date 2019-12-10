<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :quickSearch="quickSearch" :searchObj="searchObj" :pagination="pagination" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd"></search-sub>
      <!--表格-->
      <table-sub
        ref="tableSub"
        @detail="handleDetail"
        @submit="handleSave"
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination"
      >
        <!-- <template slot="readTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.readTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template> -->

        <template slot="isRead" slot-scope="{ index,row }">
          <el-tag :type="returnTagValue(row.isRead)">{{returnTypeValue(row.isRead)}}</el-tag>
        </template>

        <template slot="serviceType" slot-scope="{index,row }">
          <template v-for="type in serviceType" v-if="type.value == row.serviceType">
            {{type.label}}
          </template>
        </template>

        <!-- <template slot="table" slot-scope="scope">
          <el-button  type="text"
                      size="mini"

                      @click.stop="() => handleIsRead(scope.row)">标记已读
          </el-button>
        </template> -->
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave" @reset="handleCancel">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请选择接收者类型" data-name="serviceType">*</i>接收者类型：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.serviceType" placeholder="请选择" :disabled="dialog.readBool" @change="changeType">
                <el-option
                  v-for="item in serviceType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择接收者" data-name="serviceIds">*</i>接收者：</td>
            <td>
              <check-people ref="checkpeople" :dialog="subDialog" @submit="handleSelect"></check-people>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择消息" data-name="message">*</i>消息：</td>
            <td>
              <check-module key="msg" ref="checkmoduleMsg" :disabled="dialog.readBool" :dialog="subDialogMsg" @submit="handleSelectMsg"></check-module>
            </td>
          </tr>
         <!--  <el-form-item label="接收者类型" prop="serviceType">
            <el-select v-model="dialog.ruleForm2.serviceType" placeholder="请选择" :disabled="dialog.readBool" @change="changeType">
              <el-option
                v-for="item in serviceType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接收者" prop="serviceIds" ref="serviceIds">
            <check-people ref="checkpeople" :dialog="subDialog" @submit="handleSelect"></check-people>
          </el-form-item>
          <el-form-item label="消息" prop="message" ref="message">
            <check-module key="msg" ref="checkmoduleMsg" :disabled="dialog.readBool" :dialog="subDialogMsg" @submit="handleSelectMsg"></check-module>
          </el-form-item>
          <el-form-item label="是否已读：" v-if="dialog.readBool">
            <el-radio-group size="mini" v-model="dialog.ruleForm2.isRead" :disabled="dialog.readBool">
              <el-radio border :label="0">未读</el-radio>
              <el-radio border :label="1">已读</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="阅读时间" prop="readTime" v-if="dialog.readBool">
            <el-date-picker
              v-model="dialog.ruleForm2.readTime"
              type="date"
              placeholder="选择时间" :disabled="dialog.readBool">
            </el-date-picker>
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
import bus from '../../utils/bus.js'
import CheckPeople from '../checkPeople';
import CheckModule from '../checkModule';

let subDialog = {
  innerVisible: false,
  addBool: true,
  type: 1,
  nameVal: ['name', 'username', 'name', 'name'],
  tableType: 'selection',
  employee: [],
  partner: [],
  promoter: [],
  province: []
}
export default {
  data() {

    let form = {
          serviceIds: '',
          message: {
            id: ''
          },
          isRead: 0,
          serviceType: '',
          readTime: ''
        };
    return {
      form,
      quickSearch: {
        hideTime: true,
        isShow: true,
        group: [{
          value: 'isRead',
          label: '',
          selected: '',
          list: [{
            label: '未读',
            value: 0
          }, {
            label: '已读',
            value: 1
          }]
        }]
      },
      serviceType: [{
        label: '员工',
        value: 1
      }, {
        label: '推广员',
        value: 2
      }, {
        label: '合作商',
        value: 3
      }, {
        label: '省区总',
        value: 4
      }],
      searchBool: true,
      format: format,
      searchObj: [{}],
      optionsService:[],
      optionsMessage:[],
      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: false,
        detailBool: false,
        arrDelBool: true,
        editBool: true,
        delBool: true,
        btn: true,
        columns: [
          {
            value: "serviceName",
            label: "接收者",
            width: "100"
          },
          {
            value: "messageTitle",
            label: "消息标题",
            width: "150"
          },
          {
            value: "serviceType",
            label: "接收者类型",
            width: "140",
            slotBool: true
          },
          {
            value: "isRead",
            label: "是否已读",
            width: "140",
            slotBool: true
          },
          {
            value: "readTime",
            label: "阅读时间",
            width: "100"
          },
          {
            value: "createTime",
            label: "创建时间",
            width: "100"
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
        isTable: true,
        readBool:false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,

        ruleForm2: Object.assign({}, form)
      },
      subDialog: Object.assign({}, subDialog),
      subDialogMsg: {
        innerVisible: false,
        addBool: true,
        type: 8,
        tableType: 'radio',
        systemMessage: {}
      }
    }
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub,
    CheckPeople,
    CheckModule
  },
  methods: {
    async getDataList() {
      let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
      let searchParameter = {keyWord: queryPo.keyWord};
      let quick = {};
      if (this.quickSearch && this.quickSearch.group) {
        this.quickSearch.group.map(item => {
          if (item.selected || item.selected === 0) {
            quick[item.value] = item.selected;
          }
        })
      }
      let para = Object.assign({}, queryPo, quick, {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter
      })
      let resData = await this.Api.getOtherMessage(para);
      resData.data.list.map(item => {
        if (item.message == null) {
          item.message = { id: "" };
        }
        item.messageTitle = item.message.title;

        switch (item.serviceType) {
          case 1:
            if (item.employee == null) {
              item.employee = { id: "" };
            }
            item.serviceName = item.employee.username;
            break;
          case 2:
            if (item.merManager == null) {
              item.merManager = { id: "" };
            }
            item.serviceName = item.merManager.username;
            break;
          case 3:
            if (item.merManager == null) {
              item.merManager = { id: "" };
            }
            item.serviceName = item.merManager.username;
            break;
          case 4:
            if (item.merManager == null) {
              item.merManager = { id: "" };
            }
            item.serviceName = item.merManager.username;
            break;
        }
        if(item.readTime != null){
          item.readTime = format(new Date(item.readTime), "yyyy-MM-dd hh:mm:ss")
        }

      });

      return resData;
    },
    // 显示创建界面
    handleAdd() {
      this.dialog.titleText = "创建消息";
      this.dialog.saveFormVisible = true;
      this.dialog.ruleForm2 = Object.assign({}, this.form);
    },
    handleDetail(params) {
      this.dialog.titleText = "查看消息";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
      this.changeType(1);
      this.getInfo(params.id);
    },
    async getInfo(id) {
      let res = await this.Api.getOtherMessageDetail({id});
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    changeType(type) {
      if (type == 2) {
        this.subDialog.type = 3;
      } else if(type == 3) {
        this.subDialog.type = 2;
      } else {
        this.subDialog.type = type;
      }
    },
    handleSelect(row, type) {
      let serviceIds = row.map(item => {
        return item.id;
      });
      this.dialog.ruleForm2.serviceIds = serviceIds.join(',');
    },
    handleSelectMsg(row, type) {
      this.dialog.ruleForm2.message = {
        id: row.id
      };
    },
    // 创建修改
    async handleSave(row, savePrompt) {
      // if(row.isRead){
      //   row.readTime = format(
      //     new Date(row.readTime),
      //     "yyyy-MM-dd hh:mm:ss"
      //   );
      // }
      row.isRead = 0;
      // if (!row.id) {
        savePrompt(this.Api.saveBatchOtherMessage, row, () => {
          this.subDialog = Object.assign({}, subDialog);
          this.subDialogMsg.systemMessage = {};
          this.$refs.checkpeople && this.$refs.checkpeople.clearSelect();
          this.$refs.checkmoduleMsg && this.$refs.checkmoduleMsg.clearSelect();
        });
      // } else {
        //savePrompt(this.Api.updateServiceConfig, row);
      // }
    },
    handleCancel() {
      this.subDialogMsg.systemMessage = {};
      this.$nextTick(()=>{
        this.$refs.checkpeople && this.$refs.checkpeople.clearSelect();
        this.$refs.checkmoduleMsg && this.$refs.checkmoduleMsg.clearSelect();
      });
    },
    // 标记已读
    async handleIsRead(row) {
      this.Api.readOtherMessage({
        'id': row.id
      });
       bus.$emit("loadDialogData");
    },
    returnTypeValue(type) {
      switch (type) {
        case 0:
          return '未读';
        case 1:
          return '已读';
        default:
          return '无'
      }
    },
    returnTagValue(type) {
      switch (type) {
        case 0:
          return 'success';
        case 1:
          return 'info';
        default:
          return '无'
      }
    }
  },
  async created() {
    // var resService = await this.Api.getStaff({});
    // this.optionsService = this.$plug.public.transformList(resService.data, 'id', 'name');
    // //不显示已停用
    // for (let i = 0; i < this.optionsService.length; i++) {
    //   if (this.optionsService[i].isEnable == 1) {
    //     this.optionsService.splice(i);
    //   }
    // }

    var resMessage = await this.Api.getMessageList({});
    this.optionsMessage = this.$plug.public.transformList(resMessage.data, 'id', 'title');
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

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub
        :searchObj="searchObj"
        :getDataList="getDataList"
        :searchBool="searchBool"
        :pagination="pagination"
        :dialog="dialog"
        @add="handleAdd"></search-sub>
      <!--表格-->
      <table-sub
        ref="tableSub"
        @del="handleDel"
        @submit="handleSave"
        @edit="handleEdit"
        :getDataList="getDataList"
        :table="table"
        :pagination="pagination"
      >
        <template slot="storeId" slot-scope="{ index,row }">
          <span v-if="!!row.store">{{row.store.nickName}}</span>
        </template>
        <template slot="activeTime" slot-scope="{ index,row }">
          <span v-if="!!row.activeTime">{{format(new Date(row.activeTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="invalidTime" slot-scope="{ index,row }">
          <span v-if="!!row.invalidTime">{{format(new Date(row.invalidTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>

        <template slot="recommendType" slot-scope="{ index,row }">
          <span>{{returnTypeValue(row.recommendType)}}</span>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :customValidate="customValidate" :getDataList="getDataList" @submit="handleSave" @reset="handleCancel">
        <template slot="dialog">
          <tr>
            <template
            v-for="type in fixedData">
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
            <td><i class="red-star" data-message="请输入序号" data-name="sortNo">*</i>序号：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择生效时间" data-name="activeTime">*</i>生效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.activeTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择时间" :disabled="dialog.readBool">
              </el-date-picker>
            </td>
            <td><i class="red-star" data-message="请选择失效时间" data-name="invalidTime">*</i>失效时间：</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.invalidTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择时间" :disabled="dialog.readBool">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择线下店铺" :data-name="!!dialog.ruleForm2.id ? 'store' : 'storeIds'">*</i>线下店铺：</td>
            <td colspan="3">
              <template v-if="!!dialog.ruleForm2.id">
                <check-module ref="checkmodule" :dialog="subDialog" :disabled="dialog.readBool" @submit="handleSelect"></check-module>
              </template>
              <template v-else>
                <check-module ref="checkmodulemulti" :dialog="subDialogMulti" :disabled="dialog.readBool" @submit="handleSelectMulti"></check-module>
              </template>
              <!-- <el-select v-model="dialog.ruleForm2.store.id" :disabled="dialog.readBool">
                <el-option v-for="store in storeList" :key="store.id" :value="store.id" :label="store.nickName"></el-option>
              </el-select> -->
            </td>
          </tr>
          <!-- <el-form-item label="线下店铺" prop="store">
            <el-select v-model="dialog.ruleForm2.store.id" :disabled="dialog.readBool">
              <el-option v-for="store in storeList" :key="store.id" :value="store.id" :label="store.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="序号" prop="sortNo">
            <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
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
          <el-form-item label="生效时间" prop="activeTime">
            <el-date-picker
              v-model="dialog.ruleForm2.activeTime"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择时间" :disabled="dialog.readBool">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="失效时间" prop="invalidTime">
            <el-date-picker
              v-model="dialog.ruleForm2.invalidTime"
              type="datetime"
              :picker-options="pickerOptions"
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
import { format } from "@/utils";
import CheckModule from '../../checkModule';
import bus from '@/utils/bus.js'
// import prompt from '../../utils/plug.js'
let subDialog = {
        innerVisible: false,
        addBool: true,
        type: 3,
        nameVal: ['title', 'nickName', 'nickName', 'name', 'name', 'name', 'name'],
        tableType: 'radio',
        store: {}
      };
let subDialogMulti = {
        innerVisible: false,
        addBool: true,
        type: 3,
        nameVal: ['title', 'nickName', 'nickName', 'name', 'name', 'name', 'name'],
        tableType: 'selection',
        store: []
      };
let form = {
          store: {
            id: ''
          },
          sortNo: '',
          recommendType: 1,
          activeTime: "",
          invalidTime: ""
        };
export default {
  data() {
    return {
      fixedData: [
        {
          label: "推荐板块",
          value: "recommendType",
          list: [
            {
              label: "全部",
              value: 1
            },
            {
              label: "首页",
              value: 2
            },
            {
              label: "购物车",
              value: 3
            },
            {
              label: "个人中心",
              value: 4
            },
            {
              label: "商品详情",
              value: 5
            }
          ]
        }
      ],
      searchBool: false,
      searchObj: [
        {
          value: "nickName",
          label: "",
          name: "店铺名称",
          isText: true
        }
      ],
      format: format,
      storeList: [],
      msgList: [],

      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: true,
        detailBool: false,
        arrDelBool: true,
        editBool: false,
        delBool: false,
        columns: [
          {
            value: "sortNo",
            label: "序号",
            width: "80"
          },
          {
            value: "storeId",
            label: "线下店铺",
            width: "120",
            slotBool: true
          },
          {
            value: "recommendType",
            label: "推荐板块",
            width: "80",
            slotBool: true
          },
          {
            value: "activeTime",
            label: "生效时间",
            slotBool: true,
            width: "140"
          },
          {
            value: "invalidTime",
            label: "失效时间",
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
        width: '800px',
        btnText: "创建推荐",
        titleText: "新增推荐",
        isTable: true,
        readBool:false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,

        ruleForm2: Object.assign({}, form)
      },
      subDialog: Object.assign({}, subDialog),
      subDialogMulti: Object.assign({}, subDialogMulti),
    }
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub,
    CheckModule
  },
  methods: {
    async getDataList() {
      //获取列表
      let queryPo = this.$plug.public.transformSearchData.call(
        this,
        this.searchObj
      );
      let para = {
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        store: {
          nickName: queryPo.nickName
        }
      };
      return await this.Api.getStoreRecommendList(para);
    },
    // 显示新增界面
    handleAdd() {
      this.dialog.titleText = "新增推荐";
      this.dialog.saveFormVisible = true;
      this.dialog.ruleForm2 = Object.assign({storeIds: []}, form);
      this.subDialogMulti = Object.assign({}, subDialogMulti);
      // if (!this.storeList || !this.storeList.length) {
      //   this.getStoreList();
      // }
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑推荐";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = false;
      // this.getInfo(params.id);
      this.subDialog = Object.assign({}, subDialog);
      this.subDialog.store = params.store;
      this.dialog.ruleForm2 = Object.assign({}, params, {
        activeTime: format(new Date(params.activeTime), 'yyyy-MM-dd hh:mm:ss'),
        invalidTime: format(new Date(params.invalidTime), 'yyyy-MM-dd hh:mm:ss'),
      });
      // if (!this.storeList || !this.storeList.length) {
      //   this.getStoreList();
      // }
    },
    handleSelect(row, type) {
      this.dialog.ruleForm2.store = Object.assign({}, row);
    },
    handleSelectMulti(row, type) {
      this.dialog.ruleForm2.store = Object.assign([], row);
      this.dialog.ruleForm2.storeIds = row.map(item => {
        return item.id;
      })
    },
    // async getInfo(id) {
    //   let res = await this.Api.getStoreRecommend({ id });
    //   if (res.status == 1) {
    //     this.dialog.ruleForm2 = res.data;
    //   }
    // },
    // async getStoreList() {
    //   let res = await this.Api.getStoreList({});
    //   if (res.status == 1 && res.data) {
    //     this.storeList = res.data.list || [];
    //   }
    // },
    customValidate() {
      if (new Date(this.dialog.ruleForm2.invalidTime).valueOf() < new Date(this.dialog.ruleForm2.activeTime).valueOf()) {
        this.$plug.prompt.failTip('失效时间必须大于生效时间');
        return;
      }
      return true;
    },
    // 新增修改
    async handleSave(row, savePrompt) {
      if (!row.id) {
        let params = Object.assign({}, row);
        delete params.store;
        savePrompt(this.Api.saveStoreRecommendBatch, params);
      } else {

        savePrompt(this.Api.saveStoreRecommend, row);
      }
    },
    async handleDel(row, delPrompt) {
      //删除
      delPrompt(this.Api.deleteStoreRecommend, {
        id: row.id
      });
    },
    returnTypeValue(type) {
      switch (type) {
        case 1:
          return '全部';
        case 2:
          return '首页';
        case 3:
          return '购物车';
        case 4:
          return '个人中心';
        case 5:
          return '商品详情';
      }
    },
    handleCancel() {
      this.moduleInit();
    },
    moduleInit() {
      this.$nextTick(()=>{
        this.dialog.ruleForm2 = Object.assign({}, form);
        this.subDialog = Object.assign({}, subDialog);
        this.subDialogMulti = Object.assign({}, subDialogMulti);
        this.$refs.checkmodule && this.$refs.checkmodule.clearSelect();
        this.$refs.checkmodulemulti && this.$refs.checkmodulemulti.clearSelect();
      })
    },
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

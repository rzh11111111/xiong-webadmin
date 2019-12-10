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
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入编码代码" data-name="handle">*</i>编码代码：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.handle" :disabled="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入编码名称" data-name="name">*</i>编码名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>编码类型：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.type" placeholder="请选择" :disabled="dialog.readBool">
                <el-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td>日期类型：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.dateType" placeholder="请选择" :disabled="dialog.readBool">
                <el-option
                  v-for="item in dateType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>主值随机类型：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.mainValueType" placeholder="请选择" :disabled="dialog.readBool">
                <el-option
                  v-for="item in mainValueType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td>编码前缀：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.prefix" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>日期值：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.dateValue" :disabled="dialog.readBool"></el-input>
            </td>
            <td>中缀：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.midfix" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>主值长度：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.mainValueLength" :disabled="dialog.readBool"></el-input>
            </td>
            <td>主值：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.mainValue" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>后缀：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.postfix" :disabled="dialog.readBool"></el-input>
            </td>
            <td>最后生成编码：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.lastCode" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <!-- <tr>
            <td>所属线下店铺</td>
            <td>
              <el-input v-model="dialog.ruleForm2.storeId" :disabled="dialog.readBool"></el-input>
            </td>
            <td>所属线上店铺：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.shopId" :disabled="dialog.readBool"></el-input>
            </td>
          </tr> -->
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
import TableSub from "@/components/TableSub";
import DialogSub from "@/components/DialogSub";
import SearchSub from "@/components/SearchSub";
import {format} from "../../utils";

export default {
  data() {
    let type = [
      {
        label: "系统即通用",
        value: '1'
      },
      {
        label: "模板",
        value: '2'
      },
      {
        label: "线下店铺",
        value: '3'
      },
      {
        label: "线上店铺",
        value: '4'
      }
    ];
    let dateType = [
      {
        label: "无",
        value: '0'
      },
      {
        label: "年",
        value: '1'
      },
      {
        label: "年月",
        value: '2'
      },
      {
        label: "年月日完整",
        value: '3'
      },
      {
        label: "年月日简写",
        value: '4'
      }
    ];
    let mainValueType = [
      {
        label: "自增",
        value: '1'
      },
      {
        label: "随机自增",
        value: '2'
      },
      {
        label: "随机",
        value: '3'
      }
    ];
    return {
      type,
      dateType,
      mainValueType,
      quickSearch: {
        isTimeRange: true,
        isShow: true
      },
      fixedData: [
        {
          label: "编码类型",
          value: "type",
          list: [
            {
              label: "系统即通用",
              value: '1'
            },
            {
              label: "模板",
              value: '2'
            },
            {
              label: "线下店铺",
              value: '3'
            },
            {
              label: "线上店铺",
              value: '4'
            }
          ]
        },
        {
          label: "日期类型",
          value: "dateType",
          list: [
            {
              label: "无",
              value: '0'
            },
            {
              label: "年",
              value: '1'
            },
            {
              label: "年月",
              value: '2'
            },
            {
              label: "年月日完整",
              value: '3'
            },
            {
              label: "年月日简写",
              value: '4'
            }
          ]
        },
        {
          label: "主值随机类型",
          value: "mainValueType",
          list: [
            {
              label: "自增",
              value: '1'
            },
            {
              label: "随机自增",
              value: '2'
            },
            {
              label: "随机",
              value: '3'
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
          placeholder: '代码/名称'
        },
        {
          value: 'time1',
          label: '',
          name: '创建时间',
          isTimeRange: true
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
            value: "handle",
            label: "编码代码",
            width: "150"
          },
          {
            value: "name",
            label: "编码名称",
            width: "150"
          },
          {
            value: "type",
            label: "编码类型",
            slotBool: true,
            width: "120"
          },
          {
            value: "prefix",
            label: "前缀",
            width: "150"
          },
          {
            value: "dateType",
            label: "日期类型",
            slotBool: true,
            width: "120"
          },
          {
            value: "dateValue",
            label: "日期值",
            width: "150"
          },
          {
            value: "midfix",
            label: "中缀",
            width: "150"
          },
          {
            value: "mainValueType",
            label: "主值随机类型",
            slotBool: true,
            width: "120"
          },
          {
            value: "mainValueLength",
            label: "主值长度",
            width: "150"
          },
          {
            value: "mainValue",
            label: "主值",
            width: "150"
          },
          {
            value: "postfix",
            label: "后缀",
            width: "150"
          },
          {
            value: "lastCode",
            label: "最后生成编码",
            width: "150"
          },
          // {
          //   value: "storeId",
          //   label: "线下店铺",
          //   width: "150"
          // },
          // {
          //   value: "shopId",
          //   label: "线上店铺",
          //   width: "150"
          // }
        ]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      },

      dialog: {
        btnText: "新增",
        titleText: "新增",
        readBool: false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        isTable: true,

        ruleForm2: {
          handle: "",
          name: "",
          type: "1",
          dateType: "1",
          mainValueType: "1",
          prefix: "",
          dateValue: "",
          midfix: "",
          mainValueLength: "",
          mainValue: "",
          postfix: "",
          lastCode: "",
          store: {
            id: ''
          },
          shop: {
            id: ''
          },
        },
        rules2: {
          handle: this.$plug.valid.isNull(),
          name: this.$plug.valid.isNull(),
          type: this.$plug.valid.isNull(),
          dateType: this.$plug.valid.isNull(),
          mainValueType: this.$plug.valid.isNull()
        }
      }
    };
  },
  components: {
    DialogSub,
    SearchSub,
    TableSub
  },
  methods: {
    async getDataList() {
      //获取列表
      let queryPo = this.$plug.public.transformSearchData.call(this,this.searchObj);
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
        searchParameter
      };
      let resData = await this.Api.getCodeGenerator(para);
      resData.data.list.map(item => {
        if (item.store == null) {
          item.store = { id: "" };
        }
        item.storeId = item.store.id;
        if (item.shop == null) {
          item.shop = { id: "" };
        }
        item.shopId = item.shop.id;
      });
      return resData;
    },
    // 显示新增界面
    handleAdd() {
      this.dialog.titleText = "新增";
      this.dialog.saveFormVisible = true;
    },
    handleDetail(params) {
      this.dialog.titleText = "查看";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
      this.getInfo(params.id);
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = false;
      this.getInfo(params.id);
      // this.dialog.ruleForm2 = Object.assign({}, params);
    },
    async getInfo(id) {
      let res = await this.Api.getCodeGeneratorDetail({id});
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    // 新增修改
    async handleSave(row, savePrompt) {
      if (!row.id) {
        savePrompt(this.Api.addCodeGenerator, row);
      } else {
        savePrompt(this.Api.editCodeGenerator, row);
      }
    },
    async handleDel(row, delPrompt) {
      //删除
      delPrompt(this.Api.deleteCodeGenerator, {
        id: row.id
      });
    }
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

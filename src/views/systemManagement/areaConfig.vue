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
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td>地址名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>地址级别：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.areaLevel" placeholder="请选择" :disabled="dialog.readBool" @change="getAreaLevel">
                <el-option 
                  v-for="item in areaLevel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>上级地址：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.parentCode" filterable placeholder="请选择" @change="getParentArea"
                          :disabled="dialog.readBool">
                <template v-if="dialog.addOrUpdate">
                  <el-option v-for="item in optionsAreas" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </template>
                <template v-else>
                  <el-option v-for="item in optionsAreas" :key="item.code" :label="item.label" :value="item.code"></el-option>
                </template>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>所有上级地址：</td>
            <td>
              <el-select v-model="dialog.ruleForm2.parentCodes" filterable placeholder="请选择"
                          :disabled="true">
                <el-option v-for="item in optionsParentAreas" :key="item.code" :label="item.label" :value="item.code"></el-option>
              </el-select>
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

export default {
  data() {
    let areaLevel = [
      {
        label: "国",
        value: 0
      },
      {
        label: "省",
        value: 1
      },
      {
        label: "市",
        value: 2
      },
      {
        label: "区",
        value: 3
      }
    ];
    return {
      areaLevel,
      fixedData: [
        {
          label: "地址级别",
          value: "areaLevel",
          list: [
            {
              label: "国",
              value: 0
            },
            {
              label: "省",
              value: 1
            },
            {
              label: "市",
              value: 2
            },
            {
              label: "区",
              value: 3
            }
          ]
        }
      ],
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: "",
          name: "地址名称",
          isText: true
        }
      ],

      optionsArea: [],
      optionsAreas: [],
      optionsParentAreas: [],
      table: {
        width: "200px",
        emitEditBool: true,
        emitDetailBool: true,
        detailBool: true,
        arrDelBool: true,
        columns: [
          {
            value: "name",
            label: "地址名称",
            width: "150"
          },
          {
            value: "code",
            label: "地址编码",
            width: "120"
          },
          {
            value: "areaLevel",
            label: "地址级别",
            slotBool: true,
            width: "120"
          },
          {
            value: "parentCode",
            label: "上级地址编码",
            width: "120"
          },
          {
            value: "parentCodes",
            label: "所有上级地址编码",
            width: "120"
          }
        ]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      },

      dialog: {
        isTable: true,
        btnText: "创建区域",
        titleText: "创建区域",
        readBool: false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,

        ruleForm2: {
          name: '',
          parentCode: '',
          parentCodes: '',
          areaLevel: 3
        },
        rules2: {
          name: this.$plug.valid.isNull(),
          parentCode: this.$plug.valid.isNull()
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
        searchParameter: searchParameter
      };
      return await this.Api.getAreaConfig(para);
    },
    // 显示新增界面
    handleAdd(params) {
      this.dialog.titleText = "创建区域";
      this.dialog.saveFormVisible = true;
      this.optionsAreas.length=0;
      this.optionsParentAreas.length=0;
      this.findParent(params.areaLevel);
      this.dialog.addOrUpdate = true;
    },
    findParent(areaLevel) {
      for (let i = 0; i < this.optionsArea.length; i++) {
        if (this.optionsArea[i].areaLevel == (areaLevel-1)) {
          this.optionsAreas.push(this.optionsArea[i]);
          let id = this.optionsArea[i].id;
          this.findParent(id);
        }else if(this.optionsArea[i].areaLevel == (areaLevel-2)) {
          this.optionsParentAreas.push(this.optionsArea[i]);
          let id = this.optionsArea[i].id;
          this.findParent(id);
        }
      }
    },
    getAreaLevel(val) {
      this.optionsAreas.length=0;
      this.optionsParentAreas.length=0;
      this.dialog.ruleForm2.parentCode='';
      this.dialog.ruleForm2.parentCodes='';
      this.findParent(val)
    },
    getParentArea(val) {
      this.dialog.ruleForm2.parentCodes='';
      for (let i = 0; i < this.optionsArea.length; i++) {
        if (this.optionsArea[i].id == val) {
          this.dialog.ruleForm2.parentCodes=this.optionsArea[i].parentCodes;
        }
      }
    },
    handleDetail(params) {
      this.dialog.titleText = "查看区域";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
      this.getInfo(params.id);
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑区域";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = false;
      this.getInfo(params.id);
      this.findParent(params.areaLevel);
      this.dialog.addOrUpdate = false;
    },
    async getInfo(id) {
      this.optionsAreas.length=0;
      this.optionsParentAreas.length=0;
      let res = await this.Api.getAreaConfigDetail({ id });
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    // 新增修改
    async handleSave(row, savePrompt) {
      if (!row.id) {
        savePrompt(this.Api.addAreaConfig, row);
      } else {
        savePrompt(this.Api.editAreaConfig, row);
      }
    },
    async handleDel(row, delPrompt) {
      //删除
      delPrompt(this.Api.deleteAreaConfig, {
        id: row.id
      });
    }
  },
  async created() {
    let resArea = await this.Api.AreaList({});
    this.optionsArea = this.$plug.public.transformList(resArea.data, 'id', 'name');
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

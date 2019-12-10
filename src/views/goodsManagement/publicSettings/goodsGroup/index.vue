<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :timeRangeVal="['time1']" :pagination="pagination" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool"
                  :dialog="dialog"
                  @add="handleAdd">
      </search-sub>
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
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="updateTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{ index,row }">
          <el-button @click="handleGoods(row)" type="text" size="small">查看商品</el-button>
        </template>
      </table-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave" >
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="分组名称" data-name="name">*</i>分组名称：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>排序值：</td>
            <td>
              <el-input v-model="dialog.ruleForm2.sortNo" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>说明：</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
        </template>
      </dialog-sub>
      <!--dialog弹窗2-->
      <dialog-sub :dialog="dialog2" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <el-table
            :data="dialog2.goodsList"
            border
            style="width: 100%">
            <el-table-column label="icon">
              <template slot-scope="{index, row}">
                <img :src="row.picUrl" width="40"/>
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              label="商品编号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="title"
              label="商品名称"
              width="180">
            </el-table-column>
            <el-table-column fixed="right" label="操作" :width="table.width?table.width:120" align="center">
              <template slot-scope="props">
                <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(props.row,props.$index,dialog2.groupId)">移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination small background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pagination.page" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.count"
                        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
                        style="float:right;margin-top: 10px;">
          </el-pagination> -->
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
import bus from '@/utils/bus.js'
// import CheckPeople from '../../../checkPeople';
import CheckModule from '../../../checkModule';
import selector from '@/components/Selector/filesEntry';

export default {
  data() {
    return {
      quickSearch: {
        isTimeRange: true,
        isShow: true
      },
      searchBool: false,
      searchObj: [
        {
          value: "keyWord",
          label: "",
          name: "关键字",
          isText: true,
          placeholder: "编号/名称"
        },{
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
        detailBool: false,
        arrDelBool: true,
        columns: [
          {
            value: "code",
            label: "编号",
            width: "100"
          },
          {
            value: "name",
            label: "分组名称",
            width: "150"
          },
          {
            value: "sortNo",
            label: "排序值",
            width: "100",
            sortable: true
          },
          {
            value: "goodsCount",
            label: "商品数",
            width: "100",
            sortable: true
          },
          {
            value: "remarks",
            label: "说明",
            width: "140",
          },
          {
            value: "createBy",
            label: "创建人",
            width: "100"
          },
          {
            value: "updateTime",
            label: "创建时间",
            width: "140",
            sortable: true
          }
        ]
      },

      pagination: {
        page: 1,
        count: 10,
        total: 0
      },

      dialog: {
        btnText: "添加分组",
        titleText: "添加分组",
        readBool:false,
        saveFormVisible: false,
        saveLoading: false,
        pavalBool: true,
        tableBool: true,
        isTable: true,
        // addBool:true,
        ruleForm2: {
          name: "",
          sortNo: "",
          remarks: ""
        },
        rules2: {
          name: this.$plug.valid.isNull()
        }
      },
      dialog2: {
        closeBtnBool: true,
        cancelBtnBool: true,
        btnBool: true,
        titleText: '查看商品',
        btnText: '查看商品',
        titleText: '查看商品',
        width: '750px',
        saveFormVisible: false,
        type: 'permission',
        goodsList: [],
        groupId: ''
      },
    }
  },
  components: {
    DialogSub,
    SearchSub,
    CheckModule,
    TableSub,
    selector
    // ,
    // CheckPeople
  },
  methods: {
    async getDataList() {
      //获取列表
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
      let para = Object.assign({
        page: {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count
        },
        searchParameter
      }, quick);
      let resData = await this.Api.getGoodsGroup(para);
      // resData.data.list.map(item => {
      //   if (item.goods == null) {
      //     item.goodsCount = 0;
      //   }else {
      //     item.goodsCount = item.goods.length;
      //   }
      // });
      return resData;
    },
    // 显示新增界面
    handleAdd() {
      this.dialog.titleText = "添加分组";
      this.dialog.saveFormVisible = true;
    },
    handleDetail(params) {
      this.dialog.titleText = "查看分组";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = true;
      this.getInfo(params.id);
    },
    handleEdit(params) {
      this.dialog.titleText = "编辑分组";
      this.dialog.saveFormVisible = true;
      this.dialog.readBool = false;
      this.getInfo(params.id);
    },
    remove(data,index,groupId) {
      this.$confirm('此操作将移除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let res = this.Api.deleteGoodsDeleteGroup({
            "id": groupId,
            "goods": [{
              'id': data.id
            }]
          });
            this.dialog2.goodsList.splice(index,1);
            bus.$emit("loadDialogData");

          this.$message({
            type: 'success',
            message: '移除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移除'
          });          
        });
      // this.$plug.prompt.del(this.handleRemove, data,index);
    },
    // async handleRemove(row,index){
    //     console.log(index)
    //   // let res = await this.Api.deleteGoodsDeleteGroup({	"goods":[{
    //   //   'id': row.id
    //   // }]});

    //   if (res.status == 1){
    //   }
      
    // },
    async getInfo(id) {
      let res = await this.Api.getGoodsGroupFind({id});
      if (res.status == 1) {
        this.dialog.ruleForm2 = res.data;
      }
    },
    // 新增修改
    async handleSave(row, savePrompt) {
      if (!row.id) {
        savePrompt(this.Api.saveGoodsGroup, row);
      } else {
        savePrompt(this.Api.updateGoodsGroup, row);
      }
    },
    async handleDel(row, delPrompt) {
      //删除
      delPrompt(this.Api.delGoodsGroup, {
        id: row.id
      });
    },
    async handleGoods(row) {
      this.dialog2.saveFormVisible = true;
      let {data} = await this.Api.getGoodsGroupFind({id: row.id})
      data.goods.map(i => {
        let goodsVal = []
        i.goodsVal = goodsVal.length ? goodsVal.join() : ''
        let goodsPic = []
        i.goodsPic = goodsPic.length ? goodsPic.join() : ''
      })
      this.dialog2.goodsList = data.goods
      this.dialog2.groupId = row.id
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

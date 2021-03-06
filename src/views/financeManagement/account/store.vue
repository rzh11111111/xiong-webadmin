<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub" @detail="handleDetail"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="Bankroll" slot-scope="{ index,row }">
          <el-button class="width100" type="text" size="mini" @click.stop="handleStats(row)">查看账户</el-button>
        </template>
        <template slot="code" slot-scope="{ index,row }">
          <span v-if="!!row.store">{{row.store.code}}</span>
        </template>
        <template slot="nickName" slot-scope="{ index,row }">
          <span v-if="!!row.store">{{row.store.nickName}}</span>
        </template>
        <template slot="name" slot-scope="{ index,row }">
          <span v-if="!!row.store">{{row.store.name}}</span>
        </template>
        <template slot="storeType" slot-scope="{ index,row }">
          <span v-for="s in storeType" :key="s.value" v-if="s.value == row.storeType * 1">{{s.label}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <el-switch
            :value="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="handleStatus(row)">
          </el-switch>
        </template>
        <template slot="moneyGoodsReceivable" slot-scope="{index, row}">
          <span>{{(row.moneyGoodsReceivable / 100)|currency}}</span>
        </template>
        <template slot="moneyGoodsExtract" slot-scope="{index, row}">
          <span>{{(row.moneyGoodsExtract / 100)|currency}}</span>
        </template>
        <template slot="money" slot-scope="{index, row}">
          <span>{{(row.money / 100)|currency}}</span>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{index, row}">
          <el-dropdown size="mini" split-button @click.stop="handleDetail(row)">
            <span class="el-dropdown-link">
              详细信息
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleSettlement(row)">结算单</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleBalance(row)">收支明细</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleWithdraws(row)">提现记录</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </table-sub>
      <dialog-sub :dialog="detailDialog">
        <template slot="dialog">
          <store-info :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></store-info>
        </template>
      </dialog-sub>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList">
        <template slot="dialog">
          <tr>
            <td>子账户名：</td>
            <td>
              <span>{{dialog.ruleForm2.SubAcctName}}</span>
            </td>
          </tr>
          <tr>
            <td>子账户属性：</td>
            <td>
              <span>{{returnSubAcctProperty(dialog.ruleForm2.SubAcctProperty)}}</span>
            </td>
          </tr>
          <tr>
            <td>子账号：</td>
            <td>
              <span>{{dialog.ruleForm2.SubAcctNo}}</span>
            </td>
          </tr>
          <tr>
            <td>账户可用余额：</td>
            <td>
              <span>{{dialog.ruleForm2.AcctAvailBal}}</span>
            </td>
          </tr>
          <tr>
            <td>可提现金额：</td>
            <td>
              <span>{{dialog.ruleForm2.CashAmt}}</span>
            </td>
          </tr>
          <tr>
            <td>交易网会员代码：</td>
            <td>
              <span>{{dialog.ruleForm2.MaintenanceDate}}</span>
            </td>
          </tr>
          <tr>
            <td>维护日期：</td>
            <td>
              <span>{{dialog.ruleForm2.TranNetMemberCode}}</span>
            </td>
          </tr>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import {currency} from "@/filters";
  import {format} from "@/utils";
  import bus from "@/utils/bus";
  import TableSub from '@/components/TableSub';
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub';
  import storeInfo from "../../storeManagement/storeInfo";

  export default {
    data() {
      let status = [{
            value: 1,
            label: '正常'
          }, {
            value: 2,
            label: '冻结'
          }];

      let storeType = [{
          value: 1,
          label: '种子店'
        }, {
          value: 2,
          label: '特色店'
        }];
      return {
        searchBool: false,
        format,
        status,
        statusColor: ['success', 'danger'],
        storeType,
        quickSearch: {
          isShow: true,
          hideTime: true,
          group: [{
            value: 'storeType',
            label: null,
            selected: null,
            list: storeType
          }, {
            value: 'status',
            label: null,
            selected: null,
            list: status
          }]
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '店铺',
          isText: true,
          placeholder: '编码/名称'
        }],

        table: {
          arrDelBool: true,
          delBool: true,
          editBool: true,
          detailBool: false,
          columns: [{
            value: 'code',
            label: '店铺编码',
            width: '150',
            slotBool: true
          }, {
            value: 'nickName',
            label: '店铺名称',
            width: '150',
            slotBool: true
          }, {
            value: 'name',
            label: '店铺营业执照名称',
            width: '150',
            slotBool: true
          }, {
            value: 'storeType',
            label: '店铺类型',
            slotBool: true,
            width: '140'
          }, {
            value: 'moneyGoodsReceivable',
            label: '应收',
            width: '140',
            slotBool: true
          }, {
            value: 'moneyGoodsExtract',
            label: '提现中',
            width: '140',
            slotBool: true
          }, {
            value: 'money',
            label: '可提现',
            width: '140',
            slotBool: true
          }, {
            value: 'Bankroll',
            label: '见证宝账户',
            width: '140',
            slotBool: true
          }, {
            value: 'status',
            label: '状态',
            slotBool: true,
            width: '140'
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
          width: '500px',
          btnText: "",
          titleText: "",
          readBool:true,
          isTable: true,
          saveFormVisible: false,
          saveLoading: false,
          pavalBool: true,
          tableBool: true,
          addBool:true,
          ruleForm2: {},
          rules2: {}
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
          storeType: 2,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true
        }
      }
    },
    filters: {
      currency
    },
    components: {
      DialogSub,
      SearchSub,
      TableSub,
      storeInfo
    },
    methods: {
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);

        let searchParameter = {
          keyWord: queryPo.keyWord
        }

        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected) {
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

        let res = await this.Api.getStoreFinaPage(para);
        return res;
      },
      handleDetail(row) {
        if (!row.store) {
          return this.$message.error('没有对应店铺');
        }
        this.detailDialog.id = row.store.id;
        this.detailDialog.type = row.storeType;
        this.detailDialog.saveFormVisible = true;
      },
      handleStatus(row) {
        this.$plug.prompt.del(this.changeStatus, {id: row.id}, null, row.status == 2 ? '解冻账户' : '冻结账户');
      },
      async changeStatus(params) {
        let res = await this.Api.statusStoreFina(params);
        if (res.status === 1) {
          bus.$emit('loadDialogData');
        }
      },
      handleBalance(row) {
        this.$router.push({path: '/finance/balance/storeGoods', query: {type: row.storeType, code: row.store ? row.store.code : ''}});
      },
      handleSettlement(row) {
        this.$router.push({path: '/finance/settlement/storeGoods', query: {type: row.storeType, code: row.store ? row.store.code : ''}});
      },
      handleWithdraws(row) {
        this.$router.push({path: '/finance/withdraws/goods', query: {type: 2, code: row.store ? row.store.code : ''}});
      },
      handleStats(row){
        this.dialog.saveFormVisible = true;
        // let res = this.Api.payShopSonmoney({
        //   type: 2,
        //   pageNumber: 1,
        //   shopId: row.csShopId
        // });
        let para = {
          type: 2,
          pageNumber: 1,
          storeId: row.storeId
        };
        this.Api.payStoreSonmoney(para).then(res => {
          this.dialog.ruleForm2 = res.data.returnList[0];
        }).catch(error => {
          console.log(error)
        })
      },
      returnSubAcctProperty(type) {
        switch (type) {
          case '1':
            return '普通会员子账号';
          case '2':
            return '挂账子账号';
          case '3':
            return '手续费子账号';
          case '4':
            return '利息子账号';
          case '5':
            return '平台担保子账号';
          default:
            return '无'
        }
      }
    }
  }
</script>

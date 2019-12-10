<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub" @detail="handleDetail"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="code" slot-scope="{ index,row }">
          <span v-if="!!row.merManager">{{row.merManager.code}}</span>
        </template>
        <template slot="username" slot-scope="{ index,row }">
          <span v-if="!!row.merManager">{{row.merManager.username}}</span>
        </template>
        <template slot="name" slot-scope="{ index,row }">
          <span v-if="!!row.merManager">{{row.merManager.name}}</span>
        </template>
        <template slot="merManagerType" slot-scope="{ index,row }">
          <span v-for="type in merManagerType" :key="type.value" v-if="type.value == row.merManagerType">{{type.label}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <el-switch
            :value="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="handleStatus(row)">
          </el-switch>
        </template>
        <template slot="moneyBrokerageReceivable" slot-scope="{index, row}">
          <span>{{(row.moneyBrokerageReceivable / 100)|currency}}</span>
        </template>
        <template slot="moneyBrokerageExtract" slot-scope="{index, row}">
          <span>{{(row.moneyBrokerageExtract / 100)|currency}}</span>
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
              <el-dropdown-item v-if="row.merManagerType !== 1">
                <el-button class="width100" type="text" size="mini" @click.stop="handleWithdraws(row)">提现记录</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </table-sub>
      <!-- 详情 -->
      <dialog-sub key="detail" :dialog="detailDialog">
        <template slot="dialog">
          <template v-if="detailDialog.saveFormVisible ">
            <province-info :dialog="detailDialog" v-if="detailDialog.merManagerType === 1 "></province-info>
            <partner-info :dialog="detailDialog" v-else-if="detailDialog.merManagerType === 2"></partner-info>
            <promoters-info :dialog="detailDialog" v-else-if="detailDialog.merManagerType === 3"></promoters-info>
          </template>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import {currency} from "@/filters";
  import TableSub from '@/components/TableSub';
  import SearchSub from '@/components/SearchSub';
  import {format} from "@/utils";
  import bus from "@/utils/bus";
  import DialogSub from '@/components/DialogSub';
  import provinceInfo from '../../userManagement/detail';
  import partnerInfo from '../../userManagement/partnerDetail';
  import promotersInfo from '../../userManagement/promotersDetail';

  export default {
    data() {
      let status = [{
            value: 1,
            label: '正常'
          }, {
            value: 2,
            label: '冻结'
          }];

      let merManagerType = [{
          value: 1,
          label: '省区总'
        }, {
          value: 2,
          label: '合作商'
        }, {
          value: 3,
          label: '推广员'
        }]
      return {
        searchBool: false,
        format,
        status,
        statusColor: ['success', '', 'danger'],
        merManagerType,
        quickSearch: {
          isShow: true,
          hideTime: true,
          group: [{
            value: 'status',
            label: null,
            selected: null,
            list: status
          }, {
            selected: null,
            value: 'merManagerType',
            label: null,
            list: merManagerType
          }]
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '登录名/用户编码/用户姓名'
        }],

        table: {
          arrDelBool: true,
          delBool: true,
          editBool: true,
          detailBool: false,
          columns: [{
            value: 'code',
            label: '用户编码',
            width: '150',
            slotBool: true
          }, {
            value: 'username',
            label: '登录名',
            width: '140',
            slotBool: true
          }, {
            value: 'name',
            label: '用户姓名',
            width: '150',
            slotBool: true
          }, {
            value: 'merManagerType',
            label: '角色',
            slotBool: true,
            width: '140'
          }, {
            value: 'moneyBrokerageReceivable',
            label: '入账中',
            width: '140',
            slotBool: true
          }, {
            value: 'moneyBrokerageExtract',
            label: '提现中',
            width: '140',
            slotBool: true
          }, {
            value: 'money',
            label: '可提现',
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
          addBool: true
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
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
      SearchSub,
      TableSub,
      DialogSub,
      provinceInfo,
      partnerInfo,
      promotersInfo
    },
    methods: {
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
        }, quick, queryPo);

        return await this.Api.getMerFinaPage(para);
      },
      handleDetail(row) {
        if (!row.merManager) {
          return false;
        }
        this.detailDialog.id = row.merManager.id;
        this.detailDialog.merManagerType = row.merManagerType;
        this.detailDialog.saveFormVisible = true;
      },
      handleStatus(row) {
        this.$plug.prompt.del(this.changeStatus, {id: row.id}, null, row.status == 2 ? '解冻账户' : '冻结账户');
      },
      async changeStatus(params) {
        let res = await this.Api.statusMerFina(params);
        if (res.status === 1) {
          bus.$emit('loadDialogData');
        }
      },
      handleBalance(row) {
        if (!row.merManager) {
          return this.$message.error('没有对应用户');
        }
        let type = null;
        switch(row.merManagerType * 1) {
          case 1:
            type = 3;
          break;
          case 2:
            type = 2;
          break;
          case 3:
            type = 1;
          break;
        }
        this.$router.push({path: '/finance/balance/merManager', query: {type, code: row.merManager.code}});
      },
      handleSettlement(row) {
        if (!row.merManager) {
          return this.$message.error('没有对应用户');
        }
        let type = row.merManagerType;
        switch(row.merManagerType * 1) {
          case 3:
            type = 1;
          break;
        }
        this.$router.push({path: '/finance/settlement/profit', query: {type, code: row.merManager.code}});
      },
      handleWithdraws(row) {
        if (!row.merManager) {
          return this.$message.error('没有对应用户');
        }
        let type = null;
        switch(row.merManagerType * 1) {
          case 1:
            type = 3;
          break;
          case 2:
            type = 2;
          break;
          case 3:
            type = 1;
          break;
        }
        this.$router.push({path: '/finance/withdraws/spread', query: {type, code: row.merManager.code}});
      }
    }
  }
</script>

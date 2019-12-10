<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <table-sub ref="tableSub" @detail="handleDetail"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-tag :type="row.isEnable == 1 ? 'danger' : 'success'">{{row.isEnable == 1 ? '停用' : '启用'}}</el-tag>
        </template>
        <template slot="nickName" slot-scope="{ index,row }">
          <span v-if="!!row.shop">{{row.shop.nickName}}</span>
        </template>
        <template slot="merManager" slot-scope="{ index,row }">
          <span v-if="!!row.shop && row.shop.merManager">{{row.shop.merManager.name}}</span>
        </template>
        <template slot="code" slot-scope="{ index,row }">
          <span v-if="!!row.shop">{{row.shop.code}}</span>
        </template>
        <template slot="userName" slot-scope="{ index,row }">
          <span v-if="!!row.shop">{{row.shop.userName}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <el-tag :type="statusColor[row.status - 1]" v-for="s in status" :key="s.value" v-if="s.value === row.status">{{s.label}}</el-tag>
        </template>
        <template slot="delFlag" slot-scope="{index, row}">
          <span v-for="d in delFlag" :key="d.value" v-if="d.value === row.delFlag">{{d.label}}</span>
        </template>
        <template slot="moneyBrokerageReceivable" slot-scope="{index, row}">
          <span>{{row.moneyBrokerageReceivable|currency}}</span>
        </template>
        <template slot="money" slot-scope="{index, row}">
          <span>{{row.money|currency}}</span>
        </template>
        <template slot="moneyBrokerageFreeze" slot-scope="{index, row}">
          <span>{{row.moneyBrokerageFreeze|currency}}</span>
        </template>
        <template slot="moneyBrokerageExtract" slot-scope="{index, row}">
          <span>{{row.moneyBrokerageExtract|currency}}</span>
        </template>
        <template slot="settleType" slot-scope="{index, row}">
          {{settleType[row.settleType - 1]}}
        </template>
        <template slot="approvalTime" slot-scope="{ index,row }">
          <span v-if="!!row.approvalTime">{{format(new Date(row.approvalTime), "yyyy-MM-dd hh:mm:ss")}}</span>
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
                <el-button class="width100" type="text" size="mini" @click.stop="handleRecord(row)">资金流水</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleCash(index, row)">提现记录</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleSettleType(row)">结算方式</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleStatus(row)">{{row.status === 3 ? '解冻账户' : '冻结账户'}}</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="width100" type="text" size="mini" @click.stop="handleOperate(row)">操作记录</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </table-sub>
      <el-dialog width="410px" :visible.sync="settleTypeDialog.visible" title="结算方式设置">
        <el-form :rules="settleTypeDialog.rules" label-width="80px">
          <el-form-item label="结算方式">
            <el-radio-group v-model="settleTypeDialog.ruleForm.settleType">
              <el-radio border v-for="(type, inx) in settleType" :key="inx" :label="inx + 1">{{type}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="settleTypeDialog.visible = false">取 消</el-button>
            <el-button type="primary" @click="handleOperateSettleType">确 定</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {currency} from "@/filters";
  import TableSub from '@/components/TableSub';
  import SearchSub from '@/components/SearchSub';
  import {format} from "../../../utils";

  export default {
    data() {
      let status = [{
            value: '1',
            label: '正常'
          }, {
            value: '2',
            label: '关闭'
          }, {
            value: '3',
            label: '冻结'
          }];

      let delFlag = [{
        value: 0,
        label: '已通过'
      }, {
        value: 2,
        label: '待审批'
      }, {
        value: 3,
        label: '驳回'
      }];
      let type = [{
        value: 1,
        label: '种子店'
      }, {
        value: 2,
        label: '特色店'
      }]
      return {
        searchBool: false,
        format,
        status,
        settleType: ['确认收货后结算', '订单完成后结算'],
        statusColor: ['success', '', 'danger'],
        delFlag,
        storeType: type,
        quickSearch: {
          isShow: true,
          group: [{
            value: 'isEnable',
            label: null,
            selected: null,
            list: [{
              label: '启用',
              value: 0
            }, {
              label: '停用',
              value: 1
            }]
          }, {
            value: 'status',
            label: null,
            selected: null,
            list: status
          }, {
            value: 'delFlag',
            label: null,
            selected: null,
            list: delFlag
          }]
        },
        searchObj: [{
          value: 'userName',
          label: '',
          name: '老板的账户名',
          isText: true
        }, {
          value: 'shopId',
          label: '',
          name: '店铺主id',
          isText: true
        }],

        table: {
          emitDetailBool: true,
          detailBool: false,
          arrDelBool: true,
          delBool: true,
          editBool: true,
          columns: [{
            value: 'code',
            label: '编码',
            width: '100',
            slotBool: true
          }, {
            value: 'nickName',
            label: '公司名称',
            width: '140',
            slotBool: true
          }, {
            value: 'userName',
            label: '账号名',
            width: '150',
            slotBool: true
          }, {
            value: 'merManager',
            label: '推广人',
            width: '150',
            slotBool: true
          }, {
            value: 'type',
            label: '角色类型',
            slotBool: true,
            width: '140'
          }, {
            value: 'status',
            label: '状态',
            slotBool: true,
            width: '140'
          }, {
            value: 'isEnable',
            label: '是否启用',
            slotBool: true,
            width: '140'
          }, {
            value: '',
            label: '总应收',
            width: '140',
            slotBool: true
          }, {
            value: 'moneyBrokerageReceivable',
            label: '应收',
            width: '140',
            slotBool: true
          }, {
            value: 'money',
            label: '可用',
            width: '140',
            slotBool: true
          }, {
            value: 'moneyBrokerageFreeze',
            label: '冻结',
            width: '140',
            slotBool: true
          }, {
            value: 'moneyBrokerageExtract',
            label: '提现',
            width: '140',
            slotBool: true
          }, {
            value: '',
            label: '总已提现',
            width: '140',
            slotBool: true
          }, {
            value: 'settleType',
            label: '结算方式',
            width: '140',
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
          addBool: true
        },
        settleTypeDialog: {
          visible: false,
          ruleForm: {}
        }
      }
    },
    filters: {
      currency
    },
    components: {
      SearchSub,
      TableSub
    },
    methods: {
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);

        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        // if (queryPo && queryPo.starTime) {
        //   searchParameter.starTime = format(new Date(queryPo.starTime), 'yyyy-MM-dd hh:mm:ss')
        // }
        // if (queryPo && queryPo.endTime) {
        //   searchParameter.endTime = format(new Date(queryPo.endTime), 'yyyy-MM-dd hh:mm:ss')
        // }
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
        }, quick, queryPo, {
          type: this.shopType
        });

        let res = await this.Api.getCityWideFinaPage(para);
        return res;
      },
      handleDetail(row) {
        if (!row.shop) {
          return false;
        }
        this.$router.push({path: '/seller/shop/' + row.shop.id, query: {shopType: 1, isFinance: true}});
      },
      handleRecord(row) {
        this.$router.push({path: '/finance/account/shop/record/' + row.id, query: {type: 2, isFinance: true}});
      },
      handleCash(row) {
        alert('提现记录');
      },
      handleSettleType(row) {
        this.settleTypeDialog.ruleForm = Object.assign({}, row);
        if (!this.settleTypeDialog.ruleForm.settleType) {
          this.settleTypeDialog.ruleForm.settleType = 1;
        }
        this.settleTypeDialog.visible = true;
      },
      handleOperateSettleType() {
        let row = this.settleTypeDialog.ruleForm;
        this.settleTypeDialog.visible = false;

      },
      handleStatus(row) {
        if (row.status === 3) {
          alert('解冻')
        } else {
          alert('冻结')
        }
      },
      handleOperate(row) {
        alert('操作记录')
      }
    }
  }
</script>

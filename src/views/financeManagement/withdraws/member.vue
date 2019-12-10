<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :quickSearch="quickSearch" :timeRangeVal="['time1']" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog">
        <template slot="arrDel">
          <el-select class="width100" size="mini" v-model="selectStatus" @change="changeStatus">
            <el-option :value="1" label="待处理"></el-option>
            <el-option :value="2" label="已同意"></el-option>
          </el-select>
          <el-button type="primary" size="mini" :disabled="selectStatus === 2" @click="handleBatchAgree(null, 1)">批量同意</el-button>
          <el-button type="primary" size="mini" :disabled="selectStatus === 1" @click="handleBatchSuccess">批量打款成功</el-button>
        </template>
      </search-sub>
      <table-sub ref="tableSub"
                 :getDataList="getDataList" :table="table" :pagination="pagination" @arrDel="handleBatch">
        <template slot="status" slot-scope="{ index,row }">
          <el-tag :type="statusColor[row.status - 1]">{{status[row.status * 1 - 1]}}</el-tag>
        </template>
        <template slot="bankCardId" slot-scope="{index, row}">
          <div style="text-align: left;">
            <!-- <div v-if="!!row.bankCardType">账户类型：{{row.bankCardType === 2 ? '对私' : '对公'}}</div> -->
            <div>收款银行：{{row.bankCardBankName}}</div>
            <div>银行账户：{{row.bankCardBankNo}}</div>
            <div>账户名称：{{row.bankCardAccountName}}</div>
          </div>
        </template>
        <template slot="memberCode" slot-scope="{index, row}">
          <template v-if="!!row.member">
            {{row.member.code}}
          </template>
        </template>
        <template slot="memberNickname" slot-scope="{index, row}">
          <template v-if="!!row.member">
            {{row.member.nickname}}
          </template>
        </template>
        <template slot="extractMoney" slot-scope="{index, row}">
          <span>{{(row.extractMoney / 100)|currency}}</span>
        </template>
        <template slot="paymentMoney" slot-scope="{index, row}">
          <span>{{(row.paymentMoney / 100)|currency}}</span>
        </template>
        <template slot="tallageMoneyRate" slot-scope="{index, row}">
          <span>{{(row.tallageMoneyRate / 100)|currency}}</span>
        </template>
        <template slot="extractMoneyRate" slot-scope="{index, row}">
          <span>{{(row.extractMoneyRate / 100)|currency}}</span>
        </template>
        <template slot="extractMoneyBefore" slot-scope="{index, row}">
          <span>{{(row.extractMoneyBefore / 100)|currency}}</span>
        </template>
        <template slot="disposeTime" slot-scope="{ index,row }">
          <span v-if="!!row.disposeTime">{{format(new Date(row.disposeTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{index, row}">
          <template v-if="row.status === 1">
            <el-button type="text" size="mini" @click="handleAgree(row, 1)">同意</el-button>
            <el-button type="text" size="mini" @click="handleAgree(row, 0)">拒绝</el-button>
          </template>

          <template v-else-if="row.status === 2">
            <el-button type="text" size="mini" @click="handlePayment(row, 1)">打款成功</el-button>
            <el-button type="text" size="mini" @click="handlePayment(row, 0)">打款失败</el-button>
          </template>

        </template>
      </table-sub>
      <el-dialog title="拒绝原因" :visible.sync="remarksDialog.visible" width="350px">
        <el-input type="textarea" :rows="5" v-model="remarksDialog.disposeRemarks" placeholder="请填写拒绝原因" class="remarks-box"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="remarksDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAgree">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {currency} from "@/filters";
  import {format} from "@/utils";
  import TableSub from '@/components/TableSub';
  import DialogSub from '@/components/DialogSub';
  import SearchSub from '@/components/SearchSub';

  export default {
    data() {
      let query = this.$route.query;

      return {
        searchBool: false,
        format,
        statusColor: ['', 'success', 'success', 'danger', 'danger', 'info', 'info'],
        status: ['待处理', '已同意/打款中', '打款成功', '打款失败', '已拒绝', '关闭', '取消申请'],
        selectStatus: 1,
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        searchObj: [{
          value: 'orderNo',
          label: '',
          name: '提现单',
          isText: true
        }, {
          value: 'memberLike',
          label: query.code || '',
          name: '会员',
          isText: true,
          placeholder: '编号/姓名/昵称'
        }, {
          value: 'time1',
          label: '',
          name: '申请时间',
          isTimeRange: true
        }],
        multilSelection: [],
        table: {
          emitDetailBool: true,
          detailBool: false,
          arrDelBool: true,
          delBool: true,
          disabledName: 'status',
          disabledVals: [2, 3, 4, 5, 6, 7],
          editBool: true,
          type: 'selection',
          columns: [{
            value: 'orderNo',
            label: '提现单号',
            width: '100'
          }, {
            value: 'createTime',
            label: '申请时间',
            width: '140'
          }, {
            value: 'bankCardId',
            label: '银行账户信息',
            width: '230',
            slotBool: true
          }, {
            value: 'memberCode',
            label: '会员编码',
            width: '150',
            slotBool: true
          }, {
            value: 'tcMemberUsername',
            label: '登录名',
            width: '140'
          }, {
            value: 'memberNickname',
            label: '会员昵称',
            width: '140',
            slotBool: true
          }, {
            value: 'extractMoney',
            label: '提现申请金额',
            slotBool: true,
            width: '140'
          }, {
            value: 'tallageMoneyRate',
            label: '代扣代缴税费（20%）',
            width: '170',
            slotBool: true
          }, {
            value: 'extractMoneyRate',
            label: '提现手续费（1%）',
            width: '160',
            slotBool: true
          }, {
            value: 'paymentMoney',
            label: '实际打款金额',
            width: '140',
            slotBool: true
          }, {
            value: 'extractMoneyBefore',
            label: '可提现余额',
            width: '140',
            slotBool: true
          }, {
            value: 'sysEmployeeCode',
            label: '处理人编码',
            width: '140'
          }, {
            value: 'sysEmployeeUsername',
            label: '处理人',
            width: '140'
          }, {
            value: 'disposeTime',
            label: '处理完成时间',
            width: '140',
            slotBool: true
          }, {
            value: 'status',
            label: '状态',
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
          addBool: true
        },
        remarksDialog: {
          disposeRemarks: '',
          id: '',
          visible: false
        }
      }
    },
    filters: {
      currency
    },
    components: {
      DialogSub,
      SearchSub,
      TableSub
    },
    methods: {
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
        }, queryPo);

        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          para.createStartTime = queryPo.time1[0];
          para.createEndTime = queryPo.time1[1];
          delete para.time1;
        }

        let res = await this.Api.getLuckmoneyPage(para);
        return res;
      },
      // handleSelect(selected) {
      //   this.multilSelection = selected || [];
      // },
      changeStatus(val) {
        if (val === 2) {
          this.table.disabledVals = [1, 3, 4, 5, 6, 7];
        } else {
          this.table.disabledVals = [2, 3, 4, 5, 6, 7];
        }
        this.$refs.tableSub.$refs.multipleTable.clearSelection();
        this.$refs.tableSub.$refs.multipleTable.doLayout();
      },
      handleAgree(row, type) {
        if (type !== 1) {
          this.remarksDialog.visible = true;
          this.remarksDialog.disposeRemarks = '';
          this.remarksDialog.id = row.id;
          return ;
        }
        this.$plug.prompt.del(this.agree, {extractLuckmoneyOrderIds: row.id, isRelease: '' + type}, null, type == 1 ? '同意提现' : '拒绝提现');
      },
      submitAgree() {
        if (!this.remarksDialog.disposeRemarks) {
          this.$message.error('请填写拒绝原因');
          return ;
        }
        this.$plug.prompt.del(this.agree, {extractLuckmoneyOrderIds: this.remarksDialog.id, isRelease: '0', disposeRemarks: this.remarksDialog.disposeRemarks}, null, '拒绝提现');
      },
      async agree(params) {
        let res = await this.Api.agreeLuckmoney(params);
        if (res.status === 1) {
          this.remarksDialog.visible = false;
          this.$plug.prompt.saveTip('操作成功');
          this.$refs.tableSub.loadData();
        }
      },
      handleBatchAgree() {
        this.$refs.tableSub.handleBatchOperate('批量通过审核');
      },
      handleBatch(row, delPrompt) {
        if (this.selectStatus == 1) {
          delPrompt(this.Api.agreeLuckmoney, {extractLuckmoneyOrderIds: row.join(','), isRelease: '1'});
        } else if(this.selectStatus == 2) {
          delPrompt(this.Api.paymentLuckmoney, {extractLuckmoneyOrderIds: row.join(','), isRelease: '1'});
        }
      },
      handlePayment(row, type) {
        this.$plug.prompt.del(this.payment, {extractLuckmoneyOrderIds: row.id, isRelease: '' + type}, null, type == 1 ? '打款成功' : '打款失败');
      },
      async payment(params) {
        let res = await this.Api.paymentLuckmoney(params);
        if (res.status === 1) {
          this.$plug.prompt.saveTip('操作成功');
          this.$refs.tableSub.loadData();
        }
      },
      handleBatchSuccess() {
        this.$refs.tableSub.handleBatchOperate('批量打款成功');
      }
    }
  }
</script>
<style type="text/scss" lang="scss">
.remarks-box{
  margin-bottom: -10px;
  &.el-textarea{
    .el-textarea__inner{
      max-width: 300px !important;
    }
  }
}
</style>
<style type="text/scss" lang="scss" scoped>
.btn-left{
  .el-select.el-select--mini{
    width: 100px;
    margin-right: 20px;
  }
}
</style>

<template>
  <div class="dashboard-editor-container">
    <!--<panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>-->
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart id="myChart1" :chart-data="lineChartDatas"></line-chart>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart id="myChart2" :chart-data="lineChartDatas2"></line-chart>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart id="myChart3" :chart-data="lineChartDatas3"></line-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart id="myChart4" :chart-data="lineChartDatas4"></bar-chart>
        </div>
      </el-col>
      <!--列表-->
      <el-col :span="24">
        <div class="time-search">
          <el-date-picker
            class="margin-r10"
            v-model="timeQuantum"
            type="datetimerange"
            :picker-options="pickerOptions2"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
          <el-button class="filter-item" style="width: 90px;" type="primary" v-waves icon="el-icon-search"
                     @click="handleFilter">
            搜索
          </el-button>
        </div>
        <div class="title-money">
          <span class="charge">收费标准</span>
          <span class="totalMoney">费用总计：<i>{{Number(totalMoney).toFixed(2)||'0.00'}}</i>元</span>
        </div>
        <el-table :data="billingDetailList" border highlight-current-row style="width: 100%;">
          <el-table-column prop="name_cn" label="名称"></el-table-column>
          <el-table-column prop="total_count" label="数量"></el-table-column>
          <el-table-column prop="unit_price" label="单价(元)"></el-table-column>
          <el-table-column prop="total_amount" label="总消费(元)"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      title="温馨提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>{{msg_arreas}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="goRecharge">去充值</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="出借方须知"
      :visible.sync="centerDialogVisible1"
      width="45%"
      :close-on-click-modal=false
      :show-close=false
      :close-on-press-escape=false
      center>
      <div>
        <agreements></agreements>
      </div>
      <div style="text-align: right;">
        <el-button style="margin-top: 10px;" size="mini" type="primary" @click="centerDialogVisible1=false">同意</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import {pickerOptions, checkBe, format} from '@/utils'
  import agreements from "../../../components/agreement/agreements"

  import waves from "@/directive/waves/index.js"; // 水波纹指令
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import RaddarChart from './components/RaddarChart'
  import PieChart from './components/PieChart'
  import BarChart from './components/BarChart'

  export default {
    name: 'dashboard-admin',
    components: {
      PanelGroup,
      LineChart,
      RaddarChart,
      PieChart,
      BarChart,
      agreements
    },
    directives: {
      waves
    },
    data() {

      return {
        // 时间搜索
        pickerOptions2: {
          shortcuts: pickerOptions
        },
        centerDialogVisible:false,
        timeQuantum: "", // 时间段
        centerDialogVisible1: false,
        msg_arreas: '',
        totalMoney: null,
        billingDetailList: [],
        lineChartDatas: {
          createTime: [],
          platformCount: [],
          merchantCount: [],
          totalCount: []
        },
        lineChartDatas2: {
          createTime: [],
          platformCount: [],
          merchantCount: [],
          totalCount: [],
        },
        lineChartDatas3: {
          createTime: [],
          platformCount: [],
          merchantCount: [],
          totalCount: [],
        },
        lineChartDatas4: {
          createTime: [],
          moneyData: []
        }
      }
    },
    created() {
      this.centerDialogVisible1=true
      this.handleSetLineChartData()
    },
    mounted() {
      this._getBillingDetails()
      this._shopCostMsg()
    },
    methods: {
      handleSetLineChartData() {
        // this.lineChartData = lineChartData[type];
        this.lineChartDatas = {
          title: '进件',
          legendData: ['统共', '平台', '商户'],
          formatterData: '{b0}<br/>{a0}: {c0}人<br/>{a1}: {c1}人<br/>{a2}: {c2}人',
          createTime: [],
          platformCount: [],
          merchantCount: [],
          totalCount: [],
        }
        this.lineChartDatas2 = {
          title: '转化量',
          legendData: ['统共', '平台', '商户'],
          formatterData: '{b0}<br/>{a0}: {c0}人<br/>{a1}: {c1}人<br/>{a2}: {c2}人',
          createTime: [],
          platformCount: [],
          merchantCount: [],
          totalCount: [],
        }
        this.lineChartDatas3 = {
          title: '转化率',
          legendData: ['统共', '平台', '商户'],
          formatterData: '{b0}<br/>{a0}: {c0}%<br/>{a1}: {c1}%<br/>{a2}: {c2}%',
          createTime: [],
          platformCount: [],
          merchantCount: [],
          totalCount: [],
        }
        this.lineChartDatas4 = {
          title: '支出',
          legendData: ['价格'],
          formatterData: '{b0}<br/>{a0}: {c0}元',
          createTime: [],
          moneyData: []
        }
        let para = {
          days: 7
        }
        this.Api.chargingList(para).then(res => {
          if (res.code == "0000") {
            //进件
            if (res.data.registerList) {
              let datas = res.data.registerList;
              for (let i = 0; i < datas.platformList.length; i++) {
                this.lineChartDatas.createTime.push(datas.platformList[i].create_time)
                this.lineChartDatas.platformCount.push(datas.platformList[i].count); // 平台
              }
              for (let j = 0; j < datas.merchantList.length; j++) {
                this.lineChartDatas.merchantCount.push(datas.merchantList[j].count); // 商户
                this.lineChartDatas.totalCount.push(datas.merchantList[j].count + datas.platformList[j].count); // 统共
              }
            }
            // //转化量
            if (res.data.transList) {
              let datas = res.data.transList;
              for (let i = 0; i < datas.platformLoanList.length; i++) {
                this.lineChartDatas2.createTime.push(datas.platformLoanList[i].create_time)
                this.lineChartDatas2.platformCount.push(datas.platformLoanList[i].count); //平台
              }
              for (let j = 0; j < datas.merchantLoanList.length; j++) {
                this.lineChartDatas2.merchantCount.push(datas.merchantLoanList[j].count);//商户
                this.lineChartDatas2.totalCount.push(datas.merchantLoanList[j].count + datas.platformLoanList[j].count);//统共
              }
            }
            //转化率
            if (res.data.rateList) {
              let datas = res.data.rateList;
              datas.platformLoanRateList.forEach(curr => {  //平台
                this.lineChartDatas3.createTime.push(curr.create_time);
                this.lineChartDatas3.platformCount.push(curr.platformRate);
              })
              datas.merchantLoanRateList.forEach(curr => {  //商户
                this.lineChartDatas3.merchantCount.push(curr.merchantRate);
              })
              //统共
              let transTotal = this.lineChartDatas2.totalCount
              let registerTotal = this.lineChartDatas.totalCount
              for (let i = 0; i < transTotal.length; i++) {
                let rate = registerTotal[i] != 0 ? ((transTotal[i] / registerTotal[i]) * 100).toFixed(2) : 0;
                this.lineChartDatas3.totalCount.push(rate)
              }
            }
            //收费标准
            if (res.data.chargingList) {
              let datas = res.data.chargingList;
              datas.forEach(curr => {  //商户
                this.lineChartDatas4.moneyData.push(curr.total_amount);
                this.lineChartDatas4.createTime.push(curr.create_time);
              })
            }
          }
        });
      },
      //收费明细
      _getBillingDetails() {
        this.totalMoney = null;
        let startTime = null;
        let endTime = null;
        if (this.timeQuantum) {
          startTime = format(
            new Date(this.timeQuantum[0]),
            "yyyy-MM-dd hh:mm:ss"
          );
          endTime = format(
            new Date(this.timeQuantum[1]),
            "yyyy-MM-dd hh:mm:ss"
          );
        }
        let para = {
          startTime: startTime,
          endTime: endTime
        };
        this.Api.getBillingDetails(checkBe(para)).then(res => {
          if (res.code == "0000") {
            if (res.data) {
              this.billingDetailList = res.data.statistics_datas;
              this.totalMoney = res.data.total_amount
            }
          }
        });
      },
      _shopCostMsg() {
        this.Api.shopCostMsg().then(res => {
          if (res.code === '0000') {
            if (res.data) {
              if (res.data.amount <= 10000) {
                this.msg_arreas = `您的余额已不足${res.data.amount}，${res.data.msgCost}`
                this.centerDialogVisible = true
              } else if (res.data.amount <= 0) {
                this.msg_arreas = `您的余额已不足，${res.data.msgCost}`
                this.centerDialogVisible = true
              }
            }
          }
        })
      },
      goRecharge() {
        this.$router.push("/business/myMerchant")
      },
      // 搜索
      handleFilter() {
        this._getBillingDetails();
      },
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .time-search {
      background-color: #ffffff;
      height: 50px;
      line-height: 50px;
      padding-left: 10px;
    }
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
    .title-money {
      background-color: #ffffff;
      margin: 0;
      height: 50px;
      line-height: 50px;
      text-align: center;
      .charge {
        font-weight: bold;
      }
      .totalMoney {
        float: right;
        padding-right: 20px;
        i {
          color: #f43641;
        }
      }
    }
  }
</style>

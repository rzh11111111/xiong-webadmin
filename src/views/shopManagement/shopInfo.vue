<template>
  <el-container class="info-page-wrapper">
    <el-header>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="0">概览</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="1">基本信息</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="2">合同及费率</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="3">财务信息</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="4">对接人</el-radio-button>
      </el-radio-group>
    </el-header>
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main>
        <div class="info-page-box">
          <template v-if="activeName == 1">
            <Account :source="source" :shopType="source.type * 1"></Account>
          </template>
          <template v-else-if="activeName == 2">
            <Agreement :source="source" :shopType="source.type * 1"></Agreement>
          </template>
          <template v-else-if="activeName == 3">
            <FinancialInfo :source="source" :shopType="source.type * 1"></FinancialInfo>
          </template>
          <template v-else-if="activeName == 4">
            <template v-for="role in communication" v-if="!!source.shopCommunicationBookList">
              <template v-for="item in source.shopCommunicationBookList" v-if="item.role === role">
                <div class="info-list" >
                  <h4 class="step-title-tag"><i class="icon-tag"></i>{{item.role}}</h4>
                  <table class="form-table">
                    <tr>
                      <td>姓名：</td>
                      <td>{{item.name}}</td>
                    </tr>
                    <tr>
                      <td>手机：</td>
                      <td>{{item.phone}}</td>
                    </tr>
                    <tr v-if="!!item.wechat">
                      <td>微信：</td>
                      <td>{{item.wechat}}</td>
                    </tr>
                    <tr v-if="!!item.email">
                      <td>邮箱：</td>
                      <td>{{item.email}}</td>
                    </tr>
                  </table>
                </div>
              </template>
            </template>
          </template>
          <template v-else>
            <div class="info-list">
              <h4 class="step-title-tag"><i class="icon-tag"></i>店铺概览</h4>
              <BaseInfo :source="source" :dialog="dialog" :shopType="source.type * 1"></BaseInfo>
            </div>
          </template>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import BaseInfo from './detail/base';
  import Agreement from './detail/agreement';
  import Account from './detail/account';
  import FinancialInfo from './detail/financialInfo';
  import {format} from "@/utils";

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        source: {},
        activeName: 0,
        communication: ['项目负责人', '省钱熊平台对接人', '物流对接人', '财务对接人', '售后专员1', '售后专员2（选填）'],
      }
    },
    components: {
      BaseInfo,
      Agreement,
      Account,
      FinancialInfo,
    },
    methods: {
      async getSource() {
        let res = await this.Api.getShopInfo({id: this.dialog.id});
        if (res.status == 1) {
          this.source = res.data || {};
        }
      }
    },
    created() {
    },
    mounted() {
      this.getSource();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.form-table td:nth-child(even){
  width: 470px;
}
</style>

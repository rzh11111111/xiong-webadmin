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
    </el-header>
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main>
        <div class="info-page-box">
          <template v-if="activeName == 1">
            <Account :source="source" :storeType="dialog.storeType * 1"></Account>
          </template>
          <template v-else-if="activeName == 2">
            <Agreement :source="source" :storeType="dialog.storeType * 1"></Agreement>
          </template>
          <template v-else-if="activeName == 3">
            <FinancialInfo :source="source" :info="cardInfo" :storeType="dialog.storeType * 1"></FinancialInfo>
          </template>
          <template v-else>
            <div class="info-list">
              <h4 class="step-title-tag"><i class="icon-tag"></i>概览</h4>
              <BaseInfo :source="source" :dialog="dialog" :sourceCount="sourceCount" :storeType="dialog.storeType * 1"></BaseInfo>
            </div>
          </template>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import BaseInfo from './base';
  import Agreement from './agreement';
  import Account from './account';
  import FinancialInfo from './financialInfo';
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
        query: {},
        sourceCount: {},
        cardInfo: {}
      }
    },
    components: {
      BaseInfo,
      Agreement,
      Account,
      FinancialInfo,
    },
    watch: {
      'dialog.id'(id) {
        if (id) {
          this.getSource();
          this.getSourceCount();
        }
      }
    },
    methods: {
      async getSource() {
        let res = await this.Api.findCooperatio({"id": this.dialog.id});
        if (res.status == 1) {
          this.source = res.data || {};
        }
      },
      async getSourceCount() {
        let res = await this.Api.getCooperationCount({
            id: this.dialog.id
        });
        if (res.status === 1) {
          this.sourceCount = res.data || {};
        }
      },
      async getCardInfo() {
        let _res = await this.Api.getMerCard({
          merManager: {id: this.dialog.id}
        });
        if (_res && _res.data) {
          this.cardInfo = _res.data || {};
        } else {
          this.cardInfo = {};
        }
      }
    },
    created() {
    },
    mounted() {
      if (this.dialog.id) {
        this.getSource();
        this.getSourceCount();
        this.getCardInfo();
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>

</style>

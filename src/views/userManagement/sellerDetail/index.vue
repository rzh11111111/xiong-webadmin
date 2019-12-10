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
        <el-radio-button :label="2">财务信息</el-radio-button>
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
            <FinancialInfo :source="source" :storeType="dialog.storeType * 1"></FinancialInfo>
          </template>
          <template v-else>
            <div class="info-list">
              <h4 class="step-title-tag"><i class="icon-tag"></i>概览</h4>
              <BaseInfo :source="source" :dialog="dialog" :storeType="dialog.storeType * 1"></BaseInfo>
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
        query: {}
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
        let res = await this.Api.getSellerDetails({"id": this.dialog.id});
        if (res.status == 1) {
          this.source = res.data || {};
          if (!this.source.storeAccount) {
            this.source.storeAccount = {};
          }
          this.source.merManager = {
            regionBoss: {},
            partner: {}
          }
          let merManager = this.source.storeAccount.merManager || [];
          if (merManager instanceof Array) {
            merManager.forEach(item => {
              switch(item.accountType * 1) {
                case 1:
                  this.source.merManager.spreader = item;
                break;
                case 2:
                  this.source.merManager.partner = item;
                break;
                case 3:
                  this.source.merManager.regionBoss = item;
                break;
              }
            })
          }
        }
      }
    },
    mounted() {
      this.getSource();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>

</style>

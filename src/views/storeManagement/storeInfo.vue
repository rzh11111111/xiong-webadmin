<template>
  <el-container class="info-page-wrapper">
    <el-header>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="0">基本信息</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="1">合同及费率</el-radio-button>
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
            <Agreement :source="source" :storeType="source.store && source.store.type ? source.store.type * 1 : 1"></Agreement>
          </template>
          <template v-else-if="activeName == 2">
            <FinancialInfo :source="source" :storeType="source.store && source.store.type ? source.store.type * 1 : 1"></FinancialInfo>
          </template>
          <template v-else>
            <div class="info-list" v-if="!!source.store">
              <h4 class="step-title-tag"><i class="icon-tag"></i>店铺状态</h4>
              <BaseInfo :source="source" :dialog="dialog" :storeType="source.store && source.store.type ? source.store.type * 1 : 1"></BaseInfo>
            </div>
            <Account :source="source" :storeType="source.store && source.store.type ? source.store.type * 1 : 1"></Account>
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
  import {format, parseQueryString} from "@/utils";

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
        activeName: 0
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
        let res = await this.Api.getStoreDetails({storeId: this.dialog.id});
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

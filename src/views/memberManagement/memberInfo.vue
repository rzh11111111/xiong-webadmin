<template>
  <!-- <div class="wrapper-box">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="概况" name="0">
        <BaseInfo :source="source"></BaseInfo>
      </el-tab-pane>
      <el-tab-pane label="财务信息" name="1">
        <Account :source="source"></Account>
      </el-tab-pane>
    </el-tabs>
  </div> -->
  
  <el-container class="info-page-wrapper">
    <el-header>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="0">概览</el-radio-button>
      </el-radio-group>
      <!-- <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="1">财务信息</el-radio-button>
      </el-radio-group> -->
    </el-header>
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main>
        <div class="info-page-box">
          <template v-if="activeName == 1">
            <Account :source="source"></Account>
          </template>
          <template v-else>
            <BaseInfo :source="source"></BaseInfo>
          </template>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import BaseInfo from './detail/base';
  import Account from './detail/account';
  import {format} from "../../utils";

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
      }
    },
    components: {
      BaseInfo,
      Account
    },
    methods: {
      async getSource() {
        let res = await this.Api.findMember({id: this.dialog.id});
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
.wrapper-box{
  position: relative;
  padding-bottom: 50px;
  font-size: 14px;
  padding: 0 20px 20px;
  .operate-box{
    position: absolute;
    top: 0;
    right: 0;
    span{
      margin-right: 15px;
      font-size: 20px;
      color: #f0c;
    }
  }
  .go-back{
    position: absolute;
    top: 0;
    right: 10px;
  }
  h2{
    font-weight: 200;
  }
}
</style>

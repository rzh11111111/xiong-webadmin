<template>
  <el-container class="info-page-wrapper">
    <el-header>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="0">详情</el-radio-button>
      </el-radio-group>
    </el-header>
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main>
        <div class="info-page-box">
          <div class="info-list">
            <h4 class="step-title-tag"><i class="icon-tag"></i>处理信息</h4>
            <table class="form-table">
              <tr>
                <td>预推广名称：</td>
                <td>{{source.name}}</td>
              </tr>
              <tr>
                <td>预推广类型：</td>
                <td>同城企业预推广</td>
              </tr>
              <tr>
                <td>申请时间：</td>
                <td>{{source.createTime}}</td>
              </tr>
              <tr>
                <td>处理状态：</td>
                <td>
                  <span v-if="!!source.status" :class="statusColor[source.status - 1]">{{status[source.status - 1]}}</span>
                </td>
              </tr>
              <tr>
                <td>备注：</td>
                <td>{{source.remarks}}</td>
              </tr>
            </table>
          </div>
          <div class="info-list">
            <h4 class="step-title-tag"><i class="icon-tag"></i>处理人</h4>
            <table class="form-table">
              <tr>
                <td>处理人编码：</td>
                <td>
                  <!-- <span>{{source.merCode}}</span> -->
                  {{source.managerCode}}
                </td>
              </tr>
              <tr>
                <td>处理人角色：</td>
                <td>
                  <span>省区总</span>
                </td>
              </tr>
              <tr>
                <td>处理人姓名：</td>
                <td>
                  <!-- <span>{{source.merName}}</span> -->
                  {{source.managerName}}
                </td>
              </tr>
            </table>
          </div>
          <div class="info-list">
            <h4 class="step-title-tag"><i class="icon-tag"></i>状态信息</h4>
            <table class="form-table">
              <tr>
                <td>预推广人编码：</td>
                <td>{{source.serviceCode}}</td>
              </tr>
              <tr>
                <td>预推广人角色：</td>
                <td>{{serviceType[source.serviceType - 1]}}</td>
              </tr>
              <tr>
                <td>预推广人姓名：</td>
                <td>{{source.serviceUsername}}</td>
              </tr>
            </table>
           </div>
           <div class="info-list">
             <h4 class="step-title-tag"><i class="icon-tag"></i>经营信息</h4>
             <table class="form-table">
               <tr>
                 <td>类别：</td>
                 <td>{{shopType[source.type - 1]}}</td>
               </tr>
               <tr>
                 <td>经营品牌：</td>
                 <td>{{source.brandNames}}</td>
               </tr>
             </table>
           </div>
           <div class="info-list">
             <h4 class="step-title-tag"><i class="icon-tag"></i>基本信息</h4>
             <table class="form-table">
               <tr>
                 <td>店铺角色：</td>
                 <td>同城企业</td>
               </tr>
               <tr>
                 <td>企业地址：</td>
                 <td>
                     {{source.province}}{{source.city}}{{source.region}}<br/>
                     {{source.contactAddress}}
                 </td>
               </tr>
             </table>
           </div>
           <div class="info-list">
             <h4 class="step-title-tag"><i class="icon-tag"></i>证照信息</h4>
             <table class="form-table">
               <tr>
                 <td>企业名称：</td>
                 <td>{{source.name}}</td>
               </tr>
             </table>
           </div>
           <div class="info-list">
             <h4 class="step-title-tag"><i class="icon-tag"></i>通讯录</h4>
             <table class="form-table">
               <tr>
                 <td>姓名：</td>
                 <td>{{source.contactName}}</td>
               </tr>
               <tr>
                 <td>手机号：</td>
                 <td>{{source.contactPhone}}</td>
               </tr>
             </table>
           </div>
         </div>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  import {format} from "@/utils";

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {}
        }
      },
      source: {
        type: Object,
        default() {
           return {};
        }
      }
    },
    data() {
      return {
        statusColor: ['color-light-blue', '', 'color-red'],
        shopType: ['生产企业', '代理'],
        serviceType: ['省区总', '合作商', '推广员', '种子店', '特色店'],
        accountType: ['推广员', '合作商', '省区总'],
        status: ['待处理', '已处理', '已拒绝'],
        // source: {},
        activeName: 0,
        table: {
          column: []
        }
      }
    },
    methods: {
      async getSource() {

        let res = await this.Api.getShopClueInfo({id: this.dialog.id});
        if (res.status == 1) {
          this.source = res.data || {};
        }
      }
    },
    created() {
    },
    mounted() {
      // this.getSource();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
@import '../../../styles/variables.scss';

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
.list-border-box{
  padding-bottom: 10px;
  border-bottom: 1px dashed #e4e4e4;
}
.color-light-blue{
  color: $light-blue;
}
.color-red{
  color: $red;
}
.form-table td:nth-child(even){
  width: 470px;
}
</style>

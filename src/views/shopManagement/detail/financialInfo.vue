<template>
  <div>
    <div class="info-list">
      <h4 class="step-title-tag"><i class="icon-tag"></i>打款信息</h4>
      <table class="form-table">
        <tr v-if="source.id">
          <td>操作：</td>
          <td>
            <el-button class="refund-btn" style="width:auto" type="primary" @click="handleCreation()">创建平安子账户</el-button>
          </td>
        </tr>
        <tr>
          <td>账户名称：</td>
          <td>
            {{source.shopBankCard ? source.shopBankCard.accountName : ''}}
          </td>
        </tr>
        <tr>
          <td>开户行及账号：</td>
          <td>
            <template v-if="!!source.shopBankCard">{{source.shopBankCard.bankBranch || source.shopBankCard.bankName}}<br/></template>
            <template v-if="!!source.shopBankCard && source.shopBankCard.bankNo">{{source.shopBankCard.bankNo}}</template>
          </td>
        </tr>
      </table>
    </div>
    <!-- <div class="info-list">
      <h4 class="step-title-tag"><i class="icon-tag"></i>开票信息</h4>
      企业开专票
      <table class="form-table">
        <tr>
          <td>是否为一般纳税人：</td>
          <td>是</td>
        </tr>
        <tr>
          <td>发票类型：</td>
          <td>专票 纸质发票</td>
        </tr>
        <tr>
          <td>增值税专用发票复印件：</td>
          <td>
             <div class="img-box" v-if="source.storeBankCard">
              <img :src="source.storeBankCard.bankPermissopnCode" alt=""/>
            </div>
          </td>
        </tr>
        <tr>
          <td>名称：</td>
          <td>杭州三只松鼠股份有限公司</td>
        </tr>
        <tr>
          <td>纳税人识别号：</td>
          <td>234431123423423</td>
        </tr>
        <tr>
          <td>开户行及账号：</td>
          <td>234431123423423</td>
        </tr>
        <tr>
          <td>营业地址与电话：</td>
          <td>杭州市萧山区xx镇xx街道xx号 1123423423</td>
        </tr>
        <tr>
          <td>发票地址：</td>
          <td>杭州市萧山区xx镇xx街道xx号 张三 1123423423</td>
        </tr>
      </table>

      企业开普票1
      <table class="form-table">
        <tr>
          <td>是否为一般纳税人：</td>
          <td>是</td>
        </tr>
        <tr>
          <td>发票类型：</td>
          <td>普票 电子发票</td>
        </tr>
        <tr>
          <td>名称：</td>
          <td>杭州三只松鼠股份有限公司</td>
        </tr>
        <tr>
          <td>纳税人识别号：</td>
          <td>234431123423423</td>
        </tr>
        <tr>
          <td>邮箱：</td>
          <td>3434@qq.com</td>
        </tr>
      </table>


      企业开普票2
      <table class="form-table">
        <tr>
          <td>是否为一般纳税人：</td>
          <td>否</td>
        </tr>
        <tr>
          <td>发票类型：</td>
          <td>普票 电子发票</td>
        </tr>
        <tr>
          <td>名称：</td>
          <td>杭州三只松鼠股份有限公司</td>
        </tr>
        <tr>
          <td>纳税人识别号：</td>
          <td>234431123423423</td>
        </tr>
        <tr>
          <td>邮箱：</td>
          <td>3434@qq.com</td>
        </tr>
      </table>


      个体开普票
      <table class="form-table">
        <tr>
          <td>发票类型：</td>
          <td>普票 电子发票</td>
        </tr>
        <tr>
          <td>名称：</td>
          <td>杭州三只松鼠股份有限公司</td>
        </tr>
        <tr>
          <td>纳税人识别号：</td>
          <td>234431123423423</td>
        </tr>
        <tr>
          <td>邮箱：</td>
          <td>3434@qq.com</td>
        </tr>
      </table>
    </div> -->
  </div>
</template>

<script>
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
          return {}
        }
      }
    },
    data() {
      return {
      	listLoading: true,
        info: [{
          label: '订单数量',
          value: 'orderNo'
        }, {
          label: '消费人数',
          value: 'peopleNo'
        }, {
          label: '累计营业额',
          value: 'turnover'
        }, {
          label: '累计提现次数',
          value: 'cashNo'
        }, {
          label: '累计提现金额',
          value: 'cash'
        }, {
          label: '账户余额',
          value: 'balance'
        }, {
          label: '累计评价次数',
          value: 'evaluateNo'
        }, {
          label: '推荐星数',
          value: 'star'
        }]
      }
    },
    components: {

    },
    methods: {
      handleCreation(){
        this.$confirm('创建平安子账户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.Api.payShopSonaccount({
            shopId: this.source.id
          }).then((res) => {
            if(res.status==1){
              this.$message({
                type: 'success',
                message: '子账户创建成功!'
              });
            }
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      }
    },
    async mounted() {
      // this.getSource();
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
img-list{
   padding: 0;
   margin: 0;
   li{
     margin: 0 5px;
     float: left;
   }
 }
 .img-box{
   display: flex;
   width: 100px;
   height: 100px;
   padding: 3px;
   align-items: center;
   justify-content: center;
   border: 1px solid #e4e4e4;
   border-radius: 4px;
   overflow:hidden;
   &>span{
     display: flex;
     width: 100%;
     height: 100%;
     align-items: center;
     justify-content: center;
   }
   img{
     display: block;
     max-width: 100%;
     max-height: 100%;
   }
 }
  .form-table{
    td{
      &:nth-child(odd){
        width: 170px;
      }
      &:nth-child(even){
        width: 450px;
      }
    }
  }
</style>

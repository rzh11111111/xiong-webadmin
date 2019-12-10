<template>
  <div class="info-list agreement-box">
    <h4 class="step-title-tag"><i class="icon-tag"></i>合同及费率</h4>
    <table class="form-table">
      <tr v-if="!isApproval">
        <td></td>
        <td>
          <el-button size="mini" @click="dialog.visible = true">修改费率</el-button>
        </td>
      </tr>
      <tr v-if="source.type !== 1">
        <td>合同照片：</td>
        <td>
          <ul class="img-list" v-if="!!source.shopInfo && !!source.shopInfo.contractPicUrls">
            <li class="img-box" v-for="(pics, inx) in source.shopInfo.contractPicUrls.split(',')" :key="inx">
              <el-popover
                  placement="top"
                  popper-class="tootip-img-box"
                  trigger="click">
                  <img :src="pics"/>
                  <img slot="reference" :src="pics"/>
              </el-popover>
            </li>
          </ul>
          <div v-if="isApproval && compareSource(['shopInfo', 'contractPicUrls'])" class="approval-before">
            <p class="color-red">变更前：</p>
            <ul class="img-list" v-if="!!oldSource.shopInfo && !!oldSource.shopInfo.contractPicUrls">
              <li class="img-box" v-for="(pics, inx) in oldSource.shopInfo.contractPicUrls.split(',')" :key="inx">
                <el-popover
                    placement="top"
                    popper-class="tootip-img-box"
                    trigger="click">
                    <img :src="pics"/>
                    <img slot="reference" :src="pics"/>
                </el-popover>
              </li>
            </ul>
          </div>
        </td>
      </tr>
      <tr v-if="source.type !== 1">
        <td>合同期限：</td>
        <td>
          <div v-if="!!source.shopInfo && (source.shopInfo.contractStartTime || source.shopInfo.contractEndTime)">
            <template v-if="!!source.shopInfo.contractStartTime">
              {{format(new Date(source.shopInfo.contractStartTime), 'yyyy-MM-dd hh:mm:ss')}}
            </template> -
            <template v-if="!!source.shopInfo.contractStartTime">
              {{format(new Date(source.shopInfo.contractEndTime), 'yyyy-MM-dd hh:mm:ss')}}
            </template>
          </div>
          <div v-if="isApproval && (compareSource(['shopInfo', 'contractStartTime']) || compareSource(['shopInfo', 'contractEndTime']))" class="approval-before">
            <p class="color-red">变更前：</p>
            <div v-if="!!oldSource && (oldSource.shopInfo.contractStartTime || oldSource.shopInfo.contractEndTime)">
              <template v-if="!!oldSource.shopInfo.contractStartTime">
                {{format(new Date(oldSource.shopInfo.contractStartTime), 'yyyy-MM-dd hh:mm:ss')}}
              </template> -
              <template v-if="!!oldSource.shopInfo.contractStartTime">
                {{format(new Date(oldSource.shopInfo.contractEndTime), 'yyyy-MM-dd hh:mm:ss')}}
              </template>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>结算方式：</td>
        <td>
          {{source.settleType === 1 ? '确认发货后结算' : '订单完成后结算'}}
          <div class="approval-before" v-if="isApproval && compareSource(['settleType'])">
            <p class="color-red">变更前：</p>
            {{oldSource.settleType === 1 ? '确认发货后结算' : '订单完成后结算'}}
          </div>
        </td>
      </tr>
      <tr>
        <td>平台服务费率（%）：</td>
        <td>
          <span v-if="!!source.rateConfig">{{source.rateConfig && source.rateConfig.storeRatePlatform ? fixedNum(source.rateConfig.storeRatePlatform * 100) : fixedNum(rateConfig.storeRatePlatform * 100)}}%</span>
          <div class="approval-before" v-if="isApproval && compareSource(['rateConfig', 'storeRatePlatform'])">
            <p class="color-red">变更前：</p>
            <span v-if="!!oldSource.rateConfig">{{oldSource.rateConfig.storeRatePlatform ? fixedNum(oldSource.rateConfig.storeRatePlatform * 100) : fixedNum(rateConfig.storeRatePlatform * 100)}}%</span>
          </div>
        </td>
      </tr>
    </table>
    <el-dialog
    :width="dialog.width"
    :title="dialog.titleText"
    :visible.sync="dialog.visible"
    append-to-body>
      <table class="form-table">
        <tr>
          <td>当前费率（%）</td>
          <td>{{!!source.rateConfig && source.rateConfig.storeRatePlatform ? fixedNum(source.rateConfig.storeRatePlatform * 100) : fixedNum(rateConfig.storeRatePlatform * 100)}}%</td>
          <td>新费率（%）</td>
          <td>
            <el-input v-model="dialog.ruleForm.storeRatePlatform"></el-input>
          </td>
        </tr>
        <tr>
          <td>操作备注</td>
          <td colspan="3">
            <el-input type="textarea" v-model="dialog.ruleForm.remarks" size="medium" :autosize="{ minRows: 3, maxRows: 6}"></el-input>
          </td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleOperate">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import DialogSub from '@/components/DialogSub';
  import {fixedNum, format} from '@/utils';

  export default {
    props: {
      source: {
        type: Object,
        default() {
          return {}
        }
      },
      title: {
        type: String,
        default() {
          return '';
        }
      },
      oldSource: {
        type: Object,
        default() {
          return {}
        }
      },
      isApproval: {
        type: Boolean,
        default() {
          return false;
        }
      },
      delFlag: {
        type: Number,
        default() {
          return null;
        }
      }
    },
    data() {
      return {
        fixedNum,
        format,
        rateConfig: {
          storeRatePlatform: '',
          storeRateSeed: ''
        },
        dialog: {
          titleText: '修改平台服务费率',
          width: '750px',
          visible: false,
          ruleForm: {
            storeRateSeed: '',
            storeRatePlatform: ''
          }
        },
      }
    },
    components: {
      DialogSub
    },
    methods: {
      compareSource(vals) {
        let newVal = Object.assign({}, this.source);
        let oldVal = Object.assign({}, this.oldSource);
        if (!oldVal || !newVal) {
          return false;
        }
        for (var i = 0; i < vals.length; i++) {
          newVal = newVal[vals[i]];
          oldVal = oldVal[vals[i]];
          if (!newVal) {
            if (oldVal) {
              return true;
            }
            return false;
          }
          if (!oldVal) {
            return false;
          }
          if (i === vals.length - 1) {
            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
              return true;
            }
          }
        }
      },
      changeRate() {
        this.dialog.ruleForm.storeRatePlatform = fixedNum(this.rateConfig.storeRatePlatform * 100);
        this.dialog.ruleForm.storeRateSeed = fixedNum(this.rateConfig.storeRateSeed * 100);
        this.dialog.visible = true;
      },
      async handleOperate() {
        let res = await this.Api.updateRate({
          id: this.source.rateConfig.id,
          storeRatePlatform: fixedNum(this.dialog.ruleForm.storeRatePlatform / 100, 8)
        });
        if (res.status === 1) {
          this.$plug.prompt.saveTip('费率修改成功');
          this.source.rateConfig.storeRatePlatform = res.data.storeRatePlatform;
          this.dialog.visible = false;
        }
      },
      async getServiceRate(code, label) {
        let res = await this.Api.findServiceRate({code});
        if (res.status === 1) {
          this.rateConfig[label] = res.message;
        }
      }
    },
    async mounted() {
      this.getServiceRate('SYS19011480946691', 'storeRatePlatform');
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .img-list{
    padding: 0;
    margin: 0;
    li{
      margin: 0 5px 0 0;
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
  .link{
    padding: 0 4px;
    color: #409eff;
  }
  .approval-before{
    font-size: 12px;
    .color-red{
      color: #f00;
    }
  }
  .agreement-box{
    .form-table{
      td{
        &:nth-child(odd){
          width: 170px;
        }
        &:nth-child(even){
          width: 470px;
        }
      }
    }
  }
</style>

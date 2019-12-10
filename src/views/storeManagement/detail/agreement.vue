<template>
  <div class="info-list agreement-box">
      <h4 class="step-title-tag"><i class="icon-tag"></i>合同及费率</h4>
      <template v-if="storeType === 1">
        <table class="form-table">
          <tr v-if="!isApproval">
            <td></td>
            <td>
              <el-button size="mini" @click="changeRate">修改费率</el-button>
            </td>
          </tr>
          <tr>
            <td>合同照片：</td>
            <td>
              <ul class="img-list" v-if="!!source.store && !!source.store.contractPicUrls">
                <li class="img-box" v-for="(pics, inx) in source.store.contractPicUrls.split(',')" :key="inx">
                  <el-popover
                      placement="top"
                      popper-class="tootip-img-box"
                      trigger="click">
                      <img :src="pics"/>
                      <img slot="reference" :src="pics"/>
                  </el-popover>
                </li>
              </ul>
              <div v-if="isApproval && compareSource(['store', 'contractPicUrls'])" class="approval-before">
                <p class="color-red">变更前：</p>
                <ul class="img-list" v-if="!!source.store && !!oldSource.store.contractPicUrls">
                  <li class="img-box" v-for="(pics, inx) in oldSource.store.contractPicUrls.split(',')" :key="inx">
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
          <tr>
            <td>合同期限：</td>
            <td>
              <div v-if="!!source.store && (source.store.contractStartTime || source.store.contractEndTime)">{{source.store.contractStartTime}} - {{source.store.contractEndTime}}</div>
              <div v-if="isApproval && (compareSource(['store', 'contractStartTime']) || compareSource(['store', 'contractEndTime']))" class="approval-before">
                <p class="color-red">变更前：</p>
                <div v-if="!!oldSource.store && (oldSource.store.contractStartTime || oldSource.store.contractEndTime)">{{oldSource.store.contractStartTime}} - {{oldSource.store.contractEndTime}}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td>费率：</td>
            <td>
              <p>(1) 平台收取服务费，收取该种子商户平台销售额的{{source.store && source.store.rateConfig && source.store.rateConfig.storeRatePlatform ? fixedNum(source.store.rateConfig.storeRatePlatform * 100) : fixedNum(rateConfig.storeRatePlatform * 100)}}%；</p>
              <div class="approval-before" v-if="isApproval && compareSource(['store', 'rateConfig', 'storeRatePlatform'])">
                <p class="color-red">变更前：</p>
                <p>(1) 平台收取服务费，收取该种子商户平台销售额的{{oldSource.store && oldSource.store.rateConfig && oldSource.store.rateConfig.storeRatePlatform ? fixedNum(oldSource.store.rateConfig.storeRatePlatform * 100) : fixedNum(rateConfig.storeRatePlatform * 100)}}%；</p>
              </div>
              <p>(2) 平台补贴种子商户，补贴该种子商户平台销售额的{{source.store && source.store.rateConfig && source.store.rateConfig.storeRateSeed ? fixedNum(source.store.rateConfig.storeRateSeed * 100) : fixedNum(rateConfig.storeRateSeed * 100)}}%；</p>
              <div class="approval-before" v-if="isApproval && compareSource(['store', 'rateConfig', 'storeRateSeed'])">
                <p class="color-red">变更前：</p>
                <p>(2) 平台补贴种子商户，补贴该种子商户平台销售额的{{oldSource.store && oldSource.store.rateConfig && oldSource.store.rateConfig.storeRateSeed ? fixedNum(oldSource.store.rateConfig.storeRateSeed * 100) : fixedNum(rateConfig.storeRateSeed * 100)}}%；</p>
              </div>
              <p style="color: #999;">  注：配送费由该商品所属企业承担。</p>

            </td>
          </tr>
        </table>
      </template>
      <template v-else>
        <table class="form-table">
          <tr v-if="!isApproval">
            <td>&nbsp;</td>
            <td>
              <el-button size="mini" @click="changeRate">修改费率</el-button>
            </td>
          </tr>
          <tr>
            <td>合同照片：</td>
            <td>
              <!-- <ul class="img-list" v-if="!!source.store && !!source.store.contractPicUrls">
                <li class="img-box" v-for="(pics, inx) in source.store.contractPicUrls" :key="inx">
                  <el-popover
                      placement="top"
                      popper-class="tootip-img-box"
                      trigger="click">
                      <img :src="pics"/>
                      <img slot="reference" :src="pics"/>
                  </el-popover>
                </li>
              </ul> -->
              <ul class="img-list" v-if="!!source.store && !!source.store.contractPicUrls">
                <li class="img-box" v-for="(pics, inx) in source.store.contractPicUrls.split(',')" :key="inx">
                  <el-popover
                      placement="top"
                      popper-class="tootip-img-box"
                      trigger="click">
                      <img :src="pics"/>
                      <img slot="reference" :src="pics" style="height:100%;"/>
                  </el-popover>
                </li>
              </ul>
              <div v-if="isApproval && compareSource(['contractPicUrls'])" class="approval-before">
                <p class="color-red">变更前：</p>
                <ul class="img-list" v-if="!!source.store && !!oldSource.store.contractPicUrls">
                  <li class="img-box" v-for="(pics, inx) in oldSource.store.contractPicUrls" :key="inx">
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
          <tr>
            <td>合同期限：</td>
            <td>
              <div v-if="!!source.store && (source.store.contractStartTime || source.store.contractEndTime)">{{source.store.contractStartTime}} - {{source.store.contractEndTime}}</div>
              <div v-if="isApproval && compareSource(['contractStartTime', 'contractEndTime'])" class="approval-before">
                <p class="color-red">变更前：</p>
                <div v-if="!!oldSource.store && (oldSource.store.contractStartTime || oldSource.store.contractEndTime)">{{oldSource.store.contractStartTime}} - {{oldSource.store.contractEndTime}}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td>费率：</td>
            <td>
              <span v-if="!!source.store && !!source.store.rateConfig">
                平台收取服务费，收取该特色商户平台销售额的{{source.store && source.store.rateConfig ? fixedNum(source.store.rateConfig.storeRatePlatform * 100) : fixedNum(rateConfig.storeRatePlatform * 100)}}%
              </span>
              <div class="approval-before" v-if="isApproval && compareSource(['store', 'rateConfig', 'storeRatePlatform'])">
                <p class="color-red">变更前：</p>
                <p>平台收取服务费，收取该特色商户平台销售额的{{oldSource.store && oldSource.store.rateConfig && oldSource.store.rateConfig.storeRatePlatform ? fixedNum(oldSource.store.rateConfig.storeRatePlatform * 100) : fixedNum(rateConfig.storeRatePlatform * 100)}}%；</p>
              </div>
            </td>
          </tr>
        </table>
      </template>
      <el-dialog
      :width="dialog.width"
      :title="dialog.titleText"
      :visible.sync="dialog.visible"
      append-to-body>
        <table class="form-table">
          <tr>
            <td>当前费率（%）</td>
            <td>{{!!source.store && !!source.store.rateConfig && source.store.rateConfig.storeRatePlatform ? fixedNum(source.store.rateConfig.storeRatePlatform * 100) : fixedNum(rateConfig.storeRatePlatform * 100)}}%</td>
            <td>新费率（%）</td>
            <td>
              <el-input v-model="dialog.ruleForm.storeRatePlatform"></el-input>
            </td>
          </tr>
          <tr v-if="storeType === 1">
            <td>补贴费率（%）</td>
            <td>{{!!source.store && !!source.store.rateConfig && source.store.rateConfig.storeRateSeed ? fixedNum(source.store.rateConfig.storeRateSeed * 100) : fixedNum(rateConfig.storeRateSeed * 100)}}%</td>
            <td>新补贴费率（%）</td>
            <td>
              <el-input v-model="dialog.ruleForm.storeRateSeed"></el-input>
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
  import DialogSub from '@/components/DialogSub'
  import {fixedNum} from '@/utils';

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
      storeType: {
        type: Number,
        default() {
          return 1;
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
        rateConfig: {
          storeRatePlatform: '',
          storeRateSeed: ''
        },
        dialog: {
          titleText: '修改费率',
          width: '750px',
          isTable: true,
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
        let params = {
          id: this.source.store.rateConfig.id,
          storeRatePlatform: fixedNum(this.dialog.ruleForm.storeRatePlatform / 100, 8)
        };
        if (this.storeType === 1) {
          params.storeRateSeed = fixedNum(this.dialog.ruleForm.storeRateSeed / 100, 8);
        }
        let res = await this.Api.updateRate(params);
        if (res.status === 1) {
          this.$plug.prompt.saveTip('费率修改成功');
          this.source.store.rateConfig.storeRatePlatform = res.data.storeRatePlatform * 1;
          this.source.store.rateConfig.storeRateSeed = res.data.storeRateSeed * 1;
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
      if (this.storeType === 1) {
        await this.getServiceRate('SYS19011487492978', 'storeRateSeed');
      }
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

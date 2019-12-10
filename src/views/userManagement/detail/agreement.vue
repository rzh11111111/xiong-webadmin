<template>
  <div>
    <h6 class="title" v-if="!!title">{{title}}</h6>
    <div class="list-border-box">

      <template v-if="storeType === 1">
        <el-row :gutter="20" v-if="source.delFlag !== 2">
          <el-col :span="8" align="right">&nbsp;</el-col>
          <el-col :span="16">
            <el-button size="mini" @click="dialogVisible = true">修改费率</el-button>
            <!-- <el-popover
              placement="top"
              width="430"
              trigger="click">
              <el-table :data="gridData">
                <el-table-column width="140" property="date" label="时间"></el-table-column>
                <el-table-column width="80" property="name" label="操作人"></el-table-column>
                <el-table-column width="80" property="address" label="操作"></el-table-column>
                <el-table-column width="100" property="address" label="备注"></el-table-column>
              </el-table>
              <el-button slot="reference" size="mini" type="text">修改记录</el-button>
            </el-popover> -->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" align="right">合同类型</el-col>
          <el-col :span="16">电子合同
            <a :href="source.aggrementPdf" target="_blank" class="link" v-if="source.aggrementPdf">查看</a>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" align="right">费率</el-col>
          <el-col :span="16">
            <p>(1) 平台收取服务费，收取该种子商户平台销售额的4%；</p>
            <p>(2) 平台补贴种子商户，补贴该种子商户平台销售额的0.15%；</p>
            <p>(3) 配送平台商品，获得该商品订单价格的10%；</p>
            <p style="color: #999;">  注：配送费由该商品所属企业承担。</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="source.store && source.store.type == 1">
          <el-col :span="8" align="right">合同时间</el-col>
          <el-col :span="16">
            <!-- {{source.store.bcEndtime ?  -->
              <!-- format(new Date(source.store.bcEndtime), 'yyyy年MM月dd日hh时mm分ss秒') : ''}} -->
            2019年1月1日10时29分30秒至2019年1月1日10时29分30秒
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-row :gutter="20" v-if="source.delFlag !== 2">
          <el-col :span="8" align="right">&nbsp;</el-col>
          <el-col :span="16">
            <el-button size="mini" @click="dialogVisible = true">修改费率</el-button>
            <!-- <el-popover
              placement="top"
              width="430"
              trigger="click">
              <el-table :data="gridData">
                <el-table-column width="140" property="date" label="时间"></el-table-column>
                <el-table-column width="80" property="name" label="操作人"></el-table-column>
                <el-table-column width="80" property="address" label="操作"></el-table-column>
                <el-table-column width="100" property="address" label="备注"></el-table-column>
              </el-table>
              <el-button slot="reference" size="mini" type="text">修改记录</el-button>
            </el-popover> -->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" align="right">合同类型</el-col>
          <el-col :span="16">电子合同
            <a :href="source.aggrementPdf" target="_blank" class="link" v-if="source.aggrementPdf">查看</a>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" align="right">费率</el-col>
          <el-col :span="16">
            平台收取服务费，收取该种子商户平台销售额的4%
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="source.store && source.store.type == 2">
          <el-col :span="8" align="right">合同时间</el-col>
          <el-col :span="16">
            <!-- {{source.store.bcEndtime ?  -->
            <!--   format(new Date(source.store.bcEndtime), 'yyyy年MM月dd日hh时mm分ss秒') : ''}} -->
            2019年1月1日10时29分30秒至2019年1月1日10时29分30秒
          </el-col>
        </el-row>
      </template>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="平台服务费率变更" width="450px" center>
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="当前费率（%）">
            <span v-if="!!source.rateConfig">{{source.rateConfig.storeRatePlatform}}</span>
          </el-form-item>
          <el-form-item label="新费率（%）">
            <el-input v-model="form.rateConfig.storeRatePlatform" :value="config"></el-input>
          </el-form-item>
          <el-form-item label="操作备注">
            <el-input type="textarea" v-model="form.remarks" size="medium" :autosize="{ minRows: 5, maxRows: 8}"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="medium" @click="dialogVisible = false">取消</el-button>
          <el-button size="medium" type="primary" @click="handleOperate">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
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
      }
    },
    data() {
      return {
        form: {
          rateConfig: {}
        },
        config: null,
        dialogVisible: false,
      }
    },
    components: {
    },
    methods: {
      async handleOperate() {
        let res = await this.Api.updateRate({
          id: this.source.rateConfig.id,
          storeRatePlatform: this.source.rateConfig.storeRatePlatform * 1
        });
        if (res.status === 1) {
          this.$plug.prompt.saveTip('费率修改成功');
        }
      },
      async getServiceConfigList() {
        let res = await this.Api.getServiceConfigList({});
        if (res.status === 1) {
          this.config = res.data[0].val;
        }
      }
    },
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .container-box{
    position:relative;
    width: 80%;
    margin: 0 auto 40px;
    font-size: 14px;
    .go-back{
      position: absolute;
      top: 0;
      right: -5%;
    }
  }

  .title{
    margin: 12px 0;
    font-size: 16px;
    font-weight: 700;
  }
  .el-row{
    padding: 8px 0;
    .el-col{
      &:first-child{
        font-weight: 700;
      }
      .img-list{
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

    }
  }
  .list-border-box{
    padding-bottom: 10px;
    border-bottom: 1px dashed #e4e4e4;
  }
    .link{
      padding: 0 4px;
      color: #409eff;
    }
</style>

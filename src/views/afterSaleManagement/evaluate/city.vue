<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :getDataList="getDataList" :pagination="pagination" :dialog="dialog" :searchBool="searchBool">
      </search-sub>
      <table-sub ref="tableSub" :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="onlineOrderSku" slot-scope="{ index,row }">
          <div class="container-box" v-if="!!row.onlineOrderSku">
            <div class="container-img">
              <el-popover
                placement="top"
                trigger="click"
                popper-class="tootip-img-box">
                  <img :src="row.onlineOrderSku.picUrl">
                <img slot="reference" :src="row.onlineOrderSku.picUrl">
              </el-popover>
            </div>
            <div class="container-content">
              <h6>{{row.onlineOrderSku.goodsTitle}}</h6>
              <p v-if="!!row.goods.code">编码：{{row.goods.code}}</p>
              <p v-if="!!row.onlineOrderSku.goodsSkuName">sku：{{row.onlineOrderSku.goodsSkuName}}</p>
              <p v-if="!!row.onlineOrderSku.num">数量：{{row.onlineOrderSku.num}}</p>
            </div>
          </div>
        </template>
        <template slot="brand" slot-scope="{index, row}">
          <span v-if="row.goods && row.goods.brand">{{row.goods.brand.name}}</span>
        </template>
        <template slot="tcMemberUsername" slot-scope="{ index,row }">
          <div class="container-box">
            <div class="container-content">
              <h6>{{row.tcMemberUsername}}</h6>
              <p v-if="row.member && row.member.nickname">昵称：{{row.member.nickname}}</p>
              <p v-if="!!row.tcMemberCode">编码：{{row.tcMemberCode}}</p>
            </div>
          </div>
        </template>
        <template slot="scoreService" slot-scope="{ index,row }">
          <div class="rate-box" v-if="!!row.scoreGoods">
            商品：{{fixedNum(row.scoreGoods / 2, 1)}}星
          </div>
          <div class="rate-box" v-if="!!row.scoreService">
            商家：{{fixedNum(row.scoreService / 2, 1)}}星
          </div>
          <div class="rate-box" v-if="!!row.scoreLogistics">
            物流：{{fixedNum(row.scoreLogistics / 2, 1)}}星
          </div>
        </template>
        <template slot="evaluateRemarks" slot-scope="{index, row}">
          <div class="evaluate-remarks">
            <h6>{{row.evaluateRemarks}}</h6>
            <!-- <p>{{row.createTime}}</p> -->
            <!-- <div class="store-feedback" v-if="!!row.evaluateRemarksStore">
              商家回复：<em>{{row.evaluateRemarksStore}}</em>
              <p>2019-2-22 10:23:34</p>
            </div> -->
          </div>
        </template>
        <!-- <template slot="reportStatus" slot-scope="{index, row}">
          <div :style="(row.status === 3 ? 'color: red;' : '')">{{row.status === 3 ? '已举报' : '未举报'}}</div>
          <el-popover
            placement="top"
            popper-class="tootip-img-box"
            trigger="hover" v-if="row.status === 3">
              <div>
                举报时间：2019-2-22 10:35:34
                <p style="margin: 0;">
                  举报原因：xxxxxxxx
                </p>
              </div>
              <el-button type="text" slot="reference">详情</el-button>
          </el-popover>
        </template> -->
        <template slot="isShow" slot-scope="{ index,row }">
          <div>
            <el-switch
              @change="handleShowStatusChange(index, row)"
              :active-value="1"
              :inactive-value="0"
              v-model="row.isShow">
            </el-switch>
          </div>
         <!--  <el-popover
            placement="top"
            popper-class="tootip-img-box"
            trigger="hover" v-if="row.isShow === 1 && row.remarks">
              <div>
                隐藏原因：{{row.remarks}}
              </div>
              <el-button type="text" slot="reference">详情</el-button>
          </el-popover> -->
        </template>
      </table-sub>
      <!-- <el-dialog
        title="隐藏评价确认"
        :visible.sync="operateDialog.dialogVisible"
        width="350px">
        <el-input :rows="5" type="textarea" placeholder="隐藏原因" v-model="operateDialog.remarks" class="remarks-box"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="operateDialog.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleChangeStatus">确 定</el-button>
        </span>
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
  import TableSub from '@/components/TableSub'
  import SearchSub from '@/components/SearchSub'
  import {format, fixedNum} from "@/utils";
  import bus from '@/utils/bus.js'

  export default {

    data() {
      let query = this.$route.query || {};
      let evaluateStatus = [{
        value: 1,
        label: '待审核'
      }, {
        value: 2,
        label: '已审核/已发布'
      }, {
        value: 3,
        label: '举报中'
      }, {
        value: 4,
        label: '已隐藏'
      }, {
        value: 5,
        label: '已关闭'
      }]
      return {
        searchBool: false,
        format,
        fixedNum,
        evaluateStatus,
        quickSearch: {
          isShow: true,
          isTimeRange: true
        },
        searchObj: [{
          value: 'goodsKeyWord',
          label: '',
          isText: true,
          name: '商品',
          placeholder: '名称/编号'
        }, {
          value: 'keyWord',
          label: query.memberCode || '',
          name: '会员',
          placeholder: '昵称/编号',
          isText: true
        }, {
          value: 'brandName',
          label: '',
          isText: true,
          name: '品牌名称'
        }, {
          value: 'scoreGoods',
          label: null,
          name: '商品评分',
          isSelect: true,
          placeholder: '请选择',
          list: [{
            value: 2,
            label: '1星'
          }, {
            value: 4,
            label: '2星'
          }, {
            value: 6,
            label: '3星'
          }, {
            value: 8,
            label: '4星'
          }, {
            value: 10,
            label: '5星'
          }]
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '评价时间段'
        }],

        table: {
          detailBool: false,
          editBool: true,
          delBool: true,
          emitEditBool: true,
          emitDetailBool: true,
          arrDelBool: true,
          btn: true,
          columns: [{
            value: 'onlineOrderSku',
            label: '商品信息',
            width: '300',
            slotBool: true
          }, {
            value: 'brand',
            label: '品牌',
            width: '100',
            slotBool: true
          }, {
            value: 'tcMemberUsername',
            label: '会员信息',
            width: '190',
            slotBool: true
          }, {
            value: 'scoreService',
            label: '评星',
            width: '90',
            slotBool: true
          }, {
            value: 'evaluateRemarks',
            label: '内容',
            width: '200',
            slotBool: true
          }, {
            value: 'createTime',
            label: '评论时间',
            width: '150'
          }, {
            value: 'isShow',
            label: '是否显示',
            width: '100',
            slotBool: true
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        dialog: {
          addBool: true,
        },
        operateDialog: {
          dialogVisible: false,
          reasion: '',
          ruleForm: {

          }
        }
      }
    },
    components: {
      SearchSub,
      TableSub
    },
    methods: {
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo.time1) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        // if (queryPo.goodsKeyWord) {
        //   queryPo.goodsKeyWord = {
        //     keyWord: queryPo.goodsKeyWord
        //   }
        // }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected || item.selected === 0) {
              quick[item.value] = item.selected;
            }
          })
        }
        // if (quick.scoreKeyWord) {
        //   quick.scoreKeyWord = {
        //     keyWord: quick.scoreKeyWord
        //   }
        // }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          shop: {
            type: 2
          },
          searchParameter
        }, queryPo, quick);
        let res = await this.Api.getShopEvaluatePage(para);
        return res;
      },
      handleShowStatusChange(index, row) {
        let isShow = row.isShow;
        row.isShow = row.isShow === 1 ? 0 : 1;
        
        this.$plug.prompt.del(() => {
          this.Api.showShopEvaluate({
            isShow: isShow,
            id: row.id
          }).then(res => {
            if (res.status == 1) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
              row.isShow = isShow;
            }
          })
        }, row, null, isShow === 1 ? '显示该评价' : '隐藏该评价');
        // if (row.isShow === 0) {
        //   this.operateDialog.ruleForm = row;
        //   this.operateDialog.dialogVisible = true;
        // } else {
        //   this.$plug.prompt.del(() => {
        //     this.Api.editShopEvaluateStatus({
        //       status: 2,
        //       id: row.id
        //     }).then(res => {
        //       if (res.status == 1) {
        //         this.$message({
        //           message: '修改成功',
        //           type: 'success',
        //           duration: 1000
        //         });
        //         this.operateDialog.ruleForm.isShow = 0;
        //         row.isShow = row.isShow === 1 ? 0 : 1;
        //       }
        //     })
        //   }, row, null, '显示该评价');
        // }
      },
      // handleChangeStatus() {
      //   this.handleSureChangeStatus({
      //     isShow: 0,
      //     remarks: this.operateDialog.remarks,
      //     id: this.operateDialog.ruleForm.id
      //   }, true);
      // },
      // handleSureChangeStatus(params, hasRemarks) {
      //   this.Api.showShopEvaluate(params).then(res => {
      //     if (res.status == 1) {
      //       this.$message({
      //         message: '修改成功',
      //         type: 'success',
      //         duration: 1000
      //       });
      //       if (hasRemarks === true) {
      //         this.operateDialog.ruleForm.isShow = 1;
      //         this.operateDialog.dialogVisible = false;
      //         this.operateDialog.ruleForm.isShow = 1;
      //       } else {
      //         this.operateDialog.ruleForm.isShow = 0;
      //       }
      //     } else {
      //       this.operateDialog.ruleForm.isShow = this.operateDialog.ruleForm.isShow === 0 ? 1 : 0;
      //     }
      //   }).catch(res => {
      //     this.operateDialog.ruleForm.isShow = this.operateDialog.ruleForm.isShow === 0 ? 1 : 0;
      //   })
      // }
    },
    computed: {},
    async mounted() {
    }
  }
</script>
<style type="text/scss" lang="scss">
.remarks-box{
  margin-bottom: -10px;
  &.el-textarea{
    .el-textarea__inner{
      max-width: 300px !important;
    }
  }
}
</style>
<style type="text/scss" lang="scss" scoped>

  .container-box{
    display: flex;
    text-align: left;
    .container-img{
      width: 70px;
      img{
        display: block;
        max-width: 100%;
      }
    }

    .container-content{
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      h6{
        margin: 0 0 5px;
        font-size: 13px;
      }
      p{
        font-size: 12px;
        margin: 0;
      }
    }
  }
  .img-list{
    display: flex;
    padding: 0;
    margin: 0;
    li{
      margin: 0 5px 5px 0;
    }
  }
  .img-box{
    display: flex;
    width: 50px;
    height: 50px;
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
  .evaluate-remarks{
    text-align: left;
    line-height: 1.5;
    .img-list{
      width: 100%;
    }
    h6{
      font-size: 13px;
      margin: 0 0 5px;
    }
    p{
      margin: 0;
      font-size: 12px;
    }
    .store-feedback{
      margin-top: 5px;
      color: #999;
      em{
        font-style: normal;
      }
    }
  }
  .rate-box{
    text-align: left;
    &:last-child{
      margin-bottom: 0;
    }
    .el-rate{
      display: inline-block;
      vertical-align: middle;
    }
    &>p{
      margin: 0;
      &>span{
        display: inline-block;
        line-height: 18px;
        vertical-align: middle;
        color: #f90;
      }
    }
  }
</style>

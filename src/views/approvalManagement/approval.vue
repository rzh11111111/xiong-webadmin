<template>
  <el-container class="info-page-wrapper">
    <el-header>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="0">详情</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button :label="1">审核记录</el-radio-button>
      </el-radio-group>
    </el-header>
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main>
        <div class="info-page-box">
          <div class="info-list" v-if="activeName == 1">
            <h4 class="step-title-tag"><i class="icon-tag"></i>审核记录</h4>
             <el-table
                 :data="tableData"
                 border
                 style="width: 100%">
                 <el-table-column
                   prop="updateTime"
                   label="审核时间"
                   width="180">
                 </el-table-column>
                 <el-table-column
                   prop="createBy"
                   label="审核人"
                  :formatter="formatterCreateBy"
                   width="180">
                 </el-table-column>
                 <el-table-column
                   prop="isRelease"
                   label="审核结果" :formatter="formatter">
                 </el-table-column>
                 <el-table-column
                   prop="remarks"
                   label="备注">
                 </el-table-column>
               </el-table>
          </div>
          <template v-else>
            <div class="info-list" style="margin-bottom: 20px;">
              <h4 class="step-title-tag"><i class="icon-tag"></i>发起人</h4>
              <table class="form-table">
                <tr>
                  <td>发起人角色</td>
                  <td>
                    <template v-if="!!source.createBy">{{getCreateRole()}}</template>
                  </td>
                </tr>
                <tr>
                  <td>发起人姓名</td>
                  <td>
                    <span v-if="!!source.createBy">
                      <template v-for="(c, inx) in source.createBy.split('/')">
                        <span  v-if="inx == 1">{{c}} </span>
                      </template>
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <div class="info-list" style="margin-bottom: 20px;">
              <h4 class="step-title-tag"><i class="icon-tag"></i>审核详情</h4>
              <table class="form-table">
                <tr>
                  <td>审核编码：</td>
                  <td>{{source.code}}</td>
                </tr>
                <tr>
                  <td>审核名称：</td>
                  <td>{{source.name}}</td>
                </tr>
                <tr>
                  <td>审核类型：</td>
                  <td>
                    <span v-for="type in serviceType" :key="type.value" v-if="type.value === source.serviceType">{{type.label}}</span>
                  </td>
                </tr>
                <tr>
                  <td>提交审核时间：</td>
                  <td>{{source.createTime}}</td>
                </tr>
                <tr>
                  <td>审核状态：</td>
                  <td>
                    <span :style="{color: dialog.isRelease *　1 === 1 ? '#f00' : '#666'}" v-if="dialog.isRecord">{{releaseStatus[dialog.isRelease]}}</span>
                    <span :style="{color: colors[source.delFlag *　1]}" v-else>{{delFlag[source.delFlag]}}</span>
                  </td>
                </tr>
                <!-- <tr>
                  <td>备注：</td>
                  <td>
                    <span v-if="dialog.isRecord">{{dialog.remarks}}</span>
                    <span v-else>{{source.remarks}}</span>
                  </td>
                </tr> -->
              </table>
            </div>
            <store-info :source="approvalContent"
                        :isApproval="true"
                        :oldSource="oldSource"
                        :storeType="source.serviceType * 1"
                        :delFlag="source.delFlag"
                        v-if="source.serviceType == 1 || source.serviceType == 2 || source.serviceType == 21 || source.serviceType == 22">
            </store-info>
            <div v-else-if="source.serviceType == 3" style="border-top: 1px solid #dfdfdf;">
              <goods-info :source="approvalContent"
                          :delFlag="source.delFlag">
              </goods-info>
            </div>
            <div v-else-if="source.serviceType == 23" style="border-top: 1px solid #dfdfdf;">
              <goods-info :source="oldSource"
                          :delFlag="source.delFlag" v-show="dialog.isOld && !dialog.isRecord">
              </goods-info>
              <goods-info :source="approvalContent"
                          :delFlag="source.delFlag" v-show="!dialog.isOld">
              </goods-info>
            </div>
            <shop-info :source="approvalContent"
                        :isApproval="true"
                        :oldSource="oldSource"
                        :shopType="source.serviceType * 1"
                        :delFlag="source.delFlag"
                        v-else-if="source.serviceType == 4 || source.serviceType == 5 || source.serviceType == 24 || source.serviceType == 25">
            </shop-info>
            <province-info :source="approvalContent"
                            :isApproval="true"
                            :oldSource="oldSource"
                            :delFlag="source.delFlag"
                            v-else-if="source.serviceType == 6 || source.serviceType == 26">
            </province-info>
            <template v-else-if="source.serviceType == 7 || source.serviceType == 27">
              <partner-info :source="approvalContent"
                            :isApproval="true"
                            :oldSource="oldSource"
                            :delFlag="source.delFlag">
              </partner-info>
              <partner-agreement :source="approvalContent"
                            :isApproval="true"
                            :oldSource="oldSource"
                            :delFlag="source.delFlag">
              </partner-agreement>
            </template>

            <promoter-info :source="approvalContent"
                            :isApproval="true"
                            :oldSource="oldSource"
                            :delFlag="source.delFlag"
                            v-else-if="source.serviceType == 8 || source.serviceType == 28">
            </promoter-info>
            <div v-if="!dialog.isRecord && source.delFlag == 2">
              <el-row>
                <el-col :span="8">&nbsp;</el-col>
                <el-col :span="16">
                  <el-input type="textarea" v-model="reason" :autosize="{ minRows: 4, maxRows: 8}" placeholder="审核拒绝时，必须填写原因"></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 20px;">
                <el-col :span="8">&nbsp;</el-col>
                <el-col :span="16">
                  <el-button type="primary" :loading="approvalLoading" @click.stop="handleRelease">通过</el-button>
                  <el-button @click="handleNtRelease">驳回</el-button>
                </el-col>
              </el-row>
            </div>
          </template>
          <el-dialog
            title="操作提示"
            :visible.sync="subDialog.visible"
            width="300px"
            append-to-body>
            <div style="text-align:center;padding-bottom:20px;">
              <div style="margin: 20px auto 40px;text-align:center;font-size: 16px;"><i class="el-icon-success" style="font-size: 40px;margin-right: 10px;vertical-align:middle;color:#67C23A;"></i>审核通过成功</div>
              <el-button type="primary" @click="createSubAccount">创建平安子账号</el-button>
            </div>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {format} from "@/utils";
  import bus from "@/utils/bus";
  import TableSub from '@/components/TableSub'
  import StoreInfo from './infos/storeInfo';
  import ShopInfo from './infos/shopInfo';
  import GoodsInfo from '../goodsManagement/goodsInfo';
  import ProvinceInfo from '../userManagement/detail/account';
  import PartnerInfo from '../userManagement/partnerDetail/account';
  import PartnerAgreement from '../userManagement/partnerDetail/agreement';
  import PromoterInfo from '../userManagement/promotersDetail/account';

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
        let serviceType = [{
          value: 1,
          label: '种子商户入驻审核'
        }, {
          value: 21,
          label: '种子商户更新审核'
        }, {
          value: 2,
          label: '特色商户入驻审核'
        }, {
          value: 22,
          label: '特色商户更新审核'
        }, {
          value: 3,
          label: '商品审核'
        }, {
          value: 23,
          label: '商品更新审核'
        }, {
          value: 4,
          label: '生产企业审核'
        }, {
          value: 24,
          label: '生产企业更新审核'
        }, {
          value: 5,
          label: '同城企业审核'
        }, {
          value: 25,
          label: '同城企业更新审核'
        }, {
          value: 6,
          label: '省区总审核'
        }, {
          value: 26,
          label: '省区总更新审核'
        }, {
          value: 7,
          label: '合作商审核'
        }, {
          value: 27,
          label: '合作商更新审核'
        }, {
          value: 8,
          label: '推广员审核'
        }, {
          value: 28,
          label: '推广员更新审核'
        }];
        let delFlag = ['审核通过', '审核删除', '待审核', '审核驳回'];
	      return {
	      	format,
          delFlag,
          activeName: '0',
	      	innerVisible: false,
          // query: {},
	      	source: {},
          serviceType,
          colors: ['#666', '#666', '#108ee9', '#f00'],
          releaseStatus: ['审核通过', '审核驳回'],
	      	approvalContent: {},
          oldSource: null,
	      	reason: '',
          isRelease: '',

          tableData: [],
          subDialog: {
            visible: false
          },
          approvalLoading: false
        }
      },
    components: {
      TableSub,
    	StoreInfo,
      ShopInfo,
      GoodsInfo,
      ProvinceInfo,
      PartnerInfo,
      PartnerAgreement,
      PromoterInfo,
    },
    methods: {
      getCreateRole() {
        let arr = this.source.createBy.split('/');
        if (arr.length >= 3) {
          switch(arr[2]) {
            case 'sys_employee_role_code':
              return '员工';
            case 'sys_store_account_code':
              return '线下店老板';
            case 'sys_manager_spread_role_code':
              return '推广员';
            case 'sys_manager_cooperation_role_code':
              return '合作商';
            case 'sys_manager_boss_role_code':
              return '省区总';
            case 'sys_shop_city_role_code':
              return '同城企业';
            case 'sys_shop_pro_role_code':
              return '生产企业';
          }
        }
      },
      formatterCreateBy(row, column, cellValue, index) {
        if (cellValue) {
          let arr = cellValue.split('/');
          if (arr.length >= 2) {
            return arr[1];
          }
        }
        return '';
      },
      formatter(row, column, cellValue, index) {
        return cellValue * 1 === 1 ? '驳回' : '通过';
      },
      async getSource() {
        let res = await this.Api.getApprovalInfo({id: this.dialog.id});
        if (res.status == 1 && res.data) {
          this.source = Object.assign({}, res.data);
          if (res.data.approvalContent) {
            this.approvalContent = JSON.parse(res.data.approvalContent);
          }
          if (res.data.approvalContentSuccess) {
            this.oldSource = JSON.parse(res.data.approvalContentSuccess);
          } else {
            this.oldSource = null;
          }
        }
        return res;
      },
    	handleRelease() {
    		// this.reason = '';
    		this.isRelease = '0';
        this.$confirm('确认通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          switch (this.source.serviceType) {
            case 1:
            case 2:
            case 4:
            case 5:
              this.approval(1, true);
              return ;
          }
          this.approval(1);
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    	},
    	async approval(r, relea) {
        this.approvalLoading = true;
    		let res = await this.Api.setApproval({
    			id: this.source.id,
    			isRelease: this.isRelease,
    			remarks: this.reason,
          serviceType: this.source.serviceType
    		});
    		if (res.status === 1) {
          bus.$emit('loadDialogData');
          if (r === 1) {
            if (relea === true) {
              this.isNeddCreateSubAccount();
              return ;
            }
            this.$message({
              type: 'success',
              message: '通过成功!'
            });
          }
    			this.innerVisible = false;
          this.dialog.saveFormVisible = false;
    		}
        this.approvalLoading = false;
    	},
    	handleNtRelease() {
    		if (!this.reason) {
    			this.$message({
    				type: 'warning',
    				message: '请填写驳回原因'
    			})
    			return ;
    		}
    		this.isRelease = '1';
    		this.approval();
    	},
      async isNeddCreateSubAccount() {
        let res = await this.getSource();
        this.approvalLoading = false;
        if (res.status === 1) {
          if (res.data.delFlag === 0 || res.data.delFlag === '0') {
            this.subDialog.visible = true;
            return false;
          }
          this.$message({
            type: 'success',
            message: '通过成功!'
          });
          this.innerVisible = false;
          this.dialog.saveFormVisible = false;
        }
      },
      async createSubAccount() {
        if (this.source.serviceType === 1 || this.source.serviceType === 2) {
          let res = await this.Api.payStoreSonaccount({storeId: this.approvalContent.store.id});
          if (res.status === 1) {
            this.$message({
              type: 'success',
              message: '创建平安子账号成功'
            })
          }
        } else {
          let res = await this.Api.payShopSonaccount({shopId: this.approvalContent.id});
          if (res.status === 1) {
            this.$message({
              type: 'success',
              message: '创建平安子账号成功'
            })
          }
        }
      },
    	async getDataList() { //获取列表
        let res = await this.Api.getApprovalRecord({serviceId: this.dialog.serviceId, oaApprovalContentId: this.dialog.id});
        if (res.status === 1) {
          this.tableData = res.data.list;
        }

        return res;

      }
    },
    created() {
      // let query = parseQueryString(location.hash.split('?')[1]);
      // this.query = this.$route.query;
    },
    async mounted() {
      this.getSource();
      this.getDataList();
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
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
    width: 150px;
    height: 150px;
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
  .form-table td:nth-child(even){
    width: 470px;
  }
</style>

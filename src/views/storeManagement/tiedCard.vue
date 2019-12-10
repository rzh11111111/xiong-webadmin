<template>
  <div class="app-container calendar-list-container">
    <search-sub :searchObj="searchObj" :searchBool="searchBool" :table="table" :dialog="dialog" :pagination="pagination"
                :getDataList="getDataList">
    </search-sub>
    <table-sub ref="tableSub" @detail="handleDetail"
           :getDataList="getDataList" :table="table" :dialog="dialog" :pagination="pagination">
      <template slot="status" slot-scope="{index,row }">
          <template v-for="s in status" v-if="s.value == row.status">{{s.label}}</template>
      </template>
      <template slot="stStoreAccountId" slot-scope="{index,row }">
          <template v-for="store in storeList" v-if="store.value === row.stStoreAccountId">{{store.label}}</template>
      </template>
      <template slot="createTime" slot-scope="{ index,row }">
        <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
      </template>
      <template slot="updateTime" slot-scope="{ index,row }">
        <span v-if="!!row.updateTime">{{format(new Date(row.updateTime), "yyyy-MM-dd hh:mm:ss")}}</span>
      </template>
    </table-sub>

    <dialog-sub :dialog="dialog" :table="table" :getDataList="getDataList">
      <template slot="dialog">
        <!-- <el-form :model="dialog.ruleForm2" :disabled="dialog.readBool" :rules="dialog.rules2" :show-message="false" status-icon label-width="250px" class="form-list"> -->
            <el-form-item label="开户名" prop="accountName">
              <el-input v-model="dialog.ruleForm2.accountName" :disabled="dialog.readBool"></el-input>
            </el-form-item>
            <el-form-item label="银行类型" prop="bankType">
              <el-input v-model="dialog.ruleForm2.bankType" :disabled="dialog.readBool"></el-input>
            </el-form-item>
            <el-form-item label="支行" prop="bankBranch">
              <el-input v-model="dialog.ruleForm2.bankBranch" :disabled="dialog.readBool"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号" prop="bankNo">
              <el-input v-model="dialog.ruleForm2.bankNo" :disabled="dialog.readBool"></el-input>
            </el-form-item>
            <el-form-item label="绑定的手机号" prop="bankPhone">
              <el-input v-model="dialog.ruleForm2.bankPhone" :disabled="dialog.readBool"></el-input>
            </el-form-item>
            <el-form-item label="开户行许可证号" prop="bankPermissopnCode">
              <el-input v-model="dialog.ruleForm2.bankPermissopnCode" :disabled="dialog.readBool"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="dialog.ruleForm2.idCard" :disabled="dialog.readBool"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="dialog.ruleForm2.status" :disabled="dialog.readBool">
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="所属商户" prop="stStoreAccountId">
              <el-select v-model="dialog.ruleForm2.stStoreAccountId" :disabled="dialog.readBool">
                <el-option
                  v-for="item in storeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          <!-- </el-form> -->
      </template>
    </dialog-sub>

  </div>
</template>
<script>
  import {format} from "../../utils";
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'

  export default {
    data() {
      return {
        format: format,
        storeList: [],
        searchBool: false,
        searchObj: [{
          value: 'stStoreAccountId',
          label: '',
          name: '所属商户',
          isSelect: true,
          list: this.storeList || []
        }, {
          value: 'bankNo',
          label: '',
          name: '银行卡号',
          isText: true
        }, {
          value: 'idCard',
          label: '',
          name: '身份证号码',
          isText: true
        }, {
          value: 'accountName',
          label: '',
          name: '开户名',
          isText: true,
        }],
        status: [{
          label: '正常',
          value: '1'
        }, {
          label: '冻结',
          value: '2'
        }],
        table: {
          detailBool: true,
          editBool: true,
          addBool: false,
          arrDelBool: true,
          delBool: true,
          emitDetailBool: true,
          columns: [{
            value: 'accountName',
            label: '开户名',
            width: '150'
          }, {
            value: 'bankType',
            label: '银行类型',
            width: '100'
          }, {
            value: 'bankBranch',
            label: '支行',
            width: '140',
          }, {
            value: 'bankNo',
            label: '银行卡号',
            width: '150'
          }, {
            value: 'bankPhone',
            label: '绑定的手机号',
            width: '140'
          }, {
            value: 'bankPermissopnCode',
            label: '开户行许可证号',
            width: '150'
          }, {
            value: 'idCard',
            label: '身份证',
            width: '120'
          }, {
            value: 'status',
            label: '状态',
            slotBool: true,
            width: '100'
          }, {
            value: 'stStoreAccountId',
            label: '所属商户',
            slotBool: true,
            width: '100'
          }, {
            value: 'createTime',
            label: '创建时间',
            slotBool: true,
            width: '150'
          }, {
            value: 'updateTime',
            label: '更新时间',
            slotBool: true,
            width: '150'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          readBool: true,
          addBool: true,
          titleText: '银行卡详情',
          ruleForm2: {
            accountName: '',
            bankType: '',
            bankBranch: '',
            bankNo: '',
            bankPhone: '',
            bankPermissopnCode: '',
            idCard: '',
            status: '1',
            stStoreAccountId: ''
          }
        }
      }
    },
    components: {
      DialogSub,
      SearchSub,
      TableSub,
    },
    methods: {
      handleDetail() {
        this.dialog.titleText = '银行卡详情';
        this.dialog.saveFormVisible = true;
        this.dialog.readBool = true;
      },
      async getDataList() {
        let searchParameter = this.$plug.public.transformSearchData.call(this, this.searchObj);
        return await this.Api.getBankcardList(Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          }
        }, searchParameter));
      },
      async getSellerList() {
        let res = await this.Api.getSellerList({StoreAccount: {}});
        if (res.status == 1) {
          let list = res.data;
          if (list && list.length) {
           this.searchObj[0].list = list.map(item => {
              this.storeList.push({
                label: item.name,
                value: item.id
              });

              return {
                label: item.name,
                value: item.id
              }
            });
          }
        }
      }
    },
    mounted() {
      this.getSellerList();
    }
  }
</script>

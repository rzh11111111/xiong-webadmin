<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :getDataList="getDataList" :pagination="pagination" :searchBool="searchBool" :dialog="dialog"
                  @add="handleAdd">

      </search-sub>
      <table-sub ref="tableSub" @detail="handleDetail" @edit="handleEdit"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="storeRatePlatform" slot-scope="{index, row}">
          <span v-if="row.rateConfig && row.rateConfig.storeRatePlatform">{{fixedNum(row.rateConfig.storeRatePlatform * 100)}}%</span>
        </template>
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-tag :type="row.isEnable == 1 ? 'danger' : 'success'">
            {{row.isEnable == 1 ? '停用' : '启用'}}
          </el-tag>
        </template>
        <template slot="name" slot-scope="{ index,row }">
          <span v-if="!!row.shopInfo">{{row.shopInfo.name}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <el-tag :type="tagColor[s.value - 1]" v-for="s in status" :key="s.value" v-if="s.value === row.status">{{s.label}}</el-tag>
        </template>
        <template slot="delFlag" slot-scope="{index, row}">
          <el-tag :type="tagColor[d.value !== 0 ? d.value - 1 : 0]" v-for="d in delFlag" :key="d.value" v-if="d.value === row.delFlag">{{d.label}}</el-tag>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
      </table-sub>
      <!-- 详情 -->
      <dialog-sub :dialog="detailDialog" @close="handleClose" @reset="handleClose">
        <template slot="dialog">
          <shop-info :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></shop-info>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TableSub from '@/components/TableSub'
  import SearchSub from '@/components/SearchSub'
  import {format, fixedNum} from "@/utils";
  import bus from "@/utils/bus";
  import DialogSub from '@/components/DialogSub';
  import shopInfo from './shopInfo';

  export default {
    data() {
      let status = [{
            value: 1,
            label: '正常'
          }, {
            value: 2,
            label: '关闭'
          }, {
            value: 3,
            label: '冻结'
          }];

      let delFlag = [{
        value: 0,
        label: '已通过'
      }, {
        value: 2,
        label: '待审批'
      }, {
        value: 3,
        label: '驳回'
      }];
      return {
        searchBool: false,
        format,
        fixedNum,
        status,
        delFlag,
        tagColor: ['success', '', 'danger'],
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'isEnable',
            label: null,
            selected: null,
            list: [{
              label: '启用',
              value: 0
            }, {
              label: '停用',
              value: 1
            }]
          }, {
            value: 'status',
            label: null,
            selected: null,
            list: status
          }, {
            value: 'delFlag',
            label: null,
            selected: null,
            list: delFlag
          }]
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '店铺名/企业名/账号/编码'
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '创建时间段'
        }],

        table: {
          emitDetailBool: true,
          emitEditBool: true,
          detailBool: true,
          arrDelBool: true,
          delBool: true,
          editBool: true,
          columns: [{
            value: 'code',
            label: '编码',
            width: '100'
          }, {
            value: 'nickName',
            label: '店铺名称',
            width: '150'
          }, {
            value: 'userName',
            label: '账号',
            width: '150'
          }, {
            value: 'name',
            label: '企业名称',
            width: '140',
            slotBool: true
          }, {
          //   value: 'brandIdList',
          //   label: '经营品牌',
          //   width: '100'
          // }, {
            value: 'storeRatePlatform',
            label: '平台服务费(%)',
            slotBool: true,
            width: '140'
          }, {
            value: 'isEnable',
            label: '是否启用',
            slotBool: true,
            width: '140'
          }, {
            value: 'status',
            label: '店铺状态',
            slotBool: true,
            width: '140'
          }, {
            value: 'delFlag',
            label: '审批状态',
            slotBool: true,
            width: '140'
          }, {
            value: 'createTime',
            label: '创建时间',
            slotBool: true,
            width: '140'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          btnText: '创建企业',
          titleText: '创建企业',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
          shopType: 1,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true,
          isChange: false
        }
      }
    },
    components: {
      SearchSub,
      TableSub,
      DialogSub,
      shopInfo
    },
    methods: {
      async getDataList() { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);

        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected || item.selected === 0) {
              quick[item.value] = item.selected;
            }
          })
        }
        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          },
          searchParameter
        }, quick, queryPo, {
          type: 1
        });

        return await this.Api.getShopPage(para);
      },
      handleDetail(row) {
        this.detailDialog.id = row.id;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/seller/shop/' + row.id, query: {shopType: 1}});
      },
      handleEdit(row) {
        this.$router.push({path: '/seller/mfrsForm', query: {id: row.id}});
      },
      handleAdd() {
        this.$router.push({path: '/seller/mfrsForm'});
      },
      handleClose() {
        if (this.detailDialog.isChange) {
          bus.$emit('loadDialogData');
          this.detailDialog.isChange = false;
        }
      }
    },
    computed: {},
  }
</script>


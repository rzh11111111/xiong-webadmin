<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :pagination="pagination" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog">

      </search-sub>
      <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList"  @detail="handleDetail"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="merManager" slot-scope="{index, row}">
          <span v-if="!!row.spreadCode">{{row.spreadCode}} / </span>{{row.spreadUsername}}
        </template>
        <template slot="province" slot-scope="{index, row}">
          {{row.province}}{{row.city}}{{row.region}}
        </template>
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
        <!-- <template slot="approvalTime" slot-scope="{ index,row }">
          <span v-if="!!row.approvalTime">{{format(new Date(row.approvalTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template> -->
        <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
      </tree-sidebar-table>
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
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import SearchSub from '@/components/SearchSub'
  import {format, fixedNum} from "@/utils";
  import bus from "@/utils/bus";
  import DialogSub from '@/components/DialogSub';
  import shopInfo from './shopInfo';

  export default {
    data() {
      let query = this.$route.query || {};

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
        treeConfig: {
          treeProps: {
            label: 'name'
          },
          nodeKey: 'code',
          lazy: true,
          expandedKeys: ['0'],
          currentKey: '0'
        },
        citys: ['province', 'city', 'region'],
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
        //   value: 'managerCode',
        //   label: query.merCode || '',
        //   selectVal: 'managerType',
        //   selectLabel: query.merManagerType * 1 || null,
        //   list: [{
        //     value: 3,
        //     label: '省区总'
        //   }, {
        //     value: 2,
        //     label: '合作商'
        //   }],
        //   clearable: true,
        //   placeholder: '编码',
        //   selectPlaceholder: '按上级',
        //   isInputList: true
        // }, {
          value: 'spreadCode',
          label: query.spreadCode || '',
          name: '推广人编码',
          isText: true
        }, {
          value: 'spreadUsername',
          label: '',
          name: '推广人用户名',
          isText: true
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '创建时间段'
        }],

        table: {
          emitDetailBool: true,
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
            value: 'merManager',
            label: '推广人',
            width: '140',
            slotBool: true
          }, {
            value: 'province',
            label: '地区',
            slotBool: true,
            width: '140'
          }, {
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
          //   value: 'approvalTime',
          //   label: '入驻时间',
          //   slotBool: true,
          //   width: '140'
          // }, {
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
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          addBool: true
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
          shopType: 2,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true,
          isChange: false
        }
      }
    },
    components: {
      SearchSub,
      TreeSidebarTable,
      DialogSub,
      shopInfo
    },
    methods: {
      async getTreeList(node) {
        let res = await this.Api.getAreaConfig({parentCode: node && node.key ? node.key : '000000'});
        if (res.status === 1 && res.data) {
          let list = res.data.list || [];
          return list;
        }
      },
      async getDataList(params, areaAll) { //获取列表
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
          type: 2
        });
        if (params && params.id && params.name !== '全国') {
          areaAll.forEach(item => {
            if (item.areaLevel > 0) {
              para[this.citys[item.areaLevel - 1]] = item.name;
            }
          })
        }
        return await this.Api.getShopPage(para);
      },
      handleDetail(row) {
        this.detailDialog.id = row.id;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/seller/shop/' + row.id, query: {shopType: 2}});
      },
      handleClose() {
        if (this.detailDialog.isChange) {
          bus.$emit('loadDialogData');
          this.detailDialog.isChange = false;
        }
      }
    },
    async mounted() {

    }
  }
</script>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :timeRangeVal="['time1']" :quickSearch="quickSearch" :pagination="pagination" :searchObj="searchObj" :isSidebar="true" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="province" slot-scope="{ index,row }">
          {{row.province}} {{row.city}} {{row.region}}
        </template>
        <template slot="serviceUsername" slot-scope="{index, row}">
          <span v-if="!!row.serviceUsername">{{serviceType[row.serviceType - 1]}} {{row.serviceUsername}}</span>
        </template>
        <template slot="managerName" slot-scope="{index, row}">
          <!-- <p v-if="!!row.merCode">{{row.merCode}}</p> -->
          <span v-if="!!row.managerName">省区总 {{row.managerName}}</span>
        </template>
        <template slot="status" slot-scope="{ index,row }">
          <template v-for="d in status" v-if="d.value == row.status">
            <el-tag :type="d.type">{{d.label}}</el-tag>
          </template>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{index, row}">
          <el-button type="text" size="mini" @click.stop="handleDetail(row)" v-if="row.delFlag == 2 && row.isApproval === '0'">审核</el-button>
          <el-button type="text" size="mini" @click.stop="handleDetail(row)" v-else>详情</el-button>
        </template>
      </tree-sidebar-table>
      <!-- 详情 -->
      <dialog-sub :dialog="detailDialog">
        <template slot="dialog">
          <shop-clue-info :dialog="detailDialog" :source="infos" v-if="detailDialog.saveFormVisible"></shop-clue-info>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import SearchSub from '@/components/SearchSub'
  import DialogSub from '@/components/DialogSub';
  import {format} from "@/utils";
  import bus from '@/utils/bus.js'
  import ShopClueInfo from './infos/shopClueInfo';

  export default {
    data() {
      let status = [{
        value: '1',
        type: '',
        label: '待处理'
      }, {
        value: '2',
        type: 'success',
        label: '已处理'
      }, {
        value: '3',
        type: 'danger',
        label: '已拒绝'
      }];
      let serviceType = ['省区总', '合作商', '推广员', '种子店', '特色店'];
      return {
        format,
        status,
        serviceType,
        merManagerType: ['merCode', 'merName', 'merUserName', 'merPhone'],
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
          value: 'status',
          label: '',
          selcted: '',
          isSelect: true,
          list: status || []
        }]
        },
        searchBool: false,
        searchObj: [{
          value: 'name',
          label: '',
          name: '名称',
          isText: true,
          placeholder: '企业的营业执照名称'
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '提交时间段'
        }],
        treeConfig: {
          treeProps: {
            label: 'name'
          },
          nodeKey: 'code',
          lazy: true,
          expandedKeys: ['0'],
          currentKey: '0'
        },
        table: {
          emitEditBool: true,
          emitDetailBool: true,
          detailBool: false,
          editBool: true,
          delBool: true,
          arrDelBool: true,
          columns: [{
            value: 'name',
            label: '名称',
            width: '100'
          }, {
            value: 'province',
            label: '省市区',
            slotBool: true,
            width: '150'
          }, {
            value: 'updateTime',
            label: '提交时间',
            width: '150'
          }, {
            value: 'serviceUsername',
            label: '预推广人',
            width: '150',
            slotBool: true
          }, {
            value: 'managerName',
            label: '处理人',
            width: '150',
            slotBool: true
          }, {
            value: 'status',
            label: '处理状态',
            slotBool: true,
            width: '100'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        dialog: {
          addBool: true
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true
        },
        infos: {}
      }
    },
    components: {
      SearchSub,
      TreeSidebarTable,
      DialogSub,
      ShopClueInfo
    },
    methods: {
      async getTreeList(node) {
        let res = await this.Api.getAreaConfig({parentCode: node && node.key ? node.key : '000000'});
        if (res.status === 1 && res.data) {
          let list = res.data.list || [];
          return list;
        }
      },
      async getDataList(params, list) { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);

        if (queryPo.merManagerType) {
          queryPo[this.merManagerType[queryPo.merManagerType - 1]] = queryPo.merManager;
          delete queryPo.merManagerType;
          delete queryPo.merManager;
        }

        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            quick[item.value] = item.selected;
          })
        }

        let searchParameter = {
          keyWord: queryPo.keyWord
        }
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        let para = Object.assign({
        	  page: {
              pageNo: this.pagination.page,
              pageSize: this.pagination.count
            }
        }, queryPo, {
          searchParameter
        }, quick, );
        if (list && (list instanceof Array) && list.length > 1) {
          let citys = ['province', 'city', 'region'];
          list.map((item, inx) => {
            if (inx > 0) {
              para[citys[inx - 1]] = item.name;
            }
          });
        }
        if (queryPo && queryPo.createTime) {
          para.createTime = format(new Date(queryPo.createTime), 'yyyy-MM-dd hh:mm:ss')
        }
        return await this.Api.getShopCluePage(para);
      },
      handleDetail(row) {
        this.detailDialog.id = row.id;
        this.infos = row;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/approval/shopClue/' + row.id});
      }
    },
    async mounted() {
    }
  }
</script>

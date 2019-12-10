<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :timeRangeVal="['time1']" :quickSearch="quickSearch" :pagination="pagination" :searchObj="searchObj" :isSidebar="true" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog">
      </search-sub>
      <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :getDataList="getDataList" :table="table" :pagination="pagination">
    		<template slot="serviceType" slot-scope="{ index,row }">
    		  <span v-for="type in serviceType" :key="type.vlaue" v-if="type.value == row.serviceType">{{type.label}}</span>
    		</template>
        <template slot="applyStartTime" slot-scope="{ index,row }">
          <span v-if="!!row.applyStartTime">{{format(new Date(row.applyStartTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="isRelease" slot-scope="{ index,row }">
          <el-tag :type="row.isRelease == '1' ? 'danger' : 'success'">{{row.isRelease == '1' ? '驳回' : '通过'}}</el-tag>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="table" slot-scope="{index, row}">
          <!-- <el-button type="text" size="mini" @click.stop="handleDetail(row)" v-if="row.delFlag == 2 && row.isApproval === '0'">审核</el-button> -->
          <el-button type="text" size="mini" @click.stop="handleDetail(row)">详情</el-button>
        </template>
      </tree-sidebar-table>
      <!-- 详情 -->
      <dialog-sub :dialog="detailDialog">
        <template slot="dialog">
          <approval :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></approval>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import SearchSub from '@/components/SearchSub'
  import {format} from "@/utils";
  import bus from '@/utils/bus.js'
  import DialogSub from '@/components/DialogSub';
  import approval from './approval';

  export default {
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
      }]
      return {
        format,
        serviceType,
        quickSearch: {
          isShow: true,
          // isTimeRange: true,
          hideTime: true,
          group: [{
            value: 'isRelease',
            label: '0',
            selected: '0',
            isSelect: true,
            list: [{
              value: '0',
              type: 'success',
              label: '审核通过'
            }, {
              value: '1',
              type: 'danger',
              label: '审核驳回'
            }]
          }]
        },
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '审核对象',
          isText: true,
          placeholder: '名称/编码'
        }, {
          value: 'serviceType',
          label: '',
          name: '业务类型',
          isSelect: true,
          list: serviceType || []
        // }, {
        //   isTimeRange: true,
        //   value: 'time1',
        //   label: '',
        //   name: '创建时间段'
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
            value: 'code',
            label: '审核编码',
            width: '140'
          }, {
            value: 'name',
            label: '审核名称',
            width: '140'
          }, {
            value: 'serviceType',
            label: '审核类型',
            width: '100',
            slotBool: true
          }, {
            value: 'isRelease',
            label: '审核状态',
            slotBool: true,
            width: '100'
          }, {
            value: 'remarks',
            label: '备注',
            width: '100'
          }, {
            value: 'createTime',
            label: '提交审核时间',
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
          addBool: true
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
          shopType: 2,
          btnBool: true,
          cancelBtnBool: true,
          closeBtnBool: true,
          isRecord: true,
          isOld: false,
          isApprovalContent: false
        }
      }
    },
    components: {
      SearchSub,
      TreeSidebarTable,
      DialogSub,
      approval
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
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          queryPo.startTime = queryPo.time1[0];
          queryPo.endTime = queryPo.time1[1];
          delete queryPo.time1;
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
        let para = Object.assign({
        	  page: {
              pageNo: this.pagination.page,
              pageSize: this.pagination.count
            }
        }, queryPo, {
          // sysApprovalPeopleConfig: this.userId,
          searchParameter
        }, quick);
        if (list && (list instanceof Array) && list.length > 1) {
          let citys = ['province', 'city', 'region'];
          list.map((item, inx) => {
            if (inx > 0) {
              para[citys[inx - 1]] = item.name;
            }
          });
        }
        return await this.Api.getApprovalRecord(para);
      },
      handleDetail(row) {
        this.detailDialog.id = row.oaApprovalContentId;
        this.detailDialog.delFlag = row.delFlag;
        this.detailDialog.type = row.serviceType;
        this.detailDialog.serviceId = row.serviceId;
        this.detailDialog.isRecord = true;
        this.detailDialog.isRelease = row.isRelease;
        this.detailDialog.remarks = row.remarks;
        this.detailDialog.isApprovalContent = false;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/approval/approval/' + row.id, query: {delFlag: row.delFlag, type: row.serviceType, serviceId: row.serviceId}});
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    async mounted() {
    }
  }
</script>

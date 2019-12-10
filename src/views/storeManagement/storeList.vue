<template>
  <div class="app-container calendar-list-container">
    <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :pagination="pagination" :quickSearch="quickSearch" :searchBool="searchBool" :table="table" :dialog="dialog"
                :getDataList="getDataList">
    </search-sub>
    <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :dialog="dialog" @submit="handleSave"
           :getDataList="getDataList" :table="table" :pagination="pagination">
      <template slot="merchantName" slot-scope="{index, row}">
        {{row.merchantName}}<br/>
        {{row.mobile}}
      </template>
      <template slot="spreadUsername" slot-scope="{index, row}">
        <div v-if="!row.spreadCode">{{row.spreadCode}}</div>
        {{row.spreadUsername}}
      </template>
      <template slot="isEnable" slot-scope="{ index,row }">
        <el-tag :type="row.isEnable == 1 ? 'danger' : 'success'">
          {{row.isEnable == 1 ? '停用' : '启用'}}
        </el-tag>
      </template>
      <template slot="platformStatus" slot-scope="{index,row }">
          <template v-for="status in platformStatus" v-if="status.value == row.platformStatus">
            {{status.label}}
          </template>
      </template>
      <template slot="type" slot-scope="{index,row }">
          {{storeType[row.type - 1]}}
      </template>
      <template slot="province" slot-scope="{index,row }">
        <span v-for="c in citys" :key="c" v-if="!!row[c]">{{row[c]}} </span>
      </template>
      <template slot="storeAccount" slot-scope="{index,row }">
        <span>{{row.storeAccountName}}</span><br/>
        <span v-if="!!row.storeAccount">{{row.storeAccount.name}}</span>
      </template>
      <template slot="approvalTime" slot-scope="{ index,row }">
        <span v-if="!!row.approvalTime">{{format(new Date(row.approvalTime), "yyyy-MM-dd hh:mm:ss")}}</span>
      </template>
      <template slot="table" slot-scope="{index, row}">
        <el-button type="text"
                   size="mini"
                   @click.native="() => handleDetail(row)">查看</el-button>
      </template>
    </tree-sidebar-table>
    <!-- 详情 -->
    <dialog-sub :dialog="detailDialog" @close="handleClose" @reset="handleClose">
      <template slot="dialog">
        <store-info :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></store-info>
      </template>
    </dialog-sub>

  </div>
</template>
<script>
  import {format} from "@/utils";
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import SearchSub from '@/components/SearchSub';
  import DialogSub from '@/components/DialogSub';
  import bus from '@/utils/bus.js'
  import storeInfo from './storeInfo';

  export default {

    data() {
      let query = this.$route.query || {};
      let platformStatus = [{
              value: 1,
              label: '正常'
            }, {
              value: 2,
              label: '关闭'
            }, {
              value: 3,
              label: '冻结'
            }];
      return {
        format,
        platformStatus,
        sex: [{
          label: '男',
          value: '1'
        }, {
          label: '女',
          value: '2'
        }, {
          label: '未知',
          value: '3'
        }],
        citys: ['province', 'city', 'region'],
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'type',
            label: query.storeType || '',
            selected: query.storeType || '',
            list: [{
              value: '1',
              label: '种子店'
            }, {
              value: '2',
              label: '特色店'
            }]
          }, {
            value: 'platformStatus',
            label: '',
            selected: '',
            list: platformStatus
          }, {
            value: 'isEnable',
            label: '',
            selected: '',
            list: [{
              value: 1,
              label: '停用'
            }, {
              value: 0,
              label: '启用'
            }]
          }]
        },
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '店铺关键字',
          isText: true,
          placeholder: "名称/编码"
        }, {
          value: 'storeAccountLike',
          label: query.sellerCode || '',
          name: '所属商户',
          isText: true,
          placeholder: "编码/姓名/手机号"
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '入驻时间段'
        }],
        registerType: [
          '个体店铺',
          '企业'
        ],
        storeType: [
          '种子店',
          '特色店'
        ],
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
          width: '150px',
          detailBool: false,
          editBool: true,
          delBool: true,
          emitEditBool: true,
          addBool: true,
          arrDelBool: true,
          emitDetailBool: true,
          columns: [{
            value: 'code',
            label: '店铺编号',
            width: '150'
          }, {
            value: 'nickName',
            label: '店铺名称',
            width: '140'
          }, {
            value: 'name',
            label: '工商注册名称',
            width: '140'
          }, {
            value: 'type',
            label: '店铺角色',
            slotBool: true,
            width: '120'
          }, {
            value: 'isEnable',
            label: '是否启用',
            slotBool: true,
            width: '120'
          }, {
            value: 'spreadUsername',
            label: '推广人',
            slotBool: true,
            width: '150'
          }, {
            value: 'province',
            label: '地区',
            slotBool: true,
            width: '150'
          }, {
            value: 'storeAccount',
            label: '所属商户',
            slotBool: true,
            width: '150'
          }, {
            value: 'platformStatus',
            label: '店铺状态',
            slotBool: true,
            width: '140'
          }, {
            value: 'approvalTime',
            label: '入驻时间',
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
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
          storeType: 1,
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
      storeInfo
    },
    methods: {
      async getTreeList(node) {
        let res = await this.Api.getAreaConfig({parentCode: node && node.key ? node.key : '000000'});
        if (res.status === 1 && res.data) {
          let list = res.data.list || [];
          return list;
        }
      },
      handleDetail(row) {
        this.detailDialog.id = row.id;
        this.detailDialog.storeType = row.type;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/seller/store/' + row.id, query: {storeType: row.type}});
      },
      async getDataList(params, areaAll) { //获取店铺列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected || item.selected === 0) {
              quick[item.value] = item.selected;
            }
          })
        }
        if (!queryPo.merManagerLike) {
          queryPo.managerDutyAreaConfig = {
            merManagerLike: queryPo.merManagerLike,
            accountType: queryPo.accountType
          };
          delete queryPo.merManagerLike;
          delete queryPo.accountType;
        }
        let para = Object.assign({
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          searchParameter: {
            keyWord: queryPo.keyWord
          }
        }, queryPo, this.query, quick);
        if (params && params.id && params.name !== '全国') {
          areaAll.forEach(item => {
            if (item.areaLevel > 0) {
              para[this.citys[item.areaLevel - 1]] = item.name;
            }
          })
        }
        if (queryPo.time1 && queryPo.time1.length) {
          para.createStartTime = queryPo.time1[0];
          para.createEndTime = queryPo.time1[1];
          delete para.time1;
        }
        let res = await this.Api.getStoreList(para);

        return res;
      },
      async handleSave(row, savePrompt, type) {
        if (row.area && row.area.length) {
          row.province = '' + row.area[0];
          row.city = '' + row.area[1];
          row.region = '' + row.area[2];
        }
        savePrompt(this.Api.updateStoreInfo, row);
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

<template>
  <div class="app-container calendar-list-container">
    <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :searchBool="searchBool" :table="table" :dialog="dialog"  :pagination="pagination" :getDataList="getDataList">
    </search-sub>
    <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :dialog="dialog"
           :getDataList="getDataList" :table="table" :pagination="pagination">
      <template slot="managerCooperation" slot-scope="{ index,row }">
        <span v-if="!!row.managerCooperation">{{row.managerCooperation.name}}</span>
      </template>
      <template slot="managerRegionBoss" slot-scope="{ index,row }">
        <span v-if="row.managerCooperation && row.managerCooperation.merManager">{{row.managerCooperation.merManager.name}}</span>
      </template>
      <template slot="managerDutyAreaConfigs" slot-scope="{ index,row }">
        <el-button size="mini" @click="handleDutyArea(row, index)">查看辖区</el-button>
      </template>
      <template slot="isEnable" slot-scope="{ index,row }">
        <el-tag :type="row.isEnable == '1' ? 'danger' : 'success'">
          {{row.isEnable == '1' ? '停用' : '启用'}}
        </el-tag>
      </template>
      <template v-for="item in fixedData" :slot="item.value" slot-scope="{index,row }">
        <span v-for="status in item.list" :key="status.label" v-if="status.value === row[item.value]">
          {{status.label}}
        </span>
      </template>
      <template slot="approvalTime" slot-scope="{ index,row }">
        <span v-if="!!row.approvalTime">{{format(new Date(row.approvalTime), 'yyyy-MM-dd hh:mm:ss')}}</span>
      </template>
      <template slot="table" slot-scope="{index, row}">
        <el-button type="text"
                   size="mini"
                   @click.native="() => handleDetail(row)">查看</el-button>
      </template>
    </tree-sidebar-table>
    <!-- 查看辖区 -->
    <el-dialog title="查看辖区"
      :visible.sync="dialogDutyArea.visible"
      width="400px">
      <div class="duty-area-tree-box">
        <el-tree
          :default-expanded-keys="dialogDutyArea.expandKeys"
          node-key="code"
          :data="dialogDutyArea.dutyAreaList"
          empty-text="暂无辖区数据"
          style="width: 100%;"
          accordion>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDutyArea.visible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 详情 -->
    <dialog-sub key="detail" :dialog="detailDialog" @close="handleClose" @reset="handleClose">
      <template slot="dialog">
        <partner-info :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></partner-info>
      </template>
    </dialog-sub>
  </div>
</template>
<script>
  import {format, parseQueryString} from "@/utils";
  import bus from '@/utils/bus.js'
  import areaConfig from '@/utils/sys_area_config.json'
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import SearchSub from '@/components/SearchSub';
  import DialogSub from '@/components/DialogSub';
  import partnerInfo from './partnerDetail';

  export default {
    data() {
      let query = this.$route.query;
      return {
        format,
        citys: ['province', 'city', 'region'],
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'status',
            label: '',
            selected: '',
            list: [{
              value: '1',
              label: '正常'
            }, {
              value: '2',
              label: '关闭'
            }, {
              value: '3',
              label: '冻结'
            }]
          }, {
            value: 'isEnable',
            label: '',
            selected: '',
            list: [{
              value: '0',
              label: '启用'
            }, {
              value: '1',
              label: '停用'
            }]
          }]
        },
        fixedData: [
          {
            label: "状态",
            value: "status",
            list: [
              {
                label: "正常",
                value: 1
              },
              {
                label: "关闭",
                value: 2
              }, {
                label: "冻结",
                value: 3
              }
            ]
          }
        ],
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: query.merCode || '',
          name: '账户',
          isText: true,
          placeholder: "省区总/企业名称/账号/编码",
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '入驻时间段'
        }],
        storeType: [
          '种子店',
          '特色店'
        ],
        treeConfig: {
          nodeKey: 'code',
          // lazy: true,
          expandedKeys: ['0'],
          currentKey: '0'
        },
        batchIds: [],
        table: {
          width: '150px',
          detailBool: false,
          editBool: true,
          delBool: true,
          emitEditBool: true,
          addBool: true,
          arrDelBool: true,
          emitDetailBool: true,
          columns: [
            {
              value: 'code',
              label: '编码',
              width: '100'
            },
            {
              value: 'username',
              label: '登录名',
              width: '100'
            }, {
              value: 'name',
              label: '企业名',
              width: '140'
            }, {
              value: 'managerRegionBoss',
              label: '省区总',
              width: '130',
              slotBool: true
            }, {
              value: 'isEnable',
              label: '启用状态',
              width: '110',
              slotBool: true
            }, {
              value: 'status',
              label: '状态',
              width: '110',
              slotBool: true
            }, {
              value: 'managerDutyAreaConfigs',
              label: '所管辖区',
              width: '110',
              slotBool: true
            }, {
              value: 'approvalTime',
              label: '入驻时间',
              width: '140',
              slotBool: true
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
        dialogDutyArea: {
          dutyAreaList: [],
          visible: false,
          expandKeys: []
        },
        detailDialog: {
          saveFormVisible: false,
          width: '1000px',
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
      partnerInfo
    },
    methods: {
      async getTreeList(node) {
        return this.$plug.recursion.treeData(areaConfig.RECORDS, 'parent_code', '000000', 'code', 'name');
      },
      handleDetail(row) {
        this.detailDialog.id = row.id;
        this.detailDialog.storeType = row.type;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/user/partner/' + row.id, query: {storeType: row.type}});
      },
      async getDataList(area, areaAll) { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
            keyWord: queryPo.keyWord,
          };
        if (queryPo.time1) {
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
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          searchParameter
        }, queryPo, this.query, quick, {
          accountType: 2
        });
        if (area && area.code !== '0') {
          para.sysAreaConfigCode = area.code;
        }
        let res = await this.Api.getPartnerList(para);
        return res;
      },
      async handleDutyArea(row, inx) {
        let res = await this.Api.getDutyAreaList({
          merManagerId: row.id,
          managerDutyAreaConfig: {
            accountType: 2
          }
        });
        if (res.status === 1) {
          let arr = [];
          if (!res.data) {
            res.data = [];
          }
          res.data.forEach((item, inx) => {
            this.formatDutyArea(arr, item, [], ['province', 'city', 'region'], 0);
          })
          this.dialogDutyArea.dutyAreaList = arr;
          if (arr.length > 0) {
            this.dialogDutyArea.expandKeys = [arr[0].code];
          } else {
            this.dialogDutyArea.expandKeys = [];
          }
          this.dialogDutyArea.visible = true;
        }
      },
      formatDutyArea(arr, area, inxList, levelArea, level) {
        let hasArea = false;
        let arry = arr;
        for (var j = 0; j < inxList.length; j++) {
          arry = arry[inxList[j]].children;
        }

        for (var i = 0; i < arry.length; i++) {
          if (arry[i].label === area[levelArea[level]]) {
            hasArea = true;
            if (level < levelArea.length - 1) {
              if (!arry[i].children) {
                arry[i].children = [];
              }
              inxList.push(i);
              this.formatDutyArea(arr, area, inxList, levelArea, level + 1);
            }
            break;
          }
        }
        if (!hasArea) {
          if (level == levelArea.length - 1) {
            arry.push({
              label: area[levelArea[level]],
              code: area.areaConfig.code.substring(0, (level　+ 1) * 2) + '0'.repeat(levelArea.length * 2 - (level　+ 1) * 2)
            });
          } else if (level < levelArea.length - 1) {
            arry.push({
              label: area[levelArea[level]],
              code: area.areaConfig.code.substring(0, (level　+ 1) * 2) + '0'.repeat(levelArea.length * 2 - (level　+ 1) * 2),
              children: []
            });
            inxList.push(arry.length - 1);
            this.formatDutyArea(arr, area, inxList, levelArea, level + 1);
          }
        }
      },
      handleClose() {
        if (this.detailDialog.isChange) {
          bus.$emit('loadDialogData');
          this.detailDialog.isChange = false;
        }
      }
    },
    created() {
    },
    async mounted() {

    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .duty-area-tree-box{
    @include scrollBar;
    width: 100%;
    max-height: 340px;
    overflow:auto;
    margin-top: -10px;
    margin-bottom: -10px;
  }
</style>

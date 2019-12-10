<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <search-sub :searchObj="searchObj" :timeRangeVal="['time1']" :quickSearch="quickSearch" :searchBool="searchBool" :table="table" :dialog="dialog" :pagination="pagination"
                  :getDataList="getDataList">
       <!--  <template slot="arrDel">
          <el-select v-model="batch" style="width: 100px;">
            <el-option
              v-for="item in batchOperate"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-button @click="handleBatch">批量操作</el-button>
        </template> -->
      </search-sub>
      <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :dialog="dialog"
             :getDataList="getDataList" :table="table" :pagination="pagination" @detail="handleDetail">
        <template slot="merchantName" slot-scope="{index, row}">
          {{row.merchantName}}<br/>
          {{row.mobile}}
        </template>
        <template slot="name" slot-scope="{index, row}">
          {{row.name}}
        </template>
        <template slot="managerDutyAreaConfigs" slot-scope="{ index,row }">
          <el-button size="mini" @click="handleDutyArea(row, index)">查看辖区</el-button>
        </template>
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-tag :type="row.isEnable == 1 ? 'danger' : 'success'">
            {{row.isEnable == 1 ? '停用' : '启用'}}
          </el-tag>
        </template>
        <template slot="status" slot-scope="{index,row }">
          <el-tag :type="statusColor[row.status - 1]" v-for="s in status" v-if="s.value === row.status" :key="s.value">{{s.label}}</el-tag>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span v-if="!!row.createTime">{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
       <!--  <template slot="table" slot-scope="{index, row}">
          <el-button type="text"
                     size="mini"
                     @click.native="() => handleDetail(row)">查看</el-button>
        </template> -->
      </tree-sidebar-table>
      <!-- 查看辖区 -->
      <el-dialog title="查看辖区"
        :visible.sync="dialogDutyArea.visible"
        width="400px">
        <div class="duty-area-tree-box">
          <el-tree
            :default-expanded-keys="dialogDutyArea.expandKeys"
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
      <dialog-sub :dialog="detailDialog" @close="handleClose" @reset="handleClose">
        <template slot="dialog">
          <seller-info :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></seller-info>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import {format} from "@/utils";
  import bus from '@/utils/bus.js'
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import SearchSub from '@/components/SearchSub'
  import DialogSub from '@/components/DialogSub';
  import sellerInfo from './sellerDetail';

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
      return {
        status,
        format,
        citys: ['province', 'city', 'region'],
        statusColor: ['success', 'info', 'danger'],
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
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'status',
            label: '',
            selected: '',
            list: status
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
          value: 'accountKeyLike',
          label: '',
          name: '商户',
          isText: true,
          placeholder: "名称/编码"
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '入驻时间段'
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
          width: '150px',
          detailBool: true,
          editBool: true,
          delBool: true,
          emitEditBool: true,
          addBool: true,
          arrDelBool: true,
          emitDetailBool: true,
          columns: [{
            value: 'code',
            label: '用户编码',
            width: '150'
          }, {
            value: 'userName',
            label: '登录名',
            width: '100'
          }, {
            value: 'name',
            label: '姓名',
            width: '100'
          }, {
            value: 'isEnable',
            label: '是否启用',
            slotBool: true,
            width: '120'
          }, {
            value: 'status',
            label: '状态',
            slotBool: true,
            width: '140'
          }, {
            value: 'managerDutyAreaConfigs',
            label: '所管辖区',
            slotBool: true,
            width: '150'
          }, {
            value: 'createTime',
            label: '创建时间',
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
        dialogDutyArea: {
          dutyAreaList: [],
          visible: false
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
      sellerInfo
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
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/user/seller/' + row.id});
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
        let para = Object.assign({
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          searchParameter: {
            keyWord: queryPo.keyWord
          }
        }, queryPo, this.query, quick);
        if (params && params.id && params.name !== '全国') {
          // para[this.citys] = item.name;
          areaAll.forEach(item => {
            if (item.areaLevel > 0) {
              para[this.citys[item.areaLevel - 1]] = item.name;
            }
          })
        }
        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          para.createStartTime = queryPo.time1[0];
          para.createEndTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        if (para.accountKeyLike) {
          para.roleType = 4;
        }
        let res = await this.Api.getSellerList(para);

        return res;
      },
      async handleDutyArea(row, inx) {
        let res = await this.Api.getSellerDutyareas({
          id: row.id
        });
        if (res.status === 1) {
          let arr = [];
          if (!res.data) {
            res.data = [];
          }
          res.data.forEach((item, inx) => {
            this.formatDutyArea(arr, item, [], ['province', 'city', 'region'], 0, item);
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
      formatDutyArea(arr, area, inxList, levelArea, level, item) {
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
              this.formatDutyArea(arr, area, inxList, levelArea, level + 1, item);
            }
            break;
          }
        }
        if (!hasArea) {
          if (level == levelArea.length - 1) {
            arry.push({
              label: area[levelArea[level]],
              code: area.areaConfig.code ? area.areaConfig.code.substring(0, (level　+ 1) * 2) + '0'.repeat(levelArea.length * 2 - (level　+ 1) * 2)  : (level + item.id + levelArea[level])
            });
          } else if (level < levelArea.length - 1) {
            arry.push({
              label: area[levelArea[level]],
              code: area.areaConfig.code ? area.areaConfig.code.substring(0, (level　+ 1) * 2) + '0'.repeat(levelArea.length * 2 - (level　+ 1) * 2) : (level + item.id + levelArea[level]),
              children: []
            });
            inxList.push(arry.length - 1);
            this.formatDutyArea(arr, area, inxList, levelArea, level + 1, item);
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

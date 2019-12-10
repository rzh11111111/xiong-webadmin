<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :timeRangeVal="['time1']" :quickSearch="quickSearch" :searchObj="searchObj" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog" :pagination="pagination">
        <!--<template slot="arrDel">-->
        <!--<el-button size="mini" icon="el-icon-delete" type="danger" @click="arrDel">批量删除-->
        <!--</el-button>-->
        <!--</template>-->
      </search-sub>
      <!--表格-->
      <tree-sidebar-table ref="tableSub" :treeConfig="treeConfig" :getTreeList="getTreeList" :dialog="dialog"
             :getDataList="getDataList" :table="table" :pagination="pagination" @detail="handleDetail">
        <template slot="managerSpread" slot-scope="{ index,row }">
          <span v-if="!!row.managerSpread">{{row.managerSpread.name}}</span>
        </template>
        <template slot="type" slot-scope="{ index,row }">
          <span v-if="!!row.managerSpread">{{row.managerSpread.type === 1 ? '兼职' : '全职'}}</span>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{row.createTime}}</span>
        </template>
        <template slot="managerRegionBoss" slot-scope="{ index,row }">
          <span v-if="row.managerSpread && row.managerSpread.merManager && row.managerSpread.merManager.managerCooperation && row.managerSpread.merManager.managerCooperation.merManager">{{row.managerSpread.merManager.managerCooperation.merManager.name}}</span>
        </template>
        <template slot="managerCooperation" slot-scope="{ index,row }">
          <span v-if="row.managerSpread && row.managerSpread.merManager">{{row.managerSpread.merManager.name}}</span>
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
      <dialog-sub key="detail" :dialog="detailDialog" @close="handleClose" @reset="handleClose">
        <template slot="dialog">
          <promoters-info :dialog="detailDialog" v-if="detailDialog.saveFormVisible"></promoters-info>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import {format} from "@/utils";
  import bus from '@/utils/bus.js'
  import {getToken} from '@/utils/auth'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import promotersInfo from './promotersDetail';

  export default {
    data() {
      let query = this.$route.query;
      return {
        format,
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'status',
            label: '',
            selected: '',
            list: [{
              label: '正常',
              value: 1
            }, {
              label: '关闭',
              value: 2
            }, {
              label: '冻结',
              value: 3
            }]
          },{
            value: 'isEnable',
            label: '',
            selected: '',
            list: [{
              label: '停用',
              value: 1
            }, {
              label: '启用',
              value: 0
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
        apiUrl: process.env.BASE_API + '/api/sys/fileConfig/upload',
        myHeaders: {
          tokenId: getToken()
        }, // 要保证取到
        treeConfig: {
          treeProps: {
            label: 'name'
          },
          nodeKey: 'code',
          lazy: true,
          expandedKeys: ['0'],
          currentKey: '0'
        },
        searchBool: false,
        searchObj: [{
          value: 'keyWord',
          label: query.merCode || '',
          name: '账户',
          isText: true,
          placeholder: '省区总/合作商/姓名/账号/编码'
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '入驻时间段'
        }],
        table: {
          width: '200px',
          emitEditBool: true,
          emitDetailBool: true,
          detailBool: true,
          editBool: true,
          delBool: true,
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
            },
            {
              value: 'name',
              label: '姓名',
              width: '60'
            }, {
              value: 'type',
              label: '职型',
              width: '70',
              slotBool: true
            }, {
              value: 'managerRegionBoss',
              label: '省区总',
              width: '130',
              slotBool: true
            }, {
              value: 'managerCooperation',
              label: '合作商',
              width: '110',
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
              width: '150',
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
          addBool: true,
          btnText: '创建',
          titleText: '创建',
          width: '750px',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          ruleForm2: {
            name: '', //	    是	string	姓名
            sex: '', //	      否	int	性别(1.男,2.女)
            age: '', //	      否	int	年龄
            IDCard: '', //	  否	string	身份证
            phone: '', //	    是	String	联系电话
            address: '', //	  否	string	家庭地址
            isEnable: 0, //	是	int	是否停用(1是 0否)
            status: '', //	  否	int	账号状态 1 正常 2 关闭 3冻结(暂时后台设置默认为1)
            areaConfig: [{id: ''}], //id	是	string	所在区域ID
          },
          rules2: {}
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
      TreeSidebarTable,
      DialogSub,
      SearchSub,
      promotersInfo
    },
    methods: {
      async getTreeList(node) {
        let res = await this.Api.getAreaConfig({parentCode: node && node.key ? node.key : '000000'});
        if (res.status === 1 && res.data) {
          let list = res.data.list || [];
          return list;
        }
      },
      async getDataList(area) { //获取列表
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
        let searchParameter = {
          keyWord: queryPo.keyWord
        }
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
        let para = Object.assign({}, queryPo, quick, {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          searchParameter,
          accountType: 1
        })
        if (area && area.code !== '0') {
          para.sysAreaConfigCode = area.code;
        }
        let resData = await this.Api.getPromotersList(para);
        return resData;
      },
      handleDetail(row) {
        this.detailDialog.id = row.id;
        this.detailDialog.storeType = row.type;
        this.detailDialog.saveFormVisible = true;
        // this.$router.push({path: '/user/promoters/' + row.id, query: {storeType: row.type}});
      },
      async handleDutyArea(row, inx) {
        let res = await this.Api.getDutyAreaList({
          merManagerId: row.id,
          managerDutyAreaConfig: {
            accountType: 1
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
    computed: {},
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

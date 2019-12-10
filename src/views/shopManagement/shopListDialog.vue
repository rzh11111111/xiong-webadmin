<template>
  <dialog-sub :dialog="dialog">
    <template slot="dialog">
      <table-sub ref="tableSub" :dialog="subDialog"
             :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-tag :type="row.isEnable == 1 ? 'danger' : 'success'">
            {{row.isEnable == 1 ? '停用' : '启用'}}
          </el-tag>
        </template>
        <template slot="platformStatus" slot-scope="{index,row }">
            {{shopStatus[row.platformStatus - 1]}}
        </template>
        <template slot="type" slot-scope="{index,row }">
            {{shopType[row.type - 1]}}
        </template>
        <template slot="approvalTime" slot-scope="{ index,row }">
          <span v-if="!!row.approvalTime">{{format(new Date(row.approvalTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
      </table-sub>
    </template>
  </dialog-sub>
</template>
<script>
  import {format} from "@/utils";
  import TableSub from '@/components/TableSub'
  import bus from '@/utils/bus.js'
  import DialogSub from '@/components/DialogSub';

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {
            saveLoading: false,
            saveFormVisible: false,
            pavalBool: true,
            readBool: true,
            addBool: true
          };
        }
      }
    },
    data() {
      return {
        format,
        searchBool: true,
        shopStatus: [
          '正常',
          '关闭',
          '冻结'
        ],
        shopType: [
          '生产企业',
          '同城企业'
        ],
        table: {
          width: '150px',
          detailBool: true,
          editBool: true,
          delBool: true,
          addBool: true,
          btn: true,
          columns: [{
            value: 'code',
            label: '企业编号',
            width: '150'
          }, {
            value: 'nickName',
            label: '企业名称',
            width: '140'
          }, {
            value: 'type',
            label: '企业角色',
            slotBool: true,
            width: '120'
          }, {
            value: 'isEnable',
            label: '是否启用',
            slotBool: true,
            width: '120'
          }, {
            value: 'platformStatus',
            label: '企业状态',
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
        subDialog: {
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          readBool: true,
          addBool: true
        },
        areaIds: '',
        managerId: '',
        type: null
      }
    },
    components: {
      TableSub,
      DialogSub
    },
    watch: {
      'dialog': {
        immediate: true,
        deep: true,
        handler(d) {
          if (d.type !== this.type || this.managerId !== d.managerId || this.areaIds !== d.areaIds) {
            this.$refs.tableSub && this.$refs.tableSub.loadData();
          }
        }
      }
    },
    methods: {
      async getDataList() { //获取店铺列表
        this.managerId = this.dialog.managerId;

        let para = Object.assign({
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          }
        });
        if (this.dialog.managerId) {
          para.managerId = this.dialog.managerId;
        }
        let res = await this.Api.getShopMerPage(para);

        return res;
      },
    },
    async mounted() {
    }
  }
</script>

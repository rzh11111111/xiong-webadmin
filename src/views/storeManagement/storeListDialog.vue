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
            {{storeStatus[row.platformStatus - 1]}}
        </template>
        <template slot="type" slot-scope="{index,row }">
            {{storeType[row.type - 1]}}
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
        storeStatus: [
          '营业中',
          '歇业中'
        ],
        storeType: [
          '种子店',
          '特色店'
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
            label: '店铺编号',
            width: '150'
          }, {
            value: 'nickName',
            label: '店铺名称',
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
        subDialog: {
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          readBool: true,
          addBool: true
        },
        areaIds: '',
        spreadId: '',
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
          if (d.type !== this.type || this.spreadId !== d.spreadId || this.areaIds !== d.areaIds) {
            this.$refs.tableSub && this.$refs.tableSub.loadData();
          }
        }
      }
    },
    methods: {
      async getDataList() { //获取店铺列表
        this.spreadId = this.dialog.spreadId;
        this.areaIds = this.dialog.areaIds;
        this.type = this.dialog.type;

        let para = Object.assign({
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
        });
        if (this.dialog.spreadId) {
          para.spreadId = this.dialog.spreadId;
        }
        if (this.dialog.areaIds) {
          para.areaIds = this.dialog.areaIds;
        }
        if (this.dialog.type) {
          para.type = this.dialog.type;
        }
        let res = await this.Api.getStoreList(para);

        return res;
      },
    },
    async mounted() {
    }
  }
</script>

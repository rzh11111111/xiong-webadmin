<!--
	searchObj.searchBool 默认为false时 查询 组件显示，为true时隐藏

	table.tableBool 默认为false时 table 组件显示，为true时隐藏
	table.searchBool 默认为false时 查询按钮 显示，为true时隐藏
	table.addBool 默认为false时 新增按钮 显示，为true时隐藏
	table.detailBool 默认为false时 查看按钮 显示，为true时隐藏
	table.editBool 默认为false时 编辑按钮 显示，为true时隐藏
	table.delBool 默认为false时 删除按钮 显示，为true时隐藏

	table.emitAddBool 默认为false时 父组件 默认不监听 子组件 的新增事件，为true时则监听
	table.emitDetailBool 默认为false时 父组件 默认不监听 子组件 的查看事件，为true时则监听
	table.emitEditBool 默认为false时 父组件 默认不监听 子组件 的编辑事件，为true时则监听

	dialog.dialogBool 默认为false时 table 组件显示，为true时隐藏
	dialog.readBool 默认为false时 弹出框 可编辑，为true时弹出框为可读
-->
<template>
  <el-row>
    <el-col :span="24">
      <search-sub :searchObj="searchObj" :searchBool="searchBool" :table="table" :dialog="dialog"
                  :getDataList="getDataList">
        <template slot="search">
          <slot name="search"></slot>
        </template>
      </search-sub>
      <slot></slot>
      <table-sub :table="table" :dialog="dialog" :pagination="pagination" :getDataList="getDataList" :value="value"
                 :loadBool="loadBool" :reloadTableList="reloadTableList" v-if="!table.tableBool">
        <template :slot="item.value" slot-scope="{index,row }" v-for="(item,index) in table.columns"
                  v-if="item.slotBool">
          <slot :name="item.value" :index="index" :row="row"></slot>
        </template>
        <template slot="table" slot-scope="{ index,row }">
          <slot name="table" :index="index" :row="row"></slot>
        </template>
      </table-sub>

      <dialog-sub :dialog="dialog" :table="table" :getDataList="getDataList" v-if="!dialog.dialogBool">
        <template slot="dialog">
          <slot name="dialog"></slot>
        </template>
      </dialog-sub>

    </el-col>
  </el-row>
</template>

<script>
  import bus from '../../utils/bus.js'
  import SearchSub from '@/components/SearchSub'
  import TableSub from '@/components/TableSub'
  import DialogSub from '@/components/DialogSub'

  export default {
    props: {
      searchBool: {
        type: Boolean,
        default() {
          return false
        }
      },
      searchObj: {
        type: Array,
        default() {
          return []
        }
      },
      table: {
        type: Object,
        default() {
          return []
        }
      },
      pagination: {
        type: Object,
        default() {
          return {}
        }
      },
      dialog: {
        type: Object,
        default() {
          return {}
        }
      },
      getDataList: {
        type: Function
      },
      loadBool: {
        type: Boolean,
        default() {
          return false
        }
      },
      value: {
        type: Number,
        default() {
          return 0
        }
      },
      reloadTableList: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {}
    },
    components: {
      SearchSub,
      TableSub,
      DialogSub
    },
    methods: {
      bus() {
        bus.$on("submit", (row, savePrompt, type) => {
          this.$emit('submit', row, savePrompt, type);
        }),
          bus.$on("detail", (row) => {
            this.$emit('detail', row);
          }),
          bus.$on("add", (row) => {
            this.$emit('add', row);
          }),
          bus.$on("edit", (row) => {
            this.$emit('edit', row);
          }),
          bus.$on("del", (row, delPrompt, type) => {
            this.$emit('del', row, delPrompt, type);
          }),
          bus.$on("arrDel", (row, delPrompt, type) => {
            this.$emit('arrDel', row, delPrompt, type);
          })
      }
    },
    created() {
      this.bus();
    },
    mounted() {

    }
  }
</script>

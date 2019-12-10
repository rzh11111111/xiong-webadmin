<!--如果tableBool为true更新表格，否则更新树-->
<template>
  <div>
    <el-popover
      placement="bottom"
      width="400"
      v-model="visible"
      @hide="handleClose"
      trigger="click">
      <div>
        <template>
          <div class="select-tree">
            <div class="input-tree" v-if="!popoverData.isLazy">
              <el-input
                size="mini"
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
              <el-button class="refresh" @click.stop="on_refresh" size="mini" plain
                         icon="el-icon-refresh">清空
              </el-button>
            </div>
            <el-scrollbar
              tag="div"
              class='is-empty'
              wrap-class="popover-dropdown__wrap"
              view-class="popover-dropdown__list">
              <!--treeDataList-->
              <el-tree
                ref="tree"
                :data="treeDataList"
                show-checkbox
                :check-strictly="popoverData.checkedType"
                :node-key="popoverData.nodeKey || 'id'"
                :accordion="popoverData.accordion"
                :disabled="disabled"
                :default-expanded-keys="popoverData.expandKeys"
                :default-checked-keys="popoverData.checkedKeys"
                :filter-node-method="filterNode"
                :default-expand-all="popoverData.isExpand"
                :lazy="popoverData.isLazy"
                @node-expand="nodeExpand"
                :load="lazyLoad"
                @check-change="handleChange"
                :props="defaultProps">
              </el-tree>

              <!--<el-tree-->
              <!--:data="treeDataList"-->
              <!--show-checkbox-->
              <!--node-key="id"-->
              <!--:filter-node-method="filterNode"-->
              <!--:default-expand-all="isExpand"-->
              <!--ref="tree">-->
              <!--</el-tree>-->
            </el-scrollbar>
          </div>
        </template>
      </div>
      <el-button slot="reference" style="width:192px;">
        选择/查看{{popoverData.btnText}}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <div style="text-align: right; margin-top: 10px;">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>
  export default {
    props: {
      popoverData: {
        type: Object,
        default() {
          return {
            checkedType: false,
            isExpand: false,
            isLazy: false,
            expandKeys: [],
            checkedKeys: [],
            accordion: false,
            nodeKey: 'id'
          }
        }
      },
      treeDataList: {
        type: [Array, Object],
        required: true
      },
      disabled: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'name',
          id: 'id',
          disabled: 'disabled'
        },
        filterText: '',
        visible: false // 是否显示弹出框
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
    },
    methods: {
      on_refresh() {
        this.filterText = ''
        this.$refs.tree.setCheckedKeys([]);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      lazyLoad(node, resolve) {
        this.$emit('lazyLoad', node, resolve);
      },
      nodeExpand() {
        this.$emit('nodeExpand', ...arguments);
      },
      handleChange() {
        this.$emit('change', ...arguments);
      },
      handleClose() {
        this.$emit('close');
      }
    }
  }
</script>
<style type="text/scss" lang="scss">
.el-scrollbar__wrap{
  &.popover-dropdown__wrap{
    max-height: 274px;
    .popover-dropdown__list{
      list-style: none;
      padding: 6px 0;
      margin: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
</style>

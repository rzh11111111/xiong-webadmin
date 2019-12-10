<template>
  <div class="tree-table">
    <el-table :data="formatData" :row-style="showRow" :header-cell-style="headerStyle" v-bind="$attrs">
      <el-table-column align="center" v-if="columns.length===0" width="200">
        <template slot-scope="scope">
          <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
          <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
            <i v-else class="el-icon-minus"></i>
          </span>
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.label"
                       :min-width="column.width">
        <template slot-scope="scope">
          <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
          <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
            <i v-else class="el-icon-minus"></i>
          </span>
          <template v-if="column.value =='icoUrl'">
            <span v-if="!!scope.row[column.value]" class="table-img-box">
              <el-popover
                placement="top"
                trigger="hover"
                v-model="scope.row.visible" v-if="column.isShow">
                <img :src="scope.row[column.value]" :alt="column.alt || scope.row.name || 'logo'"/>
                <span slot="reference">
                  <img class="logo-img" :src="scope.row[column.value]" :alt="column.alt || scope.row.name || 'logo'"/>
                </span>
              </el-popover>
              <img v-else class="logo-img" :src="scope.row[column.value]" :alt="column.alt || scope.row.name || 'logo'">
            </span>
          </template>
          <span v-else>
            {{scope.row[column.value]}}
          </span>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
  </div>
</template>
<script>
  /**
   Auth: zhangyao
   Created: 2018/3/30-13:59
   */
  import treeToArray from './eval'

  export default {
    name: 'treeTable',
    props: {
      data: {
        type: [Array, Object],
        required: true
      },
      columns: {
        type: Array,
        default: () => []
      },
      evalFunc: Function,
      evalArgs: Array,
      expandAll: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      // 格式化数据源
      formatData() {
        let tmp
        if (!Array.isArray(this.data)) {
          tmp = [this.data]
        } else {
          tmp = this.data
        }
        const func = this.evalFunc || treeToArray
        const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
        return func.apply(null, args)
      }
    },
    methods: {
      headerStyle() {
        return {
          'padding': '12px 0',
          'font-size': '14px',
          'background-color': '#f9fafc'
        }
      },
      showRow(row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
        row.row._show = show;
        row.row.visible = false;
        return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
      },
      // 切换下级是否展开
      toggleExpanded(trIndex) {
        const record = this.formatData[trIndex]
        record._expanded = !record._expanded
      },
      // 图标显示
      iconShow(index, record) {
        return (index === 0 && record.children && record.children.length > 0)
      }
    }
  }
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

<style lang="scss" type="text/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }

  .processContainer {
    width: 100%;
    height: 100%;
  }

  table td {
    line-height: 26px;
  }
  .table-img-box{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    span{
      cursor: pointer;
    }
    .logo-img{
      max-width: 100%;
      max-height: 100%;
    }
  }
  .tree-ctrl {
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
  .tree-table{
    background-color: #fff;
  }
</style>

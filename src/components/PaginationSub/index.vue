<template>
  <el-row>
    <el-col :span="24">
      <!--工具条-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.page" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.count"
                     layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
                     style="float:right;margin-top: 10px;">
      </el-pagination>

    </el-col>
  </el-row>
</template>

<script>
  export default {
    props: {
      pagination: {
        type: Object,
        default() {
          return {}
        }
      },
      getDataList: {
        type: Function
      }
    },
    data() {
      return {}
    },
    methods: {
      handleSizeChange(val) {
        if (this.pagination.total) {
          this.pagination.count = val;
          this.getDataList()
        }
      },
      handleCurrentChange(val) {
        if (this.pagination.total) {
          this.pagination.page = val;
          this.getDataList()
        }
      }
    },
    mounted() {
    }
  }
</script>

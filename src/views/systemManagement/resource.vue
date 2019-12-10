<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="padding: 20px;">
      <files ref="files" :dialog="dialog" :maxCount="maxCount" :tableType="tableType"></files>
    </div>
  </div>
</template>
<script>
  import files from '@/components/Selector/files';

  export default {
    data() {
      return {
        maxCount: null,
        tableType: '',
        dialog: {
          ruleForm2: null
        },
        selectedData: {},
        type: '',
      }
    },
    components: {
      files
    },
    watch: {
      watch: {
        'dialog.innerVisible': function (val) {
          if (val != this.innerVisible) {
            this.innerVisible = val;
          }
        },
        innerVisible: function (val) {
          if (val != this.dialog.innerVisible) {
            this.dialog.innerVisible = val;
          }
        }
      },
      'dialog.files'(data) {
        if (data instanceof Array) {
          this.dialog.ruleForm2 = Object.assign([], data);
        } else {
          this.dialog.ruleForm2 = Object.assign({}, data);
        }
      }
    },
    methods: {
      selectRemove() {
        if (this.dialog.tableType === 'selection') {
          let para = [];
          this.dialog.ruleForm2 = [];
          this.dialog.files = [];
        } else {
          this.dialog.ruleForm2 = {};
          this.dialog.files = {};
        }
        this.$nextTick(()=>{
          this.$refs.files.handleCancel(true);
        })
      },
      handleClose(params, inx) {
        if (this.dialog.tableType === 'selection') {
          let para = [];
          this.dialog.ruleForm2.forEach(item => {
            if (item.id !== params.id) {
              para.push(item);
            }
          });
          this.dialog.ruleForm2 = Object.assign([], para);
          this.dialog.files = Object.assign([], para);
        } else {
          this.dialog.ruleForm2 = {};
          this.dialog.files = {};
        }
        this.$nextTick(()=>{
          this.$refs.files.cancelSelect(params);
        })
      },
      cancelSave() {
        this.dialog.innerVisible = false;
        this.$nextTick(()=>{
          this.$refs.files.selectInit();
        });
      },
      emitSave() {
        this.$nextTick(()=>{
          this.$refs.files.emitSave();
        });
      }
    },
    mounted() {
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .files-tag{
    &.el-tag--small{
      position: relative;
      width: 66px;
      height: 74px !important;
      overflow: hidden;
      text-align: center;
      margin-right: 5px;
      padding: 0;
      text-overflow: ellipsis;
    a{
      position:relative;
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .files-tag-img{
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .files-tag-icon{
      position: relative;
      line-height: 55px;
      width: 100%;
      height: 100%;
    }
    .files-tag-title{
      background: rgba(0,0,0,0.5);
      display: block;
      width: 100%;
      font-size: 12px;
      position: absolute;
      height: 20px !important;
      color: #fff;
      bottom: 0;
      left: 0;
      padding: 0 2px;
    }
    img{
      display: block;
      max-width: 100%;
      max-height: 100%;
      margin: 0 auto;
    }
    .el-icon-document{
      display: block;
      font-size: 40px;
      line-height: 50px;
      height: 50px;
    }
  }
  }


</style>

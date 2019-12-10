<template>
  <div>
    <el-dialog
        width="1100px"
        maxHeight="600px"
        :title="subDialog.titleText"
        :close-on-click-modal="true"
        :append-to-body="subDialog.appendToBody===true"
        :visible.sync="subDialog.innerVisible"
        custom-class="files-wrapper"
        :before-close="cancelSave"
        append-to-body>
      <files ref="files" :dialog="subDialog" :maxCount="dialog.maxCount" :tableType="dialog.tableType" @submit="handleSelect"></files>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelSave">取消</el-button>
          <el-button type="primary" size="small" @click="emitSave">确定</el-button>
        </div>
    </el-dialog>

      <template v-if="dialog.tableType === 'selection'">
        <el-tag v-for="(file, inx) in dialog.files" :closable="!disabled" :key="file.id" v-if="!!file && !!file.url" @close="handleClose(file, inx)" class="files-tag">
            <template v-if="isImg(file)">
              <el-popover
                placement="top"
                popper-class="tootip-box"
                trigger="click">
                <img :src="file.url"></img>
                {{file.name}}
                <div class="files-tag-img" slot="reference">
                  <img :src="file.url"></img>
                </div>
              </el-popover>
            </template>
            <template v-else>
              <div class="files-tag-icon">
                <el-popover
                  placement="top"
                  trigger="click"
                  popper-class="tootip-box"
                  :content="file.url">
                  <span class="el-icon-document" slot="reference"></span>
                </el-popover>
              </div>
              <div class="files-tag-title">
                <el-popover
                  placement="top"
                  trigger="click"
                  popper-class="tootip-box"
                  :content="file.name">
                  <span slot="reference" class="ellipsis">{{file.name}}</span>
                </el-popover>
              </div>
            </template>
        </el-tag>
      </template>
      <template v-else>
        <el-tag :closable="!disabled" v-if="!!dialog.files && !!dialog.files.url" @close="handleClose(dialog.files, 0)" class="files-tag">
          <template v-if="isImg(dialog.files)">
              <el-popover
                placement="top"
                popper-class="tootip-box"
                trigger="click">
                <img :src="dialog.files.url"></img>
                {{dialog.files.name}}
                <div class="files-tag-img" slot="reference">
                  <img :src="dialog.files.url"></img>
                </div>
              </el-popover>
            </template>
            <template v-else>
              <div class="files-tag-icon">
                <el-popover
                  placement="top"
                  trigger="click"
                  popper-class="tootip-box"
                  :content="dialog.files.url">
                  <span class="el-icon-document" slot="reference"></span>
                </el-popover>
              </div>
              <div class="files-tag-title">
                <el-popover
                  placement="top"
                  trigger="click"
                  popper-class="tootip-box"
                  :content="dialog.files.name">
                  <span slot="reference" class="ellipsis">{{dialog.files.name}}</span>
                </el-popover>
              </div>
            </template>
        </el-tag>
      </template>
      <el-button @click="selectFiles" :disabled="disabled" style="display: block;">选择文件</el-button>
  </div>
</template>
<script>
  import files from './files';

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {
            files: null,
            tableType: 'radio'
          };
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        subDialog: {
          innerVisible: false,
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
        'subDialog.innerVisible': function (val) {
          if (val != this.innerVisible) {
            this.innerVisible = val;
          }
        },
        innerVisible: function (val) {
          if (val != this.subDialog.innerVisible) {
            this.subDialog.innerVisible = val;
          }
        }
      },
      'dialog.files'(data) {
          this.subDialog.ruleForm2 = data;

        // if (data instanceof Array) {
        //   this.subDialog.ruleForm2 = Object.assign([], data);
        // } else {
        //   this.subDialog.ruleForm2 = Object.assign({}, data);
        // }
      }
    },
    methods: {
      isImgName(filename) {
        if (filename.toLowerCase().lastIndexOf('.jpg') !== -1 ||
            filename.toLowerCase().lastIndexOf('.jpeg') !== -1 ||
            filename.toLowerCase().lastIndexOf('.png') !== -1 ||
            filename.toLowerCase().lastIndexOf('.gif') !== -1) {
          return true;
        }
        return false;
      },
      isImg(file) {
        if (file && (
            (file.name && this.isImgName(file.name)) ||
            (file.url && this.isImgName(file.url))
          )) {
          return true;
        }
        return false;
      },
      changeType() {
        let current = this.dialog.files;
        this.subDialog.fileCategoryCode = this.dialog.fileCategoryCode;
        if (this.dialog.tableType === 'selection') {
          if (!current) {
            current = [];
          } else if(!(current instanceof Array)) {
            current = [current];
          }
          this.subDialog.ruleForm2 = Object.assign([], current);
          return ;
        }
        this.subDialog.ruleForm2 = Object.assign({}, current);
      },

      selectFiles() {
        this.subDialog.titleText = '选择文件';
        this.subDialog.innerVisible = true;
        this.changeType();
      },
      handleSelect(row) {
        let selectedData = null;
        if (row instanceof Array) {
          // this.dialog.files = Object.assign([], row);
          let namesArr = [];
          selectedData = Object.assign([], row);
        } else {
          // this.dialog.files = Object.assign({}, row);
          selectedData = Object.assign({}, row);
        }
        // this.subDialog.ruleForm2 = selectedData;
        this.dialog.files = selectedData;

        this.$emit("submit", this.dialog.files);
      },
      selectRemove() {
        if (this.dialog.tableType === 'selection') {
          this.dialog.files = [];
          // this.subDialog.ruleForm2 = [];
        } else {
          // this.subDialog.ruleForm2 = {};
          this.dialog.files = {};
        }
        this.$nextTick(()=>{
          this.$refs.files && this.$refs.files.handleCancel(true);
        })
      },
      handleClose(params, inx) {
        if (this.dialog.tableType === 'selection') {
          let para = [];
          this.subDialog.ruleForm2.forEach(item => {
            if (item.id !== params.id) {
              para.push(item);
            }
          });
          // this.subDialog.ruleForm2 = Object.assign([], para);
          this.dialog.files = Object.assign([], para);
        } else {
          // this.subDialog.ruleForm2 = {};
          this.dialog.files = {};
        }
        this.$nextTick(()=>{
          this.$refs.files && this.$refs.files.cancelSelect(params);
        })
      },
      cancelSave() {
        this.subDialog.innerVisible = false;
        this.$nextTick(()=>{
          this.$refs.files.selectClear();
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

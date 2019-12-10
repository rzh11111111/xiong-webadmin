<template>
  <el-container style="min-height: 200px;">
    <el-aside width="200px">
      <el-card class="tree-category-sidebar box-card" shadow="never">
        <el-tree ref="tree" :data="treeData"
                @node-click="handleNodeClick"
                :indent="10"
                :props="treeConfig.treeProps"
                :node-key="treeConfig.nodeKey || 'id'"
                :lazy="treeConfig.lazy || false"
                :load="loadTree"
                :highlight-current="true"
                :default-expanded-keys="treeConfig.expandedKeys"
                :expand-on-click-node="false"
                :current-node-key="treeConfig.currentKey"
                accordion></el-tree>
      </el-card>
    </el-aside>
    <el-container>
      <el-header height="40px">
        <el-upload
          class="upload-demo"
          :action="action"
          :data="{fileCategoryCode: currentTree.code}"
          multiple
          :headers="headers"
          name="filename"
          :show-file-list="false"
          :file-list="fileList"
          :on-preview="handlePreview"
          :before-upload="handleBefore"
          :on-error="handleError"
          :on-success="handleSuccess" :disabled="!currentTree || !currentTree.code" style="display: inline-block;" v-if="currentTree && currentTree.code">
          <el-button size="mini" type="primary" :disabled="!currentTree || !currentTree.code">点击上传</el-button>
        </el-upload>
        <el-button size="mini" type="primary" @click="dialogVisible = true"  v-else>上传图片</el-button>
        <el-button size="mini" style="display: inline-block;" @click="handleCancel" v-if="!!tableType">取消选择</el-button>
      </el-header>

      <el-main style="border:1px solid #ebeef5; ">
        <div class="selector-img-list" v-if="dataList.length < 1">
          <p class="no-data">暂无数据</p>
        </div>
          <ul class="selector-img-list" v-else>
            <li v-for="d in dataList" :key="d.id" v-if="!!d.id">
              <el-checkbox v-model="multipleSelection" :disabled="!!maxCount && multipleSelection.length >= maxCount && multipleSelection.indexOf(d.id) === -1" :label="d.id" v-if="tableType === 'selection'" @change="handleChecked(d)">&nbsp</el-checkbox>
              <el-radio v-model="singleSelection" :label="d.id" v-else-if="tableType === 'radio'" @change="handleChecked(d)">&nbsp</el-radio>
              <div class="selector-img-title" :title="d.name" v-else>{{d.name}}</div>
              <div :class="'img-content ' + (d.isOver ? 'img-hover' : '')" @mouseleave="d.isOver = false" @mouseenter="d.isOver = true">
               <!--  <template v-if="!tableType">
                  <p v-if="isImg(d.name)">
                    <el-popover
                      placement="top"
                      popper-class="tootip-img-box"
                      trigger="click">
                      <img :src="d.url" :alt="d.name">
                      <img slot="reference" :src="d.url" :alt="d.name">
                    </el-popover>
                  </p>
                  <p v-else>
                    {{d.name}}
                  </p>
                </template> -->
                <!-- <template v-else> -->
                  <p v-if="isImg(d.name)" @click="handleChecked(d, 1)">
                    <img :src="d.url" :alt="d.name" :title="tableType ? d.name : ''">
                  </p>
                  <p v-else @click="handleChecked(d, 1)">
                    {{d.name}}
                  </p>
                <!-- </template> -->
                <span class="operate-box">
                  <a href="javascript:;" @click.stop="handleDel(d)">删除</a>
                </span>
              </div>
            </li>

          </ul>

      </el-main>
      <el-footer height="45px">
        <el-pagination small background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="pagination.page" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.count"
                       layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
                       :pager-count="5"
                       style="float:right;margin-top: 10px;">
        </el-pagination>
      </el-footer>
      <!-- 上传图片子弹窗 -->
      <el-dialog
        title="上传图片"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="450px"
        append-to-body>
        <el-form style="width:100%;">
          <el-form-item label="图片分类：">
            <el-select v-model="currentCode" placeholder="请选择">
              <el-option
                v-for="item in fileDirectoryList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择图片：">
            <el-upload
              class="upload-files"
              :action="action"
              :data="{fileCategoryCode: currentCode}"
              multiple
              :on-preview="handlePreview"
              :headers="headers"
              name="filename"
              :auto-upload="false"
              list-type="picture"
              :file-list="fileList"
              :before-upload="handleBefore"
              :on-error="handleError"
              :on-success="handleSuccess"
              :disabled="!currentCode"
              ref="upload"
              style="display: inline-block;">
              <el-button size="mini" type="primary" :disabled="!currentCode">选择图片</el-button>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过3MB</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancelUpload">取 消</el-button>
          <el-button type="primary" @click="handleUpload">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </el-container>
</template>
<script>
  import config from '@/utils/config'
  import {setToken, getToken} from '@/utils/auth'
  import {mapGetters} from 'vuex';

  export default {
    props: {
      dialog: {
        type: Object,
        default() {
          return {}
        }
      },
      tableType: {
        type: String,
        default() {
          return '';
        }
      },
      treeConfig: {
        type: Object,
        default() {
          return {
            lazy: false,
            nodeKey: 'id',
            expandedKeys: ['0'],
            currentKey: '0',
            treeProps: {
              children: 'children',
              label: 'name'
            }
          }
        }
      },
      sidebarSelectd: {
        type: Object,
        default() {
          return {
            current: {},
            list: []
          }
        }
      },
      maxCount: {
        type: Number,
        default() {
          return null;
        }
      }
    },
    data() {
      let host = '';
      if (process.env.NODE_ENV == 'development') { // 本地
        host = config.host
      } else if (process.env.NODE_ENV == 'production') { // 生产环境
        host = process.env.BASE_API
      }
      return {
        headers: {
          token: getToken()
        },
        action: host + '/admin/api/sys/file/config/upload',
        fileList: [],
        treeData: [],
        fileDirectoryList: [],
        dataList: [],
        multipleSelection: [],
        singleSelection: '',
        currentTrees: [],
        currentTree: {},
        currentCode: '',
        dialogVisible: false,
        multipleSelected: [],
        singleSelected: {},
        top: {
            value: '000000',
            label: '全部',
            name: '全部',
            id: '0'
          },
        pagination: {
          page: 1,
          count: 10,
          total: 0
        }
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    watch: {
      'dialog.ruleForm2': function(data) {
        this.selectInit();
      },
      'dialog.tableType': function(type) {
        this.tableType = type;
      },
      'dialog.fileCategoryCode': {
        deep: true,
        immediate: true,
        handler(code) {
          this.getCurrentTreeId(code);
        }
      }
    },
    methods: {
      isImg(filename) {
        if (!filename) {
          return false;
        }
        if (filename.toLowerCase().lastIndexOf('.jpg') !== -1 || filename.toLowerCase().lastIndexOf('.jpeg') !== -1 || filename.toLowerCase().lastIndexOf('.png') !== -1 || filename.toLowerCase().lastIndexOf('.gif') !== -1) {
          return true;
        }
        return false;
      },
      async loadTree(node, resolve) {
        let res = await this.getTreeList(node);
        if (!res) {
          res = [];
        }
        resolve(res);
      },
      getCurrentTreeId(code) {
        if (!this.treeData || !this.treeData.length) {
          return ;
        }
        if (!code) {
          this.currentTree = this.top;
          this.currentCode = this.top.code;
          this.$refs.tree && this.$refs.tree.setCurrentKey(this.top.id);
          return ;
        }
        let treeData = this.treeData[0].children;
        for (var i = 0; i < treeData.length; i++) {
          if (treeData[i].code === code) {
            this.currentTree = treeData[i];
            this.currentCode = treeData[i].code;
            this.$refs.tree && this.$refs.tree.setCurrentKey(treeData[i].id);
            break;
          }
        }
      },
      async getTreeDataList() {
        let res = await this.getTreeList();
        if (res) {
          this.treeData = res;
        }
        return res;
      },
      async getTreeList() {
        let top = [Object.assign({}, this.top)];
        let res = await this.Api.getFileDirectoryList({});
        if (res.status === 1) {
          this.fileDirectoryList = res.data;
          top[0].children = res.data;
        }
        return top;
      },
      handleNodeClick(params, nodes) {
        this.currentTree = Object.assign({}, params);
        this.currentCode = params.code;
        this.getDataList();
      },
      handleChecked(row, type) {
         if(!this.tableType) {
          return;
         }
        if (this.tableType === 'selection') {

          let isExist = null;
          this.multipleSelected.map((item, inx) => {
            if (item.id == row.id) {
              isExist = inx;
            }
          });
          if (isExist || isExist === 0) {
            this.multipleSelected.splice(isExist, 1);
            if (type === 1) {
              this.multipleSelection.splice(isExist, 1);
            }
          } else {
            if (this.maxCount && this.multipleSelection.length >= this.maxCount) {
              if (type === 1) {
                return false;
              }
              if (this.multipleSelection.length > this.maxCount) {
                for (var i = 0; i < this.multipleSelection.length; i++) {
                  if (this.multipleSelection[i] === row.id) {
                    this.multipleSelection.splice(i, 1);
                  }
                }
              }

              return false;
            }
            this.multipleSelected.push(row);
            if (type === 1) {
              this.multipleSelection.push(row.id);
            }
          }
        } else {
          this.singleSelected = Object.assign({}, row);
          this.singleSelection = row.id;
        }
      },
      emitSave() {
        let dataList = this.dataList;
        let selection = null;
        if (this.tableType === 'selection') {
          if (!this.multipleSelection.length) {
            this.$message.error('请至少选择一条数据');
            return ;
          }
          if (this.maxCount && this.multipleSelection.length > this.maxCount) {
            this.$message.error('最多选择' + this.maxCount + '条数据');
            return ;
          }
          selection = [];
          let multil = this.multipleSelection;
          for (var i = 0; i < dataList.length; i++) {
            multil.forEach(item => {
              if (dataList[i].id === item) {
                selection.push(dataList[i]);
              }
            })
          }
          this.multipleSelected = selection;
          this.$emit("submit", this.multipleSelected, 5);
        } else if (this.tableType === 'radio') {
          if (!this.singleSelection) {
            this.$message.error('请至少选择一条数据');
            return ;
          }

          if (this.singleSelection !== this.singleSelected.id) {
            selection = {};
            let single = this.singleSelection;
            for (var i = 0; i < dataList.length; i++) {
              if (dataList[i].id === single) {
                selection = dataList[i];
                break;
              }
            }
            this.singleSelected = selection;
          }
          this.$emit("submit", this.singleSelected, 5);
        }
        this.dialog.innerVisible = false;
      },
      cancelSelect(row) {
        if (this.tableType === 'selection') {
          let data = Object.assign([], row);
          for (let i = 0; i < this.multipleSelected.length; i++) {
            for (let j = 0; j < data.length; j++) {
              if (this.multipleSelected[i].id == data[j].id) {
                this.multipleSelected.splice(i, 1);
              }
            }
          }
          for (let k = 0; k < this.multipleSelection.length; k++) {
            for (let l = 0; l < data.length; l++) {
              if (this.multipleSelection[k] == data[l].id) {
                this.multipleSelection.splice(k, 1);
              }
            }
          }
        } else {
          if (this.singleSelection === row.id) {
            this.singleSelection = '';
          }
          if (this.singleSelected.id === row.id) {
            this.singleSelected = {};
          }
        }
      },
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
      },
      async getDataList() {
        let para = {
          page: {
            pageNo: this.pagination.page,
            pageSize: this.pagination.count
          }
        }
        if (this.currentTree && this.currentTree.code) {
          para.fileCategory = {
            code: this.currentTree.code
          };
        }
        let resData = await this.Api.getResourcePage(para);
        if (resData.status === 1 && resData.data) {
          this.pagination.total = resData.data.count;
          this.dataList = resData.data.list || [];
        }
      },
      handleClose() {
        this.$refs.upload.clearFiles();
        this.$refs.upload.abort();
        this.currentCode = this.currentTree.code;
        this.dialogVisible = false;
      },
      handleCancelUpload() {
        this.$refs.upload.clearFiles();
        this.$refs.upload.abort();
        this.currentCode = this.currentTree.id === '0' ? '' : this.currentTree.code;
        this.dialogVisible = false;
      },
      handleBefore(file) {
        const typeArr = ['jpg', 'jpeg', 'gif', 'png'];
        let isType = false;
        const isLt3M = file.size / 1024 / 1024 <= 3;
        for (let i = 0; i < typeArr.length; i++) {
          if (file.type.toLowerCase().indexOf(typeArr[i]) !== -1) {
            isType = true;
            break;
          }
        }
        if (!isType) {
          this.$message.error('上传图片只能是 JPG/GIF/PNG 格式!');
        }
        if (!isLt3M) {
          this.$message.error('上传图片大小不能超过 3MB!');
        }
        return isType && isLt3M;
      },
      handleUpload() {
        if (!this.currentCode) {
          return this.$plug.prompt.failTip('请选择图片分类');
        }
        this.$refs.upload.submit();
      },
      handleSuccess() {
        this.$refs.upload && this.$refs.upload.clearFiles();
        this.$plug.prompt.saveTip('图片上传成功');
        this.dialogVisible = false;
        this.pagination.page = 1;
        this.getDataList();
      },
      handlePreview(file) {
        console.log(file);
      },
      handleError() {
        this.$plug.prompt.failTip('图片上传失败');
      },
      handleDel(d) {
        this.$plug.prompt.del(this.handleDels, d, '', '删除图片');
      },
      async handleDels(d) {
        let res = await this.Api.delResource({id: d.id})
        if (res.status === 1) {
          this.$plug.prompt.saveTip('图片删除成功');
          this.getDataList();
        }
      },
      async handleSave(row, savePrompt, type) {
        this.$refs.upload.submit();
      },
      handleCancel(isRemove) {
        this.multipleSelection = [];
        this.singleSelection = '';
        this.multipleSelected = [];
        if (isRemove === true) {
          this.pagination.page = 1;
          this.pagination.count = 10;
          this.getDataList();
        }
      },
      selectInit() {
        if (this.tableType === 'selection') {
          this.multipleSelection = [];
          this.multipleSelected = [];
          if (this.dialog.ruleForm2 && this.dialog.ruleForm2.length) {
            this.dialog.ruleForm2.map(item => {
              if (item.id) {
                this.multipleSelection.push(item.id);
                this.multipleSelected.push(item);
              }
            })
          } else {
            this.multipleSelection = [];
            this.multipleSelected = [];
          }
        } else if(this.tableType == 'radio') {
          if (this.dialog.ruleForm2 && this.dialog.ruleForm2.id) {
            this.singleSelection = this.dialog.ruleForm2.id;
            this.singleSelected = Object.assign({}, this.dialog.ruleForm2);
          } else {
            this.singleSelection = '';
            this.singleSelected = {};
          }
        }
        // this.pagination.page = 1;
        // this.pagination.count = 10;
        // this.pagination.total = 0;
        // this.getDataList();
      },
      selectClear() {
        if (this.tableType === 'selection') {
          this.multipleSelection = [];
          this.multipleSelected = [];
        } else if(this.tableType == 'radio') {
          this.singleSelection = '';
          this.singleSelected = {};
        }
      }
    },
    created() {

      // this.table.type = this.tableType;
    },
    async mounted() {
      if(this.tableType) {
        this.selectInit();
      }
      if (!this.treeConfig.lazy) {
        await this.getTreeDataList();
        this.getCurrentTreeId(this.dialog.fileCategoryCode);
        this.getDataList();
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
@import '../../styles/mixin.scss';
.upload-files{
  max-width: calc(100% - 83px);
}
.tree-category-sidebar{
  height: 100%;
  overflow: auto;
  @include scrollBar;
  margin-right: 10px;
}
.selector-img-list{
  list-style: none;
  margin: 0;
  padding: 0;
  // height: 259px;
  // border: 1px solid #ebeef5;
  border-radius: 3px;
  // overflow: hidden;
  .no-data{
    margin: 0;
    line-height: 80px;
    font-size: 14px;
    color: #ccc;
    text-align: center;
  }
  // display: flex;
  // justify-content: space-round;//水平环绕
  // align-items: center;//垂直居中
  li{
    position: relative;
    float: left;
    width: 150px;
    height: 150px;
    margin: 5px;
    border: 1px solid #ebeef5;
    // overflow: hidden;
    .el-radio,.el-checkbox{
      position: absolute;
      top: -4px;
      right: -4px;
      z-index: 1;
      .el-radio__label{
        padding-left: 0;
      }
    }
    .selector-img-title{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      padding: 0 5px;
      width: 100%;
      height:25px;
      line-height: 25px;
      text-align: center;
      color: #fff;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow:hidden;
      font-size:12px;
      background-color: rgba(0,0,0,.4);
    }
    .img-content{
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      p{
        margin: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        word-break: break-all;
        img{
          max-width: 100%;
          max-height: 100%;
        }
      }
      .operate-box{
        position: absolute;
        bottom: -25px;
        left: 0;
        width: 100%;
        background-color: rgba(0,0,0,.4);
        color: #fff;
        text-align: center;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        transition: bottom 0.4s ease-in-out;
      }
      &:hover{
        .operate-box{
          bottom: 0;
        }
      }
    }

  }
}
</style>

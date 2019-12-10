<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :pagination="pagination" :searchObj="searchObj" :tableTree="tableTree" :getDataList="getDataList" :searchBool="searchBool"
                  :dialog="dialog"
                  @add="handleAdd"></search-sub>
      <!--树列表-->
      <tree-table :data="treeTableList" :columns="columns" border v-loading="listLoading" ref="tree">
        <!--<el-table-column align="center" label="分类类型">-->
        <!--<template slot-scope="{ index,row }">-->
        <!--<el-tag :type="row.type=='1'?'primary':'success'">{{row.type=='1'?'内部':'外部'}}</el-tag>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="标签">
          <template slot-scope="{ index,row }">
            <el-tag :type="row.tagType==1||row.tagType==2||row.tagType==3?'success':''">
              {{returnTypeValue(row.tagType)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否启用" width="120">
          <template slot-scope="{ index,row }">
            <el-switch
              @change="handleShowStatusChange(index, row)"
              :active-value="0"
              :inactive-value="1"
              v-model="row.isEnable">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150"
                         class-name="small-padding fixed-width">
          <div class="custom-tree-node" slot-scope="props">
            <el-button type="text"
                       size="mini"
                       @click.stop="() => append(props.row)">创建子类目
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click.stop="() => update(props.row)">编辑
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click.stop="() => remove(props.row)">删除
            </el-button>
          </div>
        </el-table-column>
      </tree-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="dialog.ruleForm2.name" :readonly="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="分类编码" prop="code">
            <el-input v-model="dialog.ruleForm2.code" :readonly="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sortNo">
            <el-input v-model.number="dialog.ruleForm2.sortNo" :readonly="dialog.readBool"></el-input>
          </el-form-item>
          <el-form-item label="关联">
            <el-radio-group size="mini" v-model="associated">
              <el-radio border :label="0">关联类目</el-radio>
              <el-radio border :label="1">关联品牌</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联内部类目" v-if="associated==0">
            <Popover ref="popover" :treeDataList="treeDataList" :popoverData="popoverData"></Popover>
          </el-form-item>
          <el-form-item label="关联品牌" prop="tagType" v-if="associated==1">
            <el-select v-model="dialog.ruleForm2.brand.id" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in brandDataList"
                :key="item.value"
                :label="item.label"
                :disabled="dialog.readBool"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标" prop="icoUrl">
            <el-upload class="avatar-uploader" :action="apiUrl" list-type="picture-card" :show-file-list="false"
                       accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl" :before-upload="beforeAvatarUpload">
              <img v-if="dialog.ruleForm2.icoUrl" :src="dialog.ruleForm2.icoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!--<el-input v-model="dialog.ruleForm2.icoUrl" :readonly="dialog.readBool"></el-input>-->
          </el-form-item>
          <el-form-item label="标签" prop="tagType">
            <el-select v-model="dialog.ruleForm2.tagType" clearable placeholder="请选择">
              <el-option
                v-for="item in platformName"
                :key="item.value"
                :label="item.label"
                :disabled="dialog.readBool"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-radio-group size="mini" v-model="dialog.ruleForm2.isEnable">
              <el-radio border :label="0">启用</el-radio>
              <el-radio border :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-radio-group size="mini" v-model="dialog.ruleForm2.isTop">
              <el-radio border :label="1">是</el-radio>
              <el-radio border :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import treeTable from '@/components/TreeTable'
  import Popover from '@/components/Popover'
  import SearchSub from '@/components/SearchSub'
  import DialogSub from '@/components/DialogSub'
  import config from '@/utils/config'
  import {arrItemSort} from '@/utils'

  const platformName = [
    {value: 1, label: "活动"},
    {value: 2, label: "促销"},
    {value: 3, label: "热卖"}
  ];

  // arr to obj
  const platformNameKeyValue = platformName.reduce((acc, cur) => {
    acc[cur.value] = cur.label;
    return acc;
  }, {});
  export default {
    data() {
      return {
        apiUrl: config.host + '/admin/api/sys/fileconfig/upload',
        searchBool: false,
        brandDataList: [],
        associated: 0,
        platformName,
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          placeholder: '按分类名称、编码模糊查询',
          isText: true
        }, {
          value: 'time1',
          label: '',
          name: '开始时间',
          isDate: true
        }, {
          value: 'time2',
          label: '',
          name: '结束时间',
          isDate: true
        }],
        // 树表格
        tableTree: true,
        columns: [
          {
            label: '分类名称',
            value: 'name',
            width: 200
          }, {
            label: '分类编码',
            value: 'code'
          }, {
            label: '图标',
            value: 'icoUrl',
            isShow: true
          }, {
            label: '排序',
            value: 'sortNo'
          }
        ],
        listLoading: false,
        optionsStaff: [],
        staffObj: {},
        pagination: {
          page: 1,
          count: 10,
          total: 0
        },

        dialog: {
          titleText: '创建分类',
          btnText: '创建分类',
          titleText: '创建分类',
          width: '750px',
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          ruleForm2: {
            name: '',	// 是	string	名称	是
            code: '',	// 是	string	编码	否
            icoUrl: '',	// 否	string	图标	是
            // type: '1',	// 是	string	分类类型（1 内部 2 外部）	否
            tagType: null,	// 否	int	标签(0无 1 活动 2 促销 3 热卖)	是
            parentId: null,	// 否	string	父级分类	否
            sortNo: null, // 排序
            isEnable: 0, // 否	int	是否禁用（否0，是1）（默认否）	是
            isTop: 0, // 是否推荐到品牌商城首页
            brand: {id: ''},
            goodsCategoryInsides: [{id: ''}] // 内部分类
          }
        },
        popoverData: {
          btnText: '内部分类'
        },
        treeDataList: [],
        treeTableList: [],
      }
    },
    components: {
      treeTable,
      SearchSub,
      DialogSub,
      Popover
    },
    methods: {
      async getDataList() { // 获取列表
        try {
          this.listLoading = true;
          let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);
          let para = {
            // page: {
            //   pageNo: this.pagination.page,
            //   pageSize: this.pagination.count
            // },
            searchParameter: queryPo
          }
          let resData = await this.Api.getGoodsClassificationLists(para);
          this.treeTableList = this.$plug.recursion.treeData(resData.data, 'parentId', ['', null], 'id', 'name');
          // this.treeTableList = arrItemSort(this.treeTableList, 'sortNo', 1);
          this.listLoading = false;
          return resData
        } catch (error) {
          console.log(error);
        }
      },
      // 显示新增界面
      handleAdd() {
        this.dialog.titleText = '创建外部分类';
        this.dialog.saveFormVisible = true;
        this.$nextTick(() => {
          this.$refs.popover.$refs.tree.setCheckedKeys([]);
        }) // 清空tree
      },
      append(row) {
        this.dialog.titleText = '创建子分类';
        this.dialog.saveFormVisible = true;
        this.dialog.ruleForm2.parentId = row.id;
        this.$nextTick(() => {
          this.$refs.popover.$refs.tree.setCheckedKeys([]);
        }) // 清空tree
      },
      async update(row) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;

        let res = await this.Api.findGoodsClassifications({
          id: row.id
        });
        let data = res.data ? res.data.goodsCategoryInsides : [];
        let idArr = [];
        data.forEach((item) => {
          idArr.push(item.id);
        })
        this.$nextTick(function () {
          this.$refs.popover.$refs.tree.setCheckedKeys(idArr);
        })
        row.brand = res.data.brand;
        if (row.brand == null) {
          row.brand = {id: ''}
        }
        this.dialog.ruleForm2 = Object.assign({}, row);
        if (this.dialog.ruleForm2 && this.dialog.ruleForm2.parent || this.dialog.ruleForm2 && this.dialog.ruleForm2.children) {
          delete this.dialog.ruleForm2.parent
          delete this.dialog.ruleForm2.children
        }
      },
      async handleSave(row, savePrompt) {
        let checkAllData = this.$refs.popover.$refs.tree.getCheckedNodes();
        // let checkHalfData = this.$refs.popover.$refs.tree.getHalfCheckedNodes();
        // let data = checkAllData.concat(checkHalfData);
        let data = checkAllData;
        let idArr = [];
        if (data && data.length) {
          data.forEach((item) => {
            idArr.push({id: item.id});
          })
        }
        row.goodsCategoryInsides = idArr
        if (row.goodsCategoryInsides.length && row.brand.id) {
          this.$message.warning("请不要同时选择内部分类和品牌!");
          return
        }
        if (!row.id) {
          savePrompt(this.Api.saveGoodsClassifications, row);
        } else {
          savePrompt(this.Api.saveGoodsClassifications, row);
        }
      },
      // 商品的主图和画册图片
      uploadPicUrl(response) {
        console.log(response)
        this.dialog.ruleForm2.icoUrl = response.fileUrl
      },
      beforeAvatarUpload(file) {
        const isRightType = file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isRightType) {
          this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isRightType && isLt2M;
      },
      remove(data) {
        this.$plug.prompt.del(this.handleDel, data);
      },
      async handleDel(row) { // 删除
        await this.Api.delGoodsClassifications({
          'id': row.id
        });
        this.getDataList();
      },
      handleShowStatusChange(index, row) {
        let para = {
          id: row.id
        }
        this.Api.isEnableGoodsClassifications(para).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          }else{
            if(row.isEnable == 0){
              row.isEnable=1;
            }else{
              row.isEnable=0;
            }
          }
        });
      },
      handleProperty(row) {
        this.$router.push({path: '/goods/goodsAttribute', query: {id: row.id}});
      },
      returnTypeValue(type) {
        switch (type) {
          case 1:
            return '活动';
          case 2:
            return '促销';
          case 3:
            return '热卖';
          default:
            return '无'
        }
      }
    },
    async mounted() {
      this.getDataList();
      let res = await this.Api.getGoodsClassificationList({});
      this.treeDataList = this.$plug.recursion.treeData(res.data, 'parentId', ['', null], 'id', 'name');
      let resBrand = await this.Api.getGoodsBrand({});
      this.brandDataList = this.$plug.public.transformList(resBrand.data, 'id', 'name');

    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .box-card {
    padding-top: 20px;
    margin-bottom: 20px;
  }
</style>

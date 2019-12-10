<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--搜索-->
      <search-sub :timeRangeVal="['time1']" :quickSearch="quickSearch" :searchObj="searchObj" :isSidebar="true" :getDataList="getDataList" :searchBool="searchBool" :dialog="dialog" :pagination="pagination"
                  @add="handleAdd">
        <!--<template slot="arrDel">-->
        <!--<el-button size="mini" icon="el-icon-delete" type="danger" @click="arrDel">批量删除-->
        <!--</el-button>-->
        <!--</template>-->
      </search-sub>
      <!--表格-->
      <tree-sidebar-table ref="tableSub" @submit="handleSave" @arrDel="handleDelArr" @del="handleDel"
                 @edit="handleEdit"
                 :getTreeList="getTreeList"
                 :treeConfig="treeList"
                 :getDataList="getDataList" :table="table" :pagination="pagination">
        <template slot="isEnable" slot-scope="{ index,row }">
          <el-switch
            @change="handleShowStatusChange(index, row)"
            :active-value="0"
            :inactive-value="1"
            v-model="row.isEnable">
          </el-switch>
        </template>
        <template slot="createTime" slot-scope="{ index,row }">
          <span>{{format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")}}</span>
        </template>
        <template slot="isEntry" slot-scope="{ index,row }">
          <el-tag :type="row.isEntry==1?'danger':'success'">{{row.isEntry==1?'离职':'在职'}}
          </el-tag :type="row.isEntry == 1 ? 'danger' : 'success'">
        </template>
        <template slot="table" slot-scope="{index, row}">
          <el-button type="text" @click.stop="showGeneratePassword(row)">重置密码</el-button>
        </template>
      </tree-sidebar-table>
      <!--dialog弹窗-->
      <dialog-sub :dialog="dialog" :getDataList="getDataList" @submit="handleSave">
        <template slot="dialog">
          <tr>
            <td><i class="red-star" data-message="请输入用户名" data-name="username">*</i>用户名:</td>
            <td>
              <el-input v-model="dialog.ruleForm2.username"
                        :disabled="!!dialog.ruleForm2.id"></el-input>
            </td>
            <td>用户编号:</td>
            <td>
              <el-input v-model="dialog.ruleForm2.code" :disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入昵称" data-name="nickname">*</i>昵称:</td>
            <td>
              <el-input v-model="dialog.ruleForm2.nickname" :disabled="dialog.readBool"></el-input>
            </td>
            <td><i class="red-star" data-message="请输入姓名" data-name="name">*</i>姓名:</td>
            <td>
              <el-input v-model="dialog.ruleForm2.name" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请输入密码" data-name="password" v-if="!dialog.ruleForm2.id || resetPassword">*</i>密码:</td>
            <td>
              <template v-if="!dialog.ruleForm2.id || resetPassword">
                <el-input ref="inputPassword" v-model="dialog.ruleForm2.password" :disabled="dialog.readBool"></el-input>
                <span><el-button type="text" @click="generatePassword">生成密码</el-button></span>
              </template>
            </td>
            <td><i class="red-star" data-message="请选择角色" data-name="roles">*</i>角色:</td>
            <td>
              <el-select v-model="dialog.ruleForm2.roles" multiple placeholder="请选择">
                <el-option v-for="item in optionsRole" :key="item.value" :label="item.label" :value="item.value"
                           :disabled="dialog.readBool || item.isEnable === 1 || item.isSys == 1">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择部门" data-name="deps">*</i>部门:</td>
            <td>
              <el-select v-model="dialog.ruleForm2.deps" multiple placeholder="请选择" :disabled="dialog.readBool">
                <el-option v-for="item in optionsDep" :key="item.value" :label="item.label" :value="item.value" :disabled="item.isEnable === 1" ></el-option>
              </el-select>
            </td>
            <td><i class="red-star" data-message="请输入手机号码" data-name="phone">*</i>手机号码:</td>
            <td>
              <el-input v-model="dialog.ruleForm2.phone" :maxlength="11" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td><i class="red-star" data-message="请选择生效时间" data-name="activeTime">*</i>生效时间:</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.activeTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择时间">
              </el-date-picker>
            </td>
            <td><i class="red-star" data-message="请输入电子邮件" data-name="deps">*</i>电子邮件:</td>
            <td>
              <el-input v-model="dialog.ruleForm2.email" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
          <tr>
            <td>失效时间:</td>
            <td>
              <el-date-picker
                v-model="dialog.ruleForm2.invalidTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </td>
            <td>性别:</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.sex">
                <el-radio border :label="1">男</el-radio>
                <el-radio border :label="2">女</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>是否离职:</td>
            <td>
              <el-radio-group size="mini" v-model="dialog.ruleForm2.isEntry">
                <el-radio border :label="0">在职</el-radio>
                <el-radio border :label="1">离职</el-radio>
              </el-radio-group>
            </td>
            <td>是否启用:</td>
            <td>
              <el-radio-group v-model="dialog.ruleForm2.isEnable">
                <el-radio border :label="0">启用</el-radio>
                <el-radio border :label="1">禁用</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>联系地址:</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.address" :disabled="dialog.readBool"></el-input>
            </td>
            <td>备注:</td>
            <td>
              <el-input type="textarea" v-model="dialog.ruleForm2.remarks" :disabled="dialog.readBool"></el-input>
            </td>
          </tr>
        </template>
      </dialog-sub>
    </div>
  </div>
</template>
<script>
  import TreeSidebarTable from '@/components/TreeSidebarTable'
  import DialogSub from '@/components/DialogSub'
  import SearchSub from '@/components/SearchSub'
  import {format, randomPassword} from "../../utils";

  export default {
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).test(this.loginForm.username)) {
          callback(new Error('请输入正确的手机号!'))
        } else {
          callback()
        }
      }
      var validPassword = (rule, value, callback) => {
        this.$plug.valid.ispassword(rule, value, callback, {
          min: 6,
          max: 16
        });
      };
      return {
        searchBool: false,
        quickSearch: {
          isShow: true,
          isTimeRange: true,
          group: [{
            value: 'isEnable',
            label: '',
            selected: '',
            list: [{
              label: '启用',
              value: 0
            }, {
              label: '停用',
              value: 1
            }]
          }, {
            value: 'isEntry',
            label: '',
            selected: '',
            list: [{
              value: 0,
              label: '在职'
            }, {
              value: 1,
              label: '离职'
            }]
          }]
        },
        searchObj: [{
          value: 'keyWord',
          label: '',
          name: '关键字',
          isText: true,
          placeholder: '账号、编码、姓名'
        }, {
          isTimeRange: true,
          value: 'time1',
          label: '',
          name: '创建时间段'
        }],
        optionsRole: [],
        optionsDep: [],
        resetPassword: false,
        treeList: {
          expandedKeys: ['000000'],
          currentKey: '000000'
        },
        table: {
          width: '150px',
          arrBool: true,
          tableDataList: [],
          emitEditBool: true,
          // type: 'selection',
          columns: [{
            value: 'code',
            label: '编码',
            width: '100'
          }, {
            value: 'username',
            label: '用户名',
            width: '100'
          }, {
            value: 'name',
            label: '姓名',
            width: '100'
          }, {
            value: 'isEnable',
            label: '是否启用',
            width: '120',
            slotBool: true
          }, {
            value: 'isEntry',
            label: '是否在职',
            slotBool: true,
            width: '100'
          }, {
            value: 'nickname',
            label: '昵称',
            width: '100'
          }, {
            value: 'phone',
            label: '手机号码',
            width: '100'
          }, {
            value: 'createTime',
            label: '创建时间',
            width: '140'
          }, {
            value: 'remarks',
            label: '备注',
            width: '100'
          }]
        },

        pagination: {
          page: 1,
          count: 10,
          total: 0
        },
        imgSizeArr: [[250, 250]],

        dialog: {
          btnText: '创建员工',
          titleText: '创建员工',
          width: '800px',
          isTable: true,
          saveLoading: false,
          saveFormVisible: false,
          pavalBool: true,
          tableBool: true,
          ruleForm2: {
            // code: '',	        // 是	string	用户名
            username: '',	    // 是	string	用户名
            nickname: '',    // 是	string	花名
            password: '',    // 是	string	密码
            name: '',     // 是	string	姓名
            email: '',      // 是	string	邮箱
            phone: '',     // 是	string	联系电话
            isEntry: 0,    // 是	int	是否离职
            isEnable: 0,    // 是	int	是否禁用
            remarks: '',    // 否	string	备注
            roles: [],       // 是	list	角色Id
            deps: [],       // 是	list	部门Id
            activeTime: '',	//是	Date	生效时间
            invalidTime: ''	//是	Date	失效时间
          },
          rules2: {
            username: this.$plug.valid.isNull(),
            name: this.$plug.valid.isNull(),
            // code: this.$plug.valid.isNull(),
            nickname: this.$plug.valid.isNull(),
            password: this.$plug.valid.isNull(),
            email: this.$plug.valid.isNull(),
            phone: this.$plug.valid.isNull(),
            roles: this.$plug.valid.isNull(),
            deps: this.$plug.valid.isNull(),
            activeTime: this.$plug.valid.isNull(),
            // invalidTime: this.$plug.valid.isNull()
          }
        }
      }
    },
    methods: {
      async getTreeList() {
        let top = [{
            value: '000000',
            label: '全部',
            id: '000000'
          }];
        let res = await this.Api.getDepartment({});
        if (res.status === 1) {
          top[0].children = this.$plug.recursion.treeData(res.data, 'parentId', [null, ''], 'id', 'name');;
        }
        return top;
      },
      // 获取列表
      async getDataList(params) {
        let queryPo = this.$plug.public.transformSearchData.call(this, this.searchObj);

        let searchParameter = {keyWord: queryPo.keyWord};

        if (queryPo && queryPo.time1 && queryPo.time1.length) {
          searchParameter.starTime = queryPo.time1[0];
          searchParameter.endTime = queryPo.time1[1];
          delete queryPo.time1;
        }
        let quick = {};
        if (this.quickSearch && this.quickSearch.group) {
          this.quickSearch.group.map(item => {
            if (item.selected || item.selected === 0) {
              quick[item.value] = item.selected;
            }
          })
        }
        let para = Object.assign({}, queryPo, quick, {
          pageNo: this.pagination.page,
          pageSize: this.pagination.count,
          searchParameter
        })
        if (params && params.id && params.id !== '000000') {
          para.depsId = params.id
        }
        let resData = await this.Api.getStaffList(para);
        if (resData.data && resData.data.list) {
          resData.data.list.map(item => {
            if (item.roles == null || tem.deps == null) {
              item.roles = [];
              item.deps = [];
            }
          })
        }
        return resData;
      },
      handleAdd() { //显示新增界面
        this.dialog.titleText = '创建员工';
      },
      async handleEdit(row) {
        this.dialog.titleText = '编辑';
        this.dialog.saveFormVisible = true;
        let {data} = await this.Api.findDep({
          id: row.id
        });
        row.roles = []
        row.deps = []

        data.roles.forEach((item) => {
          row.roles.push(item.id);
        })
        data.deps.forEach((item) => {
          row.deps.push(item.id);
        })
        this.dialog.ruleForm2 = Object.assign({}, row);
      },
      async handleSave(row, savePrompt) {
        let rolesArr = []
        let depsArr = []
        let params = Object.assign({}, row);
        if (params.roles && params.deps) {
          params.roles.map((item, index) => {
            rolesArr.push({id: item})
          });
          params.deps.map((item, index) => {
            depsArr.push({id: item})
          });
        }
        params.roles = rolesArr;
        params.deps = depsArr;
        if (!params.id) {
          savePrompt(this.Api.saveStaff, params);
        } else {
          if (!this.resetPassword) {
            delete row.password;
          }
          this.resetPassword = false;
          savePrompt(this.Api.saveStaff, params);
        }
      },
      // 批量删除
      arrDel() {
        this.$refs.tableSub.handleBatchOperate() //调用子组件方法
      },
      async handleDelArr(row, delPrompt) {
        delPrompt(this.Api.deleteArrStaff, row);
      },

      async handleDel(row, delPrompt) { // 删除
        delPrompt(this.Api.deleteStaff, {
          id: row.id
        });
      },
      handleShowStatusChange(index, row) {
        row.isEnable = row.isEnable === 1 ? 0 : 1;
        this.$plug.prompt.del(() => {
          this.Api.isEmployeeEnable({
            id: row.id
          }).then(res => {
            if (res.status == 1) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
              row.isEnable = row.isEnable === 1 ? 0 : 1;
            }
          });
        }, row, null, row.isEnable === 1 ? '启用该数据' : '禁用该数据');
      },
      showGeneratePassword(row) {
        this.$plug.prompt.del(this.sureGeneratePwd, row, null, '重置密码');
      },
      sureGeneratePwd(row) {
        let password = randomPassword(true, 6, 6, true)
        this.Api.resetPwd({
          id: row.id,
          password
        }).then(res => {
          if (res.status === 1) {
            this.$alert('新密码：' + password, '密码重置成功', {
              confirmButtonText: '确定'
            });
          } else {
            this.$plug.prompt.failTip('密码重置失败');
          }
        });


      },
      // 生成密码
      generatePassword(row) {
        this.$nextTick(function () {
          //DOM 更新了
          this.$refs.inputPassword.focus()
        })
        this.dialog.ruleForm2.password = randomPassword(true, 6, 6, true)
      }
    },
    async created() {
      let resRole = await this.Api.getRole({});
      this.optionsRole = this.$plug.public.transformList(resRole.data, 'id', 'name');
      let resDep = await this.Api.depList({});
      this.optionsDep = this.$plug.public.transformList(resDep.data, 'id', 'name');
    },
    components: {
      TreeSidebarTable,
      DialogSub,
      SearchSub
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
.form-table{
  td{
    &:nth-child(odd){
      width: 110px;
    }
  }
}
</style>

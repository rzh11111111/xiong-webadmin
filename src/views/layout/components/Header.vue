<template>
  <div>
    <el-dialog title="修改密码" :visible.sync="dialog.editPaw.show" :modal-append-to-body="false"
               custom-class="editPawDialog">
      <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px">
        <el-form-item label="旧密码" prop="oldPaw">
          <el-input type="password" v-model="editPaw.oldPaw"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPaw">
          <el-input type="password" v-model="editPaw.newPaw"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPaw">
          <el-input type="password" v-model="editPaw.confirmNewPaw"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click.native="dialog.editPaw.show = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="editPawSubmit">保存</el-button>
      </div>
    </el-dialog>
    <div class="navbar" mode="horizontal" :style="{'background-color': theme.color}">
      <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
      <div class="title"><img src="../../../assets/images/logo.png" alt="">省钱熊后台管理</div>
      <div class="right-menu">
      <el-menu
        :default-active="activeIndex"
        class="right-menu"
        mode="horizontal"
        :background-color="theme.color"
        text-color="#fff"
        :unique-opened="true"
        :collapse-transition="false"
        active-text-color="#fff">
        <!-- <el-submenu index="1">
          <template slot="title">
            <img class="user-avatar" :src="touxiang">
            {{name}}
          </template>
          <el-menu-item index="1-2" @click.native="userOperation">修改密码</el-menu-item>
        </el-submenu> -->
        <el-menu-item index="1">
          <el-popover
            placement="bottom"
            width="420"
            trigger="hover">
          <!-- <el-menu-item index="1-2" @click.native="userOperation">修改密码</el-menu-item> -->
          <div class="header-account-box">
            <dl>
              <dt>
                <span>账户信息</span>
                <el-button type="text" @click.native="userOperation">账户设置</el-button>
              </dt>
              <dd>
                所在部门：<span>{{getDeps(deps)}}</span>
              </dd>
              <dd>
                本次登录：<span>{{loginTime}}</span>
              </dd>
              <dd>
                本次登录IP：<span>{{loginIp}}</span>
              </dd>
            </dl>
          </div>
          <div slot="reference">
            <img class="user-avatar" :src="touxiang">
            {{username}}
          </div>
          </el-popover>
        </el-menu-item>
        <router-link to="/dashboard">
          <el-menu-item index="2">
            <svg-icon iconClass="home"></svg-icon>
          </el-menu-item>
        </router-link>
       <!--  <el-menu-item index="4">
          <el-popover
            placement="bottom"
            width="420"
            trigger="hover">
            <div class="header-notice-box">
              <dl>
                <dt>系统提醒</dt>
                <dd>
                  <p>生产企业资金账户预警</p>
                  <span>(<em>10</em>)</span>
                </dd>
                <dd>
                  <p>同城企业资金账户预警</p>
                  <span>(<em>10</em>)</span>
                </dd>
                <dd>
                  <p>商品审核</p>
                  <span>(<em>10</em>)</span>
                </dd>
              </dl>
            </div>
            <el-badge :value="12" :max="99" class="badge-item" slot="reference">
              <svg-icon iconClass="msg"></svg-icon>
            </el-badge>
          </el-popover>
        </el-menu-item> -->
        <!-- <el-menu-item index="5">
          <el-popover
            placement="bottom"
            width="420"
            trigger="hover">
            <colorPicker size="mini"></colorPicker>
            <div slot="reference">
              <svg-icon iconClass="draw" ></svg-icon>
            </div>
          </el-popover>
        </el-menu-item> -->
        <el-menu-item index="6" @click.native="logout">
          <svg-icon iconClass="logout"></svg-icon>
        </el-menu-item>
      </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import Screenfull from '@/components/Screenfull'
  import colorPicker from '../../../components/colorPicker/colorPicker'

  import md5 from 'js-md5';

  export default {
    data() {
      return {
        activeIndex: '',
        screenfull: '全屏',
        touxiang: require('../../../assets/images/touxiang.png'),
        dialog: {
          editPaw: {
            show: false
          }
        },
        editPaw: {
          oldPaw: '',
          newPaw: '',
          confirmNewPaw: ''
        },
        editPawRules: {
          oldPaw: [
            {required: true, message: '请输入旧密码', trigger: 'blur'}
          ],
          newPaw: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
            {
              // eslint-disable-next-line
              validator(rule, value, callback, source, options) {
                var errors = [];
                if (!/^[a-z0-9]+$/.test(value)) {
                  errors.push("请输入字母或特殊字符")
                }
                callback(errors);
              }
            }
          ],
          confirmNewPaw: [
            {required: true, message: '请再次输入新密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
            {
              // eslint-disable-next-line
              validator(rule, value, callback, source, options) {
                var errors = [];
                if (!/^[a-z0-9]+$/.test(value)) {
                  errors.push("请输入字母或特殊字符")
                }
                callback(errors);
              }
            }
          ]
        }
      }
    },
    components: {
      Breadcrumb,
      Hamburger,
      Screenfull,
      colorPicker
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'username',
        'avatar',
        'roles',
        'userId',
        'theme',
        'loginTime',
        'loginIp',
        'deps'
      ])
    },
    methods: {
      getDeps(deps) {
        let str = '';
        deps.map(item => {
          if (!item.parentId) {
            str += this.depsChildren(item.id, item.name) + ' 、 ';
          }
        })
        return str.slice(0, str.length - 2);
      },
      depsChildren(parentId, parentName) {
        let str = [];
        this.deps.map(item => {
          if (item.parentId === parentId) {
            str.push(this.depsChildren(item.id, parentName + ' > ' + item.name));
          }
        });
        if (!str.length) {
         return parentName;
        }
        return str.join(' 、 ');
      },
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        // this.$store.dispatch('LogOut').then(() => {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象以避免错误。
        })
      },
      userOperation() {
        this.dialog.editPaw.show = true;
      },
      editPawSubmit() {
        this.$refs.editPaw.validate((valid) => {
          if (valid) {
            let para = {
              id: this.userId,
              oldPassword: this.editPaw.oldPaw,
              newPassword: this.editPaw.newPaw,
              enterPassword: this.editPaw.confirmNewPaw
            }
            this.Api.updatePassword(para).then(res => {
              if (res.status == 1) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.dialog.editPaw.show = false;
                this.$confirm('修改密码后需重新登录, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  showClose: false,
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('FedLogOut').then(() => {
                    location.reload()// 为了重新实例化vue-router对象以避免错误。
                  })
                }).catch((err) => {
                  console.log(err)
                });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../styles/variables.scss";

  .right-menu {
    &.el-menu--horizontal {
      .el-menu-item {
        height: 50px;
        line-height: 50px;
        padding: 0 18px !important;
        // border-bottom-width: 0 !important;
      }
      & > .el-submenu {
        .el-submenu__title {
          // border-bottom-width: 0;
          height: 50px !important;
          line-height: 50px !important;
          .el-submenu {
            // border-width: 0 !important;
            color: #fff !important;
            [class^=el-icon-] {
              font-size: 18px;
              margin-right: 0;
            }
          }
        }
      }
      .svg-icon{
        font-size: 18px;
      }
    }
    & > li, & > a > li {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        top: 14px;
        right: 0;
        width: 1px;
        height: 21px;
        background-color: rgba(0, 0, 0, 0.2);
      }
      &.el-menu-item, .el-menu-item {
        [class^=el-icon-] {
          font-size: 20px;
          margin-right: 0;
          cursor: pointer;
        }
      }
    }
    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }

  .navbar {
    color: #fff;
    border-bottom: 1px solid #dfdfdf;
    background-color: $mainColor;
    .title {
      float: left;
      padding: 0 10px;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      display: flex;
      align-items: center;
      img {
        width: 38px;
        height: 38px;
        margin-right: 15px;
      }
    }

    .hamburger-container {
      float: left;
      padding: 0 10px;
      height: 50px;
      line-height: 57px;
      color: #fff;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      height: 100%;
      display: flex;
      flex: 1;
      justify-content: flex-end;
      align-items: center;
      border-bottom-width: 0;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        margin-right: 30px;
        color: #fff;
        .avatar-wrapper {
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          .username {
            padding-right: 15px;
          }

          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 18px;
            font-size: 12px;
          }
        }
      }
      .el-menu-item {
        &.is-active {
          border-bottom-width: 0;
        }
        &:hover {
          background-color: $mainColor;
        }
        .el-submenu__title {
          &:hover {
            background-color: $mainColor;
          }
        }
      }
    }
  }

  .text-r {
    text-align: right;
  }
  .header-notice-box{
    dl{
      font-size: 12px;
      line-height: 1.5;
      dt{
        padding: 0 10px 10px;
        margin: 0;
        border-bottom: 1px solid #eee;
      }
      dd{
        display: flex;
        padding: 10px 10px 10px;
        margin: 0;
        border-bottom: 1px solid #f2f2f2;
        p{
          flex: 1;
          margin: 0;
        }
        span{
          display: block;
          em{
            font-style: normal;
            color: $red;
          }
        }
      }
    }
  }
  .header-account-box{
    dl{
      font-size: 12px;
      line-height: 1.5;
      dt{
        display: flex;
        padding: 0 10px 10px;
        margin: 0 0 15px;
        border-bottom: 1px solid #eee;
        span{
          display: block;
          flex: 1;
        }
        .el-button{
          padding: 0;
        }
      }
      dd{
        display: flex;
        padding: 10px;
        margin: 0;
        p{
          flex: 1;
          margin: 0;
        }
        span{
          color: #666;
          display: inline-block;
          max-width: 314px;
        }
      }
    }
  }
</style>

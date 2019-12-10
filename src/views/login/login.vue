<template>
  <div class="login-container">
    <div class="login-video"></div>
    <div class="login-box">
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
               label-position="left">
        <div class="title-container">
          <img src="../../assets/images/logo.png" alt="">
          <h3 class="title">省钱熊后台管理系统</h3>
        </div>
        <el-form-item prop="username">

          <el-input name="username" clearable type="text" v-model="loginForm.username" autoComplete="on"
                    placeholder="请输入用户名">
            <span slot="prefix" class="svg-container svg-container_login">
              <svg-icon icon-class="user"/>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">

          <el-input name="password" clearable :type="passwordType" @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on" placeholder="请输入密码">
            <span slot="prefix" class="svg-container">
              <svg-icon icon-class="password"/>
            </span>
          </el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
        </el-form-item>
        <!--<el-form-item prop="messageCode">-->
        <!--<span class="svg-container">-->
        <!--<svg-icon icon-class="authcode"/>-->
        <!--</span>-->
        <!--<el-input type="text" v-model="loginForm.messageCode" placeholder="验证码"></el-input>-->
        <!--<count-down ref="childRevampSms" :username=loginForm.username></count-down>-->
        <!--</el-form-item>-->
        <el-button size="small" type="primary" class="btn-login" :loading="loading"
                   @click.native.prevent="handleLogin">登录
        </el-button>
      </el-form>
    </div>
    <el-footer class="footer-box">浙江钱兔网络科技有限公司 © 2018</el-footer>
  </div>
</template>

<script>
  import {checkBe} from "../../utils";
  import countDown from '@/components/common/countDown'
  import md5 from 'js-md5'
  import {getToken, setToken, removeToken} from '@/utils/auth'

  export default {
    components: {
      countDown
    },
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).test(this.loginForm.username)) {
          callback(new Error('请输入正确的手机号!'))
        } else {
          callback()
        }
        let obj = this.loginForm.username
        if (typeof obj == "undefined" || obj == null || obj == "") {
          callback(new Error('请输入正确的账号!'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能低于6位!'))
        // } else if(/\W|_/g.test(value) || !(/\d+/g).test(value) || !(/[a-zA-Z]+/g).test(value)) {
        //   callback(new Error('密码格式不正确'));
        } else {
          callback()
        }
      }

      const validateMessageCode = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入验证码!'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: '',
          messageCode: ''
        },
        loginRules: {
          // username: [{
          //   required: true,
          //   trigger: 'blur',
          //   validator: validateUsername
          // }],
          // password: [{
          //   required: true,
          //   trigger: 'blur',
          //   validator: validatePassword
          // }],
          // messageCode: [{
          //   required: true,
          //   trigger: 'blur',
          //   validator: validateMessageCode
          // }]
        },
        passwordType: 'password',
        loading: false,
      }
    },
    mounted() {

    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            // let ip = returnCitySN["cip"]
            let para = {
              username: this.loginForm.username,
              password: this.loginForm.password,
              // ip: ip,
            }
            // 待删除
            // this.loading = false
            // let tokenID = '15267013756';
            // this.session.$setSessionStorageByName('tokenID', tokenID)
            // this.$store.commit('SET_TOKEN', tokenID)
            // setToken(tokenID)
            // this.$router.push({
            //   path: '/'
            // })
            // 待删除

            this.$store.dispatch('LoginByUsername', para).then((res) => {
              this.loading = false
              this.$router.push({
                path: '/'
              })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
    },
  }
</script>

<style type="text/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #666666;
  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      span.el-input__prefix{
        left: 12px;
        padding-top: 7px;
      }
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        color: $light_gray;
        height: 47px;
        max-width: 100%;
        padding-right: 52px;
        padding-left: 35px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style type="text/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  $btn_bj: #02365c;
  $btn_hover: #0e3a88;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    .login-video {
      object-fit: cover;
      margin: auto;
      position: absolute;
      z-index: -1;
      top: 50%;
      left: 50%;
      background: url("../../assets/images/login-bj.png") no-repeat center;
      background-size: cover;
      transform: translate(-50%, -50%);
      visibility: visible;
      width: 100%;
      height: 100%;
    }
    .login-box {
      padding: 0;
      /*background: rgba(0, 0, 0, 0.55);*/
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      .login-form {
        min-width: 500px;
        min-height: 500px;
        padding: 25px 80px;
        margin: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: #ffffff;
        transform: translate(-50%, -50%);
        border-radius: 15px;
        -moz-box-shadow: 1px 1px 10px #333333;
        -webkit-box-shadow: 1px 1px 10px #333333;
        box-shadow: 1px 1px 10px #333333;
        .btn-login {
          display: block;
          width: 100%;
          height: 47px;
          line-height: 47px;
          margin-top: 25px;
          padding: 0;
          background: $btn_bj;
          border: none;
          border-radius: 4px;
          color: #fff !important;
          font-size: 18px;
          text-align: center;
          cursor: pointer;
          &:hover {
            background: darken($btn_hover, 2%);
          }
        }
      }
    }

    // .svg-container {
    //   padding: 6px 5px 6px 15px;
    //   color: $dark_gray;
    //   vertical-align: middle;
    //   width: 30px;
    //   display: inline-block;
    // }
    .title-container {
      position: relative;
      img {
        width: 100px;
        height: 100px;
        display: block;
        margin: 0 auto;
        border-radius: 10px;
      }
      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 20px auto 40px auto;
        text-align: center;
        color: #333333;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 30px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }

  .short {
    text-align: right;
    .short-btn {
      border: 1px solid #666;
      border-radius: 6px;
      outline: none;
      color: #ffffff;
      padding: 10px;
    }
  }

  .footer-box {
    text-align: center;
    font-size: 13px;
    position: fixed;
    line-height: 60px;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>

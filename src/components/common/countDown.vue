<template>
  <!-- 倒计时组件 -->
  <div class="count-down-wraper" ref="smsName">
    <input type="button" v-if="!disable" v-model="btnName" class="get-code get-code-off" v-on:click="getCode"/>
    <input type="button" v-if="disable" v-model="btnName" class="get-code get-code-on" disabled/>
  </div>
</template>
<script>
  import {checkBe} from "../../utils";

  export default {
    props: {
      username: {
        type: String
      },
    },
    data() {
      return {
        btnName: '获取验证码',
        disable: false,
        smsName: '',
        num: 60
      }
    },
    name: 'messageCode',
    methods: {
      getCode() {
        if (!(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).test(this.username)) {
          this.$message({
            message: '请输入正确的手机号！',
            type: 'warning'
          });
          return false;
        }
        this.disable = true;
        let timer = setInterval(() => {
          this.num -= 1;
          this.btnName = this.num + 's后重试';
          if (this.num < 1) {
            this.disable = false;
            this.btnName = '获取验证码';
            clearInterval(timer);
            timer = null;
          }
        }, 1000);
        let para = {
          mobile: this.username,
        }
        this.Api.postSendMessage(checkBe(para)).then(res => {
          if (res.code == '0000') {
            this.$message({
              message: '发送成功！',
              type: 'success'
            });
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss" rel="text/scss">
  .get-code {
    position: absolute;
    right: 10px;
    top: 6px;
    width: 90px;
    height: 34px;
    background: #ffffff;
    font-size: 13px;
    border: 0;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
  }

  .get-code-on {
    color: #b4b4b4;
  }

  .get-code-off {
    color: #02365c;
  }
</style>

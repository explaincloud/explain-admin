<template>
  <view>
    <view class="content">
      <image class="logo" src="../../static/admin.png" mode="aspectFit"></image>
      <amis @loaded="amisLoaded"></amis>
    </view>
  </view>
</template>

<script>
  import {
    mapMutations
  } from 'vuex'

  let amisLib = amisRequire('amis')

  export default {
    data() {
      return {
        redirectPath: '',
        schema: {
          "type": "page",
          "body": [{
            "type": "form",
            "wrapWithPanel": false,
            "body": [{
              "type": "input-text",
              "name": "account",
              "label": "账号",
              "placeholder": "请输入账号",
              "validations": {
                "isRequiredCustom": true
              },
              "validationErrors": {
                "isRequiredCustom": "账号为必填项"
              }
            }, {
              "type": "input-password",
              "name": "password",
              "label": "密码",
              "placeholder": "请输入密码",
              "validations": {
                "isRequiredCustom": true
              },
              "validationErrors": {
                "isRequiredCustom": "密码为必填项"
              }
            }, {
              "type": "checkbox",
              "name": "remember",
              "label": "记住登录"
            }, {
              "type": "action",
              "actionType": "submit",
              "label": "登录",
              "level": "primary",
              "size": "lg",
              "block": true,
              "hotKey": "enter",
              "loadingOn": "data.submitting == true",
              "onClick": this.submit
            }, {
              "type": "hidden",
              "name": "submitting",
              "value": false
            }]
          }]
        }
      }
    },
    onLoad(options) {
      this.redirectPath = options.redirect
    },
    methods: {
      ...mapMutations(['login']),
      amisLoaded(e) {
        e.embed(this.schema)
      },
      submit(e, props) {
        if (props.data.submitting) return false
        props.formStore.validate(props.data).then(valid => {
          if (valid) {
            props.formStore.setValues({
              submitting: true
            })
            this.$creq.callFunction('user', 'login', {
              data: props.data
            }).then(res => {
              if (res.data.status === 0) {
                this.login(res.data.data)
                amisLib.toast.success(res.data.msg)
                setTimeout(() => {
                  uni.reLaunch({
                    url: '/pages/init/init' + (this.redirectPath ? `?redirect=${this.redirectPath}` : '')
                  })
                }, 1500)
              } else {
                props.formStore.setValues({
                  submitting: false
                })
                amisLib.toast.error(res.data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style>
  page {
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
  }

  .content {
    max-width: 420px;
    padding: 100px 36px 0;
    margin: 0 auto;
  }

  .logo {
    width: 250px;
    height: 150px;
    display: block;
    margin: 0 auto;
  }
</style>

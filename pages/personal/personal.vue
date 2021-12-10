<template>
  <amis @loaded="amisLoaded"></amis>
</template>

<script>
  import {
    mapMutations
  } from 'vuex'

  let amisLib = amisRequire('amis')

  export default {
    data() {
      return {
        schema: {
          "type": "page",
          "title": "个人中心",
          "body": [{
            "type": "form",
            "mode": "horizontal",
            "wrapWithPanel": false,
            "data": this.$store.state.userInfo,
            "body": [{
              "type": "static",
              "name": "account",
              "label": "账号"
            }, {
              "type": "input-text",
              "name": "nickname",
              "label": "用户名称",
              "size": "lg"
            }, {
              "type": "input-text",
              "name": "newPassword",
              "label": "新密码",
              "size": "lg"
            }, {
              "type": "input-text",
              "name": "newPasswordConfirm",
              "label": "确认新密码",
              "size": "lg"
            }, {
              "type": "control",
              "body": {
                "type": "action",
                "actionType": "submit",
                "label": "保存",
                "level": "primary",
                "size": "md",
                "loadingOn": "data.submitting == true",
                "onClick": this.submit
              }
            }, {
              "type": "hidden",
              "name": "submitting",
              "value": false
            }]
          }]
        }
      }
    },
    methods: {
      ...mapMutations(['login']),
      amisLoaded(e) {
        e.embed(this.schema)
      },
      submit(e, props) {
        if (props.data.submitting) return false
        if(props.data.newPassword != props.data.newPasswordConfirm) {
          amisLib.toast.error('两次密码输入不一致')
          return false
        }
        props.formStore.validate(props.data).then(valid => {
          if (valid) {
            props.formStore.setValues({
              submitting: true
            })
            if (!props.data.newPassword) {
              delete props.data.newPassword
            }
            this.$creq.callFunction('user', 'editSelf', {
              data: props.data
            }).then(res => {
              if (res.data.status === 0) {
                let userInfo = this.$store.state.userInfo
                userInfo.nickname = props.data.nickname
                this.login(userInfo)
                props.formStore.setValues({
                  submitting: false,
                  newPassword: '',
                  newPasswordConfirm: ''
                })
                amisLib.toast.success(res.data.msg)
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

</style>

<template>
  <view class="loading" @touchmove.stop.prevent>
    <view class="loading-box" :class="{'loaded': !loading}">
      <view class="square-gradient">
        <view class="gradient" v-for="(item, index) in 9" :key="index"></view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapMutations
  } from 'vuex'

  export default {
    data() {
      return {
        loading: true
      }
    },
    async onLoad(options) {
      // pages.json里第一个页面路径
      let rootPath = '/pages/index/index'
      // 获取返回路径，如果没有则返回首页路径
      let redirectPath = options.redirect || rootPath

      // 处理登录状态
      let userInfo = null
      let userToken = uni.getStorageSync('user_token')
      if (userToken) {
        try {
          let checkTokenRes = await this.$creq.callFunction('user', 'checkToken', {
            data: {
              token: userToken
            }
          })
          if (checkTokenRes.data.status === 0) {
            userInfo = checkTokenRes.data.data
            this.login(userInfo)
          } else {
            this.logout()
          }
        } catch (e) {
          uni.showToast({
            icon: 'none',
            title: JSON.stringify(e)
          })
          // 处理接口请求异常
          throw e
        }
      }
      if (!userInfo) {
        uni.redirectTo({
          url: '/pages/login/login?redirect=' + redirectPath
        })
        return
      }
      
      // 获取导航菜单
      try {
        let getNavMenuRes = await this.$creq.callFunction('menu', 'getNavMenu', {
          data: {
            token: userToken
          }
        })
        if (getNavMenuRes.data.status === 0) {
          this.setMenuList(getNavMenuRes.data.data)
        } else {
          throw new Error(getNavMenuRes.data.msg)
        }
      } catch (e) {
        uni.showToast({
          icon: 'none',
          title: JSON.stringify(e)
        })
        // 处理接口请求异常
        throw e
      }

      // 增加一个loading消除的过渡效果，让跳转看起来更生动
      this.loading = false
      // 配合过渡效果
      setTimeout(() => {
        uni.reLaunch({
          url: decodeURIComponent(redirectPath)
        })
      }, 250)
    },
    methods: {
      ...mapMutations(['login', 'logout', 'setMenuList'])
    }
  }
</script>

<style>
  .loading {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    opacity: 1;
    background-color: #FFFFFF;
  }

  .loading-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
    transition-property: opacity;
    transition-duration: 0.25s;
  }

  .loaded {
    opacity: 0;
  }
</style>

<style>
  .square-gradient {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 60px;
    height: 60px;
    box-sizing: border-box;
  }

  .gradient {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background-color: rgb(64, 158, 255);
  }

  .gradient {
    animation: gradient 1s infinite linear;
  }

  .square-gradient .gradient:nth-child(1) {
    animation-delay: -1.0s;
  }

  .square-gradient .gradient:nth-child(2) {
    animation-delay: -0.9s;
  }

  .square-gradient .gradient:nth-child(3) {
    animation-delay: -0.8s;
  }

  .square-gradient .gradient:nth-child(4) {
    animation-delay: -0.9s;
  }

  .square-gradient .gradient:nth-child(5) {
    animation-delay: -0.8s;
  }

  .square-gradient .gradient:nth-child(6) {
    animation-delay: -0.7s;
  }

  .square-gradient .gradient:nth-child(7) {
    animation-delay: -0.8s;
  }

  .square-gradient .gradient:nth-child(8) {
    animation-delay: -0.7s;
  }

  .square-gradient .gradient:nth-child(9) {
    animation-delay: -0.6s;
  }

  @keyframes gradient {
    0% {
      transform: scale(1.0);
    }

    50% {
      transform: scale(0.1);
    }

    100% {
      transform: scale(1.0);
    }
  }
</style>

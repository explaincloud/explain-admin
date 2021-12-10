<template>
  <scroll-view class="sidebar" scroll-y="true">
    <uni-nav-menu :uniqueOpened="true" :active="menuActive" activeKey="url" activeTextColor="#409eff" @select="select">
      <uni-menu-sidebar :data="menuIndex"></uni-menu-sidebar>
      <uni-menu-sidebar :data="menuList"></uni-menu-sidebar>
      <!-- <uni-menu-sidebar :data="staticMenuList"></uni-menu-sidebar> -->
    </uni-nav-menu>
  </scroll-view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    data() {
      return {
        menuIndex: [{
          code: "index",
          name: '首页',
          icon: 'uni-icons-home',
          url: "/pages/index/index"
        }]
      }
    },
    computed: {
      ...mapState(['menuList', 'menuActive'])
    },
    mounted() {
      this.setMenuActive(this.$route.fullPath)
    },
    methods: {
      ...mapMutations(['setMenuActive']),
      select(e) {
        let url = e.url
        if (url) {
          this.setMenuActive(url)
        }
        this.clickMenuItem(url)
      },
      clickMenuItem(url) {
        // #ifdef H5
        if (url.indexOf('http') === 0) {
          return window.open(url)
        }
        // #endif

        // url 开头可用有 / ，也可没有
        if (url[0] !== '/' && url.indexOf('http') !== 0) {
          url = '/' + url
        }
        // TODO 后续要调整
        // uni.redirectTo({
        // 	url: url,
        // 	fail: () => {
        // 		// uni.showModal({
        // 		// 	title: '提示',
        // 		// 	content: '页面 ' + url + ' 跳转失败',
        // 		// 	showCancel: false
        // 		// })
        // 		uni.redirectTo({
        // 			url: config.notFound.url
        // 		})
        // 	}
        // })
        uni.reLaunch({
          url: url,
          fail: () => {
            uni.redirectTo({
              url: '/pages/error/404'
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .sidebar {
    position: fixed;
    top: var(--top-window-height);
    width: 240px;
    height: calc(100vh - (var(--top-window-height)));
    box-sizing: border-box;
    border-right: 1px solid darken($left-window-bg-color, 8%);
    background-color: $left-window-bg-color;
    // padding-bottom: 10px;
  }
</style>

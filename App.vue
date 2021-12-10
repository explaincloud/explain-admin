<script>
  export default {
    onLaunch: function(options) {
      console.log('App Launch')
      this.startup({
        appOptions: options
      })
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    },
    methods: {
      startup({
        appOptions,
        notInitPages = [], // 不需要初始化的页面，例如只作单页显示，不会返回到其他业务页面的页面
        notEnterPages = [] // 不作为入口页的页面
      }) {
        notInitPages.push('pages/init/init') // 可以防止init页面onLoad调用两次
        notInitPages.push('pages/login/login')
        notEnterPages.push('pages/init/init')
        // 验证集合是否存在页面，不存在则该页面作为入口页，否则入口页为首页
        if (!notInitPages.includes(appOptions.path) && !notEnterPages.includes(appOptions.path)) {
          let path = appOptions.path
          let query = appOptions.query
          let queryString = ''
          for (let key in query) {
            queryString += `${key}=${query[key]}&`
          }
          if (queryString) {
            queryString = `?${queryString.replace(/&$/, '')}`
          }
          let redirectPath = encodeURIComponent('/' + path + queryString)
          let url = `/pages/init/init?redirect=${redirectPath}`
          uni.reLaunch({
            url
          })
        }
      }
    }
  }
</script>

<style>
  @import '@/common/uni.css';
  @import '@/common/uni-icons.css';
  
  /*每个页面公共css */
  page {
    width: 100%;
    height: 100%;
  }

  .uni-top-window {
    z-index: 997;
    overflow: unset;
  }

  .uni-left-window {
    z-index: 996;
  }

  .uni-mask {
    z-index: 995 !important;
  }

  .uni-page-head {
    z-index: 994 !important;
  }

  .uni-app--showleftwindow uni-page-wrapper {
    padding: 0;
  }

  .uni-app--showleftwindow uni-page-body {
    border-radius: 0;
  }

  .uni-app--showleftwindow uni-page-head[uni-page-head-type=default]~uni-page-wrapper {
    padding-top: 44px;
  }
</style>

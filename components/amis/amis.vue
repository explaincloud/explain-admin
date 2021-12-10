<template>
  <view :id="id" class="app-wrapper"></view>
</template>

<script>
  let amis = amisRequire('amis/embed')
  let amisLib = amisRequire('amis')
  amisLib.addRule(
    // 校验名
    'isRequiredCustom',
    // 校验函数，values 是表单里所有表单项的值，可用于做联合校验；value 是当前表单项的值
    (values, value) => {
      if (
        value
      ) {
        return true
      }
      return false
    },
    // 出错时的报错信息
    // '输入的不是直辖市'
  )

  export default {
    name: "amis",
    data() {
      return {
        id: 'root'
      }
    },
    mounted() {
      this.$emit('loaded', {
        amis,
        id: '#' + this.id,
        embed: this.embed
      })
    },
    methods: {
      embed(schema) {
        amis.embed('#' + this.id, schema, {}, {
          /* 请求拦截 */
          fetcher: ({
            url,
            method,
            data,
            config
          }) => {
            console.log(url, method, data)
            if (url.startsWith('cloud:')) {
              let sa = url.substring(6, url.length).split(',')
              return this.$creq.callFunction(sa[0], sa[1], {
                data
              })
            }
          },
          /* 跳转拦截 */
          // jumpTo: (location, action) => {
          //   // 用来实现页面跳转, actionType:link、url 都会进来。
          //   var url = null
          //   var openTypeMatchResult = location.match(/\|(navigate|redirect|switchTab|reLaunch|navigateBack)$|^navigateBack$/gi)
          //   var openType = null

          //   // 如果匹配到openType关键词则根据关键词跳转，关键词格式为：|navigate 或者 |redirect，|左侧为url。navigateBack比较特殊，|可省略，省略后表示返回上一页，|左侧为delta
          //   if (openTypeMatchResult != null) {
          //     openType = openTypeMatchResult[0].replace('|', '')
          //     var locationSplitResult = location.split('|' + openType)
          //     if (locationSplitResult.length >= 2) {
          //       url = locationSplitResult[0]
          //     }
          //     switch (openType) {
          //       case 'navigate':
          //         uni.navigateTo({
          //           url
          //         })
          //         break
          //       case 'redirect':
          //         uni.redirectTo({
          //           url
          //         })
          //         break
          //       case 'switchTab':
          //         uni.switchTab({
          //           url
          //         })
          //         break
          //       case 'reLaunch':
          //         uni.reLaunch({
          //           url
          //         })
          //         break
          //       case 'navigateBack':
          //         var delta = url ? parseInt(url) : 1
          //         uni.navigateBack({
          //           delta
          //         })
          //         break
          //     }
          //   }
          //   // 没匹配到关键词则判断是否为http开头，如果是则打开新窗口
          //   else if (location.startsWith('http')) {
          //     window.open(location)
          //   }
          //   // 没匹配到关键词并且也不是http链接，则使用navigate作为默认跳转方式
          //   else {
          //     uni.navigateTo({
          //       url: location
          //     })
          //   }
          // }
        })
      }
    }
  }
</script>

<style>

</style>

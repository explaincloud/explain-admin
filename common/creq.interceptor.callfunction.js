import store from '../store'

let interceptor = {
  request: (options, extend) => {
    options.name = options.name || 'admin' // 设置默认请求的云函数名称
    let userToken = uni.getStorageSync('user_token')
    if (userToken) options.data.token = userToken
    return options
  },
  response: (res, options, extend) => {
    if (res.result.refreshToken) {
      // 服务端有回传的新token，替换掉本地token
      store.state.userInfo.token = res.result.refreshToken
      uni.setStorageSync('user_token', res.result.refreshToken)
    }
    // switch (res.result.status) {
    //   case 0:
    //     return res
    //   case 1: // 一般错误
    //     // console.error(res.result.msg)
    //     // 不能返回false，返回false会进入catch里，导致amis错误提示无法正确输出
    //     return false
    //   default:

    //     break
    // }
  }
}

module.exports = interceptor

## 极验字节跳动小程序组件接入指南

### 详细说明
极验字节跳动小程序组件与web相似，需要先完成服务端部署。本文主要描述极验字节跳动小程序组件的使用流程，文档中的配置参数和api方法demo，均可在 GitHub上获取 ([demo地址](https://github.com/GeeTeam/gt-miniprogram-alipay-demo))。
服务端部署参考 [服务端部署文档](https://docs.geetest.com/sensebot/deploy/server/java)。
定制参数和API接口可参考[极验微信小程序插件文档](https://docs.geetest.com/sensebot/apirefer/api/miniprogram/#%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0)


### 使用方式
1.在本demo的components文件夹下获取组件，自行解压geetest.zip到项目

2.参考字节跳动小程序组件([使用方法](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/custom-component/custom-component))

3.在小程序后台添加以下合法域名 	 https://api.geetest.com  https://monitor.geetest.com


### 必须的组件配置参数

| 参数 | 类型 | 说明 |
| ---- | ---- | ---- |
| gt | 字符串 | 验证 id，极验后台申请得到 |
| challenge   | 字符串 | 验证流水号，服务端 SDK 向极验服务器申请得到                |
| offline     | 布尔   | 极验API服务器是否宕机（即处于 failback 状态）                |
|  loadCaptcha | 布尔 | 控制插件显示和隐藏的参数 |




### 以下内容均为示例代码

#### 页面 json 文件引用 captcha 组件
```javascript
{
  "usingComponents": {
    "captcha": "/components/geetest/captcha"
  }
}
```

#### 页面 ttml 文件嵌入 captcha 标签
```javascript
<captcha  tt:if="{{loadCaptcha}}" gt="{{gt}}" challenge="{{challenge}}" offline="{{offline}}" />
```

#### 组件事件
```javascript
<captcha  tt:if="{{loadCaptcha}}" gt="{{gt}}" challenge="{{challenge}}" offline="{{offline}}" onSuccess="captchaSuccess" lang="en" onReady="captchaReady" onClose="captchaClose" onError="captchaError" />
```

#### `onReady`

监听验证按钮的 DOM 生成完毕事件。
>代码示例:

```js
// axml
<captcha  onReady="captchaReady"/>
//js  
captchaReady:function(){
    console.log('captcha-Ready!')
}
```

##### `onError`
监听验证出错事件,刷新过多、静态资源加载失败、网络不给力等验证码能捕获到的错误(参考[ErrorCode](/sensebot/apirefer/errorcode/web/))，都会触发onError回调。

**onError返回一个e，其中e.detail包含2个属性：code(错误码)、tips(错误提示)。我们在onError中要对challenge过期的情况做一个特殊的重置处理,代码如下**
>代码示例:

```js
// ttml
<captcha  onError="captchaError"/>
//js  
captchaError: function (e) {
        console.log('captcha-Error!', e.detail)
        // 这里对challenge9分钟过期的机制返回做一个监控，如果服务端返回code:21,tips:not proof，则重新调用api1重置
        if (e.detail.code === 21) {
            var that = this
            // 需要先将插件销毁
            that.setData({ loadCaptcha: false })
            // 重新调用api1
            that.captchaRegister()
        }
}
```

#### `onSuccess`

监听验证成功事件,返回一个result对象，包含3个属性：geetest_challenge、geetest_validate、geetest_seccode，这些参数为当前验证成功的凭据，
二次验证时需要传入。
>代码示例:

```js
// ttml
<captcha  onSuccess="captchaSuccess"/>
//js  
captchaSuccess:function(result){
    console.log('captcha-Success!')
    // 这里先将result中的参数保存，待进行二次验证时传入
    this.setData({
         result: result.detail
    })
}
```

##### `onClose`
用户关闭弹出来的验证时，会触发该回调。

>代码示例:

```js
// ttml
<captcha  onClose="captchaClose"/>
//js      
captchaClose:function(){
    console.log('captcha-Close!')
}
```






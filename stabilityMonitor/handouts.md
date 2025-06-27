# 前端稳定性监控

## 前端稳定性

前端稳定性 --> 前端监控系统

1、学习稳定性监控的完整流程
2、稳定性指标
3、稳定性上传
4、Node 接收致据
5、看板内容展示存储

解决两个问题
1、如何发现问题
2、如何快速定位问题

具体指标
1、收集错误 1.稳定性情况：JS 异常、接口异常、资源异常 2.用户行为信息：访问路径 3.页面性能 4.数据上传
2、整理存储错误
3、可视化（看板可视化：如图表之类）

###错误信息收集 1.接口异常
xhr fetch
针对 xhr： XMLHttpRequest.prototype
针对 fetch： fetch apply 覆盖、重写
replaceOld 先提供一个替换方法

小技巧：tsconfig.json 中添加了一个配置，可以点击引入的方法直接跳转到对应的地方看。

![image-20250501171418491](/Users/wangqiang/Library/Application Support/typora-user-images/image-20250501171418491.png)

[MDN loadend](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/loadend_event)

```js
// 针对xhr做处理，做替换
function xhrReplace() {
  if (!(XMLHttpRequest in window)) {
    return
  }
  // XMLHttpRequest.prototype 针对原有的请求添加数据
  const originalXhrProto = XMLHttpRequest.prototype
  // 为什么针对这2种方法，原有的open指的是在open阶段就已经能获取当前请求的基本信息，监听我们请求的基本信息
  // 获取到基本的信息后，会在send完信息后，就认为请求发送，触发当前的埋点
  // 1. open 获取请求时的基本信息
  replaceOld(originalXhrProto, 'open', (originOpen) => {
    return function(this,args){
        // 在这里获取当前请求的基本信息 post, 'https://xxx'
        this.monitorXhr = {
            method:args[0],
            url:args[1],
            time:Date.now(),
            type:'XHR'
        }
        originOpen.apply(this,args)
    }
  })
  // 2. send 额外添加埋点
  replaceOld(originalXhrProto,'send',(originSend)=>{
    return function(this,args){
        const {method,url} = url
        // window.addEventListener('loadend')
        on(this,'loadend',function(this)=>{
            // 将 this.monitorXhr 进行埋点上报
            // 发布订阅
            // sendLog() 
         originSend.apply(this,args)
        })
    }
  })
}
```

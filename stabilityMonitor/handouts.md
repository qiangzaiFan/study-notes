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
    return function(this,...args){
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

fetch (参考源码)

### 代码&资源异常收集
[Window: error event](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/error_event)

// 如何去监听代码&资源异常收集, window error event
window.addEventListener('error')

```js
on(window,'error',function(e){
  // 发布订阅
  // sendlog
})

```

promise 异常

unhandledRejection

window.addEventListener('unhandledRejection')

```js
on(window,'unhandledRejection',function(e){
  // 发布订阅
  // sendlog
})

```
### 行为信息收集
监听用户的点击事件或者其他事件，用户的一些页面跳转，监听用户能不能主动上报一些行为数据，监听console 这部分数据

DOM事件 click

document.addEventListener('click')

```js
on(window.document,'click',cb)
```
- history change 监听2个属性 pushState replaceState (MDN中查看history中这些方法)
- hash change 监听 onpopstate

路由访问信息

history

判断当前环境是否支撑history?
supportHistory 
window.history.pushState && window.history.replaceState

不支持history,也就是说支持hash mode

hash -> window.onpopstate

```js
  function  historyReplace(){
    if(!supportHistory){
      // 使用onpopstate
      window.onpopstate = function(){
        // sendLog sendLog的作用是发送错误信息
        window.onpopState.apply(this,args)
      }
    }

    replaceOld(window.history,pushState)
    replaceOld(window.history,replaceState,(args)=>{
      // 获取当前页面信息 window.location.href
      const from = window.location.href
      // 第3个就是跳转链接
      const to = args[2]
      // sendLog
      {
        from,to
      }

      cb.apply(this,args)
    })
  }
```
// 监听console类型
window.console

<!-- sendLog -->
originalConsole.apply(this,args)

### 目前主流前端框架如何收录问题

React异常

componentDidCatch
```js
function errorBoundaryReport(error){
  // error 数据处理 Error
  error.type = 'react_error';
  sendLog
}

// react 组件
componentDidCatch(error){
  encodeMonitor.errorBoundaryReport(error)
}

// vue 组件
vue.config.errorHandler

```

Vue异常

以插件化的形式添加到Vue实例中

```js
const MonitorVue = {
  install(Vue){
    Vue.config.errorHandler = function(error,vm,info){
      // 调用原生的错误信息
      //originalVueErrorHandler.apply()
    }
  }
}
```

### 面试中经常考察的内容

#### 可预防

1. 提供标准化研发流程
  - cli eslint prettier tsconfig
  - 文档沉淀
  - 组件库 npm  code snippet
  - jest 

2. 演练

  - 压测
  - Code review 问题注入

3. 灰度方案

  - CDN分流: proxy
  - 代码区分 grey UA ip


#### 可监控

无埋点：自动发布采集到的错误信息

#### 数据采集
1. JS异常 window.addEventListener('error')
2. 接口异常 xhr fetch axios
3. 资源异常
4. 其他常见异常 unhandledRejection
5. 框架异常
  1. Vue: Vue.config.errorHandler
  2.React: componentDidCatch

行为跟踪：click hash change history change
performance:

#### 数据上报

XHR image sendBeacon

#### 数据清洗

阈值处理

#### 数据持久化

数据库

#### 数据可视化

数据报表

#### 可回滚

##### 容器化部署

##### 数据迁移
只增不删

### 架构设计

1. 对前端监控埋点的统一架构设计
2. 聚合错误信息，进行统一的接口层封装
 
### 性能指标收集

performance 

1. 页面加载 largest contentful paint  LCP
2. 互动 first input delay FID
3. CLS 视觉稳定性 cumulative layout shift
这3个比较关键  

#### 指标口径

1. CLS
看MDN这个方法的详细
performanceObserver
```js
const getCLS = (cls)=>{
  // !!window.performanceObserver
  if(!supportPerformanceObserver){
    console.warn()
    return
  }

  // const po = new PerformanceObserver(l => 1.getEntries().map(cp)).observer({
    // type:'layout-shift',
  // })
{
  value,
  !hadRecentInput cls
}

}
```

UA User agent  navigtor peroformance
获取UA: navigator
所有指标在 web.dev MDN 上全都有

```js
const getDeviceInfo = ()=>{
  if(window.supportPerformance || !supportNavigator ){
    //  !!window.peroformance
    return
  }

  // 添加想统计的值
  return {}
}

initDeviceInfo =()=>{
  getDeviceInfo()
  report()
}
```

FID

LCP

2. 

### 架构设计







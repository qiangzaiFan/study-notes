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
1、收集错误
    1.稳定性情况：JS异常、接口异常、资源异常
    2.用户行为信息：访问路径
    3.页面性能
    4.数据上传
2、整理存储错误
3、可视化（看板可视化：如图表之类）

###错误信息收集
1.接口异常
xhr fetch 
XMLHttpRequest.prototype 
fetch apply 
replaceOld 替换方法

小技巧：tsconfig.json中添加了一个配置，可以点击引入的方法直接跳转到对应的地方看。

![image-20250501171418491](/Users/wangqiang/Library/Application Support/typora-user-images/image-20250501171418491.png)

```js
function xhrRepalce(){
    if(XMLHttpRequest in window){
        return;
    }
}
```
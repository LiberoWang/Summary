
> JS注入

1. UIWebView的JSContext注入
  优点：支持JS同步返回;支持直接传递对象，无需通过字符串序列化;支持传递JS函数，客户端能够直接快速调用callback;
  
  缺点：注入的时机
  
方式：WebViewJavascriptBridge安卓ios都支持。
WKWebView是苹果后来推出支持性更好的。

> 苹果iOS8-WKWebView scriptMessageHandler注入

webkit.messageHandlers.xxx.postMessage()

```js
// -----native 注入
//配置对象注入
[self.webView.configuration.userContentController addScriptMessageHandler:self name:@"nativeObject"];
//移除对象注入
[self.webView.configuration.userContentController removeScriptMessageHandlerForName:@"nativeObject"];

// ------ js 获取
window.webkit.messageHandlers.nativeObject

// ------ js传递给客户端(postMessage函数)
window.webkit.messageHandlers.nativeObject.postMessage(data);
```

> App url拦截

APP需要去判断是否打开一个新的webview。是否需要注入参数，满足协议:（例如）

```js
export function isAppUrl(url) {
  return (/^hljclient:\/\//i).test(url);
}
```

> 额外

`new URL` Api

![613b6f80e90f69e3ce73b7b72b691212.png](evernotecid://6E2F0541-5EBF-450A-A78B-AACE4C6306D5/appyinxiangcom/16628798/ENResource/p191)

[通信参考链接](http://awhisper.github.io/2018/01/02/hybrid-jscomunication/)

---
date: 2024-06-04
title: '事件循環 EventLoop'
author: Zihyin Hsu
category: frontend
tags:
  - javascript
---

# 事件循環 EventLoop

> 定義：從執行堆疊中的任務、將任務佇列中的任務移入堆疊，如此反覆查找和執行的過程，就是所謂的 `事件循環`。

## 同步 和 異步

::: info
JavaScript 是 `單線程` 的語言，也就是說同一時間內只能做一件事。然而，當遇到耗時較久的任務時，JavaScript 的執行將會被阻塞，直到該任務完成。而透過 `異步` 我們可以在等待耗時任務完成的同時，繼續執行其他非阻塞的任務。
:::

我們通常將代碼分為兩種類型：`同步` 和 `異步`。

> 同步代碼 : 在 `JS 主線程` 執行，並在執行時會立即返回結果。

> 異步代碼 : 在 `瀏覽器 / Node 環境` 執行，在被調用時不會立即完成，而是在未來的某個時間點完成並返回結果。

例如，JavaScript 中的 `setTimeout` 和 `setInterval` 函數、`Promise 物件`、`事件綁定`，以及發送 API 請求等，都是異步操作的常見例子。

## 堆疊 和 任務佇列

這裡認識一下兩個名詞：`堆疊（Stack）` 和 `任務佇列（Task Queue）`。

> 堆疊（Stack）: 用於儲存正在主線程上執行的任務（通常是同步代碼）。當一個任務開始執行，它就會被添加到堆疊的頂部。當該任務完成時，它就會從堆疊中被移除。其特性為`後進先出（LIFO）`，越早放進 Stack 的函式會越晚被執行。

> 任務佇列（Task Queue）: 用於儲存異步操作的任務，當堆疊被清空時，事件循環就會將其從隊列中移除，並將其放入主線程的堆疊中。其特性為`先進先出（FIFO）`，Task Queue 的函式會依照順序被執行。

## 簡單案例

以此例來說，當 `堆疊` 中的任務被執行完後，會去查找 `任務佇列` 中的任務，並將其加入堆疊中，因此執行順序是：`1 > 3 > 2`。

> 堆疊：console.log('1')、console.log('3')

> 任務佇列：console.log('2')

```js
console.log('1');
setTimeout(() => {
  console.log('2');
}, 1000);
console.log('3');
// 這裡的執行順序實際上是 1 > 3 > 2
```

---

參考資料：

1. [你真的懂 Event Loop 嗎](https://johnnywang1994.github.io/book/articles/js/event-loop.html)
2. [【前端八股文】事件循环-eventloop](https://www.bilibili.com/video/BV1j14y1j7us/?spm_id_from=pageDriver&vd_source=bf9e31cbb04dcc9c09d7c5869df8ca09)

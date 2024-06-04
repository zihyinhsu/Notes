---
date: 2024-06-04
title: '閉包 Closure'
author: Zihyin Hsu
category: frontend
tags:
  - javascript
---

# 閉包 Closure

::: info
閉包這題，真的是常看常新😂 實際開發上，其實我們不知不覺間都有應用到 `閉包` 的觀念。但每當面試被問到時，一時間又說不出個所以然，只好寫下來幫助自己記憶吧。
:::

### 相關概念：詞法作用域

當兩個函式分開時，兩者的作用域也是獨立的，那麼當 **函式內又包含函式** 呢？

在 fn1 中無法查找到 a 變數，因為 a 變數是在 fn2 中定義的。

```js
function fn1() {
  console.log(a);
}
function fn2() {
  var a = 1;
  fn1();
}
fn2();
```

當內部的函式查找不到所需變數，就會向外層查找，也就是**內層函式可以取用到外層函式的變數**，此時內層函式可以稱之為一個閉包。

```js{5-7}
function init() {
  const name = 'John Doe';

  // 我成了一個閉包
  function sayHelloWorld() {
    console.log(`${name} Hello world`); // John Doe Hello World
  }
  sayHelloWorld();
}
init();
```

## 閉包的用途？

簡單來說，當你想保護變數，不希望會被其他人修改到，但又有一直需要修改它的需求時，就可以使用閉包來保護變數。

### 解釋：

當內層函式可以取用到外層函式的變數時，此時我們可以稱內部函式為一個閉包。

如果將內層函式向外傳出並賦值給一個變數時，它將會在原函式內形成 **私有變數**，繼續存取外層函式的變數。這些變數或狀態 **僅存在於函式之中**，不能被外部直接存取，可避免變數或狀態被污染。

### 一個簡單的閉包範例

當我們將內層函式 return 出來並呼叫 `createCounter`，其內部的 `count` 變數會形成私有變數，在連續的 counter1() 呼叫中繼續被保持，因此 匿名 function 內的值可以一直被疊加。

```js{2}
function createCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const counter1 = createCounter();
console.log(counter1()); //  1
console.log(counter1()); //  2

// 用新變數定義它，創造一個新閉包，所以不會彼此干擾。
const counter2 = createCounter();
console.log(counter2()); //  1
console.log(counter2()); //  2

```

### 為何不用立即函式（IIFE）來呼叫？

除了將函式賦值給變數進行呼叫，我們也可以直接透過 `立即函式` 來呼叫他：

```js
console.log(createCounter()()); //1
console.log(createCounter()()); //1
console.log(createCounter()()); //1
```

但因為每次呼叫 `createCounter()` 都會創建一個新的閉包，而不是使用同一個閉包。每個閉包內又有自己的變數，所以無論我們呼叫多少次，其回傳值都會是 1。

因此，實際上如果要應用好閉包的特性，還是要以賦值給變數的方式進行呼叫比較好。

### 情境題

---

#### 常見陷阱題1

我們常用的 `setTimeout` 其實也常和閉包一起應用。`setTimeout` 的回呼函式(callback function)中存取外部的變數時，這個回呼函式就形成了一個閉包。

```js{3-5}
for (var i = 0; i < 10; i++) {
  console.log(i);
  setTimeout(function () {
    console.log('這執行第' + i + '次');
  }, 10);
}
```

以上是經典老題目，因為 var 會直接將 i 宣告成全域變數，等到執行 setTimeout 時，i 早就透過 for 迴圈跑到 10 了，所以結果會輸出 10 次的`這執行第10次`。

#### 解法：

改用 `let` 宣告 i 這個變數，因為 `let` 的作用域只存活在 block 裡，結果會輸出 `這執行第1次`...`這執行第10次`。

```js
for (let i = 0; i < 10; i++) {
  console.log(i);
  setTimeout(function () {
    console.log('這執行第' + i + '次');
  }, 10);
}
```

#### 常見陷阱題2

相同的概念，換個變化：

```js
var arr = [];
for (var i = 0; i < 5; i++) {
  arr[i] = function () {
    console.log(i);
  };
}

arr[0](); // 5
arr[1](); // 5
```

因爲 arr 裡面存的每一個值都是內容為 console.log(i) 的 function，所以需要呼叫它才會輸出值。而原理同上，當要執行函式時，i 早就跑到 5 了，所以無論如何輸出，結果都會是 5。

#### 解法：

同上例，改用 `let` 宣告 i 這個變數。

```js
var arr = [];
for (let i = 0; i < 5; i++) {
  arr[i] = function () {
    console.log(i);
  };
}

arr[0](); // 0
arr[1](); // 1
```

或者應用閉包概念，在立即函式內回傳內層函式，因為每個 IIFE 都創建了新的作用域並會輸出 n 值，而此 n 值即代表當下迴圈的 i 值。

```js
var arr = [];
for (var i = 0; i < 5; i += 1) {
  arr[i] = (function (n) {
    return function () {
      console.log(n);
    };
  })(i);
}

arr[0](); // 0
arr[1](); // 1
```

### 封裝變數案例

```js
function createWallet(init) {
  let money = init;
  return {
    add(num) {
      money += num;
    },
    deduct(num) {
      if (num > 10) {
        num -= 10;
      } else {
        money -= num;
      }
    },
    getMoney() {
      return money;
    },
  };
}

var wallet = createWallet(100);

wallet.add(1); // 100 + 1 = 101
wallet.deduct(30); // 30 - 10 = 20

console.log(wallet.getMoney()); // 101
```

---

參考資料：

1. [閉包，原來這就是閉包啊！](https://www.casper.tw/development/2020/09/26/js-closure/)
2. [【前端八股文】JavaScript闭包怎么理解呢](https://www.bilibili.com/video/BV1ot4y1j7W2/?spm_id_from=333.337.search-card.all.click&vd_source=bf9e31cbb04dcc9c09d7c5869df8ca09)
3. [[第十七週] JavaScript 進階：什麼是閉包 Closure 與實際應用](https://yakimhsu.com/project/project_w17_advancedJS_03_Clousure.html)

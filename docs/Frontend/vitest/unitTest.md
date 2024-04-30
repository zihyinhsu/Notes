---
date: 2024-04-30
title: '單元測試'
author: Zihyin Hsu
category: vitest
tags:
  - vitest
---

# 單元測試

## 測試情境與案例

以下是一個簡單的測試範例：

```js
// 引入要測試的 function
import add from './add';

// 測試情境（Test Suite）
describe('add', () => {
  // 測試案例 (Test Case)
  it('1 + 2 should be 3', () => {
    // 斷言（Assertion）
    expect(add(1, 2)).tobe(3);
  });
});
```

### 輔助語法

這些方法都是用於控制測試的執行，並不會改變測試的行為。

- describe.todo: 執行測試時，這個測試情境將不會被執行，而是會在輸出中顯示為待完成。
- describe.skip: 執行測試時，這個測試情境會被跳過而不會被執行。
- describe.only: 執行測試時，只有這個測試情境會被執行，其他的測試情境都會被忽略。

- it.todo: 用於標記一個待完成的測試案例。
- it.skip: 用於跳過一個測試案例。
- it.only: 用於只執行一個測試案例。

### expect.soft - 測試案例失敗後能夠接續斷言

在執行測試時，只要其中一個斷言失敗了，該測試案例就會被中斷，後續其他斷言都不會被執行。此時我們可以透過 `expect.soft` 語法，使同個測試案例內即使有失敗的斷言，也可以接續測試並標示錯誤。

## Setup ＆ Teardown

### 語法

- beforeEach: 在每個測試案例前呼叫一次。
- beforeAll: 在所有測試案例執行前呼叫一次。
- afterEach: 在每個測試案例執行後呼叫一次。
- afterAll: 在所有測試案例執行後呼叫一次。

以下為 beforeEach 的使用範例：

```js{3-6}
describe('add', () => {
  // 統一處理前置作業
  let baseNum;
  beforeEach(()=>{
    baseNum = new Base();
  })
  it('1 + 2 should be 3', () => {
    expect(add(baseNum, 2)).tobe(3);
  });
});
```

### 範疇

Setup ＆ Teardown 的判斷依據，主要根據當下範疇（context）而定。而每次使用 `describe` 定義一個測試情境，就會形成一個 context。

> 執行順序：語法 > 程式碼順序

```js
beforeAll(()=>{
  console.log('父層 - beforeAll')
})
beforeEach(()=>{
  console.log('父層 - beforeEach')
})
describe('子層情境',（）=> {
  beforeAll(()=>{
    console.log('子層 - beforeAll')
  })
  beforeEach(()=>{
    console.log('子層 - beforeEach')
  })
})
```

最終的輸出順序為：

```js
父層 - beforeAll;
子層 - beforeAll;
父層 - beforeEach;
子層 - beforeEach;
```

## 斷言 Assertion

> 定義：針對一個結果指出為真 (true) 或假 (false) 的邏輯判斷式

而斷言中的 `tobe` 則是所謂的 `Matchers`。

```js{4}
describe('add', () => {
  it('1 + 2 should be 3', () => {
    // 斷言（Assertion）
    expect(add(1, 2)).tobe(3);
  });
});
```

### Matcher 語法

Matchers 主要可分為：

#### 純值型別比對

主要應用於 JS 的純值型別。

- toBe: 比對值是否完全相等。不可用於物件或陣列比對，因為 `toBe` 比對的是**同個記憶體位置**中的值是否相等。
- toBeCloseTo: 處理浮點數運算的比對。

- toBeGreaterThan: 大於。
- toBeGreaterThanOrEqual: 大於等於。
- toBeLessThan: 小於。
- toBeLessThanOrEqual: 小於等於。

- toBeDefined: 比對值是否被賦值。
- toBeUndefined: 比對值是否為 undefined。
- toBeTruthy: 比對值是否為真值。
- toBeFalsy: 比對值是否為假值。
- toBeNull: 比對值是否為 null。
- toMatch: 比對值是否符合正規表達式。

```js
expect('0912345678').toMatch(/^09[0-9]{8}$/);
```

#### 非純值型別比對

- toEqual: 比對物件、陣列的結構是否相同，不比對記憶體位置。
- toStrictEqual: 與 `toEqual` 用法相同，差別在於會比對記憶體位置。
- toContain: 檢查陣列中是否含有某值。
- toContainEqual: 檢查陣列中是否含有預期的值。若預期為純值檢查陣列是否包含該值，若預期為陣列則比對結構是否相等。
- toHaveLength: 多用於檢查陣列的長度。
- toHaveProperty: 用於檢查物件是否包含特定屬性，或檢查特定屬性是否存在。

```js
const person = { name:'John Doe' }
expect(person).toHaveProperty('name': 'John Doe') //passed
```

- toMatchObject: 用於比對部分物件內容。

```js
const person = { name: 'John Doe', feature: { height: 175, weight: 60 } }
expect(person).toMatchObject(feature: { height: 175, weight: 60 }) //passed
```

#### 監聽與模擬

測試過程中，當遇到需要測試 **受測目標** 的依賴物，我們會需要 **測試替身** 來進行監聽或模擬。

```js{3,6,7,8,10,11,12,13,14}
it('cat meow',() => {
 const cat = new Cat('kitty');
 const meow = vi.spyOn(cat, 'meow')
 cat.hungry()

 expect(meow).toHaveBeenCalled(); // passed
 expect(meow).toHaveBeenCalledTimes(1); // passed
 expect(meow).toHaveBeenCalledWith('喵喵喵'); // passed

 expect(meow).toHaveReturned(); // passed
 expect(meow).toHaveReturnedTimes(2); // passed
 expect(meow).toHaveReturnedWith('喵喵喵'); // passed
 expect(meow).toHaveLastReturnedWith('喵喵喵'); // passed
 expect(meow).toHaveNthReturnedWith(1 ,'喵喵喵'); // passed
})
```

- toHaveBeenCalled: 目標是否有被呼叫過。
- toHaveBeenCalledTimes: 目標被呼叫的次數。
- toHaveBeenCalledWith: 目標方法被傳進了什麼參數。

- toHaveReturned: 目標被執行後應該回傳值。
- toHaveReturnedTimes: 目標被執行後，應該回傳值幾次。
- toHaveReturnedWith: 目標被執行後應該回傳的值。
- toHaveLastReturnedWith: 目標被執行後最後一次回傳的值。
- toHaveNthReturnedWith: 目標被執行後第 N 次回傳的值。

#### Error

- toThrowError: 若傳入值無效，拋出錯誤提示。

```js
it('解析無效JSON時，拋出錯誤'){
  const invalidJSON = "{'name':'John Doe','age':15}" // 無效JSON
  expect(()=>{
    JSON.parse(invalidJSON)
  }).toThrowError()
}
```

#### 快照

- 視覺回歸測試

會需要使用到 `端對端測試工具` 或相關外掛，以下為 `cypress-image-snapshot` 為例：

> matchImageSnapshot: 針對視覺做圖片保存，與下一次圖片比較。

```js
it('視覺回歸測試', () => {
  cy.visit('/');
  cy.matchImageSnapshot();
});
```

- 快照測試

針對資料結構做文字保存，與下一次文字比較。

> toMatchSnapshot: 另建資料夾存放快照紀錄

> toMatchInlineSnapshot: 直接在測試程式碼中紀錄，不另存檔案。

```js
it('快照測試', () => {
  const validJSON = '{"name":"John Doe","age":15}';
  const actual = JSON.parse(validJSON);
  expect(actual).toMatchInlineSnapshot(`{
    "age": 15,
    "name": "John Doe"
  }`);
});
```

---

**來源：** [Vue.js 3前端測試入門從這裡開始](https://www.drmaster.com.tw/bookinfo.asp?BookID=MP22333)

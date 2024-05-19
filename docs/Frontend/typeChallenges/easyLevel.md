---
date: 2024-05-13
title: 'Easy Level'
author: Zihyin Hsu
category: frontend
tags:
  - typescript
---

# Easy Level

## [Pick](https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.zh-CN.md)

思路：

1. in Operator
   > 用於檢查一個物件是否包含特定的屬性，或者可遍歷聯合型別(Union Types)的值。

```ts
interface Car {
  brand: string;
  year: number;
}

let myCar: Car = {
  brand: 'Toyota',
  year: 2005,
};

if ('brand' in myCar) {
  console.log('My car has a brand.');
}
```

```ts
type T = 'a' | 'b' | 'c';

type resultObj = {
  [key in T]: number;
};
```

2. Keyof Type Operator

> 用於獲取一個物件類型內所有 key 的聯合型別。

```ts
interface Bag {
  brand: string;
  year: number;
  color: string;
}

type BagKeys = keyof Bag; // "brand" | "year" | "color"
```

3. Indexed Access Types
   > 用於取出物件類型的值。

```ts
interface result {
  id: number;
}

type resultId = resultObj['id']; // number
```

解答：

```ts
type MyPick<T, K extends T> = {
  [key in K]: T[key];
};
```

## [ReadOnly](https://github.com/type-challenges/type-challenges/blob/main/questions/00007-easy-readonly/README.zh-CN.md)
> `readonly` 用於讓物件的屬性變成唯讀，不能修改。
```ts
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key];
};
```

---

**參考** ：

1. [type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)
2. [从TS类型体操入手，学习TS](https://juejin.cn/post/7265996663406968844)

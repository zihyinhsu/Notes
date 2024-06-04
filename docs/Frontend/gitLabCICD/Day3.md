---
date: 2024-06-04
title: 'gitLab CI/CD'
author: Zihyin Hsu
category: frontend
tags:
  - gitLabCICD
---

# gitLab CI/CD - 專案演練

來這邊 clone 這個 [測試專案](https://gitlab.com/kaochenlong/shopping-cat-v2.git)，跟著龍哥的 readme 來跑一次，首先要先在 mac 下載 deno，然後把它 run 起來。

```js
brew install deno
```

## 設定 Pipeline

到 gitlab 新增一個專案，把 clone 下來的 code 上傳到此專案內，並且在根目錄新增 `.gitlab-ci.yml`。

::: info
載下來的時候，其實就已有該檔案，但為練習用，我這裡會把它刪掉，跟著步驟做一次加深記憶～
:::

![createProject](img/createProject.png)

```yml
# 定義兩個 stages
stages:
  - testing
  - build_image

# job
run-test:
  stage: testing
  script:
    - deno test
```

上傳之後會跳出錯誤。因為此時使用的是預設的 Executor，而這個預設的 Executor 裡並不包含 deno。

![wrongImage](img/wrongImage.png)

於是我們可以來到 [deckerhub](https://hub.docker.com/r/denoland/deno) 找到 deno 的 image，在 yml 檔裡面指定它。

```yml{9}
# 定義兩個 stages
stages:
  - testing
  - build_image

# job
run-test:
  stage: testing
  image: denoland/deno:latest
  script:
    - deno test
```

![rightImage](img/rightImage.png)

## 把專案打包成 Docker Image

## 推上 Docker Registry

## 自動遞增 Image 版號

---

**來源：** [為你自己學 GitLab CI/CD](https://www.youtube.com/watch?v=htTkPwGsT48&list=PLBd8JGCAcUAEwyH2kT1wW2BUmcSPQzGcu&index=14&ab_channel=%E9%AB%98%E8%A6%8B%E9%BE%8D)

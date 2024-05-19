---
date: 2024-05-12
title: 'gitLab CI/CD?'
author: Zihyin Hsu
category: frontend
tags:
  - gitLabCICD
---

# gitLab CI/CD

## gitLab CI & Docker Image

可以使用 `image` 指定 Docker Image 的版本。
```yml{7}
stages:
  - linter
  - testing
  - build
  - deploy

image: alpine:latest // alpine 最新的版本。
```
![dockerImage](img/dockerImage.png)

放在 script 裡面的話，就只會在 script 裡面跑。


```yml
run_ruby_scripts:
  image: ruby:3.1.2-alpine3.16
  stage: testing
  script: 
    - ruby -v
    - ruby -e "puts 'Hello world'"
```
![rubyScript](img/rubyScript.png)


## Runner & Executor
### Runner
這通常指的是一種工具或程式，它的工作是執行或運行其他的程式碼或腳本。例如，一個測試 Runner 就是用來執行測試程式碼的工具。
### Executor
這通常指的是一種在特定的環境或條件下執行程式碼的實體。例如，在 Java 的並行程式設計中，一個 Executor 可以管理一個執行緒池，並控制這些執行緒如何並行地執行任務。



---

**來源：** [為你自己學 GitLab CI/CD](https://www.youtube.com/watch?v=zCFFot5HnEw&list=PLBd8JGCAcUAEwyH2kT1wW2BUmcSPQzGcu&index=2)

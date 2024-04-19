import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zihyin's Notes",
  description: 'My Coding Notes',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    lastUpdated: {
      text: '最後更新於',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },
    search: {
      provider: 'local',
    },
    logo: '/logo.svg',
    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Zihyin Hsu',
    },
    nav: [
      { text: 'About', link: '/AboutMe/readme' },
      { text: 'Frontend', link: '/Frontend/index' },
    ],

    sidebar: {
      '/AboutMe/': [
        {
          text: 'About',
          items: [
            {
              text: 'README',
              link: '/AboutMe/readme',
            },
          ],
        },
      ],
      '/Frontend/': [
        {
          text: '關於前端',
          items: [
            {
              text: 'gitLab CICD',
              collapsed: true,
              items: [
                { text: '什麼是CICD', link: '/Frontend/gitLabCICD/WhatIsCICD' },
              ],
            },
            {
              text: 'vitest 前端測試',
              collapsed: true,
              items: [{ text: 'vitest', link: '/Frontend/vitest/vitest' }],
            },
            {
              text: 'Vue',
              collapsed: true,
              items: [
                {
                  text: 'Vue3 為何用 Proxy 替代 defineProperty?',
                  link: '/Frontend/vue/proxy',
                },
              ],
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/zihyinhsu' }],
  },
});

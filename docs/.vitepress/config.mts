import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Zihyin Notes',
  description: 'My Coding Notes',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
    },
    logo: '/logo.svg',
    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Zihyin Hsu',
    },
    nav: [{ text: 'coding 筆記', link: '/readme' }],
    sidebar: [
      {
        text: 'README',
        link: '/readme',
      },
      // {
      //   text: 'gitLab CICD',
      //   collapsed: true,
      //   items: [{ text: '什麼是CICD', link: '/gitLabCICD/WhatIsCICD' }],
      // },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/zihyinhsu' }],
  },
});

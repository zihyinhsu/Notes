import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';

import vitepressMusic from 'vitepress-plugin-music';
import 'vitepress-plugin-music/lib/css/index.css';

import vitepressBackToTop from 'vitepress-plugin-back-to-top';
import 'vitepress-plugin-back-to-top/dist/style.css';

import 'viewerjs/dist/viewer.min.css';
import imageViewer from 'vitepress-plugin-image-viewer';
import vImageViewer from 'vitepress-plugin-image-viewer/lib/vImageViewer.vue';
import { useRoute } from 'vitepress';

import './custom.css';

const playlist = [
  {
    name: '러브홀릭 Loveholic',
    author: 'Loveholic',
    file: '/music/러브홀릭 Loveholic.mp3',
  },
  {
    name: 'Love you for you',
    author: '蔡健雅',
    file: '/music/LoveYouforYou.mp3',
  },
  {
    name: 'love and pain',
    author: '이수현',
    file: '/music/love and pain.mp3',
  },
  {
    name: '都是 weather 你',
    author: '就以斯、楊子平',
    file: '/music/都是weather你.mp3',
    // hide: true,
  },
];

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp: (ctx) => {
    // https://github.com/ZhongxuYang/vitepress-plugin-music
    vitepressMusic(playlist);
    // https://github.com/wehuss/vitepress-plugin-back-to-top
    vitepressBackToTop({
      // default
      threshold: 300,
    });
    // https://github.com/T-miracle/vitepress-plugin-image-viewer
    ctx.app.component('vImageViewer', vImageViewer);
  },
  setup() {
    // Get route
    const route = useRoute();
    // Using
    imageViewer(route);
  },
};

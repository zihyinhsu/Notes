import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import vitepressMusic from 'vitepress-plugin-music';
import 'vitepress-plugin-music/lib/css/index.css';
import './custom.css';

const playlist = [
  {
    name: '都是 weather 你',
    author: '就以斯、楊子平',
    file: '../../public/music/都是weather你.mp3',
    // hide: true,
  },
  {
    name: 'love and pain',
    author: '이수현',
    file: '../../public/music/love and pain.mp3',
  },
];

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp: (ctx) => {
    // https://github.com/ZhongxuYang/vitepress-plugin-music
    vitepressMusic(playlist);
  },
};

import { createContentLoader } from 'vitepress';

interface Post {
  title: string;
  url: string;
  date: string;
  tags: string[];
}

declare const data: Post[];
export { data };

export default createContentLoader('../docs/**/*.md', {
  // 扫描文件的目录
  transform(raw): Post[] {
    if (raw.length) {
      const result = raw
        .map(({ url, frontmatter }) => {
          if (!frontmatter) {
            // console.warn(`No frontmatter found for ${url}`);
            return null; // 忽略没有 frontmatter 的文件
          }

          const { title, date } = frontmatter;

          if (!title) {
            // console.warn(`Incomplete frontmatter in ${url}:`, frontmatter);
            return null; // 忽略缺少必要字段的文件
          }

          // console.log("frontmatter:", frontmatter); // 输出 frontmatter 的值
          return {
            title,
            url,
            date: formatDate(date),
            tags: frontmatter.tags || [],
          };
        })
        .filter((post): post is Post => post !== null) // 过滤掉无效的条目
        .sort((a: Post, b: Post) => b.date.localeCompare(a.date));
      // console.log('result data:', result); // 输出原始数据

      return result;
    }

    return [];
  },
});

function formatDate(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

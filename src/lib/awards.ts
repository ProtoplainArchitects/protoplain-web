// 獲獎排序：每件作品取最新一項獎的年份，新到舊排；獎項名稱沒有年份的，用作品年份。
import { getCollection } from 'astro:content';
import { awards, type AwardGroup } from '../data/awards';

const yearIn = (s: string) => Number(s.match(/(20\d\d)/)?.[1] ?? 0);

export async function sortedAwards(): Promise<(AwardGroup & { year: number })[]> {
  const workYear = new Map((await getCollection('works')).map((w) => [w.id, w.data.year]));
  return awards
    .map((g) => {
      const fallback = (g.slug && workYear.get(g.slug)) || 0;
      const items = [...g.items].sort((a, b) => (yearIn(b.zh) || fallback) - (yearIn(a.zh) || fallback));
      const year = Math.max(...items.map((a) => yearIn(a.zh) || fallback));
      return { ...g, items, year };
    })
    .sort((a, b) => b.year - a.year);
}

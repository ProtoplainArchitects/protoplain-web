import { getCollection, type CollectionEntry } from 'astro:content';

export type Lang = 'zh' | 'en';
export type Work = CollectionEntry<'works'>;

// 本機開發一律顯示 draft；Cloudflare 預覽建置設 PUBLIC_SHOW_DRAFTS=true 時也顯示，讓審稿看得到。
// 開放索引的正式建置（PUBLIC_INDEXABLE=true）永遠不顯示，就算預覽變數誤設到正式環境也不會發布 draft。
const showDrafts =
  import.meta.env.DEV ||
  (import.meta.env.PUBLIC_SHOW_DRAFTS === 'true' && import.meta.env.PUBLIC_INDEXABLE !== 'true');

/** 依年份新到舊排序；正式建置排除 draft */
export async function getWorks(): Promise<Work[]> {
  const all = await getCollection('works', ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title, 'zh-Hant'));
}

export async function getEnglishIds(): Promise<Set<string>> {
  return new Set((await getCollection('worksEn')).map((e) => e.id));
}

export const axisLabel: Record<string, { zh: string; en: string }> = {
  人文構築: { zh: '人文構築', en: 'Artificial Element' },
  自然構築: { zh: '自然構築', en: 'Nature Element' },
};

export const kindLabel = {
  work: { zh: '作品', en: 'Work' },
  exhibition: { zh: '展覽', en: 'Exhibition' },
};

export function workUrl(id: string, lang: Lang) {
  return lang === 'en' ? `/en/works/${id}/` : `/works/${id}/`;
}

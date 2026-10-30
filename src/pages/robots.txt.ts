import type { APIRoute } from 'astro';

// 與 Base.astro 的 noindex 同一個開關：正式網域才開放索引，其餘建置一律擋掉
const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';

export const GET: APIRoute = ({ site }) => {
  const body = indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

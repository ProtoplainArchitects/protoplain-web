# protoplain-web

ProtoPlain Architects official website (Astro + Cloudflare Pages)

初樸建築師事務所官網原始碼。內容規範與工作流程見 [CLAUDE.md](./CLAUDE.md)。

```bash
npm install
npm run dev     # http://localhost:4321（含 draft）
npm run build   # 正式建置（不含 draft）
```

| 項目 | 說明 |
|---|---|
| 框架 | Astro 6.4.8 |
| 託管 | Cloudflare Pages（建置指令 `npm run build`，輸出 `dist`，Node 22） |
| 作品內容 | `src/content/works/<slug>/` |
| 舊站對照 | [docs/slug-map.md](./docs/slug-map.md) |
| 內容待處理 | [docs/content-review.md](./docs/content-review.md) |

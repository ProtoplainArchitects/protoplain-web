# protoplain-web｜初樸建築師事務所官網

初樸建築師事務所（ProtoPlain Architects）的官方網站，用 Astro 建成靜態網站，部署在 Cloudflare Pages。
這個 repo 是公開的：任何放進來的東西都等於公開發布。

## 指令

| 指令 | 用途 |
|---|---|
| `npm install` | 安裝（Node 22 以上，見 `.nvmrc`） |
| `npm run dev` | 本機預覽 http://localhost:4321 ，**看得到 draft 作品** |
| `npm run build` | 正式建置到 `dist/`，**不含 draft**；推 PR 前必跑，必須零錯誤 |
| `npm run check` | 型別與 content schema 檢查 |

## 結構

```
src/content/works/<slug>/   一件作品一個資料夾
  index.md                  中文內文＋共用欄位（schema 見 src/content.config.ts）
  en.md                     英文內文（選填；沒有就不產生英文頁）
  cover.jpg                 封面（1260px 寬以內、已去除 EXIF）
src/pages/                  中文在根目錄，英文在 /en/
src/components/             WorkGrid、WorkDetail
src/styles/pp-tokens.css    本所視覺 token，取自 pp-brand skill，不要在這裡改色
src/styles/site.css         站點版面，只能用 --pp-* 變數
scripts/                    一次性匯入工具（Format 舊站歸檔）
docs/                       slug 對照表、內容待處理清單
```

## 新增或修改作品的流程

1. 開分支：`git switch -c works/<slug>`。
2. 在 `src/content/works/<slug>/` 建 `index.md`，可複製一個現有作品的欄位格式。slug 用英文小寫加半形連字號。
3. 新作品先設 `draft: true`，`review` 寫上還沒完成的事項。
4. 圖片：只放網頁用的壓縮圖（長邊 2500px 以內、單檔 5 MB 以內、去除 EXIF 與 GPS）。原圖留在初樸雲端AI中心或 NAS，不進 repo。影片不進 repo。
5. `npm run build` 通過後開 PR，在 PR 說明列出：新增的 slug、是否含英文頁、待確認事項。
6. 由主持建築師看過 Cloudflare 預覽網址後合併。任何人都不直接推 `main`。

## 內容規範（硬性，違反就退回）

**資料保護**
- 不放業主個人姓名、地號、金額、合約內容、個資。私人業主一律寫「私人」。
- 標題含業主姓氏的作品維持 `draft: true`，直到改用地名或作品名。
- 不放業主或同仁的個人社群帳號連結。
- 同仁姓名（參與人員）在取得本人同意前不放。
- 建築師、策展人等主持人個人姓名不列在作品頁。

**用語**
- 不使用「療癒」「療育」「healing」「therapy」這類字眼。身心效果用具體構築與預期行為描述（光、風、材料溫度、簷下深度、人會停下來做什麼）。
- 台灣繁體中文用語。禁用中國大陸用語，例如視頻、質量、優化、打造、賦能、落地、界面、信息。
- 標點：中文全形，英數半形；破折號「──」，刪節號「……」，引號「」『』。
- 中文作品名、地名的英文：台灣通用拼音或官方英文名，例如石岡 Shigang、魚池 Yuchi。

**視覺（pp-brand：清水模極簡 Concrete Minimal）**
- 淺色主題。只用一個強調色 `--pp-accent`（氧化鐵紅），一個畫面最多出現一處。
- 無陰影、無漸層、無光暈；分隔用 0.5px 細線。
- 字重只用 400、500。無襯線字體：Noto Sans TC／Inter，數字用 JetBrains Mono 系。
- 圓角：卡片 12px、圖片與控件 8px。
- 色碼一律用 `var(--pp-*)`，不在元件裡寫死 hex。

## 發布與網域

- `main` 合併後自動部署到 Cloudflare Pages。正式網域接上之前，網站帶 `noindex`。環境變數 `PUBLIC_INDEXABLE=true` 才會開放搜尋引擎索引，只在正式網域切換時設定。
- slug 一經公開就不改。新的 slug 要先列進 `docs/slug-map.md`，經主持建築師核可才能發布。
- protoplain.com 的 DNS 同時承載 Google Workspace 郵件（MX 5 筆與 Google 服務 CNAME；2026-10-30 查證時沒有 SPF、DKIM、DMARC）。動 DNS 前先完整匯出現有紀錄，任何一筆郵件紀錄都不能刪。切換步驟見 `docs/domain-cutover.md`。
- 金鑰（Notion、R2、Cloudflare）放在 Cloudflare 環境變數，不寫進 repo，也不放 `.env` 進版控。

## 可攜性（保持隨時能換託管平台）

託管目前是 Cloudflare Pages，但網站必須維持「`dist/` 丟到任何靜態主機都能跑」。

- 純靜態輸出。不安裝任何託管平台的 adapter（`@astrojs/cloudflare` 等），不寫 Pages Functions、Workers 或其他伺服器端程式。真的需要表單或後端功能，先在 PR 提出替代方案討論。
- 轉址寫在 `public/_redirects`，自訂標頭寫在 `public/_headers`。這兩種格式 Cloudflare 與 Netlify 通用。
- 影片與大型檔案不進 repo，網址一律用本所網域（例如 `media.protoplain.com`）或 YouTube／Vimeo 嵌入，不直接寫儲存服務的原始網址。
- 建置設定只依賴三項：建置指令 `npm run build`、輸出資料夾 `dist`、Node 版本（`.nvmrc`）。環境變數只有 `PUBLIC_INDEXABLE`。新增環境變數要同步寫進本節。

## 給 Claude Code 的工作守則

- 改內容前先讀該作品的 `index.md` 和 `docs/content-review.md`，確認它有沒有待處理事項。
- 不要自行把 `draft: true` 改成 `false`，除非 PR 說明裡寫明 `review` 的每一項都處理完了。
- 不要改 `src/styles/pp-tokens.css`，視覺 token 以 pp-brand skill 為準。
- 新增套件要在 PR 說明寫理由；版本鎖定確切版號，不用 `^`。
- 不要提交 `dist/`、`node_modules/`、原始高解析圖或影片。

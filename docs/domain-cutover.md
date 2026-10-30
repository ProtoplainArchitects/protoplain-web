# protoplain.com 正式網域切換手冊

目標：網站正式網址統一為 `https://protoplain.com`（不帶 www），`www.protoplain.com` 與 `protoplain-web.pages.dev` 一律 301 轉到正式網址；Google Workspace 郵件不中斷。

決定日：2026-10-30。做法：DNS 由 eNom 搬到 Cloudflare（註冊商維持 eNom，只換名稱伺服器）。

## 一、切換前的 DNS 存檔（2026-10-30 以 dig 查得）

名稱伺服器：`dns1`～`dns5.name-services.com`（eNom）。註冊商 eNom，網域到期 2027-04-10，由 Google Workspace 合作代管，eNom 登入資訊在 Google Admin「網域 › 進階 DNS 設定」。

| 名稱 | 類型 | 值 | TTL | 切換後處理 |
|---|---|---|---|---|
| `@` | MX 10 | `aspmx.l.google.com` | 1800 | **原樣複製** |
| `@` | MX 20 | `alt1.aspmx.l.google.com` | 1800 | **原樣複製** |
| `@` | MX 20 | `alt2.aspmx.l.google.com` | 1800 | **原樣複製** |
| `@` | MX 30 | `aspmx2.googlemail.com` | 1800 | **原樣複製** |
| `@` | MX 30 | `aspmx3.googlemail.com` | 1800 | **原樣複製** |
| `@` | TXT | `google-site-verification=mLyyNVeQmvt36WLCbBBJF19Bi7ljQ7Kpgmp_ypOyl1E` | 1800 | 原樣複製（Google 網域擁有權驗證） |
| `mail` | CNAME | `ghs.google.com` | 1800 | 原樣複製（Workspace 自訂網址） |
| `calendar` | CNAME | `ghs.google.com` | — | 原樣複製 |
| `docs` | CNAME | `ghs.google.com` | — | 原樣複製 |
| `sites` | CNAME | `ghs.google.com` | — | 原樣複製 |
| `start` | CNAME | `ghs.google.com` | — | 原樣複製 |
| `vibe` | CNAME | `ghs.googlehosted.com` | — | 原樣複製（使用中的 Google 協作平台網站，需登入；`dig` 與 Cloudflare 自動掃描都沒抓到，是從 eNom 後台補上的） |
| `@` | A ×4 | `216.239.32.21`、`216.239.34.21`、`216.239.36.21`、`216.239.38.21` | 1800 | 改為 Pages（舊 Google 網域轉址，目前 http 回 404、https 無法連線） |
| `www` | CNAME | `ghs.google.com` | 1800 | 改為 Pages（舊 Google 網站，目前 https 無法連線） |

查無：AAAA、CAA、SPF、DKIM（`google._domainkey`）、DMARC（`_dmarc`）、萬用字元紀錄。

`dig` 只查得到指定名稱。**切換前務必在 eNom 後台截圖或匯出完整的主機紀錄（host records）**，與上表比對，有表上沒有的紀錄一律原樣複製。

## 一之一、執行紀錄

| 日期 | 事項 |
|---|---|
| 2026-10-30 | Cloudflare 新增 zone（Free），AI 訓練爬蟲設為 Block；掃描到 16 筆，A 與 CNAME 共 10 筆由預設 Proxied 改為 DNS only |
| 2026-10-30 | 對照 eNom 後台完整紀錄，補上 `vibe` CNAME，共 17 筆；以 `dig` 直接比對 eNom 與 Cloudflare 名稱伺服器的回答，全部一致 |
| 2026-10-30 | eNom 名稱伺服器改為 `cruz.ns.cloudflare.com`、`dale.ns.cloudflare.com`；.com 註冊局與 whois 已更新；eNom 舊主機紀錄保留未刪 |

## 二、步驟

### Phase 0｜準備（切換前）

1. 依序合併 PR：#3 → #4 → #5 → #6 → #8。2026-10-30 已在本機合併測試，無衝突，`npm run check` 0 錯誤，`npm run build` 57 頁。
2. eNom 後台匯出完整主機紀錄存檔（存事務所 NAS，不進 repo）。

### Phase 1｜Cloudflare 新增 zone

1. Cloudflare 後台新增網站 `protoplain.com`，方案選 Free。**必須是 Pages 專案 `protoplain-web` 所在的同一個帳號**，否則根網域接不上 Pages。
2. Cloudflare 會自動掃描既有紀錄。逐筆對照第一節的表：MX 5 筆、TXT 1 筆、CNAME 5 筆都要在，數值一字不差。
3. `@` 的 4 筆 A 與 `www` 的 CNAME 先保留，Phase 3 再換。
4. MX、TXT 與 Google 的 CNAME 一律設成「僅 DNS」（灰色雲朵，不經 Cloudflare 代理）。
5. 記下 Cloudflare 指定的兩組名稱伺服器。

### Phase 2｜更換名稱伺服器

1. 從 Google Admin 取得 eNom 登入資訊，登入 eNom，在 DNS Information 把名稱伺服器改成 Cloudflare 指定的兩組。
2. **不要刪除 eNom 上的主機紀錄**，那是回復用的備份。
3. 等待生效：舊 NS 的 TTL 為 172800 秒，最長約 48 小時。建議在週五下班後操作。
4. 生效確認：

   ```bash
   dig +short NS protoplain.com
   dig +short MX protoplain.com
   ```

   NS 出現 Cloudflare、MX 仍是 5 筆 Google 主機，才進 Phase 3。期間寄一封外部信到 @protoplain.com 確認收得到。

### Phase 3｜接上網站

1. Cloudflare Pages › `protoplain-web` › Custom domains：新增 `protoplain.com`，再新增 `www.protoplain.com`。Cloudflare 會自動改 DNS，舊的 A 與 www CNAME 會被取代。**先在 Pages 新增網域，不要只手動加 CNAME**，否則會出現 522 錯誤。
2. Redirect Rules：`www.protoplain.com/*` 301 轉到 `https://protoplain.com/${1}`，保留路徑與查詢字串。
3. Pages 環境變數（Production）：`PUBLIC_INDEXABLE=true`，重新部署，確認首頁原始碼沒有 `noindex`。
4. Bulk Redirects：`protoplain-web.pages.dev` 301 轉到 `https://protoplain.com`。分支預覽網址（`*.protoplain-web.pages.dev`）不受影響，PR 預覽照常使用。
5. 驗證：

   ```bash
   curl -sI https://protoplain.com/ | head -1
   curl -sI https://www.protoplain.com/works/ | grep -i location
   curl -sI https://protoplain-web.pages.dev/ | grep -i location
   ```

### Phase 4｜郵件驗證（未決定，2026-10-30 先不動）

目前沒有 SPF、DKIM、DMARC。這三項是給 Google Workspace 本身寄信用的，可降低寄出信被當成垃圾信的機率。決定要做時：

- SPF：`@` TXT `v=spf1 include:_spf.google.com ~all`（Google 官方建議值，查證日 2026-10-30）
- DKIM：Google Admin › Gmail › 驗證電子郵件，產生金鑰後加 TXT
- DMARC：`_dmarc` TXT，先用 `p=none` 只觀察

### Phase 5｜收尾

- Google Search Console 以網域屬性驗證 `protoplain.com`（既有的 google-site-verification 可沿用）
- 新增 `robots.txt` 與 sitemap（另開 PR）
- 舊站 protoplain.format.com 加上新網址公告或停用；Format 的網域無法由新站轉址
- 舊站「聯繫」表單連到 Google 表單編輯網址，停用前一併修正

## 三、回復方式

| 狀況 | 處理 |
|---|---|
| 郵件收不到 | 先查 Cloudflare 的 MX 是否 5 筆齊全、是否設成「僅 DNS」；補齊即可，不必退回 |
| 網站打不開 | Pages › Custom domains 看狀態；網站問題不影響郵件 |
| 需要全面退回 | eNom 名稱伺服器改回 `dns1`～`dns5.name-services.com`，舊主機紀錄仍在，最長 48 小時生效 |

## 四、分工

| 動作 | 誰 |
|---|---|
| 合併 PR | 主持建築師 |
| 登入 Google Admin、eNom、Cloudflare，輸入帳號密碼 | 本人 |
| 逐筆核對 DNS、確認每一步結果、跑驗證指令 | 可由 Claude Code 在旁協助，每次儲存前先確認 |

參考：[Cloudflare Pages Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)、[Google Workspace 設定 SPF](https://knowledge.workspace.google.com/admin/security/set-up-spf)、[Google Workspace 網域轉移與解鎖](https://knowledge.workspace.google.com/admin/domains/transfer-your-domain-to-another-host)、[eNom 網域管理入口](https://support.enom.com/support/solutions/articles/201000065345-domain-management-portal-access-enom-com-)（皆查證於 2026-10-30）。

# 預覽網址存取限制手冊

目標：Cloudflare Pages 的 PR 預覽網址只開放本所同仁登入後觀看，之後才在 Preview 環境設定 `PUBLIC_SHOW_DRAFTS=true`，讓 draft 作品可在預覽網址審稿。

決定日：2026-10-31。理由：預覽網址預設公開，分支別名又容易猜（例如 `works-bamboo-light-pavilion.protoplain-web.pages.dev`）。draft 作品之中有標題含業主姓氏的案子，一旦預覽網址顯示 draft，等於半公開。`noindex` 只擋搜尋引擎，擋不住直接打開網址的人。

**順序不能顛倒：Access 驗證通過之前，不在 Cloudflare 設定 `PUBLIC_SHOW_DRAFTS`。**

## 一、官方文件查證（2026-10-31）

| 項目 | 文件說法 | 來源 |
|---|---|---|
| 預覽網址預設狀態 | 公開，任何人都能開 | Preview deployments（頁面更新 2026-10-12） |
| 限制方式 | 專案 Settings › General › **Enable access policy** | 同上 |
| 開啟後誰能看 | 預設只有 Cloudflare 帳號成員，可另調 Access 政策 | 同上 |
| hash 預覽網址 | 受保護 | 同上 |
| 分支別名 | **文件沒有明說**，需實測 | 同上；Known issues（頁面更新 2026-10-15） |
| `protoplain-web.pages.dev` 主網址、自訂網域 | 不受這個開關保護 | 同上 |
| 費用 | 文件沒有提到 | 需另查 Cloudflare Zero Trust 方案頁 |

選單名稱以控制台當下畫面為準，Cloudflare 介面常改。

## 二、操作步驟

需要 Cloudflare 帳號的管理權限，由主持建築師或指定同仁操作。

1. Cloudflare 控制台 › **Workers & Pages** › 選 `protoplain-web` 專案。
2. **Settings › General**，勾選 **Enable access policy**。系統會在 Zero Trust 自動建立一條對應 `*.protoplain-web.pages.dev` 的 Access 應用程式。
3. 到 Zero Trust › **Access › Applications**，打開剛建立的那一條，檢查 **Policies**：
   - 允許規則改為 **Emails ending in** `@protoplain.com`，驗證方式用 **One-time PIN**（寄驗證碼到 Workspace 信箱）。這樣同仁不必加入 Cloudflare 帳號也能審稿。
   - 不要加 Everyone、不要加個人 Gmail。
4. 存檔。

## 三、驗證（全部打勾才算完成）

用一個沒登入 Cloudflare 的無痕視窗測試：

- [ ] 打開任一則 PR 留言中的 hash 預覽網址（`<hash>.protoplain-web.pages.dev`），出現 Cloudflare Access 登入頁。
- [ ] 打開分支別名（例如 `works-bamboo-light-pavilion.protoplain-web.pages.dev`），**同樣出現登入頁**。這一項文件沒有保證，一定要實測。
- [ ] 用 `@protoplain.com` 信箱收驗證碼，能進入預覽頁。
- [ ] 用非本所信箱，無法通過。
- [ ] `protoplain-web.pages.dev`（正式網址）照常公開，不受影響。

分支別名沒被擋住時，先停在這一步，不要設定 `PUBLIC_SHOW_DRAFTS`。依 Known issues 頁面補一條涵蓋 `*.protoplain-web.pages.dev` 的 Access 應用程式後再測一次。

## 四、驗證通過之後

1. **Settings › Environment variables**，只在 **Preview** 新增 `PUBLIC_SHOW_DRAFTS` = `true`。**Production 不設。**
2. 對任一則 PR 重新部署，用登入後的預覽網址確認 draft 作品看得到，再用無痕視窗確認仍被擋住。
3. 回到本文件，在下方執行紀錄寫上日期與操作人職稱。

## 五、注意事項

- Production 自 2026-10-31 正式網域切換起已設 `PUBLIC_INDEXABLE=true`，程式裡的防呆會讓正式建置一律排除 draft。設定前仍要確認選的是 Preview。
- Access 只管「誰能開網址」。draft 內容本身仍要遵守 CLAUDE.md 的資料保護規範，不能因為有登入牆就放業主個資。
- 之後如果搬離 Cloudflare，新平台要先有同等的預覽存取限制，才能沿用 `PUBLIC_SHOW_DRAFTS`。

## 執行紀錄

| 日期 | 項目 | 結果 | 操作人 |
|---|---|---|---|
| 2026-10-31 | Preview 設定 `PUBLIC_SHOW_DRAFTS`（本手冊訂定前，未加 Access） | 06:48 設定，預覽網址公開顯示 draft | Claude Code（使用者同意） |
| 2026-10-31 | 依本手冊撤除 Preview 的 `PUBLIC_SHOW_DRAFTS` | 08:08 已移除並重新整理確認；之後的預覽建置不含 draft。**06:48–08:08 之間建置的預覽部署仍含 draft**，需在 Deployments 刪除或等 Access 生效 | Claude Code（使用者同意） |
| | Enable access policy | | |
| | 分支別名實測 | | |
| | Preview 設定 `PUBLIC_SHOW_DRAFTS` | | |

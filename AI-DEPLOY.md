# Gemini 免費額度測試（目前正式站）

AI 後端：https://campus-go-ai.onrender.com。正式靜態站預設連線到此服務，原先誤填靜態站網址的設定也會自動使用此後端。

在 Render 的 campus-go-ai / Environment 設定 GEMINI_API_KEY，選用有 Free Tier 的 Google AI Studio 專案，不啟用付費帳務。預設 GEMINI_MODEL=gemini-3.1-flash-lite；模型供應狀態與免費額度以 Google 帳戶當下顯示為準。Gemini 金鑰存在時優先使用 Gemini，不會因額度不足自動切換 OpenAI。額度不足時訊息保留，可稍後重試。

/api/status 的 enabled 表示有設定金鑰，不代表供應商已驗證成功；必須實測 /api/chat 和 /api/think。金鑰只存在 Render，不能放在網頁或 GitHub。免費 Gemini 資料使用條款不同於付費方案，測試請使用虛構內容。

以下保留 OpenAI 選用部署方式：

# OpenAI 訊息後端部署

目前遊戲是 Render Static Site。保留現有網址，另外建立 Node Web Service：

1. Render → New → Web Service → 選 `Nathanyy96/campus-go` 的 `main`。
2. Runtime 選 Node；Build Command：`npm install --ignore-scripts`；Start Command：`npm start`。選 Free 方案。
3. Environment 加入 `OPENAI_API_KEY`（Secret，不要放進 GitHub），`OPENAI_MODEL=gpt-4.1-mini`，`ALLOWED_ORIGIN=https://campus-go-xyw8.onrender.com`，`AI_DAILY_LIMIT=200`。
4. 部署後檢查 `/api/status` 回傳 `enabled:true`。在遊戲「沐訊 → AI 連線設定」輸入新 Web Service 的 HTTPS 網址，按測試並儲存。

亦提供 `render-ai.yaml` 作為 Blueprint 定義；匯入時指定該檔案路徑。原 `render.yaml` 保留靜態站設定。

沒有金鑰或服務離線時，訊息保留待回覆，不會自動產生預設回覆。Free 服務冷啟動可能較久，可稍後重試連線。OpenAI API 依帳戶用量計費，需在 OpenAI 控制台另外設定預算與額度。程式內的每天 200 次為單一程序的保護限制，服務重啟會重置；大量公開使用前需持久化配額、登入與濫用防護。

聊天使用 Responses API、`store:false`，金鑰只在伺服器端。玩家輸入、最近十則文字與當次照片會在 AI 連線時送往 OpenAI；照片平時保存在瀏覽器 IndexedDB，不上傳遊戲儲存庫。不把模型輸出當成好感或邀約的遊戲指令。

驗證：`npm test`。本機 `npm start` 後開 `http://localhost:3000` 可測試完整服務。沒有金鑰也可以試玩生活模擬；訊息會保留等待 AI 連線。

官方參考：https://developers.openai.com/api/docs/guides/images-vision 、https://developers.openai.com/api/reference/resources/responses/methods/create

## 帳號與既有進度綁定

同一個 Node 服務另需 `DATABASE_URL`，連接持久化 PostgreSQL。不要使用 Render 暫存檔案系統保存帳號。資料庫需自行建立並確認供應商方案與費用；程式不會自動建立付費資源。預設驗證 TLS 憑證；只有本機開發資料庫可另外設定 `DATABASE_SSL=false`。初次連線會建立 users/sessions/saves 三張表。

設定頁提供訪客轉註冊、既有帳號登入、手動上傳與載入。新註冊會綁定目前瀏覽器進度；已有雲端存檔時先顯示天數，覆蓋或載入皆須明確選擇。載入前備份於本機 `campus-before-cloud-import`。進度以 revision 比對，避免不同裝置靜默互蓋。登出不刪除本機存檔。照片本體仍只在原瀏覽器，跨裝置僅保留照片位置說明。

密碼使用每人獨立隨機 salt 與 scrypt；資料庫僅存 hash。七天 session token 的 hash 存在資料庫，原 token 只在當前分頁的 sessionStorage。登入與註冊有程序內速率限制，所有 SQL 使用參數。沒有資料庫時註冊會顯示未設定，仍可繼續本機遊玩。目前無忘記密碼／信箱驗證功能。

## v0.19 每人獨立的 AI 狀態

每位 NPC 以固定角色 ID 分開保存 mood、intent、短期記憶、專屬聊天歷史與今天的自由活動選擇。模型服務共用 OpenAI，但情境不混用。`/api/think` 使用 Structured Outputs；每天每人最多一次自主思考，背景依附近／關注優先、每16秒最多一次，頁面隱藏時不處理。聊天回覆另外按玩家訊息觸發。每個完整遊戲日可能最多增加81次自主思考請求，另計聊天請求；仍受每日200次程序內總上限限制。未連線不產生假 AI 內容，舊版情境訊息保留為舊紀錄。

AI 只能選預先允許的自由活動，不能改正式課程、已確認邀約、好感或同意狀態。週六／日完全沒有正式課程。AI 接入後需用真實金鑰驗證品質、速率與費用；本機 mocked API 測試只驗證整合邊界。

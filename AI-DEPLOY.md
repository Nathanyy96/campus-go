# OpenAI 訊息後端部署

目前遊戲是 Render Static Site。保留現有網址，另外建立 Node Web Service：

1. Render → New → Web Service → 選 `Nathanyy96/campus-go` 的 `main`。
2. Runtime 選 Node；Build Command：`npm install --ignore-scripts`；Start Command：`npm start`。選 Free 方案。
3. Environment 加入 `OPENAI_API_KEY`（Secret，不要放進 GitHub），`OPENAI_MODEL=gpt-4.1-mini`，`ALLOWED_ORIGIN=https://campus-go-xyw8.onrender.com`，`AI_DAILY_LIMIT=200`。
4. 部署後檢查 `/api/status` 回傳 `enabled:true`。在遊戲「沐訊 → AI 連線設定」輸入新 Web Service 的 HTTPS 網址，按測試並儲存。

亦提供 `render-ai.yaml` 作為 Blueprint 定義；匯入時指定該檔案路徑。原 `render.yaml` 保留靜態站設定。

沒有金鑰或服務離線時，畫面與訊息會標示「情境回覆」，不會假裝是模型。Free 服務冷啟動可能較久，可稍後重試連線。OpenAI API 依帳戶用量計費，需在 OpenAI 控制台另外設定預算與額度。程式內的每天 200 次為單一程序的保護限制，服務重啟會重置；大量公開使用前需持久化配額、登入與濫用防護。

聊天使用 Responses API、`store:false`，金鑰只在伺服器端。玩家輸入、最近十則文字與當次照片會在 AI 連線時送往 OpenAI；照片平時保存在瀏覽器 IndexedDB，不上傳遊戲儲存庫。不把模型輸出當成好感或邀約的遊戲指令。

驗證：`npm test`。本機 `npm start` 後開 `http://localhost:3000` 可測試完整服務。沒有金鑰也可以試玩與測試情境回覆。

官方參考：https://developers.openai.com/api/docs/guides/images-vision 、https://developers.openai.com/api/reference/resources/responses/methods/create

## 帳號與既有進度綁定

同一個 Node 服務另需 `DATABASE_URL`，連接持久化 PostgreSQL。不要使用 Render 暫存檔案系統保存帳號。資料庫需自行建立並確認供應商方案與費用；程式不會自動建立付費資源。預設驗證 TLS 憑證；只有本機開發資料庫可另外設定 `DATABASE_SSL=false`。初次連線會建立 users/sessions/saves 三張表。

設定頁提供訪客轉註冊、既有帳號登入、手動上傳與載入。新註冊會綁定目前瀏覽器進度；已有雲端存檔時先顯示天數，覆蓋或載入皆須明確選擇。載入前備份於本機 `campus-before-cloud-import`。進度以 revision 比對，避免不同裝置靜默互蓋。登出不刪除本機存檔。照片本體仍只在原瀏覽器，跨裝置僅保留照片位置說明。

密碼使用每人獨立隨機 salt 與 scrypt；資料庫僅存 hash。七天 session token 的 hash 存在資料庫，原 token 只在當前分頁的 sessionStorage。登入與註冊有程序內速率限制，所有 SQL 使用參數。沒有資料庫時註冊會顯示未設定，仍可繼續本機遊玩。目前無忘記密碼／信箱驗證功能。

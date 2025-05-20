# LOFO - 遺失物與食物資訊分享平台

## 如何啟動這個專案？

- 你可以下載或是 clone 此專案
- 你需要下載 Node.js，開發使用版本為 `v20.17.0`
- 複製 `/backend` 與 `/frontend` 中的 `.env.example`，並將檔名改成 `.env`
- 在 `/backend` 的 `.env` 中
  - 你需要自行從中央大學入口網站(Portal)加入開發成員，隨後到 APPs 建立一個新的應用程式，取得 `PORTAL_CLIENT_ID` 與 `PORTAL_CLIENT_SECRET` 並將 `Return To Address` 設為 `http://localhost:3001/api/auth/callback` (如果你不自行修改專案了話)
  - 你需要自行去 Google API Console 透過建立專案等步驟，取得 `GOOGLE_CLIENT_ID` 與 `GOOGLE_CLIENT_SECRET`，並將 `redirect url` 設定為 `http://localhost:3001/api/auth/google/callback` (如果你不自行修改專案了話)
  - 你需要自行取得 Gemini Key 放入 `GEMINI_API_KEY`
  - 以上皆可**免費**取得
- 在 `/frontend` 的 `.env` 中
  - 你**無需做任何修改** (如果你不自行重設專案了話)
  - 如果你想要實現 Discord 通知，你需要準備一個 Discord Webhook (無須付費)
- Database 資料庫
  - 本專案使用 Postgresql 與 MongoDB，你可以自行建立，或者是用寫好的 `docker-compose.yaml` 直接拉取映像，建議直接使用 Docker 建立，無須多餘設定。

### 拉取資料庫映像

```bash=
docker-compose up -d
```

### 啟動後端(需要準備好資料庫)

```bash
cd backend
npm install
npm run dev
```

### 啟動前端

```bash
cd frontend
npm install
npm run dev
```

## 專案介紹

### 專案目標

- 提升遺失物尋回效率
- 減少食物浪費，促進資源共享
- 建立有獎勵制度的互助社群
- 提供即時通知，提升觸及率

### 專案特色

- 透過地圖 UI，找尋遺失物與剩食位置一目瞭然
- 透過 LLM，自動建立描述與關鍵字索引，節省用戶輸入時間
- 透過即時文字通訊與 Discord 推播，增加用戶體驗與觸及性

### 開發技術

#### 前端 Frontend

- 前端框架 Nuxt.js
- UI 元件庫 lucide-vue-next, sweetalert2
- 開源地圖 Leaflet.js & OpenStreetMap
- 其他 axios, socket.io-client, tailwindCSS, i18n(預留開發多語系空間)
- 其他的顯示在前端 `package.json`

#### 後端 Backend

- 後端框架 Node.js + Express
- 定時任務 node-cron
- 驗證 simple-oauth2, jsonwebtoken 等
- 外部 API Gemini, Discord Webhook 等
- 其他常見的與資料庫等顯示在後端 `package.json`

#### 資料庫 Database

- PostgreSQL：儲存用戶、事件等關聯性資料
- MongoDB：儲存對話訊息，保留未來擴展彈性
- 你可以在 `WebERD.drawio` 中看到此專案大智的 ERD 規劃(未完全相符)

## 未來發展方向

- 持續完成 Notification 通知功能

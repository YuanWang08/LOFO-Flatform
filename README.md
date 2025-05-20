## How to start this project?

About backend & frontend, you can easily run "npm install" & "npm run dev" to start.

About database, run "docker-compose up -d", or you can change the .env to link to your own database.

- 5/1 建立出前端、後端、資料庫架構與環境，前端完成 Navbar，並成功串起後端中央 Portal 驗證
- 5/4 前端套上地圖初步 Demo，後端建立 items 表與部分 /item 路由
- 5/5 4 小時 前端套上地圖初步 Demo，後端建立 items 表與部分 /item 路由
- 5/7 2 小時 前端可以上傳物品、地圖可以呈現物品、可以上傳與顯示圖片

為了快速 Demo，就先不串接積分的資料庫了，所以積分先不使用 user.point，使用公式計算：
已發布物品：每個 5 分；
已分享食物：每個 5 分；
已幫助他人：每個 10 分：
0-50 分：Level 1 青銅分享者
51-100 分：Level 2 白銀分享者
101-150：Level 3 黃金分享者
151-200：Level 4 鑽石分享者
201 以上：Level 5 璀璨分享者
將等級顯示在積分的旁邊，並且越高級有越帥的特效

代辦，做完收工
完成 /settings & navbar 的三語
/foods/:id & /items/:id 底下的相似物品
discord 通知
通知設置
地圖上傳防呆
認領防呆
/message UI、移除自己

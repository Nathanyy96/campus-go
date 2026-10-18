# Campus Go · 澄灣大學

An adult university life and relationship game for the web, hosted on Render. All students are fictional and at least eighteen years old. The initial playable character is male. The player explores a 2D campus and home, studies, joins activities, meets students and develops relationships through shared experiences and explicit choices.

Preserve the incumbent forest green and paper surfaces, Chinese serif headings and Chinese sans-serif controls. This update refines the existing messenger without replacing the campus visual world.

沐訊 provides a searchable conversation list, unread and student filters, character portraits, message previews, two-way bubbles, photo attachments, per-person drafts and an always-available composer. Desktop shows the list beside the conversation; mobile shows one at a time with a visible back control. Invitations stay explicit actions inside the relevant conversation. Existing progress and conversation history must survive updates.

The calendar starts on Saturday, January 1, 2000 and advances through Gregorian months, leap years and years. The internal elapsed-day counter remains a storage detail. Player and NPC courses use the same calendar; Saturdays and Sundays have no formal classes. Visible dates use year, month and day instead of ordinal game days.

Each NPC has separate memories, mood, intentions and conversation context. OpenAI integration is implemented but the backend and API key have not been activated in the deployed game. Offline messages remain pending rather than receiving canned AI substitutes. PostgreSQL account persistence also requires backend configuration; local browser progress remains usable independently.

Friendships continue through familiarity, comfortable conversation, mutual trust and close friendship, based on repeated days and shared experiences. Romance requires a separate accepted expression of interest; it never follows automatically from friendship points. Four new character plates (S013–S016) are pending identity approval, with public introductions, topics, goals and personal pace shown in profiles.

## v0.22 共同生活與校外探索

交往後大廳提供伴侶入口：狀態、下一步、約會、共同回憶與第一次。安排河畔、居家電影、百貨及電影院約會，支持雙方同意的非露骨互動；留宿需獨立同意，分開休息，翌日早餐需兩份食材。交往、禮物與留宿均不自動授權其他接觸。

五個新增地點：百貨、電影院、住宅區入口、受邀同學住家、銀行。受邀住家依當次接待者呈現，不代表81戶各自已完成室內美術；新地點室內近景背景待製作。週末自由活動加入百貨與觀影。同學可提出到家作客的正式邀約。銀行提供純遊戲七日定存和有漲跌的模擬基金，扣除生活費與交易手續費，與現實市場無關。

## v0.23 情侶互動試作

陳以晴與楊子晴各有12格專屬動作圖（牽手、擁抱、親吻，各4格）。播放器為明確標示的逐格動畫試作，不是影片或3D；牽手／親吻為主觀鏡頭，擁抱為雙人鏡頭。支援重播、手動看下一格、關閉及減少動態偏好。其他接觸以敘事呈現，沒有假稱每項都有動作素材。

親密度0–100來自交往時間、共同日、第一次與有每日上限的談心／活動；分數門檻不等於當次同意。伴侶頁說明留宿及共同洗澡的額外條件。一起洗澡使用非裸露關門淡出、獨立同意、可婉拒且不會自動授權其他接觸。兩位測試角色有不同的情境談心，輸入式AI對話獲得實際關係、親密度與共同回憶。

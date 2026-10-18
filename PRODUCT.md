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

## v0.24 共同衣櫃、未來計畫與外觀修正

楊子晴與陳以晴試作共同衣櫃，各有校園／約會／居家三套完整穿搭，以及米白、霧藍、鼠尾草綠三款純衣物內衣褲商品圖；內衣不展示在人物身上。每日需親密度55、信任16並在家取得本人同意，對方可拒絕或不喜歡特定搭配。確認後本人私下換好，穿搭狀態保存並反映在交談與場景人物上；現有衣櫃試穿不扣款，一天一次。衣物與造型為試作，不是任意布料混搭或穿脫動畫。

未來計畫包含週末小旅行、畢業／進修方向和共同生活習慣；需兩個不同日子當面討論且信任16才達成共識，三天後在指定地點花20分鐘實踐；小旅行需$100、進修需玩家知識6。已同意的日期不會因繼續討論而被悄悄推遲，完成僅記錄一次，不替角色直接搬家或改職涯。AI情境包含自己的計畫與穿搭記憶。

陳以晴所有目前人物近景、全身、12格親密動作和三套新造型統一為無雀斑版本；人物描述同步。兩張包含舊臉的早期六人合成圖已備份至工作區後移出公開遊戲，相關舊背景引用移除。其他角色外觀特徵保留。現有圖片進行檔案解碼、引用路徑與視覺縮圖檢查；此項不代表81名學生都已具備圖片，已有圖的角色仍為17名。


## v0.25 · Additional student artwork

Added distinct portrait/full-body W01 prototype plates for 蕭佳蓉 (S017), 胡珮珊 (S018), 謝星妤 (S019), and 程立群 (S020). All four are pending appearance approval. The directory and conversation/profile views reuse the existing two-view renderer. Twenty-one students now have individual artwork, including six original W01 identities and Yang’s document references; remaining students retain name markers. No save migration is required.


## v0.26 · Facial identity differentiation

Replaced pending W01 samples for 葉青禾/S013 and 蕭佳蓉/S017 with more distinct facial anatomy; added 賴書妍/S027 and 柯語桐/S029. All are adult, fully clothed two-view prototypes, pending user approval. Four individual face specifications emphasize jaw, eye, nose, mouth and body proportions rather than hair alone. S013 and S017 use new versioned paths; original samples remain archived in the repository. Twenty-three students now have individual artwork. Existing saves retain progress.


## v0.27 · More distinct student faces

Added 郭采薇/S026 (narrow heart face, round double-lidded eyes, pixie haircut) and 顏秋月/S030 (broad cheekbones, elongated eyes, blunt bob, solid build). Each has a distinct fully clothed portrait/full-body W01 prototype pending review. Twenty-five students now have individual artwork. Existing save progress is preserved.


## v0.28 · 情侶生活與邀約時間

主選單新增情侶生活頁，以伴侶照片、感情狀態及交往日期優先，保留親密度、所有待進行約會、共同生活與回憶。支援切換各位交往對象、選未來兩週日期及自訂開始時間；時間以半開區間檢查，不再因同一人或已有其他邀約而一概阻擋。居家電影和同一人的留宿可共用在家時段，其他真實重疊仍會阻擋。電影院後可另安排到家留宿見面，不需先看居家電影；當面仍需獨立同意。取消留宿恢復原約會時長，不影響電影本身。個人活動衝突檢查使用約會完整時長。

顏秋月改為v02清秀、柔和微笑版本，保留短鮑伯與小痣；未來人物以自然有吸引力、五官具個別差異為準，不刻意誇張硬朗輪廓。圖片仍為外觀試作。既有存檔保留。

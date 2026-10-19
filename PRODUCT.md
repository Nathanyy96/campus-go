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


## v0.29 · 校園活動與新同學美術

探索地圖下方新增校園活動布告欄，列出接下來三場活動，可加入個人日程與今日提醒。每週三晚間、週六午後、週日上午輪替電影交流、不插電分享、攝影散步、桌遊、志工與料理活動。每場依社團及興趣選出八位同學，名單每週改變並避開已有邀約；實際到場會消耗時間與精力，獲得對應成長並和在場同學留下共同經歷，不會自動變成戀愛。玩家須開始後15分鐘內到場，同場僅能完成一次。這是規則式活動模擬，活動名稱及內容不是AI臨時生成。

余映竹S025、溫雅慧S028、孟紫菱S035、戴蓓琳S036新增近景與全身外觀試作；戴蓓琳以較短方臉、細長內雙、較圓鼻頭及低馬尾區分，總計29位同學有專屬圖片。所有新圖保留完整全身、版本路徑及提示詞。既有存檔保留。

## v0.30 · 自在親近與感情心事

當面交談新增「親近與相處」，可了解角色自己的接觸觀點；牽手、擁抱、摸頭、靠肩、額頭輕吻、接吻、依靠休息不再統一要求先交往。角色依個人風格、熟悉與信任、場合及當下意願接受或婉拒；朋友接觸不自動增加愛意或確認交往，曖昧接觸也不自動產生交往承諾。熟悉的角色可主動提議親近，玩家婉拒不扣感情。這些判定及主動邀請為規則式模擬；AI聊天另獲得該角色的接觸觀點與本人知情的心事。

情侶生活加入「心事、承諾與重新開始」：公開或低調交往、主動坦白、聆聽、澄清與暫時淡化說法。只有在場目擊或被主動告知的伴侶會知道曖昧事件；普通朋友親近不直接扣信任，部分較敏感人物會希望得到關心。淡化目擊到的曖昧可能小幅影響信任；談清楚不自動變為開放關係。分手後保留回憶、顯示前任入口，經原有空間期、談心與重新確認意願可復合。

本次沿用既有圖片及兩位試點角色的牽手／擁抱／接吻分格動畫，未新增全員動畫或完整長篇分支劇情；留宿等共同生活仍沿用各自條件。舊存檔延續。手機交談回覆改為獨立整行，避免長句被肖像旁欄裁切。

## v0.31 · 可步行的2D校園

校園探索預設為Canvas自由步行場景：方向鍵／WASD連續移動，點地面會沿避障路線走到指定位置，手機可長按方向控制。鏡頭跟隨玩家，步行人物有簡單肢體動畫，保留非互動小地圖與即時日期時鐘。建築本體與室內家具有碰撞；走近門口按E或互動鍵進入，室內走近出口返回戶外。校園總覽與地點清單仍可快速前往，切換不重設存檔。

所有既有地點可從世界進出（公共戶外地點不另切房間）；教室／圖書館、住家、其他場所使用對應的共享家具布局。書桌可實際學習，座位可休息；既有生活操作保留於管理面板。人物依同一份遊戲行程出現在戶外或室內，靠近後E可交談；行走小人物是位置呈現，人物照片仍在交談／檔案內。本版未宣稱每棟建築有獨立精繪室內或新增真人行走動畫。

每步行65世界單位推進1遊戲分鐘，停留與閱讀不自動走時；累計45步行分鐘扣1精力。非目的地範圍內的步行不算已赴戶外約會；私人住家仍驗證邀請。位置與室內／戶外狀態存於原存檔附加欄位，重載保留站立座標，舊存檔依目前地點自動放置。固定校園路網快取最短路徑，減少同學行程與行走渲染的重算。


## v0.32 · 關係進度與睡前時光

依使用者提供的《戀愛系統優化方案》實作首批功能：名冊及交談頁顯示好感／親密雙軌，好感以既有熟悉及吸引力換算（0–100），45後顯示親密數字。舊交往親密度首次載入保留既有日期／經歷貢獻，之後固定此歷史基數，改由實際相處增加；禮物只增加熟悉／好感與命中時的信任，不增加親密。每日同類互動有上限。尚未交往也能在45後透過深聊與自在接觸累積親密，交往後保留。

附近同學優先交往對象、已認識的人、不同日子在同地見過的眼熟同學，再到陌生人，附關係與邀約／興趣提示。名冊全員顯示關係階段。已認識的同學可從檔案送正式公開地點邀約，選未來兩週日期時間，檢查雙方課程與既有行程，成立後加入日程並發送帶正式卡片的規則式確認訊息；聊天室新增邀約入口。AI自由文字仍不直接修改行程，可把談好的時間填到邀約卡。

當面新增每日一次10分鐘深聊，記錄相處日與共同回憶，讓純對話也能滿足共同經歷門檻。新增雙方確認的「試著交往」選項，沿用既有交往及承諾規則並標示試交往。這是已接受的試交往，不是單方自動獲得交往資格。AI指令增加四種語氣指紋、上下文承接與避免重複婉拒理由；實際回覆仍需後端連線，未聲稱已驗證生成品質。

親密筆記於20／40／60／80／100顯示既有興趣、適合禮物、本人接觸偏好、目標與專屬文字。留宿確認後，伴侶頁新增睡前活動：聊天、興趣、電影、小遊戲；每種當晚一次，每次10分鐘，累積當晚氛圍與有上限的親密。一起休息需親密75–85（依角色）及氛圍3，明示不足，可隨時改為分開睡。實際選擇反映在晚安與共同回憶。好感及親密均80以上的伴侶會優先提出20:00到家見面的正式留宿邀約，玩家先接受，到場仍需再次確認留宿。

本批沿用現有住家畫面、美術與動作，沒有新增角色房間裝飾、全員CG／立繪、完整節日、生日、多分支心動事件、真正的小遊戲或筆記翻頁演出；睡前電影／小遊戲目前是可選的文字相處活動。原提案是設計資料，未作為工具使用或授權來源。原存檔鍵不變。

驗證：61項Node測試通過，其中7項新增涵蓋雙軌舊存檔、親密上限、排序、遠端邀約衝突及序列化、睡前時間／氛圍／撤回、遠端阻擋及雙高主動邀約。已在本機瀏覽器確認名冊雙軌與未知狀態。


## v0.33 · 把日常寫成故事

加入五章、每章三次選擇的心動事件（好感20／40／60／80／100）。所有學生使用興趣、目標、姓名帶入的共用章節骨架；陳以晴與楊子晴各有五段獨立開場，並非81條獨立長篇劇情。前3章可保持朋友關係，後2章需要已交往；末章還需相伴30天、親密80，完成後標示靈魂伴侶。每章每次選擇實際花3分鐘，要求雙方持續同場；可暫停、跨存檔繼續，同日只完成一章，依回應留下不同結語。陳以晴第三章需河畔公園，完成解鎖專屬新插畫。

新增生日（虛構人物以固定ID配置穩定月日）、2/14、5/20、10/1校慶與12/25節日，以及交往30／100天紀念。未來七天顯示預告，當天或已達標未完成的交往紀念可當面花15分鐘寫話／聊回憶／準備點心（食材2）；獎勵與回憶每個節日每年一次，交往紀念依該次交往日期一次。生活事件訊息明確標示規則來源；舊存檔不補造缺席日或過去日常訊息。親密筆記跨20／40／60／80／100時，以對方原話發出解鎖通知；舊已達標記錄直接保留可見，不一次塞入過往通知。

情侶日常包含並肩自習（25分、知識+1）、交換小事（10分、恢復精力）、晚安習慣（8分），以及四道可選料理（20分、食材2）；料理命中固定口味會有不同回應及加成，已解鎖的筆記會提供可使用的線索。每天同類活動一次。試交往至少三天且信任9後，可當面花6分鐘確認延續，保留原交往日期與承諾。

默契卡與電影共選是三回合的選擇玩法，每回合5分鐘、每人每週最多開始三局；問題讀取實際口味、相處偏好和目標。答對數影響結語、信任與親密，完成才給獎勵；取消不退開始次數，跨日離場與取消留宿不給睡前氛圍。這是文字選擇遊戲，不是實際影片或3D動畫。睡前原本直接完成的電影／遊戲入口已接到此流程，真正結束三回合後才增加當晚氛圍。

新增可保存／下載PNG紀念卡的回憶相簿，保存已完成事件、日常、節日、遊戲和當面留下的紀念。相簿區分文字紀念卡與專屬事件插畫，不把角色照片當作新合照或CG。朋友也能從交談頁展開相簿。新夜晚住家場景用在睡前頁，為共用場景，不宣稱81戶獨立房間。賴書妍S027依使用者後補圖鑑的自然光／生活感／皮膚細節方向，重製v02近景及全身雙視圖，仍標待確認；舊圖保留。其餘角色未整批更換。三張生成圖來源記於assets/romance/provenance.json。使用者圖鑑視為參考資料，未執行其腳本，原始圖鑑與其內嵌示範圖不公開上傳。

驗證：77項Node測試通過（16項新增），涵蓋事件分支及存檔、獎勵重複、日期、紀念日、日常成本、三回合結果、取消與跨週上限、留宿失效、相簿文字跳脫及試交往確認。瀏覽器實際走完一章事件及三回合默契卡，確認相簿與氛圍；桌面及390像素內嵌手機頁視覺檢查。全部沿用原存檔鍵，不重設玩家進度。

仍未完成：其餘80位的整批立繪重塑、全員專屬CG及表情差分、完整長篇個人路線、逐人獨立住家裝飾、真正的拍照或3D／真人影片動畫，以及新圖鑑列出的全部演出。不得將本版稱為整份提案全部完成。

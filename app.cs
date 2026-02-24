#:package GitHub.Copilot.SDK@0.1.23

using GitHub.Copilot.SDK;

var WORKING_DIRECTORY = @"D:\Code\DreamMaker";
var STORYBOOK_DIRECTORY = Path.Combine(WORKING_DIRECTORY, "storybook");
var STORY_CONFIG_PATH = Path.Combine(STORYBOOK_DIRECTORY, "story-config.json");
var SHARED_CONFIG_DIR = Path.Combine(WORKING_DIRECTORY, @"shared\story-config");
var BLOCKS_JSON_PATH = Path.Combine(SHARED_CONFIG_DIR, "blocks.json");
var OPTIONS_JSON_PATH = Path.Combine(SHARED_CONFIG_DIR, "options.json");
var BLUEPRINT_OUTPUT_PATH = Path.Combine(STORYBOOK_DIRECTORY, "blueprint.json");
var CHAPTER_TODOS_PATH = Path.Combine(STORYBOOK_DIRECTORY, "chapter-todos.json");
var CHAPTERS_DIRECTORY = Path.Combine(STORYBOOK_DIRECTORY, "chapters");
var CHAPTER_MEMORY_PATH = Path.Combine(STORYBOOK_DIRECTORY, "chapter-memory.json");
var AGENT_TIMEOUT = TimeSpan.FromHours(1);

// 根據目錄底下的 READMD.md 了解世界觀與人物設定等
// 設計故事框架

await using var client = new CopilotClient(new CopilotClientOptions
{
   LogLevel = "debug",
   CliArgs = ["--log-dir", Path.Combine(Directory.GetCurrentDirectory(), "logs")],
});

var inputArgs = Environment.GetCommandLineArgs().Skip(1).ToArray();
var command = inputArgs.Length > 0 ? inputArgs[0].ToLower() : "";

try
{
   switch (command)
   {
      case "blueprint":
         await RunBlueprintWorkflow();
         break;

      case "todo":
         await RunChapterTodoWorkflow();
         break;

      case "chapter":
         var target = inputArgs.Length > 1 ? inputArgs[1].ToLower() : "";
         if (target == "all")
         {
            for (int i = 1; i <= 12; i++)
               await RunChapterWritingWorkflow(i);
         }
         else if (int.TryParse(target, out int chapterIndex) && chapterIndex >= 1 && chapterIndex <= 12)
         {
            await RunChapterWritingWorkflow(chapterIndex);
         }
         else
         {
            PrintHelp();
         }
         break;

      default:
         PrintHelp();
         break;
   }
}
catch (Exception ex)
{
   await Log($"Fatal error occurred: {ex.Message}\n{ex.StackTrace}");
}

void PrintHelp()
{
   Console.WriteLine("""
   用法：dotnet app.cs <command> [options]

   Commands:
     blueprint          讀取 story-config.json，AI 產出 storybook/blueprint.json
     todo               讀取 blueprint.json，AI 為每章設計寫作 todo list，輸出至 storybook/chapter-todos.json
     chapter <n>        讀取藍圖 + 第 n 章 todo，AI 產出第 n 章小說正文，輸出至 storybook/chapters/chapter-{nn}.md
     chapter all        批次產出所有 12 章

   Examples:
     dotnet app.cs blueprint
     dotnet app.cs todo
     dotnet app.cs chapter 1
     dotnet app.cs chapter all
   """);
}

async Task<CopilotSession> CreateSessionWithConfig()
{
   return await client.CreateSessionAsync(new SessionConfig
   {
      WorkingDirectory = WORKING_DIRECTORY,
      Model = "gpt-5.2",
      ReasoningEffort = "xhigh",
      Provider = new ProviderConfig
      {
         Type = "azure",
         BaseUrl = "https://swedencentral.api.cognitive.microsoft.com/openai",
         Azure = new AzureOptions
         {
            ApiVersion = "2025-04-01-preview",
         },
         ApiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY_CODEX")
      }
   });
}

async Task RunBlueprintWorkflow()
{
   await Log("Starting blueprint generation workflow...");

   await using var session = await CreateSessionWithConfig();

   var response = await session.SendAndWaitAsync(
      new MessageOptions
      {
         Prompt = $"""
         你是一位專業的故事結構分析師與小說寫作顧問。

         請依照以下步驟產出章節寫作藍圖：

         **步驟 1：讀取並理解故事設定**
         讀取 `{STORY_CONFIG_PATH}`，了解：
         - 世界觀（era, genre, realismLevel, obstacleSources）
         - 基調（painLevel, pleasureLevel, misunderstandingIntensity, reversalFrequency, ending, wrongdoer, maleRedemption, femaleRedemption, maleReturn, femaleReturn）
         - 男女主角設定（姓名、身分、性格特質、資源等級、初始態度、核心創傷）
         - 12 個章節的事件序列（每個事件的 blockId, intensity, effects）及情緒指標（pleasure, pain, tension, misunderstanding）

         **步驟 2：讀取事件區塊定義**
         讀取 `{BLOCKS_JSON_PATH}`，了解每個 blockId 的中文名稱（nameZh）、說明（description）和分類（category）。
         如需了解各選項的中文標籤（例如 era、genre、initialAttitude 等），可參閱 `{OPTIONS_JSON_PATH}`。

         **步驟 3：為每個章節撰寫寫作藍圖**
         根據以上資訊，為每個章節分析並生成寫作藍圖。
         請自行設計最合適的藍圖結構，確保能幫助小說作者知道這一章節應該怎麼寫。
         考量角色個性、情緒曲線、前後章節的連貫性，以及章尾鉤子的效果。
         全程使用繁體中文。

         **步驟 4：輸出結果**
         將完整的藍圖以 JSON 格式輸出至 `{BLUEPRINT_OUTPUT_PATH}`。
         JSON 結構請自行決定，以最能呈現寫作藍圖價值的方式設計。

         完成後回覆「藍圖產生完成」及簡短摘要。
         """
      },
      AGENT_TIMEOUT
   );

   await Log($"Blueprint workflow completed.\n{response.Data.Content}");
}

async Task RunChapterTodoWorkflow()
{
   await Log("Starting chapter todo generation workflow...");

   await using var session = await CreateSessionWithConfig();

   var response = await session.SendAndWaitAsync(
      new MessageOptions
      {
         Prompt = $$"""
         你是一位專業的小說寫作顧問。

         請依照以下步驟，為每個章節產出細部寫作 Todo List：

         **步驟 1：讀取寫作藍圖**
         讀取 `{{BLUEPRINT_OUTPUT_PATH}}`，了解每個章節的：
         - chapterGoal（章節目標）
         - pov（敘事視角）
         - emotionalCurve（情緒曲線）
         - events（事件序列，含 beats、effects、notes）
         - characterFocus（角色重點）
         - sceneDesign（場景設計）
         - endingHook（章尾鉤子）

         **步驟 2：為每個章節設計寫作 Todo List**
         根據藍圖中每章的資訊，拆解出具體可執行的寫作任務，例如：
         - 場景設計（背景、氛圍、感官細節）
         - 對話設計（核心衝突台詞、潛台詞）
         - 角色行為設計（符合人設的反應與選擇）
         - 情緒轉折點（何時、如何轉換）
         - 伏筆布置（為後續章節埋下的線索）
         - 章尾鉤子具體寫法

         每個 todo 項目應足夠具體，讓作者知道該寫什麼、怎麼寫。
         全程使用繁體中文。

         **步驟 3：輸出結果**
         將完整的 todo list 以 JSON 格式輸出至 `{{CHAPTER_TODOS_PATH}}`。
         建議結構：
         {
           "chapters": [
             {
               "chapter": 1,
               "title": "章節簡稱",
               "todos": [
                 { "id": 1, "type": "scene|dialogue|character|emotion|foreshadowing|hook", "task": "具體任務描述", "hint": "寫作提示（可選）" },
                 ...
               ]
             },
             ...
           ]
         }

         完成後回覆「Todo List 產生完成」及簡短摘要。
         """
      },
      AGENT_TIMEOUT
   );

   await Log($"Chapter todo workflow completed.\n{response.Data.Content}");
}

async Task RunChapterWritingWorkflow(int chapterIndex)
{
   await Log($"Starting chapter {chapterIndex} writing workflow...");

   Directory.CreateDirectory(CHAPTERS_DIRECTORY);
   var chapterOutputPath = Path.Combine(CHAPTERS_DIRECTORY, $"chapter-{chapterIndex:D2}.md");

   await using var session = await CreateSessionWithConfig();

   var response = await session.SendAndWaitAsync(
      new MessageOptions
      {
         Prompt = $"""
         你是一位專業的言情小說作家，擅長現代娛樂圈題材，文筆細膩、對話有張力。

         請依照以下步驟，產出第 {chapterIndex} 章的小說正文：

         **步驟 1：讀取寫作藍圖**
         讀取 `{BLUEPRINT_OUTPUT_PATH}`，找到 chapter 為 {chapterIndex} 的章節資料，了解：
         - chapterGoal、pov、emotionalCurve
         - 所有 events（含 beats、effects、notes）
         - characterFocus（兩個角色的內在驅動、易踩雷、建議行為設計）
         - sceneDesign（推薦場景、節奏建議）
         - endingHook（章尾鉤子類型與寫法）
         - 完整記住 `characters` 欄位中每位角色的所有使用者設定（包含姓名、身份、性格等），後續全文必須嚴格遵循

         **步驟 2：讀取前章記憶**
         若 chapterIndex > 1，檢查 `{CHAPTER_MEMORY_PATH}` 是否存在：
         - 若存在，讀取其中所有已完成章節的記錄，了解：
           - 各章關鍵劇情事件（keyEvents）
           - 每位角色的情緒狀態、關鍵行動、關係現狀（characterStates）
           - 已揭露的新資訊與伏筆（newInfoRevealed）
           - 未解決的懸念（openThreads）
           - 前章最後的狀態（endingStatus）
         - 撰寫本章時，確保：
           - 角色行為與前章結尾狀態保持連貫
           - 不重複已經發生過的重大事件或相同對話
           - 延續或推進未解決的懸念
           - 避免 OOC（角色行為偏離前文建立的性格與情境）

         **步驟 3：讀取本章 Todo List**
         讀取 `{CHAPTER_TODOS_PATH}`，找到 chapter 為 {chapterIndex} 的 todos，了解本章需要完成的具體寫作任務。

         **步驟 4：撰寫小說正文**
         根據藍圖與 todo list，撰寫第 {chapterIndex} 章的完整小說正文。
         要求：
         - 每章至少 3000 字，力求 4000-5000 字
         - 以藍圖指定的 POV 為主視角
         - 逐一完成所有 todo 項目
         - 依循 events 的 beats 結構推進劇情
         - 對話要有潛台詞，避免平鋪直敘
         - 場景描寫要有代入感（視覺、聽覺、身體感受）
         - 章尾依照 endingHook 的類型收尾，留下懸念
         - 全程使用繁體中文
         - 所有角色的姓名、身份等設定，必須完全遵循藍圖 `characters` 欄位的使用者定義，不得自行創造、更名或替換任何角色設定

         **步驟 5：輸出結果**
         將完整的小說正文以 Markdown 格式輸出至 `{chapterOutputPath}`。
         格式：
         ```
         # 第 {chapterIndex} 章

         （正文內容）
         ```

         **步驟 6：更新故事記憶**
         從剛撰寫的章節中提取重點，更新 `{CHAPTER_MEMORY_PATH}`：
         - 若檔案不存在，建立新檔案
         - 若檔案已存在，在 `chapters` 陣列中 append 本章記錄，並更新 `lastUpdatedChapter`
         記錄格式（JSON）：
         {{
           "lastUpdatedChapter": {chapterIndex},
           "chapters": [ ...前章記錄... , {{
             "chapter": {chapterIndex},
             "keyEvents": ["3-5 條本章最重要的劇情事件，簡潔描述"],
             "characterStates": {{
               "角色名": {{
                 "emotionalState": "本章結尾時的情緒狀態",
                 "keyActions": ["影響後續的重要行動"],
                 "relationshipStatus": "與其他角色的關係現狀"
               }}
             }},
             "newInfoRevealed": ["本章新揭露的重要資訊或布下的伏筆"],
             "openThreads": ["本章留下的未解懸念"],
             "endingStatus": "本章最後一幕的場景與狀態，一句話描述"
           }}]
         }}

         完成後回覆「第 {chapterIndex} 章產生完成」及字數統計。
         """
      },
      AGENT_TIMEOUT
   );

   await Log($"Chapter {chapterIndex} writing workflow completed.\n{response.Data.Content}");
}

async Task Log(string message)
{
   Console.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}");
}

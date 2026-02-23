#:package GitHub.Copilot.SDK@0.1.23

using GitHub.Copilot.SDK;

var WORKING_DIRECTORY = @"D:\Code\DreamMaker";
var STORYBOOK_DIRECTORY = Path.Combine(WORKING_DIRECTORY, "storybook");
var STORY_CONFIG_PATH = Path.Combine(STORYBOOK_DIRECTORY, "story-config.json");
var BLOCKS_TS_PATH = Path.Combine(WORKING_DIRECTORY, @"story-generator-web\src\data\blocks.ts");
var BLUEPRINT_OUTPUT_PATH = Path.Combine(STORYBOOK_DIRECTORY, "blueprint.json");
var AGENT_TIMEOUT = TimeSpan.FromMinutes(10);

// 根據目錄底下的 READMD.md 了解世界觀與人物設定等
// 設計故事框架

await using var client = new CopilotClient(new CopilotClientOptions
{
   LogLevel = "debug",
   CliArgs = ["--log-dir", Path.Combine(Directory.GetCurrentDirectory(), "logs")],
});


try
{
   await RunBlueprintWorkflow();
}
catch (Exception ex)
{
   await Log($"Fatal error occurred: {ex.Message}\n{ex.StackTrace}");
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
         - 基調（painLevel, pleasureLevel, misunderstandingIntensity, reversalFrequency, ending, maleRedemption, femaleReturn）
         - 男女主角設定（姓名、身分、性格特質、資源等級、初始態度、核心創傷）
         - 12 個章節的事件序列（每個事件的 blockId, intensity, effects）及情緒指標（pleasure, pain, tension, misunderstanding）

         **步驟 2：讀取事件區塊定義**
         讀取 `{BLOCKS_TS_PATH}`，了解每個 blockId 的中文名稱（nameZh）、說明（description）和分類（category）。

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

async Task Log(string message)
{
   Console.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}");
}
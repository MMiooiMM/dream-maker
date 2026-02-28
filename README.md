# DreamMaker 📖✨

> 視覺化設定故事，AI 自動生成小說

DreamMaker 是一套「**設定器 + 生成器**」的完整創作系統：

- **Web 設定器**（`story-generator-web/`）— 像遊戲一樣，透過選項式操作打造 12 章故事配置，並可建立場景、角色定位與互動物件
- **CLI 生成器**（`app.cs`）— 讀取設定，驅動 AI 依序生成寫作藍圖、章節 Todo、完整小說章節

---

## 🗂 目錄結構

```
DreamMaker/
├── app.cs                        # .NET CLI 生成器（blueprint / todo / chapter 指令）
├── story-generator-web/          # React Web 故事設定器
│   └── src/
│       ├── components/           # UI 組件（設定面板、章節編輯器、儀表板）
│       ├── data/                 # 靜態資料（模板、事件區塊庫）
│       ├── features/             # 功能模組（自動排版、情緒引擎、匯出工具）
│       ├── pages/                # 頁面（首頁、專案列表、編輯器）
│       ├── stores/               # Zustand 狀態管理
│       └── types/                # TypeScript 型別定義
├── shared/story-config/          # 前後端共用資料（JSON 格式）
│   ├── blocks.json               # 事件區塊定義（30+ 個）
│   ├── options.json              # 所有下拉選項（世界觀、角色、基調等）
│   ├── templates.json            # 故事模板定義
│   ├── chapter-positions.json    # 章節定位標籤
│   ├── resources.json            # 角色資源定義
│   └── traits.json               # 性格特質定義
└── storybook/                    # 創作工作目錄（執行 CLI 後的輸出）
    ├── story-config.json         # 從 Web 匯出的故事設定
    ├── blueprint.json            # AI 產出的章節寫作藍圖
    ├── chapter-todos.json        # AI 產出的各章 Todo List
    ├── chapter-memory.json       # AI 維護的跨章記憶（自動更新）
    └── chapters/
        ├── chapter-01.md
        ├── chapter-02.md
        └── ...
```

---

## 🔄 完整工作流程

```
[1] Web 設定器：打開瀏覽器，視覺化設定故事
       ↓ 匯出 JSON
[2] storybook/story-config.json
       ↓ dotnet app.cs blueprint
[3] storybook/blueprint.json（章節寫作藍圖）
       ↓ dotnet app.cs todo
[4] storybook/chapter-todos.json（各章細部 Todo）
       ↓ dotnet app.cs chapter all
[5] storybook/chapters/chapter-01~12.md（完整小說）
```

### Step 1 — Web 設定器

```bash
cd story-generator-web
npm install
npm run dev
# 開啟 http://localhost:5173
```

完成設定後，點擊「匯出」→「JSON」，將 `story-config.json` 下載至 `storybook/` 目錄。

### Step 2-5 — CLI 生成器

**環境需求：**
- .NET 9+（執行 C# script）
- 環境變數 `AZURE_OPENAI_API_KEY_CODEX`（Azure OpenAI API Key）

```bash
# 生成章節寫作藍圖（需 storybook/story-config.json）
dotnet app.cs blueprint

# 生成各章 Todo List（需 storybook/blueprint.json）
dotnet app.cs todo

# 生成單一章節
dotnet app.cs chapter 1

# 批次生成全部 12 章
dotnet app.cs chapter all
```

---

## 🛠 技術棧

| 部分 | 工具 |
|------|------|
| Web 設定器 | React 18 + TypeScript + Vite |
| UI | TailwindCSS + @dnd-kit |
| 狀態管理 | Zustand |
| 圖表 | Recharts |
| 本地儲存 | IndexedDB (Dexie.js) |
| CLI 生成器 | .NET C# Script |
| AI 模型 | GPT-5.2（Azure OpenAI）via GitHub Copilot SDK |

---

## 📖 詳細說明

- [Web 設定器說明](story-generator-web/README.md)
- [ABO 世界觀說明](docs/abo-world.md)

---

## 📝 License

MIT

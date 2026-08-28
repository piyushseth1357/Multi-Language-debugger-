# Multi-Language Automatic Error Debugger
> **Created & Maintained by Piyush Seth**

An intelligent, multi-language automatic error debugger for **VS Code, Cursor AI, Windsurf, IntelliJ IDEA, PyCharm, WebStorm, Android Studio, Sublime Text, Notepad++, Neovim, and Terminal**. Intercepts compile-time diagnostics, runtime exceptions, and Git errors in real-time with 1-click automatic code fixes.

---

## ⚡ Quick Start & Installation by Editor

### 1. 🔷 VS Code & VSCodium
1. Open VS Code and press `Ctrl + Shift + X` (or `Cmd + Shift + X` on macOS) to open the Extensions sidebar.
2. Search for **`Multi-Language Error Debugger`** or **`Piyush Seth`**.
3. Click **Install**.

---

### 2. ⚡ Cursor AI & Windsurf
1. Open Cursor AI or Windsurf and open the **Extensions** sidebar.
2. Search for **`Multi-Language Error Debugger`**.
3. Click **Install** *(Natively compatible via Microsoft Marketplace)*.

---

### 3. 🧠 IntelliJ IDEA, PyCharm, WebStorm, Android Studio & CLion
1. Open your JetBrains IDE and go to **Settings** (`Ctrl + Alt + S`) → **Plugins**.
2. Click the **Marketplace** tab.
3. Search for **`Multi-Language Error Debugger`** or **`Piyush Seth`**.
4. Click **Install** and restart IDE if prompted.

---

### 4. 💻 Sublime Text, Notepad++, Neovim, Atom & Terminal CLI

#### **Option A: Run Instantly (No Installation Required)**
Open any terminal shell and run:
```bash
npx piyushseth1357-error-debugger --lang hi "TypeError: Cannot read properties of undefined (reading 'name')"
```

#### **Option B: Global Command Line Install**
Run in your terminal:
```bash
npm install -g piyushseth1357-error-debugger
```
Then use anywhere:
```bash
piyushseth1357-error-debugger --lang hi "your error message"
```

---

## 🌐 Supported Languages & Language Switching

The debugger supports **4 languages**:
- 🇮🇳 **Hinglish / Hindi (`hi`)** *(Default)*
- 🇪🇸 **Spanish (`es`)**
- 🇫🇷 **French (`fr`)**
- 🇬🇧 **English (`en`)**

### How to Switch Language in VS Code / Cursor:
1. Click **`Error Debugger [HI]`** in the bottom-right status bar.
2. Select your preferred language from the QuickPick menu.
3. Or open Settings (`Ctrl + ,`) and set `errorDebugger.language` to `hi`, `es`, `fr`, or `en`.

---

## 🌟 Key Features

- **⚡ 1-Click Auto-Fix**: Automatically replaces erroneous code lines directly inside your active editor document.
- **📊 Live Debug Analytics**: Real-time counter tracking Analyzed Errors, Auto-Fixes Applied, and Total Time Saved.
- **Selective Batch Fixing**: Check or uncheck errors `[x]` to fix multiple workspace errors in 1 click.
- **🔑 Custom API Key Manager & Guide**: Built-in free API key wizard for Google Gemini, Groq, and offline local Ollama AI models.
- **🛡️ 100% Free & Offline Tier 1 Engine**: Operates at 0ms latency without requiring any internet connection or API keys for standard errors.

---

## 📄 License
Licensed under the [Apache License 2.0](LICENSE) - Free for personal, commercial, and open-source use.

*Created with ❤️ by **Piyush Seth***

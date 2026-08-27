# Multi-Language Automatic Error Debugger
> **Created & Maintained by Piyush Seth**

Automatic Compile-Time, Runtime, and Git Error Debugger for **VS Code, Cursor, IntelliJ IDEA, WebStorm, Sublime Text, Notepad++, Neovim, and Terminal**. Supports instant multi-language error explanations (**Hindi/Hinglish, Spanish, French, English**) with 1-click automatic code fixes.

---

## 🌐 Choose Your Language / Bhasha Chunein

- 🇬🇧 [English Guide](#-english-guide)
- 🇮🇳 [Hinglish / Hindi Guide (हिंदी गाइड)](#-hinglish--hindi-guide)
- 🇪🇸 [Guía en Español](#-guía-en-español)
- 🇫🇷 [Guide en Français](#-guide-en-français)

---

<a name="-english-guide"></a>
## 🇬🇧 English Guide

### 📌 Overview
The Multi-Language Error Debugger by **Piyush Seth** automatically intercepts code diagnostics, terminal runtime exceptions, and Git errors without any manual copy-pasting. It operates on a dual-engine architecture:
- **Tier 1 (Offline Local Database)**: 100% Free, 0ms fast, works without internet or API key for 90%+ errors.
- **Tier 2 (AI Fallback Engine)**: Supports Gemini, Groq, OpenAI, and Ollama for complex enterprise errors.

### 📥 How to Find & Install in Your Code Editor

#### 1. VS Code & VSCodium
- Open VS Code → Extensions tab (`Ctrl + Shift + X`).
- Search for: `Multi-Language Error Debugger` or `Piyush Seth`.
- Click **Install**.

#### 2. Cursor AI & Windsurf
- Open Cursor → Extensions sidebar.
- Search for: `Multi-Language Error Debugger`.
- Click **Install** (Uses VS Code / Open VSX engine natively).

#### 3. Sublime Text, Notepad++, Atom, Neovim & Terminal
- Open your terminal and run:
  ```bash
  npx error-debugger --lang en "TypeError: Cannot read properties of undefined (reading 'name')"
  ```
- Or install globally:
  ```bash
  npm install -g error-debugger-cli
  error-debugger --lang en "your error message"
  ```

#### 4. IntelliJ IDEA, WebStorm, PyCharm & JetBrains IDEs
- Open JetBrains IDE → Settings → Plugins.
- Search for: `Multi-Language Error Debugger` or install via CLI.

### ⚙️ How to Change Language in VS Code / Cursor
1. Click **`Error Debugger [EN]`** in the bottom-right status bar.
2. Select your preferred language: `Hinglish / Hindi (hi)`, `Spanish (es)`, `French (fr)`, or `English (en)`.
3. Or open Settings (`Ctrl + ,`) and search for `errorDebugger.language`.

---

<a name="-hinglish--hindi-guide"></a>
## 🇮🇳 Hinglish / Hindi Guide

### 📌 Overview
Yeh **Piyush Seth** dwara banaya gaya Multi-Language Error Debugger hai jo aapke code me aane wale compile errors, terminal runtime crashes, aur Git push/merge conflicts ko automatically detect karke aapki pasandida bhasha me samjhata hai.

### 📥 Alag-Alag Code Editors Me Kaise Install Karein

#### 1. VS Code Me Kaise Milega?
- VS Code kholein → Left sidebar me **Extensions Icon** (`Ctrl + Shift + X`) par click karein.
- Search bar me type karein: **`Multi-Language Error Debugger`** ya **`Piyush Seth`**.
- **Install** button par click karein.

#### 2. Cursor AI & Windsurf Editor Me:
- Cursor Editor me Extensions tab kholein.
- Search karein: **`Multi-Language Error Debugger`**.
- **Install** dabaayein (VS Code extensions natively Cursor me chalte hain).

#### 3. Terminal, Sublime Text, Notepad++ ya Neovim Me:
- Terminal kholein aur direct yeh command chalaayein:
  ```bash
  npx error-debugger --lang hi "TypeError: Cannot read properties of undefined"
  ```

#### 4. IntelliJ IDEA, WebStorm, PyCharm (JetBrains):
- JetBrains IDE kholein → Settings → Plugins.
- Search karein: `Multi-Language Error Debugger` aur **Install** karein.

### 💡 Features & Usage
- **Bug Icon `$(bug)` Sidebar**: Left Activity Bar me Bug Icon par click karke full Error Explanation Panel kholein.
- **✨ 1-Click Auto-Fix**: Error card me **Apply Fix in Editor** button dabaayein, aapka code auto-fix ho jayega!
- **⚡ Selective / Batch Fix**: Agar 15-100 errors hain, toh checkboxes `[x]` se select karke **⚡ Fix All Selected** button se 1 second me batch-fix karein!

---

<a name="-guía-en-español"></a>
## 🇪🇸 Guía en Español

### 📌 Resumen
El Depurador de Errores Multilingüe creado por **Piyush Seth** detecta automáticamente errores de compilación, excepciones en la terminal y conflictos de Git.

### 📥 Cómo Buscar e Instalar en su Editor

#### 1. VS Code y Cursor AI
- Abra VS Code o Cursor → Pestaña de Extensiones (`Ctrl + Shift + X`).
- Busque: `Multi-Language Error Debugger` o `Piyush Seth`.
- Haga clic en **Instalar**.

#### 2. Línea de Comandos / Terminal (Sublime, Notepad++, Neovim)
- Ejecute en la terminal:
  ```bash
  npx error-debugger --lang es "fatal: remote origin already exists"
  ```

### ⚙️ Configuración de Idioma
- Haga clic en **`Error Debugger [ES]`** en la barra de estado inferior derecha y elija Español (`es`).

---

<a name="-guide-en-français"></a>
## 🇫🇷 Guide en Français

### 📌 Aperçu
Le Débogueur d’Erreurs Multilingue développé par **Piyush Seth** intercepte automatiquement les erreurs de code, les exceptions de terminal et les conflits Git.

### 📥 Installation dans votre Éditeur

#### 1. VS Code & Cursor AI
- Ouvrez VS Code ou Cursor → Onglet Extensions (`Ctrl + Shift + X`).
- Recherchez : `Multi-Language Error Debugger` ou `Piyush Seth`.
- Cliquez sur **Installer**.

#### 2. Terminal et Autres Éditeurs (Sublime, Notepad++, Neovim)
- Exécutez dans votre terminal :
  ```bash
  npx error-debugger --lang fr "SyntaxError: invalid syntax"
  ```

---

## 🛠️ Free Publishing & Free Deployment Platforms

| Platform | Target Audience / Editors | Cost |
|---|---|---|
| **GitHub** | Source Code & Open-Source Releases | **100% Free** |
| **VS Code Marketplace** | VS Code, VSCodium | **100% Free** |
| **Open VSX Registry** | Cursor AI, Windsurf, Eclipse Theia | **100% Free** |
| **NPM Registry** | Sublime Text, Notepad++, Neovim, Terminal CLI | **100% Free** |
| **JetBrains Marketplace** | IntelliJ IDEA, WebStorm, PyCharm | **100% Free** |

---
*Created with ❤️ by Piyush Seth*

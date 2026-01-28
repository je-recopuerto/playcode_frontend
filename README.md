# PlayCode 🎮

> An interactive browser-based code playground for learning and experimenting with code. Execute C++, Python, and TypeScript directly in your browser with zero installation.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-C%2B%2B%20%7C%20Python%20%7C%20TypeScript-brightgreen)](https://github.com/je-recopuerto/playcode)
[![Deployed](https://img.shields.io/badge/deployed-yes-success)](https://infinitexyy.github.io/playcode/)

## ✨ Features

- 🎯 **Multi-language Support**: Write code in C++, Python, and TypeScript/JavaScript
- ⚡ **Instant Execution**: Run code directly in your browser with no setup required
- 📖 **Monaco Editor**: Powerful code editor with syntax highlighting and auto-completion
- 💻 **Interactive Terminal**: Built-in xterm for command-line interaction
- 🤖 **AI Assistant**: Integrated AI chat for code help and suggestions
- 🔌 **Offline Python**: Full offline support with pre-loaded scientific packages
  - NumPy, SciPy, Matplotlib, Pandas, SymPy, PIL, and more
- 🚀 **WebAssembly**: Uses WASM for fast, client-side code execution
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

## 🚀 Quick Start

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/je-recopuerto/playcode.git
cd playcode
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure backend API URL**:
   Create a `.env` file in the root directory:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server**:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run serve
```

## 🐍 Offline Python Support

PlayCode includes **complete offline functionality** for Python code execution. No internet connection required after initial load!

### Pre-loaded Python Packages

The following essential packages are automatically pre-loaded:

| Package | Purpose |
|---------|---------|
| **NumPy** | Scientific computing - arrays, matrices, math functions |
| **SciPy** | Advanced mathematics - optimization, integration, signal processing |
| **Matplotlib** | Data visualization and plotting |
| **Pandas** | Data manipulation and analysis |
| **SymPy** | Symbolic mathematics and algebra |
| **Pillow (PIL)** | Image processing and manipulation |
| **Micropip** | Package management for Python |

### How It Works

1. **Smart Loading**: Numpy loads first and gets verified before other packages
2. **Dependency Aware**: Packages only load if their dependencies are ready
3. **Individual Error Handling**: Each package failure is isolated and reported
4. **Emergency Recovery**: Failed imports trigger automatic reloading during execution
5. **Fast Execution**: Package loading happens once at startup; subsequent runs are instant

### Benefits

✅ Zero network dependency for code execution  
✅ Fast package loading with caching  
✅ Reliable offline coding experience  
✅ No runtime download delays  
✅ Robust error handling and recovery  
✅ Comprehensive package verification  
✅ Smart state tracking to prevent redundant loading


## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 17, TypeScript 4.3, Vite 2 |
| **Styling** | WindiCSS, Headless UI |
| **Code Editor** | Monaco Editor |
| **Terminal** | XTerm.js |
| **State Management** | Zustand |
| **Runtime** | Pyodide, Sucrase, wasm-clang |
| **Build Tool** | Vite with React Refresh |

## 🎓 Use Cases

- 📚 **Learning**: Practice coding without installing anything
- 🧪 **Experimentation**: Try new ideas and algorithms quickly
- 📊 **Data Science**: Test Python data analysis and visualization code
- 🔧 **Prototyping**: Rapidly prototype and test ideas
- 👨‍💻 **Tutorials**: Interactive coding tutorials and documentation
- 🤝 **Collaboration**: Share code snippets with live execution

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── editor.tsx      # Code editor component
│   ├── terminal.tsx    # Terminal component
│   ├── ai-chat.tsx     # AI assistant chat
│   ├── header.tsx      # Top header
│   └── layout.tsx      # Main layout
├── core/               # Language runtimes
│   ├── cpp/            # C++ runtime (wasm-clang)
│   ├── python/         # Python runtime (Pyodide)
│   └── typescript/     # TypeScript runtime (Sucrase)
├── module/             # App modules
│   ├── runner.ts       # Code execution engine
│   ├── ai-chat.ts      # AI integration
│   └── types.ts        # TypeScript types
└── App.tsx             # Main app component
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

It also includes code and assets from:
- LLVM Project ([LICENSE.llvm](LICENSE.llvm))
- Vasm project ([LICENSE.vasm](LICENSE.vasm))

## 👨‍💻 Author

**je-recopuerto** - [GitHub Profile](https://github.com/je-recopuerto)

## 🙏 Acknowledgments

- Built with amazing open-source projects
- Inspired by online code playgrounds
- Thanks to all contributors and users

---

<div align="center">

**[Try PlayCode Now](https://je-recopuerto/playcode/)** • **[Report Issues](https://github.com/je-recopuerto/playcode/issues)** • **[Discussions](https://github.com/je-recopuerto/playcode/discussions)**

Made with ❤️ by the PlayCode team

</div>

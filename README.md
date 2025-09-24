# Slacking Off Editor 摸鱼编辑器

**Read books while pretending to work. 边假装工作边看书。**

---

## About The Project 项目介绍

Have you ever wanted to catch up on your reading list at work, but felt the prying eyes of your colleagues or boss? The Slacking Off Editor is your solution. It looks and feels like a simple, distraction-free text editor, allowing you to type, edit, and write as you normally would. 

还在为想在公司读书却害怕被人发现而烦恼吗？Slacking Off Editor（摸鱼编辑器）就是你的解决方案。它看起来就是一个简单的无干扰文本编辑器，让你可以像平时一样打字、编辑和写作。

However, with a secret hotkey, you can instantly transform a line of your editor into a hidden e-reader, displaying content from your favorite `.epub` or `.txt` files. This allows you to discreetly read a few pages and then quickly switch back to your "work" when someone walks by.

不过，借助秘密按键，你就能瞬间把编辑器的一行变成隐藏的电子阅读器，显示你最喜欢的 `.epub` 或 `.txt` 文件内容。这样你就能偷偷看几页，等有人路过时又能迅速切回"工作"界面。

## Features 特色功能

*   **Discreet Reading 偷摸看书:** Read your books inside a fully functional text editor 在一个功能完整的文本编辑器里看你的书。
*   **Automatic Progress Saving 自动存进度:** Your reading position for the last 5 books is automatically saved. Pick up right where you left off! 自动保存最近5本书的阅读进度，下次打开直接从上次看到的地方继续！
*   **Boss Key 老板键:** Instantly toggle between writing and reading mode with a secret hotkey (`Ctrl+Shift+S`) 用秘密热键（`Ctrl+Shift+S`）秒速切换写代码和看书模式。
*   **Supports Your Books 支持各种书:** Load any `.epub` or `.txt` file 随便加载 `.epub` 或 `.txt` 文件。
*   **Customizable 可自定义:** Choose which line to display the book content on and how many characters to show at a time 选在第几行显示书籍内容，还能调一行显示多少字。
*   **Realistic UI 逼真界面:** A clean, paper-like interface with dynamic line numbers that looks like a real writing tool 干净的纸质界面，带动态行号，看起来就像是个正经写作工具。
*   **Word & Character Count 字数统计:** Real-time feedback on your writing 实时显示你写了多少字。
*   **Export 导出功能:** Save your written text to a `.txt` file 把你写的内容存成 `.txt` 文件。

## How to Use 使用方法

1.  **Clone the repo 克隆仓库:**
    ```sh
    git clone https://github.com/troyanovsky/slacking_off_editor.git
    ```
2.  **Install NPM packages 安装依赖:**
    ```sh
    npm install
    ```
3.  **Run the app 运行程序:**
    ```sh
    npm run dev
    ```
4.  **Configure your book 设置你的书:**
    *   Click the "Settings" button 点击"Settings"按钮。
    *   Upload your `.epub` or `.txt` file 上传 `.epub` 或 `.txt` 文件。
    *   Set your desired "injection line" and "line length" 设置"注入行"和"行长度"。
5.  **Start slacking! 开始摸鱼!:**
    *   Press `Ctrl+Shift+S` to toggle reading mode 按 `Ctrl+Shift+S` 切换到阅读模式。
    *   Use the left and right arrow keys to navigate through your book 用左右箭头键翻页。

## Deployed App 在线体验

Try the app online: [https://slacking-off-editor.vercel.app/](https://slacking-off-editor.vercel.app/)

在线体验：[https://slacking-off-editor.vercel.app/](https://slacking-off-editor.vercel.app/)

## Contributing 参与贡献

Contributions, issues, and feature requests are welcome!

欢迎贡献代码、提交问题和功能建议！

We are always looking for new ideas to make the Slacking Off Editor even better (and more discreet). Feel free to open an issue to report a bug or suggest a new feature.

我们一直在想方设法让Slacking Off Editor（摸鱼编辑器）变得更好（和更隐蔽）。发现问题或者有好点子的话，欢迎提issue。

如果你想贡献代码，fork这个仓库然后提交pull request就行。

1.  Fork the Project (Fork项目)
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`) (创建你的功能分支 (`git checkout -b feature/AmazingFeature`))
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`) (提交修改 (`git commit -m 'Add some AmazingFeature'`))
4.  Push to the Branch (`git push origin feature/AmazingFeature`) (推送到分支 (`git push origin feature/AmazingFeature`))
5.  Open a Pull Request (提交Pull Request)

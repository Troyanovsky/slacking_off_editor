# Product Requirements: **Disguised Text Editor with Hidden E-Reader**

## 1. Value Proposition

Users can discreetly read books of their choice while pretending to write in a plain text editor. To external observers, the app looks like a normal writing tool. Hidden features allow switching to “reading mode” where book content is embedded into the editor view.

---

## 2. Key Features

### 2.1 Text Editor (Primary Interface)

* **Viewport**

  * Large central editable text area.
  * Background color: `#f6eee3` (paper-like).
  * Text color: Black.
  * Text wraps if line exceeds viewport width.
  * Vertical scrolling enabled.

* **Editor Behavior**

  * Fully functional text input (typing, editing, deleting, copy/pasting). No rich text formatting.
  * Word wrap enabled.

### 2.2 Bottom Toolbar

* **Export button**

  * Allows saving/exporting text (e.g., as `.txt`).
* **Word/Character count display**

  * Updates in real-time as user types.
* **Settings button**

  * Opens popup for configuration.

### 2.3 Settings Popup

* Options:

  1. **Load Book**: Choose an `.epub` or `.txt` file.
  2. **Line Injection Control**: Input field to specify which editor line will be replaced by book content (default = line 5). Line length input field to specify how many characters are in this line each time (default = 80). These settings are saved to localStorage.
  3. **Help/Info Section**: Brief explanation of:

     * How the disguised reading works.
     * Keyboard shortcuts (boss key, page navigation).

### 2.4 Reading Mode (Slacking Mode)

* **Triggered by Boss Key Shortcut** (`Ctrl/Command+Shift+S`).
* Behavior:

  * Normal text editor content is preserved.
  * At the chosen line number, the displayed content is swapped with book content.
  * User can navigate book content with keyboard shortcuts:

    * Next page (→ or PgDn).
    * Previous page (← or PgUp).
  * Only the selected line updates with book content; everything else remains normal and editable.
  * Word/character count excludes injected book text (only user text is counted).
* **Exit Reading Mode**: Boss key returns editor to normal typing view.

---

## 3. Functional Requirements

1.  **Text Editor Requirements**

    *   Must support typing, editing, deleting, and scrolling.
    *   Must display line numbers dynamically.
    *   Must persist user text independently from injected book content.

2.  **Book Handling**

    *   Must parse and display `.txt` files directly.
    *   Must parse `.epub` files and extract plain text (ignoring heavy formatting).
    *   Inject book content line by line.

3.  **Settings**

    *   File upload for book files.
    *   Integer input for “injection line” (with input validation).
    *   Display help instructions.

4.  **Boss Key**

    *   Toggle between modes instantly.
    *   Must hide book content fully in “normal mode.”

5.  **Reading Progress Persistence**

    *   The application must save the reading progress for the last 5 unique books.
    *   Progress is defined as the last viewed page number.
    *   When a previously loaded book is opened again, the user should be taken to their last saved page.
    *   Book uniqueness is determined by the content of the file.

---

## 4. Non-Functional Requirements

*   **Stealth**

    *   UI must look like a normal, distraction-free text editor.
    *   No flashy animations or indicators of “hidden mode.”
*   **Performance**

    *   Smooth switching between modes with minimal lag.
    *   Handle large book files efficiently.
    *   Reading and writing progress to `localStorage` should be efficient and not block the UI.
*   **Cross-Platform**

    *   Should work on desktop browsers. No need for mobile.
*   **Accessibility**

    *   Default font should be readable, typewriter-like.

---

## 5. User Flows

**Flow 1: Normal Writing**

1.  Open app → Type in editor.
2.  Export or monitor word count as needed.

**Flow 2: Configure Hidden Reader**

1.  Open settings.
2.  Upload `.epub`/`.txt`. The app automatically loads the last read page for that book if it exists.
3.  Set injection line and line length.
4.  Close settings.

**Flow 3: Reading Mode**

1.  Hit boss key → editor switches to slacking mode.
2.  Book text injected at configured line, starting from the last read position.
3.  Navigate with keyboard shortcuts. Progress is saved automatically.
4.  Hit boss key again → return to normal writing view.
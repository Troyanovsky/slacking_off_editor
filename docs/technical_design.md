# Technical Design: Disguised Text Editor

This document outlines the technical architecture and design for the Disguised Text Editor, a front-end only web application based on the specifications in the Product Requirements Document (PRD).

## 1. Architecture & Tech Stack

The application will be a single-page application (SPA) built with a modern, minimal-dependency approach to ensure fast performance and easy deployment.

- **Framework**: **React** (with TypeScript) will be used for its component-based architecture and robust ecosystem. TypeScript will provide type safety and improve developer experience.
- **Styling**: **Plain CSS Modules** will be used for styling to keep the application lightweight and avoid dependencies on large CSS frameworks. The styles will be co-located with their respective components.
- **State Management**: **React Hooks** (`useState`, `useReducer`, `useContext`) will manage all application state. This avoids the need for external state management libraries like Redux, simplifying the architecture.
- **Book Parsing**:
    - **`.txt` files**: Will be read using the native `FileReader` API.
    - **`.epub` files**: A lightweight library like **`epub.js`** will be used to parse the file and extract its text content.
- **Persistence**: **`localStorage`** will be used to store user settings (injection line, line length) across sessions.

## 2. High-Level Design

The application is composed of several distinct components that manage different parts of the UI and logic. A central `AppContext` will provide shared state to all components that need it, such as the slacking mode status, book content, and settings.

```
+---------------------------------------------------+
|                       App                         |
|                                                   |
|  +-----------------+   +------------------------+ |
|  |   LineNumbers   |   |         Editor         | |
|  | (Displays line  |   | (Handles text input &  | |
|  |    numbers)     |   |  displays book content)| |
|  +-----------------+   +------------------------+ |
|                                                   |
|  +----------------------------------------------+ |
|  |                    Toolbar                   | |
|  | (+ Export, Word Count, Settings Button +)    | |
|  +----------------------------------------------+ |
|                                                   |
|  +----------------------------------------------+ |
|  |                SettingsModal                 | |
|  | (+ Load Book, Configure, Help +)             | |
|  +----------------------------------------------+ |
|                                                   |
+---------------------------------------------------+
```

## 3. Component Breakdown

### `App.tsx`
- **Responsibility**: The root component. It will initialize the main context provider, manage global state (like `isSlackingMode`), and handle the "Boss Key" global keyboard shortcut.
- **State**: `isSlackingMode`, `book`, `settings`.

### `Editor.tsx`
- **Responsibility**: The core component for text interaction. It will render a `<textarea>` for user input. In "Slacking Mode," it will dynamically display the appropriate line of the book at the configured injection line.
- **Props**: `userText`, `setUserText`.
- **Internal Logic**: It will derive the displayed content by combining `userText` with the book content when `isSlackingMode` is active.

### `LineNumbers.tsx`
- **Responsibility**: Displays the line numbers in a separate column that scrolls in sync with the editor's textarea.
- **Props**: `lineCount`.

### `Toolbar.tsx`
- **Responsibility**: A container for the bottom bar controls.
- **Children**: `WordCounter.tsx`, `ExportButton.tsx`, `SettingsButton.tsx`.

### `WordCounter.tsx`
- **Responsibility**: Displays the real-time word and character count of the `userText`.
- **Logic**: It will calculate the counts based on the `userText` state, ignoring any injected book content.

### `SettingsModal.tsx`
- **Responsibility**: A modal dialog for all user configuration.
- **Internal Logic**:
    - Handles file input for `.txt` and `.epub` files.
    - Contains input fields for `injectionLine` and `lineLength`.
    - Saves settings to `localStorage` on change.
    - Displays the help section.

## 4. Data Structures & State Management

The primary state will be managed via a React Context named `AppContext`.

```typescript
interface AppState {
  userText: string;
  isSlackingMode: boolean;
  book: {
    content: string[]; // Array of strings, each representing a "page" or chunk
    isLoaded: boolean;
  };
  settings: {
    injectionLine: number;
    lineLength: number;
  };
  currentPage: number;
}
```

- **`userText`**: The full string of text typed by the user.
- **`isSlackingMode`**: A boolean flag to toggle the reading mode.
- **`book.content`**: The parsed text of the loaded book, pre-chunked into pages based on the `lineLength` setting.
- **`settings`**: The user-configurable values, loaded from `localStorage`.
- **`currentPage`**: The index of the `book.content` array currently being displayed.

## 5. Core Logic Flows

### Book Loading and Parsing
1.  User selects a file in `SettingsModal`.
2.  A utility function checks the file extension.
3.  If `.txt`, `FileReader.readAsText()` is used.
4.  If `.epub`, `epub.js` is used to load the book and extract its plain text content.
5.  The raw text is then split into an array of "pages" based on the `lineLength` setting and stored in the `book.content` state.

### "Slacking Mode" Activation
1.  A global event listener for `keydown` is attached in the `App` component.
2.  On `Ctrl/Cmd+Shift+S`, the `isSlackingMode` boolean in the central state is toggled.
3.  The `Editor` component re-renders. If `isSlackingMode` is true, it replaces the text at `settings.injectionLine` with `book.content[currentPage]`.

### Page Navigation
1.  When `isSlackingMode` is true, the `App` component listens for `ArrowRight` and `ArrowLeft` key presses.
2.  These keys will increment or decrement the `currentPage` state, causing the `Editor` to display the next or previous page of the book.

## 6. Directory Structure

A standard `create-react-app` directory structure will be used:

```
/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Editor.tsx
│   │   ├── Editor.module.css
│   │   ├── LineNumbers.tsx
│   │   └── ...
│   ├── context/
│   │   └── AppContext.tsx
│   ├── hooks/
│   │   └── useKeyPress.ts
│   ├── lib/
│   │   └── bookParser.ts
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   └── index.tsx
└── package.json
```

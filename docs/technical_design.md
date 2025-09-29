# Technical Design: Disguised Text Editor

This document outlines the technical architecture and design for the Disguised Text Editor, a front-end only web application based on the specifications in the Product Requirements Document (PRD).

## 1. Architecture & Tech Stack

The application will be a single-page application (SPA) built with a modern, minimal-dependency approach to ensure fast performance and easy deployment.

- **Framework**: **React** (with TypeScript) will be used for its component-based architecture and robust ecosystem. TypeScript will provide type safety and improve developer experience.
- **Styling**: **Plain CSS Modules** will be used for styling to keep the application lightweight and avoid dependencies on large CSS frameworks. The styles will be co-located with their respective components.
- **State Management**: **React Hooks** (`useState`, `useEffect`) are used to manage all application state within the root `App.tsx` component. State is then passed down to child components via props.
- **Book Parsing**:
    - **`.txt` files**: Will be read using the native `FileReader` API.
    - **`.epub` files**: The **`jszip`** library is used to unpack the EPUB file (which is a ZIP archive), and the browser's built-in **`DOMParser`** is used to parse the XML content inside to extract the text content.
- **Persistence**: **`localStorage`** is used to store user settings and reading progress.

## 2. High-Level Design

The application is composed of several distinct components that manage different parts of the UI and logic. The root `App` component manages all shared state and passes it down to child components as needed.

```
+-------------------------------------------+
|                   App                     |
| (Manages all state and logic)             |
|                                           |
|  +-------------------------------------+ | 
|  |              Editor                 | | 
|  | (Renders user text and book page)   | | 
|  +-------------------------------------+ | 
|                                           |
|  +-------------------------------------+ | 
|  |              Toolbar                | | 
|  | (+ Export, Word Count, Settings +)  | | 
|  +-------------------------------------+ | 
|                                           |
|  +-------------------------------------+ | 
|  |           SettingsModal             | | 
|  | (+ Load Book, Configure, Help +)    | | 
|  +-------------------------------------+ | 
|                                           |
+-------------------------------------------+
```

## 3. Component Breakdown

### `App.tsx`
- **Responsibility**: The root component. It manages all application state (e.g., `userText`, `isSlackingMode`, `book` content, `settings`) and passes it down to child components. It also handles global keyboard shortcuts for the boss key and page navigation.
- **State**: `isSlackingMode`, `book`, `settings`, `userText`, `currentPage`.

### `Editor.tsx`
- **Responsibility**: The core component for text interaction. It renders a `contentEditable` `<div>` to allow for mixed content (editable user text and non-editable book pages).
- **Props**: `userText`, `setUserText`, `isSlackingMode`, `bookPage`, `injectionLine`.
- **Internal Logic**: 
    - Generates the `innerHTML` for the `div` by combining the user's text with a non-editable `<span>` for the book page in slacking mode.
    - Uses `onInput`, `onKeyDown`, and `onClick` event handlers to create a custom editing experience where the user can edit their own text but not the book content.
    - Manages cursor behavior to skip over the non-editable book content.

### `Toolbar.tsx`
- **Responsibility**: A container for the bottom bar controls.
- **Children**: `WordCounter.tsx`, `ExportButton.tsx`, `SettingsButton.tsx`.

### `WordCounter.tsx`
- **Responsibility**: Displays the real-time word and character count of the `userText`.
- **Logic**: It calculates the counts based on the `userText` state, ignoring any injected book content.

### `SettingsModal.tsx`
- **Responsibility**: A modal dialog for all user configuration.
- **Internal Logic**:
    - Handles file input for `.txt` and `.epub` files.
    - Contains input fields for `injectionLine` and `lineLength`.
    - Saves settings to `localStorage` on change.
    - Displays the help section.

## 4. Data Structures & State Management

All primary state is managed within the `App.tsx` component using `useState` hooks.

- **`userText`**: The full string of text typed by the user.
- **`isSlackingMode`**: A boolean flag to toggle the reading mode.
- **`book`**: An object containing the parsed book content (`content`), a flag indicating if it's loaded (`isLoaded`), the file name, and a hash of the file content.
- **`settings`**: The user-configurable values (`injectionLine`, `lineLength`), loaded from `localStorage`.
- **`currentPage`**: The index of the `book.content` array currently being displayed.

## 5. Core Logic Flows

### Book Loading and Parsing
1.  User selects a file in `SettingsModal`.
2.  A utility function in `App.tsx` checks the file extension.
3.  The file is parsed using helper functions in `bookParser.ts`.
4.  The raw text is then split into an array of "pages" based on the `lineLength` setting and stored in the `book` state.

### "Slacking Mode" Activation
1.  A global event listener for `keydown` (from the `useKeyPress` hook) is attached in the `App` component.
2.  On `Ctrl/Cmd+Shift+S`, the `isSlackingMode` boolean in the state is toggled.
3.  The `Editor` component re-renders. If `isSlackingMode` is true, it generates an `innerHTML` that includes the user's text and the book content wrapped in a non-editable `<span contentEditable="false">`.
4.  The user can continue to edit their own text, and the editor's event handlers prevent interaction with the book `span`.

### Page Navigation
1.  When `isSlackingMode` is true, the `useKeyPress` hooks in `App` for `ArrowRight` and `ArrowLeft` are active.
2.  These keys will increment or decrement the `currentPage` state, causing the `Editor` to display the next or previous page of the book.
3.  When `isSlackingMode` is false, the callbacks for these keys do nothing, allowing the default cursor movement behavior in the editor.

## 6. Directory Structure

A standard Vite + React project structure is used:

```
/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   │   ├── Editor.tsx
│   │   └── ...
│   ├── hooks/        # Custom React hooks
│   │   └── useKeyPress.ts
│   ├── lib/          # Helper functions (parsing, etc.)
│   │   ├── bookParser.ts
│   │   └── hash.ts
│   ├── types/        # TypeScript type definitions
│   ├── App.tsx       # Main application component
│   ├── App.css
│   └── main.tsx      # Entry point
└── package.json
```

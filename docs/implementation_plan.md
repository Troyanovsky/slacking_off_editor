# Implementation Plan: Disguised Text Editor

This document breaks down the development of the Disguised Text Editor into a series of sequential, testable tasks.

### Phase 1: Project Setup & Core Editor UI

**Goal**: Create the basic project structure and a functional, styled text editor.

1.  **Task 1.1: Initialize Project**
    - Set up a new React project with TypeScript using Vite or Create React App.
    - Command: `npm create vite@latest slacking_off_editor -- --template react-ts`

2.  **Task 1.2: Basic Layout & Styling**
    - Create the main `App.tsx` layout.
    - Implement the paper-like background (`#f6eee3`) and default text color in `global.css`.
    - Create the `Editor` and `LineNumbers` components.
    - Style the components to match the PRD, ensuring the editor is a simple textarea and line numbers are displayed alongside.

3.  **Task 1.3: Dynamic Line Numbers**
    - Implement the logic to count the lines in the `Editor`'s textarea.
    - Ensure the `LineNumbers` component updates dynamically as the user types, adds, or removes lines.

### Phase 2: Toolbar & Settings

**Goal**: Implement the bottom toolbar and the settings modal for configuration.

1.  **Task 2.1: Build Toolbar UI**
    - Create the `Toolbar.tsx` component.
    - Add placeholder buttons for Export and Settings, and a `WordCounter.tsx` component.

2.  **Task 2.2: Implement Word/Character Count**
    - In `WordCounter.tsx`, subscribe to the user's text state.
    - Implement logic to calculate and display the word and character counts in real-time.

3.  **Task 2.3: Build Settings Modal UI**
    - Create the `SettingsModal.tsx` component, triggered by the settings button.
    - Add the UI for file upload, `injectionLine` input, `lineLength` input, and the help section.

4.  **Task 2.4: Implement Settings Persistence**
    - Use `localStorage` to save and retrieve the `injectionLine` and `lineLength` values.
    - The application should load these settings on startup.

### Phase 3: Book Loading & Parsing

**Goal**: Enable users to load and parse book files.

1.  **Task 3.1: Implement File Loading**
    - In `SettingsModal.tsx`, use the `FileReader` API to handle the file input.

2.  **Task 3.2: Create Book Parser Utility**
    - Create a `lib/bookParser.ts` utility.
    - For `.txt` files, simply return the text content.
    - For `.epub` files, use `jszip` to unpack the EPUB (which is a ZIP archive) and `@xmldom/xmldom` to parse the XML content inside to extract the plain text.

3.  **Task 3.3: Manage Book State**
    - Store the parsed book content in the central `AppContext`.
    - Upon parsing, chunk the book's text into an array of "pages" based on the `lineLength` setting.

### Phase 4: "Slacking Mode" & Reading Functionality

**Goal**: Implement the core feature of the hidden e-reader.

1.  **Task 4.1: Implement the Boss Key**
    - Create a global keydown event listener (or a custom `useKeyPress` hook) in `App.tsx`.
    - Toggle the `isSlackingMode` state on `Ctrl/Cmd+Shift+S`.

2.  **Task 4.2: Implement Content Injection**
    - Modify the `Editor.tsx` component.
    - When `isSlackingMode` is true, it should programmatically replace the content at the `injectionLine` with the current book page.
    - Ensure the rest of the user's text remains visible and editable.

3.  **Task 4.3: Implement Page Navigation**
    - Add keydown listeners for `ArrowLeft` and `ArrowRight`.
    - When `isSlackingMode` is true, these keys should increment/decrement the `currentPage` state, thus changing the displayed book page.

### Phase 5: Finalization & Polish

**Goal**: Add the remaining functionality and refine the user experience.

1.  **Task 5.1: Implement Export to `.txt`**
    - Create the logic for the export button to download the content of `userText` as a `.txt` file.

2.  **Task 5.2: UI/UX Polish**
    - Ensure the transition between normal and slacking mode is seamless.
    - Verify that the UI looks like a simple, unassuming text editor.
    - Test with large book files to ensure acceptable performance.

3.  **Task 5.3: Final Testing & Deployment**
    - Perform end-to-end testing of all user flows.
    - Prepare the application for deployment on a static hosting platform like Vercel or Netlify.

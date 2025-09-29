import React, { useEffect, useRef, KeyboardEvent, MouseEvent, FormEvent } from 'react';
import styles from './Editor.module.css';

interface EditorProps {
  userText: string;
  setUserText: (text: string) => void;
  isSlackingMode: boolean;
  bookPage: string;
  injectionLine: number;
}

// Helper to escape HTML special characters
const escapeHtml = (text: string) => {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
};

const Editor: React.FC<EditorProps> = ({
  userText,
  setUserText,
  isSlackingMode,
  bookPage,
  injectionLine,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  // Ref to track the last rendered HTML to avoid unnecessary re-renders and cursor jumps
  const lastHtml = useRef<string>('');

  // Generates the HTML for the editor based on the current state
  const getDisplayedHtml = () => {
    let lines = userText.split('\n');
    
    if (isSlackingMode && bookPage) {
      const bookPageHtml = `<span class="${styles['book-page']}" contentEditable="false">${escapeHtml(bookPage)}</span>`;
      // Add padding lines if user text is shorter than the injection line
      if (lines.length < injectionLine) {
        const padding = Array(injectionLine - lines.length).fill('');
        lines.push(...padding);
      }
      // Insert the non-editable book page
      lines.splice(injectionLine - 1, 0, bookPageHtml);
    }

    // Wrap each line in a div to ensure block layout and proper line breaks.
    // An empty line is represented by <br> inside a div.
    return lines.map(line => `<div>${line || '<br>'}</div>`).join('');
  };

  // Effect to synchronize the DOM with React state when props change.
  useEffect(() => {
    const newHtml = getDisplayedHtml();
    // Only update the DOM if the generated HTML is different from what's already there.
    // This prevents cursor jumps during user input.
    if (editorRef.current && newHtml !== lastHtml.current) {
      editorRef.current.innerHTML = newHtml;
      lastHtml.current = newHtml;
    }
  }, [isSlackingMode, bookPage, injectionLine]);

  // Handles user input in the contentEditable div
  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    lastHtml.current = target.innerHTML; // Update our reference to the latest DOM state

    const children = Array.from(target.childNodes);
    // Reconstruct the userText string from the DOM, ignoring the book page
    const newText = children.map(node => {
      if (node.nodeType === 1 && (node as HTMLElement).classList.contains(styles['book-page'])) {
        return null; // Exclude book page from the text
      }
      // Handle empty lines which browsers might represent as a div with a <br>
      if (node.textContent === '' && (node as HTMLElement).querySelector('br')) {
        return '';
      }
      return node.textContent;
    }).filter(line => line !== null).join('\n');
    
    // Update the state in App.tsx, which will then trigger a re-render.
    setUserText(newText);
  };

  // Handles special key presses in slacking mode
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isSlackingMode) return;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    const targetNode = (range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer) as HTMLElement;

    // 1. Prevent deletion of the book page span
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const bookPageEl = editorRef.current?.querySelector(`.${styles['book-page']}`);
      if (!bookPageEl) return;

      // Safeguard: if cursor is inside the book page, prevent action.
      if (bookPageEl.contains(targetNode)) {
        e.preventDefault();
        return;
      }

      // Prevent deleting the span when cursor is at the start of the line AFTER it
      if (e.key === 'Backspace' && range.collapsed && range.startOffset === 0) {
        const lineAfter = bookPageEl.parentElement?.nextElementSibling;
        if (lineAfter === targetNode.parentElement) {
          e.preventDefault();
        }
      }

      // Prevent deleting the span when cursor is at the end of the line BEFORE it
      if (e.key === 'Delete' && range.collapsed) {
        const lineBefore = bookPageEl.parentElement?.previousElementSibling;
        if (lineBefore === targetNode.parentElement && range.startOffset === (targetNode.textContent?.length || 0)) {
          e.preventDefault();
        }
      }
    }
    
    // 2. Handle arrow keys to skip over the book page
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const bookPageEl = editorRef.current?.querySelector(`.${styles['book-page']}`);
        if (!bookPageEl) return;

        const lineBefore = bookPageEl.parentElement?.previousElementSibling;
        const lineAfter = bookPageEl.parentElement?.nextElementSibling;

        // Moving down from the line before the book page
        if (e.key === 'ArrowDown' && lineBefore && lineBefore.contains(targetNode)) {
            e.preventDefault();
            const target = lineAfter || lineBefore; // Fallback if no line after
            const newRange = document.createRange();
            selection.removeAllRanges();
            newRange.selectNodeContents(target);
            newRange.collapse(true); // Move to start of the target line
            selection.addRange(newRange);
        }

        // Moving up from the line after the book page
        if (e.key === 'ArrowUp' && lineAfter && lineAfter.contains(targetNode)) {
            e.preventDefault();
            const target = lineBefore || lineAfter; // Fallback if no line before
            const newRange = document.createRange();
            selection.removeAllRanges();
            newRange.selectNodeContents(target);
            newRange.collapse(false); // Move to end of the target line
            selection.addRange(newRange);
        }
    }
  };

  // Prevent clicks on the book page from moving the cursor
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isSlackingMode && (e.target as HTMLElement).classList.contains(styles['book-page'])) {
      e.preventDefault();
    }
  };

  return (
    <div
      ref={editorRef}
      className={styles.editor}
      contentEditable={true}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      suppressContentEditableWarning={true} // Necessary for React with contentEditable
    />
  );
};

export default Editor;

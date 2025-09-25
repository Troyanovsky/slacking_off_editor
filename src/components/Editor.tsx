import React, { useEffect, useRef } from 'react';
import styles from './Editor.module.css';

interface EditorProps {
  userText: string;
  setUserText: (text: string) => void;
  isSlackingMode: boolean;
  bookPage: string;
  injectionLine: number;
}

const Editor: React.FC<EditorProps> = ({
  userText,
  setUserText,
  isSlackingMode,
  bookPage,
  injectionLine,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log('Editor props:', { isSlackingMode, bookPage, injectionLine });
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserText(event.target.value);
  };

  const getDisplayedText = () => {
    if (!isSlackingMode) {
      // When not in slacking mode, remove the book content that was inserted
      // by filtering out the book content if it exists
      if (!bookPage || bookPage.trim().length === 0) {
        return userText;
      }
      
      // Split the user text into lines
      const lines = userText.split('\n');
      
      // Try to remove book content from the injection position first
      if (lines.length >= injectionLine && lines[injectionLine - 1] === bookPage) {
        lines.splice(injectionLine - 1, 1);
        return lines.join('\n');
      }
      
      // If not at the expected position, look for the book content anywhere in the text
      const bookPageIndex = lines.indexOf(bookPage);
      if (bookPageIndex !== -1) {
        lines.splice(bookPageIndex, 1);
        return lines.join('\n');
      }
      
      // If book content is not found, return the original text
      return userText;
    }
    
    // Only insert book content if it exists
    if (!bookPage || bookPage.trim().length === 0) {
      console.log('No book content to insert');
      return userText;
    }
    
    const lines = userText.split('\n');
    if (lines.length < injectionLine) {
      const padding = Array(injectionLine - lines.length).fill('');
      lines.push(...padding);
    }
    // Insert book content at the injection line instead of replacing
    lines.splice(injectionLine - 1, 0, bookPage);
    return lines.join('\n');
  };

  return (
    <textarea
      ref={textareaRef}
      className={styles.editor}
      value={getDisplayedText()}
      onChange={handleChange}
      wrap="soft"
      readOnly={isSlackingMode}
    />
  );
};

export default Editor;

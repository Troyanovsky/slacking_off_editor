import React, { useEffect, useRef, useCallback } from 'react';
import styles from './Editor.module.css';

interface EditorProps {
  userText: string;
  setUserText: (text: string) => void;
  isSlackingMode: boolean;
  bookPage: string;
  injectionLine: number;
  lineNumbersRef: React.RefObject<HTMLDivElement>;
}

const Editor: React.FC<EditorProps> = ({
  userText,
  setUserText,
  isSlackingMode,
  bookPage,
  injectionLine,
  lineNumbersRef,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log('Editor props:', { isSlackingMode, bookPage, injectionLine });
  });

  const handleScroll = useCallback(() => {
    if (lineNumbersRef.current && textareaRef.current) {
      const textarea = textareaRef.current;
      const lineNumbers = lineNumbersRef.current;
      
      // Calculate the scroll ratio to ensure smooth synchronization
      const scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
      
      // Calculate the max scroll for line numbers
      const maxLineNumbersScroll = lineNumbers.scrollHeight - lineNumbers.clientHeight;
      
      // Apply the same scroll ratio to line numbers
      const newScrollTop = scrollRatio * maxLineNumbersScroll;
      
      lineNumbers.scrollTop = newScrollTop;
    }
  }, [lineNumbersRef]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserText(event.target.value);
  };

  const getDisplayedText = () => {
    if (!isSlackingMode) {
      return userText;
    }
    
    // Only inject book content if it exists
    if (!bookPage || bookPage.trim().length === 0) {
      console.log('No book content to inject');
      return userText;
    }
    
    const lines = userText.split('\n');
    if (lines.length < injectionLine) {
      const padding = Array(injectionLine - lines.length).fill('');
      lines.push(...padding);
    }
    lines[injectionLine - 1] = bookPage;
    return lines.join('\n');
  };

  // Synchronize scrolling when the component updates
  useEffect(() => {
    handleScroll();
  }, [userText, isSlackingMode, bookPage, handleScroll]);

  return (
    <textarea
      ref={textareaRef}
      className={styles.editor}
      value={getDisplayedText()}
      onChange={handleChange}
      onScroll={handleScroll}
      wrap="soft"
      readOnly={isSlackingMode}
    />
  );
};

export default Editor;

import React, { useEffect, useRef } from 'react';
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

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

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

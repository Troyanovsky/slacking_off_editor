import React from 'react';

interface WordCounterProps {
  wordCount: number;
  charCount: number;
}

const WordCounter: React.FC<WordCounterProps> = ({ wordCount, charCount }) => {
  return (
    <div>
      <span>Words: {wordCount}</span>
      <span style={{ marginLeft: '10px' }}>Characters: {charCount}</span>
    </div>
  );
};

export default WordCounter;

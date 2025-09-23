import React, { forwardRef } from 'react';
import styles from './LineNumbers.module.css';

interface LineNumbersProps {
  lineCount: number;
}

const LineNumbers = forwardRef<HTMLDivElement, LineNumbersProps>(({ lineCount }, ref) => {
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className={styles.lineNumbers} ref={ref}>
      {lines.map(lineNumber => (
        <div key={lineNumber} className={styles.lineNumber}>
          {lineNumber}
        </div>
      ))}
    </div>
  );
});

export default LineNumbers;

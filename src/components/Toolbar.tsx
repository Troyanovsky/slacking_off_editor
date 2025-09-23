import React from 'react';
import styles from './Toolbar.module.css';
import WordCounter from './WordCounter';
import ExportButton from './ExportButton';
import SettingsButton from './SettingsButton';

interface ToolbarProps {
  wordCount: number;
  charCount: number;
  onExport: () => void;
  onSettings: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ wordCount, charCount, onExport, onSettings }) => {
  return (
    <div className={styles.toolbar}>
      <WordCounter wordCount={wordCount} charCount={charCount} />
      <div className={styles.actions}>
        <ExportButton onExport={onExport} />
        <SettingsButton onSettings={onSettings} />
      </div>
    </div>
  );
};

export default Toolbar;

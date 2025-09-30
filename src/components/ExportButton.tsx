import React from 'react';
import styles from './Button.module.css';

interface ExportButtonProps {
  onExport: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
  return <button onClick={onExport} className={styles.button}>Export</button>;
};

export default ExportButton;

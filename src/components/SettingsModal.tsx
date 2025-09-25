import React from 'react';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    injectionLine: number;
    lineLength: number;
  };
  onSettingsChange: (settings: {
    injectionLine: number;
    lineLength: number;
  }) => void;
  onFileLoad: (file: File) => void;
  fileName: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onFileLoad,
  fileName,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileLoad(event.target.files[0]);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Settings</h2>
        <div className={styles.setting}>
          <label>Load Book (.txt, .epub):</label>
          <input type="file" accept=".txt,.epub" onChange={handleFileChange} />
          {fileName && <p>Loaded file: {fileName}</p>}
        </div>
        <div className={styles.setting}>
          <label>Injection Line:</label>
          <input
            type="number"
            value={settings.injectionLine}
            onChange={(e) =>
              onSettingsChange({ ...settings, injectionLine: parseInt(e.target.value) })
            }
          />
          <div className={styles.settingDescription}>
            The line number where book content will be displayed when reading mode is active
          </div>
        </div>
        <div className={styles.setting}>
          <label>Line Length:</label>
          <input
            type="number"
            value={settings.lineLength}
            onChange={(e) =>
              onSettingsChange({ ...settings, lineLength: parseInt(e.target.value) })
            }
          />
          <div className={styles.settingDescription}>
            The number of characters to show in the replaced line when reading mode is active
          </div>
        </div>
        <div className={styles.helpSection}>
          <h3>Help</h3>
          <p><b>Boss Key:</b> Ctrl+Shift+S to toggle reading mode.</p>
          <p><b>Navigation:</b> Left/Right arrow keys to change pages in reading mode.</p>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SettingsModal;

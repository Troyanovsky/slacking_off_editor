import React from 'react';
import modalStyles from './SettingsModal.module.css';
import buttonStyles from './Button.module.css';

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
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent}>
        <h2>Settings</h2>
        <div className={modalStyles.setting}>
          <label>Load Book (.txt, .epub):</label>
          <input type="file" accept=".txt,.epub" onChange={handleFileChange} />
          {fileName && <p>Loaded file: {fileName}</p>}
        </div>
        <div className={modalStyles.setting}>
          <label>Injection Line:</label>
          <input
            type="number"
            value={settings.injectionLine}
            onChange={(e) =>
              onSettingsChange({ ...settings, injectionLine: parseInt(e.target.value) })
            }
          />
          <div className={modalStyles.settingDescription}>
            The line number where book content will be displayed when reading mode is active
          </div>
        </div>
        <div className={modalStyles.setting}>
          <label>Line Length:</label>
          <input
            type="number"
            value={settings.lineLength}
            onChange={(e) =>
              onSettingsChange({ ...settings, lineLength: parseInt(e.target.value) })
            }
          />
          <div className={modalStyles.settingDescription}>
            The number of characters to show in the replaced line when reading mode is active
          </div>
        </div>
        <div className={modalStyles.helpSection}>
          <h3>How to Use</h3>
          <ol className={modalStyles.guideList}>
            <li>Choose a book to load.</li>
            <li>Adjust the injection line and line length as needed.</li>
            <li>Write your document as usual in writing mode.</li>
            <li>Toggle reading mode with the boss key (Ctrl+Shift+S).</li>
          </ol>
          <h3>Help</h3>
          <p><b>Boss Key:</b> Ctrl+Shift+S to toggle reading mode.</p>
          <p><b>Navigation:</b> Left/Right arrow keys to change pages in reading mode.</p>
        </div>
        <div className={modalStyles.modalFooter}>
          <button onClick={onClose} className={buttonStyles.button}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

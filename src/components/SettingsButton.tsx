import React from 'react';
import styles from './Button.module.css';

interface SettingsButtonProps {
  onSettings: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onSettings }) => {
  return <button onClick={onSettings} className={styles.button}>Settings</button>;
};

export default SettingsButton;

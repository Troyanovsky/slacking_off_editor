import React from 'react';

interface SettingsButtonProps {
  onSettings: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onSettings }) => {
  return <button onClick={onSettings}>Settings</button>;
};

export default SettingsButton;

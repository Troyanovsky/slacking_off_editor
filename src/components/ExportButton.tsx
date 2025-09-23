import React from 'react';

interface ExportButtonProps {
  onExport: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
  return <button onClick={onExport}>Export</button>;
};

export default ExportButton;

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Editor from './components/Editor';
import LineNumbers from './components/LineNumbers';
import Toolbar from './components/Toolbar';
import SettingsModal from './components/SettingsModal';
import { parseBook } from './lib/bookParser';
import { useKeyPress } from './hooks/useKeyPress';

function App() {
  const [userText, setUserText] = useState('');
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('slacking_off_settings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : { injectionLine: 5, lineLength: 80 };
  });
  const [book, setBook] = useState<{ content: string[]; isLoaded: boolean; fileName: string }>({ content: [], isLoaded: false, fileName: '' });
  const [isSlackingMode, setSlackingMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('slacking_off_settings', JSON.stringify(settings));
  }, [settings]);

  useKeyPress('S', () => {
    console.log('Toggling slacking mode');
    setSlackingMode(prev => !prev);
  }, ['ctrl', 'shift']);

  useKeyPress('ArrowRight', () => {
    if (isSlackingMode && currentPage < book.content.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  });
  useKeyPress('ArrowLeft', () => {
    if (isSlackingMode && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  });

  const lineCount = userText.split('\n').length;
  const wordCount = userText.split(/\s+/).filter(Boolean).length;
  const charCount = userText.length;

  const handleExport = () => {
    const blob = new Blob([userText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileLoad = async (file: File) => {
    console.log('handleFileLoad called for:', file.name);
    try {
      const text = await parseBook(file);
      console.log('Book parsed, total length:', text.length);
      const pages = chunkText(text, settings.lineLength);
      console.log('Text chunked into', pages.length, 'pages');
      setBook({ content: pages, isLoaded: true, fileName: file.name });
      console.log('Book loaded and parsed successfully');
    } catch (error) {
      console.error('Error parsing book:', error);
      alert('Failed to load or parse the book.');
    }
  };

  const chunkText = (text: string, length: number): string[] => {
    const singleLineText = text.replace(/\r\n|\r|\n/g, '    ');
    const chunks: string[] = [];
    for (let i = 0; i < singleLineText.length; i += length) {
      chunks.push(singleLineText.substring(i, i + length));
    }
    return chunks;
  };

  return (
    <div className="app-container">
      <div className="editor-container">
        <LineNumbers lineCount={lineCount} ref={lineNumbersRef} />
        <Editor
          userText={userText}
          setUserText={setUserText}
          isSlackingMode={isSlackingMode}
          bookPage={book.isLoaded ? book.content[currentPage] : ''}
          injectionLine={settings.injectionLine}
          lineNumbersRef={lineNumbersRef}
        />
      </div>
      <Toolbar
        wordCount={wordCount}
        charCount={charCount}
        onExport={handleExport}
        onSettings={() => setSettingsOpen(true)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onFileLoad={handleFileLoad}
        fileName={book.fileName}
      />
    </div>
  );
}

export default App;

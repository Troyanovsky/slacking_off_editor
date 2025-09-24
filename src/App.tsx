import { useState, useEffect, useRef } from 'react';
import './App.css';
import Editor from './components/Editor';
import LineNumbers from './components/LineNumbers';
import Toolbar from './components/Toolbar';
import SettingsModal from './components/SettingsModal';
import { parseBook } from './lib/bookParser';
import { useKeyPress } from './hooks/useKeyPress';
import { calculateFileHash } from './lib/hash';

const MAX_SAVED_BOOKS = 5;

interface BookProgress {
  hash: string;
  currentPage: number;
}

function App() {
  const [userText, setUserText] = useState('');
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('slacking_off_settings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : { injectionLine: 5, lineLength: 80 };
  });
  const [book, setBook] = useState<{ content: string[]; isLoaded: boolean; fileName: string; hash: string }>({ content: [], isLoaded: false, fileName: '', hash: '' });
  const [isSlackingMode, setSlackingMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('slacking_off_settings', JSON.stringify(settings));
  }, [settings]);

  const saveReadingProgress = (hash: string, page: number) => {
    if (!hash) return;
    let progress: BookProgress[] = JSON.parse(localStorage.getItem('book_progress') || '[]');
    const existingIndex = progress.findIndex(p => p.hash === hash);
    if (existingIndex > -1) {
      progress[existingIndex].currentPage = page;
    } else {
      progress.push({ hash, currentPage: page });
    }
    if (progress.length > MAX_SAVED_BOOKS) {
      progress = progress.slice(progress.length - MAX_SAVED_BOOKS);
    }
    localStorage.setItem('book_progress', JSON.stringify(progress));
  };

  useKeyPress('S', () => {
    setSlackingMode(prev => !prev);
  }, ['ctrl', 'shift']);

  useKeyPress('ArrowRight', () => {
    if (isSlackingMode && book.isLoaded && currentPage < book.content.length - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      saveReadingProgress(book.hash, newPage);
    }
  });

  useKeyPress('ArrowLeft', () => {
    if (isSlackingMode && book.isLoaded && currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      saveReadingProgress(book.hash, newPage);
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
    try {
      const hash = await calculateFileHash(file);
      const text = await parseBook(file);
      console.log('Parsed book text:', text.substring(0, 100) + '...'); // Log first 100 chars
      
      if (!text || text.trim().length === 0) {
        console.warn('Book parsing returned empty text');
        alert('The book appears to be empty or could not be parsed.');
        return;
      }
      
      const pages = chunkText(text, settings.lineLength);
      console.log('Chunked pages count:', pages.length);
      console.log('First page content:', pages[0]);
      
      const progress: BookProgress[] = JSON.parse(localStorage.getItem('book_progress') || '[]');
      const existingBook = progress.find(p => p.hash === hash);
      const startPage = existingBook ? existingBook.currentPage : 0;
      
      // Ensure startPage is within valid range
      const validatedStartPage = Math.max(0, Math.min(startPage, pages.length - 1));

      setBook({ content: pages, isLoaded: true, fileName: file.name, hash });
      setCurrentPage(validatedStartPage);
      console.log(`Book ${file.name} loaded. Starting at page ${validatedStartPage + 1}`);
    } catch (error) {
      console.error('Error parsing book:', error);
      alert('Failed to load or parse the book.');
    }
  };

  const chunkText = (text: string, length: number): string[] => {
    // Handle empty or whitespace-only text
    if (!text || text.trim().length === 0) {
      return [];
    }
    
    const singleLineText = text.replace(/\r\n|\r|\n/g, '    ');
    const chunks: string[] = [];
    for (let i = 0; i < singleLineText.length; i += length) {
      chunks.push(singleLineText.substring(i, i + length));
    }
    return chunks;
  };

  // Get the current book page content, with safety checks
  const getCurrentBookPage = () => {
    if (!book.isLoaded || !book.content || book.content.length === 0) {
      return '';
    }
    
    if (currentPage < 0 || currentPage >= book.content.length) {
      console.warn(`Invalid currentPage index: ${currentPage}, book content length: ${book.content.length}`);
      return '';
    }
    
    return book.content[currentPage];
  };

  return (
    <div className="app-container">
      <div className="editor-container">
        <LineNumbers lineCount={lineCount} ref={lineNumbersRef} />
        <Editor
          userText={userText}
          setUserText={setUserText}
          isSlackingMode={isSlackingMode}
          bookPage={getCurrentBookPage()}
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

import ePub from 'epubjs';

export const parseBook = async (file: File): Promise<string> => {
  console.log('parseBook called for:', file.name);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      console.log('FileReader onload event triggered.');
      if (!event.target?.result) {
        console.error('FileReader error: event.target.result is null');
        return reject(new Error('File could not be read'));
      }
      console.log('FileReader result length:', event.target.result.toString().length);

      if (file.name.endsWith('.txt')) {
        console.log('Processing .txt file');
        resolve(event.target.result as string);
      } else if (file.name.endsWith('.epub')) {
        console.log('Processing .epub file');
        try {
          const book = ePub(event.target.result as ArrayBuffer);
          const allText = await extractTextFromEpub(book);
          resolve(allText);
        } catch (error) {
          console.error('Error parsing epub:', error);
          reject(error);
        }
      } else {
        console.error('Unsupported file type:', file.name);
        reject(new Error('Unsupported file type'));
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader onerror:', error);
      reject(error);
    };

    if (file.name.endsWith('.txt')) {
      console.log('Reading file as text');
      reader.readAsText(file);
    } else if (file.name.endsWith('.epub')) {
      console.log('Reading file as array buffer');
      reader.readAsArrayBuffer(file);
    }
  });
};

const extractTextFromEpub = async (book: any): Promise<string> => {
  await book.ready;
  const allText: string[] = [];

  for (const section of book.spine.items) {
    await section.load(book.load.bind(book));
    const text = section.render();
    allText.push(text);
  }

  return allText.join('\n\n');
};

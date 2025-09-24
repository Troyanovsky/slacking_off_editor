import JSZip from 'jszip';
import { DOMParser } from '@xmldom/xmldom';

export const parseBook = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('File could not be read'));
      }

      if (file.name.endsWith('.txt')) {
        console.log('Parsing TXT file');
        resolve(event.target.result as string);
      } else if (file.name.endsWith('.epub')) {
        console.log('Parsing EPUB file');
        try {
          const buffer = event.target.result as ArrayBuffer;
          const allText = await extractTextFromEpub(buffer);
          console.log('EPUB parsing complete, text length:', allText.length);
          resolve(allText);
        } catch (error) {
          console.error('Error parsing EPUB:', error);
          reject(error);
        }
      } else {
        reject(new Error('Unsupported file type'));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    if (file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else if (file.name.endsWith('.epub')) {
      reader.readAsArrayBuffer(file);
    }
  });
};

const extractTextFromEpub = async (buffer: ArrayBuffer): Promise<string> => {
  const zip = new JSZip();
  const allText: string[] = [];
  
  try {
    // Load the EPUB file (which is a ZIP archive)
    const zipContent = await zip.loadAsync(buffer);
    
    // Find the OPF (Open Packaging Format) file path from the container file
    let opfPath = '';
    
    if (zipContent.files['META-INF/container.xml']) {
      const containerFile = zipContent.file('META-INF/container.xml');
      if (!containerFile) {
        throw new Error('Could not find container.xml in EPUB');
      }
      const containerXml = await containerFile.async('text');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(containerXml, 'text/xml');
      
      const rootFileElements = xmlDoc.getElementsByTagName('rootfile');
      if (rootFileElements.length > 0) {
        const rootFileElement = rootFileElements[0];
        if (rootFileElement) {
          const fullPathAttr = rootFileElement.getAttribute('full-path');
          opfPath = fullPathAttr || '';
        }
      }
    } else {
      // Fallback: look for an OPF file in the root
      for (const fileName in zipContent.files) {
        if (fileName.endsWith('.opf')) {
          opfPath = fileName;
          break;
        }
      }
    }
    
    if (!opfPath) {
      throw new Error('Could not find OPF file in EPUB');
    }
    
    console.log('OPF file path:', opfPath);
    
    // Read the OPF file to get the manifest and spine
    const opfFile = zipContent.file(opfPath);
    if (!opfFile) {
      throw new Error(`Could not find OPF file at path: ${opfPath}`);
    }
    const opfContent = await opfFile.async('text');
    const parser = new DOMParser();
    const opfDoc = parser.parseFromString(opfContent, 'text/xml');
    
    // Extract manifest (all files in the EPUB)
    const manifestElements = opfDoc.getElementsByTagName('item');
    const manifest: { [id: string]: string } = {};
    
    for (let i = 0; i < manifestElements.length; i++) {
      const item = manifestElements[i];
      if (item) {
        const id = item.getAttribute('id');
        const href = item.getAttribute('href');
        if (id && href) {
          // Convert relative path to absolute path based on OPF location
          const opfDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);
          const fullPath = opfDir + href;
          manifest[id] = fullPath;
        }
      }
    }
    
    // Extract spine (the reading order)
    const spineElements = opfDoc.getElementsByTagName('itemref');
    const spine: string[] = [];
    
    for (let i = 0; i < spineElements.length; i++) {
      const itemref = spineElements[i];
      if (itemref) {
        const idref = itemref.getAttribute('idref');
        if (idref) {
          spine.push(idref);
        }
      }
    }
    
    console.log('EPUB spine length:', spine.length);
    
    if (spine.length === 0) {
      console.error('Invalid EPUB spine structure');
      return '';
    }
    
    // Process each spine item
    for (const idref of spine) {
      try {
        const filePath = manifest[idref];
        if (!filePath) {
          console.log('Could not find file path for spine item:', idref);
          continue;
        }
        
        console.log('Processing spine item:', idref, 'at path:', filePath);
        
        // Read the content of the spine item
        const contentFile = zipContent.file(filePath);
        if (!contentFile) {
          console.log('Could not find content file for path:', filePath);
          continue;
        }
        const fileContent = await contentFile.async('text');
        
        if (fileContent) {
          // Create a temporary div to parse HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = fileContent;
          
          // Remove script and style elements for cleaner text
          const elementsToRemove = tempDiv.querySelectorAll('script, style, nav, footer, header');
          elementsToRemove.forEach(el => {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
          
          // Extract text content
          const text = tempDiv.textContent || tempDiv.innerText || '';
          console.log('Extracted text length:', text.length);
          
          if (text.trim().length > 0) {
            allText.push(text.trim());
          }
        }
      } catch (error) {
        console.error('Error processing spine item:', idref, error);
        // Continue with other spine items even if one fails
      }
    }
  } catch (error) {
    console.error('Error processing EPUB:', error);
    throw error;
  }
  
  const result = allText.join('\\n\\n');
  console.log('Total extracted text length:', result.length);
  console.log('Number of content sections extracted:', allText.length);
  return result;
};

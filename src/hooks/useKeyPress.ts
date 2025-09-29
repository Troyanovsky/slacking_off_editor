import { useEffect } from 'react';

export const useKeyPress = (targetKey: string, callback: () => boolean, modifiers: string[] = []) => {
  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === targetKey.toLowerCase()) {
        const allModifiersPressed = modifiers.every(modifier => {
          if (modifier === 'ctrl') return event.ctrlKey;
          if (modifier === 'meta') return event.metaKey;
          if (modifier === 'shift') return event.shiftKey;
          if (modifier === 'alt') return event.altKey;
          return false;
        });

        if (allModifiersPressed) {
          if (callback()) {
            event.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, callback, modifiers]);
};

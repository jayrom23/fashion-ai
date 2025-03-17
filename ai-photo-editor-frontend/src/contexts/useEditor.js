// From src/contexts/useEditor.js
import { useContext } from 'react';
import { EditorContext } from './editorContextState';

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
import { saveAs } from 'file-saver';

/**
 * Saves a file using FileSaver.js
 * @param file The file or Blob to save
 * @param filename The name for the saved file
 */
export function saveFile(file: Blob | File, filename: string): void {
    saveAs(file, filename);
}
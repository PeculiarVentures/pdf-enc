import * as pdfDoc from '@peculiar/pdf-doc';
import { useState, DragEvent } from 'react';
import './FileUploader.css';


interface ParsedPdfInfo {
  file: File;
  pdfDocument?: pdfDoc.PDFDocument;
  hasSignatures?: boolean;
}

interface FileUploaderProps {
  onFileSelect: (info: ParsedPdfInfo) => void;
  currentFile: File | null;
}

function FileUploader({ onFileSelect, currentFile }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        parseAndSend(file);
      } else {
        alert('Please select a PDF file');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        parseAndSend(file);
      } else {
        alert('Please select a PDF file');
      }
    }
  };

  // Parse the PDF using @peculiar/pdf-doc to extract metadata and signatures
  const parseAndSend = async (file: File) => {
    let passwordRequired = false;
    try {
      const raw = await file.arrayBuffer();
      const doc = await pdfDoc.PDFDocument.load(raw, {
        onUserPassword: async () => {
          passwordRequired = true;
          throw new Error('Password required to open PDF');
        }
      });

      // Detect signatures using the library helper if available
      const hasSignatures = doc.getSignatures().length > 0;

      onFileSelect({ file, pdfDocument: doc, hasSignatures });
    } catch (err) {
      if (passwordRequired) {
        alert('The selected PDF is password-protected and cannot be processed.');
        return;
      }
      alert('Failed to parse PDF file. It may be corrupted.');
      return;
    }
  };

  return (
    <div className="file-uploader">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${currentFile ? 'has-file' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {currentFile ? (
          <div className="file-info">
            <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="file-details">
              <p className="file-name">{currentFile.name}</p>
              <p className="file-size">{(currentFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        ) : (
          <>
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="drop-text">Drag & drop your PDF file here</p>
            <p className="or-text">or</p>
          </>
        )}
        <label className="file-input-label">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className="file-input"
          />
          <span className="file-input-button">
            {currentFile ? 'Choose another file' : 'Browse files'}
          </span>
        </label>
      </div>
    </div>
  );
}

export default FileUploader;

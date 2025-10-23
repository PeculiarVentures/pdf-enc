import { useState } from 'react';
import * as pdfDoc from '@peculiar/pdf-doc';
import './App.css';
import FileUploader from './components/FileUploader';
import EncryptionForm from './components/EncryptionForm';
import Notice from './components/Notice';
import { encryptPDF, EncryptionParams } from './utils/pdfEncryption';

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDocument, setPdfDocument] = useState<pdfDoc.PDFDocument | null>(null);
  const [hasSignatures, setHasSignatures] = useState<boolean | null>(null);
  const [signatureNoticeDismissed, setSignatureNoticeDismissed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (info: { file: File; pdfDocument?: pdfDoc.PDFDocument; hasSignatures?: boolean; }) => {
    setPdfFile(info.file);
    setPdfDocument(info.pdfDocument ?? null);
    setHasSignatures(info.hasSignatures ?? null);
    setSignatureNoticeDismissed(false);
  };

  const handleEncrypt = async (params: EncryptionParams) => {
    if (!pdfFile) {
      alert('Please select a PDF file first');
      return;
    }

    // If we have a parsed PDFDocument, use it; otherwise fall back to reading the file
    setIsProcessing(true);
    try {
      let encryptedBlob: Blob;
      if (pdfDocument) {
        encryptedBlob = await encryptPDF(pdfDocument, params);
      } else {
        // fallback: read raw file and load inside utility
        encryptedBlob = await encryptPDF(pdfFile as any, params);
      }

      // Download the encrypted PDF
      const url = URL.createObjectURL(encryptedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `encrypted_${pdfFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Encryption failed:', error);
      alert('Failed to encrypt PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>PDF Encryption Tool</h1>
        <p>Protect your PDF documents with password encryption</p>
      </header>

      <main className="app-main">
        <FileUploader onFileSelect={handleFileSelect} currentFile={pdfFile} />

        {pdfFile && (
          hasSignatures ? (
            !signatureNoticeDismissed && (
              <Notice
                type="warning"
                title="Signed document detected"
                message={
                  'This document contains a digital signature and cannot be protected with password-based encryption. Encryption controls are disabled.'
                }
                actions={[{ label: 'Dismiss', variant: 'default', onClick: () => setSignatureNoticeDismissed(true) }]}
              />
            )
          ) : (
            <EncryptionForm
              onEncrypt={handleEncrypt}
              isProcessing={isProcessing}
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;

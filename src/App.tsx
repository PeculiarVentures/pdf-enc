import { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import EncryptionForm from './components/EncryptionForm';
import { encryptPDF } from './utils/pdfEncryption';

interface EncryptionParams {
  userPassword: string;
  ownerPassword: string;
  allowPrint: boolean;
  allowCopy: boolean;
  allowModify: boolean;
}

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
  };

  const handleEncrypt = async (params: EncryptionParams) => {
    if (!pdfFile) {
      alert('Please select a PDF file first');
      return;
    }

    setIsProcessing(true);
    try {
      const encryptedBlob = await encryptPDF(pdfFile, params);

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
          <EncryptionForm
            onEncrypt={handleEncrypt}
            isProcessing={isProcessing}
          />
        )}
      </main>
    </div>
  );
}

export default App;

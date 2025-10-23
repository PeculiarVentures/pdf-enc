import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Debug wrapper: intercept crypto.subtle.importKey to log algorithm and args
// This helps identify which algorithm object (name/OID) is passed when the
// NotSupportedError is thrown by SubtleCrypto.importKey.
try {
  const subtle = (globalThis as any).crypto?.subtle;
  if (subtle && typeof subtle.importKey === 'function') {
    const _origImportKey = subtle.importKey.bind(subtle);
    (subtle as any).importKey = async function (format: any, keyData: any, algorithm: any, extractable: any, keyUsages: any) {
      try {
        // Log concise info to help debug algorithm names/OIDs
        console.warn('[debug] crypto.subtle.importKey called', {
          format,
          algorithm,
          extractable,
          keyUsages,
        });
      } catch (e) {
        // ignore logging errors
      }
      try {
        return await _origImportKey(format, keyData, algorithm, extractable, keyUsages);
      } catch (err) {
        console.error('[debug] crypto.subtle.importKey error', err, { format, algorithm, extractable, keyUsages });
        throw err;
      }
    };
  }
} catch (e) {
  // ignore errors during instrumentation
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

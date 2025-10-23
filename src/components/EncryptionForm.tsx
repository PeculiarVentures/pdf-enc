import { useState, FormEvent } from 'react';
import './EncryptionForm.css';
import { EncryptionParams } from '../utils/pdfEncryption';

interface EncryptionFormProps {
  onEncrypt: (params: EncryptionParams) => void;
  isProcessing: boolean;
  hasSignatures?: boolean | undefined;
}

function EncryptionForm({ onEncrypt, isProcessing, hasSignatures = false }: EncryptionFormProps) {
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [allowPrint, setAllowPrint] = useState(true);
  const [allowCopy, setAllowCopy] = useState(false);
  const [allowModify, setAllowModify] = useState(false);
  const [allowAnnots, setAllowAnnots] = useState(false);
  const [allowFillForms, setAllowFillForms] = useState(false);
  const [allowAssembleDocument, setAllowAssembleDocument] = useState(false);
  const [allowPrintRepresentation, setAllowPrintRepresentation] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // If both passwords are empty, require explicit confirmation from the user
    if (!userPassword && !ownerPassword) {
      const ok = window.confirm(
        'You did not provide a User or Owner password. The document will not be protected. Do you want to continue?'
      );
      if (!ok) return;
    }

    onEncrypt({
      userPassword,
      ownerPassword: ownerPassword || userPassword,
      allowPrint,
      allowCopy,
      allowModify,
      allowAnnots,
      allowFillForms,
      allowAssembleDocument,
      allowPrintRepresentation,
    });
  };

  return (
    <div className="encryption-form">
      {/* Main heading changes depending on whether the document is signed */}
      <h2>{hasSignatures ? 'Signed document detected' : 'Encryption Settings'}</h2>

      {hasSignatures ? (
        <div className="signature-warning">
          <p>This document contains a digital signature and cannot be protected with password-based encryption. Encryption controls are disabled.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="userPassword" className="form-label">
              User Password
              <span className="label-hint">Optional — required only if you want the document to require a password to open</span>
            </label>
            <input
              type="password"
              id="userPassword"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Enter user password (optional)"
              disabled={isProcessing}
            />
          </div>

          <div className="form-section">
            <label htmlFor="ownerPassword" className="form-label">
              Owner Password
              <span className="label-hint">Optional - for permissions management. Leave User Password empty to apply permissions without requiring a password to open.</span>
            </label>
            <input
              type="password"
              id="ownerPassword"
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
              placeholder="Enter owner password (optional)"
              disabled={isProcessing}
            />
          </div>

          <div className="form-section permissions">
            <h3>Permissions</h3>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allowPrint}
                onChange={(e) => setAllowPrint(e.target.checked)}
                disabled={isProcessing}
              />
              <span>Allow printing</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allowCopy}
                onChange={(e) => setAllowCopy(e.target.checked)}
                disabled={isProcessing}
              />
              <span>Allow copying text and images</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allowModify}
                onChange={(e) => setAllowModify(e.target.checked)}
                disabled={isProcessing}
              />
              <span>Allow document modification</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allowAnnots}
                onChange={(e) => setAllowAnnots(e.target.checked)}
                disabled={isProcessing}
              />
              <span>Allow annotations (add/modify)</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allowFillForms}
                onChange={(e) => setAllowFillForms(e.target.checked)}
                disabled={isProcessing}
              />
              <span>Allow filling existing form fields</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allowAssembleDocument}
                onChange={(e) => setAllowAssembleDocument(e.target.checked)}
                disabled={isProcessing}
              />
              <span>Allow assembling document (insert/rotate/delete pages)</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allowPrintRepresentation}
                onChange={(e) => setAllowPrintRepresentation(e.target.checked)}
                disabled={isProcessing}
              />
              <span>Allow high-fidelity printing</span>
            </label>
          </div>

          <button
            type="submit"
            className="encrypt-button"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Encrypt & Download'}
          </button>
        </form>
      )}
    </div>
  );
}

export default EncryptionForm;

import { useState, FormEvent } from 'react';
import './EncryptionForm.css';

interface EncryptionParams {
  userPassword: string;
  ownerPassword: string;
  allowPrint: boolean;
  allowCopy: boolean;
  allowModify: boolean;
}

interface EncryptionFormProps {
  onEncrypt: (params: EncryptionParams) => void;
  isProcessing: boolean;
}

function EncryptionForm({ onEncrypt, isProcessing }: EncryptionFormProps) {
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [allowPrint, setAllowPrint] = useState(true);
  const [allowCopy, setAllowCopy] = useState(false);
  const [allowModify, setAllowModify] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!userPassword) {
      alert('Please enter a user password');
      return;
    }

    onEncrypt({
      userPassword,
      ownerPassword: ownerPassword || userPassword,
      allowPrint,
      allowCopy,
      allowModify,
    });
  };

  return (
    <div className="encryption-form">
      <h2>Encryption Settings</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label htmlFor="userPassword" className="form-label">
            User Password *
            <span className="label-hint">Required to open the document</span>
          </label>
          <input
            type="password"
            id="userPassword"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder="Enter user password"
            required
            disabled={isProcessing}
          />
        </div>

        <div className="form-section">
          <label htmlFor="ownerPassword" className="form-label">
            Owner Password
            <span className="label-hint">Optional - for permissions management</span>
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
        </div>

        <button
          type="submit"
          className="encrypt-button"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Encrypt & Download'}
        </button>
      </form>
    </div>
  );
}

export default EncryptionForm;

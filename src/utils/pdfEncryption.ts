import * as pkijs from 'pkijs';
import * as liner from 'webcrypto-liner';
import * as pdfCore from '@peculiar/pdf-core';
import * as pdfDoc from '@peculiar/pdf-doc';

pkijs.setEngine(
  "pdf",
  new pdfCore.PDFCryptoEngine({
    name: "pdf",
    crypto: (liner as any).crypto,
  })
);

/**
 * Encrypts a PDF document with the given parameters.
 * 
 * Currently returns the original PDF without encryption.
 * This is a placeholder for the actual encryption implementation.
 */

interface EncryptionParams {
  userPassword: string;
  ownerPassword: string;
  allowPrint: boolean;
  allowCopy: boolean;
  allowModify: boolean;
}

export async function encryptPDF(
  file: File,
  params: EncryptionParams
): Promise<Blob> {
  const fileRaw = await file.arrayBuffer();

  let permissionFlags = 0 as pdfCore.UserAccessPermissionFlags;
  if (params.allowPrint) {
    permissionFlags |= pdfCore.UserAccessPermissionFlags.printDocument;
  }
  if (params.allowCopy) {
    permissionFlags |= pdfCore.UserAccessPermissionFlags.copy;
  }
  if (params.allowModify) {
    permissionFlags |= pdfCore.UserAccessPermissionFlags.modifyContent;
  }

  const doc = await pdfDoc.PDFDocument.load(fileRaw);
  const encryptedDoc = await doc.clone({
    userPassword: params.userPassword,
    ownerPassword: params.ownerPassword,
    algorithm: "AES256", // AES-256 шифрование
    permission: permissionFlags,
  });

  const encryptedRaw = await encryptedDoc.save();

  return new Blob([encryptedRaw], { type: 'application/pdf' });
}

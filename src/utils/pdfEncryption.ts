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

export interface EncryptionParams {
  userPassword: string;
  ownerPassword: string;
  // Standard permissions
  allowPrint?: boolean;
  allowCopy?: boolean;
  allowModify?: boolean;
  // Additional permissions to support full UserAccessPermissionFlags
  allowAnnots?: boolean; // add/modify annotations
  allowFillForms?: boolean; // fill existing form fields
  allowNotUsed?: boolean; // deprecated bit (kept for compatibility)
  allowAssembleDocument?: boolean; // assemble document (insert/rotate/delete pages)
  allowPrintRepresentation?: boolean; // high-fidelity printing
}

export async function encryptLoadedDocument(
  doc: pdfDoc.PDFDocument,
  params: EncryptionParams
): Promise<Blob> {
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
  if (params.allowAnnots) {
    permissionFlags |= pdfCore.UserAccessPermissionFlags.annots;
  }
  if (params.allowFillForms) {
    permissionFlags |= pdfCore.UserAccessPermissionFlags.fillForms;
  }
  if (params.allowNotUsed) {
    permissionFlags |= pdfCore.UserAccessPermissionFlags.notUsed;
  }
  if (params.allowAssembleDocument) {
    permissionFlags |= pdfCore.UserAccessPermissionFlags.assembleDocument;
  }
  if (params.allowPrintRepresentation) {
    permissionFlags |= pdfCore.UserAccessPermissionFlags.printRepresentation;
  }

  const encryptedDoc = await doc.clone({
    userPassword: params.userPassword,
    ownerPassword: params.ownerPassword,
    algorithm: "AES256",
    permission: permissionFlags,
  });

  const encryptedRaw = await encryptedDoc.save();

  return new Blob([encryptedRaw], { type: 'application/pdf' });
}

// Backwards-compatible wrapper: accept File or PDFDocument
export async function encryptPDF(
  input: File | pdfDoc.PDFDocument,
  params: EncryptionParams
): Promise<Blob> {
  if ((input as pdfDoc.PDFDocument).save) {
    return encryptLoadedDocument(input as pdfDoc.PDFDocument, params);
  }

  const file = input as File;
  const fileRaw = await file.arrayBuffer();
  const doc = await pdfDoc.PDFDocument.load(fileRaw);
  return encryptLoadedDocument(doc, params);
}

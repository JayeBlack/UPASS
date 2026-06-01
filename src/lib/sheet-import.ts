/**
 * Reads an uploaded .csv, .xlsx, or .xls file and returns rows of strings
 * (including the header row). First sheet is used for Excel files.
 * 
 * @deprecated Use server-side parsing via backend endpoints instead
 * This function is no longer supported to avoid client-side XLSX vulnerabilities
 */
export async function readSheetFile(file: File): Promise<string[][]> {
  throw new Error("Client-side file parsing is no longer supported. Use backend parsing endpoints instead.");
}

export const SHEET_ACCEPT = ".csv,.xlsx,.xls";
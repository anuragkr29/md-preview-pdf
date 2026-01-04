/**
 * File Utilities
 * Provides file system operations with error handling
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { createError, withErrorHandling } from './error-handler';
import { ErrorCode } from '../types';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const accessAsync = promisify(fs.access);
const statAsync = promisify(fs.stat);

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await accessAsync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a path is a directory
 */
export async function isDirectory(filePath: string): Promise<boolean> {
  try {
    const stats = await statAsync(filePath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Read file contents as string
 */
export async function readFile(filePath: string): Promise<string> {
  const absolutePath = path.resolve(filePath);

  if (!(await fileExists(absolutePath))) {
    throw createError(
      ErrorCode.FILE_NOT_FOUND,
      { path: absolutePath },
      `File not found: ${absolutePath}`
    );
  }

  return withErrorHandling(
    async () => {
      const content = await readFileAsync(absolutePath, 'utf-8');
      return content;
    },
    ErrorCode.FILE_READ_ERROR
  );
}

/**
 * Write content to file
 */
export async function writeFile(
  filePath: string,
  content: string | Buffer
): Promise<void> {
  const absolutePath = path.resolve(filePath);
  const directory = path.dirname(absolutePath);

  // Ensure directory exists
  await ensureDirectory(directory);

  return withErrorHandling(
    async () => {
      await writeFileAsync(absolutePath, content);
    },
    ErrorCode.FILE_WRITE_ERROR
  );
}

/**
 * Ensure a directory exists, create if it doesn't
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  const absolutePath = path.resolve(dirPath);

  try {
    await mkdirAsync(absolutePath, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw createError(
        ErrorCode.FILE_WRITE_ERROR,
        error,
        `Failed to create directory: ${absolutePath}`
      );
    }
  }
}

/**
 * Get file extension
 */
export function getExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

/**
 * Change file extension
 */
export function changeExtension(filePath: string, newExt: string): string {
  const ext = path.extname(filePath);
  const newExtWithDot = newExt.startsWith('.') ? newExt : `.${newExt}`;
  return filePath.slice(0, -ext.length) + newExtWithDot;
}

/**
 * Get base name without extension
 */
export function getBaseName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Resolve path relative to a base path
 */
export function resolvePath(filePath: string, basePath?: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  return path.resolve(basePath || process.cwd(), filePath);
}

/**
 * Get relative path from base to target
 */
export function getRelativePath(from: string, to: string): string {
  return path.relative(path.dirname(from), to);
}

/**
 * Read and encode file as base64
 */
export async function readFileAsBase64(filePath: string): Promise<string> {
  const absolutePath = path.resolve(filePath);

  if (!(await fileExists(absolutePath))) {
    throw createError(
      ErrorCode.FILE_NOT_FOUND,
      { path: absolutePath },
      `File not found: ${absolutePath}`
    );
  }

  return withErrorHandling(
    async () => {
      const content = await readFileAsync(absolutePath);
      return content.toString('base64');
    },
    ErrorCode.FILE_READ_ERROR
  );
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(filePath: string): string {
  const ext = getExtension(filePath);
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.html': 'text/html',
    '.md': 'text/markdown',
    '.pdf': 'application/pdf',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Get file size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  const stats = await statAsync(filePath);
  return stats.size;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export default {
  fileExists,
  isDirectory,
  readFile,
  writeFile,
  ensureDirectory,
  getExtension,
  changeExtension,
  getBaseName,
  resolvePath,
  getRelativePath,
  readFileAsBase64,
  getMimeType,
  getFileSize,
  formatFileSize,
};

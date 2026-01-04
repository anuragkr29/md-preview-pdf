/**
 * Error Handler Utility
 * Provides consistent error handling and user-friendly messages
 */

import { ConversionError, ErrorCode } from '../types';
import logger from './logger';

/**
 * Error messages for user-friendly display
 */
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.FILE_NOT_FOUND]: 'The specified file could not be found',
  [ErrorCode.FILE_READ_ERROR]: 'Failed to read the file',
  [ErrorCode.FILE_WRITE_ERROR]: 'Failed to write the output file',
  [ErrorCode.INVALID_MARKDOWN]: 'The markdown content is invalid',
  [ErrorCode.PARSE_ERROR]: 'Failed to parse the markdown content',
  [ErrorCode.MERMAID_ERROR]: 'Failed to render Mermaid diagram',
  [ErrorCode.RENDER_ERROR]: 'Failed to render HTML content',
  [ErrorCode.PDF_ERROR]: 'Failed to generate PDF',
  [ErrorCode.BROWSER_ERROR]: 'Browser error occurred during rendering',
  [ErrorCode.THEME_ERROR]: 'Failed to load or apply theme',
  [ErrorCode.CONFIG_ERROR]: 'Invalid configuration',
  [ErrorCode.TIMEOUT_ERROR]: 'Operation timed out',
  [ErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred',
};

/**
 * Create a ConversionError with a specific error code
 */
export function createError(
  code: ErrorCode,
  details?: unknown,
  customMessage?: string
): ConversionError {
  const message = customMessage || ERROR_MESSAGES[code];
  return new ConversionError(message, code, details);
}

/**
 * Handle an error and return a ConversionError
 */
export function handleError(error: unknown): ConversionError {
  if (error instanceof ConversionError) {
    return error;
  }

  if (error instanceof Error) {
    // Try to determine error type from message
    const message = error.message.toLowerCase();

    if (message.includes('enoent') || message.includes('not found')) {
      return createError(ErrorCode.FILE_NOT_FOUND, error, error.message);
    }

    if (message.includes('permission denied') || message.includes('eacces')) {
      return createError(ErrorCode.FILE_WRITE_ERROR, error, error.message);
    }

    if (message.includes('mermaid')) {
      return createError(ErrorCode.MERMAID_ERROR, error, error.message);
    }

    if (message.includes('browser') || message.includes('puppeteer')) {
      return createError(ErrorCode.BROWSER_ERROR, error, error.message);
    }

    if (message.includes('timeout')) {
      return createError(ErrorCode.TIMEOUT_ERROR, error, error.message);
    }

    return createError(ErrorCode.UNKNOWN_ERROR, error, error.message);
  }

  return createError(ErrorCode.UNKNOWN_ERROR, error);
}

/**
 * Log error with details
 */
export function logError(error: ConversionError): void {
  logger.error(`${error.message} (${error.code})`);

  if (error.details) {
    logger.debug('Error details:', error.details);
  }
}

/**
 * Wrap async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorCode?: ErrorCode
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (errorCode) {
      throw createError(errorCode, error);
    }
    throw handleError(error);
  }
}

/**
 * Create a fallback handler for graceful degradation
 */
export function withFallback<T>(
  fn: () => T,
  fallback: T,
  logWarning = true
): T {
  try {
    return fn();
  } catch (error) {
    if (logWarning) {
      logger.warn(`Operation failed, using fallback: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    return fallback;
  }
}

/**
 * Retry an async operation with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        logger.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw handleError(lastError);
}

export default {
  createError,
  handleError,
  logError,
  withErrorHandling,
  withFallback,
  withRetry,
};

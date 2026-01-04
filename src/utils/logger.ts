/**
 * Logger Utility
 * Provides consistent logging with colors and levels
 */

import chalk from 'chalk';
import { LogLevelName, Logger } from '../types';

const LOG_LEVELS: Record<LogLevelName, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

let currentLevel: LogLevelName = 'info';

export function setLogLevel(level: LogLevelName): void {
  currentLevel = level;
}

export function getLogLevel(): LogLevelName {
  return currentLevel;
}

function shouldLog(level: LogLevelName): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatTimestamp(): string {
  return new Date().toISOString().slice(11, 23);
}

function formatMessage(level: string, message: string): string {
  const timestamp = chalk.gray(`[${formatTimestamp()}]`);
  return `${timestamp} ${level} ${message}`;
}

export const logger: Logger = {
  debug(message: string, ...args: unknown[]): void {
    if (shouldLog('debug')) {
      console.log(formatMessage(chalk.blue('[DEBUG]'), message), ...args);
    }
  },

  info(message: string, ...args: unknown[]): void {
    if (shouldLog('info')) {
      console.log(formatMessage(chalk.green('[INFO]'), message), ...args);
    }
  },

  warn(message: string, ...args: unknown[]): void {
    if (shouldLog('warn')) {
      console.warn(formatMessage(chalk.yellow('[WARN]'), message), ...args);
    }
  },

  error(message: string, ...args: unknown[]): void {
    if (shouldLog('error')) {
      console.error(formatMessage(chalk.red('[ERROR]'), message), ...args);
    }
  },
};

export default logger;

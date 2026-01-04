/**
 * Themes Module
 * Exports all theme-related functionality
 */

import { githubTheme } from './github';
import { githubDarkTheme } from './github-dark';
import { vscodeLightTheme } from './vscode-light';
import { vscodeDarkTheme } from './vscode-dark';
import { getHighlightThemeCSS } from './highlight';
import { logger } from '../utils/logger';

export { githubTheme } from './github';
export { githubDarkTheme } from './github-dark';
export { vscodeLightTheme } from './vscode-light';
export { vscodeDarkTheme } from './vscode-dark';
export { 
  getHighlightThemeCSS,
  highlightGithubTheme,
  highlightGithubDarkTheme,
  highlightVSCodeLightTheme,
  highlightVSCodeDarkTheme 
} from './highlight';

export type ThemeName = 'github' | 'github-dark' | 'vscode-light' | 'vscode-dark' | 'custom';

/**
 * Available themes
 */
export const themes: Record<string, string> = {
  'github': githubTheme,
  'github-dark': githubDarkTheme,
  'vscode-light': vscodeLightTheme,
  'vscode-dark': vscodeDarkTheme,
};

/**
 * Get theme CSS by name
 */
export async function getThemeCSS(name: ThemeName | string): Promise<string> {
  const normalizedName = name.toLowerCase();
  
  if (normalizedName in themes) {
    logger.debug(`Loading theme: ${normalizedName}`);
    return themes[normalizedName];
  }
  
  logger.warn(`Theme not found: ${name}, falling back to github theme`);
  return themes['github'];
}

/**
 * Get list of available theme names
 */
export function getAvailableThemes(): string[] {
  return Object.keys(themes);
}

/**
 * Check if a theme exists
 */
export function themeExists(name: string): boolean {
  return name.toLowerCase() in themes;
}

/**
 * Get matching highlight theme for document theme
 */
export function getMatchingHighlightTheme(themeName: string): string {
  const darkThemes = ['github-dark', 'vscode-dark'];
  if (darkThemes.includes(themeName.toLowerCase())) {
    return themeName;
  }
  return themeName.toLowerCase().includes('dark') ? 'github-dark' : 'github';
}

export default {
  themes,
  getThemeCSS,
  getAvailableThemes,
  themeExists,
  getMatchingHighlightTheme,
  getHighlightThemeCSS,
};

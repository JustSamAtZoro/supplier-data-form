// Real taxonomy system powered by CSV data
import { 
  initializeTaxonomy,
  getL0Options,
  getOptionsAtPath,
  hasChildren,
  getDisplayName,
  getFullDisplayPath,
  isCompleteSelection
} from './csvParser'

// Track initialization state
let isInitialized = false

// Initialize taxonomy asynchronously
export const ensureTaxonomyInitialized = async (): Promise<void> => {
  if (!isInitialized) {
    await initializeTaxonomy()
    isInitialized = true
  }
}

// Export the main taxonomy functions with simplified names
export const getTaxonomyL0Options = getL0Options
export const getTaxonomyOptionsAtPath = getOptionsAtPath
export const taxonomyHasChildren = hasChildren
export const getTaxonomyDisplayName = getDisplayName
export const getTaxonomyFullPath = getFullDisplayPath
export const isTaxonomyComplete = isCompleteSelection

// Helper functions for the form
export function getNextLevelOptions(currentPath: string[]): Record<string, string> {
  return getTaxonomyOptionsAtPath(currentPath)
}

export function canGoDeeper(currentPath: string[]): boolean {
  return taxonomyHasChildren(currentPath)
}

export function isSelectionComplete(codes: string[]): boolean {
  // Remove empty codes and check if the path is complete
  const cleanCodes = codes.filter(code => code && code.trim())
  return cleanCodes.length > 0 && isTaxonomyComplete(cleanCodes)
}

export function getBreadcrumbPath(codes: string[]): string[] {
  const cleanCodes = codes.filter(code => code && code.trim())
  return getTaxonomyFullPath(cleanCodes)
}

export function getMaxDepthForPath(codes: string[]): number {
  // Calculate the maximum possible depth for this path
  let depth = 0
  let currentPath: string[] = []
  
  for (const code of codes) {
    if (!code) break
    currentPath.push(code)
    depth++
    
    if (!canGoDeeper(currentPath)) {
      break
    }
  }
  
  // Check if we can go one level deeper
  if (canGoDeeper(currentPath)) {
    depth++
  }
  
  return Math.min(depth, 6) // Cap at 6 levels (L0-L5)
}

// Type definitions for the form
export interface TaxonomySelection {
  l0?: string
  l1?: string
  l2?: string
  l3?: string
  l4?: string
  l5?: string
}

export function getSelectionArray(selection: TaxonomySelection): string[] {
  return [
    selection.l0 || '',
    selection.l1 || '',
    selection.l2 || '',
    selection.l3 || '',
    selection.l4 || '',
    selection.l5 || ''
  ]
}

export function arrayToSelection(codes: string[]): TaxonomySelection {
  return {
    l0: codes[0] || '',
    l1: codes[1] || '',
    l2: codes[2] || '',
    l3: codes[3] || '',
    l4: codes[4] || '',
    l5: codes[5] || ''
  }
}
// CSV Parser for Master Taxonomy

export interface TaxonomyNode {
  code: string
  name: string
  children?: Record<string, TaxonomyNode>
  isEndNode?: boolean
  depth: number
}

export interface TaxonomyHierarchy {
  l0: Record<string, TaxonomyNode>
}

class TaxonomyParser {
  private hierarchy: TaxonomyHierarchy = { l0: {} }
  private isInitialized = false

  // Parse CSV line, handling quoted fields properly
  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  // Load and parse CSV data
  private async loadCSVData(): Promise<string> {
    try {
      const response = await fetch('/master-taxonomy.csv')
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.status}`)
      }
      return await response.text()
    } catch (error) {
      console.error('Error loading CSV data:', error)
      throw error
    }
  }

  // Build nested hierarchy from CSV data
  private buildHierarchy(csvData: string): void {
    const lines = csvData.split('\n').slice(1) // Skip header
    
    lines.forEach((line, index) => {
      if (!line.trim()) return // Skip empty lines
      
      try {
        const cols = this.parseCSVLine(line)
        
        // Extract level data: [code, name] pairs
        const levels = [
          { code: cols[1], name: cols[2] },   // L0
          { code: cols[3], name: cols[4] },   // L1
          { code: cols[5], name: cols[6] },   // L2
          { code: cols[7], name: cols[8] },   // L3
          { code: cols[9], name: cols[10] },  // L4
          { code: cols[11], name: cols[12] }  // L5
        ].filter(level => level.code && level.code.trim() && level.name && level.name.trim()) // Only keep populated levels
        
        if (levels.length < 2) {
          // Skip lines without at least L0 and L1
          return
        }
        
        // Build path through hierarchy
        let currentLevel = this.hierarchy.l0
        
        levels.forEach((level, depth) => {
          if (!currentLevel[level.code]) {
            currentLevel[level.code] = {
              code: level.code,
              name: level.name,
              depth: depth,
              children: {},
              isEndNode: false
            }
          }
          
          // Move to next level
          if (depth < levels.length - 1) {
            if (!currentLevel[level.code].children) {
              currentLevel[level.code].children = {}
            }
            currentLevel = currentLevel[level.code].children!
          } else {
            // This is the deepest level - mark as end node
            currentLevel[level.code].isEndNode = true
          }
        })
        
      } catch (error) {
        console.warn(`Error parsing line ${index + 2}:`, error)
      }
    })
  }

  // Initialize parser and build hierarchy
  public async init(): Promise<TaxonomyHierarchy> {
    if (this.isInitialized) {
      return this.hierarchy
    }
    
    try {
      const csvData = await this.loadCSVData()
      this.buildHierarchy(csvData)
      this.isInitialized = true
      
      // Successfully initialized
      
      return this.hierarchy
    } catch (error) {
      console.error('❌ Failed to initialize taxonomy:', error)
      throw error
    }
  }

  // Get options for a specific level
  public getOptionsForLevel(path: string[]): Record<string, string> {
    let current = this.hierarchy.l0
    
    // Navigate to the correct level
    for (const pathSegment of path) {
      if (!current[pathSegment] || !current[pathSegment].children) {
        return {}
      }
      current = current[pathSegment].children!
    }
    
    // Return options as code -> name mapping
    const options: Record<string, string> = {}
    Object.values(current).forEach(node => {
      options[node.code] = node.name
    })
    
    return options
  }

  // Check if a path has deeper levels
  public hasChildrenAtPath(path: string[]): boolean {
    let current = this.hierarchy.l0
    
    for (const pathSegment of path) {
      if (!current[pathSegment]) return false
      if (!current[pathSegment].children) return false
      current = current[pathSegment].children!
    }
    
    return Object.keys(current).length > 0
  }

  // Get the display name for a code at a specific path
  public getNameForCode(path: string[], code: string): string {
    let current = this.hierarchy.l0
    
    // Navigate to the parent level
    for (const pathSegment of path) {
      if (!current[pathSegment] || !current[pathSegment].children) {
        return code
      }
      current = current[pathSegment].children!
    }
    
    return current[code]?.name || code
  }

  // Get full category path as display names
  public getFullPath(codes: string[]): string[] {
    const names: string[] = []
    let current = this.hierarchy.l0
    
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i]
      if (!current[code]) break
      
      names.push(current[code].name)
      
      if (current[code].children) {
        current = current[code].children!
      } else {
        break // No deeper levels
      }
    }
    
    return names
  }

  // Check if we've reached the end of a classification path
  public isEndOfPath(codes: string[]): boolean {
    let current = this.hierarchy.l0
    
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i]
      if (!current[code]) return false
      
      if (i === codes.length - 1) {
        // This is the last code in our path
        return current[code].isEndNode || !current[code].children || Object.keys(current[code].children!).length === 0
      }
      
      if (!current[code].children) return true
      current = current[code].children!
    }
    
    return false
  }
}

// Singleton instance
const taxonomyParser = new TaxonomyParser()

// Track initialization state
let initPromise: Promise<TaxonomyHierarchy> | null = null

// Initialize taxonomy (only call once)
export const initializeTaxonomy = (): Promise<TaxonomyHierarchy> => {
  if (!initPromise) {
    initPromise = taxonomyParser.init()
  }
  return initPromise
}

// Helper function to ensure initialization before operations
const ensureInitialized = async () => {
  await initializeTaxonomy()
}

// Synchronous functions (assume initialization has happened)
export const getL0Options = () => taxonomyParser.getOptionsForLevel([])
export const getOptionsAtPath = (path: string[]) => taxonomyParser.getOptionsForLevel(path)
export const hasChildren = (path: string[]) => taxonomyParser.hasChildrenAtPath(path)
export const getDisplayName = (path: string[], code: string) => taxonomyParser.getNameForCode(path, code)
export const getFullDisplayPath = (codes: string[]) => taxonomyParser.getFullPath(codes)
export const isCompleteSelection = (codes: string[]) => taxonomyParser.isEndOfPath(codes)

// Export the parser instance for advanced usage
export default taxonomyParser

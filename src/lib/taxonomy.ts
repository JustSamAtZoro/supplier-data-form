// Simplified taxonomy structure for cascading dropdowns
export type CategoryLevel = {
  name: string
  children?: Record<string, CategoryLevel>
}

export type Taxonomy = Record<string, CategoryLevel>

// Mock taxonomy data with L0 -> L1 -> L2 -> L3 hierarchy
export const TAXONOMY: Taxonomy = {
  // L0 Categories (Primary High-Level Categories)
  safety: {
    name: 'Safety & Protection',
    children: {
      // L1 Subcategories
      ppe: {
        name: 'Personal Protective Equipment',
        children: {
          // L2 Subcategories
          head: {
            name: 'Head Protection',
            children: {
              // L3 End Nodes
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          },
          eye: {
            name: 'Eye Protection',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          },
          hand: {
            name: 'Hand Protection',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          }
        }
      },
      emergency: {
        name: 'Emergency Equipment',
        children: {
          'fire-safety': {
            name: 'Fire Safety',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          },
          'first-aid': {
            name: 'First Aid',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          }
        }
      }
    }
  },
  tools: {
    name: 'Tools & Equipment',
    children: {
      'hand-tools': {
        name: 'Hand Tools',
        children: {
          cutting: {
            name: 'Cutting Tools',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          },
          measuring: {
            name: 'Measuring Tools',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          }
        }
      },
      'power-tools': {
        name: 'Power Tools',
        children: {
          drilling: {
            name: 'Drilling & Driving',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          },
          cutting: {
            name: 'Cutting & Grinding',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          }
        }
      }
    }
  },
  maintenance: {
    name: 'Maintenance & Cleaning',
    children: {
      janitorial: {
        name: 'Janitorial Supplies',
        children: {
          chemicals: {
            name: 'Cleaning Chemicals',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          },
          equipment: {
            name: 'Cleaning Equipment',
            children: {
              'successful-upload': { name: 'Successful Upload' },
              'failed-upload': { name: 'Failed Upload' }
            }
          }
        }
      }
    }
  }
}

// Helper function to get L0 options
export function getL0Options(): Record<string, string> {
  const options: Record<string, string> = {}
  for (const [key, category] of Object.entries(TAXONOMY)) {
    options[key] = category.name
  }
  return options
}

// Helper function to get L1 options given L0
export function getL1Options(l0Key: string): Record<string, string> {
  const category = TAXONOMY[l0Key]
  if (!category?.children) return {}
  
  const options: Record<string, string> = {}
  for (const [key, subcategory] of Object.entries(category.children)) {
    options[key] = subcategory.name
  }
  return options
}

// Helper function to get L2 options given L0 and L1
export function getL2Options(l0Key: string, l1Key: string): Record<string, string> {
  const category = TAXONOMY[l0Key]?.children?.[l1Key]
  if (!category?.children) return {}
  
  const options: Record<string, string> = {}
  for (const [key, subcategory] of Object.entries(category.children)) {
    options[key] = subcategory.name
  }
  return options
}

// Helper function to get L3 options given L0, L1, and L2
export function getL3Options(l0Key: string, l1Key: string, l2Key: string): Record<string, string> {
  const category = TAXONOMY[l0Key]?.children?.[l1Key]?.children?.[l2Key]
  if (!category?.children) return {}
  
  const options: Record<string, string> = {}
  for (const [key, subcategory] of Object.entries(category.children)) {
    options[key] = subcategory.name
  }
  return options
}

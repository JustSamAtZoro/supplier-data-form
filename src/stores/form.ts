import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  ensureTaxonomyInitialized,
  getTaxonomyL0Options,
  getNextLevelOptions,
  canGoDeeper,
  isSelectionComplete,
  getBreadcrumbPath,
  getMaxDepthForPath,
  type TaxonomySelection,
  getSelectionArray
} from '../lib/taxonomy'

export const useFormStore = defineStore('form', () => {
  // Loading state for taxonomy initialization
  const isLoading = ref(true)
  const initError = ref<string | null>(null)
  const taxonomyReady = ref(false) // New reactive flag to trigger recomputation

  // Form data using the TaxonomySelection structure
  const formData = ref<TaxonomySelection>({
    l0: '',
    l1: '',
    l2: '',
    l3: '',
    l4: '',
    l5: ''
  })

  // Initialize taxonomy immediately when store is created
  ensureTaxonomyInitialized()
    .then(() => {
      isLoading.value = false
      taxonomyReady.value = true // Trigger reactivity
    })
    .catch((error) => {
      isLoading.value = false
      initError.value = 'Failed to load taxonomy data'
      console.error('Failed to initialize taxonomy:', error)
    })
  
  // Convert form data to array for easier processing
  const selectionArray = computed(() => getSelectionArray(formData.value))
  
  // Get current depth (number of selected levels)
  const currentDepth = computed(() => {
    return selectionArray.value.findIndex(code => !code || !code.trim())
  })
  
  // Get maximum possible depth for current selection
  const maxDepth = computed(() => {
    if (!taxonomyReady.value) return 2 // Default minimum depth
    const filledCodes = selectionArray.value.filter(code => code && code.trim())
    return getMaxDepthForPath(filledCodes)
  })
  
  // L0 options (always available)
  const l0Options = computed(() => {
    // Make this computed depend on taxonomyReady to trigger recomputation
    if (!taxonomyReady.value) {
      return {}
    }
    
    return getTaxonomyL0Options()
  })
  
  // L1 options (available after L0 selection)
  const l1Options = computed(() => {
    if (!taxonomyReady.value || !formData.value.l0) return {}
    return getNextLevelOptions([formData.value.l0])
  })
  
  // L2 options (available after L1 selection)
  const l2Options = computed(() => {
    if (!taxonomyReady.value || !formData.value.l0 || !formData.value.l1) return {}
    return getNextLevelOptions([formData.value.l0, formData.value.l1])
  })
  
  // L3 options (available after L2 selection)
  const l3Options = computed(() => {
    if (!taxonomyReady.value || !formData.value.l0 || !formData.value.l1 || !formData.value.l2) return {}
    return getNextLevelOptions([formData.value.l0, formData.value.l1, formData.value.l2])
  })
  
  // L4 options (available after L3 selection)
  const l4Options = computed(() => {
    if (!taxonomyReady.value || !formData.value.l0 || !formData.value.l1 || !formData.value.l2 || !formData.value.l3) return {}
    return getNextLevelOptions([formData.value.l0, formData.value.l1, formData.value.l2, formData.value.l3])
  })
  
  // L5 options (available after L4 selection)
  const l5Options = computed(() => {
    if (!taxonomyReady.value || !formData.value.l0 || !formData.value.l1 || !formData.value.l2 || !formData.value.l3 || !formData.value.l4) return {}
    return getNextLevelOptions([formData.value.l0, formData.value.l1, formData.value.l2, formData.value.l3, formData.value.l4])
  })
  
  // Check if form is complete (reached end of taxonomy path)
  const isFormComplete = computed(() => {
    if (!taxonomyReady.value) return false
    const codes = selectionArray.value.filter(code => code && code.trim())
    return codes.length >= 2 && isSelectionComplete(codes)
  })
  
  // Get breadcrumb path for display
  const breadcrumbPath = computed(() => {
    if (!taxonomyReady.value) return []
    const codes = selectionArray.value.filter(code => code && code.trim())
    return getBreadcrumbPath(codes)
  })
  
  // Progressive disclosure: which levels should be visible
  const visibleLevels = computed(() => {
    const levels = {
      l0: true,  // Always show L0
      l1: !!formData.value.l0,  // Show L1 when L0 is selected
      l2: !!formData.value.l1,  // Show L2 when L1 is selected
      l3: !!formData.value.l2,  // Show L3 when L2 is selected
      l4: !!formData.value.l3,  // Show L4 when L3 is selected
      l5: !!formData.value.l4   // Show L5 when L4 is selected
    }
    
    // Don't show levels beyond the maximum depth for this path
    const max = maxDepth.value
    if (max < 6) levels.l5 = false
    if (max < 5) levels.l4 = false
    if (max < 4) levels.l3 = false
    if (max < 3) levels.l2 = false
    if (max < 2) levels.l1 = false
    
    return levels
  })
  
  // Enabled state for each level (visible + has options + not loading)
  const enabledLevels = computed(() => ({
    l0: !isLoading.value && !initError.value && Object.keys(l0Options.value).length > 0,
    l1: !isLoading.value && visibleLevels.value.l1 && Object.keys(l1Options.value).length > 0,
    l2: !isLoading.value && visibleLevels.value.l2 && Object.keys(l2Options.value).length > 0,
    l3: !isLoading.value && visibleLevels.value.l3 && Object.keys(l3Options.value).length > 0,
    l4: !isLoading.value && visibleLevels.value.l4 && Object.keys(l4Options.value).length > 0,
    l5: !isLoading.value && visibleLevels.value.l5 && Object.keys(l5Options.value).length > 0
  }))
  
  // Progress calculation
  const progressInfo = computed(() => {
    const selectedCount = selectionArray.value.filter(code => code && code.trim()).length
    const totalPossible = maxDepth.value
    
    return {
      selected: selectedCount,
      total: totalPossible,
      percentage: totalPossible > 0 ? Math.round((selectedCount / totalPossible) * 100) : 0,
      isComplete: isFormComplete.value
    }
  })
  
  function updateField(key: keyof TaxonomySelection, value: string) {
    formData.value[key] = value
    
    // Handle cascading logic - clear lower level selections when higher level changes
    const levels: (keyof TaxonomySelection)[] = ['l0', 'l1', 'l2', 'l3', 'l4', 'l5']
    const currentIndex = levels.indexOf(key)
    
    // Clear all levels after the current one
    for (let i = currentIndex + 1; i < levels.length; i++) {
      formData.value[levels[i]] = ''
    }
    
    // Auto-save to localStorage
    localStorage.setItem('supplier-form-data', JSON.stringify(formData.value))
  }
  
  function clearForm() {
    formData.value = {
      l0: '',
      l1: '',
      l2: '',
      l3: '',
      l4: '',
      l5: ''
    }
    localStorage.removeItem('supplier-form-data')
  }
  
  function loadFromStorage() {
    // Only load from storage, taxonomy initialization happens in store creation
    const saved = localStorage.getItem('supplier-form-data')
    if (saved) {
      try {
        const savedData = JSON.parse(saved)
        // Only load valid data structure
        if (typeof savedData === 'object' && savedData !== null) {
          formData.value = { 
            l0: savedData.l0 || '',
            l1: savedData.l1 || '',
            l2: savedData.l2 || '',
            l3: savedData.l3 || '',
            l4: savedData.l4 || '',
            l5: savedData.l5 || ''
          }
        }
      } catch (e) {
        console.error('Failed to load form data from storage')
      }
    }
  }
  
  return {
    // Form data
    formData,
    selectionArray,
    
    // Loading state
    isLoading,
    initError,
    taxonomyReady,
    
    // Options for each level
    l0Options,
    l1Options,
    l2Options,
    l3Options,
    l4Options,
    l5Options,
    
    // UI state
    visibleLevels,
    enabledLevels,
    currentDepth,
    maxDepth,
    
    // Completion and progress
    isFormComplete,
    progressInfo,
    breadcrumbPath,
    
    // Actions
    updateField,
    clearForm,
    loadFromStorage
  }
})
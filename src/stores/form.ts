import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getL0Options, getL1Options, getL2Options, getL3Options } from '../lib/taxonomy'

export const useFormStore = defineStore('form', () => {
  const formData = ref<Record<string, any>>({
    l0Category: '',
    l1Category: '',
    l2Category: '',
    l3Category: ''
  })
  
  // L0 options (always available)
  const l0Options = computed(() => getL0Options())
  
  // L1 options (available after L0 selection)
  const l1Options = computed(() => {
    if (!formData.value.l0Category) return {}
    return getL1Options(formData.value.l0Category)
  })
  
  // L2 options (available after L1 selection)
  const l2Options = computed(() => {
    if (!formData.value.l0Category || !formData.value.l1Category) return {}
    return getL2Options(formData.value.l0Category, formData.value.l1Category)
  })
  
  // L3 options (available after L2 selection)
  const l3Options = computed(() => {
    if (!formData.value.l0Category || !formData.value.l1Category || !formData.value.l2Category) return {}
    return getL3Options(formData.value.l0Category, formData.value.l1Category, formData.value.l2Category)
  })
  
  // Check if form is complete (all dropdowns selected)
  const isFormComplete = computed(() => {
    return formData.value.l0Category && 
           formData.value.l1Category && 
           formData.value.l2Category && 
           formData.value.l3Category
  })
  
  function updateField(key: string, value: any) {
    formData.value[key] = value
    
    // Handle cascading logic - clear lower level selections when higher level changes
    if (key === 'l0Category') {
      formData.value.l1Category = ''
      formData.value.l2Category = ''
      formData.value.l3Category = ''
    } else if (key === 'l1Category') {
      formData.value.l2Category = ''
      formData.value.l3Category = ''
    } else if (key === 'l2Category') {
      formData.value.l3Category = ''
    }
    
    // Auto-save to localStorage
    localStorage.setItem('supplier-form-data', JSON.stringify(formData.value))
  }
  
  function clearForm() {
    formData.value = {
      l0Category: '',
      l1Category: '',
      l2Category: '',
      l3Category: ''
    }
    localStorage.removeItem('supplier-form-data')
  }
  
  function loadFromStorage() {
    const saved = localStorage.getItem('supplier-form-data')
    if (saved) {
      try {
        const savedData = JSON.parse(saved)
        // Only load valid data structure
        if (typeof savedData === 'object' && savedData !== null) {
          formData.value = { 
            l0Category: savedData.l0Category || '',
            l1Category: savedData.l1Category || '',
            l2Category: savedData.l2Category || '',
            l3Category: savedData.l3Category || ''
          }
        }
      } catch (e) {
        console.error('Failed to load form data from storage')
      }
    }
  }
  
  return {
    formData,
    l0Options,
    l1Options,
    l2Options,
    l3Options,
    isFormComplete,
    updateField,
    clearForm,
    loadFromStorage
  }
})
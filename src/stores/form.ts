import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TAXONOMY } from '../lib/taxonomy'

export const useFormStore = defineStore('form', () => {
  const formData = ref<Record<string, any>>({
    primaryCategory: 'Safety',
    subcategory: 'Gloves'
  })
  
  const multiSkuMode = ref(false)
  const skuForms = ref<Record<string, any>[]>([{}])
  
  const currentCategory = computed(() => formData.value.primaryCategory)
  const currentSubcategory = computed(() => formData.value.subcategory)
  
  const subcategoryOptions = computed(() => {
    const category = TAXONOMY[currentCategory.value]
    if (!category) return []
    return Object.keys(category.subcategories)
  })
  
  function updateField(key: string, value: any) {
    formData.value[key] = value
    
    // Auto-save to localStorage
    localStorage.setItem('supplier-form-data', JSON.stringify(formData.value))
  }
  
  function updateSkuForm(index: number, key: string, value: any) {
    if (!skuForms.value[index]) {
      skuForms.value[index] = {}
    }
    skuForms.value[index][key] = value
    
    // Auto-save to localStorage
    localStorage.setItem('supplier-form-sku-data', JSON.stringify(skuForms.value))
  }
  
  function addSkuForm() {
    skuForms.value.push({})
  }
  
  function removeSkuForm(index: number) {
    if (skuForms.value.length > 1) {
      skuForms.value.splice(index, 1)
      localStorage.setItem('supplier-form-sku-data', JSON.stringify(skuForms.value))
    }
  }
  
  function clearForm() {
    formData.value = {
      primaryCategory: 'Safety',
      subcategory: 'Gloves'
    }
    skuForms.value = [{}]
    localStorage.removeItem('supplier-form-data')
    localStorage.removeItem('supplier-form-sku-data')
  }
  
  function loadFromStorage() {
    const saved = localStorage.getItem('supplier-form-data')
    if (saved) {
      try {
        formData.value = { ...formData.value, ...JSON.parse(saved) }
      } catch (e) {
        console.error('Failed to load form data from storage')
      }
    }
    
    const savedSku = localStorage.getItem('supplier-form-sku-data')
    if (savedSku) {
      try {
        skuForms.value = JSON.parse(savedSku)
      } catch (e) {
        console.error('Failed to load SKU data from storage')
      }
    }
  }
  
  return {
    formData,
    multiSkuMode,
    skuForms,
    currentCategory,
    currentSubcategory,
    subcategoryOptions,
    updateField,
    updateSkuForm,
    addSkuForm,
    removeSkuForm,
    clearForm,
    loadFromStorage
  }
})
<template>
  <div class="form-card space-y-6">
    <div class="border-b border-grayLight pb-4">
      <h3 class="text-lg font-semibold text-primary">Submission Overview</h3>
    </div>
    
    <!-- Breadcrumb -->
    <div v-if="formStore.currentCategory && formStore.currentSubcategory" class="text-sm text-gray-600">
      <span class="font-medium">{{ categoryName }}</span>
      <span class="mx-2">→</span>
      <span class="font-medium">{{ subcategoryName }}</span>
    </div>
    
    <!-- Validation Status -->
    <div class="flex items-center space-x-2">
      <div class="flex items-center">
        <div :class="validationBadgeClass" class="px-3 py-1 rounded-full text-sm font-medium">
          {{ validationStatus }}
        </div>
      </div>
    </div>
    
    <!-- Progress Summary -->
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Required fields completed:</span>
        <span class="font-medium">{{ completedRequired }} / {{ totalRequired }}</span>
      </div>
      <div class="w-full bg-grayLight rounded-full h-2">
        <div 
          class="bg-primary h-2 rounded-full transition-all duration-300"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
    
    <!-- JSON Preview -->
    <div class="space-y-3">
      <button
        @click="showPreview = !showPreview"
        class="flex items-center justify-between w-full text-left text-sm font-medium text-primary hover:text-secondary"
      >
        <span>Data Preview</span>
        <svg 
          :class="{ 'rotate-180': showPreview }"
          class="h-4 w-4 transition-transform"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div v-if="showPreview" class="bg-grayLight rounded-lg p-3 max-h-64 overflow-y-auto">
        <pre class="text-xs text-gray-800">{{ formattedData }}</pre>
      </div>
    </div>
    
    <!-- Export Buttons -->
    <div class="space-y-3">
      <button
        @click="exportJSON"
        :disabled="!hasData"
        class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Export JSON
      </button>
      
      <button
        @click="exportCSV"
        :disabled="!hasData"
        class="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Export CSV
      </button>
    </div>
    
    <!-- Multi-SKU Toggle -->
    <div class="border-t border-grayLight pt-4">
      <label class="flex items-center space-x-2">
        <input
          v-model="formStore.multiSkuMode"
          type="checkbox"
          class="h-4 w-4 text-primary focus:ring-primary border-grayLight rounded"
        />
        <span class="text-sm font-medium text-black">Multi-SKU Mode</span>
      </label>
      <p class="text-xs text-gray-600 mt-1">Enable to add multiple product variants</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFormStore } from '../stores/form'
import { TAXONOMY, CORE, SHARED_DIM_PACK } from '../lib/taxonomy'
import { downloadJSON, downloadCSV } from '../lib/utils'

const formStore = useFormStore()
const showPreview = ref(false)

const categoryName = computed(() => {
  const category = TAXONOMY[formStore.currentCategory]
  return category?.name || formStore.currentCategory
})

const subcategoryName = computed(() => {
  const category = TAXONOMY[formStore.currentCategory]
  const subcategory = category?.subcategories[formStore.currentSubcategory]
  return subcategory?.name || formStore.currentSubcategory
})

const hasData = computed(() => {
  return Object.keys(formStore.formData).length > 2 // More than just category/subcategory
})

const allRequiredFields = computed(() => {
  if (!formStore.currentCategory || !formStore.currentSubcategory) return []
  
  const category = TAXONOMY[formStore.currentCategory]
  const subcategory = category?.subcategories[formStore.currentSubcategory]
  
  if (!subcategory) return []
  
  const fields = [
    ...CORE,
    ...subcategory.attributes,
    ...SHARED_DIM_PACK,
    ...(subcategory.compliance || [])
  ]
  
  return fields.filter(field => field.required)
})

const completedRequired = computed(() => {
  return allRequiredFields.value.filter(field => {
    const value = formStore.formData[field.key]
    return value !== undefined && value !== '' && value !== null
  }).length
})

const totalRequired = computed(() => allRequiredFields.value.length)

const progressPercentage = computed(() => {
  if (totalRequired.value === 0) return 0
  return Math.round((completedRequired.value / totalRequired.value) * 100)
})

const validationStatus = computed(() => {
  const missing = totalRequired.value - completedRequired.value
  if (missing === 0) return 'Ready to Submit'
  return `${missing} field${missing === 1 ? '' : 's'} missing`
})

const validationBadgeClass = computed(() => {
  const missing = totalRequired.value - completedRequired.value
  if (missing === 0) return 'bg-green-100 text-green-800'
  if (missing <= 3) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
})

const formattedData = computed(() => {
  return JSON.stringify(formStore.formData, null, 2)
})

function exportJSON() {
  const data = formStore.multiSkuMode ? formStore.skuForms : formStore.formData
  const filename = `supplier-product-data-${Date.now()}.json`
  downloadJSON(data, filename)
}

function exportCSV() {
  const data = formStore.multiSkuMode ? formStore.skuForms : [formStore.formData]
  const filename = `supplier-product-data-${Date.now()}.csv`
  downloadCSV(data, filename)
}
</script>

<template>
  <div class="form-card space-y-6">
    <div class="border-b border-grayLight pb-4">
      <h3 class="text-lg font-semibold text-primary">Submission Overview</h3>
      <p class="text-sm text-gray-600 mt-1">Review your category selection before uploading</p>
    </div>
    
    <!-- Selection Path Breadcrumb -->
    <div class="space-y-3">
      <h4 class="text-sm font-medium text-black">Selected Category Path:</h4>
      <div v-if="hasAnySelection" class="bg-grayLight rounded-lg p-4">
        <div class="space-y-2 text-sm">
          <div class="flex items-center space-x-2">
            <span class="text-xs bg-primary text-white px-2 py-1 rounded font-medium">L0</span>
            <span :class="l0Class">
              {{ l0Name || 'Not selected' }}
            </span>
          </div>
          
          <div v-if="formStore.formData.l0Category" class="flex items-center space-x-2 ml-4">
            <span class="text-xs bg-secondary text-white px-2 py-1 rounded font-medium">L1</span>
            <span :class="l1Class">
              {{ l1Name || 'Not selected' }}
            </span>
          </div>
          
          <div v-if="formStore.formData.l1Category" class="flex items-center space-x-2 ml-8">
            <span class="text-xs bg-accent text-white px-2 py-1 rounded font-medium">L2</span>
            <span :class="l2Class">
              {{ l2Name || 'Not selected' }}
            </span>
          </div>
          
          <div v-if="formStore.formData.l2Category" class="flex items-center space-x-2 ml-12">
            <span class="text-xs bg-accentDark text-white px-2 py-1 rounded font-medium">L3</span>
            <span :class="l3Class">
              {{ l3Name || 'Not selected' }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-sm">No category selected</p>
        <p class="text-xs text-gray-400 mt-1">Start by selecting a primary category</p>
      </div>
    </div>
    
    <!-- Upload Status -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-medium text-black">Upload Status:</h4>
        <div :class="statusBadgeClass" class="px-3 py-1 rounded-full text-sm font-medium">
          {{ statusText }}
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full bg-grayLight rounded-full h-3">
        <div 
          class="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      
      <div class="flex justify-between text-xs text-gray-600">
        <span>{{ completedSteps }} of 4 steps completed</span>
        <span>{{ progressPercentage }}%</span>
      </div>
    </div>
    
    <!-- Next Steps -->
    <div class="space-y-3">
      <h4 class="text-sm font-medium text-black">Next Steps:</h4>
      <div class="space-y-2 text-sm">
        <div v-if="!formStore.formData.l0Category" class="flex items-center space-x-2 text-gray-600">
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <span>Select your primary category (L0)</span>
        </div>
        
        <div v-else-if="!formStore.formData.l1Category" class="flex items-center space-x-2 text-gray-600">
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <span>Choose an L1 subcategory</span>
        </div>
        
        <div v-else-if="!formStore.formData.l2Category" class="flex items-center space-x-2 text-gray-600">
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <span>Select an L2 subcategory</span>
        </div>
        
        <div v-else-if="!formStore.formData.l3Category" class="flex items-center space-x-2 text-gray-600">
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <span>Choose your end node (L3)</span>
        </div>
        
        <div v-else class="flex items-center space-x-2 text-green-600">
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
          <span class="font-medium">Ready to upload your CSV file!</span>
        </div>
      </div>
    </div>
    
    <!-- Data Summary (when complete) -->
    <div v-if="formStore.isFormComplete" class="border-t border-grayLight pt-4 space-y-3">
      <h4 class="text-sm font-medium text-black">Selection Summary:</h4>
      <div class="bg-green-50 border border-green-200 rounded-lg p-3">
        <div class="text-sm text-green-800">
          <p class="font-medium mb-2">Category Path:</p>
          <p class="text-xs font-mono bg-white px-2 py-1 rounded border">
            {{ fullCategoryPath }}
          </p>
          
          <p class="font-medium mt-3 mb-1">Upload Type:</p>
          <p class="text-xs">
            {{ uploadTypeDescription }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Help Text -->
    <div class="text-xs text-gray-500 border-t border-grayLight pt-4">
      <p class="mb-1">
        <strong>Note:</strong> This form is for product category classification only.
      </p>
      <p>
        Complete all 4 levels to enable CSV upload functionality.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormStore } from '../stores/form'

const formStore = useFormStore()

const hasAnySelection = computed(() => {
  return !!formStore.formData.l0Category
})

const completedSteps = computed(() => {
  let count = 0
  if (formStore.formData.l0Category) count++
  if (formStore.formData.l1Category) count++
  if (formStore.formData.l2Category) count++
  if (formStore.formData.l3Category) count++
  return count
})

const progressPercentage = computed(() => {
  return Math.round((completedSteps.value / 4) * 100)
})

const statusText = computed(() => {
  if (completedSteps.value === 0) return 'Not Started'
  if (completedSteps.value === 4) return 'Ready to Upload'
  return `${completedSteps.value}/4 Selected`
})

const statusBadgeClass = computed(() => {
  if (completedSteps.value === 0) return 'bg-gray-100 text-gray-700'
  if (completedSteps.value === 4) return 'bg-green-100 text-green-800'
  return 'bg-yellow-100 text-yellow-800'
})

// Category names
const l0Name = computed(() => {
  return formStore.l0Options[formStore.formData.l0Category] || null
})

const l1Name = computed(() => {
  return formStore.l1Options[formStore.formData.l1Category] || null
})

const l2Name = computed(() => {
  return formStore.l2Options[formStore.formData.l2Category] || null
})

const l3Name = computed(() => {
  return formStore.l3Options[formStore.formData.l3Category] || null
})

// Styling for category names
const l0Class = computed(() => formStore.formData.l0Category ? 'text-black font-medium' : 'text-gray-400')
const l1Class = computed(() => formStore.formData.l1Category ? 'text-black font-medium' : 'text-gray-400')
const l2Class = computed(() => formStore.formData.l2Category ? 'text-black font-medium' : 'text-gray-400')
const l3Class = computed(() => formStore.formData.l3Category ? 'text-black font-medium' : 'text-gray-400')

const fullCategoryPath = computed(() => {
  const parts = []
  if (l0Name.value) parts.push(l0Name.value)
  if (l1Name.value) parts.push(l1Name.value)
  if (l2Name.value) parts.push(l2Name.value)
  if (l3Name.value) parts.push(l3Name.value)
  return parts.join(' → ')
})

const uploadTypeDescription = computed(() => {
  if (formStore.formData.l3Category === 'successful-upload') {
    return 'This selection will simulate a successful CSV upload process.'
  } else if (formStore.formData.l3Category === 'failed-upload') {
    return 'This selection will simulate a failed CSV upload process for testing.'
  }
  return 'Unknown upload type'
})
</script>
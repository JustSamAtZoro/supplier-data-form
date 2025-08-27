<template>
  <div class="form-card space-y-6">
    <div class="border-b border-grayLight pb-4">
      <h3 class="text-lg font-semibold text-primary">Upload Preparation</h3>
      <p class="text-sm text-gray-600 mt-1">Select your product category to prepare for CSV upload</p>
    </div>
    
    <!-- Current Status -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-medium text-black">Status:</h4>
        <div :class="statusBadgeClass" class="px-3 py-1 rounded-full text-sm font-medium">
          {{ statusText }}
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full bg-grayLight rounded-full h-3">
        <div 
          class="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
          :style="{ width: formStore.progressInfo.percentage + '%' }"
        ></div>
      </div>
      
      <div class="flex justify-between text-xs text-gray-600">
        <span>{{ formStore.progressInfo.selected }} of {{ formStore.progressInfo.total }} levels selected</span>
        <span>{{ formStore.progressInfo.percentage }}%</span>
      </div>
    </div>
    
    <!-- Category Path Visualization -->
    <div class="space-y-3">
      <h4 class="text-sm font-medium text-black">Category Path:</h4>
      
      <div v-if="hasAnySelection" class="space-y-2">
        <!-- Level indicators -->
        <div 
          v-for="(level, index) in levelDisplay" 
          :key="level.key"
          class="flex items-center space-x-3"
          :class="{ 'opacity-50': !level.selected }"
        >
          <div class="flex items-center space-x-2">
            <span 
              :class="level.badgeClass"
              class="text-xs px-2 py-1 rounded font-medium min-w-[2rem] text-center"
            >
              {{ level.label }}
            </span>
            <div class="flex-1">
              <span v-if="level.selected" class="text-black font-medium">
                {{ level.name }}
              </span>
              <span v-else class="text-gray-400 text-sm">
                {{ level.placeholder }}
              </span>
            </div>
          </div>
          
          <!-- Connection arrow (except for last visible level) -->
          <div 
            v-if="index < visibleLevelCount - 1"
            class="text-gray-300 text-xs"
          >
            ↓
          </div>
        </div>
        
        <!-- Current step indicator -->
        <div v-if="!formStore.isFormComplete" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center space-x-2 text-blue-800">
            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            <span class="text-sm font-medium">{{ nextStepMessage }}</span>
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
    
    <!-- Upload Ready Summary -->
    <div v-if="formStore.isFormComplete" class="border-t border-grayLight pt-4 space-y-3">
      <h4 class="text-sm font-medium text-black">Ready for Upload:</h4>
      <div class="bg-green-50 border border-green-200 rounded-lg p-3">
        <div class="text-sm text-green-800">
          <p class="font-medium mb-2">Selected Category Path:</p>
          <p class="text-xs font-mono bg-white px-2 py-1 rounded border break-all">
            {{ fullCategoryPath }}
          </p>
          
          <div class="mt-3 text-xs">
            <p class="mb-1">✅ Category classification complete</p>
            <p class="mb-1">📁 Ready to accept CSV uploads</p>
            <p>🎯 Products will be classified under this category</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Taxonomy Statistics -->
    <div class="border-t border-grayLight pt-4 space-y-3">
      <h4 class="text-sm font-medium text-black">System Information:</h4>
      <div v-if="formStore.isLoading" class="text-xs text-gray-600">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading taxonomy data...</span>
        </div>
      </div>
      <div v-else-if="formStore.initError" class="text-xs text-red-600">
        <p>• Error loading taxonomy system</p>
        <p>• Please refresh the page to retry</p>
      </div>
      <div v-else class="text-xs text-gray-600 space-y-1">
        <p>• {{ Object.keys(formStore.l0Options).length }} primary categories loaded</p>
        <p>• Variable depth: 2-6 levels supported</p>
        <p>• 5,700+ product classifications</p>
        <p>• Progressive disclosure interface</p>
      </div>
    </div>
    
    <!-- Help Text -->
    <div class="text-xs text-gray-500 border-t border-grayLight pt-4">
      <p class="mb-1">
        <strong>How it works:</strong> Select your product category to classify the type of products you're uploading.
      </p>
      <p>
        Once complete, you can upload a CSV file containing your product data for that category.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormStore } from '../stores/form'

const formStore = useFormStore()

const hasAnySelection = computed(() => {
  return !!formStore.formData.l0
})

const statusText = computed(() => {
  if (formStore.progressInfo.selected === 0) return 'Select Category'
  if (formStore.progressInfo.isComplete) return 'Ready to Upload'
  return `${formStore.progressInfo.selected}/${formStore.progressInfo.total} Selected`
})

const statusBadgeClass = computed(() => {
  if (formStore.progressInfo.selected === 0) return 'bg-gray-100 text-gray-700'
  if (formStore.progressInfo.isComplete) return 'bg-green-100 text-green-800'
  return 'bg-yellow-100 text-yellow-800'
})

const levelDisplay = computed(() => {
  const levels = [
    { 
      key: 'l0', 
      label: 'L0', 
      selected: !!formStore.formData.l0, 
      name: getDisplayName(formStore.l0Options, formStore.formData.l0),
      placeholder: 'Select primary category',
      badgeClass: 'bg-primary text-white'
    },
    { 
      key: 'l1', 
      label: 'L1', 
      selected: !!formStore.formData.l1, 
      name: getDisplayName(formStore.l1Options, formStore.formData.l1),
      placeholder: 'Select L1 subcategory',
      badgeClass: 'bg-secondary text-white'
    },
    { 
      key: 'l2', 
      label: 'L2', 
      selected: !!formStore.formData.l2, 
      name: getDisplayName(formStore.l2Options, formStore.formData.l2),
      placeholder: 'Select L2 subcategory',
      badgeClass: 'bg-accent text-white'
    },
    { 
      key: 'l3', 
      label: 'L3', 
      selected: !!formStore.formData.l3, 
      name: getDisplayName(formStore.l3Options, formStore.formData.l3),
      placeholder: 'Select L3 subcategory',
      badgeClass: 'bg-accentDark text-white'
    },
    { 
      key: 'l4', 
      label: 'L4', 
      selected: !!formStore.formData.l4, 
      name: getDisplayName(formStore.l4Options, formStore.formData.l4),
      placeholder: 'Select L4 subcategory',
      badgeClass: 'bg-gray-600 text-white'
    },
    { 
      key: 'l5', 
      label: 'L5', 
      selected: !!formStore.formData.l5, 
      name: getDisplayName(formStore.l5Options, formStore.formData.l5),
      placeholder: 'Select L5 subcategory',
      badgeClass: 'bg-gray-800 text-white'
    }
  ]
  
  // Only show levels up to the maximum depth for current path
  return levels.slice(0, formStore.maxDepth)
})

const visibleLevelCount = computed(() => {
  return levelDisplay.value.length
})

const nextStepMessage = computed(() => {
  const currentLevel = formStore.progressInfo.selected
  if (currentLevel === 0) return 'Select your primary category to begin'
  if (currentLevel < formStore.progressInfo.total) {
    return `Select L${currentLevel} subcategory to continue`
  }
  return 'Ready to upload your CSV file!'
})

const fullCategoryPath = computed(() => {
  return formStore.breadcrumbPath.join(' → ')
})

function getDisplayName(options: Record<string, string>, code: string): string {
  return options[code] || code
}
</script>
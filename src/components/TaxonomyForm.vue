<template>
  <div class="space-y-8">
    <!-- Category Selection -->
    <div class="form-card">
      <div class="space-y-6">
        <div class="border-b border-grayLight pb-4">
          <h2 class="text-2xl font-semibold text-primary mb-2">Product Category Selection</h2>
          <p class="text-gray-600">Select your product category through our hierarchical classification system</p>
          
          <!-- Loading State -->
          <div v-if="formStore.isLoading" class="flex items-center space-x-2 text-blue-600 mt-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm">Loading categories...</span>
          </div>
          
          <!-- Error State -->
          <div v-else-if="formStore.initError" class="flex items-center space-x-2 text-red-600 mt-2">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">{{ formStore.initError }}</span>
          </div>
          
          <!-- Success State -->
          <p v-else class="text-sm text-gray-500 mt-2">
            <i class="fas fa-info-circle mr-1"></i>
            Additional category levels may appear based on your selection
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- L0 Primary Category -->
          <div>
            <label for="l0" class="block text-sm font-medium text-black mb-2">
              Primary Category (L0) <span class="text-accent">*</span>
            </label>
            <select
              id="l0"
              v-model="formStore.formData.l0"
              class="input-field"
              :disabled="!formStore.enabledLevels.l0"
              @change="onFieldChange('l0')"
            >
              <option value="" v-if="formStore.isLoading">Loading categories...</option>
              <option value="" v-else-if="formStore.initError">Error loading categories</option>
              <option value="" v-else>Select Primary Category...</option>
              <option 
                v-for="(name, code) in formStore.l0Options" 
                :key="code" 
                :value="code"
              >
                {{ name }}
              </option>
            </select>
          </div>
          
          <!-- L1 Subcategory -->
          <div v-show="formStore.visibleLevels.l1">
            <label for="l1" class="block text-sm font-medium text-black mb-2">
              L1 Subcategory <span class="text-accent">*</span>
            </label>
            <select
              id="l1"
              v-model="formStore.formData.l1"
              class="input-field"
              :disabled="!formStore.enabledLevels.l1"
              @change="onFieldChange('l1')"
            >
              <option value="">Select L1 Subcategory...</option>
              <option 
                v-for="(name, code) in formStore.l1Options" 
                :key="code" 
                :value="code"
              >
                {{ name }}
              </option>
            </select>
          </div>
          
          <!-- L2 Subcategory -->
          <div v-show="formStore.visibleLevels.l2">
            <label for="l2" class="block text-sm font-medium text-black mb-2">
              L2 Subcategory <span class="text-accent">*</span>
            </label>
            <select
              id="l2"
              v-model="formStore.formData.l2"
              class="input-field"
              :disabled="!formStore.enabledLevels.l2"
              @change="onFieldChange('l2')"
            >
              <option value="">Select L2 Subcategory...</option>
              <option 
                v-for="(name, code) in formStore.l2Options" 
                :key="code" 
                :value="code"
              >
                {{ name }}
              </option>
            </select>
          </div>
          
          <!-- L3 Subcategory -->
          <div v-show="formStore.visibleLevels.l3">
            <label for="l3" class="block text-sm font-medium text-black mb-2">
              L3 Subcategory <span class="text-accent">*</span>
            </label>
            <select
              id="l3"
              v-model="formStore.formData.l3"
              class="input-field"
              :disabled="!formStore.enabledLevels.l3"
              @change="onFieldChange('l3')"
            >
              <option value="">Select L3 Subcategory...</option>
              <option 
                v-for="(name, code) in formStore.l3Options" 
                :key="code" 
                :value="code"
              >
                {{ name }}
              </option>
            </select>
          </div>
          
          <!-- L4 Subcategory -->
          <div v-show="formStore.visibleLevels.l4">
            <label for="l4" class="block text-sm font-medium text-black mb-2">
              L4 Subcategory <span class="text-accent">*</span>
            </label>
            <select
              id="l4"
              v-model="formStore.formData.l4"
              class="input-field"
              :disabled="!formStore.enabledLevels.l4"
              @change="onFieldChange('l4')"
            >
              <option value="">Select L4 Subcategory...</option>
              <option 
                v-for="(name, code) in formStore.l4Options" 
                :key="code" 
                :value="code"
              >
                {{ name }}
              </option>
            </select>
          </div>
          
          <!-- L5 Subcategory -->
          <div v-show="formStore.visibleLevels.l5">
            <label for="l5" class="block text-sm font-medium text-black mb-2">
              L5 Subcategory <span class="text-accent">*</span>
            </label>
            <select
              id="l5"
              v-model="formStore.formData.l5"
              class="input-field"
              :disabled="!formStore.enabledLevels.l5"
              @change="onFieldChange('l5')"
            >
              <option value="">Select L5 Subcategory...</option>
              <option 
                v-for="(name, code) in formStore.l5Options" 
                :key="code" 
                :value="code"
              >
                {{ name }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- Progress Indicator -->
        <div v-if="formStore.formData.l0" class="bg-grayLight rounded-lg p-4">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="text-gray-600">Selection Progress:</span>
            <span class="font-medium">{{ formStore.progressInfo.selected }} / {{ formStore.progressInfo.total }}</span>
          </div>
          <div class="w-full bg-white rounded-full h-2">
            <div 
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: formStore.progressInfo.percentage + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-600 mt-1">
            <span>{{ progressDescription }}</span>
            <span>{{ formStore.progressInfo.percentage }}%</span>
          </div>
        </div>
        
        <!-- Category Breadcrumb -->
        <div v-if="formStore.breadcrumbPath.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 class="text-sm font-medium text-blue-800 mb-2">Selected Path:</h4>
          <div class="flex items-center space-x-2 text-sm">
            <span 
              v-for="(name, index) in formStore.breadcrumbPath" 
              :key="index"
              class="text-blue-700"
            >
              <span class="font-medium">{{ name }}</span>
              <span v-if="index < formStore.breadcrumbPath.length - 1" class="text-blue-500 mx-2">→</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- CSV Upload Section -->
    <div class="form-card">
      <div class="space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold text-primary mb-2">Upload Product Data</h3>
            <p class="text-sm text-gray-600">
              Upload your CSV file containing product information for the selected category
            </p>
          </div>
          
          <button
            type="button"
            @click="clearForm"
            class="px-4 py-2 text-accent hover:text-accentDark font-medium transition-colors"
          >
            Clear Selections
          </button>
        </div>
        
        <!-- File Upload Area -->
        <div v-if="formStore.isFormComplete" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
          <input
            ref="fileInput"
            type="file"
            accept=".csv,.xlsx,.xls"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          
          <div class="space-y-2">
            <button
              type="button"
              @click="triggerFileSelect"
              class="btn-primary px-6 py-3 text-lg"
            >
              Choose CSV File
            </button>
            <p class="text-sm text-gray-500">or drag and drop your file here</p>
            <p class="text-xs text-gray-400">Supports: .csv, .xlsx, .xls</p>
          </div>
          
          <div v-if="selectedFile" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-sm text-blue-800 font-medium">{{ selectedFile.name }}</span>
                <span class="text-xs text-blue-600">({{ formatFileSize(selectedFile.size) }})</span>
              </div>
              <button
                type="button"
                @click="removeFile"
                class="text-blue-600 hover:text-blue-800"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <button
              type="button"
              @click="uploadFile"
              :disabled="isUploading"
              class="mt-3 w-full btn-primary py-2 disabled:opacity-50"
            >
              <span v-if="isUploading">Uploading...</span>
              <span v-else>Upload to {{ formStore.breadcrumbPath[formStore.breadcrumbPath.length - 1] }}</span>
            </button>
          </div>
        </div>
        
        <!-- Category Selection Required Message -->
        <div v-else class="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-500 font-medium mb-1">Complete Category Selection</p>
          <p class="text-sm text-gray-400">
            Select your product category first, then you can upload your CSV file
          </p>
        </div>
      </div>
    </div>

    <!-- Upload Success/Error Alert -->
    <div
      v-if="uploadAlert.show"
      :class="uploadAlert.type === 'success' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'"
      class="form-card transition-all duration-300 border-l-4"
    >
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg 
            v-if="uploadAlert.type === 'success'" 
            class="h-6 w-6 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg 
            v-else 
            class="h-6 w-6 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 :class="uploadAlert.type === 'success' ? 'text-green-800' : 'text-red-800'" class="text-lg font-semibold">
            {{ uploadAlert.title }}
          </h3>
          <p :class="uploadAlert.type === 'success' ? 'text-green-700' : 'text-red-700'" class="mt-1">
            {{ uploadAlert.message }}
          </p>
          <div v-if="uploadAlert.type === 'success'" class="mt-3 text-sm text-green-600">
            <strong>Category:</strong> {{ formStore.breadcrumbPath.join(' → ') }}
            <br>
            <strong>File:</strong> {{ uploadAlert.fileName }} ({{ uploadAlert.fileSize }})
          </div>
        </div>
        <button
          @click="uploadAlert.show = false"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFormStore } from '../stores/form'
import type { TaxonomySelection } from '../lib/taxonomy'

const formStore = useFormStore()
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)

const uploadAlert = ref({
  show: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: '',
  fileName: '',
  fileSize: ''
})

const progressDescription = computed(() => {
  if (formStore.progressInfo.isComplete) {
    return 'Classification complete - ready to upload CSV'
  } else if (formStore.progressInfo.selected === 0) {
    return 'Start by selecting a primary category'
  } else {
    return `${formStore.progressInfo.total - formStore.progressInfo.selected} more level(s) needed`
  }
})

function onFieldChange(fieldName: keyof TaxonomySelection) {
  // The store handles the cascading logic automatically
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function triggerFileSelect() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validTypes.includes(fileExtension)) {
      uploadAlert.value = {
        show: true,
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please select a CSV, Excel (.xlsx), or Excel 97-2003 (.xls) file.',
        fileName: file.name,
        fileSize: formatFileSize(file.size)
      }
      return
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      uploadAlert.value = {
        show: true,
        type: 'error',
        title: 'File Too Large',
        message: 'File size must be less than 10MB. Please compress your file or split it into smaller files.',
        fileName: file.name,
        fileSize: formatFileSize(file.size)
      }
      return
    }
    
    selectedFile.value = file
  }
}

function removeFile() {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function uploadFile() {
  if (!selectedFile.value || !formStore.isFormComplete) {
    return
  }
  
  isUploading.value = true
  
  try {
    // Simulate file upload process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate random success/failure for demo purposes
    // In real implementation, this would be an actual API call
    const isSuccess = Math.random() > 0.3 // 70% success rate
    
    if (isSuccess) {
      uploadAlert.value = {
        show: true,
        type: 'success',
        title: 'Upload Successful!',
        message: `Your product data has been successfully uploaded and categorized. Our team will review the information and it will be processed within 24-48 hours.`,
        fileName: selectedFile.value.name,
        fileSize: formatFileSize(selectedFile.value.size)
      }
      
      // Clear the file selection after successful upload
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    } else {
      uploadAlert.value = {
        show: true,
        type: 'error',
        title: 'Upload Failed',
        message: 'There was an error processing your file. Please check the file format and content, then try again. If the problem persists, contact support.',
        fileName: selectedFile.value.name,
        fileSize: formatFileSize(selectedFile.value.size)
      }
    }
  } catch (error) {
    uploadAlert.value = {
      show: true,
      type: 'error',
      title: 'Upload Error',
      message: 'An unexpected error occurred during upload. Please try again later.',
      fileName: selectedFile.value?.name || '',
      fileSize: selectedFile.value ? formatFileSize(selectedFile.value.size) : ''
    }
  } finally {
    isUploading.value = false
  }
}

function clearForm() {
  formStore.clearForm()
  selectedFile.value = null
  uploadAlert.value.show = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
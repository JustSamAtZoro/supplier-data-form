<template>
  <div class="space-y-8">
    <!-- Category Selection -->
    <div class="form-card">
      <div class="space-y-6">
        <div class="border-b border-grayLight pb-4">
          <h2 class="text-2xl font-semibold text-primary mb-2">Product Category Selection</h2>
          <p class="text-gray-600">Select your product category through our hierarchical classification system</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- L0 Primary Category -->
          <div>
            <label for="l0Category" class="block text-sm font-medium text-black mb-2">
              Primary Category <span class="text-accent">*</span>
            </label>
            <select
              id="l0Category"
              v-model="formStore.formData.l0Category"
              class="input-field"
              @change="onFieldChange('l0Category')"
            >
              <option value="">Select Primary Category...</option>
              <option 
                v-for="(name, key) in formStore.l0Options" 
                :key="key" 
                :value="key"
              >
                {{ name }}
              </option>
            </select>
          </div>
          
          <!-- L1 Subcategory -->
          <div>
            <label for="l1Category" class="block text-sm font-medium text-black mb-2">
              L1 Subcategory <span class="text-accent">*</span>
            </label>
            <select
              id="l1Category"
              v-model="formStore.formData.l1Category"
              class="input-field"
              :disabled="!formStore.formData.l0Category"
              @change="onFieldChange('l1Category')"
            >
              <option value="">Select L1 Subcategory...</option>
              <option 
                v-for="(name, key) in formStore.l1Options" 
                :key="key" 
                :value="key"
              >
                {{ name }}
              </option>
            </select>
          </div>
          
          <!-- L2 Subcategory -->
          <div>
            <label for="l2Category" class="block text-sm font-medium text-black mb-2">
              L2 Subcategory <span class="text-accent">*</span>
            </label>
            <select
              id="l2Category"
              v-model="formStore.formData.l2Category"
              class="input-field"
              :disabled="!formStore.formData.l1Category"
              @change="onFieldChange('l2Category')"
            >
              <option value="">Select L2 Subcategory...</option>
              <option 
                v-for="(name, key) in formStore.l2Options" 
                :key="key" 
                :value="key"
              >
                {{ name }}
              </option>
            </select>
          </div>
          
          <!-- L3 End Node Subcategory -->
          <div>
            <label for="l3Category" class="block text-sm font-medium text-black mb-2">
              End Node Subcategory <span class="text-accent">*</span>
            </label>
            <select
              id="l3Category"
              v-model="formStore.formData.l3Category"
              class="input-field"
              :disabled="!formStore.formData.l2Category"
              @change="onFieldChange('l3Category')"
            >
              <option value="">Select End Node...</option>
              <option 
                v-for="(name, key) in formStore.l3Options" 
                :key="key" 
                :value="key"
              >
                {{ name }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- Progress Indicator -->
        <div v-if="formStore.formData.l0Category" class="bg-grayLight rounded-lg p-4">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="text-gray-600">Selection Progress:</span>
            <span class="font-medium">{{ selectionCount }} / 4</span>
          </div>
          <div class="w-full bg-white rounded-full h-2">
            <div 
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="form-card">
      <div class="flex justify-between items-center">
        <button
          type="button"
          @click="clearForm"
          class="px-6 py-3 text-accent hover:text-accentDark font-medium transition-colors"
        >
          Clear Selections
        </button>
        
        <button
          type="button"
          @click="submitForm"
          :disabled="!formStore.isFormComplete"
          class="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Upload CSV
        </button>
      </div>
    </div>

    <!-- Success/Error Alert -->
    <div
      v-if="showAlert"
      :class="alertClass"
      class="form-card transition-all duration-300 border-l-4"
    >
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg 
            v-if="alertType === 'success'" 
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
          <h3 :class="alertTitleClass" class="text-lg font-semibold">
            {{ alertTitle }}
          </h3>
          <p :class="alertTextClass" class="mt-1">
            {{ alertMessage }}
          </p>
        </div>
        <button
          @click="showAlert = false"
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

const formStore = useFormStore()
const showAlert = ref(false)
const alertType = ref<'success' | 'error'>('success')

const selectionCount = computed(() => {
  let count = 0
  if (formStore.formData.l0Category) count++
  if (formStore.formData.l1Category) count++
  if (formStore.formData.l2Category) count++
  if (formStore.formData.l3Category) count++
  return count
})

const progressPercentage = computed(() => {
  return (selectionCount.value / 4) * 100
})

const alertClass = computed(() => {
  if (alertType.value === 'success') {
    return 'bg-green-50 border-green-400'
  } else {
    return 'bg-red-50 border-red-400'
  }
})

const alertTitleClass = computed(() => {
  return alertType.value === 'success' ? 'text-green-800' : 'text-red-800'
})

const alertTextClass = computed(() => {
  return alertType.value === 'success' ? 'text-green-700' : 'text-red-700'
})

const alertTitle = computed(() => {
  return alertType.value === 'success' ? 'Upload Successful!' : 'Upload Failed'
})

const alertMessage = computed(() => {
  if (alertType.value === 'success') {
    return 'Your CSV has been successfully processed and uploaded to our system. You can now submit another file or close this form.'
  } else {
    return 'There was an error processing your CSV file. Please check your file format and try again, or contact support if the issue persists.'
  }
})

function onFieldChange(fieldName: string) {
  // The store handles the cascading logic automatically
}

function submitForm() {
  if (!formStore.isFormComplete) {
    return
  }

  // Determine success or failure based on the L3 selection
  const isSuccess = formStore.formData.l3Category === 'successful-upload'
  alertType.value = isSuccess ? 'success' : 'error'
  
  // Show the alert
  showAlert.value = true
  
  // Clear the form after a brief delay to show the message
  setTimeout(() => {
    clearForm()
  }, 3000)
}

function clearForm() {
  formStore.clearForm()
  showAlert.value = false
}
</script>
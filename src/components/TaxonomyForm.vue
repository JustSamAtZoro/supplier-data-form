<template>
  <div class="space-y-8">
    <!-- Category Selection -->
    <div class="form-card">
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-primary">Product Category</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="primaryCategory" class="block text-sm font-medium text-black">
              Primary Category <span class="text-accent">*</span>
            </label>
            <select
              id="primaryCategory"
              v-model="formStore.formData.primaryCategory"
              class="input-field mt-1"
              @change="onCategoryChange"
            >
              <option value="">Select Category...</option>
              <option value="Safety">Safety (PPE)</option>
              <option value="Janitorial & Cleaning">Janitorial & Cleaning</option>
            </select>
          </div>
          
          <div>
            <label for="subcategory" class="block text-sm font-medium text-black">
              Subcategory <span class="text-accent">*</span>
            </label>
            <select
              id="subcategory"
              v-model="formStore.formData.subcategory"
              class="input-field mt-1"
              :disabled="!formStore.formData.primaryCategory"
            >
              <option value="">Select Subcategory...</option>
              <option v-for="sub in formStore.subcategoryOptions" :key="sub" :value="sub">
                {{ getSubcategoryName(sub) }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic Form Fields -->
    <div v-if="formStore.formData.primaryCategory && formStore.formData.subcategory">
      <!-- Core Fields -->
      <FieldGroup
        title="Core Product Information"
        description="Essential product details required for all items"
        :fields="coreFields"
        :form-data="formStore.formData"
        :errors="errors"
        @update:field="formStore.updateField"
      />

      <!-- Category-specific Fields -->
      <FieldGroup
        v-if="categoryFields.length > 0"
        :title="`${currentSubcategory?.name} Attributes`"
        description="Category-specific product attributes"
        :fields="categoryFields"
        :form-data="formStore.formData"
        :errors="errors"
        @update:field="formStore.updateField"
      />

      <!-- Dimensions & Packaging -->
      <FieldGroup
        title="Dimensions & Packaging"
        description="Physical specifications and packaging information"
        :fields="dimensionFields"
        :form-data="formStore.formData"
        :errors="errors"
        @update:field="formStore.updateField"
      />

      <!-- Compliance -->
      <FieldGroup
        v-if="complianceFields.length > 0"
        title="Compliance & Certifications"
        description="Regulatory compliance and certification information"
        :fields="complianceFields"
        :form-data="formStore.formData"
        :errors="errors"
        @update:field="formStore.updateField"
      />

      <!-- Submit Button -->
      <div class="form-card">
        <div class="flex justify-between items-center">
          <button
            type="button"
            @click="clearForm"
            class="px-4 py-2 text-accent hover:text-accentDark font-medium"
          >
            Clear Form
          </button>
          
          <div class="space-x-4">
            <button
              type="button"
              @click="validateForm"
              class="btn-secondary"
            >
              Validate
            </button>
            <button
              type="button"
              @click="submitForm"
              class="btn-primary"
            >
              Submit Product Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFormStore } from '../stores/form'
import { CORE, SHARED_DIM_PACK, TAXONOMY } from '../lib/taxonomy'
import { getVisibleFields } from '../lib/utils'
import FieldGroup from './FieldGroup.vue'

const formStore = useFormStore()
const errors = ref<Record<string, string>>({})

const coreFields = computed(() => 
  getVisibleFields(CORE, formStore.formData)
)

const dimensionFields = computed(() => 
  getVisibleFields(SHARED_DIM_PACK, formStore.formData)
)

const currentSubcategory = computed(() => {
  const category = TAXONOMY[formStore.currentCategory]
  if (!category) return null
  return category.subcategories[formStore.currentSubcategory]
})

const categoryFields = computed(() => {
  if (!currentSubcategory.value) return []
  return getVisibleFields(currentSubcategory.value.attributes, formStore.formData)
})

const complianceFields = computed(() => {
  if (!currentSubcategory.value?.compliance) return []
  return getVisibleFields(currentSubcategory.value.compliance, formStore.formData)
})

function getSubcategoryName(key: string): string {
  const category = TAXONOMY[formStore.currentCategory]
  if (!category) return key
  return category.subcategories[key]?.name || key
}

function onCategoryChange() {
  // Reset subcategory when category changes
  formStore.updateField('subcategory', '')
  errors.value = {}
}

function validateForm() {
  errors.value = {}
  
  // Simple validation - check required fields
  const allFields = [
    ...coreFields.value,
    ...categoryFields.value,
    ...dimensionFields.value,
    ...complianceFields.value
  ]
  
  let hasErrors = false
  
  for (const field of allFields) {
    if (field.required) {
      const value = formStore.formData[field.key]
      if (!value || value === '') {
        errors.value[field.key] = 'This field is required'
        hasErrors = true
      }
    }
  }
  
  if (!hasErrors) {
    alert('Form validation passed! ✅')
  } else {
    alert('Please fix the validation errors before submitting.')
  }
}

function submitForm() {
  validateForm()
  if (Object.keys(errors.value).length === 0) {
    console.log('Submitting form data:', formStore.formData)
    alert('Form submitted successfully! Check the console for data.')
  }
}

function clearForm() {
  if (confirm('Are you sure you want to clear all form data?')) {
    formStore.clearForm()
    errors.value = {}
  }
}
</script>

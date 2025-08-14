<template>
  <div class="space-y-2">
    <label :for="field.key" class="block text-sm font-medium text-black">
      {{ field.label }}
      <span v-if="field.required" class="text-accent">*</span>
    </label>
    
    <!-- Text Input -->
    <input
      v-if="field.type === 'text'"
      :id="field.key"
      v-model="value"
      type="text"
      class="input-field"
      :class="{ 'border-accent': hasError }"
      :aria-describedby="helpTextId"
      :aria-invalid="hasError"
    />
    
    <!-- Textarea -->
    <textarea
      v-else-if="field.type === 'textarea'"
      :id="field.key"
      v-model="value"
      rows="3"
      class="input-field"
      :class="{ 'border-accent': hasError }"
      :aria-describedby="helpTextId"
      :aria-invalid="hasError"
    ></textarea>
    
    <!-- Number Input -->
    <div v-else-if="field.type === 'number'" class="relative">
      <input
        :id="field.key"
        v-model.number="value"
        type="number"
        step="any"
        class="input-field pr-12"
        :class="{ 'border-accent': hasError }"
        :aria-describedby="helpTextId"
        :aria-invalid="hasError"
      />
      <span v-if="field.unit" class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">
        {{ field.unit }}
      </span>
    </div>
    
    <!-- Select -->
    <select
      v-else-if="field.type === 'select'"
      :id="field.key"
      v-model="value"
      class="input-field"
      :class="{ 'border-accent': hasError }"
      :aria-describedby="helpTextId"
      :aria-invalid="hasError"
    >
      <option value="">{{ field.required ? 'Select...' : 'Optional' }}</option>
      <option v-for="option in field.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    
    <!-- Multi-select -->
    <div v-else-if="field.type === 'multiselect'" class="space-y-2">
      <div v-for="option in field.options" :key="option" class="flex items-center">
        <input
          :id="`${field.key}-${option}`"
          v-model="multiValue"
          type="checkbox"
          :value="option"
          class="h-4 w-4 text-primary focus:ring-primary border-grayLight rounded"
        />
        <label :for="`${field.key}-${option}`" class="ml-2 text-sm text-black">
          {{ option }}
        </label>
      </div>
    </div>
    
    <!-- Boolean -->
    <div v-else-if="field.type === 'boolean'" class="flex items-center space-x-4">
      <label class="flex items-center">
        <input
          :id="`${field.key}-yes`"
          v-model="value"
          type="radio"
          :value="true"
          class="h-4 w-4 text-primary focus:ring-primary border-grayLight"
        />
        <span class="ml-2 text-sm text-black">Yes</span>
      </label>
      <label class="flex items-center">
        <input
          :id="`${field.key}-no`"
          v-model="value"
          type="radio"
          :value="false"
          class="h-4 w-4 text-primary focus:ring-primary border-grayLight"
        />
        <span class="ml-2 text-sm text-black">No</span>
      </label>
    </div>
    
    <!-- URL Input -->
    <input
      v-else-if="field.type === 'url'"
      :id="field.key"
      v-model="value"
      type="url"
      class="input-field"
      :class="{ 'border-accent': hasError }"
      :aria-describedby="helpTextId"
      :aria-invalid="hasError"
    />
    
    <!-- Error Message -->
    <p v-if="hasError" class="text-sm text-accent" role="alert">
      {{ errorMessage }}
    </p>
    
    <!-- Help Text -->
    <p v-if="field.helpText" :id="helpTextId" class="text-sm text-gray-600">
      {{ field.helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Attribute } from '../lib/taxonomy'

interface Props {
  field: Attribute
  modelValue: any
  errorMessage?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const helpTextId = computed(() => `${props.field.key}-help`)
const hasError = computed(() => !!props.errorMessage)

const value = ref(props.modelValue)
const multiValue = ref(Array.isArray(props.modelValue) ? props.modelValue : [])

watch(value, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(multiValue, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  if (props.field.type === 'multiselect') {
    multiValue.value = Array.isArray(newValue) ? newValue : []
  } else {
    value.value = newValue
  }
})
</script>
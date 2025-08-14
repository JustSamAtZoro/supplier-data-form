<template>
  <div class="form-card space-y-6">
    <div class="border-b border-grayLight pb-4">
      <h3 class="text-lg font-semibold text-primary">{{ title }}</h3>
      <p v-if="description" class="text-sm text-gray-600 mt-1">{{ description }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field
        v-for="field in visibleFields"
        :key="field.key"
        :field="field"
        :model-value="formData[field.key]"
        :error-message="errors[field.key]"
        @update:model-value="(value) => updateField(field.key, value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Attribute } from '../lib/taxonomy'
import { getVisibleFields } from '../lib/utils'
import Field from './Field.vue'

interface Props {
  title: string
  description?: string
  fields: Attribute[]
  formData: Record<string, any>
  errors: Record<string, string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:field': [key: string, value: any]
}>()

const visibleFields = computed(() => 
  getVisibleFields(props.fields, props.formData)
)

function updateField(key: string, value: any) {
  emit('update:field', key, value)
}
</script>
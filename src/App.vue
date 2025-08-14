<template>
  <div class="min-h-screen bg-grayLight">
    <!-- Header -->
    <header class="bg-white border-b border-grayLight">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <div class="h-10 w-32 bg-primary rounded flex items-center justify-center">
              <span class="text-white font-bold">ZORO</span>
            </div>
            <div class="ml-4">
              <h1 class="text-xl font-semibold text-primary">Supplier Product Data Form</h1>
              <p class="text-sm text-gray-600">Submit product information for merchandising review</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Column -->
        <div class="lg:col-span-2">
          <TaxonomyForm />
        </div>
        
        <!-- Summary Panel -->
        <div class="lg:col-span-1">
          <div class="sticky top-6">
            <SummaryPanel />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-grayLight mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-sm text-gray-600 text-center">
          © 2024 Zoro Tools, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import TaxonomyForm from './components/TaxonomyForm.vue'
import SummaryPanel from './components/SummaryPanel.vue'
import { useFormStore } from './stores/form'
import { onMounted } from 'vue'

const formStore = useFormStore()

onMounted(() => {
  formStore.loadFromStorage()
})
</script>

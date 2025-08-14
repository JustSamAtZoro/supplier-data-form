<template>
  <div class="space-y-4">
    <div class="border-b border-grayLight pb-4">
      <h3 class="text-lg font-semibold text-primary">Product Images & Documents</h3>
      <p class="text-sm text-gray-600 mt-1">Upload product images and optional documentation</p>
    </div>
    
    <!-- Image Upload Area -->
    <div class="space-y-4">
      <div
        class="border-2 border-dashed border-grayLight rounded-xl p-8 text-center hover:border-primary transition-colors"
        @drop.prevent="handleDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="space-y-2">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="text-sm text-gray-600">
            <label for="file-upload" class="relative cursor-pointer rounded-md font-medium text-primary hover:text-secondary">
              <span>Upload files</span>
              <input id="file-upload" name="file-upload" type="file" class="sr-only" multiple accept="image/*,.pdf,.doc,.docx" @change="handleFileSelect" />
            </label>
            <p class="pl-1">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-500">PNG, JPG, WebP up to 10MB each</p>
        </div>
      </div>
    </div>
    
    <!-- Uploaded Files -->
    <div v-if="files.length > 0" class="space-y-4">
      <div v-for="(file, index) in files" :key="index" class="bg-white border border-grayLight rounded-lg p-4">
        <div class="flex items-start space-x-4">
          <!-- File Preview -->
          <div v-if="file.type.startsWith('image/')" class="flex-shrink-0">
            <img :src="file.preview" :alt="file.name" class="h-16 w-16 object-cover rounded" />
          </div>
          <div v-else class="flex-shrink-0">
            <div class="h-16 w-16 bg-grayLight rounded flex items-center justify-center">
              <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <!-- File Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-black truncate">{{ file.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
              </div>
              <button
                @click="removeFile(index)"
                class="text-accent hover:text-accentDark"
                type="button"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Image-specific options -->
            <div v-if="file.type.startsWith('image/')" class="mt-3 space-y-3">
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="file.isMain"
                    type="radio"
                    :name="`main-image-${index}`"
                    :value="true"
                    class="h-4 w-4 text-primary focus:ring-primary border-grayLight"
                  />
                  <span class="ml-2 text-sm text-black">Main Image</span>
                </label>
                <label class="flex items-center">
                  <input

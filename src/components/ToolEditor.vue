<script setup lang="ts">
import {ModelRef} from "vue";
import type {Tool} from "@google/genai";

const tools: ModelRef<Tool[] | undefined> = defineModel<Tool[]>();
</script>

<template>
  <div class="mb-4">
    <label
        for="tools"
        class="block text-sm font-medium text-gray-700"
    >
      Tools
    </label>
    <textarea
        id="tools"
        rows="3"
        class="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</template>
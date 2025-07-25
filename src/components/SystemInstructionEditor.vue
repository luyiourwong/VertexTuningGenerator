<script setup lang="ts">
import {ModelRef} from "vue";
import type {Content} from "@google/genai";

const systemInstruction: ModelRef<Content | undefined> = defineModel<Content>();
</script>

<template>
  <div class="mb-4">
    <label
        for="system-instruction"
        class="block text-sm font-medium text-gray-700"
    >
      System Instruction
    </label>
    <textarea
        id="system-instruction"
        rows="3"
        class="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</template>
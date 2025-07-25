<script setup lang="ts">
import {ModelRef} from "vue";
import {Dataset} from "@/types/dataset";

const selectedDataset: ModelRef<Dataset | undefined> = defineModel<Dataset>();
</script>

<template>
  <div class="mt-4" v-if="selectedDataset">
    <label
        for="dataset-contents"
        class="block text-sm font-medium text-gray-700"
    >
      Dataset.contents
    </label>
    <textarea
        id="dataset-contents"
        rows="10"
        class="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        :value="JSON.stringify(selectedDataset.contents, null, 2)"
    />
  </div>
</template>
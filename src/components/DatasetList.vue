<script setup lang="ts">
import {ModelRef} from "vue";
import {Dataset} from "@/types/dataset";

const datasets: ModelRef<Dataset[] | undefined> = defineModel<Dataset[]>();

const emit = defineEmits<{
  update: [value: Dataset]
}>();

function createNewDataset() {
  const newDataset: Dataset = {
    id: crypto.randomUUID(),
    contents: [{
      parts: [
        {
          text: "new dataset",
        }
      ]
    }]
  };

  if (datasets.value) {
    datasets.value.push(newDataset);
  } else {
    datasets.value = [newDataset];
  }
  emit('update', newDataset);
}

function calculatePreview(dataset: Dataset): string {
  if (!dataset.contents?.[0]?.parts?.[0]?.text) {
    return 'empty dataset';
  }
  return dataset.contents[0].parts[0].text;
}
</script>

<template>
  <div class="flex-grow mt-4">
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-medium text-gray-800">Datasets</h2>
      <button
          @click="createNewDataset"
          class="px-2 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
      >
        +
      </button>
    </div>
    <div class="h-64 mt-2 overflow-y-auto border border-gray-300 rounded-md">
      <ul>
        <li
            v-for="dataset in datasets" :key="dataset.id"
            class="flex items-center justify-between p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            @click="$emit('update', dataset)"
        >
          <div class="flex pl-2 space-x-2">
            <button class="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">copy</button>
            <button class="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">delete</button>
          </div>
          <span class="flex-grow w-0 truncate ml-4">{{ calculatePreview(dataset) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
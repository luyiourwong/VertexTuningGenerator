<script setup lang="ts">
import {ModelRef, ref} from "vue";
import {Dataset} from "@/types/dataset";

const datasets: ModelRef<Dataset[] | undefined> = defineModel<Dataset[]>();
const selectedId = ref<string>();

const emit = defineEmits<{
  update: [value: Dataset],
  delete: []
}>();

const getNextId = (datasets: Dataset[] | undefined): string => {
  if (!datasets || datasets.length === 0) return "1";
  const maxId = Math.max(...datasets.map(d => parseInt(d.id, 10)));
  return (maxId + 1).toString();
};

const createNewDataset = () => {
  const newDataset: Dataset = {
    id: getNextId(datasets.value),
    contents: [{
      role: "user",
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
  selectedId.value = newDataset.id;
  emit('update', newDataset);
};

const calculatePreview = (dataset: Dataset): string => {
  if (!dataset.contents?.[0]?.parts?.[0]?.text) {
    return 'empty dataset';
  }
  return dataset.contents[0].parts[0].text;
};

const copyDataset = (event: Event, datasetToCopy: Dataset) => {
  event.stopPropagation();

  const newDataset: Dataset = {
    id: getNextId(datasets.value),
    contents: JSON.parse(JSON.stringify(datasetToCopy.contents))
  };

  if (datasets.value) {
    datasets.value.push(newDataset);
  } else {
    datasets.value = [newDataset];
  }
  emit('update', newDataset);
};

const deleteDataset = (event: Event, datasetToDelete: Dataset) => {
  event.stopPropagation();

  if (!datasets.value) return;

  const index = datasets.value.findIndex(d => d.id === datasetToDelete.id);
  if (index !== -1) {
    datasets.value.splice(index, 1);
  }
  emit('delete');
};

const handleSelect = (dataset: Dataset) => {
  selectedId.value = dataset.id;
  emit('update', dataset);
};
</script>

<template>
  <div class="flex-grow mt-4">
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-medium text-gray-800">Datasets</h2>
      <button
          @click="createNewDataset"
          class="px-2 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
      >
        New +
      </button>
      <span class="text-sm text-gray-600">(Size: {{ datasets?.length || 0 }})</span>
    </div>
    <div class="h-128 mt-2 overflow-y-auto border border-gray-300 rounded-md">
      <ul>
        <li
            v-for="dataset in datasets" :key="dataset.id"
            :class="[
              'flex items-center justify-between p-2 border-b border-gray-200 cursor-pointer',
              dataset.id === selectedId
                ? 'bg-blue-200'
                : 'hover:bg-gray-200'
            ]"
            @click="handleSelect(dataset)"
        >
          <div class="flex pl-2 space-x-2">
            <button
                class="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                @click="(e) => copyDataset(e, dataset)"
            >
              copy
            </button>
            <button
                class="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                @click="(e) => deleteDataset(e, dataset)"
            >
              delete
            </button>
          </div>
          <span class="px-3 py-1 text-xs text-gray-500">{{ dataset.id }}</span>
          <span class="flex-grow w-0 truncate ml-4">{{ calculatePreview(dataset) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
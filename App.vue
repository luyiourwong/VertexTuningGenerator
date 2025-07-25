<template>
  <div id="app" class="flex flex-col h-screen bg-gray-100">
    <!-- Top Banner -->
    <header class="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <h1 class="text-xl font-bold">Dataset Editor</h1>
      <div class="flex space-x-2">
        <button class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
          匯入
        </button>
        <button class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
          匯出
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow p-4 overflow-auto">
      <!-- System Instruction -->
      <div class="mb-4">
        <label for="system-instruction" class="block text-sm font-medium text-gray-700">System Instruction</label>
        <textarea id="system-instruction" rows="3" class="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>

      <!-- Tools -->
      <div class="mb-4">
        <label for="tools" class="block text-sm font-medium text-gray-700">Tools</label>
        <textarea id="tools" rows="3" class="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>

      <!-- Dataset List -->
      <div class="flex-grow mt-4">
        <h2 class="text-lg font-medium text-gray-800">Datasets</h2>
        <div class="h-64 mt-2 overflow-y-auto border border-gray-300 rounded-md">
          <ul>
            <li v-for="dataset in datasets" :key="dataset.id"
                class="flex items-center justify-between p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                @click="selectedDataset = dataset">
              <span class="flex-grow w-0 truncate">{{ dataset.contents[0].part }}</span>
              <div class="flex pl-2 space-x-2">
                <button class="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">複製</button>
                <button class="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">刪除</button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Dataset.contents Editor -->
      <div class="mt-4" v-if="selectedDataset">
        <label for="dataset-contents" class="block text-sm font-medium text-gray-700">Dataset.contents</label>
        <textarea id="dataset-contents" rows="10"
                  class="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  :value="JSON.stringify(selectedDataset.contents, null, 2)"></textarea>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      datasets: [
        { id: 1, contents: [{ part: 'This is the first part of the first dataset.' }] },
        { id: 2, contents: [{ part: 'This is the first part of the second dataset.' }] },
        { id: 3, contents: [{ part: 'This is the first part of the third dataset.' }] },
        { id: 4, contents: [{ part: 'This is the first part of the fourth dataset.' }] },
        { id: 5, contents: [{ part: 'This is the first part of the fifth dataset.' }] },
      ],
      selectedDataset: null,
    };
  },
};
</script>

<style>
/* You can add global styles here if needed */
</style>

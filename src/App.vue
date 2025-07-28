<script setup lang="ts">
import {Dataset} from "@/types/dataset";
import {ref} from "vue";
import SystemInstructionEditor from "@/components/SystemInstructionEditor.vue";
import ToolEditor from "@/components/ToolEditor.vue";
import DatasetList from "@/components/DatasetList.vue";
import DatasetEditor from "@/components/DatasetEditor.vue";
import type {Content, Tool} from "@google/genai";
import {importJsonlFile} from "@/utils/datasetImporter";
import {downloadJsonl} from "@/utils/datasetExporter";

const systemInstruction = ref<Content | null>(null);
const tools = ref<Tool[]>([]);
const datasets = ref<Dataset[]>([]);
const selectedDataset = ref<Dataset | null>(null);

const switchDataset = (dataset: Dataset) => {
  selectedDataset.value = dataset;
};

const clearSelectedDataset = () => {
  selectedDataset.value = null;
}

const handleImport = async () => {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jsonl';

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const importedDatasets = await importJsonlFile(file);
        clearSelectedDataset();
        datasets.value = importedDatasets;
      } catch (error) {
        alert('Import failed: ' + error);
      }
    };

    input.click();
  } catch (error) {
    console.error('Import error: ', error);
    alert('Import error');
  }
  console.log(datasets.value);
};

const handleExport = () => {
  if (datasets.value.length === 0) {
    alert('No dataset to export, please add some first.');
    return;
  }

  try {
    downloadJsonl(datasets.value, systemInstruction.value, tools.value);
  } catch (error) {
    console.error('Export error:', error);
    alert('Export error');
  }
};
</script>

<template>
  <div id="app" class="flex flex-col h-screen bg-gray-100">
    <!-- Top Banner -->
    <header class="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div class="flex items-center gap-6">
        <h1 class="text-xl font-bold">VertexAI Tuning dataset editor</h1>
        <div class="flex items-center gap-4">
          <a href="https://github.com/luyiourwong/VertexTuningGenerator/"
             target="_blank"
             rel="noopener noreferrer"
             class="text-gray-600 hover:text-gray-900">
            <span class="material-icons text-2xl">code</span>
          </a>
          <a href="https://console.cloud.google.com/vertex-ai/studio/tuning"
             target="_blank"
             rel="noopener noreferrer"
             class="text-gray-600 hover:text-gray-900">
            <span class="material-icons text-2xl">cloud</span>
          </a>
          <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/models/tune-models"
             target="_blank"
             rel="noopener noreferrer"
             class="text-gray-600 hover:text-gray-900">
            <span class="material-icons text-2xl">description</span>
          </a>
        </div>
      </div>
      <div class="flex space-x-2">
        <button
            @click="handleImport"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Import
        </button>
        <button
            @click="handleExport"
            class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 cursor-pointer"
        >
          Export
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow p-4 overflow-auto">
      <!-- System Instruction -->
      <SystemInstructionEditor
          v-model="systemInstruction"
      />

      <!-- Tools -->
      <ToolEditor
          v-model="tools"
      />

      <!-- Dataset List -->
      <DatasetList
          v-model="datasets"
          @update="switchDataset"
          @delete="clearSelectedDataset"
      />

      <!-- Dataset.contents Editor -->
      <DatasetEditor
          v-model="selectedDataset"
      />
    </main>
  </div>
</template>
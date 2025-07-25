<script setup lang="ts">
import {Dataset} from "@/types/dataset";
import {ref} from "vue";
import SystemInstructionEditor from "@/components/SystemInstructionEditor.vue";
import ToolEditor from "@/components/ToolEditor.vue";
import DatasetList from "@/components/DatasetList.vue";
import DatasetEditor from "@/components/DatasetEditor.vue";
import type {Content, Tool} from "@google/genai";

const systemInstruction = ref<Content | null>(null);
const tools = ref<Tool[]>([]);
const datasets = ref<Dataset[]>([]);
const selectedDataset = ref<Dataset | null>(null);

const switchDataset = (dataset: Dataset) => {
  selectedDataset.value = dataset;
}
</script>

<template>
  <div id="app" class="flex flex-col h-screen bg-gray-100">
    <!-- Top Banner -->
    <header class="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div class="flex items-center gap-6">
        <h1 class="text-xl font-bold">VertexAI Tuning dataset editor</h1>
        <h2 class="text-red-600"> not useable, still in development </h2>
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
        <button class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
          Import
        </button>
        <button class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
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
      />

      <!-- Dataset.contents Editor -->
      <DatasetEditor
          v-model="selectedDataset"
      />
    </main>
  </div>
</template>
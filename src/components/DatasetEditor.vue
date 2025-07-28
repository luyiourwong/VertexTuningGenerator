<script setup lang="ts">
import {computed, ModelRef, ref} from "vue";
import {Dataset} from "@/types/dataset";

const selectedDataset: ModelRef<Dataset | undefined> = defineModel<Dataset>();
const isVisualMode = ref(true); // 預設使用視覺化模式

// 添加删除消息的方法
const deleteMessage = (index: number) => {
  if (selectedDataset.value) {
    selectedDataset.value.contents.splice(index, 1);
  }
};

// 添加新消息的方法
const addMessage = () => {
  if (selectedDataset.value) {
    selectedDataset.value.contents.push({
      role: 'model',
      parts: [
        {
          text: ''
        }
      ]
    });
  }
};

// 添加计算属性来处理 JSON 内容
const rawContents = computed({
  get: () => {
    return JSON.stringify(selectedDataset.value?.contents, null, 2);
  },
  set: (value: string) => {
    try {
      if (selectedDataset.value) {
        selectedDataset.value.contents = JSON.parse(value);
      }
    } catch (e) {
      console.error('Invalid JSON format:', e);
    }
  }
});
</script>

<template>
  <div class="mt-4" v-if="selectedDataset">
    <div class="flex items-center justify-between mb-2">
      <label
          for="dataset-contents"
          class="block text-sm font-medium text-gray-700"
      >
        Contents {{selectedDataset? ' ID: ' + selectedDataset.id : ''}}
      </label>
      <button
          @click="isVisualMode = !isVisualMode"
          :class="[
            'px-3 py-1 text-sm text-white rounded-md transition-colors cursor-pointer',
            isVisualMode
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-600 hover:bg-gray-700'
          ]"
      >
        {{ isVisualMode ? 'Switch to Raw mode' : 'Switch to Visual mode' }}
      </button>
    </div>

    <div v-if="isVisualMode">
      <div
          v-for="(message, index) in selectedDataset.contents"
          :key="index"
          :class="[
          'max-w-[80%] space-y-2 p-4 rounded-lg mb-4',
          message.role === 'user' ? 'ml-auto bg-green-100' : 'mr-auto bg-indigo-100'
        ]"
      >
        <!-- 索引和删除按钮 -->
        <div class="flex items-center justify-between">
          <div class="text-xs font-medium text-gray-500">Index: {{ index }}</div>
          <button
              @click="deleteMessage(index)"
              class="text-red-600 hover:text-red-800 font-bold cursor-pointer"
          >
            X
          </button>
        </div>

        <!-- 角色選擇 -->
        <div class="flex items-center gap-4">
          <div class="text-xs font-medium text-gray-500">Role:</div>
          <div class="flex gap-4 text-sm">
            <label class="inline-flex items-center">
              <input
                  type="radio"
                  :name="`role-${index}`"
                  value="user"
                  v-model="message.role"
                  class="text-indigo-600"
              >
              <span class="ml-2">User</span>
            </label>
            <label class="inline-flex items-center">
              <input
                  type="radio"
                  :name="`role-${index}`"
                  value="model"
                  v-model="message.role"
                  class="text-indigo-600"
              >
              <span class="ml-2">Model</span>
            </label>
          </div>
        </div>

        <!-- 訊息類型選擇 -->
        <div class="flex items-center gap-4">
          <div class="text-xs font-medium text-gray-500">Type:</div>
          <div class="flex gap-4 text-sm">
            <label class="inline-flex items-center">
              <input
                  type="radio"
                  :name="`type-${index}`"
                  value="text"
                  checked
                  disabled
                  class="text-indigo-600"
              >
              <span class="ml-2">Text</span>
            </label>
          </div>
        </div>

        <!-- 訊息內容 -->
        <div class="space-y-2">
          <div class="text-xs font-medium text-gray-500">Text:</div>
          <textarea
              v-if="message.parts && message.parts.length > 0"
              v-model="message.parts[0].text"
              rows="10"
              class="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div v-else class="text-sm text-red-500">No message parts available, fix me manually in raw mode.</div>
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <button
            @click="addMessage"
            class="px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Add Message
        </button>
      </div>
    </div>
    <textarea
        v-else
        id="dataset-contents"
        v-model="rawContents"
        rows="25"
        class="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</template>
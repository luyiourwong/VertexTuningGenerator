<script setup lang="ts">
import {computed, ModelRef, ref} from "vue";
import {Dataset} from "@/types/dataset";
import type {Tool} from "@google/genai";

const selectedDataset: ModelRef<Dataset | undefined> = defineModel<Dataset>('dataset');
const tools: ModelRef<Tool[] | undefined> = defineModel<Tool[]>('tools');
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

// 获取函数参数定义的辅助函数
const getFunctionParameters = (functionName: string) => {
  const func = tools.value?.[0]?.functionDeclarations?.find(
      f => f.name === functionName
  );
  return func?.parameters?.properties || {};
};

// 判断消息类型的方法
const getMessageType = (part: any) => {
  if (part.functionCall) return 'functionCall';
  if (part.functionResponse) return 'functionResponse';
  if (part.text !== undefined) return 'text';
  return 'text'; // 默认类型
};

// 设置消息类型的方法
const setMessageType = (part: any, type: string) => {
  // 清除现有的所有类型相关字段
  delete part.text;
  delete part.functionCall;
  delete part.functionResponse;

  // 根据新类型设置相应的默认值
  switch (type) {
    case 'functionCall':
      part.functionCall = {
        name: '',
        args: {}
      };
      break;
    case 'functionResponse':
      part.functionResponse = {
        name: '',
        response: {
          output: ''
        }
      };
      break;
    case 'text':
    default:
      part.text = '';
      break;
  }
};
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
        <div v-if="message.parts">
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
                    :checked="getMessageType(message.parts[0]) === 'text'"
                    @change="setMessageType(message.parts[0], 'text')"
                    class="text-indigo-600"
                >
                <span class="ml-2">Text</span>
              </label>
              <label class="inline-flex items-center">
                <input
                    type="radio"
                    :name="`type-${index}`"
                    value="functionCall"
                    :checked="getMessageType(message.parts[0]) === 'functionCall'"
                    @change="setMessageType(message.parts[0], 'functionCall')"
                    class="text-indigo-600"
                >
                <span class="ml-2">Function Call</span>
              </label>
              <label class="inline-flex items-center">
                <input
                    type="radio"
                    :name="`type-${index}`"
                    value="functionResponse"
                    :checked="getMessageType(message.parts[0]) === 'functionResponse'"
                    @change="setMessageType(message.parts[0], 'functionResponse')"
                    class="text-indigo-600"
                >
                <span class="ml-2">Function Response</span>
              </label>
            </div>
          </div>

          <!-- 訊息內容 -->
          <div class="space-y-2">
            <div class="text-xs font-medium text-gray-500">Content:</div>

            <!-- Text 类型 -->
            <textarea
                v-if="getMessageType(message.parts[0]) === 'text'"
                v-model="message.parts[0].text"
                rows="10"
                class="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />

            <!-- Function Call 类型 -->
            <div v-else-if="getMessageType(message.parts[0]) === 'functionCall'" class="space-y-4">
              <select
                  v-model="(message.parts[0].functionCall ??= { name: '', args: {} }).name"
                  class="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Function</option>
                <option
                    v-for="func in tools?.[0]?.functionDeclarations"
                    :key="func.name"
                    :value="func.name"
                >
                  {{ func.name }}
                </option>
              </select>

              <!-- 动态参数输入框 -->
              <template v-if="message.parts[0].functionCall.name">
                <div
                    v-for="(prop, key) in getFunctionParameters(message.parts[0].functionCall.name)"
                    :key="key"
                    class="space-y-2"
                >
                  <label :for="'input-' + key"
                         class="block text-sm font-medium text-gray-700"
                  >
                    {{ key }}:
                  </label>
                  <input
                      v-if="message.parts[0].functionCall.args"
                      :id="'input-' + key"
                      type="text"
                      v-model="message.parts[0].functionCall.args[key]"
                      class="w-full p-2 text-sm border border-gray-300 rounded-md"
                      :placeholder="prop.description"
                  >
                </div>
              </template>
            </div>

            <!-- Function Response 类型 -->
            <div v-else-if="getMessageType(message.parts[0]) === 'functionResponse'">
              <select
                  v-model="(message.parts[0].functionResponse ??= { name: '', response: {} }).name"
                  class="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Function</option>
                <option
                    v-for="func in tools?.[0]?.functionDeclarations"
                    :key="func.name"
                    :value="func.name"
                >
                  {{ func.name }}
                </option>
              </select>
              <div class="text-xs font-medium text-gray-500">Output:</div>
              <textarea
                  v-if="message.parts[0].functionResponse && message.parts[0].functionResponse.response"
                  v-model="message.parts[0].functionResponse.response.output"
                  rows="10"
                  class="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Function response output..."
              />
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-red-500">Unknown message, fix manually in raw mode.</div>
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
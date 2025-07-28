<script setup lang="ts">
import { ModelRef, ref, computed } from "vue";
import type { Tool, Type } from "@google/genai";

const tools: ModelRef<Tool[] | undefined> = defineModel<Tool[]>();
const isVisualMode = ref(true);

const typeEnum = {
  STRING: 'STRING' as Type,
  NUMBER: 'NUMBER' as Type,
  INTEGER: 'INTEGER' as Type,
  BOOLEAN: 'BOOLEAN' as Type,
  ARRAY: 'ARRAY' as Type,
  OBJECT: 'OBJECT' as Type,
  NULL: 'NULL' as Type,
  TYPE_UNSPECIFIED: 'TYPE_UNSPECIFIED' as Type
} as const;

// 处理Raw模式的JSON内容
const rawTools = computed({
  get: () => {
    return JSON.stringify(tools.value || [], null, 2);
  },
  set: (value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        tools.value = parsed;
      }
    } catch (e) {
      console.error('Invalid JSON format:', e);
    }
  }
});

// 添加新工具
const addTool = () => {
  // 如果 tools.value 是 undefined，初始化它
  if (!tools.value) {
    tools.value = [];
  }

  // 如果沒有第一個 tool 對象，創建它
  if (!tools.value[0]) {
    tools.value[0] = {
      functionDeclarations: []
    };
  }

  // 如果 functionDeclarations 是 undefined，初始化它
  if (!tools.value[0].functionDeclarations) {
    tools.value[0].functionDeclarations = [];
  }

  // 添加新的函數聲明
  tools.value[0].functionDeclarations.push({
    name: '',
    description: '',
    parameters: {
      type: typeEnum.OBJECT,
      properties: {}
    }
  });
};

// 删除工具
const deleteTool = (index: number) => {
  if (tools.value?.[0]?.functionDeclarations) {
    tools.value[0].functionDeclarations.splice(index, 1);
  }
};

// 添加新属性
const addProperty = (toolIndex: number) => {
  if (tools.value?.[0]?.functionDeclarations?.[toolIndex]?.parameters?.properties) {
    const properties = tools.value[0].functionDeclarations[toolIndex].parameters.properties;
    const newPropName = `property${Object.keys(properties).length + 1}`;
    properties[newPropName] = {
      type: typeEnum.STRING,
      description: ''
    };
  }
};

// 删除属性
const deleteProperty = (toolIndex: number, propertyName: string) => {
  if (tools.value?.[0]?.functionDeclarations?.[toolIndex]?.parameters?.properties) {
    delete tools.value[0].functionDeclarations[toolIndex].parameters.properties[propertyName];
  }
};

// 修改屬性名稱的方法
const updatePropertyName = (toolIndex: number, oldName: string, newName: string) => {
  if (tools.value?.[0]?.functionDeclarations?.[toolIndex]?.parameters?.properties) {
    const properties = tools.value[0].functionDeclarations[toolIndex].parameters.properties;
    const propValue = properties[oldName];
    delete properties[oldName];
    properties[newName] = propValue;
  }
};
</script>

<template>
  <div class="mb-4">
    <div class="flex items-center justify-between mb-2">
      <label
          for="tools"
          class="block text-sm font-medium text-gray-700"
      >
        Tools
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
      <div v-for="(declaration, toolIndex) in tools?.[0]?.functionDeclarations"
           :key="toolIndex"
           class="mb-6 p-4 border rounded-lg bg-gray-50">
        <div class="flex justify-between mb-4">
          <span class="text-sm font-medium">Tool {{ toolIndex + 1 }}</span>
          <button
              @click="deleteTool(toolIndex)"
              class="text-red-600 hover:text-red-800 font-bold"
          >
            X
          </button>
        </div>

        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label :for="`tool-name-${toolIndex}`" class="block text-sm font-medium text-gray-700">Name:</label>
            <input
                :id="`tool-name-${toolIndex}`"
                v-model="declaration.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <!-- Description -->
          <div>
            <label :for="`tool-desc-${toolIndex}`" class="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
                :id="`tool-desc-${toolIndex}`"
                v-model="declaration.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <!-- Properties -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="block text-sm font-medium text-gray-700">Properties:</span>
              <button
                  @click="addProperty(toolIndex)"
                  class="px-2 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Add Property
              </button>
            </div>

            <div v-if="declaration.parameters"
                 v-for="(prop, propName) in declaration.parameters.properties"
                 :key="propName"
                 class="mt-2 p-3 border rounded bg-white">
              <div class="flex justify-between items-center mb-2">
                <input
                    :value="propName"
                    @input="e => updatePropertyName(toolIndex, propName, (e.target as HTMLInputElement).value)"
                    type="text"
                    class="text-sm border rounded p-1 w-1/3"
                    placeholder="Property name"
                />
                <button
                    @click="deleteProperty(toolIndex, propName)"
                    class="text-red-700 hover:text-red-800"
                >
                  X
                </button>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label :for="`prop-type-${toolIndex}-${propName}`" class="block text-xs text-gray-600">Type:</label>
                  <select
                      :id="`prop-type-${toolIndex}-${propName}`"
                      v-model="prop.type"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="STRING">String</option>
                    <option value="NUMBER">Number</option>
                    <option value="BOOLEAN">Boolean</option>
                    <option value="OBJECT">Object</option>
                  </select>
                </div>
                <div>
                  <label :for="`prop-desc-${toolIndex}-${propName}`" class="block text-xs text-gray-600">Description:</label>
                  <input
                      :id="`prop-desc-${toolIndex}-${propName}`"
                      v-model="prop.description"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-4">
        <button
            @click="addTool"
            class="px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Add Tool
        </button>
      </div>
    </div>

    <textarea
        v-else
        v-model="rawTools"
        rows="20"
        class="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</template>
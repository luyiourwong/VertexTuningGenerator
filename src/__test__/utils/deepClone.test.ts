import { describe, it, expect } from 'vitest';
import { deepCloneDataset } from '@/utils/deepClone';
import type { Dataset } from '@/types/dataset';

describe('deepCloneDataset', () => {
  it('should clone a simple dataset with text content', () => {
    const original: Dataset = {
      id: '1',
      contents: [{
        role: 'user',
        parts: [{ text: 'Hello world' }]
      }]
    };

    const cloned = deepCloneDataset(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.contents).not.toBe(original.contents);
    expect(cloned.contents[0]).not.toBe(original.contents[0]);
    expect(cloned.contents[0].parts).not.toBe(original.contents[0].parts);
  });

  it('should clone dataset with function call content', () => {
    const original: Dataset = {
      id: '2',
      contents: [{
        role: 'model',
        parts: [{
          functionCall: {
            name: 'testFunction',
            args: { param1: 'value1', param2: 'value2' }
          }
        }]
      }]
    };

    const cloned = deepCloneDataset(original);

    expect(cloned).toEqual(original);
    expect(cloned.contents[0].parts![0].functionCall).not.toBe(original.contents[0].parts![0].functionCall);
    expect(cloned.contents[0].parts![0].functionCall!.args).not.toBe(original.contents[0].parts![0].functionCall!.args);
  });

  it('should clone dataset with function response content', () => {
    const original: Dataset = {
      id: '3',
      contents: [{
        parts: [{
          functionResponse: {
            name: 'testFunction',
            response: { output: 'test output' }
          }
        }]
      }]
    };

    const cloned = deepCloneDataset(original);

    expect(cloned).toEqual(original);
    expect(cloned.contents[0].parts![0].functionResponse).not.toBe(original.contents[0].parts![0].functionResponse);
    expect(cloned.contents[0].parts![0].functionResponse!.response).not.toBe(original.contents[0].parts![0].functionResponse!.response);
  });

  it('should handle empty contents array', () => {
    const original: Dataset = {
      id: '4',
      contents: []
    };

    const cloned = deepCloneDataset(original);

    expect(cloned).toEqual(original);
    expect(cloned.contents).not.toBe(original.contents);
  });

  it('should handle content without parts', () => {
    const original: Dataset = {
      id: '5',
      contents: [{
        role: 'user'
      }]
    };

    const cloned = deepCloneDataset(original);

    expect(cloned).toEqual(original);
    expect(cloned.contents[0]).not.toBe(original.contents[0]);
  });

  it('should handle multiple contents with mixed types', () => {
    const original: Dataset = {
      id: '6',
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Question' }]
        },
        {
          role: 'model',
          parts: [{
            functionCall: {
              name: 'search',
              args: { query: 'test' }
            }
          }]
        },
        {
          parts: [{
            functionResponse: {
              name: 'search',
              response: { output: 'results' }
            }
          }]
        }
      ]
    };

    const cloned = deepCloneDataset(original);

    expect(cloned).toEqual(original);
    expect(cloned.contents).not.toBe(original.contents);
    cloned.contents.forEach((content, index) => {
      expect(content).not.toBe(original.contents[index]);
    });
  });
});

import type { Dataset } from '@/types/dataset';
import type { Content } from '@google/genai';

export const deepCloneDataset = (dataset: Dataset): Dataset => {
  return {
    id: dataset.id,
    contents: dataset.contents.map(content => deepCloneContent(content))
  };
};

const deepCloneContent = (content: Content): Content => {
  const cloned: Content = {
    ...content,
    parts: content.parts?.map(part => {
      const clonedPart = { ...part };
      
      if (part.functionCall) {
        clonedPart.functionCall = {
          ...part.functionCall,
          args: part.functionCall.args ? { ...part.functionCall.args } : {}
        };
      }
      
      if (part.functionResponse) {
        clonedPart.functionResponse = {
          ...part.functionResponse,
          response: part.functionResponse.response ? { ...part.functionResponse.response } : {}
        };
      }
      
      return clonedPart;
    })
  };
  
  return cloned;
};

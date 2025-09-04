import { QuestionTemplate } from '../types/questionTemplate';

export const exportTemplates = (templates: QuestionTemplate[]): void => {
  const blob = new Blob([JSON.stringify(templates, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `templates_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importTemplates = async (file: File): Promise<QuestionTemplate[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const templates = JSON.parse(e.target?.result as string);
        if (!Array.isArray(templates)) {
          throw new Error('Invalid template format');
        }
        resolve(templates);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

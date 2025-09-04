import { useState, useEffect } from 'react';
import { QuestionTemplate } from '@/types/questionTemplate';
import { templateService } from '@/services/templateService';

export const useQuestionTemplates = () => {
  const [templates, setTemplates] = useState<QuestionTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError('Failed to load templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (template: Omit<QuestionTemplate, 'id'>) => {
    try {
      setLoading(true);
      const created = await templateService.createTemplate(template);
      setTemplates([...templates, created]);
      return created;
    } catch (err) {
      setError('Failed to create template');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (id: string, template: Partial<QuestionTemplate>) => {
    try {
      setLoading(true);
      const updated = await templateService.updateTemplate(id, template);
      setTemplates(templates.map(t => t.id === updated.id ? updated : t));
      return updated;
    } catch (err) {
      setError('Failed to update template');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setLoading(true);
      await templateService.deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete template');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTemplates = () => {
    return templates.filter(template => {
      const categoryMatch = !filterCategory || template.category === filterCategory;
      const typeMatch = !filterType || template.type === filterType;
      return categoryMatch && typeMatch;
    });
  };

  const getUniqueCategories = () => {
    return Array.from(new Set(templates.map(t => t.category).filter((c): c is string => c !== undefined && c !== null)));
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates: getFilteredTemplates(),
    allTemplates: templates,
    loading,
    error,
    filterCategory,
    filterType,
    setFilterCategory,
    setFilterType,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getUniqueCategories,
    setError
  };
};

'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Collapse,
  Switch,
  FormControlLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';

import { QuestionTemplate } from '@/types/questionTemplate';
import { templateService } from '@/services/templateService';
import { exampleTemplates } from '@/data/exampleTemplates';
import { SelectChangeEvent } from '@mui/material/Select';
import { Theme, SxProps } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { validateTemplate } from '@/utils/templateValidation';
import { exportTemplates, importTemplates } from '@/utils/templateIO';
import { PreviewDialog } from '@/components/PreviewDialog';
import { FilterBar } from '@/components/FilterBar';
import { TemplateForm } from '@/components/TemplateForm';
import { TemplateList } from '@/components/TemplateList';
import { useQuestionTemplates } from '@/hooks/useQuestionTemplates';

export default function QuestionTemplatesPage() {
  const {
    templates,
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
  } = useQuestionTemplates();

  const [currentTemplate, setCurrentTemplate] = useState<Partial<QuestionTemplate>>({
    type: 'mcq',
    difficulty: 'medium',
    isPublic: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const importedTemplates = await importTemplates(file);
        for (const template of importedTemplates) {
          await addTemplate(template as Omit<QuestionTemplate, 'id'>);
        }
      } catch (err) {
        setError('Failed to import templates');
        console.error(err);
      }
    }
  };

  const handleExport = () => {
    if (templates.length > 0) {
      exportTemplates(templates);
    } else {
      setError('No templates to export');
    }
  };

  const handlePreview = (template: QuestionTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleSubmit = async (template: Partial<QuestionTemplate>) => {
    try {
      const validationResult = validateTemplate(template as QuestionTemplate);
      if (!validationResult.isValid) {
        setError(validationResult.errors.join(', '));
        return;
      }

      if (isEditing && currentTemplate.id) {
        await updateTemplate(currentTemplate.id, template);
      } else {
        await addTemplate(template as Omit<QuestionTemplate, 'id'>);
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (template: QuestionTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setCurrentTemplate({ type: 'mcq', difficulty: 'medium' });
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Question Templates
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleImport}
          />
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            Import Templates
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={templates.length === 0}
          >
            Export Templates
          </Button>
        </Box>

        <FilterBar
          filterCategory={filterCategory}
          filterType={filterType}
          categories={getUniqueCategories()}
          onCategoryChange={setFilterCategory}
          onTypeChange={setFilterType}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <TemplateForm
            currentTemplate={currentTemplate}
            isEditing={isEditing}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <TemplateList
            templates={templates}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        </Box>
      </Box>

      {selectedTemplate && (
        <PreviewDialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          template={selectedTemplate}
        />
      )}
    </Container>
  );
}

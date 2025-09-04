import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import type { QuestionTemplate } from '@/types/questionTemplate';

interface TemplateFormProps {
  currentTemplate: Partial<QuestionTemplate>;
  isEditing: boolean;
  onSubmit: (template: Partial<QuestionTemplate>) => void;
  onCancel: () => void;
}

export const TemplateForm = ({
  currentTemplate,
  isEditing,
  onSubmit,
  onCancel,
}: TemplateFormProps) => {
  const [template, setTemplate] = useState<Partial<QuestionTemplate>>(currentTemplate);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(template);
  };

  const handleChange = (field: keyof QuestionTemplate) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    setTemplate({ ...template, [field]: e.target.value });
  };

  const handleArrayChange = (field: keyof QuestionTemplate) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
    setTemplate({ ...template, [field]: value });
  };

  const handleSwitchChange = (field: keyof QuestionTemplate) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTemplate({ ...template, [field]: e.target.checked });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Edit Template' : 'Create New Template'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Template Name"
            value={template.name || ''}
            onChange={handleChange('name')}
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={template.type || 'mcq'}
              label="Question Type"
              onChange={(e) => handleChange('type')(e)}
              required
            >
              <MenuItem value="mcq">Multiple Choice</MenuItem>
              <MenuItem value="open_ended">Open Ended</MenuItem>
              <MenuItem value="true_false">True/False</MenuItem>
              <MenuItem value="short_answer">Short Answer</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={template.category || ''}
              label="Category"
              onChange={(e) => handleChange('category')(e)}
              required
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="math">Mathematics</MenuItem>
              <MenuItem value="science">Science</MenuItem>
              <MenuItem value="language">Language</MenuItem>
              <MenuItem value="programming">Programming</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={template.difficulty || 'medium'}
              label="Difficulty"
              onChange={(e) => handleChange('difficulty')(e)}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Template"
            multiline
            rows={4}
            value={template.template || ''}
            onChange={handleChange('template')}
            required
            helperText={
              template.type === 'mcq' 
                ? "Use [TOPIC] for topic placeholder and [OPTIONS] for options placeholder"
                : "Use [TOPIC] for topic placeholder"
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={template.tags?.join(', ') || ''}
            onChange={handleArrayChange('tags')}
            helperText="Enter tags separated by commas"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Required Variables (comma-separated)"
            value={template.validationRules?.requiredVariables?.join(', ') || ''}
            onChange={(e) => {
              const variables = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
              setTemplate({
                ...template,
                validationRules: {
                  ...template.validationRules,
                  requiredVariables: variables
                }
              });
            }}
            helperText="Variables that must be included in the template"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={template.isPublic || false}
                onChange={handleSwitchChange('isPublic')}
              />
            }
            label="Make template public"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={isEditing ? <EditIcon /> : <AddIcon />}
            >
              {isEditing ? 'Update Template' : 'Add Template'}
            </Button>
            
            {isEditing && (
              <Button
                variant="outlined"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Slider,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface TemplateFormData {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: string[];
  numberOfQuestions: number;
  description?: string;
}

interface CreateTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TemplateFormData) => void;
}

const questionTypeOptions = [
  { value: 'coding', label: 'Coding Questions', description: 'Write and debug code' },
  { value: 'mcq', label: 'Multiple Choice', description: 'Choose from multiple options' },
  { value: 'true-false', label: 'True/False', description: 'Binary choice questions' },
  { value: 'code-output-mcq', label: 'Code Output MCQ', description: 'Predict code output' },
];

const difficultyOptions = [
  { value: 'easy', label: 'Easy', description: 'Basic concepts and simple problems' },
  { value: 'medium', label: 'Medium', description: 'Intermediate level challenges' },
  { value: 'hard', label: 'Hard', description: 'Advanced and complex problems' },
];

export function CreateTemplateModal({ open, onClose, onSubmit }: CreateTemplateModalProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    difficulty: 'medium',
    questionTypes: [],
    numberOfQuestions: 10,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setFormData({
      name: '',
      difficulty: 'medium',
      questionTypes: [],
      numberOfQuestions: 10,
      description: '',
    });
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (formData.questionTypes.length === 0) {
      newErrors.questionTypes = 'At least one question type must be selected';
    }

    if (formData.numberOfQuestions < 1 || formData.numberOfQuestions > 100) {
      newErrors.numberOfQuestions = 'Number of questions must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleQuestionTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      questionTypes: checked
        ? [...prev.questionTypes, type]
        : prev.questionTypes.filter(t => t !== type)
    }));
    if (errors.questionTypes) {
      setErrors(prev => ({ ...prev, questionTypes: '' }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Typography variant="h5" component="div" fontWeight="bold">
          Create Question Template
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ minWidth: 'auto', p: 1 }}
          color="inherit"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Template Name */}
          <TextField
            label="Template Name"
            value={formData.name}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            placeholder="e.g., JavaScript Fundamentals"
          />

          {/* Description */}
          <TextField
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            multiline
            rows={2}
            fullWidth
            placeholder="Brief description of what this template covers..."
          />

          {/* Difficulty Level */}
          <FormControl fullWidth>
            <InputLabel>Difficulty Level</InputLabel>
            <Select
              value={formData.difficulty}
              label="Difficulty Level"
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
            >
              {difficultyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {option.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Question Types */}
          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Question Types *
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select one or more question types. Multiple types will create a mixed template.
            </Typography>
            <FormGroup>
              {questionTypeOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={formData.questionTypes.includes(option.value)}
                      onChange={(e) => handleQuestionTypeChange(option.value, e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1">{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
            {errors.questionTypes && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.questionTypes}
              </Alert>
            )}
          </Box>

          {/* Number of Questions */}
          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Number of Questions: {formData.numberOfQuestions}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Total questions to include in this template
            </Typography>
            <Slider
              value={formData.numberOfQuestions}
              onChange={(_, value) => {
                setFormData(prev => ({ ...prev, numberOfQuestions: value as number }));
                if (errors.numberOfQuestions) setErrors(prev => ({ ...prev, numberOfQuestions: '' }));
              }}
              min={1}
              max={50}
              step={1}
              marks={[
                { value: 1, label: '1' },
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              valueLabelDisplay="auto"
            />
            {errors.numberOfQuestions && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.numberOfQuestions}
              </Alert>
            )}
          </Box>

          {/* Template Preview */}
          {formData.questionTypes.length > 0 && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Template Preview:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This template will generate <strong>{formData.numberOfQuestions}</strong> questions
                of <strong>{formData.difficulty}</strong> difficulty, including:{' '}
                <strong>
                  {formData.questionTypes.map(type => 
                    questionTypeOptions.find(opt => opt.value === type)?.label
                  ).join(', ')}
                </strong>
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!formData.name || formData.questionTypes.length === 0}>
          Create Template
        </Button>
      </DialogActions>
    </Dialog>
  );
}

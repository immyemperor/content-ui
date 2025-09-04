'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import { CreateTemplateModal } from '@/components/CreateTemplateModal';

interface QuestionTemplate {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: string[];
  numberOfQuestions: number;
  createdAt: string;
  description?: string;
}

// Mock data for templates
const mockTemplates: QuestionTemplate[] = [
  {
    id: '1',
    name: 'JavaScript Basics',
    difficulty: 'easy',
    questionTypes: ['coding', 'mcq'],
    numberOfQuestions: 10,
    createdAt: '2024-01-15',
    description: 'Basic JavaScript concepts and syntax',
  },
  {
    id: '2',
    name: 'React Advanced',
    difficulty: 'hard',
    questionTypes: ['coding', 'true-false', 'code-output-mcq'],
    numberOfQuestions: 15,
    createdAt: '2024-01-20',
    description: 'Advanced React patterns and hooks',
  },
  {
    id: '3',
    name: 'Python Fundamentals',
    difficulty: 'medium',
    questionTypes: ['mcq', 'true-false'],
    numberOfQuestions: 12,
    createdAt: '2024-01-25',
    description: 'Core Python programming concepts',
  },
  {
    id: '4',
    name: 'Algorithm Challenge',
    difficulty: 'hard',
    questionTypes: ['coding', 'code-output-mcq'],
    numberOfQuestions: 8,
    createdAt: '2024-02-01',
    description: 'Complex algorithm and data structure problems',
  },
];

const difficultyColors = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const;

const questionTypeLabels = {
  coding: 'Coding',
  mcq: 'Multiple Choice',
  'true-false': 'True/False',
  'code-output-mcq': 'Code Output MCQ',
} as const;

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<QuestionTemplate[]>(mockTemplates);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (template.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = !difficultyFilter || template.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [templates, searchTerm, difficultyFilter]);

  const handleCreateTemplate = (templateData: Omit<QuestionTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: QuestionTemplate = {
      ...templateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTemplates([...templates, newTemplate]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Question Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
          sx={{ height: 'fit-content' }}
        >
          Create Template
        </Button>
      </Box>

      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search templates by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            label="Difficulty"
          >
            <MenuItem value="">All Levels</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {templates.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: 'grey.50',
            border: '2px dashed',
            borderColor: 'grey.300',
          }}
        >
          <QuizIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No templates yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first question template to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Template
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Template Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Difficulty</strong></TableCell>
                <TableCell><strong>Question Types</strong></TableCell>
                <TableCell><strong>Questions</strong></TableCell>
                <TableCell><strong>Created Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm || difficultyFilter 
                        ? "No templates match your search criteria."
                        : "No templates available."
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {template.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {template.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                        color={difficultyColors[template.difficulty]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {template.questionTypes.map((type) => (
                          <Chip
                            key={type}
                            label={questionTypeLabels[type as keyof typeof questionTypeLabels]}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {template.numberOfQuestions}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateTemplateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTemplate}
      />
    </Box>
  );
}

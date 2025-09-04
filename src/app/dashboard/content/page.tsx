'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Tooltip,
  Checkbox,
} from '@mui/material';
import {
  Assessment,
  Description,
  Dashboard,
  LibraryBooks,
  Edit,
  Delete,
  Add,
  Visibility,
  Code,
  BugReport,
  Image,
  Help,
  Save,
} from '@mui/icons-material';

// Rename icons to avoid duplicates
const AssessmentIcon = Assessment;
const DescriptionIcon = Description;
const DashboardIcon = Dashboard;
const TemplatesIcon = LibraryBooks;
const EditIcon = Edit;
const DeleteIcon = Delete;
const AddIcon = Add;
const VisibilityIcon = Visibility;
const CodeIcon = Code;
const TestIcon = BugReport;
const ImageIcon = Image;
const HelpIcon = Help;
const SaveIcon = Save;

interface TestCase {
  input: any;
  expected_output: any;
  description: string;
  is_default: boolean;
}

interface MCQOption {
  id: string;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  type: 'coding' | 'mcq' | 'true-false' | 'code-output-mcq';
  difficulty_level: string;
  question_text: {
    text: string;
    starter_code?: string;
  };
  correct_answer: string;
  topic: string;
  explanation: {
    text: string;
  };
  images: {
    explanation: string[];
    question: string[];
  };
  test_cases: TestCase[];
  // MCQ specific fields
  options?: MCQOption[];
  // True/False specific fields
  correct_option?: boolean;
  // Code-Output-MCQ specific fields
  code_snippet?: string;
  output_options?: MCQOption[];
}

interface GenerateFormData {
  topic: string;
  subtopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
  type: 'coding' | 'mcq' | 'true-false' | 'code-output-mcq';
}

const difficultyLevels = ['easy', 'medium', 'hard'];

export default function ContentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<GenerateFormData>({
    topic: '',
    subtopic: '',
    difficulty: 'medium',
    numberOfQuestions: 10,
    type: 'coding',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{ index: number; question: Question } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number | null>(null);
  const [isJsonMode, setIsJsonMode] = useState(false);

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const TabPanel: React.FC<TabPanelProps> = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        {...other}
      >
        {value === index && (
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  const validateQuestion = (question: Question): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!question.question_text.text.trim()) {
      errors.questionText = 'Question text is required';
    }
    if (!question.topic.trim()) {
      errors.topic = 'Topic is required';
    }
    if (!question.correct_answer.trim()) {
      errors.correctAnswer = 'Correct answer is required';
    }
    if (question.test_cases.length === 0) {
      errors.testCases = 'At least one test case is required';
    }
    return errors;
  };

  const handleAddOption = useCallback((questionType: 'mcq' | 'code-output-mcq') => {
    if (!editingQuestion) return;

    const newOption: MCQOption = {
      id: crypto.randomUUID(),
      text: '',
      is_correct: false
    };

    const fieldName = questionType === 'mcq' ? 'options' : 'output_options';
    const currentOptions = editingQuestion.question[fieldName] || [];

    setEditingQuestion({
      ...editingQuestion,
      question: {
        ...editingQuestion.question,
        [fieldName]: [...currentOptions, newOption]
      }
    });
  }, [editingQuestion]);

  const handleRemoveOption = useCallback((questionType: 'mcq' | 'code-output-mcq', optionId: string) => {
    if (!editingQuestion) return;

    const fieldName = questionType === 'mcq' ? 'options' : 'output_options';
    const currentOptions = editingQuestion.question[fieldName] || [];
    const newOptions = currentOptions.filter(option => option.id !== optionId);

    setEditingQuestion({
      ...editingQuestion,
      question: {
        ...editingQuestion.question,
        [fieldName]: newOptions
      }
    });
  }, [editingQuestion]);

  const handleUpdateOption = useCallback((questionType: 'mcq' | 'code-output-mcq', optionId: string, field: keyof MCQOption, value: any) => {
    if (!editingQuestion) return;

    const fieldName = questionType === 'mcq' ? 'options' : 'output_options';
    const currentOptions = editingQuestion.question[fieldName] || [];
    const newOptions = currentOptions.map(option => 
      option.id === optionId ? { ...option, [field]: value } : option
    );

    setEditingQuestion({
      ...editingQuestion,
      question: {
        ...editingQuestion.question,
        [fieldName]: newOptions
      }
    });
  }, [editingQuestion]);

  const handleAddTestCase = useCallback(() => {
    if (!editingQuestion) return;
    
    const newTestCase: TestCase = {
      input: '',
      expected_output: '',
      description: '',
      is_default: false
    };

    setEditingQuestion({
      ...editingQuestion,
      question: {
        ...editingQuestion.question,
        test_cases: [...editingQuestion.question.test_cases, newTestCase]
      }
    });
    setSelectedTestCaseIndex(editingQuestion.question.test_cases.length);
  }, [editingQuestion]);

  const handleDeleteTestCase = (testCaseIndex: number) => {
    if (!editingQuestion) return;

    const newTestCases = editingQuestion.question.test_cases.filter((_, index) => index !== testCaseIndex);
    setEditingQuestion({
      ...editingQuestion,
      question: {
        ...editingQuestion.question,
        test_cases: newTestCases
      }
    });
    setSelectedTestCaseIndex(null);
  };

  const handleImageUpload = useCallback(async (type: 'question' | 'explanation', file: File) => {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setMessage({ text: 'Image size should be less than 5MB', type: 'error' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Please upload an image file', type: 'error' });
      return;
    }

    try {
      const reader = new FileReader();
      
      reader.onerror = () => {
        setMessage({ text: 'Failed to read image file', type: 'error' });
      };

      reader.onload = (e) => {
        if (!editingQuestion || !e.target?.result) {
          setMessage({ text: 'Failed to process image', type: 'error' });
          return;
        }
        
        const imageUrl = e.target.result.toString();
        setEditingQuestion({
          ...editingQuestion,
          question: {
            ...editingQuestion.question,
            images: {
              ...editingQuestion.question.images,
              [type]: [...editingQuestion.question.images[type], imageUrl]
            }
          }
        });
        setMessage({ text: 'Image uploaded successfully', type: 'success' });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage({ text: 'Failed to upload image', type: 'error' });
    }
  }, [editingQuestion, setMessage]);

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate questions');

      const data = await response.json();
      setQuestions(data);
      setIsModalOpen(false);
      setMessage({ text: 'Questions generated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to generate questions', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuestions = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questions),
      });

      if (!response.ok) throw new Error('Failed to save questions');

      setMessage({ text: 'Questions saved successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to save questions', type: 'error' });
    }
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleEditQuestion = (index: number, updatedQuestion: Question) => {
    const errors = validateQuestion(updatedQuestion);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setMessage({ text: 'Please fix validation errors', type: 'error' });
      return;
    }

    setQuestions(questions.map((q, i) => i === index ? updatedQuestion : q));
    setEditingQuestion(null);
    setIsPreviewMode(false);
    setValidationErrors({});
    setMessage({ text: 'Question updated successfully!', type: 'success' });
  };

  const handleCancelEdit = useCallback(() => {
    setEditingQuestion(null);
    setIsPreviewMode(false);
    setValidationErrors({});
    setSelectedTestCaseIndex(null);
    setActiveTab(0);
    setIsJsonMode(false);
  }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Content Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Generate Questions
        </Button>
      </Box>

      {questions.length > 0 && (
        <Box mb={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveQuestions}
          >
            Save All Questions
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {questions.map((question, index) => (
          <Card key={index}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="body1" sx={{ flex: 1, mr: 2 }}>
                    {question.question_text.text}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => setEditingQuestion({ index, question: { ...question } })}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                {question.question_text.starter_code && (
                  <Box mt={2} mb={2}>
                    <Typography variant="caption" component="pre" sx={{ 
                      backgroundColor: 'grey.100',
                      p: 2,
                      borderRadius: 1,
                      overflow: 'auto'
                    }}>
                      {question.question_text.starter_code}
                    </Typography>
                  </Box>
                )}
                <Box mt={1}>
                  <Typography variant="caption" color="textSecondary">
                    Topic: {question.topic} | Type: {question.type} | 
                    Difficulty: {question.difficulty_level} |
                    Test Cases: {question.test_cases.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Questions</DialogTitle>
        <DialogContent>
          <Box mt={2} display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Topic"
              fullWidth
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />
            <TextField
              label="Subtopic"
              fullWidth
              value={formData.subtopic}
              onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="Question Type"
                sx={{ flex: 1 }}
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as GenerateFormData['type'] })}
              >
                <MenuItem value="coding">Coding</MenuItem>
                <MenuItem value="mcq">Multiple Choice</MenuItem>
                <MenuItem value="true-false">True/False</MenuItem>
                <MenuItem value="code-output-mcq">Code Output MCQ</MenuItem>
              </TextField>
              <TextField
                select
                label="Difficulty Level"
                sx={{ flex: 1 }}
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
              >
                {difficultyLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField
              type="number"
              label="Number of Questions"
              fullWidth
              value={formData.numberOfQuestions}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 10 && value <= 30) {
                  setFormData({ ...formData, numberOfQuestions: value });
                }
              }}
              inputProps={{ min: 10, max: 30 }}
              helperText="Enter a number between 10 and 30"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateQuestions}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={message?.type || 'success'}
          onClose={() => setMessage(null)}
          sx={{ display: message ? 'flex' : 'none' }}
        >
          {message?.text}
        </Alert>
      </Snackbar>

      {/* Edit Question Modal */}
      <Dialog 
        open={!!editingQuestion} 
        onClose={handleCancelEdit}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Edit Question</Typography>
            <Box>
              <Tooltip title="Toggle JSON view for test cases">
                <Chip
                  icon={<CodeIcon />}
                  label={isJsonMode ? "Form View" : "JSON View"}
                  onClick={() => setIsJsonMode(!isJsonMode)}
                  sx={{ mr: 1 }}
                  color={isJsonMode ? "primary" : "default"}
                />
              </Tooltip>
              <Button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                startIcon={isPreviewMode ? <EditIcon /> : <VisibilityIcon />}
                variant={isPreviewMode ? "contained" : "outlined"}
              >
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
            </Box>
          </Box>
          {!isPreviewMode && (
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="question editor tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<DescriptionIcon />} label="Question" iconPosition="start" />
              {editingQuestion?.question.type === 'coding' && (
                <Tab icon={<CodeIcon />} label="Code" iconPosition="start" />
              )}
              {editingQuestion?.question.type === 'coding' && (
                <Tab icon={<TestIcon />} label="Test Cases" iconPosition="start" />
              )}
              <Tab icon={<ImageIcon />} label="Images" iconPosition="start" />
            </Tabs>
          )}
        </DialogTitle>
        <DialogContent>
          {editingQuestion && (
            isPreviewMode ? (
              // Preview Mode
              <Box mt={2}>
                <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Question ({editingQuestion.question.type})</Typography>
                  <Typography>{editingQuestion.question.question_text.text}</Typography>
                  
                  {editingQuestion.question.type === 'coding' && editingQuestion.question.question_text.starter_code && (
                    <Box mt={2}>
                      <Typography variant="subtitle1" gutterBottom>Starter Code:</Typography>
                      <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                        <pre style={{ margin: 0 }}>{editingQuestion.question.question_text.starter_code}</pre>
                      </Paper>
                    </Box>
                  )}

                  {editingQuestion.question.type === 'mcq' && editingQuestion.question.options && (
                    <Box mt={2}>
                      <Typography variant="subtitle1" gutterBottom>Answer Options:</Typography>
                      {editingQuestion.question.options.map((option, idx) => (
                        <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Checkbox checked={option.is_correct} disabled />
                          <Typography sx={{ color: option.is_correct ? 'success.main' : 'inherit' }}>
                            {String.fromCharCode(65 + idx)}. {option.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {editingQuestion.question.type === 'true-false' && (
                    <Box mt={2}>
                      <Typography variant="subtitle1" gutterBottom>Correct Answer:</Typography>
                      <Chip 
                        label={editingQuestion.question.correct_option ? 'True' : 'False'}
                        color="primary"
                      />
                    </Box>
                  )}

                  {editingQuestion.question.type === 'code-output-mcq' && (
                    <Box mt={2}>
                      {editingQuestion.question.code_snippet && (
                        <Box mb={2}>
                          <Typography variant="subtitle1" gutterBottom>Code Snippet:</Typography>
                          <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                            <pre style={{ margin: 0 }}>{editingQuestion.question.code_snippet}</pre>
                          </Paper>
                        </Box>
                      )}
                      {editingQuestion.question.output_options && (
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>Output Options:</Typography>
                          {editingQuestion.question.output_options.map((option, idx) => (
                            <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Checkbox checked={option.is_correct} disabled />
                              <Typography sx={{ color: option.is_correct ? 'success.main' : 'inherit' }}>
                                {String.fromCharCode(65 + idx)}. {option.text}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  <Box mt={3}>
                    <Typography variant="subtitle1" gutterBottom>Images:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {editingQuestion.question.images.question.map((img, idx) => (
                        <Box key={idx} sx={{ width: '120px' }}>
                          <img src={img} alt={`Question ${idx + 1}`} style={{ maxWidth: '100%' }} />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {editingQuestion.question.type === 'coding' && editingQuestion.question.test_cases.length > 0 && (
                    <Box mt={3}>
                      <Typography variant="subtitle1" gutterBottom>Test Cases:</Typography>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Description</TableCell>
                              <TableCell>Input</TableCell>
                              <TableCell>Expected Output</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {editingQuestion.question.test_cases.map((testCase, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{testCase.description}</TableCell>
                                <TableCell>
                                  <pre style={{ margin: 0 }}>{JSON.stringify(testCase.input, null, 2)}</pre>
                                </TableCell>
                                <TableCell>
                                  <pre style={{ margin: 0 }}>{JSON.stringify(testCase.expected_output, null, 2)}</pre>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Paper>
              </Box>
            ) : (
              // Edit Mode
              <Box mt={2}>
                {/* Question Tab */}
                <TabPanel value={activeTab} index={0}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      label="Question Text"
                      fullWidth
                      multiline
                      rows={4}
                      value={editingQuestion.question.question_text.text}
                      onChange={(e) => setEditingQuestion({
                        ...editingQuestion,
                        question: {
                          ...editingQuestion.question,
                          question_text: {
                            ...editingQuestion.question.question_text,
                            text: e.target.value
                          }
                        }
                      })}
                      error={!!validationErrors.questionText}
                      helperText={validationErrors.questionText}
                      required
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        select
                        label="Question Type"
                        sx={{ flex: 1 }}
                        value={editingQuestion.question.type}
                        onChange={(e) => {
                          const newType = e.target.value as Question['type'];
                          setEditingQuestion({
                            ...editingQuestion,
                            question: {
                              ...editingQuestion.question,
                              type: newType,
                              // Reset type-specific fields
                              options: newType === 'mcq' ? [] : undefined,
                              correct_option: newType === 'true-false' ? false : undefined,
                              code_snippet: newType === 'code-output-mcq' ? '' : undefined,
                              output_options: newType === 'code-output-mcq' ? [] : undefined,
                            }
                          });
                        }}
                      >
                        <MenuItem value="coding">Coding</MenuItem>
                        <MenuItem value="mcq">Multiple Choice</MenuItem>
                        <MenuItem value="true-false">True/False</MenuItem>
                        <MenuItem value="code-output-mcq">Code Output MCQ</MenuItem>
                      </TextField>
                      <TextField
                        select
                        label="Difficulty Level"
                        sx={{ flex: 1 }}
                        value={editingQuestion.question.difficulty_level}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          question: {
                            ...editingQuestion.question,
                            difficulty_level: e.target.value
                          }
                        })}
                      >
                        {['easy', 'medium', 'hard'].map((level) => (
                          <MenuItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Topic"
                        sx={{ flex: 1 }}
                        value={editingQuestion.question.topic}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          question: {
                            ...editingQuestion.question,
                            topic: e.target.value
                          }
                        })}
                        error={!!validationErrors.topic}
                        helperText={validationErrors.topic}
                        required
                      />
                    </Box>

                    {/* Type-specific fields */}
                    {editingQuestion.question.type === 'mcq' && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6">Answer Options</Typography>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddOption('mcq')}
                            variant="outlined"
                            size="small"
                          >
                            Add Option
                          </Button>
                        </Box>
                        {editingQuestion.question.options?.map((option, idx) => (
                          <Box key={option.id} display="flex" alignItems="center" gap={2} mb={2}>
                            <Checkbox
                              checked={option.is_correct}
                              onChange={(e) => handleUpdateOption('mcq', option.id, 'is_correct', e.target.checked)}
                            />
                            <TextField
                              fullWidth
                              label={`Option ${idx + 1}`}
                              value={option.text}
                              onChange={(e) => handleUpdateOption('mcq', option.id, 'text', e.target.value)}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveOption('mcq', option.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                      </Paper>
                    )}

                    {editingQuestion.question.type === 'true-false' && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Correct Answer</Typography>
                        <Box display="flex" gap={2}>
                          <Button
                            variant={editingQuestion.question.correct_option === true ? "contained" : "outlined"}
                            onClick={() => setEditingQuestion({
                              ...editingQuestion,
                              question: {
                                ...editingQuestion.question,
                                correct_option: true
                              }
                            })}
                          >
                            True
                          </Button>
                          <Button
                            variant={editingQuestion.question.correct_option === false ? "contained" : "outlined"}
                            onClick={() => setEditingQuestion({
                              ...editingQuestion,
                              question: {
                                ...editingQuestion.question,
                                correct_option: false
                              }
                            })}
                          >
                            False
                          </Button>
                        </Box>
                      </Paper>
                    )}

                    {editingQuestion.question.type === 'code-output-mcq' && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Code Snippet</Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          value={editingQuestion.question.code_snippet || ''}
                          onChange={(e) => setEditingQuestion({
                            ...editingQuestion,
                            question: {
                              ...editingQuestion.question,
                              code_snippet: e.target.value
                            }
                          })}
                          sx={{ mb: 2 }}
                        />
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6">Output Options</Typography>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddOption('code-output-mcq')}
                            variant="outlined"
                            size="small"
                          >
                            Add Option
                          </Button>
                        </Box>
                        {editingQuestion.question.output_options?.map((option, idx) => (
                          <Box key={option.id} display="flex" alignItems="center" gap={2} mb={2}>
                            <Checkbox
                              checked={option.is_correct}
                              onChange={(e) => handleUpdateOption('code-output-mcq', option.id, 'is_correct', e.target.checked)}
                            />
                            <TextField
                              fullWidth
                              label={`Output Option ${idx + 1}`}
                              value={option.text}
                              onChange={(e) => handleUpdateOption('code-output-mcq', option.id, 'text', e.target.value)}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveOption('code-output-mcq', option.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                      </Paper>
                    )}

                    <TextField
                      label="Explanation"
                      fullWidth
                      multiline
                      rows={3}
                      value={editingQuestion.question.explanation.text}
                      onChange={(e) => setEditingQuestion({
                        ...editingQuestion,
                        question: {
                          ...editingQuestion.question,
                          explanation: {
                            ...editingQuestion.question.explanation,
                            text: e.target.value
                          }
                        }
                      })}
                    />
                  </Box>
                </TabPanel>

                {/* Code Tab - Only for coding questions */}
                {editingQuestion.question.type === 'coding' && (
                  <TabPanel value={activeTab} index={1}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField
                        label="Starter Code"
                        fullWidth
                        multiline
                        rows={8}
                        value={editingQuestion.question.question_text.starter_code || ''}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          question: {
                            ...editingQuestion.question,
                            question_text: {
                              ...editingQuestion.question.question_text,
                              starter_code: e.target.value
                            }
                          }
                        })}
                      />
                      <TextField
                        label="Correct Answer"
                        fullWidth
                        multiline
                        rows={8}
                        value={editingQuestion.question.correct_answer}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          question: {
                            ...editingQuestion.question,
                            correct_answer: e.target.value
                          }
                        })}
                        error={!!validationErrors.correctAnswer}
                        helperText={validationErrors.correctAnswer}
                        required
                      />
                    </Box>
                  </TabPanel>
                )}

                {/* Test Cases Tab - Only for coding questions */}
                {editingQuestion.question.type === 'coding' && (
                  <TabPanel value={activeTab} index={2}>
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Test Cases</Typography>
                        <Button
                          startIcon={<AddIcon />}
                          onClick={handleAddTestCase}
                          variant="contained"
                          size="small"
                        >
                          Add Test Case
                        </Button>
                      </Box>
                      {validationErrors.testCases && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {validationErrors.testCases}
                        </Alert>
                      )}
                      {isJsonMode ? (
                        <TextField
                          fullWidth
                          multiline
                          rows={15}
                          value={JSON.stringify(editingQuestion.question.test_cases, null, 2)}
                          onChange={(e) => {
                            try {
                              const newTestCases = JSON.parse(e.target.value);
                              setEditingQuestion({
                                ...editingQuestion,
                                question: {
                                  ...editingQuestion.question,
                                  test_cases: newTestCases
                                }
                              });
                            } catch (error) {
                              // Invalid JSON - do nothing
                            }
                          }}
                        />
                      ) : (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>Input</TableCell>
                                <TableCell>Expected Output</TableCell>
                                <TableCell align="center">Default</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {editingQuestion.question.test_cases.map((testCase, idx) => (
                                <TableRow key={idx} selected={selectedTestCaseIndex === idx}>
                                  <TableCell>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      value={testCase.description}
                                      onChange={(e) => {
                                        const newTestCases = [...editingQuestion.question.test_cases];
                                        newTestCases[idx] = {
                                          ...testCase,
                                          description: e.target.value
                                        };
                                        setEditingQuestion({
                                          ...editingQuestion,
                                          question: {
                                            ...editingQuestion.question,
                                            test_cases: newTestCases
                                          }
                                        });
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      multiline
                                      value={typeof testCase.input === 'string' ? testCase.input : JSON.stringify(testCase.input, null, 2)}
                                      onChange={(e) => {
                                        const newTestCases = [...editingQuestion.question.test_cases];
                                        try {
                                          const parsedInput = JSON.parse(e.target.value);
                                          newTestCases[idx] = {
                                            ...testCase,
                                            input: parsedInput
                                          };
                                        } catch {
                                          newTestCases[idx] = {
                                            ...testCase,
                                            input: e.target.value
                                          };
                                        }
                                        setEditingQuestion({
                                          ...editingQuestion,
                                          question: {
                                            ...editingQuestion.question,
                                            test_cases: newTestCases
                                          }
                                        });
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      multiline
                                      value={typeof testCase.expected_output === 'string' ? testCase.expected_output : JSON.stringify(testCase.expected_output, null, 2)}
                                      onChange={(e) => {
                                        const newTestCases = [...editingQuestion.question.test_cases];
                                        try {
                                          const parsedOutput = JSON.parse(e.target.value);
                                          newTestCases[idx] = {
                                            ...testCase,
                                            expected_output: parsedOutput
                                          };
                                        } catch {
                                          newTestCases[idx] = {
                                            ...testCase,
                                            expected_output: e.target.value
                                          };
                                        }
                                        setEditingQuestion({
                                          ...editingQuestion,
                                          question: {
                                            ...editingQuestion.question,
                                            test_cases: newTestCases
                                          }
                                        });
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Checkbox
                                      checked={testCase.is_default}
                                      onChange={(e) => {
                                        const newTestCases = [...editingQuestion.question.test_cases];
                                        newTestCases[idx] = {
                                          ...testCase,
                                          is_default: e.target.checked
                                        };
                                        setEditingQuestion({
                                          ...editingQuestion,
                                          question: {
                                            ...editingQuestion.question,
                                            test_cases: newTestCases
                                          }
                                        });
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteTestCase(idx)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  </TabPanel>
                )}

                {/* Images Tab */}
                <TabPanel value={activeTab} index={editingQuestion.question.type === 'coding' ? 3 : 1}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                      <Typography variant="h6" gutterBottom>Question Images</Typography>
                      <Box mb={2}>
                        <input
                          accept="image/*"
                          type="file"
                          style={{ display: 'none' }}
                          id="question-image-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('question', file);
                          }}
                        />
                        <label htmlFor="question-image-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<ImageIcon />}
                          >
                            Upload Image
                          </Button>
                        </label>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {editingQuestion.question.images.question.map((img, idx) => (
                          <Box key={idx} sx={{ position: 'relative', width: '120px' }}>
                            <IconButton
                              size="small"
                              sx={{ position: 'absolute', right: 4, top: 4, bgcolor: 'background.paper' }}
                              onClick={() => {
                                const newImages = [...editingQuestion.question.images.question];
                                newImages.splice(idx, 1);
                                setEditingQuestion({
                                  ...editingQuestion,
                                  question: {
                                    ...editingQuestion.question,
                                    images: {
                                      ...editingQuestion.question.images,
                                      question: newImages
                                    }
                                  }
                                });
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <img src={img} alt="" style={{ width: '100%', display: 'block' }} />
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                      <Typography variant="h6" gutterBottom>Explanation Images</Typography>
                      <Box mb={2}>
                        <input
                          accept="image/*"
                          type="file"
                          style={{ display: 'none' }}
                          id="explanation-image-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('explanation', file);
                          }}
                        />
                        <label htmlFor="explanation-image-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<ImageIcon />}
                          >
                            Upload Image
                          </Button>
                        </label>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {editingQuestion.question.images.explanation.map((img, idx) => (
                          <Box key={idx} sx={{ position: 'relative', width: '120px' }}>
                            <IconButton
                              size="small"
                              sx={{ position: 'absolute', right: 4, top: 4, bgcolor: 'background.paper' }}
                              onClick={() => {
                                const newImages = [...editingQuestion.question.images.explanation];
                                newImages.splice(idx, 1);
                                setEditingQuestion({
                                  ...editingQuestion,
                                  question: {
                                    ...editingQuestion.question,
                                    images: {
                                      ...editingQuestion.question.images,
                                      explanation: newImages
                                    }
                                  }
                                });
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <img src={img} alt="" style={{ width: '100%', display: 'block' }} />
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </TabPanel>
              </Box>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          <Button 
            onClick={() => editingQuestion && handleEditQuestion(editingQuestion.index, editingQuestion.question)}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper, Typography } from '@mui/material';
import { QuestionTemplate } from '../types/questionTemplate';

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  template: QuestionTemplate;
  sampleData?: Record<string, string>;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onClose,
  template,
  sampleData = {
    TOPIC: 'Sample Topic',
    DIFFICULTY: 'Medium',
    OPTIONS: 'Option 1\nOption 2\nOption 3\nOption 4',
  }
}) => {
  const processTemplate = (template: string): string => {
    let processed = template;
    Object.entries(sampleData).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });
    return processed;
  };

  const renderContent = () => {
    const processedContent = processTemplate(template.template);
    
    if (template.type === 'mcq') {
      const options = sampleData.OPTIONS.split('\n');
      return (
        <>
          <Typography variant="body1" gutterBottom>
            {processedContent.split('[OPTIONS]')[0]}
          </Typography>
          {options.map((option, index) => (
            <Typography key={index} variant="body2" style={{ marginLeft: 20 }}>
              {String.fromCharCode(65 + index)}. {option}
            </Typography>
          ))}
        </>
      );
    }

    return <Typography variant="body1">{processedContent}</Typography>;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Template Preview</DialogTitle>
      <DialogContent>
        <Paper elevation={2} style={{ padding: 16, marginTop: 16 }}>
          {renderContent()}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

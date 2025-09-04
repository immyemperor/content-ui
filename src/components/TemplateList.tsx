import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Visibility';
import type { QuestionTemplate } from '@/types/questionTemplate';

interface TemplateListProps {
  templates: QuestionTemplate[];
  onEdit: (template: QuestionTemplate) => void;
  onDelete: (id: string) => void;
  onPreview: (template: QuestionTemplate) => void;
}

export const TemplateList = ({
  templates,
  onEdit,
  onDelete,
  onPreview
}: TemplateListProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Saved Templates
        </Typography>
        
        <List>
          {templates.map((template) => (
            <ListItem
              key={template.id}
              divider
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {template.name}
                    {template.isPublic && (
                      <Chip size="small" label="Public" color="primary" />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {template.type === 'mcq' ? 'Multiple Choice' : template.type.replace('_', ' ').toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {template.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Difficulty: {template.difficulty}
                    </Typography>
                    {template.tags && template.tags.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {template.tags.map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="preview"
                  onClick={() => onPreview(template)}
                  sx={{ mr: 1 }}
                >
                  <PreviewIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(template)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(template.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {templates.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No templates yet. Create your first template!
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

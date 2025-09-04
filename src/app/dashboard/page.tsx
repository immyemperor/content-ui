'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { contentService } from '@/services/api';
import type { Content, Template, Assessment } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    contents: 0,
    templates: 0,
    assessments: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [contents, templates, assessments] = await Promise.all([
          contentService.getContents(),
          contentService.getTemplates(),
          contentService.getAssessments(),
        ]);

        setStats({
          contents: contents.length,
          templates: templates.length,
          assessments: assessments.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            flex: 1,
            minWidth: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Content Items</Typography>
          <Typography variant="h3">{stats.contents}</Typography>
        </Paper>
        
        <Paper
          elevation={2}
          sx={{
            p: 3,
            flex: 1,
            minWidth: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Templates</Typography>
          <Typography variant="h3">{stats.templates}</Typography>
        </Paper>
        
        <Paper
          elevation={2}
          sx={{
            p: 3,
            flex: 1,
            minWidth: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Assessments</Typography>
          <Typography variant="h3">{stats.assessments}</Typography>
        </Paper>
      </Box>
    </div>
  );
}

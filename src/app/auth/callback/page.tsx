'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { completeLogin } from '@/lib/oidc';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate processing
    if (hasProcessed.current || isProcessing) return;

    // Check if we have the required parameters
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (!code) {
      setError('No authorization code received');
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    const handleCallback = async () => {
      hasProcessed.current = true;
      setIsProcessing(true);
      
      try {
        const user = await completeLogin();
        console.log('Login successful:', user);
        
        // Get the return URL from state or default to dashboard
        const returnUrl = (user.state as any)?.returnUrl || '/dashboard';
        router.push(returnUrl);
      } catch (error) {
        console.error('Callback error:', error);
        setError('Authentication failed. Please try again.');
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [router, searchParams, isProcessing]);

  if (error) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to login...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Completing sign in...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we complete your authentication.
        </Typography>
      </Box>
    </Container>
  );
}

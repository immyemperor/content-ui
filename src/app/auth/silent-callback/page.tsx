'use client';

import { useEffect } from 'react';
import { getUserManager } from '@/lib/oidc';

export default function SilentCallbackPage() {
  useEffect(() => {
    const handleSilentCallback = async () => {
      try {
        const userManager = getUserManager();
        if (userManager) {
          await userManager.signinSilentCallback();
        }
      } catch (error) {
        console.error('Silent callback error:', error);
      }
    };

    handleSilentCallback();
  }, []);

  return (
    <div>
      {/* This page is used for silent token renewal and should not be visible to users */}
    </div>
  );
}

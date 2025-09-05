'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [clientInfo, setClientInfo] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const info = {
        userAgent: navigator.userAgent,
        url: window.location.href,
        localStorage: typeof localStorage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        environment: {
          NEXT_PUBLIC_KEYCLOAK_ISSUER: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
          NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        },
        timestamp: new Date().toISOString(),
      };
      setClientInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Information</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <h2>Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Client Information:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(clientInfo, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Test Links:</h2>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/content">Content</a></li>
        </ul>
      </div>
    </div>
  );
}

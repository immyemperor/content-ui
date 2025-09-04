'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Welcome, {user?.username || 'User'}
          </div>
          <button
            onClick={() => {
              const { logout } = useAuth();
              logout();
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6 flex gap-4">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add New Content
          </button>
          <button
            onClick={() => router.push('/content/search-topic')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Search Topic
          </button>
        </div>

        <div className="grid gap-4">
          {content.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No content available. Click &quot;Add New Content&quot; to create your first piece of content.
            </p>
          ) : (
            content.map((item: any) => (
              <div key={item.id} className="border rounded-lg p-4">
                {/* Content items will be rendered here */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Show loading screen with logo and heartbeat effect while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-6">
          {/* Logo with heartbeat animation */}
          <div className="animate-heartbeat">
            <img
              src="/pesira-logo-nobg.png"
              alt="AgTech Certification"
              className="w-32 h-32 mx-auto drop-shadow-lg"
            />
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">AgTech Certification</h2>
            <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
          </div>

          {/* Subtle spinner */}
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto opacity-60"></div>
        </div>
      </div>
    );
  }

  // If no user, don't render children (will redirect)
  if (!user) {
    return null;
  }

  // If user exists, render children
  return <>{children}</>;
}
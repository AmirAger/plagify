"use client";

import { useState, useEffect } from 'react';

export default function DatabaseStatus() {
  const [status, setStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
    pgTime?: string;
    supabaseStatus?: string;
    error?: string;
  }>({
    loading: true
  });

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch('/api/test-db');
        const data = await response.json();
        
        setStatus({
          loading: false,
          success: data.success,
          message: data.message,
          pgTime: data.pgTime,
          supabaseStatus: data.supabaseStatus,
          error: data.error
        });
      } catch (error: any) {
        setStatus({
          loading: false,
          success: false,
          message: 'Failed to check database status',
          error: error.message
        });
      }
    };

    checkDatabaseStatus();
  }, []);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Database Status</h2>
        
        {status.loading ? (
          <div className="flex items-center justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
            <span className="ml-2">Checking database connection...</span>
          </div>
        ) : status.success ? (
          <div className="text-success">
            <p><strong>Status:</strong> Connected</p>
            <p><strong>PostgreSQL Time:</strong> {status.pgTime}</p>
            <p><strong>Supabase Status:</strong> {status.supabaseStatus}</p>
          </div>
        ) : (
          <div className="text-error">
            <p><strong>Status:</strong> Error</p>
            <p><strong>Message:</strong> {status.message}</p>
            <p><strong>Error:</strong> {status.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
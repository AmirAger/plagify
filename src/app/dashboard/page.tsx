"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DatabaseStatus from "@/components/DatabaseStatus";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Welcome, {session?.user?.name || session?.user?.email}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DatabaseStatus />
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="flex flex-col gap-2 mt-4">
              <a href="/api/setup-db" target="_blank" rel="noopener noreferrer"
                 className="btn btn-primary">
                Initialize Database Tables
              </a>
              <a href="/api/test-db" target="_blank" rel="noopener noreferrer"
                 className="btn btn-secondary">
                Test Database Connection
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
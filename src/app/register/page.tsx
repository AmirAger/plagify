"use client";

import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Register() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <RegisterForm />
      
      <div className="mt-6 text-center">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
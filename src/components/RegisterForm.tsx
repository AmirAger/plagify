"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setSuccess('Account created successfully! You can now log in.');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold mb-6">Create Account</h2>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mb-4">
            <span>{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="input input-bordered"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              className="input input-bordered"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-control">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
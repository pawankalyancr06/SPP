import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Play } from 'lucide-react';
import { register, login } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await register(formData);
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
      setError('');
      setSuccess(response.message);
      // Store verification URL if provided (dev mode)
      if (response.verificationUrl) {
        setVerificationUrl(response.verificationUrl);
      }
      // If auto-verified in dev mode, redirect to login after 2 seconds
      if (response.devMode) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      // Avoid leaking user existence info
      if (err.response?.status === 409) {
        setError('An account with this email already exists. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
      setSuccess('');
      setVerificationUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary pt-20 md:pt-24 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Play className="w-12 h-12 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-heading font-black gradient-text mb-2">
            Join SportifyPro
          </h1>
          <p className="text-neutral">Create your account to get started</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/20 border border-danger rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-success/20 border border-success rounded-xl text-success text-sm space-y-2">
            <p>{success}</p>
            {verificationUrl && (
              <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-neutral mb-2">Development Mode - Verification URL:</p>
                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-xs break-all hover:underline"
                >
                  {verificationUrl}
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral w-5 h-5" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral w-5 h-5" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral mb-2">I want to</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
            >
              <option value="user">Book Venues</option>
              <option value="owner">List My Venue</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full bg-gradient-primary text-secondary py-3 rounded-xl font-bold hover:shadow-glow disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:text-accent2 transition">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

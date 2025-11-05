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
      await register(formData);
      const response = await login({
        email: formData.email,
        password: formData.password,
      });
      authLogin(response.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary pt-24 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 md:p-12 max-w-md w-full"
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
          <div className="mb-6 p-4 bg-accent1/20 border border-accent1 rounded-xl text-accent1 text-sm">
            {error}
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

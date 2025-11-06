import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Play, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { login, resendVerification } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',  // Default to user role
  });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const response = await login(formData);
      authLogin(response.user);
      // Redirect based on user role
      if (response.user.role === 'owner') {
        navigate('/owner/dashboard');
      } else if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/venues');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response?.status === 403 && err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setError('Your email is not verified.');
      } else if (err.response?.status === 500 && /JWT secret/i.test(err.response?.data?.message || '')) {
        setError('Server configuration issue. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setInfo('');
    try {
      const res = await resendVerification(formData.email);
      setInfo(res.message || 'Verification email sent.');
    } catch (e) {
      setError('Could not resend verification email. Please try again.');
    } finally {
      setResending(false);
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
            Welcome Back
          </h1>
          <p className="text-neutral">Sign in to continue to SportifyPro</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/20 border border-danger rounded-xl text-danger text-sm">
            {error}
            {error.includes('not verified') && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || !formData.email}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-secondary text-xs font-bold disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" /> {resending ? 'Sending...' : 'Resend verification email'}
                </button>
                <span className="text-xs text-neutral">to {formData.email || 'your email'}</span>
              </div>
            )}
          </div>
        )}
        {info && (
          <div className="mb-6 p-4 bg-success/20 border border-success rounded-xl text-success text-sm">
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral hover:text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-neutral mb-2">I am a</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                  formData.role === 'user'
                    ? 'bg-gradient-primary text-secondary'
                    : 'glass text-neutral hover:text-primary'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'owner' })}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                  formData.role === 'owner'
                    ? 'bg-gradient-primary text-secondary'
                    : 'glass text-neutral hover:text-primary'
                }`}
              >
                Venue Owner
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full bg-gradient-primary text-secondary py-3 rounded-xl font-bold hover:shadow-glow disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:text-accent2 transition">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link. Please request a new one.');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/auth/verify-email?token=${token}&email=${email}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-secondary pt-20 md:pt-24 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 max-w-md w-full text-center"
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <Play className="w-12 h-12 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-heading font-black gradient-text">
            Email Verification
          </h1>
        </div>

        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {status === 'verifying' ? (
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          ) : status === 'success' ? (
            <CheckCircle className="w-12 h-12 text-success" />
          ) : (
            <XCircle className="w-12 h-12 text-danger" />
          )}
        </div>

        {/* Message */}
        <p className={`text-lg ${status === 'error' ? 'text-danger' : 'text-white'} mb-8`}>
          {message}
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate('/login')}
          className="btn-glow w-full bg-gradient-primary text-secondary py-3 rounded-xl font-bold hover:shadow-glow"
        >
          {status === 'success' ? 'Continue to Login' : 'Go to Login'}
        </button>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
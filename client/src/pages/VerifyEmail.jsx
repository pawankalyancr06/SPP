import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('pending'); // pending, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    axios
      .get(`${API_URL}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`)
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified! You can now log in.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 'Verification failed. The link may be invalid or expired.'
        );
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="glass rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-heading font-bold mb-4 gradient-text">Email Verification</h1>
        <p className={status === 'success' ? 'text-primary' : 'text-danger'}>{message}</p>
        {status === 'success' && (
          <Link to="/login" className="mt-6 inline-block btn-glow bg-gradient-primary text-secondary px-6 py-2 rounded-full font-bold hover:shadow-glow transition">
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import api, { fetchCurrentUser } from '../api/api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      // Dispatch a custom event to update navbar state across components immediately
      window.dispatchEvent(new Event('auth-change'));
      
      const userRes = await fetchCurrentUser();
      if (userRes.data.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4">
                <LogIn size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">Welcome Back</h3>
              <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-400 rounded-xl text-sm text-center">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-light dark:text-text-dark">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-light dark:text-text-dark">Password</label>
                  <button type="button" onClick={() => alert('Forgot password functionality is coming soon!')} className="text-sm font-medium text-primary hover:text-primary-dark focus:outline-none bg-transparent border-0 p-0">Forgot password?</button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/google`}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <img
                    src="https://img.icons8.com/color/16/000000/google-logo.png"
                    alt="Google logo"
                    className="mr-2 h-5 w-5"
                  />
                  Sign in with Google
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/50 px-8 py-4 border-t border-gray-100 dark:border-slate-700 text-center">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
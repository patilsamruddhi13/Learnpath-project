import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-20 dark:opacity-40 mb-8"></div>
        <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
          <Sparkles className="text-secondary" size={16} />
          <span className="text-sm font-medium text-text-light dark:text-text-dark">Your personalized career guide</span>
        </div>
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text-light dark:text-text-dark mb-6">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">LearnPath</span>
      </h1>

      <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto mb-10">
        A personalized learning platform for engineering graduates to discover the perfect career path, master required skills, and land dream roles.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
        >
          Get Personalized Recommendations
          <ArrowRight size={20} />
        </Link>

        {/* Only show Log In button when not authenticated */}
        {!isAuthenticated && (
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-text-light dark:text-text-dark bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-all"
        >
          Log In
        </Link>
      )}
      </div>
    </div>
  );
};

export default Home;

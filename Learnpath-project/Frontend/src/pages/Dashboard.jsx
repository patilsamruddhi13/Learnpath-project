import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, User, Rocket, BookOpen, ExternalLink, Edit, AlertTriangle, Loader2 } from 'lucide-react';
import { fetchCurrentUser, fetchRecommendation } from '../api/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [roadmapLoading, setRoadmapLoading] = useState(true);
  const [roadmapError, setRoadmapError] = useState('');

  useEffect(() => {
    fetchCurrentUser()
      .then((res) => setUserData(res.data))
      .finally(() => setUserLoading(false));
  }, []);

  useEffect(() => {
    fetchRecommendation()
      .then((res) => setRoadmap(res.data))
      .catch((err) => {
        const msg = err.response?.data?.message || 'Recommendation service is unavailable. Please ensure the ML service is running.';
        setRoadmapError(msg);
      })
      .finally(() => setRoadmapLoading(false));
  }, []);

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  // Guard: if profile not complete, redirect to setup
  if (userData && !userData.profileCompleted) {
    return (
      <div className="py-12 max-w-md mx-auto px-4 text-center">
        <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">Profile Incomplete</h2>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
          Please complete your profile to see your personalized dashboard.
        </p>
        <button onClick={() => navigate('/profile-setup')}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
          Complete Profile
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark flex items-center gap-3">
          <Target className="text-primary" size={32} />
          Career Recommendation Dashboard
        </h2>
        <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
          Track your progress and discover your learning path.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Profile Summary — always from API, never hardcoded */}
        <div className="md:col-span-4">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 h-full overflow-hidden transition-colors">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <User className="text-secondary" size={24} />
                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">My Profile</h3>
              </div>
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-text-muted-light dark:text-text-muted-dark">Year</span>
                  <span className="font-medium text-text-light dark:text-text-dark">{userData?.year || '—'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-text-muted-light dark:text-text-muted-dark">Branch</span>
                  <span className="font-medium text-text-light dark:text-text-dark">{userData?.branch || '—'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-text-muted-light dark:text-text-muted-dark">Goal</span>
                  <span className="font-medium text-text-light dark:text-text-dark capitalize">{userData?.goal || '—'}</span>
                </div>
              </div>
              <button onClick={() => navigate('/profile-setup')}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-primary border border-primary hover:bg-primary-50 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <Edit size={16} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation — from ML or error/loading state */}
        <div className="md:col-span-8">
          {roadmapLoading ? (
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl h-full flex items-center justify-center p-8 text-white">
              <Loader2 className="animate-spin mr-3" size={24} />
              <span className="font-medium">Loading your personalized roadmap...</span>
            </div>
          ) : roadmapError ? (
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-yellow-200 dark:border-yellow-800 h-full p-8 flex flex-col justify-center items-center text-center gap-4">
              <AlertTriangle className="text-yellow-500" size={40} />
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Recommendation Unavailable</h3>
              <p className="text-text-muted-light dark:text-text-muted-dark max-w-sm">{roadmapError}</p>
            </div>
          ) : roadmap ? (
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-sm h-full overflow-hidden text-white relative">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl" />
              <div className="p-8 h-full flex flex-col relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="text-white" size={28} />
                  <h3 className="text-2xl font-bold">{roadmap.title}</h3>
                </div>
                <p className="text-indigo-100 mb-6">{roadmap.description}</p>
                <div className="space-y-3 mt-auto">
                  {roadmap.steps && roadmap.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-white/90">
                        {/* Steps can have either "title" (placement/gate paths) or "name" (startup paths) */}
                        {step.title || step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Resources from ML roadmap steps */}
        {roadmap && !roadmapError && (
          <div className="md:col-span-12">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 transition-colors">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="text-green-500" size={24} />
                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">Learning Resources</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {roadmap.steps && roadmap.steps.flatMap((step) =>
                  (step.resources || []).map((res, i) => (
                    <a key={`${step.title || step.name}-${i}`}
                      href={res.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-transparent hover:border-gray-100 dark:hover:border-slate-600 transition-all group">
                      <div>
                        <p className="font-medium text-text-light dark:text-text-dark group-hover:text-primary text-sm">{res.name}</p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                          {step.title || step.name}
                          {res.rating && ` · ⭐ ${res.rating}`}
                        </p>
                      </div>
                      <ExternalLink size={16} className="text-text-muted-light dark:text-text-muted-dark group-hover:text-primary flex-shrink-0" />
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
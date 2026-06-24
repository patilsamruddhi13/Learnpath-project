import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AlertCircle, GraduationCap, Target, BookOpen } from 'lucide-react';
import { fetchCurrentUser } from '../api/api';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then((res) => {
        setUserData(res.data);
        if (!res.data.profileCompleted) {
          setShowModal(true);
        }
      })
      .catch(() => {
        // If unauthorized, api.js interceptor already redirects to /login
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-6">
        <User className="text-primary" size={32} />
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">My Profile</h2>
      </div>

      {userData && userData.profileCompleted && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-700">
            <span className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark">
              <BookOpen size={16} /> Academic Year
            </span>
            <span className="font-medium text-text-light dark:text-text-dark">{userData.year}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-700">
            <span className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark">
              <GraduationCap size={16} /> Branch
            </span>
            <span className="font-medium text-text-light dark:text-text-dark">{userData.branch}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark">
              <Target size={16} /> Career Goal
            </span>
            <span className="font-medium text-text-light dark:text-text-dark capitalize">{userData.goal}</span>
          </div>
          <button
            onClick={() => navigate('/profile-setup')}
            className="mt-4 px-4 py-2 text-sm text-primary border border-primary rounded-xl hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors">
            Edit Profile
          </button>
        </div>
      )}

      {/* Modal — only shown when profileCompleted is false */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-primary">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Complete Your Profile</h3>
              </div>
              <p className="text-text-muted-light dark:text-text-dark mb-8">
                To get personalized career guidance, please complete your profile. This helps us tailor the experience exactly to your needs.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setShowModal(false); navigate('/profile-setup'); }}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
                  Let's Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
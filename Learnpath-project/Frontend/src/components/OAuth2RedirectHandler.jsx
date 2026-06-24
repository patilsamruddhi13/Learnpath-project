import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchCurrentUser } from '../api/api';

function OAuth2RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL like http://localhost:3000/oauth2/redirect?token=xxxx
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      localStorage.setItem('accessToken', token);
      window.dispatchEvent(new Event('auth-change'));
      
      // Check profileCompleted before routing
      fetchCurrentUser()
        .then((res) => {
          if (res.data.profileCompleted) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/profile', { replace: true });
          }
        })
        .catch(() => {
          // Fallback if /api/user/me fails
          navigate('/profile', { replace: true });
        });
    } else {
      console.error("OAuth2 Login Failed", error);
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="font-medium">Logging you in, please wait...</span>
    </div>
  );
}

export default OAuth2RedirectHandler;
